---
title: "Auditor Guide"
description: "Compliance verification, evidence, preparation for regulatory audit."
order: 12
---

# Guide for Auditors and Compliance Officers

## Who this guide is for

This guide is for **compliance officers**, **internal/external auditors**, and **legal teams** who need to:
- Verify that a development team complies with regulations when using AI
- Understand what evidence licit generates and how to interpret it
- Prepare documentation for regulatory audits
- Validate the integrity of compliance data

---

## What evidence licit generates

licit produces 6 types of documentary evidence:

| Evidence | File | Regulation covered | What it demonstrates |
|---|---|---|---|
| **Provenance** | `.licit/provenance.jsonl` | Art. 12, Art. 13 | Which code was written by AI vs. humans |
| **Config changelog** | `.licit/changelog.md` | Art. 13 | Change history of AI agent configurations |
| **FRIA** | `.licit/fria-report.md` | Art. 27 | Fundamental rights impact assessment |
| **Annex IV** | `.licit/annex-iv.md` | Annex IV | Technical documentation of the AI system |
| **Compliance report** | `.licit/reports/compliance-report.*` | Arts. 9-27 | Article-by-article assessment with evidence |
| **Gap analysis** | (terminal output) | All | Missing requirements with recommendations |

---

## How to verify compliance

### Step 1: Quick verification

```bash
cd project-to-audit
licit verify
```

The exit code indicates the overall status:
- **0**: The project meets all evaluated requirements
- **1**: There are non-compliant requirements (see detail)
- **2**: There are partially compliant requirements

### Step 2: Detailed report

```bash
licit report --format html -o audit.html
```

The HTML report includes:
- **Overall summary**: compliance rate, controls by status
- **Per-article assessment**: each requirement with status, concrete evidence, and recommendations
- **Two frameworks**: EU AI Act (11 articles) and OWASP Agentic Top 10 (10 risks)

### Step 3: Identify gaps

```bash
licit gaps
```

Lists each gap with:
- `[X]` = non-compliant (high priority)
- `[!]` = partially compliant
- Description of what's missing
- Specific recommendation on how to resolve it
- Suggested tools

---

## How to interpret results

### Compliance statuses

| Status | Meaning | Auditor action |
|---|---|---|
| **compliant** | Sufficient evidence of compliance | Document as compliant |
| **partial** | Partial evidence, improvements possible | Document with observations |
| **non-compliant** | No evidence of compliance | Document as a finding |
| **n/a** | Does not apply to the project context | Document justification |
| **not-evaluated** | No automatic evaluation available | Requires manual evaluation |

### Compliance rate

```
compliance_rate = compliant / (compliant + partial + non_compliant) * 100
```

Does not include `n/a` or `not-evaluated` in the denominator. A rate of 100% means all evaluated controls are compliant.

### Provenance evidence

The `evidence` field in each result shows what data supported the evaluation. Examples:

| Evidence | What it means |
|---|---|
| "Guardrails active: 10 rules" | The project has 10 guardrail rules configured in architect |
| "Git history: 50 commits" | licit has access to the full history |
| "Provenance tracking: 40% AI attribution" | 40% of the code was identified as AI-generated |
| "No FRIA document found" | The FRIA has not been completed |
| "FRIA completed: .licit/fria-data.json" | The FRIA exists and has data |

---

## EU AI Act — Evaluated articles

licit evaluates **deployer** obligations (the entity deploying the AI system), not the provider:

| Article | What licit verifies | Evidence sought |
|---|---|---|
| Art. 9 — Risk management | Are there guardrails, quality gates, budget limits, security scanning? | Architect, vigil, semgrep, snyk configs |
| Art. 10 — Data governance | Always PARTIAL — the deployer doesn't train models | Documentation note |
| Art. 12 — Automatic logging | Is there git history, audit trail, provenance, OTel? | `.licit/provenance.jsonl`, `.architect/reports/` |
| Art. 13 — Transparency | Is there Annex IV, changelog, traceability? | `.licit/annex-iv.md`, `.licit/changelog.md` |
| Art. 14 — Human oversight | Are there review gates, dry-run, quality gates? | CI/CD config, architect config |
| Art. 26 — Deployer obligations | Are there agent configs? Is it monitored? | CLAUDE.md, .cursorrules, etc. |
| Art. 27 — FRIA | Does the FRIA document exist? | `.licit/fria-data.json` |
| Annex IV — Technical docs | Does technical documentation exist? | `.licit/annex-iv.md` |

