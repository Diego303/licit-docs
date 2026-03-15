---
title: "CI/CD Integration"
description: "GitHub Actions, GitLab CI, Jenkins — licit as a compliance gate in pipelines."
order: 8
---

# CI/CD Integration

## Overview

licit works as a compliance gate in CI/CD pipelines. The `licit verify` command returns exit codes that determine whether a pipeline passes or fails:

| Exit code | Meaning | Pipeline action |
|---|---|---|
| `0` | **COMPLIANT** — All requirements met | Pipeline continues |
| `1` | **NON_COMPLIANT** — Some critical requirement not met | Pipeline fails |
| `2` | **PARTIAL** — Requirements partially met | Configurable (fail or warning) |

---

## GitHub Actions

### Basic Gate

```yaml
# .github/workflows/compliance.yml
name: Compliance Check

on:
  pull_request:
    branches: [main]
  push:
    branches: [main]

jobs:
  compliance:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0  # licit needs full git history

      - uses: actions/setup-python@v5
        with:
          python-version: '3.12'

      - name: Install licit
        run: pip install licit-ai-cli

      - name: Verify compliance
        run: licit verify
```

> **`fetch-depth: 0` is mandatory.** licit analyzes the full git history for provenance traceability. A shallow clone would produce incorrect results.

### Complete Pipeline with Reports

```yaml
name: Compliance Pipeline

on:
  pull_request:
    branches: [main]

jobs:
  compliance:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - uses: actions/setup-python@v5
        with:
          python-version: '3.12'

      - name: Install licit
        run: pip install licit-ai-cli

      - name: Track provenance
        run: licit trace

      - name: Generate compliance report
        run: licit report --format html -o compliance-report.html

      - name: Upload report
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: compliance-report
          path: compliance-report.html

      - name: Check gaps
        run: licit gaps

      - name: Verify compliance (gate)
        run: licit verify
```

### Per-Framework Evaluation

```yaml
      # EU AI Act only
      - name: EU AI Act compliance
        run: licit verify --framework eu-ai-act

      # OWASP only
      - name: OWASP security posture
        run: licit verify --framework owasp

      # Both (default)
      - name: Full compliance
        run: licit verify --framework all
```

### Treat PARTIAL as Warning (not failure)

```yaml
      - name: Compliance check
        run: |
          licit verify
          exit_code=$?
          if [ $exit_code -eq 1 ]; then
            echo "::error::Compliance check failed — non-compliant controls found"
            exit 1
          elif [ $exit_code -eq 2 ]; then
            echo "::warning::Compliance check partial — some controls need attention"
            exit 0  # Do not fail on partial
          fi
```

---

## GitLab CI

```yaml
# .gitlab-ci.yml
compliance:
  image: python:3.12
  stage: test
  variables:
    GIT_DEPTH: 0  # Full history
  script:
    - pip install licit-ai-cli
    - licit trace
    - licit report --format json -o compliance.json
    - licit verify
  artifacts:
    paths:
      - compliance.json
    when: always
```

---

## Jenkins

```groovy
// Jenkinsfile
pipeline {
    agent { docker { image 'python:3.12' } }
    stages {
        stage('Compliance') {
            steps {
                checkout([$class: 'GitSCM',
                    extensions: [[$class: 'CloneOption', depth: 0, shallow: false]]])
                sh 'pip install licit-ai-cli'
                sh 'licit trace'
                sh 'licit report --format html -o compliance.html'
                sh 'licit verify'
            }
            post {
                always {
                    archiveArtifacts artifacts: 'compliance.html'
                }
            }
        }
    }
}
```

---

## Environment-Specific Configuration

### Project Without a Pre-existing `.licit.yaml`

If the pipeline runs in a project that does not have `.licit.yaml`, licit uses defaults (both frameworks enabled). This works without `licit init`:

```bash
licit verify  # Works without init — uses defaults
```

### Versioning `.licit.yaml`

```bash
# In local development
licit init --framework eu-ai-act
git add .licit.yaml
git commit -m "chore: add licit configuration"
```

The pipeline will use the versioned configuration automatically.

### Paths NOT to Version

```gitignore
# .gitignore
.licit/provenance.jsonl
.licit/fria-data.json
.licit/.signing-key
```

Reports in `.licit/reports/` can generally be versioned — they contain evaluations, not sensitive data.

---

## Integration Strategies

### 1. PR Gate (recommended)

```
PR opened → licit verify → passes? → merge allowed
```

Configure branch protection in GitHub to require the compliance check to pass before merge.

### 2. Report on Each Release

```yaml
on:
  release:
    types: [published]

jobs:
  compliance-report:
    steps:
      - run: licit report --format html -o compliance-v${{ github.ref_name }}.html
      - uses: actions/upload-artifact@v4
        with:
          name: compliance-${{ github.ref_name }}
          path: compliance-*.html
```

### 3. Periodic Monitoring

```yaml
on:
  schedule:
    - cron: '0 9 * * 1'  # Mondays at 9am

jobs:
  weekly-compliance:
    steps:
      - run: |
          licit trace
          licit report --format json -o weekly-report.json
          licit gaps
```

---

## CI Environment Requirements

| Requirement | Detail |
|---|---|
| Python | 3.12+ |
| Git | Any recent version |
| Git history | Complete (`fetch-depth: 0`) |
| Disk | Minimal — `.licit/` typically occupies <1MB |
| Network | Not required — licit is 100% offline |
| Permissions | Repository read access |

licit does not make network calls, does not require API keys, and does not send data to any external service. Everything runs locally.

---

## CI/CD Troubleshooting

### `licit verify` always fails

Likely cause: without FRIA or Annex IV, Art. 27 and Annex IV will be NON_COMPLIANT. Options:

1. Complete the FRIA: `licit fria` (interactive, do it locally)
2. Generate Annex IV: `licit annex-iv` (automatic)
3. Evaluate OWASP only: `licit verify --framework owasp`

### Incorrect Provenance

If `licit trace` shows 0 files or incorrect data, verify that the checkout has full history:

```bash
git log --oneline | wc -l  # Should be > 0
```

### Slow Pipeline

`licit trace` analyzes the entire git history. For large repos, use `--since`:

```yaml
- run: licit trace --since $(date -d '30 days ago' +%Y-%m-%d)
```
