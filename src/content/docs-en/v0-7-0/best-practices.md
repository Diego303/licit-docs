---
title: "Best Practices"
description: "Recommendations for integrating licit into your workflow."
order: 7
---

# Best Practices

Recommendations for effectively integrating licit into your AI-assisted development workflow.

---

## Initial Setup

### 1. Initialize from the Start

Run `licit init` at the beginning of the project, not after. The sooner you start tracking, the more complete your compliance evidence will be.

```bash
mkdir my-project && cd my-project
git init
# ... initial setup ...
licit init
git add .licit.yaml
git commit -m "feat: initialize licit compliance tracking"
```

### 2. Commit `.licit.yaml`

The configuration file should be versioned. The entire team should use the same configuration.

```bash
git add .licit.yaml
```

### 3. Configure `.gitignore` Correctly

```gitignore
# Sensitive licit data
.licit/provenance.jsonl
.licit/fria-data.json

# Signing key
.licit/signing-key

# Generated reports (optional — can be included)
# .licit/reports/
```

### 4. Select the Relevant Frameworks

Do not enable frameworks that do not apply to your context:

```yaml
# If your product does not operate in the EU:
frameworks:
  eu_ai_act: false
  owasp_agentic: true

# If you only need EU AI Act:
frameworks:
  eu_ai_act: true
  owasp_agentic: false
```

---

## Provenance Traceability

### 5. Run `trace` Regularly

Run `licit trace` after each sprint or release to keep traceability up to date:

```bash
licit trace --since 2026-03-01 --stats --report
```

Combine git heuristics with session logs for greater accuracy:

```yaml
provenance:
  methods:
    - git-infer
    - session-log
  session_dirs:
    - ~/.claude/projects/
```

### 6. Enable Signing in Regulated Environments

If you need to demonstrate provenance chain integrity:

```yaml
provenance:
  sign: true
  sign_key_path: ~/.licit/signing-key
```

Generate a secure key:
```bash
python3.12 -c "import secrets; print(secrets.token_hex(32))" > ~/.licit/signing-key
chmod 600 ~/.licit/signing-key
```

### 7. Adjust the Confidence Threshold

The default (0.6) is conservative. Adjust according to your context:

```yaml
provenance:
  # Stricter (fewer AI false positives)
  confidence_threshold: 0.8

  # More permissive (detects more AI code, more false positives)
  confidence_threshold: 0.4
```

---

## AI Agent Configuration

### 8. Document Your Agents

Maintain explicit agent configuration files:

```
CLAUDE.md              # Instructions for Claude Code
.cursorrules           # Rules for Cursor
AGENTS.md              # GitHub Agents configuration
```

licit automatically monitors these files and records changes.

### 9. Implement Guardrails

In your architect or other agent configuration, define:

- **Protected files**: Files the agent should not modify.
- **Blocked commands**: Commands the agent should not execute.
- **Code rules**: Mandatory patterns or practices.

```yaml
# .architect/config.yaml (example)
guardrails:
  protected_files:
    - .env
    - secrets.yaml
    - migrations/
  blocked_commands:
    - rm -rf
    - DROP TABLE
  code_rules:
    - "no eval() or exec()"
    - "all API endpoints require authentication"
```

licit counts these guardrails as compliance evidence.

### 10. Require Human Review in CI/CD

Configure your pipeline to require human approval before deploying:

```yaml
# .github/workflows/deploy.yml
jobs:
  deploy:
    environment: production   # Requires approval in GitHub
    steps:
      - name: Compliance check
        run: licit verify
      - name: Deploy
        run: ./deploy.sh
```

licit detects the presence of `environment:` in GitHub Actions as evidence of a human review gate.

---

## Continuous Compliance

### 11. Integrate `licit verify` in CI/CD

Add a compliance check on every PR:

