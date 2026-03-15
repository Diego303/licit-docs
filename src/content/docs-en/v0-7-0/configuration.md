---
title: "Configuration"
description: "Configuration guide for .licit.yaml with all fields and available options."
order: 4
---

# Configuration Guide

## Configuration File

licit uses a YAML file called `.licit.yaml` in the project root. It is automatically generated with `licit init` but can be edited manually.

### Configuration Resolution

When licit loads the configuration, it follows this priority order:

1. **Explicit path**: `licit --config /path/to/config.yaml <command>`
2. **File in current directory**: `.licit.yaml` in the cwd
3. **Defaults**: If no file exists, uses default values

If the file exists but has YAML syntax or validation errors, licit logs a warning and uses the defaults.

---

## Full Example

```yaml
# .licit.yaml — licit configuration
# All fields are optional. Default values are shown.

provenance:
  enabled: true
  methods:
    - git-infer          # Methods: git-infer, session-log, git-ai
  session_dirs: []       # Directories with agent session logs
  sign: false            # Sign records with HMAC-SHA256
  sign_key_path: null    # Path to signing key
  confidence_threshold: 0.6  # Minimum threshold to classify as AI
  store_path: .licit/provenance.jsonl

changelog:
  enabled: true
  watch_files:           # Agent config files to monitor
    - CLAUDE.md
    - .cursorrules
    - .cursor/rules
    - AGENTS.md
    - .github/copilot-instructions.md
    - .github/agents/*.md
    - .architect/config.yaml
    - architect.yaml
  output_path: .licit/changelog.md

frameworks:
  eu_ai_act: true        # Enable EU AI Act evaluation
  owasp_agentic: true    # Enable OWASP Agentic Top 10 evaluation
  nist_ai_rmf: false     # Future (V1)
  iso_42001: false       # Future (V1)

connectors:
  architect:
    enabled: false
    reports_dir: .architect/reports
    audit_log: null
    config_path: null
  vigil:
    enabled: false
    sarif_path: null
    sbom_path: null

fria:
  output_path: .licit/fria-report.md
  data_path: .licit/fria-data.json
  organization: ""
  system_name: ""
  system_description: ""

annex_iv:
  output_path: .licit/annex-iv.md
  organization: ""
  product_name: ""
  product_version: ""

reports:
  output_dir: .licit/reports
  default_format: markdown   # markdown, json, html
  include_evidence: true
  include_recommendations: true
```

---

## Detailed Sections

### provenance — Code Traceability

Controls how licit tracks code origin (AI vs human).

| Field | Type | Default | Description |
|---|---|---|---|
| `enabled` | bool | `true` | Enable traceability |
| `methods` | list[str] | `["git-infer"]` | Detection methods |
| `session_dirs` | list[str] | `[]` | Dirs with session logs |
| `sign` | bool | `false` | Sign records with HMAC |
| `sign_key_path` | str? | `null` | Path to signing key |
| `confidence_threshold` | float | `0.6` | Confidence threshold (0.0-1.0) |
| `store_path` | str | `.licit/provenance.jsonl` | Path to provenance store |

**Available methods:**

- `git-infer`: **(Implemented)** Analyzes git history heuristics with 6 signals: author pattern, commit message, change volume, co-authors, file patterns, and time.
- `session-log`: **(Implemented)** Reads AI agent session logs. Currently supports Claude Code (JSONL files in `~/.claude/projects/`). Extensible via the `SessionReader` Protocol.
- `git-ai`: Reads annotations from git-ai type tools (planned).

**Example — Enable signing:**
```yaml
provenance:
  sign: true
  sign_key_path: ~/.licit/signing-key
```

**Example — Multiple methods:**
```yaml
provenance:
  methods:
    - git-infer
    - session-log
  session_dirs:
    - ~/.claude/projects/
```

### changelog — Agent Config Monitoring

> **Status**: **Functional** since v0.3.0. Run with `licit changelog`.

Tracks changes in AI agent configuration files through git history, producing semantic diffs with severity classification (MAJOR/MINOR/PATCH).

| Field | Type | Default | Description |
|---|---|---|---|
| `enabled` | bool | `true` | Enable monitoring |
| `watch_files` | list[str] | (see example) | Files/globs to monitor |
| `output_path` | str | `.licit/changelog.md` | Path of the generated changelog |

