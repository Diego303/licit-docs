---
title: "Enterprise Guide"
description: "Organizational adoption, maturity model, GRC integration."
order: 14
---

# Enterprise guide

Guide for organizations evaluating or adopting licit as part of their AI governance strategy.

---

## Who this guide is for

- **CTOs / VP Engineering**: Evaluating AI governance tools
- **Compliance officers**: Need automated regulatory documentation
- **Legal teams**: Preparing for EU AI Act audits
- **Security leads**: Implementing OWASP controls for AI agents
- **Procurement**: Evaluating licit vs alternatives

---

## Value proposition

### The problem

Organizations using AI agents to generate code face three gaps:

1. **Traceability**: They cannot distinguish human code from AI code at scale. This creates risks around intellectual property, legal liability, and quality management.

2. **Regulation**: The EU AI Act requires specific documentation (FRIA, Annex IV), risk management systems, and human oversight. Generating this documentation manually is costly and error-prone.

3. **Agent security**: AI agents operate with elevated permissions and can introduce vulnerabilities that traditional security tools do not cover (OWASP Agentic Top 10).

### How licit solves it

| Capability | Enterprise benefit |
|---|---|
| Provenance tracking | Auditable traceability of AI vs human code |
| FRIA generator | Automated Art. 27 regulatory documentation |
| Annex IV generator | Technical documentation auto-populated from metadata |
| EU AI Act evaluator | Article-by-article evaluation with evidence |
| OWASP evaluator | Security posture against 10 agentic risks |
| Gap analyzer | Prioritized gaps with actionable recommendations |
| CI/CD gate | Compliance integrated into the development pipeline |
| Config changelog | Audit of changes in agent configuration |

### Key differentiators

1. **Standalone**: Requires no SaaS, databases, or infrastructure. Everything is local files.
2. **Developer-first**: CLI that integrates into existing git/CI/CD workflows.
3. **Language-agnostic**: Python, JS/TS, Go, Rust, Java.
4. **Open source (MIT)**: No vendor lock-in, auditable, extensible.
5. **Multi-framework**: EU AI Act + OWASP in a single run, with NIST/ISO on the roadmap.

---

## Adoption model

### Phase 1: Pilot (1-2 weeks)

**Objective**: Validate licit on a representative project.

```bash
# One dev installs and tests
pip install licit-ai-cli
cd pilot-project/
licit init
licit trace --stats
licit report --format html -o compliance.html
licit gaps
```

**Deliverable**: HTML compliance report + gap analysis of the pilot project.

### Phase 2: Team (2-4 weeks)

**Objective**: Integrate into a team's CI/CD workflow.

1. Add `licit verify` to the PR pipeline
2. Complete the FRIA (`licit fria`)
3. Generate Annex IV (`licit annex-iv`)
4. Enable connectors if using architect/vigil
5. Version `.licit.yaml` and reports

### Phase 3: Organization (1-3 months)

**Objective**: Standardize AI compliance across the entire organization.

1. Define a standard `.licit.yaml` per project type
2. Set up dashboards (parsing JSON reports)
3. Integrate into the internal audit process
4. Designate compliance leads per team
5. Establish review cadence (monthly/quarterly)

---

## Technical requirements

| Requirement | Detail |
|---|---|
| **Runtime** | Python 3.12+ |
| **Dependencies** | 6 PyPI packages (click, pydantic, structlog, pyyaml, jinja2, cryptography) |
| **Storage** | ~50 MB per project (provenance store + reports) |
| **Network** | Not required. Works 100% offline/air-gapped. |
| **Permissions** | Read-only on the project + write access to `.licit/` |
| **CI/CD** | GitHub Actions, GitLab CI, Jenkins (templates included) |
| **Git** | Requires git history for provenance tracking |

---

## Regulatory frameworks covered

### EU AI Act — Current coverage

| Obligation | Article | licit status |
|---|---|---|
| Risk management system | Art. 9 | Evaluated (guardrails, quality gates, scanning) |
| Data governance | Art. 10 | Evaluated (deployer perspective) |
| Automatic logging | Art. 12 | Evaluated (git, audit trail, provenance) |
| Transparency | Art. 13 | Evaluated (Annex IV, changelog) |
| Human oversight | Art. 14 | Evaluated (review gates, dry-run, rollback) |
| Deployer obligations | Art. 26 | Evaluated (agent configs, monitoring) |
| Impact assessment (FRIA) | Art. 27 | Interactive generator with auto-detection |
| Technical documentation | Annex IV | Auto-populated generator from metadata |

