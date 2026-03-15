---
title: "Report Interpretation"
description: "How to read and act on compliance reports and gap analysis."
order: 10
---

# Report interpretation

## Available formats

```bash
licit report                              # Markdown (default)
licit report --format json -o report.json # Structured JSON
licit report --format html -o report.html # Self-contained HTML
```

All three formats contain the same information; only the presentation differs.

---

## Report structure

Every report has three levels:

```
1. Overall Summary    →  Aggregated statistics across all frameworks
2. Per-framework      →  Summary + detail for each evaluated framework
3. Per-requirement    →  Status, evidence, and recommendations per requirement
```

---

## 1. Overall summary

```
  Overall: [####................] 19.0%
  4/21 controls compliant
```

| Field | Meaning |
|---|---|
| Compliance rate | `compliant / (compliant + partial + non_compliant) * 100`. Does not include N/A or not-evaluated |
| Total controls | EU AI Act (11) + OWASP Agentic (10) = 21 controls |
| Compliant | Requirements with sufficient evidence |
| Partial | Partial evidence — improvements possible |
| Non-compliant | No evidence — action required |

### How to interpret the rate

| Range | Interpretation | Action |
|---|---|---|
| 80-100% | Solid compliance posture | Maintain and monitor |
| 50-79% | Partial compliance, manageable gaps | Close priority gaps with `licit gaps` |
| 20-49% | Weak compliance | Urgent remediation plan |
| 0-19% | Minimal compliance — typical of a freshly initialized project | Run `licit fria`, `licit annex-iv`, `licit trace` |

> **A new project without FRIA or Annex IV will start at ~5-20%.** This is normal. Each licit command you run increases the rate.

---

## 2. Per-framework section

### EU AI Act

```
  eu-ai-act (2024/1689)
    [##..................] 9.1%
    1 compliant | 4 partial | 6 non-compliant
```

The 11 evaluated articles cover **deployer** obligations (the entity using the AI system), not the provider (the entity that built it):

| Article | What it evaluates | How to raise the score |
|---|---|---|
| Art. 9 | Risk management | Configure guardrails in architect, add vigil/semgrep |
| Art. 10 | Data governance | Always PARTIAL (deployer does not train) — document provider practices |
| Art. 12 | Automatic logging | `licit trace` for provenance, enable audit trail |
| Art. 13 | Transparency | `licit annex-iv` + `licit changelog` |
| Art. 14 | Human oversight | Configure PR reviews, architect dry-run |
| Art. 26 | Deployer obligations | Have agent configs (CLAUDE.md, .cursorrules) |
| Art. 27 | FRIA | `licit fria` |
| Annex IV | Technical documentation | `licit annex-iv` |

### OWASP Agentic Top 10

```
  owasp-agentic (2025)
    [....................] 0.0%
    0 compliant | 5 partial | 5 non-compliant
```

The 10 risks evaluate the **security posture** for AI agents:

| Risk | What it evaluates | How to raise the score |
|---|---|---|
| ASI01 | Excessive permissions | Guardrails, quality gates, budget limits |
| ASI02 | Prompt injection | vigil scanning, input guardrails |
| ASI03 | Supply chain | Snyk/Semgrep/CodeQL, config changelog |
| ASI04 | Insufficient logging | `licit trace`, audit trail, OTel |
| ASI05 | Unvalidated output | Human review gates, quality gates, test suite |
| ASI06 | No human oversight | PR reviews, dry-run, rollback |
| ASI07 | Weak sandboxing | Guardrails, CI/CD isolation |
| ASI08 | Unbounded consumption | Budget limits in architect |
| ASI09 | Poor error handling | Test suite, CI/CD, rollback |
| ASI10 | Data exposure | Protected files, security scanning |

---

## 3. Per-requirement detail

Each requirement shows:

### In Markdown

```markdown
### [FAIL] ART-27-1: Fundamental Rights Impact Assessment (FRIA)

- **Status**: non-compliant
- **Reference**: Article 27(1)
- **Evidence**: No FRIA document found

**Recommendations:**
- Run: licit fria -- to complete the Fundamental Rights Impact Assessment
```

### In JSON

```json
{
  "id": "ART-27-1",
  "name": "Fundamental Rights Impact Assessment (FRIA)",
  "status": "non-compliant",
  "evidence": "No FRIA document found",
  "recommendations": [
    "Run: licit fria -- to complete the Fundamental Rights Impact Assessment"
  ]
}
```

### In HTML

Status with color badge: green (compliant), amber (partial), red (non-compliant), gray (n/a).

---

## Gap analysis

```bash
licit gaps
```

Gaps are a subset of the report: they only show `non-compliant` and `partial` requirements, sorted by severity.

### How to read a gap

```
  1. [X] [ART-27-1] Fundamental Rights Impact Assessment (FRIA)
     Missing: Before putting an AI system into use...
     -> Run: licit fria -- to complete the FRIA
     Tools: licit fria
```

| Element | Meaning |
|---|---|
| `[X]` | Non-compliant (high priority). `[!]` = partial |
| `[ART-27-1]` | Requirement ID |
| `Missing:` | No evidence. `Incomplete:` = partial evidence |
| `->` | Concrete recommendation |
| `Tools:` | Specific tools that help |

### Remediation strategy

1. **Address `[X]` (non-compliant) first** — these would cause `licit verify` to fail in CI/CD
2. **Within `[X]`, tackle "low" effort first** — quick wins
3. **Address `[!]` (partial) afterwards** — they improve the rate but do not block the pipeline

### Estimated effort

Each gap has an implicit effort by category:

| Effort | Typical time | Example |
|---|---|---|
| low | <1 hour | Run `licit trace`, `licit annex-iv`, `licit changelog` |
| medium | 1-4 hours | Complete `licit fria`, configure guardrails, add PR reviews |
| high | 1-3 days | Set up vigil/semgrep, implement sandboxing, configure budget limits |

---

## Report configuration

In `.licit.yaml`:

```yaml
reports:
  output_dir: .licit/reports        # Where reports are saved
  default_format: markdown          # Default format
  include_evidence: true            # Include Evidence field in each requirement
  include_recommendations: true     # Include recommendations
```

### Without evidence

With `include_evidence: false`, reports omit the evidence line. Useful for executive reports that only need the status.

### Without recommendations

With `include_recommendations: false`, recommendations are omitted. Useful if you already know them and only want the status snapshot.

---

## Comparing reports over time

Generate JSON reports periodically and compare:

```bash
# Week 1
licit report --format json -o report-w1.json

# Week 2
licit report --format json -o report-w2.json

# Compare manually
diff <(jq '.overall' report-w1.json) <(jq '.overall' report-w2.json)
```

Example improvement:

```diff
-  "compliance_rate": 4.8
+  "compliance_rate": 33.3
-  "non_compliant": 11
+  "non_compliant": 5
```

> In future versions, `licit diff` will automate this comparison.
