---
title: "Quick Start"
description: "Guide to install and set up licit in your project in 5 minutes."
order: 2
---

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
# licit, version 0.3.0
```

---

## 2. Initialize

Navigate to your project directory and run:

```bash
cd my-project/
licit init
```

This:
- Automatically detects languages, frameworks, CI/CD, AI agents, and security tools.
- Generates `.licit.yaml` with the adapted configuration.
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

Displays a summary of:
- Detected project (name, languages, frameworks, git)
- Loaded configuration
- Enabled frameworks
- Available data sources
- Active connectors
- AI agent configurations found

---

## 4. Connect data sources (optional)

If you use Architect or Vigil:

```bash
licit connect architect    # Read reports and audit logs from Architect
licit connect vigil        # Read SARIF findings from Vigil
```

To disconnect:
```bash
licit connect architect --disable
```

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

## 6. Track code provenance

```bash
licit trace                      # Analyze full git history
licit trace --since 2026-01-01   # From a specific date
licit trace --stats              # Show statistics
licit trace --report             # Generate Markdown report
```

Example output:
```
  Analyzing git history...
  Records: 45 files analyzed
  AI-generated: 18 (40.0%)
  Human-written: 22 (48.9%)
  Mixed: 5 (11.1%)

  Stored in .licit/provenance.jsonl
```

The `trace` command analyzes each commit with 6 heuristics (author, message, volume, co-authors, file patterns, time) and classifies each file as `ai`, `human`, or `mixed`.

---

## 7. Generate agent config changelog

```bash
licit changelog                        # Markdown by default
licit changelog --format json          # JSON output
licit changelog --since 2026-01-01     # From a specific date
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

The command analyzes the git history of agent configuration files, detects semantic changes (not just line diffs), and classifies them by severity.

---

## What's next?

Once future phases of licit are completed, you will be able to:

```bash
# Complete impact assessment (FRIA)
licit fria

# Generate Annex IV technical documentation
licit annex-iv --organization "My Company" --product "My App"

# View compliance report
licit report

# Identify gaps
licit gaps

# CI/CD gate (exit code 0 = pass)
licit verify
```

---

## Generated structure

After `licit init`, your project will have:

```
my-project/
├── .licit.yaml          # Configuration (version control)
├── .licit/              # Internal data
│   ├── provenance.jsonl # Traceability (DO NOT version control)
│   ├── changelog.md     # Config changelog
│   ├── fria-data.json   # FRIA data (DO NOT version control)
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
| `licit fria` | Fundamental rights impact assessment |
| `licit annex-iv` | EU AI Act technical documentation |
| `licit report` | Unified compliance report |
| `licit gaps` | Identifies compliance gaps |
| `licit verify` | CI/CD gate (exit 0/1/2) |

Global options: `--version`, `--config PATH`, `--verbose`, `--help`

---

For more details, see the [full documentation](/licit-docs/en/docs/introduction/).
