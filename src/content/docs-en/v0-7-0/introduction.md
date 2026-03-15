---
title: "Introduction"
description: "Main documentation for licit v0.7.0, a CLI tool for regulatory compliance and code traceability for AI-assisted development teams."
order: 1
---

# licit Documentation

> CLI tool for regulatory compliance and code traceability for AI-assisted development teams.

## Table of Contents

### For Users

| Document | Description |
|---|---|
| [Quick Start](../quick-start/) | Guide to get licit up and running in 5 minutes |
| [CLI Guide](../cli-guide/) | Complete reference for all commands and options |
| [Configuration](../configuration/) | Configuration guide for `.licit.yaml` with all fields |
| [Connectors](../connectors/) | Architect and vigil: what they read, how to configure them, how they feed compliance |
| [Examples and Recipes](../examples/) | Complete workflows for common use cases |
| [Best Practices](../best-practices/) | Recommendations for integrating licit into your workflow |
| [FAQ](../faq/) | Frequently asked questions and troubleshooting |

### For Compliance and Auditing

| Document | Description |
|---|---|
| [Compliance](../compliance/) | Supported regulatory frameworks: EU AI Act and OWASP Agentic Top 10 |
| [Legal Framework](../legal-framework/) | Legal context of the EU AI Act, OWASP, NIST, ISO — with official references |
| [Report Interpretation](../report-interpretation/) | How to read and act on compliance and gap analysis reports |
| [FRIA Guide](../fria-guide/) | Question-by-question guidance for completing the FRIA (Art. 27) |
| [Auditor Guide](../auditor-guide/) | Compliance verification, evidence, preparation for regulatory audit |
| [CI/CD Integration](../ci-cd/) | GitHub Actions, GitLab CI, Jenkins — licit as a compliance gate |
| [Enterprise Guide](../enterprise/) | Organizational adoption, maturity model, GRC integration |

### For Developers

| Document | Description |
|---|---|
| [Architecture](../architecture/) | System architecture, modules, phases, and design decisions |
| [Data Models](../models/) | Enums, dataclasses, and Pydantic schemas used internally |
| [Provenance](../provenance/) | Traceability system: heuristics, git analyzer, store, attestation |
| [Changelog](../changelog/) | Changelog system: watcher, differ, classifier, renderer |
| [Programmatic API](../programmatic-api/) | Using licit from Python: imports, classes, examples |
| [Security](../security/) | Threat model, cryptographic signing, data protection |
| [Development](../development/) | Contributor guide: setup, testing, linting, conventions |
| [Migration V0 → V1](../migration-v1/) | Stability contract, planned changes, migration steps |

### Reference

| Document | Description |
|---|---|
| [Glossary](../glossary/) | Regulatory, technical, and domain terms |

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

- **v0.7.0** — Phases 1-7 completed (Foundation + Provenance + Changelog + EU AI Act + OWASP Agentic Top 10 + Reports + Connectors)
- Python 3.12+ required
- 10 CLI commands, all functional
- 789 tests, mypy strict, ruff clean
- Connectors: architect (reports, audit log, config) + vigil (SARIF, SBOM)

## License

MIT — see [LICENSE](../LICENSE) in the project root.