**Default monitored files:**

| File | Agent |
|---|---|
| `CLAUDE.md` | Claude Code |
| `.cursorrules` | Cursor |
| `.cursor/rules` | Cursor (new format) |
| `AGENTS.md` | GitHub Agents |
| `.github/copilot-instructions.md` | GitHub Copilot |
| `.github/agents/*.md` | GitHub Agents (individual configs) |
| `.architect/config.yaml` | Architect |
| `architect.yaml` | Architect (alternative) |

Patterns with `*` are resolved using `Path.glob()`. Exact names check for existence in git history.

**Processing pipeline:**
```
ConfigWatcher → Semantic Differ → ChangeClassifier → ChangelogRenderer
  (git log)     (YAML/JSON/MD)   (MAJOR/MINOR/PATCH)   (MD/JSON)
```

**Diff formats:** YAML and JSON produce field-level diffs (`model`, `llm.provider`). Markdown produces section-based diffs (`section:Rules`). Plain text produces a full content diff.

**Output formats:** `markdown` (default) groups by file and sorts by severity. `json` produces a `{"changes": [...]}` object.

**Example — Add a custom file:**
```yaml
changelog:
  watch_files:
    - CLAUDE.md
    - .cursorrules
    - my-custom-agent.yaml       # additional file
    - .prompts/**/*.md             # recursive glob
```

**Example — JSON output:**
```bash
licit changelog --format json --since 2026-01-01
```

For detailed documentation, see [Changelog System](../changelog/).

### frameworks — Regulatory Frameworks

Controls which regulatory frameworks are evaluated.

| Field | Type | Default | Description |
|---|---|---|---|
| `eu_ai_act` | bool | `true` | EU AI Act (Regulation EU 2024/1689) |
| `owasp_agentic` | bool | `true` | OWASP Agentic Top 10 |
| `nist_ai_rmf` | bool | `false` | NIST AI Risk Management Framework (future) |
| `iso_42001` | bool | `false` | ISO/IEC 42001 (future) |

**Example — EU AI Act only:**
```yaml
frameworks:
  eu_ai_act: true
  owasp_agentic: false
```

### connectors — External Integrations

> **Status**: **Functional** since v0.7.0. Connectors are formal: they implement the `Connector` Protocol, handle errors gracefully, and report results via `ConnectorResult`.

Connectors are **optional** — licit works fully without them. When enabled, they enrich the `EvidenceBundle` with additional data that improves the compliance evaluation.

**Auto-detection**: `licit init` automatically detects the presence of architect (`.architect/`) and vigil (`.vigil.yaml`) and enables the corresponding connectors.

**Inline fallback**: When no config (`LicitConfig`) is available, `EvidenceCollector` builds temporary connectors with auto-detected paths. This guarantees backwards compatibility.

#### connectors.architect

Integration with Architect to read audit reports, audit logs, and guardrail configuration.

| Field | Type | Default | Description |
|---|---|---|---|
| `enabled` | bool | `false` | Enable connector (auto-enabled if `.architect/` detected) |
| `reports_dir` | str | `.architect/reports` | JSON reports directory |
| `audit_log` | str? | `null` | Path to the JSONL audit log |
| `config_path` | str? | `null` | Path to the architect YAML config |

**Data sources it reads:**

| Source | Format | Extracted Evidence |
|---|---|---|
| Reports | JSON (`reports_dir/*.json`) | Audit trail (`has_audit_trail`, `audit_entry_count`) |
| Audit log | JSONL (`audit_log`) | Audit trail (additional entries to the count) |
| Config | YAML (`config_path`) | Guardrails, quality gates, budget, dry-run, rollback |

**Config YAML fields extracted:**

```yaml
# .architect/config.yaml
guardrails:
  protected_files: [.env, secrets.yaml]    # → guardrail_count += N
  blocked_commands: [rm -rf]               # → guardrail_count += N
  code_rules: [no-eval]                    # → guardrail_count += N
  quality_gates: [lint, test]              # → has_quality_gates, quality_gate_count
costs:
  budget_usd: 50.0                         # → has_budget_limits
dry_run: true                              # → has_dry_run (default True if absent)
rollback: true                             # → has_rollback (default True if absent)
```

