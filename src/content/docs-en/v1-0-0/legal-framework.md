---
title: "Legal Framework"
description: "Legal context of the EU AI Act, OWASP, NIST, ISO with official text references."
order: 9
---

# Legal and regulatory framework

Legal context of the regulatory frameworks that licit evaluates, with references to official texts.

---

## EU AI Act — Regulation (EU) 2024/1689

### Context

The European Union's Artificial Intelligence Regulation is the world's first comprehensive AI regulation. It establishes harmonized rules for the development, marketing, and use of AI systems in the European market.

### Application timeline

| Date | Milestone |
|---|---|
| August 2024 | Entry into force |
| February 2025 | AI practice prohibitions (Title II) |
| August 2025 | General-purpose AI model (GPAI) obligations |
| August 2026 | Majority of obligations, including high-risk systems |
| August 2027 | Full application |

### Scope for AI development teams

licit focuses on **deployer** obligations (Art. 26-27) and on **transparency** and **technical documentation** requirements that apply to teams using AI agents to generate code.

**Is your team in scope?** Yes, if:
- You use AI agents (Claude Code, Cursor, Copilot, etc.) to generate code
- The software produced is deployed in the EU or affects EU citizens
- Your AI system falls under any Annex III category (high risk)

### Articles evaluated by licit

#### Art. 9 — Risk management system

> *"High-risk AI systems shall be subject to a risk management system [...] consisting of a continuous iterative process."*

**What licit evaluates**: Presence of guardrails, quality gates, budget limits, and security scanning tools.

#### Art. 10 — Data and data governance

> *"Training, validation, and testing data sets shall be subject to appropriate data governance and management practices."*

**What licit evaluates**: Deployer perspective — documents that the model provider manages training data.

#### Art. 12 — Record keeping

> *"High-risk AI systems shall be designed and developed with capabilities enabling the automatic recording of events (logs)."*

**What licit evaluates**: Git history, audit trail (architect), provenance tracking, OpenTelemetry.

#### Art. 13 — Transparency

> *"High-risk AI systems shall be designed and developed in such a way that their operation is sufficiently transparent."*

**What licit evaluates**: Generated Annex IV documentation, agent config changelog, requirements traceability.

#### Art. 14 — Human oversight

> *"High-risk AI systems shall be designed and developed in such a way that they can be effectively overseen by natural persons."*

**What licit evaluates**: Human review gates, dry-run, quality gates, rollback, budget limits.

#### Art. 26 — Deployer obligations

> *"Deployers shall use high-risk AI systems in accordance with the instructions of use."*

**What licit evaluates**: Presence of agent configurations, operations monitoring.

#### Art. 27 — Fundamental rights impact assessment

> *"Before putting a high-risk AI system into service, deployers shall carry out an assessment of the impact on fundamental rights."*

**What licit generates**: Complete FRIA with an interactive 5-step questionnaire, 16 questions, auto-detection of 8 fields.

#### Annex IV — Technical documentation

> *"The technical documentation shall contain [...] a general description of the AI system, its intended purpose, development process, testing, and performance."*

**What licit generates**: Document with 6 sections auto-populated from project metadata.

### Official text

- [Regulation (EU) 2024/1689 — EUR-Lex](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1689)
- [AI Act Explorer (Future of Life Institute)](https://artificialintelligenceact.eu/)

---

## OWASP Agentic Top 10 (2025)

### Context

The OWASP Top 10 for Agentic AI Security identifies the top 10 security risks specific to applications using AI agents. Published by the OWASP Foundation in 2025.

**It is not regulation** — it is an industry-widely adopted security best practices framework. Similar to how the OWASP Top 10 (web) is the standard reference for web security.

### The 10 risks

| ID | Risk | Description | Development relevance |
|---|---|---|---|
| ASI01 | Excessive Agency | The agent has more permissions than necessary | Agents that can write to any file |
| ASI02 | Prompt Injection | Malicious inputs that manipulate behavior | Source code with payloads in comments |
| ASI03 | Supply Chain | Vulnerable or compromised dependencies | Agents that install packages without verification |
| ASI04 | Insufficient Logging | Lack of agent action logging | No audit trail of what the agent did |
| ASI05 | Output Handling | Unvalidated output used downstream | Generated code without review reaching production |
| ASI06 | No Human Oversight | Lack of human supervision | Agents that push directly to main |
| ASI07 | Insufficient Sandboxing | Agent without adequate isolation | Access to the entire filesystem and network |
| ASI08 | Resource Consumption | No spending/token limits | Agents without budgets spending uncontrolled |
| ASI09 | Poor Error Handling | Errors that expose state or bypass controls | Agent that crashes leaving corrupted files |
| ASI10 | Data Exposure | Sensitive data leakage | Agent that logs credentials or PII |

### Official text

- [OWASP Top 10 for Agentic AI](https://owasp.org/www-project-top-10-for-large-language-model-applications/)

---

## Future frameworks

### NIST AI RMF (AI 100-1) — Planned V1

The NIST AI Risk Management Framework defines 4 core functions:

1. **Govern**: Establish governance policies and processes
2. **Map**: Contextualize AI system risks
3. **Measure**: Evaluate and monitor risks
4. **Manage**: Prioritize and treat risks

Reference: [NIST AI RMF (AI 100-1)](https://www.nist.gov/artificial-intelligence/ai-risk-management-framework)

### ISO/IEC 42001:2023 — Planned V1

International standard specifying requirements for an AI management system (AIMS). It defines:

- Clauses 4-10: Context, leadership, planning, support, operation, evaluation, improvement
- Annex A: ~35 AI-specific controls
- Annex B: Implementation guidance

Reference: [ISO/IEC 42001:2023](https://www.iso.org/standard/81230.html)

---

## Legal limitations of licit

1. **licit is not legal advice.** Reports are supporting technical evidence, not legal opinions.
2. **licit does not classify risk.** Classifying a system as "high risk" (Annex III) requires legal analysis.
3. **licit does not replace the DPO.** If your system processes personal data, you need a Data Protection Officer regardless of licit.
4. **Compliance percentages are indicative.** An "80% compliant" does not mean legal compliance — a single non-compliant article can have regulatory consequences.
5. **Auto-detection is heuristic.** Auto-detected answers in the FRIA are suggestions based on technical signals, not legal determinations.
