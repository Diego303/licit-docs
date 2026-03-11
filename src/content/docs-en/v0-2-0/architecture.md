---
title: "Architecture"
description: "System architecture, modules, phases, and design decisions."
order: 3
---

## Overview

licit is a standalone CLI tool that analyzes AI-assisted development projects to assess their regulatory compliance. It operates locally (filesystem-first), without requiring external services or databases.

```
licit (CLI)
├── config/          Pydantic v2 schema + YAML loader
├── core/            Domain models + detection + evidence
├── logging/         structlog configuration
├── provenance/      Code traceability (Phase 2 — COMPLETED)
├── changelog/       Agent config change tracking (Phase 3)
├── frameworks/      Regulatory evaluators (Phases 4-5)
│   ├── eu_ai_act/   EU AI Act
│   └── owasp_agentic/  OWASP Agentic Top 10
├── connectors/      Optional integrations (Phase 7)
└── reports/         Report generation (Phase 6)
```

## Technology Stack

| Component | Technology | Rationale |
|---|---|---|
| CLI | Click 8.1+ | Command composition, types, auto-generated help |
| Config validation | Pydantic v2 | Strict validation, YAML/JSON serialization |
| Domain models | dataclasses | Lightweight, no dependencies, native typing |
| Enums | StrEnum (Python 3.12) | Direct string serialization, compatible with ruff UP042 |
| Logging | structlog | Structured logging, composable processors |
| Config | PyYAML | De facto standard for YAML config |
| Templates | Jinja2 | Markdown/HTML report generation |
| Crypto | cryptography | HMAC-SHA256 for provenance signatures |

## Design Principles

1. **Filesystem-first**: All data is stored in `.licit/` within the project. No databases, APIs, or remote services.

2. **Dataclasses for domain, Pydantic for config**: Domain models (`ProvenanceRecord`, `ControlResult`, etc.) are pure dataclasses. Only configuration (`LicitConfig`) uses Pydantic v2.

3. **Protocol for interfaces**: Abstractions between modules use `typing.Protocol`, not inheritance with abstract classes.

4. **Lazy imports**: Commands for future phases use lazy imports with `try/except ImportError` so the CLI works without modules that are not yet implemented.

5. **Automatic detection**: `ProjectDetector` infers languages, frameworks, CI/CD, security tools, and AI agent configurations without manual configuration.

## Data Flow

```
User's project
       │
       ├──────────────────────────────────────┐
       ▼                                      ▼
┌─────────────────┐                  ┌──────────────────┐
│ ProjectDetector  │                  │ProvenanceTracker  │
│                  │                  │                    │
│ Detects languages│                  │ ┌──────────────┐  │
│ frameworks, CI/CD│                  │ │ GitAnalyzer   │  │ ← git log
│ agents           │                  │ │  + Heuristics │  │
└────────┬────────┘                  │ └──────┬───────┘  │
         │ ProjectContext             │        │          │
         ▼                           │ ┌──────────────┐  │
┌─────────────────┐                  │ │SessionReaders │  │ ← ~/.claude/
│EvidenceCollector │                  │ └──────┬───────┘  │
│                  │                  │        │          │
│ .licit/, configs │                  │ ┌──────────────┐  │
│ SARIF, architect │                  │ │  Attestor    │  │ ← HMAC sign
└────────┬────────┘                  │ └──────┬───────┘  │
         │ EvidenceBundle             │        │          │
         ▼                           │ ┌──────────────┐  │
┌─────────────────┐                  │ │    Store     │  │ → provenance.jsonl
│   Evaluators    │ ← Phases 4-5    │ └──────────────┘  │
└────────┬────────┘                  └──────────┬───────┘
         │ ControlResult[]                      │
         ▼                                      ▼
┌─────────────────┐                  ┌──────────────────┐
│   Reports       │ ← Phase 6       │ Provenance Report │
└─────────────────┘                  └──────────────────┘
```

