---
title: "Quick Start"
description: "Guide to get licit v1.0.0 running in your project in 5 minutes."
order: 2
---

# Quick Start

Guide to get licit running in your project in 5 minutes.

---

## 1. Install

```bash
pip install licit-ai-cli
```

> Requires Python 3.12+. If you have multiple versions: `python3.12 -m pip install licit-ai-cli`

Verify:
```bash
licit --version
# licit, version 1.0.0
```

---

## 2. Initialize

Navigate to your project directory and run:

```bash
cd my-project/
licit init
```

This:
- Automatically detects languages, frameworks, CI/CD, AI agents and security tools.
- Generates `.licit.yaml` with adapted configuration.
- Creates the `.licit/` directory for internal data.

```
Initialized licit in my-project
  Languages: python
  Frameworks: fastapi
  Agent configs: CLAUDE.md
  CI/CD: github-actions
  Config saved to .licit.yaml
```

If you only need a specific regulatory framework:
```bash
licit init --framework eu-ai-act     # EU AI Act only
licit init --framework owasp         # OWASP Agentic Top 10 only
```

---

## 3. View status

```bash
licit status
```

Shows a summary of:
- Detected project (name, languages, frameworks, git)
- Loaded configuration
- Enabled frameworks
- Available data sources
- Active connectors
- Found AI agent configurations

---

## 4. Connect data sources (optional)

If you use Architect or Vigil, connectors enrich compliance evidence:

```bash
licit connect architect    # Reads reports, audit logs and Architect config
# → architect data found at: .architect/reports
# → Connector 'architect' enabled.

licit connect vigil        # Reads SARIF findings from Vigil or other scanners
# → vigil data found
# → Connector 'vigil' enabled.
```

To disconnect:
```bash
licit connect architect --disable
```

> **Note**: `licit init` auto-detects and enables connectors if it finds `.architect/` or `.vigil.yaml` in your project.

---

## 5. Version the configuration

```bash
git add .licit.yaml
git commit -m "chore: initialize licit compliance tracking"
```

Add sensitive data to `.gitignore`:
```gitignore
.licit/provenance.jsonl
.licit/fria-data.json
.licit/.signing-key
```

---

## 5. Track code provenance

```bash
licit trace                      # Analyze full git history
licit trace --since 2026-01-01   # From a specific date
licit trace --stats              # Show statistics
licit trace --report             # Generate Markdown report
```

Example output:
```
  Analyzing git history for AI provenance...
  Analyzed 45 files across 52 records
  AI-generated: 18 files
  Human-written: 22 files
```

The `trace` command analyzes each commit with 6 heuristics (author, message, volume, co-authors, file patterns, time) and classifies each file as `ai`, `human` or `mixed`.

---

## 6. Generate agent config changelog

```bash
licit changelog                        # Markdown by default
licit changelog --format json          # JSON output
licit changelog --since 2026-01-01     # From a date
```

Example output:
```
# Agent Config Changelog

> 2 change(s) detected across 1 file(s): **1** major, **1** minor

## CLAUDE.md

- **[MAJOR]** Changed: model from gpt-4 to gpt-5 (`abc1234`) — 2026-03-10
- **[MINOR]** Changed: section:Rules from 5 lines to 8 lines (+3/-0) (`def5678`) — 2026-03-09

  Changelog saved to .licit/changelog.md
```

The command analyzes the git history of agent configuration files, detects semantic changes (not just line diffs) and classifies them by severity.

---

## 7. Complete impact assessment (FRIA)

```bash
licit fria                # Interactive 5-step questionnaire
licit fria --auto         # Non-interactive mode (CI/CD)
licit fria --update       # Update existing FRIA
```

licit auto-detects answers where possible (models used, guardrails, testing, etc.) and asks for confirmation. With `--auto`, it accepts all detected values and uses defaults for the rest, without requiring terminal input. Generates `.licit/fria-data.json` and `.licit/fria-report.md`.

---

## 8. Generate Annex IV technical documentation

```bash
licit annex-iv --organization "My Company" --product "My App"
```

Auto-generates technical documentation with 6 sections from project metadata. Includes recommendations for sections with missing evidence. Generates `.licit/annex-iv.md`.

---

## 9. Verify compliance

```bash
licit verify --framework eu-ai-act    # Evaluate EU AI Act
licit verify                          # Evaluate all enabled frameworks
```

Exit code 0 = compliant, 1 = non-compliant, 2 = partial. Ideal for CI/CD gates.

---

## 10. Generate compliance reports

```bash
licit report                              # Markdown report (default)
licit report --format json -o report.json # JSON
licit report --format html -o report.html # Self-contained HTML
```

The report includes an overall summary, table per framework, and detail per requirement with evidence and recommendations.

---

## 11. Identify gaps

```bash
licit gaps                           # All gaps
licit gaps --framework eu-ai-act     # EU AI Act only
```

Each gap includes description, actionable recommendation, suggested tools, and effort level.

---

## Generated structure

After `licit init`, your project will have:

```
my-project/
├── .licit.yaml          # Configuration (version control)
├── .licit/              # Internal data
│   ├── provenance.jsonl # Traceability (DO NOT version)
│   ├── changelog.md     # Config changelog
│   ├── fria-data.json   # FRIA data (DO NOT version)
│   ├── fria-report.md   # FRIA report
│   ├── annex-iv.md      # Annex IV documentation
│   └── reports/         # Generated reports
└── ... your code ...
```

---

## Quick command reference

| Command | What it does |
|---|---|
| `licit init` | Initializes licit in the project |
| `licit status` | Shows status and connected sources |
| `licit connect <name>` | Enables/disables a connector |
| `licit trace` | Tracks code provenance |
| `licit changelog` | Generates agent config changelog |
| `licit fria [--auto]` | Fundamental rights impact assessment |
| `licit annex-iv` | EU AI Act technical documentation |
| `licit report` | Unified compliance report |
| `licit gaps` | Identifies compliance gaps |
| `licit verify` | CI/CD gate (exit 0/1/2) |

Global options: `--version`, `--config PATH`, `--verbose`, `--help`

---

For more details, see the [full documentation](../introduction/).
