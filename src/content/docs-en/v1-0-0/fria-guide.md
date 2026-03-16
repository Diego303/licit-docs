---
title: "FRIA Guide"
description: "Question-by-question guidance for completing the FRIA (Fundamental Rights Impact Assessment, Art. 27 EU AI Act)."
order: 11
---

# Guide for completing the FRIA

## What is the FRIA

The FRIA (Fundamental Rights Impact Assessment) is a mandatory assessment under **Article 27 of the EU AI Act**. Before putting an AI system into use, the deployer must evaluate its impact on fundamental rights.

licit generates the FRIA through an interactive 5-step questionnaire with 16 questions. Several answers are auto-detected from the project configuration.

```bash
licit fria             # Start new FRIA (interactive)
licit fria --auto      # Non-interactive mode (CI/CD) — accepts auto-detections and defaults
licit fria --update    # Update existing FRIA
```

> **CI/CD Tip:** Use `licit fria --auto` in automated pipelines. It accepts all auto-detected values and uses the first option as default for questions without detection. Empty fields can be completed manually later with `--update`.

---

## The 5 steps

### Step 1 — System description

> **Objective:** Document what the AI system is, what it does, and how it is deployed.

#### 1.1 — What is the main purpose of this AI system?

Describe what the system does in one or two concrete sentences.

| Response type | Example |
|---|---|
| Good | "Autonomous code generation and file modification in CI/CD pipelines using Claude Code" |
| Good | "Interactive code assistant for developers using Cursor with Claude Sonnet 4" |
| Bad | "Use AI" |
| Bad | "Development" |

**Auto-detection:** licit infers the purpose from detected agent configs (CLAUDE.md, .cursorrules, etc.).

#### 1.2 — What type of AI technology is used?

| Option | When to select |
|---|---|
| LLM for code generation | The agent generates code but a human reviews and executes it |
| AI coding assistant (interactive) | The developer works alongside the agent (Cursor, Copilot) |
| Autonomous AI agent (headless) | The agent operates without human intervention (Claude Code in CI, architect) |
| Multi-agent system | Multiple agents collaborate (architect + vigil, or custom) |

**Auto-detection:** licit detects whether there is architect (headless) or only interactive configs (Cursor, Copilot).

#### 1.3 — What models/AI providers are used?

List the specific models. Regulators want to know which models are in use.

| Response type | Example |
|---|---|
| Good | "Claude Sonnet 4 (Anthropic) for code generation, GPT-4.1 (OpenAI) for review" |
| Good | "Claude Opus 4 (Anthropic) via Claude Code" |
| Bad | "AI" |

**Auto-detection:** licit reads the architect config to detect the configured model.

#### 1.4 — How many people/systems are affected?

This determines the **impact scope**:

| Option | Regulatory implication |
|---|---|
| Internal team (<50) | Low risk — impact limited to developers |
| Internal org (50-500) | Medium risk — the produced software affects the organization |
| External users (500-10K) | High risk — end users depend on the produced software |
| Large-scale (10K+) | Very high risk — justifies exhaustive mitigation measures |

#### 1.5 — Is human review required?

| Option | What it implies for compliance |
|---|---|
| Yes, all | Strong Art. 14 compliance. Document the review process |
| Partially | Document what is reviewed and what is not, and why |
| No | High risk. You must justify why this is acceptable and what alternative mitigations exist |

**Auto-detection:** licit checks whether there is CI/CD with GitHub Actions (implies PR reviews) or architect with dry-run.

---

### Step 2 — Fundamental rights identification

> **Objective:** Identify which fundamental rights could be affected by the AI system.

#### 2.1 — Does the system process personal data?

