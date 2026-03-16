---
title: "Introduction"
description: "Main documentation for licit v1.0.0, a CLI tool for regulatory compliance and code traceability for AI-assisted development teams."
order: 1
---

# licit Documentation

> CLI tool for regulatory compliance and code traceability for AI-assisted development teams.

## Table of Contents

### For users

| Document | Description |
|---|---|
| [Quick Start](../quick-start/) | Guide to get licit running in 5 minutes |
| [CLI Guide](../cli-guide/) | Complete reference of all commands and options |
| [Configuration](../configuration/) | Configuration guide for `.licit.yaml` with all fields |
| [Connectors](../connectors/) | Architect and vigil: what they read, how to configure them, how they feed compliance |
| [Examples and recipes](../examples/) | Complete workflows for common use cases |
| [Best practices](../best-practices/) | Recommendations for integrating licit into your workflow |
| [FAQ](../faq/) | Frequently asked questions and troubleshooting |

### For compliance and auditing

| Document | Description |
|---|---|
| [Compliance](../compliance/) | Supported regulatory frameworks: EU AI Act and OWASP Agentic Top 10 |
| [Legal framework](../legal-framework/) | Legal context of the EU AI Act, OWASP, NIST, ISO — with official references |
| [Report interpretation](../report-interpretation/) | How to read and act on compliance and gap analysis reports |
| [FRIA Guide](../fria-guide/) | Question-by-question guidance for completing the FRIA (Art. 27) |
| [Auditor guide](../auditor-guide/) | Compliance verification, evidence, preparation for regulatory audit |
| [CI/CD Integration](../ci-cd/) | GitHub Actions, GitLab CI, Jenkins — licit as a compliance gate |
| [Enterprise guide](../enterprise/) | Organizational adoption, maturity model, GRC integration |

### For developers

| Document | Description |
|---|---|
| [Architecture](../architecture/) | System architecture, modules, phases and design decisions |
| [Data models](../models/) | Enums, dataclasses and Pydantic schemas used internally |
| [Provenance](../provenance/) | Traceability system: heuristics, git analyzer, store, attestation |
| [Changelog](../changelog/) | Changelog system: watcher, differ, classifier, renderer |
| [Programmatic API](../programmatic-api/) | Using licit from Python: imports, classes, examples |
| [Security](../security/) | Threat model, cryptographic signing, data protection |
| [Development](../development/) | Contributor guide: setup, testing, linting, conventions |
| [Migration V0 → V1](../migration-v1/) | Stability contract, planned changes, migration steps |

### Reference

| Document | Description |
|---|---|
| [Glossary](../glossary/) | Regulatory, technical and domain terms |

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

## Current version

- **v1.0.0** — Stable release. Phases 1-7 completed + exhaustive QA (142 manual tests x 5 projects x 10 edge cases)
- Python 3.12+ required
- 10 CLI commands, all functional (`fria --auto` for CI/CD)
- 789 tests, mypy strict, ruff clean
- Connectors: architect (reports, audit log, config) + vigil (SARIF, SBOM)

## License

MIT — see [LICENSE](../LICENSE) in the project root.
