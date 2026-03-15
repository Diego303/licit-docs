---
title: "FAQ"
description: "Frequently asked questions, troubleshooting, and glossary."
order: 13
---

## Installation and Setup

### What Python version do I need?

**Python 3.12 or higher**. licit uses `StrEnum` and other features that require 3.12+.

```bash
python3.12 --version
# If you don't have it:
# Ubuntu/Debian: sudo apt install python3.12
# macOS: brew install python@3.12
# Windows: download from python.org
```

### Error: "pip install" hangs

If you are on a system with multiple Python versions, make sure to use the correct pip:

```bash
# Incorrect (may use Python 3.10 or another version)
pip install licit-ai-cli

# Correct
python3.12 -m pip install licit-ai-cli
```

### Error: `ModuleNotFoundError: No module named 'licit'`

The installation did not complete correctly. Reinstall:

```bash
python3.12 -m pip install -e ".[dev]"
```

Verify that the entry point works:
```bash
python3.12 -m licit --version
```

---

## Configuration

### Where does the `.licit.yaml` file go?

In the root of your project, alongside `pyproject.toml` or `package.json`:

```
my-project/
├── .licit.yaml      ← here
├── pyproject.toml
├── src/
└── tests/
```

### Can I use a different name for the config file?

Yes, use the `--config` option:

```bash
licit --config my-config.yaml status
```

### What happens if `.licit.yaml` has syntax errors?

licit logs a warning and uses the default values. It does not fail with an error.

```bash
$ licit --verbose status
# Warning: Failed to parse .licit.yaml: ...
# Using default configuration
```

### Should I commit `.licit.yaml`?

**Yes**. It is the team's shared configuration. Commit `.licit.yaml`.

**Do not** commit `.licit/provenance.jsonl` or `.licit/fria-data.json` (sensitive data).

---

## Commands

### `licit fria` / `licit report` do not work

Some commands are **registered** in the CLI but their full implementation is part of future phases:

| Command | Phase | Current status |
|---|---|---|
| `trace` | 2 | **Functional** (v0.2.0) |
| `changelog` | 3 | **Functional** (v0.3.0) |
| `fria` | 4 | **Functional** (v0.4.0) |
| `annex-iv` | 4 | **Functional** (v0.4.0) |
| `verify` | 4-5 | **Functional** (v0.5.0 — EU AI Act + OWASP) |
| `report` | 6 | Skeleton |
| `gaps` | 6 | Skeleton |

The functional commands in v0.5.0 are: `init`, `status`, `connect`, `trace`, `changelog`, `fria`, `annex-iv`, `verify`.

### `licit init` does not detect my language/framework

`ProjectDetector` looks for specific files:

| Language | File searched |
|---|---|
| Python | `pyproject.toml`, `requirements.txt` |
| JavaScript | `package.json` |
| TypeScript | `tsconfig.json` |
| Go | `go.mod` |
| Rust | `Cargo.toml` |
| Java | `pom.xml`, `build.gradle` |

| Framework | How it is detected |
|---|---|
| FastAPI | `fastapi` in `pyproject.toml` dependencies |
| Flask | `flask` in `pyproject.toml` dependencies |
| Django | `django` in `pyproject.toml` dependencies |
| React | `react` in `package.json` dependencies |
| Next.js | `next` in `package.json` dependencies |
| Express | `express` in `package.json` dependencies |

If your language or framework is not supported, open an issue.

### `licit status` shows "not collected" for provenance

Run `licit trace` to analyze the git history and generate provenance data. After running trace, `licit status` will show provenance statistics.

```bash
licit trace --stats     # Analyze and show statistics
licit status            # Now shows provenance data
```

---

## Testing and Development

### Tests fail with structlog errors

Make sure that `tests/conftest.py` configures structlog correctly:

```python
import logging
import structlog

structlog.configure(
    wrapper_class=structlog.make_filtering_bound_logger(logging.CRITICAL),
    cache_logger_on_first_use=False,
)
```

The most common error is `ValueError: I/O operation on closed file` when Click's `CliRunner` closes stderr and structlog tries to write to it. The solution is to use `WriteLoggerFactory()` (not `PrintLoggerFactory(file=sys.stderr)`).

### mypy shows errors in future module imports

Imports from future phase modules (like `licit.reports.unified`) use `# type: ignore[import-not-found]`:

