---
title: "Introduction"
description: "Main documentation for licit v0.2.0, a CLI tool for regulatory compliance and code traceability for AI-assisted development teams."
order: 1
---

> CLI tool for regulatory compliance and code traceability for AI-assisted development teams.

## Table of Contents

| Document | Description |
|---|---|
| [Quick Start](/licit-docs/en/docs/quick-start/) | Guide to get licit running in 5 minutes |
| [Architecture](/licit-docs/en/docs/architecture/) | System architecture, modules, phases, and design decisions |
| [CLI Guide](/licit-docs/en/docs/cli-guide/) | Complete reference for all commands and options |
| [Configuration](/licit-docs/en/docs/configuration/) | Configuration guide for `.licit.yaml` with all fields |
| [Data Models](/licit-docs/en/docs/models/) | Enums, dataclasses, and Pydantic schemas used internally |
| [Security](/licit-docs/en/docs/security/) | Threat model, cryptographic signing, data protection |
| [Compliance](/licit-docs/en/docs/compliance/) | Supported regulatory frameworks: EU AI Act and OWASP Agentic Top 10 |
| [Best Practices](/licit-docs/en/docs/best-practices/) | Recommendations for integrating licit into your workflow |
| [Development](/licit-docs/en/docs/development/) | Contributor guide: setup, testing, linting, conventions |
| [Provenance](/licit-docs/en/docs/provenance/) | Traceability system: heuristics, git analyzer, store, attestation, session readers |
| [FAQ](/licit-docs/en/docs/faq/) | Frequently asked questions and troubleshooting |

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

- **v0.2.0** — Phase 1 (Foundation) + Phase 2 (Provenance) completed
- Python 3.12+ required
- 10 CLI commands registered, 4 functional (`init`, `status`, `connect`, `trace`)
- 280 tests, mypy strict, ruff clean

## License

MIT — see `LICENSE` at the project root.
