---
title: "CLI Guide"
description: "Complete reference for all commands and options of the command-line interface."
order: 4
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
# licit, version 0.2.0

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
4. If it detects architect or vigil, it automatically enables their connectors.

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

> **Status**: **Functional** (Phase 2 completed).

```bash
licit trace [--since DATE|TAG] [--report] [--stats]
```

**Options:**

| Option | Description |
|---|---|
| `--since` | Analyzes commits from a date (YYYY-MM-DD) or git tag |
| `--report` | Generates a provenance report file in `.licit/reports/provenance.md` |
| `--stats` | Shows statistics in the terminal |

**What it does:**
1. Runs `GitAnalyzer` to analyze commits with 6 heuristics (author, message, volume, co-authors, file patterns, time).
2. Optionally reads agent session logs (Claude Code).
3. Classifies each file as `ai` (score >= 0.7), `mixed` (>= 0.5), or `human` (< 0.5).
4. Stores results in `.licit/provenance.jsonl` (append-only).
5. If `sign: true`, signs each record with HMAC-SHA256.

**Example:**
```bash
$ licit trace --since 2026-01-01 --stats

  Analyzing git history...
  Records: 45 files analyzed
  AI-generated: 18 (40.0%)
  Human-written: 22 (48.9%)
  Mixed: 5 (11.1%)

  AI tools detected: claude-code (15), cursor (3)
  Models detected: claude-sonnet-4 (12), claude-opus-4 (3), gpt-4o (3)

  Stored in .licit/provenance.jsonl
```

**Example with report:**
```bash
$ licit trace --report
# Generates .licit/reports/provenance.md with a detailed per-file table
```

**Heuristics used:**

| # | Heuristic | Weight | What it detects |
|---|---|---|---|
| H1 | Author pattern | 3.0 | AI author names (claude, copilot, cursor, bot, etc.) |
| H2 | Message pattern | 1.5 | Commit patterns (conventional commits, "implement", `[ai]`) |
| H3 | Bulk changes | 2.0 | Massive changes (>20 files + >500 lines) |
| H4 | Co-author | 3.0 | `Co-authored-by:` with AI keywords |
| H5 | File patterns | 1.0 | All modified files are test files |
| H6 | Time pattern | 0.5 | Commits between 1am-5am |

Only heuristics that produce a signal (score > 0) contribute to the weighted average.

---

### `licit changelog`

Generates a changelog of changes in AI agent configurations.

> **Status**: Registered in CLI. Functional from Phase 3.

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

> **Status**: Registered in CLI. Functional from Phase 4.

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

> **Status**: Registered in CLI. Functional from Phase 4.

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

> **Status**: Registered in CLI. Functional from Phase 6.

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

> **Status**: Registered in CLI. Functional from Phase 6.

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

> **Status**: Registered in CLI. Functional from Phase 6.

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
  # Pipeline fails if exit code != 0
```

---

## Command Summary Table

| Command | Phase | Status | Short Description |
|---|---|---|---|
| `init` | 1 | Functional | Initializes licit in the project |
| `status` | 1 | Functional | Shows status and connected sources |
| `connect` | 1 | Functional | Configures connectors |
| `trace` | 2 | **Functional** | Provenance traceability |
| `changelog` | 3 | Skeleton | Agent config changelog |
| `fria` | 4 | Skeleton | FRIA (EU AI Act Art. 27) |
| `annex-iv` | 4 | Skeleton | Annex IV technical documentation |
| `report` | 6 | Skeleton | Unified compliance report |
| `gaps` | 6 | Skeleton | Compliance gaps |
| `verify` | 6 | Skeleton | CI/CD gate |
