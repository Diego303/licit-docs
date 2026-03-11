---
title: "Introduction"
description: "Overview of licit, a CLI tool for regulatory compliance and code traceability for AI-assisted development teams."
order: 1
---

> CLI tool for regulatory compliance and code traceability for AI-assisted development teams.

## Table of Contents

| Document | Description |
|---|---|
| [Quick Start](/licit-docs/en/docs/v0-1-0/quick-start/) | Guide to get licit running in 5 minutes |
| [Architecture](/licit-docs/en/docs/v0-1-0/architecture/) | System architecture, modules, phases, and design decisions |
| [CLI Guide](/licit-docs/en/docs/v0-1-0/cli-guide/) | Complete reference for all commands and options |
| [Configuration](/licit-docs/en/docs/v0-1-0/configuration/) | Configuration guide for `.licit.yaml` with all fields |
| [Data Models](/licit-docs/en/docs/v0-1-0/models/) | Enums, dataclasses, and Pydantic schemas used internally |
| [Security](/licit-docs/en/docs/v0-1-0/security/) | Threat model, cryptographic signing, data protection |
| [Compliance](/licit-docs/en/docs/v0-1-0/compliance/) | Supported regulatory frameworks: EU AI Act and OWASP Agentic Top 10 |
| [Best Practices](/licit-docs/en/docs/v0-1-0/best-practices/) | Recommendations for integrating licit into your workflow |
| [Development](/licit-docs/en/docs/v0-1-0/development/) | Contributor guide: setup, testing, linting, conventions |
| [FAQ](/licit-docs/en/docs/v0-1-0/faq/) | Frequently asked questions and troubleshooting |

## Quick Start

```bash
# Install
pip install licit-ai-cli

# Initialize in your project
cd your-project/
licit init

# View status
licit status

# Generate compliance report
licit report
```

## Current Version

- **v0.1.0** — Phase 1 (Foundation) completed
- Python 3.12+ required
- 10 CLI commands registered, 3 functional in this phase (`init`, `status`, `connect`)

## License

MIT — see `LICENSE` at the project root.
