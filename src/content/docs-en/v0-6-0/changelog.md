---
title: "Changelog"
description: "Agent config changelog system: watcher, semantic differ, classifier, and renderer."
order: 13
---

# Changelog system

System for monitoring changes in AI agent configuration files, with semantic diffing, severity classification, and Markdown/JSON rendering.

> **Status**: **Functional** since v0.3.0 (Phase 3 completed).

---

## Overview

The changelog system answers the question: **what changed in the AI agents' configuration?** It monitors files like `CLAUDE.md`, `.cursorrules`, `AGENTS.md`, and YAML/JSON configs through git history, producing semantic diffs with severity classification.

```bash
licit changelog
```

```markdown
# Agent Config Changelog

> 3 change(s) detected across 2 file(s): **1** major, **1** minor, **1** patch

## .architect/config.yaml

- **[MAJOR]** Changed: model from claude-sonnet-4 to claude-opus-4 (`a1b2c3d4`) — 2026-03-12
- **[PATCH]** Changed: budget.max_cost_usd from 5.0 to 10.0 (`a1b2c3d4`) — 2026-03-12

## CLAUDE.md

- **[MINOR]** Changed: section:Rules from 5 lines to 8 lines (+3/-0) (`e5f6g7h8`) — 2026-03-11
```

---

## Architecture

The system consists of 4 modules in `src/licit/changelog/`:

```
changelog/
├── watcher.py       # File monitoring via git history
├── differ.py        # Semantic diffing by file format
├── classifier.py    # Severity classification (MAJOR/MINOR/PATCH)
└── renderer.py      # Rendering to Markdown or JSON
```

### Pipeline

```
ConfigWatcher ──→ Semantic Differ ──→ Change Classifier ──→ Renderer
  (git log)       (YAML/JSON/MD)     (MAJOR/MINOR/PATCH)   (MD/JSON)
       │                │                     │                  │
  ConfigSnapshot[]   FieldDiff[]        ConfigChange[]      String output
```

---

## Config Watcher

`ConfigWatcher` monitors AI agent configuration files through git history.

### ConfigSnapshot

```python
@dataclass
class ConfigSnapshot:
    path: str          # Relative path of the file
    content: str       # File content at that commit
    commit_sha: str    # SHA hash of the commit
    timestamp: datetime # Commit date (timezone-aware)
    author: str        # Commit author
```

### Usage

```python
from licit.changelog.watcher import ConfigWatcher

watcher = ConfigWatcher(root_dir="/path/to/project", watch_patterns=["CLAUDE.md", "*.yaml"])

# Files that currently exist on disk
files = watcher.get_watched_files()

# Change history of all watched files
history = watcher.get_config_history()
# → {"CLAUDE.md": [ConfigSnapshot, ...], "config.yaml": [...]}

# History since a date
history = watcher.get_config_history(since="2026-01-01")
```

### Pattern resolution

`watch_patterns` are resolved in two ways:

| Type | Example | Resolution |
|---|---|---|
| Exact name | `CLAUDE.md` | Checks existence in git history (`git log --oneline -1`) |
| Glob | `.prompts/**/*.md` | Resolves with `Path.glob()` and filters existing files |

### Protections

- **Size guard**: `_MAX_CONTENT_BYTES = 1_048_576` (1 MB) on `git show`. Files larger than this are discarded with a log warning.
- **Timeouts**: 10s for existence checks, 30s for `git log`.
- **Deduplication**: A `seen: set[str]` prevents processing the same file twice when multiple patterns match it.
- **Deleted files**: If the file was deleted in a commit, it is recorded as empty content.

---

## Semantic Differ

`diff_configs()` produces semantic diffs according to the file format.

### FieldDiff

```python
@dataclass
class FieldDiff:
    field_path: str           # "model", "llm.provider", "section:Rules"
    old_value: str | None     # Previous value (None if addition)
    new_value: str | None     # New value (None if deletion)
    is_addition: bool = False # New field
    is_removal: bool = False  # Deleted field
```

### Supported formats

| Format | Extensions | Strategy |
|---|---|---|
| YAML | `.yaml`, `.yml` | Recursive dict key-value with `_diff_dicts()` |
| JSON | `.json` | Recursive dict key-value with `_diff_dicts()` |
| Markdown | `.md` | Sections by headings with `_parse_md_sections()` |
| Plain text | Others | Full content diff |

### YAML / JSON

Parses both versions, then recursive dictionary diff:

```python
diffs = diff_configs("model: gpt-4\ntemp: 0.7\n", "model: gpt-5\ntemp: 0.7\n", "config.yaml")
# → [FieldDiff(field_path="model", old_value="gpt-4", new_value="gpt-5")]
```

**Nested dicts** are recursed:

```python
diffs = diff_configs("llm:\n  model: gpt-4\n", "llm:\n  model: gpt-5\n", "config.yaml")
# → [FieldDiff(field_path="llm.model", old_value="gpt-4", new_value="gpt-5")]
```

**Non-dict roots** (lists, scalars) are wrapped as `{"(root)": data}` instead of being discarded.

**Parse errors** produce `FieldDiff(field_path="(parse-error)")` without crashing.

### Markdown

Parses ATX headings (`#`, `##`, `###`, etc.) and produces diffs by section:

```python
old = "# Rules\n\nOriginal rules\n"
new = "# Rules\n\nModified rules\n\n## New Section\n\nContent\n"
diffs = diff_configs(old, new, "CLAUDE.md")
# → [FieldDiff(field_path="section:Rules", ...), FieldDiff(field_path="section:New Section", ...)]
```