Consider whether the source code or configurations contain:
- People's names in comments or git history
- Email addresses in configs
- Tokens/credentials (even though they shouldn't be there)

| Option | When |
|---|---|
| Yes | The code handles user data (forms, databases, APIs with PII) |
| No | Infrastructure code, libraries, internal tools without user data |
| Possibly | It's unclear — the AI agent could generate code that processes data |

#### 2.2 — Could it affect employment or working conditions?

| Option | When |
|---|---|
| No — only generates code | The agent's output is code reviewed by humans |
| Possibly — productivity metrics | If AI code metrics are used to evaluate developer performance |
| Yes — hiring decisions | If the system influences HR decisions |

#### 2.3 — Could vulnerabilities affect user rights?

| Option | When |
|---|---|
| Low risk — internal tools | The produced software is for internal use only |
| Medium risk — user-facing | The software has users but doesn't handle critical data |
| High risk — financial/health/identity | The software handles money, health, or people's identity |

#### 2.4 — Could it introduce discriminatory behavior?

| Option | When |
|---|---|
| No — backend/infra | The code is purely technical |
| Possibly | The code interacts with decisions that affect people (recommendations, filters) |
| Yes | The code implements decision algorithms (scoring, classification, selection) |

---

### Step 3 — Impact assessment

> **Objective:** Evaluate the likelihood and severity of impact on the identified rights.

#### 3.1 — Overall risk level

| Option | Criteria |
|---|---|
| Minimal | Development tool with full human oversight |
| Limited | Some automation but with review gates |
| High | Autonomous operation with limited oversight |
| Unacceptable | Fully autonomous without safeguards — **not acceptable under the EU AI Act** |

> If you select "Unacceptable", you must implement safeguards before proceeding.

#### 3.2 — Maximum potential impact

Describe the worst realistic scenario. Regulators want to see that you have thought about this.

| Response type | Example |
|---|---|
| Good | "Security vulnerability in generated code could expose data of 10K users. Estimated financial impact: 50K-200K EUR. Detection time: <24h via CI/CD" |
| Bad | "Nothing bad can happen" |

#### 3.3 — Detection and reversion speed

| Option | Implication |
|---|---|
| Immediately — automated tests | Strong. Document your test suite and coverage |
| Hours — CI/CD | Acceptable. Document your pipeline |
| Days — manual review | Weak. Consider automating |
| Unknown | Unacceptable. Implement detection before continuing |

---

### Step 4 — Mitigation measures

> **Objective:** Document existing and planned measures to mitigate risks.

#### 4.1 — Guardrails

**Auto-detection:** licit reads the architect config to detect guardrails.

Document what restrictions the AI agent has:

| Measure | Example |
|---|---|
| Protected files | `README.md`, `.env`, `Dockerfile` — the agent cannot modify them |
| Blocked commands | `rm -rf /`, `DROP TABLE`, `curl | sh` — prohibited commands |
| Budget limits | Maximum $5 USD per execution |
| Quality gates | Tests must pass before commit |

#### 4.2 — Security scanning

**Auto-detection:** licit detects vigil, semgrep, snyk, codeql, trivy.

#### 4.3 — Testing

**Auto-detection:** licit detects pytest, jest, vitest, go test.

#### 4.4 — Audit trail

**Auto-detection:** licit checks whether `.licit/provenance.jsonl` and `.architect/reports/` exist.

#### 4.5 — Additional measures

Free-form field for measures not covered by the previous questions. Examples:
- "Code review by two senior developers before merge"
- "Quarterly team training on AI risks"
- "Liability insurance for software products"

---

### Step 5 — Monitoring and review

> **Objective:** Define continuous monitoring and periodic review processes.

#### 5.1 — Review frequency

| Option | When appropriate |
|---|---|
| Quarterly | High risk, frequent system changes |
| Semi-annually | Medium risk, stable system |
| Annually | Low risk, no significant changes |
| On significant changes | When the model, scope, or guardrails change |

> **Recommendation:** Combine "On significant changes" with a minimum frequency (at least annually).

#### 5.2 — Compliance responsible

Designate a specific person by name and role. Regulators want a point of contact.

#### 5.3 — Incident process

Describe what happens when AI-generated code causes a problem:
1. How is it detected?
2. Who is notified?
3. How is it reverted?
4. How is it documented?

---

## After completing the FRIA

### Generated files

| File | Content |
|---|---|
| `.licit/fria-data.json` | Raw answers (JSON). **Do not version** — may contain sensitive data |
| `.licit/fria-report.md` | Formatted report in Markdown. **Do version** — this is the regulatory document |

### Updating an existing FRIA

```bash
licit fria --update
```

Pre-loads previous answers and allows you to modify them.

### When to update

- When the AI model used changes
- When the scope changes (from internal to external)
- When guardrails change significantly
- At the frequency defined in step 5.1
