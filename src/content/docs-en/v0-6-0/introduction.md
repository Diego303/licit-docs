---
title: "Introduction"
description: "Main documentation for licit v0.6.0, a CLI tool for regulatory compliance and code traceability for AI-assisted development teams."
order: 1
---

# licit Documentation

> CLI tool for regulatory compliance and code traceability for AI-assisted development teams.

## Table of Contents

| Document | Description |
|---|---|
| [Quick Start](../quick-start/) | Guide to get licit up and running in 5 minutes |
| [CLI Guide](../cli-guide/) | Complete reference for all commands and options |
| [Report Interpretation](../report-interpretation/) | How to read and act on compliance and gap analysis reports |
| [FRIA Guide](../fria-guide/) | Question-by-question guidance for completing the FRIA (Art. 27) |
| [Auditor Guide](../auditor-guide/) | Compliance verification, evidence, preparation for regulatory audit |
| [CI/CD Integration](../ci-cd/) | GitHub Actions, GitLab CI, Jenkins — licit as a compliance gate |
| [Configuration](../configuration/) | Configuration guide for `.licit.yaml` with all fields |
| [Compliance](../compliance/) | Supported regulatory frameworks: EU AI Act and OWASP Agentic Top 10 |
| [Architecture](../architecture/) | System architecture, modules, phases, and design decisions |
| [Data Models](../models/) | Enums, dataclasses, and Pydantic schemas used internally |
| [Provenance](../provenance/) | Traceability system: heuristics, git analyzer, store, attestation |
| [Changelog](../changelog/) | Changelog system: watcher, differ, classifier, renderer |
| [Security](../security/) | Threat model, cryptographic signing, data protection |
| [Best Practices](../best-practices/) | Recommendations for integrating licit into your workflow |
| [Development](../development/) | Contributor guide: setup, testing, linting, conventions |
| [FAQ](../faq/) | Frequently asked questions and troubleshooting |

## Quick Start

```bash
# Install
pip install licit-ai-cli

# Initialize in your project
cd your-project/
licit init

# View status
licit status

# Track code provenance
licit trace --stats

# Generate compliance report
licit report
```

## Current Version

- **v0.6.0** — Phases 1-6 completed (Foundation + Provenance + Changelog + EU AI Act + OWASP Agentic Top 10 + Reports)
- Python 3.12+ required
- 10 CLI commands, all functional
- 706 tests, mypy strict, ruff clean

## License

MIT — see LICENSE in the project root.
