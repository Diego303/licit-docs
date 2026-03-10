---
title: "CLI Guide"
description: "Complete reference for all licit CLI commands and options."
order: 3
---

## Installation

```bash
pip install licit-ai-cli
```

Or from source:

```bash
git clone https://github.com/Diego303/licit-cli.git
cd licit-cli
pip install -e ".[dev]"
```

## Invocation

```bash
# As an installed command
licit [options] <command> [arguments]

# As a Python module
python -m licit [options] <command> [arguments]
```

## Global Options

| Option | Description |
|---|---|
| `--version` | Shows the licit version |
| `--config PATH` | Path to a specific `.licit.yaml` file |
| `-v`, `--verbose` | Enables detailed logging (DEBUG level) |
| `--help` | Shows help |

```bash
licit --version
# licit, version 0.1.0

licit --verbose status
# Shows debug logs during execution
```

---

## Commands

### `licit init`

Initializes licit in the current project. Automatically detects project characteristics and generates the configuration.

```bash
licit init [--framework {eu-ai-act|owasp|all}]
```

**Options:**

| Option | Default | Description |
|---|---|---|
| `--framework` | `all` | Regulatory framework to enable |

**What it does:**
1. Runs `ProjectDetector` to detect languages, frameworks, CI/CD, AI agents, etc.
2. Generates `.licit.yaml` with configuration adapted to the project.
3. Creates the `.licit/` directory for internal data.
4. If architect or vigil is detected, automatically enables their connectors.

**Example:**
```bash
$ cd my-fastapi-project/
$ licit init

Initialized licit in my-fastapi-project
  Languages: python
  Frameworks: fastapi
  Agent configs: CLAUDE.md
  CI/CD: github-actions
  Config saved to .licit.yaml
```

**Example with specific framework:**
```bash
$ licit init --framework eu-ai-act
# Only enables EU AI Act, disables OWASP
```

---

### `licit status`

Shows the current status of licit and connected data sources.

```bash
licit status
```

**What it shows:**
- Project information (name, languages, frameworks)
- Configuration status
- Enabled frameworks (EU AI Act, OWASP)
- Detected data sources (provenance, FRIA, changelog, etc.)
- Configured connectors (architect, vigil)
- Detected AI agent configurations

**Example:**
```bash
$ licit status

Project: my-fastapi-project
  Root: /home/user/my-fastapi-project
  Languages: python
  Frameworks: fastapi
  Git: 142 commits, 3 contributors

Config: .licit.yaml (loaded)

Frameworks:
  EU AI Act: enabled
  OWASP Agentic: enabled

Data sources:
  Provenance: not collected
  FRIA: not found
  Annex IV: not found
  Changelog: not found

Connectors:
  architect: disabled
  vigil: disabled

Agent configs:
  CLAUDE.md (claude-code)
  .cursorrules (cursor)
```

---

### `licit connect`

Configures optional connectors to integrate external data sources.

```bash
licit connect {architect|vigil} [--enable|--disable]
```

**Arguments:**

| Argument | Description |
|---|---|
| `architect` | Connector for Architect (reports and audit logs) |
| `vigil` | Connector for Vigil (SARIF security findings) |

**Options:**

| Option | Default | Description |
|---|---|---|
| `--enable` | (default) | Enables the connector |
| `--disable` | | Disables the connector |

**Example:**
```bash
$ licit connect architect
# Enables the architect connector

$ licit connect vigil --enable
# Enables the vigil connector

$ licit connect architect --disable
# Disables the architect connector
```

---

### `licit trace`

Tracks code provenance — identifies what was written by AI and what by humans.

> **Status**: Registered in CLI. Functional starting from Phase 2.

```bash
licit trace [--since DATE|TAG] [--report] [--stats]
```

**Options:**

| Option | Description |
|---|---|
| `--since` | Analyzes commits since a date (YYYY-MM-DD) or git tag |
| `--report` | Generates a provenance report file |
| `--stats` | Shows statistics in the terminal |

**Future example:**
```bash
$ licit trace --since 2026-01-01 --stats

Provenance Analysis (since 2026-01-01):
  Total files analyzed: 87
  AI-authored: 34 (39.1%)
  Human-authored: 41 (47.1%)
  Mixed: 12 (13.8%)
  Confidence: 0.82 avg
```