**Full example:**
```yaml
connectors:
  architect:
    enabled: true
    reports_dir: .architect/reports
    config_path: .architect/config.yaml
    audit_log: .architect/audit.jsonl
```

#### connectors.vigil

Integration with Vigil and other security scanners that produce SARIF 2.1.0.

| Field | Type | Default | Description |
|---|---|---|---|
| `enabled` | bool | `false` | Enable connector (auto-enabled if `.vigil.yaml` detected) |
| `sarif_path` | str? | `null` | SARIF file or directory with `*.sarif` |
| `sbom_path` | str? | `null` | Path to CycloneDX SBOM (JSON) |

**SARIF path resolution:**

1. Explicit `sarif_path`: if it's a file, reads it; if it's a directory, reads all `*.sarif` files.
2. Auto-detected: `.sarif` files found by `ProjectDetector` in the project.
3. Deduplication: if the same file appears in both sources, it is read only once.

**SARIF severity mapping:**

| SARIF Level | licit Classification |
|---|---|
| `error` | `security_findings_critical` |
| `warning` | `security_findings_high` |
| `note` | (counted in total, not in critical/high) |
| other | (counted in total) |

> **Note**: **All** runs in the SARIF are parsed, regardless of the tool name (vigil, Semgrep, CodeQL, etc.).

**Full example:**
```yaml
connectors:
  vigil:
    enabled: true
    sarif_path: reports/security/    # Directory with .sarif files
    sbom_path: sbom.json             # CycloneDX SBOM (V1: will feed OWASP ASI03)
```

### fria — Fundamental Rights Impact Assessment

Configuration for the FRIA (EU AI Act Article 27).

| Field | Type | Default | Description |
|---|---|---|---|
| `output_path` | str | `.licit/fria-report.md` | Report path |
| `data_path` | str | `.licit/fria-data.json` | Raw data path |
| `organization` | str | `""` | Organization name |
| `system_name` | str | `""` | System name |
| `system_description` | str | `""` | System description |

### annex_iv — Annex IV Technical Documentation

| Field | Type | Default | Description |
|---|---|---|---|
| `output_path` | str | `.licit/annex-iv.md` | Document path |
| `organization` | str | `""` | Organization name |
| `product_name` | str | `""` | Product name |
| `product_version` | str | `""` | Product version |

### reports — Report Generation

| Field | Type | Default | Description |
|---|---|---|---|
| `output_dir` | str | `.licit/reports` | Output directory |
| `default_format` | str | `markdown` | Format: markdown, json, html |
| `include_evidence` | bool | `true` | Include evidence in reports |
| `include_recommendations` | bool | `true` | Include recommendations |

---

## Data Directory (.licit/)

licit stores all its internal data in the `.licit/` directory within the project root.

```
.licit/
├── .signing-key        # HMAC-SHA256 key (auto-generated if sign=true)
├── provenance.jsonl    # Traceability store (JSONL append-only)
├── changelog.md        # Agent config changelog
├── fria-data.json      # Raw FRIA data
├── fria-report.md      # Human-readable FRIA report
├── annex-iv.md         # Annex IV technical documentation
└── reports/            # Generated reports
    ├── provenance.md          # Provenance report
    ├── compliance-report.md
    ├── compliance-report.json
    └── compliance-report.html
```

**Recommended `.gitignore`:**
```gitignore
# licit — internal data (may contain sensitive information)
.licit/provenance.jsonl
.licit/fria-data.json

# licit — generated reports (commit if desired)
# .licit/reports/
```

It is recommended to commit `.licit.yaml` and the generated reports, but **not** the provenance store or raw FRIA data, as they may contain sensitive team information.

---

## Programmatic Usage

The configuration can be loaded and manipulated from Python:

```python
from licit.config.loader import load_config, save_config

# Load
config = load_config()  # Automatically looks for .licit.yaml
config = load_config("/explicit/path/.licit.yaml")

# Modify
config.frameworks.owasp_agentic = False
config.connectors.architect.enabled = True

# Save
save_config(config)  # Saves to .licit.yaml
save_config(config, "/another/path/config.yaml")
```
