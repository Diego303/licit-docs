---
title: "Architecture"
description: "System architecture, modules, implementation phases, and design decisions for licit."
order: 5
---

## Overview

licit is a standalone CLI tool that analyzes AI-assisted development projects to evaluate their regulatory compliance. It operates locally (filesystem-first), without requiring external services or databases.

```
licit (CLI)
├── config/          Pydantic v2 schema + YAML loader
├── core/            Domain models + detection + evidence
├── logging/         structlog configuration
├── provenance/      Code traceability (Phase 2)
├── changelog/       Agent config change tracking (Phase 3)
├── frameworks/      Regulatory evaluators (Phases 4-5)
│   ├── eu_ai_act/   EU AI Act
│   └── owasp_agentic/  OWASP Agentic Top 10
├── connectors/      Optional integrations (Phase 7)
└── reports/         Report generation (Phase 6)
```

## Technology Stack

| Component | Technology | Justification |
|---|---|---|
| CLI | Click 8.1+ | Command composition, types, automatic help |
| Config validation | Pydantic v2 | Strict validation, YAML/JSON serialization |
| Domain models | dataclasses | Lightweight, no dependencies, native typing |
| Enums | StrEnum (Python 3.12) | Direct string serialization, compatible with ruff UP042 |
| Logging | structlog | Structured logging, composable processors |
| Config | PyYAML | De facto standard for YAML config |
| Templates | Jinja2 | Markdown/HTML report generation |
| Crypto | cryptography | HMAC-SHA256 for provenance signatures |

## Design Principles

1. **Filesystem-first**: All data is stored in `.licit/` within the project. No databases, APIs, or remote services.

2. **Dataclasses for domain, Pydantic for config**: Domain models (`ProvenanceRecord`, `ControlResult`, etc.) are pure dataclasses. Only the configuration (`LicitConfig`) uses Pydantic v2.

3. **Protocol for interfaces**: Abstractions between modules use `typing.Protocol`, not inheritance with abstract classes.

4. **Lazy imports**: Commands for future phases use lazy imports with `try/except ImportError` so the CLI works without modules that are not yet implemented.

5. **Automatic detection**: `ProjectDetector` infers languages, frameworks, CI/CD, security tools, and AI agent configurations without manual configuration.

## Data Flow

```
User's project
       │
       ▼
┌─────────────────┐
│ ProjectDetector  │ ← Detects languages, frameworks, CI/CD, agents
└────────┬────────┘
         │ ProjectContext
         ▼
┌─────────────────┐
│EvidenceCollector │ ← Gathers evidence from .licit/, configs, SARIF
└────────┬────────┘
         │ EvidenceBundle
         ▼
┌─────────────────┐
│   Evaluators    │ ← EU AI Act, OWASP (Phases 4-5)
└────────┬────────┘
         │ ControlResult[]
         ▼
┌─────────────────┐
│    Reports      │ ← Markdown, JSON, HTML (Phase 6)
└─────────────────┘
```

## Implemented Modules (Phase 1)

### config/ — Configuration

- **`schema.py`**: 9 Pydantic v2 models with root class `LicitConfig`. All fields have sensible defaults.
- **`loader.py`**: Loads configuration with 3-level resolution: explicit path -> `.licit.yaml` in cwd -> defaults.
- **`defaults.py`**: Constants: `CONFIG_FILENAME`, `DATA_DIR`, `DEFAULTS` instance.

### core/ — Core

- **`models.py`**: 3 enums (`ComplianceStatus`, `ChangeSeverity`, `ProvenanceSource`) and 6 dataclasses (`ProvenanceRecord`, `ConfigChange`, `ControlRequirement`, `ControlResult`, `ComplianceSummary`, `GapItem`).
- **`project.py`**: `ProjectDetector` with 8 detection methods. Produces a complete `ProjectContext`.
- **`evidence.py`**: `EvidenceCollector` with 5 collection methods. Produces an `EvidenceBundle` with 18 fields.

### logging/ — Logging

- **`setup.py`**: Configures structlog with `WriteLoggerFactory`, WARNING level by default (DEBUG with `--verbose`).

### cli.py — Command Line Interface

10 commands registered with Click. Three functional: `init`, `status`, `connect`. The rest have complete signatures and help text, but their imports are lazy for future-phase modules.

## Implementation Phases

| Phase | Module | Status | Description |
|---|---|---|---|
| 1 | Foundation | **COMPLETED** | Config, models, detection, evidence, CLI, logging |
| 2 | Provenance | Pending | git_analyzer, heuristics, JSONL store, HMAC, attestation |
| 3 | Changelog | Pending | Agent config watcher, differ, classifier |
| 4 | EU AI Act | Pending | Evaluator, interactive FRIA, Annex IV |
| 5 | OWASP | Pending | OWASP Agentic Top 10 evaluator |
| 6 | Reports | Pending | Unified report, gap analyzer, Markdown/JSON/HTML |
| 7 | Connectors | Pending | Integration with architect and vigil |

## Dependency Graph

```
Phase 1: config ← core/models
         core/project (independent)
         core/evidence ← config + core/models + (provenance.store optional)
         cli ← config + core/* + logging

Phase 2: provenance ← core/models + config
Phase 3: changelog ← core/models + config
Phase 4: frameworks/eu_ai_act ← core/* + evidence
Phase 5: frameworks/owasp ← core/* + evidence
Phase 6: reports ← frameworks/* + evidence + core/models
Phase 7: connectors ← config (independent)
```

## Project Directory Structure

```
licit-cli/
├── pyproject.toml              # Metadata, deps, tools
├── LICENSE                     # MIT
├── README.md                   # README in English
├── CHANGELOG.md                # Changelog in English
├── SECURITY.md                 # Security policy
├── SEGUIMIENTO-V0.md           # Implementation tracking (Spanish)
├── docs/                       # This documentation
├── src/
│   └── licit/
│       ├── __init__.py         # __version__
│       ├── __main__.py         # python -m licit
│       ├── py.typed            # PEP 561
│       ├── cli.py              # Click CLI
│       ├── config/
│       │   ├── schema.py       # Pydantic models
│       │   ├── loader.py       # YAML load/save
│       │   └── defaults.py     # Constants
│       ├── core/
│       │   ├── models.py       # Dataclasses + enums
│       │   ├── project.py      # ProjectDetector
│       │   └── evidence.py     # EvidenceCollector
│       ├── logging/
│       │   └── setup.py        # structlog config
│       ├── provenance/         # (Phase 2)
│       ├── changelog/          # (Phase 3)
│       ├── frameworks/         # (Phases 4-5)
│       ├── connectors/         # (Phase 7)
│       └── reports/            # (Phase 6)
└── tests/
    ├── conftest.py             # Shared fixtures
    ├── test_cli.py             # CLI tests (13)
    ├── test_config/
    │   ├── test_schema.py      # Schema tests (7)
    │   └── test_loader.py      # Loader tests (9)
    └── test_core/
        ├── test_project.py     # Detection tests (12)
        └── test_evidence.py    # Evidence tests (11)
```