```yaml
# .github/workflows/compliance.yml
name: Compliance
on: [pull_request]

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - uses: actions/setup-python@v5
        with:
          python-version: "3.12"
      - run: pip install licit-ai-cli
      - run: licit verify
```

### 12. Generate Agent Config Changelog

Run `licit changelog` regularly to document changes in your AI agent configuration. This is key evidence for compliance:

```bash
licit changelog                        # Markdown by default
licit changelog --format json          # JSON for integration
licit changelog --since 2026-03-01     # From a specific date
```

The changelog classifies each change as **MAJOR** (model/provider), **MINOR** (prompt/guardrails/tools), or **PATCH** (tweaks). MAJOR changes deserve special attention — they can affect the agent's behavior.

```bash
git add .licit/changelog.md
git commit -m "docs: update agent config changelog"
```

### 13. Generate Reports Periodically

Do not wait for the audit. Generate reports on each release:

```bash
# Before each release
licit trace --report
licit changelog
licit report --format markdown
git add .licit/reports/ .licit/changelog.md
git commit -m "docs: update compliance report for v1.2.0"
```

### 14. Review Gaps Regularly

```bash
licit gaps
```

Prioritize closing the highest-priority gaps first.

---

## Connectors

### 15. Enable Connectors When Possible

If you use Architect or Vigil, enable them. They provide evidence that improves the evaluation:

```bash
licit connect architect
# → architect data found at: .architect/reports
# → Connector 'architect' enabled.

licit connect vigil
# → vigil data found
# → Connector 'vigil' enabled.
```

**Architect provides:**
- Execution audit trail (JSON reports + JSONL audit)
- Guardrail configuration (protected files, blocked commands, code rules)
- Quality gates and budget limits
- Dry-run and rollback capabilities

**Vigil provides:**
- Security findings (SARIF 2.1.0) with severity (critical/high/medium/low)
- SBOM — Software Bill of Materials (CycloneDX)

**Configure the audit log for maximum evidence:**
```yaml
connectors:
  architect:
    enabled: true
    config_path: .architect/config.yaml
    audit_log: .architect/audit.jsonl   # ← This adds entries to the audit trail
```

### 16. Integrate Security Tools

licit automatically detects these tools and uses their results as evidence:

| Tool | What It Detects |
|---|---|
| Semgrep | Insecure code patterns |
| Snyk | Dependency vulnerabilities |
| CodeQL | Static security analysis |
| Trivy | Container vulnerabilities |
| ESLint Security | JavaScript security rules |

---

## Team Organization

### 17. Designate a Compliance Lead

Someone on the team should be responsible for:
- Reviewing licit reports periodically.
- Ensuring gaps are prioritized and closed.
- Keeping the FRIA up to date.
- Coordinating with legal/compliance if necessary.

### 18. Document Decisions

When a requirement is marked as `n/a` (not applicable), document why. This is important for audits:

```
# In your FRIA or internal documentation:
Art. 10 (Data Governance): N/A — This system does not train models,
it only uses pre-trained models via API.
```

### 19. Keep the Configuration Up to Date

When you switch AI tools, update the configuration:

```bash
# After migrating from Cursor to Claude Code
licit init  # Re-detects the project
licit status  # Verify the detection
```

---

## Anti-patterns to Avoid

| Anti-pattern | Why It Is Problematic | What to Do Instead |
|---|---|---|
| Ignoring `licit verify` warnings | Partials accumulate | Treat partials as technical debt |
| Not versioning `.licit.yaml` | Each dev uses a different config | Commit to the repo |
| Pushing `provenance.jsonl` to a public repo | Exposes contributor info | Add to `.gitignore` |
| Generating reports only before audits | Incomplete evidence | Generate on each release |
| Disabling signing "because it's slow" | Loss of verifiable integrity | Sign at least in CI |
| Not updating the FRIA | An outdated FRIA has no value | Update with each significant change |
| Marking everything as `n/a` | Compliance evasion | Justify each `n/a` in writing |