---

### `licit changelog`

Generates a changelog of changes in AI agent configurations.

> **Status**: Registered in CLI. Functional starting from Phase 3.

```bash
licit changelog [--since DATE|TAG] [--format {markdown|json}]
```

**Options:**

| Option | Default | Description |
|---|---|---|
| `--since` | (all) | Changes since date or tag |
| `--format` | `markdown` | Output format |

**Monitored files:**
- `CLAUDE.md`
- `.cursorrules`, `.cursor/rules`
- `AGENTS.md`
- `.github/copilot-instructions.md`
- `.github/agents/*.md`
- `.architect/config.yaml`, `architect.yaml`

---

### `licit fria`

Completes the Fundamental Rights Impact Assessment (EU AI Act Article 27).

> **Status**: Registered in CLI. Functional starting from Phase 4.

```bash
licit fria [--update]
```

**Options:**

| Option | Description |
|---|---|
| `--update` | Updates an existing FRIA instead of creating a new one |

**Generated files:**
- `.licit/fria-data.json` — Raw assessment data
- `.licit/fria-report.md` — Human-readable FRIA report

---

### `licit annex-iv`

Generates the Annex IV Technical Documentation (EU AI Act).

> **Status**: Registered in CLI. Functional starting from Phase 4.

```bash
licit annex-iv [--organization NAME] [--product NAME]
```

**Options:**

| Option | Description |
|---|---|
| `--organization` | Organization name |
| `--product` | Product name |

**Generated file:**
- `.licit/annex-iv.md`

---

### `licit report`

Generates a unified compliance report.

> **Status**: Registered in CLI. Functional starting from Phase 6.

```bash
licit report [--framework {eu-ai-act|owasp|all}] [--format {markdown|json|html}] [--output PATH]
```

**Options:**

| Option | Default | Description |
|---|---|---|
| `--framework` | `all` | Framework to evaluate |
| `--format` | `markdown` | Output format |
| `-o`, `--output` | `.licit/reports/compliance-report.{ext}` | Output file path |

---

### `licit gaps`

Identifies compliance gaps with actionable recommendations.

> **Status**: Registered in CLI. Functional starting from Phase 6.

```bash
licit gaps [--framework {eu-ai-act|owasp|all}]
```

**Options:**

| Option | Default | Description |
|---|---|---|
| `--framework` | `all` | Framework to analyze |

**Future example:**
```bash
$ licit gaps --framework eu-ai-act

EU AI Act Compliance Gaps:

[HIGH] ART-9-1: Risk Management System
  Gap: No FRIA document found
  Action: Run 'licit fria' to complete the assessment
  Effort: medium

[MEDIUM] ART-13-1: Transparency
  Gap: No provenance tracking configured
  Action: Run 'licit trace' to analyze code provenance
  Effort: low
```

---

### `licit verify`

Verifies compliance and returns an exit code for CI/CD.

> **Status**: Registered in CLI. Functional starting from Phase 6.

```bash
licit verify [--framework {eu-ai-act|owasp|all}]
```

**Exit codes:**

| Code | Meaning |
|---|---|
| `0` | COMPLIANT — All critical requirements met |
| `1` | NON_COMPLIANT — Some critical requirement not met |
| `2` | PARTIAL — Some requirement partially met |

**Usage in CI/CD (GitHub Actions):**
```yaml
- name: Compliance check
  run: licit verify
  # The pipeline fails if exit code != 0
```

---

## Command Summary Table

| Command | Phase | Status | Short Description |
|---|---|---|---|
| `init` | 1 | Functional | Initializes licit in the project |
| `status` | 1 | Functional | Shows status and connected sources |
| `connect` | 1 | Functional | Configures connectors |
| `trace` | 2 | Skeleton | Provenance traceability |
| `changelog` | 3 | Skeleton | Agent config changelog |
| `fria` | 4 | Skeleton | FRIA (EU AI Act Art. 27) |
| `annex-iv` | 4 | Skeleton | Annex IV technical documentation |
| `report` | 6 | Skeleton | Unified compliance report |
| `gaps` | 6 | Skeleton | Compliance gaps |
| `verify` | 6 | Skeleton | CI/CD gate |