### OWASP Agentic Top 10 — Current coverage

All 10 evaluated risks cover: access control, prompt injection, supply chain, logging, output handling, human oversight, sandboxing, resource consumption, error handling, and data exposure.

### Framework roadmap

| Framework | licit version | Status |
|---|---|---|
| EU AI Act | V0 (current) | Implemented |
| OWASP Agentic Top 10 | V0 (current) | Implemented |
| NIST AI RMF | V1 | Planned |
| ISO/IEC 42001 | V1 | Planned |
| SOC 2 AI Controls | V2 | Under evaluation |

---

## Security and data

### What data licit generates

| Data | Sensitivity | Recommendation |
|---|---|---|
| Provenance store (JSONL) | Medium (contributor names) | Do not version in public repos |
| FRIA data (JSON) | High (rights assessment) | Do not version; store in a secure system |
| Compliance reports | Low (metadata, not code) | Version; share with auditing |
| Annex IV | Low (technical documentation) | Version |
| Config changelog | Low (config changes) | Version |
| Signing key | Critical | Never version; permissions 600 |

### Security model

- **No network**: licit makes no HTTP requests, has no telemetry, does not phone home
- **Read-only**: Connectors only read; they never modify source code
- **No execution**: Does not compile, interpret, or execute analyzed code
- **Safe YAML**: Only uses `yaml.safe_load()` (no code execution)
- **Signed**: Optional HMAC-SHA256 for provenance integrity

---

## Integration with existing tools

### Security tools

| Tool | Integration with licit | How |
|---|---|---|
| **vigil** | Native connector | `licit connect vigil` — reads SARIF |
| **Semgrep** | Via SARIF | Generate `.sarif` and configure `sarif_path` |
| **Snyk** | Automatic detection | `ProjectDetector` detects `.snyk` |
| **CodeQL** | Automatic detection | Detects `.github/codeql/` |
| **Trivy** | Automatic detection | Detects Trivy config |

### AI tools

| Tool | Integration with licit | How |
|---|---|---|
| **Claude Code** | Session reader + git heuristics | Automatic provenance tracking |
| **Cursor** | Git heuristics + config monitoring | `.cursorrules` tracking |
| **GitHub Copilot** | Git heuristics + config monitoring | `.github/copilot-instructions.md` |
| **architect** | Native connector | `licit connect architect` — reads reports/audit/config |
| **GitHub Agents** | Config monitoring | `AGENTS.md` tracking |

### GRC platforms (Governance, Risk, Compliance)

licit generates JSON reports that can feed GRC platforms:

```bash
licit report --format json -o compliance-data.json
# → Parse with your GRC platform's API
```

The JSON contains: project metadata, per-framework results, compliance rates, gap analysis.

---

## Enterprise FAQ

### Does licit replace an audit?

**No.** licit automates the collection of technical evidence and generates regulatory documentation. Final compliance decisions must be reviewed by qualified professionals. licit is a tool for the auditor, not a substitute for the auditor.

### Is the licit report legally binding?

**No.** licit reports are supporting technical evidence. For EU AI Act legal obligations, formal legal review of the FRIA and technical documentation is required.

### Does it work in air-gapped environments?

**Yes.** licit requires no internet connection at any time. It only needs Python 3.12 and its 6 dependencies pre-installed.

### Does it support monorepos?

licit analyzes a root directory. For monorepos, run `licit init` in each project subdirectory or at the root as needed.

### What is the CI/CD execution cost?

`licit verify` typically takes 2-5 seconds on medium-sized projects (100-500 commits). `licit trace` can take 10-30 seconds on large repos (10,000+ commits). It requires no external services or API calls.

### How do you handle intellectual property of AI-generated code?

licit takes no legal position on IP. What it does is **track** which code was generated by AI (and by which model), which is the evidence needed for any IP analysis your legal team needs to perform.

---

## Support and community

- **Issues**: [github.com/Diego303/licit-cli/issues](https://github.com/Diego303/licit-cli/issues)
- **Documentation**: [docs/](.)
- **License**: MIT (commercial use permitted without restrictions)
- **Security**: [SECURITY.md](../SECURITY.md)
