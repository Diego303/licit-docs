---
title: "CLI Guide"
description: "Complete reference for all commands and options of the command line interface."
order: 4
---

# CLI Guide

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
licit [opciones] <comando> [argumentos]

# As a Python module
python -m licit [opciones] <comando> [argumentos]
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
# licit, version 0.5.0

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
2. Generates `.licit.yaml` with configuration tailored to the project.
3. Creates the `.licit/` directory for internal data.
4. If it detects architect or vigil, automatically enables their connectors.

**Example:**
```bash
$ cd mi-proyecto-fastapi/
$ licit init

Initialized licit in mi-proyecto-fastapi
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
- AI agent configurations found

**Example:**
```bash
$ licit status

Project: mi-proyecto-fastapi
  Root: /home/user/mi-proyecto-fastapi
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
# Generates .licit/reports/provenance.md with detailed per-file table
```

**Heuristics used:**

| # | Heuristic | Weight | What it detects |
|---|---|---|---|
| H1 | Author pattern | 3.0 | AI author names (claude, copilot, cursor, bot, etc.) |
| H2 | Message pattern | 1.5 | Commit patterns (conventional commits, "implement", `[ai]`) |
| H3 | Bulk changes | 2.0 | Mass changes (>20 files + >500 lines) |
| H4 | Co-author | 3.0 | `Co-authored-by:` with AI keywords |
| H5 | File patterns | 1.0 | All files are test files |
| H6 | Time pattern | 0.5 | Commits between 1am-5am |

Only heuristics that produce a signal (score > 0) contribute to the weighted average.

---

### `licit changelog`

Generates a changelog of AI agent configuration changes with semantic diffing and severity classification.

> **Status**: **Functional** (Phase 3 completed).

```bash
licit changelog [--since DATE|TAG] [--format {markdown|json}]
```

**Options:**

| Option | Default | Description |
|---|---|---|
| `--since` | (all) | Changes since date or tag |
| `--format` | `markdown` | Output format: `markdown` or `json` |

**What it does:**
1. Runs `ConfigWatcher` to retrieve the git history of monitored files.
2. Applies `diff_configs()` (semantic differ) between consecutive versions of each file.
3. Classifies each change with `ChangeClassifier` (MAJOR/MINOR/PATCH).
4. Renders the changelog with `ChangelogRenderer` (Markdown or JSON).
5. Shows the output in the terminal and saves it to `output_path`.

**Monitored files (by default):**
- `CLAUDE.md`, `.cursorrules`, `.cursor/rules`
- `AGENTS.md`, `.github/copilot-instructions.md`, `.github/agents/*.md`
- `.architect/config.yaml`, `architect.yaml`

**Example:**
```bash
$ licit changelog

# Agent Config Changelog

> 3 change(s) detected across 2 file(s): **1** major, **1** minor, **1** patch

## .architect/config.yaml

- **[MAJOR]** Changed: model from claude-sonnet-4 to claude-opus-4 (`a1b2c3d4`) — 2026-03-12
- **[PATCH]** Changed: budget.max_cost_usd from 5.0 to 10.0 (`a1b2c3d4`) — 2026-03-12

## CLAUDE.md

- **[MINOR]** Changed: section:Rules from 5 lines to 8 lines (+3/-0) (`e5f6g7h8`) — 2026-03-11

  Changelog saved to .licit/changelog.md
```

**JSON example:**
```bash
$ licit changelog --format json --since 2026-03-01
# Generates JSON with "changes" array and saves to .licit/changelog.md
```

**Severity classification:**

| Severity | Trigger | Examples |
|---|---|---|
| **MAJOR** | Model/provider change, or deletion of a MINOR field | `model: gpt-4` → `gpt-5`, deleting `guardrails` |
| **MINOR** | Change to prompt, guardrails, tools, rules, Markdown sections | Editing `system_prompt`, adding `blocked_commands` |
| **PATCH** | Everything else | Parameter tuning, formatting |

**Supported diff formats:**

| Format | Extensions | Strategy |
|---|---|---|
| YAML | `.yaml`, `.yml` | Recursive key-value diff |
| JSON | `.json` | Recursive key-value diff |
| Markdown | `.md` | Section-based diff (headings) |
| Plain text | Other | Full content diff |

For detailed documentation of the changelog system, see [Changelog](../changelog/).

---

### `licit fria`

Completes the Fundamental Rights Impact Assessment (EU AI Act Article 27).

> **Status**: **Functional** (Phase 4 completed).

```bash
licit fria [--update]
```

**Options:**

| Option | Description |
|---|---|
| `--update` | Updates an existing FRIA instead of creating a new one |

**What it does:**
1. Detects the project and collects available evidence.
2. Runs an interactive 5-step questionnaire (16 questions).
3. Auto-detects answers where possible (8 fields: system_purpose, ai_technology, models_used, human_review, guardrails, security_scanning, testing, audit_trail).
4. Saves data to `.licit/fria-data.json` and generates a report at `.licit/fria-report.md`.

**5 questionnaire steps:**

| Step | Title | Questions |
|---|---|---|
| 1 | System Description | Purpose, AI technology, models, scope, human review |
| 2 | Fundamental Rights Identification | Personal data, employment, safety, discrimination |
| 3 | Impact Assessment | Risk level, maximum impact, detection speed |
| 4 | Mitigation Measures | Guardrails, scanning, testing, audit trail, additional measures |
| 5 | Monitoring & Review | Review frequency, responsible person, incident process |

**Auto-detection:** For fields marked with `auto_detect`, licit attempts to infer the answer from the project configuration. If successful, it shows the detected value and asks whether to accept it.

**Generated files:**
- `.licit/fria-data.json` — Raw assessment data (JSON, reusable with `--update`)
- `.licit/fria-report.md` — Human-readable Markdown FRIA report

**Example:**
```bash
$ licit fria

============================================================
  FUNDAMENTAL RIGHTS IMPACT ASSESSMENT (FRIA)
  EU AI Act -- Article 27
============================================================

──────────────────────────────────────────────────
  Step 1: System Description
──────────────────────────────────────────────────

  [1.1] What is the primary purpose of this AI system?
  -> Auto-detected: AI-assisted code development using claude-code
    Accept this value? [Y/n]:
```

---

### `licit annex-iv`

Generates the Annex IV Technical Documentation (EU AI Act).

> **Status**: **Functional** (Phase 4 completed).

```bash
licit annex-iv [--organization NOMBRE] [--product NOMBRE]
```

**Options:**

| Option | Description |
|---|---|
| `--organization` | Organization name (default: project name) |
| `--product` | Product name (default: project name) |

**What it does:**
1. Detects the project and collects all available evidence.
2. Auto-populates an Annex IV document with 6 sections from project metadata.
3. Generates recommendations for sections with missing evidence.
4. Writes the result to `.licit/annex-iv.md`.

**6 auto-generated sections:**

| Section | Content |
|---|---|
| 1. General Description | Purpose, AI components, languages, frameworks |
| 2. Development Process | Version control, AI provenance, agent configs |
| 3. Monitoring & Control | CI/CD, audit trail, changelog |
| 4. Risk Management | Guardrails, quality gates, budget, oversight, FRIA |
| 5. Testing & Validation | Test framework, security tools |
| 6. Changes & Lifecycle | Summary of tracking mechanisms |

**Example:**
```bash
$ licit annex-iv --organization "ACME Corp" --product "WebApp"

  Annex IV documentation saved to: .licit/annex-iv.md
```

**Generated file:**
- `.licit/annex-iv.md` — Complete technical documentation in Markdown

---

### `licit report`

Generates a unified compliance report.

> **Status**: **Functional** (Phase 6). Evaluates EU AI Act + OWASP Agentic Top 10. Supports Markdown, JSON, and HTML.

```bash
licit report [--framework {eu-ai-act|owasp|all}] [--format {markdown|json|html}] [--output PATH]
```

**Options:**

| Option | Default | Description |
|---|---|---|
| `--framework` | `all` | Framework to evaluate |
| `--format` | `markdown` | Output format |
| `-o`, `--output` | `.licit/reports/compliance-report.{ext}` | Output file path |

**Example:**
```bash
$ licit report --framework eu-ai-act

  Compliance Summary
  ─────────────────────────────────────────────
  Project: my-app
  Generated: 2026-03-15 12:00 UTC

  eu-ai-act (2024/1689)
    [##..................] 9.1%
    1 compliant | 4 partial | 6 non-compliant

  ─────────────────────────────────────────────
  Overall: [##..................] 9.1%
  1/11 controls compliant

  Report saved to: .licit/reports/compliance-report.md
```

**Output formats:**

| Format | Description |
|---|---|
| `markdown` | Summary tables + per-requirement detail with `[PASS]`/`[FAIL]`/`[PARTIAL]` icons |
| `json` | Structured JSON with `overall`, `frameworks[]`, `results[]` |
| `html` | Self-contained HTML (no external dependencies), color badges, responsive |

**Generated files:**
- `.licit/reports/compliance-report.md` (or `.json`/`.html` depending on `--format`)

---

### `licit gaps`

Identifies compliance gaps with actionable recommendations.

> **Status**: **Functional** (Phase 6). Shows gaps with suggested tools and effort level.

```bash
licit gaps [--framework {eu-ai-act|owasp|all}]
```

**Options:**

| Option | Default | Description |
|---|---|---|
| `--framework` | `all` | Framework to analyze |

**Example:**
```bash
$ licit gaps --framework eu-ai-act

  10 compliance gap(s) found:

  1. [X] [ART-27-1] Fundamental Rights Impact Assessment (FRIA)
     Missing: Before putting an AI system into use, deployers shall
     carry out an assessment of the impact on fundamental rights.
     -> Run: licit fria -- to complete the FRIA
     Tools: licit fria

  2. [!] [ART-12-1] Record Keeping — Automatic Logging
     Incomplete: AI systems shall be designed with capabilities enabling
     automatic recording of events (logs) over the lifetime.
     -> Enable structured audit trail (architect reports or manual logging)
     Tools: licit trace, architect (audit log)
```

Gaps are sorted by severity (`[X]` non-compliant before `[!]` partial) and each one includes a description, recommendation, and suggested tools.

---

### `licit verify`

Verifies compliance and returns an exit code for CI/CD.

> **Status**: **Functional** (Phases 4-5). Evaluates EU AI Act (11 articles) and OWASP Agentic Top 10 (10 risks).

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
| `trace` | 2 | **Functional** | Provenance traceability |
| `changelog` | 3 | **Functional** | Agent config changelog |
| `fria` | 4 | **Functional** | FRIA (EU AI Act Art. 27) |
| `annex-iv` | 4 | **Functional** | Annex IV technical documentation |
| `report` | 6 | **Functional** | Unified report (MD/JSON/HTML) |
| `gaps` | 6 | **Functional** | Gaps with recommendations |
| `verify` | 4-6 | **Functional (EU AI Act + OWASP)** | CI/CD gate |