**Fenced code blocks**: `_parse_md_sections()` tracks ``` blocks to avoid interpreting headings inside code.

**No headings**: If the markdown has no headings, it falls back to a full content diff as `(content)`.

### Plain text

For files like `.cursorrules`:

```python
diffs = diff_configs("line1\nline2\n", "line1\nline3\n", ".cursorrules")
# → [FieldDiff(field_path="(content)", old_value="2 lines", new_value="2 lines (+1/-1)")]
```

---

## Change Classifier

`ChangeClassifier` assigns severity to each `FieldDiff` and produces `ConfigChange`.

### Severity rules

| Severity | Trigger | Examples |
|---|---|---|
| **MAJOR** | Field in `_MAJOR_FIELDS` | `model`, `llm.model`, `provider`, `backend` |
| **MINOR** | Field in `_MINOR_FIELDS` | `prompt`, `guardrails`, `tools`, `rules`, `blocked_commands` |
| **MAJOR** (escalation) | Deletion of MINOR field | Deleting `guardrails`, deleting `protected_files` |
| **MINOR** | Markdown section change | `section:Rules`, `section:Instructions` |
| **PATCH** | Everything else | Parameter tweaks, formatting, comments |

### Segment matching

`_field_matches()` compares the last N segments of the field against the pattern:

```python
_field_matches("llm.model", "model")       # True  — last segment = "model"
_field_matches("model", "model")            # True  — single segment matches
_field_matches("model_config", "model")     # False — "model_config" ≠ "model"
_field_matches("section:model", "model")    # False — "section:model" ≠ "model"
_field_matches("llm.model", "llm.model")    # True  — last 2 segments match
```

This prevents false positives where fields like `model_config` were incorrectly classified as MAJOR.

### Usage

```python
from licit.changelog.classifier import ChangeClassifier

classifier = ChangeClassifier()
changes = classifier.classify_changes(
    old_content="model: gpt-4\n",
    new_content="model: gpt-5\n",
    file_path="config.yaml",
    commit_sha="abc1234",
    timestamp=datetime(2026, 3, 10, tzinfo=UTC),
)
# → [ConfigChange(severity=MAJOR, description="Changed: model from gpt-4 to gpt-5", ...)]
```

---

## Changelog Renderer

`ChangelogRenderer` converts a list of `ConfigChange` into Markdown or JSON.

### Markdown

```python
from licit.changelog.renderer import ChangelogRenderer

renderer = ChangelogRenderer()
output = renderer.render(changes, fmt="markdown")
```

Output structure:
1. Header `# Agent Config Changelog`
2. Summary: `N change(s) across M file(s): X major, Y minor, Z patch`
3. Sections by file (sorted alphabetically)
4. Within each file: sorted by severity (MAJOR first), then descending timestamp
5. Footer with UTC generation timestamp

### JSON

```python
output = renderer.render(changes, fmt="json")
```

Produces:
```json
{
  "changes": [
    {
      "file_path": "config.yaml",
      "field_path": "model",
      "old_value": "gpt-4",
      "new_value": "gpt-5",
      "severity": "major",
      "description": "Changed: model from gpt-4 to gpt-5",
      "timestamp": "2026-03-10T00:00:00+00:00",
      "commit_sha": "abc1234"
    }
  ]
}
```

`ensure_ascii=False` for full Unicode support (ñ, ü, etc.).

---

## Configuration

```yaml
changelog:
  enabled: true
  watch_files:
    - CLAUDE.md
    - .cursorrules
    - .cursor/rules
    - AGENTS.md
    - .github/copilot-instructions.md
    - .github/agents/*.md
    - .architect/config.yaml
    - architect.yaml
  output_path: .licit/changelog.md
```

| Field | Type | Default | Description |
|---|---|---|---|
| `enabled` | bool | `true` | Enable monitoring |
| `watch_files` | list[str] | (8 patterns) | Files/globs to monitor |
| `output_path` | str | `.licit/changelog.md` | Path of the generated changelog |

---

## Integration with compliance

The agent configuration changelog directly feeds the `EvidenceBundle`:

| Bundle field | What changelog provides |
|---|---|
| `has_changelog` | `True` if a generated changelog exists |
| `changelog_entry_count` | Number of entries in the changelog |

These fields are evaluated by the compliance frameworks:

- **EU AI Act Art. 13** (Transparency): Record of changes in AI agent configuration
- **EU AI Act Art. 26** (Deployer obligations): Configuration monitoring
- **OWASP ASI-01** (Excessive Agency): Tracking changes in guardrails and permissions
- **OWASP ASI-06** (Insufficient Monitoring): Change trail as monitoring evidence

---

## Testing

93 tests cover the changelog system:

| Module | Tests | File |
|---|---|---|
| Watcher | 12 | `tests/test_changelog/test_watcher.py` |
| Differ | 19 | `tests/test_changelog/test_differ.py` |
| Classifier | 22 | `tests/test_changelog/test_classifier.py` |
| Renderer | 10 | `tests/test_changelog/test_renderer.py` |
| Integration | 3 | `tests/test_changelog/test_integration.py` |
| QA Edge Cases | 27 | `tests/test_changelog/test_qa_edge_cases.py` |
| **Total** | **93** | |

The tests include:
- Unit tests per module
- Edge cases (Unicode, empty files, timezone-aware timestamps, single-commit files, non-dict roots, fenced code blocks)
- Regression tests for 7 bugs found in QA
- CLI integration tests (with and without git repo)
- Full pipeline integration tests (markdown + JSON + empty)
