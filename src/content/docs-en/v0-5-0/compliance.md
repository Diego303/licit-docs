---
title: "Compliance"
description: "Supported regulatory frameworks: EU AI Act and OWASP Agentic Top 10."
order: 9
---

## Why Compliance in AI-Assisted Development

The use of AI agents in software development introduces specific regulatory risks:

- **Traceability**: Who wrote each line of code? A human or an AI?
- **Governance**: How are AI agents configured and controlled?
- **Transparency**: Is AI usage adequately documented?
- **Security**: Are there guardrails to prevent undesired behavior?
- **Accountability**: Is there human review before deploying AI-generated code?

licit evaluates these aspects against established regulatory frameworks.

---

## EU AI Act (Regulation EU 2024/1689)

### Scope

The EU AI Act is the first comprehensive regulatory framework for artificial intelligence. It entered into force in August 2024, with gradual application through August 2027.

licit evaluates the articles relevant to **development teams using AI agents**:

### Evaluated Articles

| Article | Name | What licit evaluates |
|---|---|---|
| Art. 9(1) | Risk management system | Guardrails, quality gates, budget limits, security scanning |
| Art. 10(1) | Data and data governance | Deployer perspective — document provider practices |
| Art. 12(1) | Record keeping — automatic logging | Git history, audit trail, provenance tracking, OTel |
| Art. 13(1) | Transparency | Annex IV, agent config changelog, requirements traceability |
| Art. 14(1) | Human oversight | Dry-run, human review gate, quality gates, budget limits |
| Art. 14(4)(a) | Oversight — understand capabilities | Same evidence as Art. 14(1) |
| Art. 14(4)(d) | Oversight — ability to intervene | Dry-run + rollback |
| Art. 26(1) | Deployer — compliant use | Agent configs present |
| Art. 26(5) | Deployer — monitoring | Same evidence as Art. 12(1) |
| Art. 27(1) | FRIA | FRIA document completed |
| Annex IV | Technical documentation | Annex IV document generated |

### Evaluator Scoring

Each article has a dedicated evaluation method with numerical scoring. The score is converted to status with `_score_to_status(score, compliant_at, partial_at)`:

| Article | Indicators (score) | Compliant at | Partial at |
|---|---|---|---|
| Art. 9 | Guardrails +1, quality gates +1, budget +1, scanning +1 | 3+ | 1+ |
| Art. 10 | Always PARTIAL (deployer does not train) | — | — |
| Art. 12 | Git +1, audit trail +2, provenance +1, OTel +1 | 3+ | 1+ |
| Art. 13 | Annex IV +2, changelog +1, traceability +1 | 2+ | 1+ |
| Art. 14 | Dry-run +1, review gate +2, quality gates +1, budget +1 | 3+ | 1+ |

The evaluator generates actionable recommendations with concrete licit commands (e.g.: "Run: licit trace -- to start tracking code provenance").

### FRIA — Fundamental Rights Impact Assessment

The FRIA (Fundamental Rights Impact Assessment) is mandatory for high-risk AI systems under Art. 27. licit generates an interactive FRIA in 5 steps with 16 questions and auto-detection of 8 fields:

1. **System Description** (5 questions): Purpose, AI technology, models, scope, human review.
2. **Fundamental Rights Identification** (4 questions): Personal data, employment, safety, discrimination.
3. **Impact Assessment** (3 questions): Risk level, maximum impact, detection speed.
4. **Mitigation Measures** (5 questions): Guardrails, scanning, testing, audit trail, additional measures.
5. **Monitoring & Review** (3 questions): Review frequency, responsible party, incident process.

**Auto-detection:** For fields like `system_purpose`, `guardrails`, `security_scanning`, `testing`, and `audit_trail`, licit infers the answer from the project's `ProjectContext` and `EvidenceBundle`.

**Command:**
```bash
licit fria            # New interactive questionnaire
licit fria --update   # Update existing FRIA
```

**Generated files:**
- `.licit/fria-data.json` — Raw data (JSON, reusable with `--update`)
- `.licit/fria-report.md` — Markdown report with Jinja2 template

### Annex IV — Technical Documentation

Annex IV defines the technical documentation required for AI systems. licit generates this documentation by auto-populating it from 27 template variables extracted from:

- Project metadata (`pyproject.toml`, `package.json`)
- CI/CD configuration
- AI agent configurations
- Testing frameworks and security tools
- Provenance data (% AI code)
- Evidence of guardrails, quality gates, budget limits, FRIA, audit trail