## Implemented Modules (Phases 1-2)

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

### provenance/ — Code Traceability

- **`heuristics.py`**: Engine with 6 heuristics for AI commit detection (author, message, bulk, co-author, file patterns, time). Weighted average of signaling heuristics only. Supports custom patterns from JSON.
- **`git_analyzer.py`**: Parses `git log` with `\x00`/`\x01` separators for robustness. `CommitInfo` dataclass. Agent inference (8 patterns) and model inference (8 regex). Classification: >=0.7 -> "ai", >=0.5 -> "mixed", <0.5 -> "human".
- **`store.py`**: Append-only JSONL store. Operations: `append()`, `load_all()`, `get_stats()`, `get_by_file()`. Deduplication by latest timestamp.
- **`attestation.py`**: HMAC-SHA256 for individual signing, Merkle tree for batch signing. Key management with automatic generation.
- **`tracker.py`**: Orchestrator that combines git analysis + session reading + confidence filtering + signing + store.
- **`report.py`**: Markdown report generator with summary, AI tools, models, file details.
- **`session_readers/base.py`**: `SessionReader` Protocol for extensibility.
- **`session_readers/claude_code.py`**: Reads Claude Code sessions (JSONL) from `~/.claude/projects/`.

### cli.py — Command-Line Interface

10 commands registered with Click. Four functional: `init`, `status`, `connect`, `trace`. The rest have complete signatures and help text, but their imports are lazy for modules from future phases.

## Implementation Phases

| Phase | Module | Status | Description |
|---|---|---|---|
| 1 | Foundation | **COMPLETED** | Config, models, detection, evidence, CLI, logging |
| 2 | Provenance | **COMPLETED** | git_analyzer, heuristics, JSONL store, HMAC, attestation, session readers, report |
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

Phase 2: provenance ← core/models + config (COMPLETED)
         provenance/heuristics (independent)
         provenance/git_analyzer ← heuristics + core/models
         provenance/store ← core/models
         provenance/attestation (independent)
         provenance/session_readers ← core/models
         provenance/tracker ← git_analyzer + session_readers + attestation + store + config
         provenance/report ← core/models
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
│       ├── provenance/         # Phase 2 (COMPLETED)
│       │   ├── heuristics.py   # 6 AI detection heuristics
│       │   ├── git_analyzer.py # Git history analysis
│       │   ├── store.py        # Append-only JSONL store
│       │   ├── attestation.py  # HMAC-SHA256 + Merkle tree
│       │   ├── tracker.py      # Orchestrator
│       │   ├── report.py       # Markdown report generator
│       │   └── session_readers/
│       │       ├── base.py     # Protocol SessionReader
│       │       └── claude_code.py  # Claude Code JSONL reader
│       ├── changelog/          # (Phase 3)
│       ├── frameworks/         # (Phases 4-5)
│       ├── connectors/         # (Phase 7)
│       └── reports/            # (Phase 6)
└── tests/
    ├── conftest.py             # Shared fixtures
    ├── test_cli.py             # CLI tests (13)
    ├── test_qa_edge_cases.py   # QA Phase 1 tests (61)
    ├── test_config/
    │   ├── test_schema.py      # Schema tests (7)
    │   └── test_loader.py      # Loader tests (9)
    ├── test_core/
    │   ├── test_project.py     # Detection tests (12)
    │   └── test_evidence.py    # Evidence tests (11)
    └── test_provenance/
        ├── test_heuristics.py      # Heuristics tests (23)
        ├── test_git_analyzer.py    # Git analyzer tests (15)
        ├── test_store.py           # JSONL store tests (15)
        ├── test_attestation.py     # Attestation tests (13)
        ├── test_tracker.py         # Tracker tests (7)
        ├── test_session_reader.py  # Session reader tests (13)
        ├── test_qa_edge_cases.py   # QA Phase 2 tests (81)
        └── fixtures/               # Test data
```