### How to improve an evaluation

To move an article from `non-compliant` to `compliant`:

| Article | licit command | What to do |
|---|---|---|
| Art. 27 (FRIA) | `licit fria` | Complete the interactive 5-step questionnaire |
| Annex IV | `licit annex-iv` | Run — it is automatically generated from project metadata |
| Art. 12 (Logging) | `licit trace` | Run provenance analysis |
| Art. 13 (Transparency) | `licit changelog` | Generate agent config changelog |

---

## Integrity validation

### Signed provenance

If the project has signing enabled (`provenance.sign: true` in `.licit.yaml`), each provenance record has an HMAC-SHA256 signature. licit automatically verifies signatures when loading data.

The signing key is in `.licit/.signing-key` and **must not be versioned** in git.

### Deduplicated data

The provenance store (`.licit/provenance.jsonl`) uses merge + deduplication:
- Each `licit trace` run merges new results with existing ones
- For a given file, the most recent record prevails (latest wins)
- The store contains one record per unique file — it doesn't grow with repeated runs

### Manual verification

To verify that provenance data is consistent with git:

```bash
# View provenance stats
licit trace --stats

# Compare with actual git log
git shortlog -sn HEAD

# Generate detailed report
licit trace --report
```

---

## Preparing for regulatory audit

### Documents to collect

1. **`.licit.yaml`** — Project configuration (which frameworks are enabled, what is monitored)
2. **`.licit/fria-report.md`** — Complete FRIA (Art. 27)
3. **`.licit/annex-iv.md`** — Technical documentation (Annex IV)
4. **`.licit/reports/compliance-report.html`** — Most recent compliance report
5. **`.licit/changelog.md`** — Agent config change history
6. **`.licit/provenance.jsonl`** — Raw traceability data (for verification)

### Pre-audit workflow

```bash
# 1. Update all evidence
licit trace
licit changelog

# 2. Generate regulatory documentation (if it doesn't exist)
licit annex-iv
# licit fria  # Only if not completed (interactive)

# 3. Generate final report
licit report --format html -o audit-$(date +%Y%m%d).html

# 4. Review pending gaps
licit gaps
```

### What licit does NOT generate

licit **does not** replace:
- Manual risk assessments by legal experts
- Official certifications from regulatory bodies
- External audits by accredited third parties
- Data protection impact assessments (DPIA under GDPR)

licit **does** provide:
- Automated evidence that supports manual assessments
- Structured documentation ready to present to regulators
- Continuous monitoring of compliance posture

---

## Frequently asked auditor questions

### How accurate is AI code detection?

Provenance uses 6 heuristics with a weighted average. Confidence varies:
- **95%** if there is a Co-authored-by with an AI agent name (direct evidence)
- **60-80%** if based on commit patterns (heuristic)
- **95%** if Claude Code session logs are read (direct evidence)

The configurable threshold (`confidence_threshold: 0.6`) determines what counts as AI.

### Are reports tamper-proof?

The `.md`, `.html`, and `.json` files are flat files and can be edited. For tamper-resistant evidence:
1. Enable signing (`provenance.sign: true`)
2. Version reports in git (git history is its own integrity chain)
3. Generate reports in CI/CD (the pipeline log is additional evidence)

### How often should I generate reports?

| Scenario | Recommended frequency |
|---|---|
| Active development with AI | Each sprint / each PR (via CI/CD) |
| Release preparation | Before each release |
| Regulatory audit | At the start of the audit + final update |
| Continuous monitoring | Weekly (via cron in CI/CD) |