**6 auto-generated sections:**
1. General Description — Purpose, AI components, languages, frameworks
2. Development Process — Version control, provenance, agent configs
3. Monitoring & Control — CI/CD, audit trail, changelog
4. Risk Management — Guardrails, quality gates, budget, oversight, FRIA
5. Testing & Validation — Test framework, security scanning
6. Changes & Lifecycle — Tracking mechanisms

Each section without evidence generates an **actionable recommendation** (e.g.: "Run `licit trace` to begin tracking code provenance").

**Command:**
```bash
licit annex-iv --organization "My Company" --product "My Product"
```

---

## OWASP Agentic Top 10 (2025)

### Scope

The OWASP Top 10 for Agentic AI Security identifies the top 10 security risks in applications using AI agents. licit evaluates the project's posture against each risk with numerical scoring.

> **Status**: **Implemented** since v0.5.0. Run with `licit verify --framework owasp`.

### Evaluated Risks

| ID | Risk | What licit evaluates |
|---|---|---|
| ASI01 | Excessive Agency | Guardrails, quality gates, budget limits, agent configs |
| ASI02 | Prompt Injection | vigil scanning, guardrails, human review gate |
| ASI03 | Supply Chain Vulnerabilities | SCA tools (Snyk/Semgrep/CodeQL/Trivy), changelog, config versioning |
| ASI04 | Insufficient Logging & Monitoring | Git history, audit trail, provenance, OTel |
| ASI05 | Improper Output Handling | Human review gate, quality gates, test suite |
| ASI06 | Lack of Human Oversight | Human review gate, dry-run, quality gates, rollback |
| ASI07 | Insufficient Sandboxing | Guardrails (blocked commands, protected files), CI/CD, agent configs |
| ASI08 | Unbounded Resource Consumption | Budget limits, quality gates |
| ASI09 | Poor Error Handling | Test suite, CI/CD, rollback capability |
| ASI10 | Sensitive Data Exposure | Protected file guardrails, security scanning, agent scope |

### Evaluator Scoring

Each risk has a dedicated evaluation method with numerical scoring. The score is converted to status with `_score_to_status(score, compliant_at, partial_at)`:

| Risk | Indicators (score) | Compliant at | Partial at |
|---|---|---|---|
| ASI01 | Guardrails +1, quality gates +1, budget +1, agent configs +1 | 3+ | 1+ |
| ASI02 | vigil +2, guardrails +1, human review +1 | 3+ | 1+ |
| ASI03 | SCA tools +2, changelog +1, agent configs +1 | 3+ | 1+ |
| ASI04 | Git +1, audit trail +2, provenance +1, OTel +1 | 3+ | 1+ |
| ASI05 | Human review +2, quality gates +1, test suite +1 | 3+ | 1+ |
| ASI06 | Human review +2, dry-run +1, quality gates +1, rollback +1 | 3+ | 1+ |
| ASI07 | Guardrails +2, CI/CD +1, agent configs +1 | 3+ | 1+ |
| ASI08 | Budget limits +2, quality gates +1 | 2+ | 1+ |
| ASI09 | Test suite +1, CI/CD +1, rollback +1 | 2+ | 1+ |
| ASI10 | Guardrails +1, security scanning +2, agent configs +1 | 3+ | 1+ |

ASI08 and ASI09 use `compliant_at=2` because they have fewer available signals. The evaluator generates actionable recommendations with concrete tools (e.g.: "Add AI-specific security scanning: vigil detects prompt injection patterns").

**Design note**: The evaluator measures the *presence* of security tools, not their *findings*. A project with vigil installed but 50 critical findings gets the same score as one with 0 findings. Findings are relevant for the gap analyzer (Phase 6).

### Evidence Mapping

Each OWASP risk maps to collectible evidence from the `ProjectContext` and `EvidenceBundle`:

```
ASI01 (Excessive Agency)
  ├── ev.has_guardrails + ev.guardrail_count
  ├── ev.has_quality_gates + ev.quality_gate_count
  ├── ev.has_budget_limits
  └── ctx.agent_configs

ASI02 (Prompt Injection)
  ├── ctx.security.has_vigil (+2 — AI-specific scanning)
  ├── ev.has_guardrails
  └── ev.has_human_review_gate

ASI04 (Logging & Monitoring)
  ├── ctx.git_initialized + ctx.total_commits
  ├── ev.has_audit_trail + ev.audit_entry_count (+2)
  ├── ev.has_provenance + ev.provenance_stats
  └── ev.has_otel

ASI06 (Human Oversight)
  ├── ev.has_human_review_gate (+2 — critical control)
  ├── ev.has_dry_run
  ├── ev.has_quality_gates
  └── ev.has_rollback

ASI08 (Unbounded Resources)
  ├── ev.has_budget_limits (+2 — direct control)
  └── ev.has_quality_gates
```

