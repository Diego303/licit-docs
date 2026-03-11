---
title: "Compliance"
description: "Supported regulatory frameworks: EU AI Act and OWASP Agentic Top 10."
order: 9
---

## Why Compliance in AI-Assisted Development

The use of AI agents in software development introduces specific regulatory risks:

- **Traceability**: Who wrote each line of code? A human or an AI?
- **Governance**: How are AI agents configured and controlled?
- **Transparency**: Is the use of AI properly documented?
- **Security**: Are there guardrails to prevent undesired behavior?
- **Accountability**: Is there human review before deploying AI-generated code?

licit evaluates these aspects against established regulatory frameworks.

---

## EU AI Act (Regulation EU 2024/1689)

### Scope

The EU AI Act is the first comprehensive regulatory framework for artificial intelligence. It entered into force in August 2024, with gradual enforcement until August 2027.

licit evaluates the articles relevant to **development teams using AI agents**:

### Evaluated Articles

| Article | Name | What licit evaluates |
|---|---|---|
| Art. 9 | Risk Management System | Existence of FRIA, documented risk analysis |
| Art. 10 | Data and Data Governance | Training data traceability and provenance |
| Art. 11 | Technical Documentation | Existence of Annex IV documentation |
| Art. 13 | Transparency | AI use disclosure, provenance tracking |
| Art. 14 | Human Oversight | Human review gates in CI/CD, guardrails |
| Art. 15 | Accuracy, Robustness, and Security | Testing, security tools, SARIF findings |
| Art. 17 | Quality Management System | Quality gates, auditing, documented processes |
| Art. 26 | Obligations of Deployers | Compliant use, monitoring, activity logging |
| Art. 27 | FRIA | Fundamental Rights Impact Assessment |

### FRIA — Fundamental Rights Impact Assessment

The FRIA (Fundamental Rights Impact Assessment) is mandatory for high-risk AI systems under Art. 27. licit generates an interactive FRIA in 5 steps:

1. **System description**: What it does, what it is used for, who the users are.
2. **Identification of affected rights**: Which fundamental rights could be impacted.
3. **Risk assessment**: Probability and impact of each risk.
4. **Mitigation measures**: What controls are implemented.
5. **Conclusions and recommendations**: Final assessment.

**Command:**
```bash
licit fria
```

### Annex IV — Technical Documentation

Annex IV defines the technical documentation required for AI systems. licit generates this documentation by auto-populating it from:

- Project metadata (`pyproject.toml`, `package.json`)
- CI/CD configuration
- AI agent configurations
- Testing frameworks
- Security tools

**Command:**
```bash
licit annex-iv --organization "My Company" --product "My Product"
```

---

## OWASP Agentic Top 10

### Scope

The OWASP Agentic Top 10 identifies the 10 main security risks in applications that use AI agents. licit evaluates the project's posture against each risk.

### Evaluated Risks

| ID | Risk | What licit evaluates |
|---|---|---|
| ASI-01 | Excessive Agency | Guardrails, protected files, blocked commands |
| ASI-02 | Uncontrolled Autonomy | Budget limits, dry-run, human approval |
| ASI-03 | Supply Chain Vulnerabilities | Security tools (Semgrep, Snyk, etc.) |
| ASI-04 | Improper Output Handling | Output validation, quality gates |
| ASI-05 | Insecure Communication | Connector configuration, data protection |
| ASI-06 | Insufficient Monitoring | Audit trail, logging, OpenTelemetry |
| ASI-07 | Identity and Access Mismanagement | Agent permissions, access scope |
| ASI-08 | Inadequate Sandboxing | Execution isolation, rollback capability |
| ASI-09 | Prompt Injection | Input validation, guardrail configuration |
| ASI-10 | Insufficient Logging | Structured logs, session traceability |

### Mapping to Evidence

Each OWASP risk maps to collectible evidence:

```
ASI-01 (Excessive Agency)
  ├── has_guardrails → Are guardrails configured?
  ├── guardrail_count → How many controls exist?
  └── has_human_review_gate → Is there human review?

ASI-02 (Uncontrolled Autonomy)
  ├── has_budget_limits → Are there budget limits?
  ├── has_dry_run → Does dry-run mode exist?
  └── has_rollback → Is there rollback capability?

ASI-06 (Insufficient Monitoring)
  ├── has_audit_trail → Is there an audit trail?
  ├── audit_entry_count → How many entries?
  └── has_otel → Is there OpenTelemetry instrumentation?
```

---

## How licit Evaluates Compliance

### Evaluation Process

```
1. Detect     → ProjectDetector analyzes the project
2. Collect    → EvidenceCollector gathers evidence
3. Evaluate   → Evaluators apply framework requirements
4. Classify   → Each requirement: compliant / partial / non-compliant / n/a
5. Report     → Report with evidence, gaps, and recommendations
```

### Evidence Sources

| Source | What it provides | Status |
|---|---|---|
| Git history | Code provenance, contributors, frequency | **Functional** (v0.2.0) |
| Session logs | AI agent session logs (Claude Code) | **Functional** (v0.2.0) |
| Agent configs | Guardrails, models used, code rules | **Functional** (v0.1.0) |
| CI/CD configs | Human review gates, security steps | **Functional** (v0.1.0) |
| Architect reports | Audit trail, execution quality | Phase 7 |
| SARIF files | Security findings (vulnerabilities) | Phase 7 |
| `.licit/` data | FRIA, Annex IV, changelog, provenance store | Partial (provenance functional) |

Provenance evidence (`licit trace`) directly feeds the transparency articles (Art. 13) and traceability (Art. 10) of the EU AI Act, as well as the monitoring controls (ASI-06, ASI-10) of the OWASP Agentic Top 10.

### Compliance Levels

| Status | Meaning | Required Action |
|---|---|---|
| `compliant` | Requirement fully met | None |
| `partial` | Requirement partially met | Improve evidence or controls |
| `non-compliant` | Requirement not met | Implement missing controls |
| `n/a` | Not applicable to the project | None |
| `not-evaluated` | Not yet evaluated | Run evaluation |

---

## Compliance Reports

### Available Formats

| Format | Recommended Use |
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
| **ISO/IEC 42001** | Planned (V1) | AI Management System |
| **SOC 2 AI** | Under consideration | AI-specific SOC 2 controls |
| **IEEE 7000** | Under consideration | Ethical system design |

The `frameworks/` architecture allows adding new frameworks by implementing an evaluator with the corresponding Protocol interface.
