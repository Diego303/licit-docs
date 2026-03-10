---
title: "Quick Start"
description: "Guide to get licit up and running in your project in 5 minutes."
order: 2
---

Guide to get licit up and running in your project in 5 minutes.

---

## 1. Install

```bash
pip install licit-ai-cli
```

> Requires Python 3.12+. If you have multiple versions: `python3.12 -m pip install licit-ai-cli`

Verify:
```bash
licit --version
# licit, version 0.1.0
```

---

## 2. Initialize

Navigate to your project directory and run:

```bash
cd my-project/
licit init
```

This will:
- Automatically detect languages, frameworks, CI/CD, AI agents, and security tools.
- Generate `.licit.yaml` with the adapted configuration.
- Create the `.licit/` directory for internal data.

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

## 3. View Status

```bash
licit status
```

Displays a summary of:
- Detected project (name, languages, frameworks, git)
- Loaded configuration
- Enabled frameworks
- Available data sources
- Active connectors
- Detected AI agent configurations

---

## 4. Connect Data Sources (optional)

If you use Architect or Vigil:

```bash
licit connect architect    # Reads reports and audit logs from Architect
licit connect vigil        # Reads SARIF findings from Vigil
```

To disconnect:
```bash
licit connect architect --disable
```

---

## 5. Version the Configuration

```bash
git add .licit.yaml
git commit -m "chore: initialize licit compliance tracking"
```

Add sensitive data to `.gitignore`:
```gitignore
.licit/provenance.jsonl
.licit/fria-data.json
.licit/signing-key
```

---

## What's Next?

Once future phases of licit are completed, you will be able to:

```bash
# Track code provenance (AI vs human)
licit trace --stats

# Generate changelog of agent configs
licit changelog

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

## Generated Structure

After `licit init`, your project will have:

```
my-project/
├── .licit.yaml          # Configuration (version this)
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

## Quick Command Reference

| Command | What it does |
|---|---|
| `licit init` | Initializes licit in the project |
| `licit status` | Shows status and connected sources |
| `licit connect <name>` | Enables/disables a connector |
| `licit trace` | Tracks code provenance |
| `licit changelog` | Generates changelog of agent configs |
| `licit fria` | Fundamental rights impact assessment |
| `licit annex-iv` | EU AI Act technical documentation |
| `licit report` | Unified compliance report |
| `licit gaps` | Identifies compliance gaps |
| `licit verify` | CI/CD gate (exit 0/1/2) |

Global options: `--version`, `--config PATH`, `--verbose`, `--help`

---

For more detail, see the [full documentation](/licit-docs/en/docs/introduction/).
