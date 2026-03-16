---
title: "Examples and Recipes"
description: "Complete workflows for common use cases."
order: 6
---

Complete workflows for common use cases.

---

## 1. New team starting to use AI agents

**Context**: Your team is going to start using Claude Code. You want compliance from day one.

```bash
# Initialize
cd my-project/
licit init

# Configure provenance signing
cat >> .licit.yaml << 'EOF'
provenance:
  sign: true
  methods:
    - git-infer
    - session-log
EOF

# First baseline
licit trace --stats --report
licit report --format html -o .licit/reports/baseline.html
licit gaps

# Version control
git add .licit.yaml .licit/reports/baseline.html
git commit -m "chore: initialize licit compliance tracking"
```

---

## 2. Existing project preparing for EU AI Act audit

**Context**: You have a project with 6 months of git history, CLAUDE.md configured, and you need EU AI Act documentation.

```bash
# Initialize and analyze
licit init --framework eu-ai-act
licit trace --stats

# Generate regulatory documentation
licit fria                    # Interactive questionnaire (local)
licit fria --auto             # Non-interactive mode (CI/CD)
licit annex-iv --organization "My Company" --product "My App v2"

# Evaluate status
licit report --format html -o compliance-report.html
licit gaps --framework eu-ai-act

# Verify before audit
licit verify --framework eu-ai-act
echo "Exit code: $?"
```

**Deliverables for the auditor:**
- `.licit/fria-report.md` — Completed FRIA
- `.licit/annex-iv.md` — Annex IV technical documentation
- `compliance-report.html` — Compliance report with evidence
- `.licit/provenance-report.md` — AI vs human traceability

---

## 3. CI/CD gate with progressive compliance

**Context**: You don't want to block PRs for compliance at the beginning, but you do want visibility. Gradual transition from warning to blocking.

**Phase 1 — Report only (non-blocking):**

```yaml
# .github/workflows/compliance.yml
name: Compliance
on: [pull_request]

jobs:
  compliance:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - uses: actions/setup-python@v5
        with:
          python-version: "3.12"
      - run: pip install licit-ai-cli
      - name: Compliance report
        run: |
          licit report --format json -o compliance.json
          licit gaps
        continue-on-error: true      # Does not block PR
      - uses: actions/upload-artifact@v4
        with:
          name: compliance-report
          path: compliance.json
```

**Phase 2 — Warning on partial, block on non-compliant:**

```yaml
      - name: Compliance gate
        run: |
          licit verify
          EXIT=$?
          if [ $EXIT -eq 1 ]; then
            echo "::error::Non-compliant — fix required"
            exit 1
          elif [ $EXIT -eq 2 ]; then
            echo "::warning::Partially compliant — review recommended"
            exit 0   # Does not block, warning only
          fi
```

**Phase 3 — Full blocking:**

```yaml
      - name: Compliance gate
        run: licit verify   # Blocks on exit 1 or 2
```

---

## 4. Monorepo with multiple services

**Context**: A monorepo with 3 services, each with its own agent config.

```
monorepo/
├── services/
│   ├── api/          ← Python + Claude Code
│   ├── frontend/     ← TypeScript + Cursor
│   └── worker/       ← Go + Copilot
├── CLAUDE.md
└── .cursorrules
```

```bash
# Initialize each service
for svc in api frontend worker; do
  (cd services/$svc && licit init)
done

# Or initialize from root (analyzes the entire monorepo as one project)
cd monorepo/
licit init
licit trace --stats
```

---

## 5. Connect architect for complete evidence

**Context**: You use architect as a coding agent. You want licit to read its outputs.

```bash
# 1. Enable connector
licit connect architect
# → architect data found at: .architect/reports
# → Connector 'architect' enabled.

# 2. Configure audit log (if architect generates it)
cat >> .licit.yaml << 'EOF'
connectors:
  architect:
    enabled: true
    config_path: .architect/config.yaml
    audit_log: .architect/audit.jsonl
EOF

# 3. Verify that evidence is enriched
licit status
# → Connectors:
# →   [x] architect (.architect/config.yaml, enabled)

# 4. The report now reflects guardrails and audit trail
licit report
licit gaps
```

---

## 6. Periodic compliance script

**Context**: Generate compliance reports on each release.

```bash
#!/bin/bash
# scripts/compliance-report.sh
set -e

VERSION=$(git describe --tags --abbrev=0 2>/dev/null || echo "dev")
DATE=$(date +%Y-%m-%d)

echo "Generating compliance report for $VERSION..."

# Update provenance
licit trace --since "$(git log --format=%aI -1 HEAD~50)" --report

# Generate config changelog
licit changelog

# Generate reports in 3 formats
licit report --format markdown -o ".licit/reports/compliance-$VERSION.md"
licit report --format json -o ".licit/reports/compliance-$VERSION.json"
licit report --format html -o ".licit/reports/compliance-$VERSION.html"

# Gap analysis
licit gaps > ".licit/reports/gaps-$VERSION.txt" 2>&1 || true

# Commit
git add .licit/reports/ .licit/changelog.md
git commit -m "docs: compliance report for $VERSION ($DATE)" || true

echo "Done. Reports in .licit/reports/"
```

---

## 7. Compare compliance between releases

**Context**: You want to see if compliance improved between v1.0 and v1.1.

```bash
# Generate V1.0 report
git checkout v1.0
licit report --format json -o /tmp/compliance-v1.0.json

# Generate V1.1 report
git checkout v1.1
licit report --format json -o /tmp/compliance-v1.1.json

# Compare (with jq)
echo "=== V1.0 ===" && jq '.overall.compliance_rate' /tmp/compliance-v1.0.json
echo "=== V1.1 ===" && jq '.overall.compliance_rate' /tmp/compliance-v1.1.json

# Detailed diff
diff <(jq '.frameworks[].results[] | {id: .requirement.id, status: .status}' /tmp/compliance-v1.0.json) \
     <(jq '.frameworks[].results[] | {id: .requirement.id, status: .status}' /tmp/compliance-v1.1.json)
```