```python
from licit.reports.unified import (  # type: ignore[import-not-found]
    UnifiedReportGenerator,
)
```

The `type: ignore` comment must go on the `from` line, not on the imported name lines. If ruff reformats the import to multi-line, verify that the comment stays on the correct line.

> **Note**: Modules from Phases 2-5 (provenance, changelog, eu_ai_act, owasp_agentic) are already implemented and imported directly without `type: ignore`. Only `reports/` (Phase 6) uses lazy stubs.

### ruff reports UP042 on my enums

Use `StrEnum` instead of `(str, Enum)`:

```python
# ruff UP042 error:
class MyEnum(str, Enum):  # ← error
    VALUE = "value"

# Correct:
from enum import StrEnum
class MyEnum(StrEnum):    # ← correct
    VALUE = "value"
```

### How do I run a single test?

```bash
# By name
python3.12 -m pytest tests/test_cli.py::TestCLIHelp::test_help -q

# By pattern (keyword)
python3.12 -m pytest tests/ -q -k "test_init"

# By file
python3.12 -m pytest tests/test_core/test_project.py -q
```

---

## Compliance

### Does licit replace a lawyer/compliance consultant?

**No.** licit is an assistance tool that automates evidence collection and generates reports. Final compliance decisions should be reviewed by qualified professionals.

### Is the licit report sufficient for an EU AI Act audit?

The licit report is a **starting point**. It provides structured technical evidence that can complement compliance documentation. For a formal audit, you will need:

1. Legal review of the FRIA
2. Additional organizational documentation
3. Evidence of risk management processes
4. Team training records

### What if my project is not "high-risk" under the EU AI Act?

If your AI system does not fall into the high-risk category, many EU AI Act requirements do not apply. licit allows marking requirements as `n/a` (not applicable). However, it is good practice to comply with transparency (Art. 13) and human oversight (Art. 14) requirements regardless of the risk classification.

### Is the OWASP Agentic Top 10 mandatory?

It is not regulation; it is a security best practices framework. However, following the OWASP Agentic Top 10 recommendations significantly reduces security risks when using AI agents in development.

---

## Security

### Does licit send data to any server?

**No.** licit operates 100% locally. There is no telemetry, analytics, or communication with external servers.

### Can I use licit in an air-gapped environment?

Yes. licit does not require an internet connection to function. You only need to install the dependencies beforehand.

### Is it safe to commit generated reports?

The reports in `.licit/reports/` are generally safe to commit. They contain compliance evaluations, not sensitive data. However, review the content before pushing to a public repo.

The files you should **not** commit:
- `.licit/provenance.jsonl` — Contains contributor information
- `.licit/fria-data.json` — May contain sensitive FRIA data
- Signing keys (`.licit/signing-key`)

---

## Known Issues (v0.5.0)

| Issue | Status | Workaround |
|---|---|---|
| `report` and `gaps` commands show an error | Expected | They depend on Phase 6 (reports). Use `verify` for compliance checks |
| Does not detect Go/Rust/Java frameworks | Limitation | Detects the language but not specific frameworks |
| Provenance heuristics may produce false positives | Limitation | Adjust `confidence_threshold` in config |
| Session reader only supports Claude Code | Limitation | More readers in future phases |
| Pipe `\|` in organization name breaks Markdown table in Annex IV | Limitation | Avoid pipe characters in organization names |
| Only Markdown format for compliance reports | Expected | JSON/HTML in Phase 6 |
| Markdown differ only supports ATX headings (`#`) | Limitation | Setext headings (`===`/`---`) are not detected |
| FRIA `run_interactive()` requires a terminal | Limitation | Cannot run in batch mode; use `--update` with pre-generated data |

---

## Glossary

| Term | Definition |
|---|---|
| **Provenance** | Origin and authorship of code (human vs AI) |
| **FRIA** | Fundamental Rights Impact Assessment (Art. 27 EU AI Act) |
| **Annex IV** | Technical documentation required by the EU AI Act |
| **SARIF** | Static Analysis Results Interchange Format — standard format for security findings |
| **SBOM** | Software Bill of Materials — component inventory |
| **Guardrail** | Control that limits the behavior of an AI agent |
| **Human review gate** | Checkpoint that requires human approval |
| **Attestation** | Cryptographic verification of data integrity |
| **Compliance rate** | Percentage of met requirements vs total evaluable |
| **Gap** | Discrepancy between the current state and a compliance requirement |