**Command:**
```bash
licit verify --framework owasp   # Evaluate OWASP only
licit verify --framework all     # Evaluate EU AI Act + OWASP
```

---

## How licit Evaluates Compliance

### Evaluation Process

```
1. Detect    → ProjectDetector analyzes the project
2. Collect   → EvidenceCollector gathers evidence
3. Evaluate  → Evaluators apply framework requirements
4. Classify  → Each requirement: compliant / partial / non-compliant / n/a
5. Report    → Report with evidence, gaps, and recommendations
```

### Evidence Sources

| Source | What it provides | Status |
|---|---|---|
| Git history | Code provenance, contributors, frequency | **Functional** (v0.2.0) |
| Session logs | AI agent session logs (Claude Code) | **Functional** (v0.2.0) |
| Agent config changelog | Changes in agent configs with severity | **Functional** (v0.3.0) |
| Agent configs | Guardrails, models used, code rules | **Functional** (v0.1.0) |
| CI/CD configs | Human review gates, security steps | **Functional** (v0.1.0) |
| Architect reports | Audit trail, execution quality | Phase 7 |
| SARIF files | Security findings (vulnerabilities) | Phase 7 |
| `.licit/` data | FRIA, Annex IV, changelog, provenance store | **Functional** (v0.4.0+) |

Provenance evidence (`licit trace`) directly feeds the transparency (Art. 13) and traceability (Art. 10) articles of the EU AI Act. The agent config changelog (`licit changelog`) feeds the transparency (Art. 13) and deployer obligations (Art. 26) articles. Both feed the monitoring controls (ASI-06, ASI-10) of the OWASP Agentic Top 10.

### Compliance Levels

| Status | Meaning | Action required |
|---|---|---|
| `compliant` | Requirement fully met | None |
| `partial` | Requirement partially met | Improve evidence or controls |
| `non-compliant` | Requirement not met | Implement missing controls |
| `n/a` | Does not apply to the project | None |
| `not-evaluated` | Not yet evaluated | Run evaluation |

---

## Compliance Reports

### Available Formats

| Format | Recommended use |
|---|---|
| **Markdown** | Human review, PRs, documentation |
| **JSON** | Integration with other tools, dashboards |
| **HTML** | Presentation to stakeholders, audits |

### Report Structure

```markdown
# Compliance Report — My Project
Generated: 2026-03-10

## Summary
- EU AI Act: 72% compliant (13/18 controls)
- OWASP Agentic: 60% compliant (6/10 controls)

## EU AI Act
### Article 9 — Risk Management
Status: PARTIAL
Evidence: FRIA exists but incomplete
Recommendation: Complete FRIA sections 3-5

### Article 14 — Human Oversight
Status: COMPLIANT
Evidence: GitHub Actions requires approval for deployment
...

## Gaps
| Priority | Requirement | Gap | Effort |
|---|---|---|---|
| 1 | ART-9-1 | No risk assessment | Medium |
| 2 | ASI-01 | No guardrails | Low |
```

---

## CI/CD Gate

licit can act as a compliance gate in CI/CD pipelines:

```yaml
# .github/workflows/compliance.yml
name: Compliance Check
on: [push, pull_request]

jobs:
  compliance:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0   # Required for git analysis

      - uses: actions/setup-python@v5
        with:
          python-version: "3.12"

      - name: Install licit
        run: pip install licit-ai-cli

      - name: Run compliance check
        run: licit verify
        # Exit 0 = pass, Exit 1 = fail, Exit 2 = warnings
```

**Exit codes:**

| Code | Result | Pipeline |
|---|---|---|
| 0 | All critical requirements met | Pass |
| 1 | Some critical requirement not met | Fail |
| 2 | Some requirement partially met | Warning (configurable) |

---

## Future Frameworks (V1+)

licit is designed to support additional frameworks:

| Framework | Status | Description |
|---|---|---|
| **NIST AI RMF** | Planned (V1) | NIST Risk Management Framework |
| **ISO/IEC 42001** | Planned (V1) | AI management system |
| **SOC 2 AI** | Under consideration | AI-specific SOC 2 controls |
| **IEEE 7000** | Under consideration | Ethical system design |

The `frameworks/` architecture allows adding new frameworks by implementing an evaluator with the corresponding Protocol interface.
