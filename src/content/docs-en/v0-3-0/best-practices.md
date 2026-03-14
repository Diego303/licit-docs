---
title: "Best Practices"
description: "Recommendations for effectively integrating licit into your AI-assisted development workflow."
order: 10
---

Recommendations for effectively integrating licit into your AI-assisted development workflow.

---

## Initial Setup

### 1. Initialize from the beginning

Run `licit init` at the start of the project, not later. The sooner you start tracking, the more complete the compliance evidence will be.

```bash
mkdir my-project && cd my-project
git init
# ... initial setup ...
licit init
git add .licit.yaml
git commit -m "feat: initialize licit compliance tracking"
```

### 2. Commit `.licit.yaml`

The configuration file should be version-controlled. The entire team should use the same configuration.

```bash
git add .licit.yaml
```

### 3. Configure `.gitignore` correctly

```gitignore
# Sensitive licit data
.licit/provenance.jsonl
.licit/fria-data.json

# Signing key
.licit/signing-key

# Generated reports (optional — can be included)
# .licit/reports/
```

### 4. Select relevant frameworks

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

### 5. Run `trace` regularly

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

### 6. Enable signing in regulated environments

If you need to demonstrate integrity of the provenance chain:

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

### 7. Adjust the confidence threshold

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

### 8. Document your agents

Maintain explicit agent configuration files:

```
CLAUDE.md              # Instructions for Claude Code
.cursorrules           # Rules for Cursor
AGENTS.md              # GitHub Agents configuration
```

licit automatically monitors these files and records changes.

### 9. Implement guardrails

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

### 10. Require human review in CI/CD

Configure your pipeline to require human approval before deployment:

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

### 11. Integrate `licit verify` into CI/CD

Add a compliance check to every PR:

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

### 12. Generate agent config changelogs

Run `licit changelog` regularly to document changes in your AI agent configuration. This is key evidence for compliance:

```bash
licit changelog                        # Markdown by default
licit changelog --format json          # JSON for integration
licit changelog --since 2026-03-01     # From a specific date
```

The changelog classifies each change as **MAJOR** (model/provider), **MINOR** (prompt/guardrails/tools), or **PATCH** (tweaks). MAJOR changes deserve special attention — they can affect agent behavior.

```bash
git add .licit/changelog.md
git commit -m "docs: update agent config changelog"
```

### 13. Generate reports periodically

Do not wait until the audit. Generate reports with each release:

```bash
# Before each release
licit trace --report
licit changelog
licit report --format markdown
git add .licit/reports/ .licit/changelog.md
git commit -m "docs: update compliance report for v1.2.0"
```

### 14. Review gaps regularly

```bash
licit gaps
```

Prioritize closing the highest-priority gaps first.

---

## Connectors

### 15. Enable connectors when possible

If you use Architect or Vigil, enable them. They provide additional evidence:

```bash
licit connect architect
licit connect vigil
```

**Architect provides:**
- Execution audit trail
- Guardrails configuration
- Quality gates

**Vigil provides:**
- Security findings (SARIF)
- SBOM (Software Bill of Materials)

### 16. Integrate security tools

licit automatically detects these tools and uses their results as evidence:

| Tool | What it detects |
|---|---|
| Semgrep | Insecure code patterns |
| Snyk | Dependency vulnerabilities |
| CodeQL | Static security analysis |
| Trivy | Container vulnerabilities |
| ESLint Security | JavaScript security rules |

---

## Team Organization

### 17. Designate a compliance lead

Someone on the team should be responsible for:
- Reviewing licit reports periodically.
- Ensuring gaps are prioritized and closed.
- Keeping the FRIA up to date.
- Coordinating with legal/compliance if necessary.

### 18. Document decisions

When a requirement is marked as `n/a` (not applicable), document why. This is important for audits:

```
# In your FRIA or internal documentation:
Art. 10 (Data Governance): N/A — This system does not train models,
it only uses pre-trained models via API.
```

### 19. Keep the configuration up to date

When you switch AI tools, update the configuration:

```bash
# After migrating from Cursor to Claude Code
licit init  # Re-detect the project
licit status  # Verify the detection
```

---

## Anti-patterns to Avoid

| Anti-pattern | Why it is problematic | What to do instead |
|---|---|---|
| Ignoring `licit verify` warnings | Partial compliance issues accumulate | Treat partial compliance as technical debt |
| Not versioning `.licit.yaml` | Each dev uses a different config | Commit to the repo |
| Pushing `provenance.jsonl` to a public repo | Exposes contributor info | Add to `.gitignore` |
| Generating reports only before audits | Incomplete evidence | Generate with each release |
| Disabling signing "because it's slow" | Loss of verifiable integrity | Sign at least in CI |
| Not updating the FRIA | An outdated FRIA has no value | Update with each significant change |
| Marking everything as `n/a` | Compliance evasion | Justify each `n/a` in writing |
