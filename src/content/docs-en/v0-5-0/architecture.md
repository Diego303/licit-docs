---
title: "Architecture"
description: "System architecture, modules, phases, and design decisions."
order: 3
---

## Overview

licit is a standalone CLI tool that analyzes AI-assisted development projects to evaluate their regulatory compliance. It operates locally (filesystem-first), without requiring external services or databases.

```
licit (CLI)
├── config/          Pydantic v2 schema + YAML loader
├── core/            Domain models + detection + evidence
├── logging/         structlog configuration
├── provenance/      Code traceability (Phase 2 — COMPLETED)
├── changelog/       Agent config change tracking (Phase 3 — COMPLETED)
├── frameworks/      Regulatory evaluators (Phases 4-5 COMPLETED)
│   ├── base.py          Protocol ComplianceFramework
│   ├── registry.py      Framework registry
│   ├── eu_ai_act/   EU AI Act (Phase 4 — COMPLETED)
│   └── owasp_agentic/  OWASP Agentic Top 10 (Phase 5 — COMPLETED)
├── connectors/      Optional integrations (Phase 7)
└── reports/         Report generation (Phase 6)
```

## Technology Stack

| Component | Technology | Justification |
|---|---|---|
| CLI | Click 8.1+ | Command composition, types, automatic help |
| Config validation | Pydantic v2 | Strict validation, YAML/JSON serialization |
| Domain models | dataclasses | Lightweight, no dependencies, native typing |
| Enums | StrEnum (Python 3.12) | Direct string serialization, ruff UP042 compatible |
| Logging | structlog | Structured logging, composable processors |
| Config | PyYAML | De facto standard for YAML config |
| Templates | Jinja2 | Markdown/HTML report generation |
| Crypto | cryptography | HMAC-SHA256 for provenance signing |

## Design Principles

1. **Filesystem-first**: All data is stored in `.licit/` within the project. No databases, APIs, or remote services.

2. **Dataclasses for domain, Pydantic for config**: Domain models (`ProvenanceRecord`, `ControlResult`, etc.) are pure dataclasses. Only configuration (`LicitConfig`) uses Pydantic v2.

3. **Protocol for interfaces**: Abstractions between modules use `typing.Protocol`, not inheritance with abstract classes.

4. **Lazy imports**: Commands for future phases use lazy imports with `try/except ImportError` so the CLI works without the modules that are not yet implemented.

5. **Automatic detection**: `ProjectDetector` infers languages, frameworks, CI/CD, security tools, and AI agent configurations without requiring manual configuration.

## Data Flow

```
User's project
       │
       ├──────────────────────────────────────┬─────────────────────┐
       ▼                                      ▼                     ▼
┌─────────────────┐                  ┌──────────────────┐  ┌───────────────────┐
│ ProjectDetector  │                  │ProvenanceTracker  │  │  ConfigWatcher     │
│                  │                  │                    │  │                    │
│ Detects languages│                  │ ┌──────────────┐  │  │ git log --follow   │
│ frameworks, CI/CD│                  │ │ GitAnalyzer   │  │  │ → ConfigSnapshot[] │
│ agents           │                  │ │  + Heuristics │  │  └────────┬──────────┘
└────────┬────────┘                  │ └──────┬───────┘  │           │
         │ ProjectContext             │        │          │  ┌────────▼──────────┐
         ▼                           │ ┌──────────────┐  │  │  Semantic Differ   │
┌─────────────────┐                  │ │SessionReaders │  │  │  (YAML/JSON/MD)    │
│EvidenceCollector │                  │ └──────┬───────┘  │  └────────┬──────────┘
│                  │                  │        │          │           │ FieldDiff[]
│ .licit/, configs │                  │ ┌──────────────┐  │  ┌────────▼──────────┐
│ SARIF, architect │                  │ │  Attestor    │  │  │ ChangeClassifier   │
└────────┬────────┘                  │ └──────┬───────┘  │  │ (MAJOR/MINOR/PATCH)│
         │ EvidenceBundle             │        │          │  └────────┬──────────┘
         ▼                           │ ┌──────────────┐  │           │ ConfigChange[]
┌─────────────────┐                  │ │    Store     │  │  ┌────────▼──────────┐
│   Evaluators    │ ← Phases 4-5    │ └──────────────┘  │  │ ChangelogRenderer  │
└────────┬────────┘                  └──────────┬───────┘  │ (Markdown / JSON)  │
         │ ControlResult[]                      │          └────────┬──────────┘
         ▼                                      ▼                   ▼
┌─────────────────┐                  ┌──────────────────┐  ┌───────────────────┐
│   Reports       │ ← Phase 6       │ Provenance Report │  │ changelog.md/json  │
└─────────────────┘                  └──────────────────┘  └───────────────────┘
```

## Implemented Modules (Phases 1-5)

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
- **`tracker.py`**: Orchestrator combining git analysis + session reading + confidence filtering + signing + store.
- **`report.py`**: Markdown report generator with summary, AI tools, models, and file details.
- **`session_readers/base.py`**: Protocol `SessionReader` for extensibility.
- **`session_readers/claude_code.py`**: Reads Claude Code sessions (JSONL) from `~/.claude/projects/`.

### changelog/ — Agent Config Changelog

- **`watcher.py`**: `ConfigWatcher` monitors configuration files through git history. `ConfigSnapshot` dataclass. 1 MB size guard, explicit timeouts, deduplication.
- **`differ.py`**: Semantic diffing by format: YAML/JSON (recursive dict), Markdown (sections with code block awareness), plain text. `FieldDiff` dataclass. `_coerce_to_dict()` for non-dict roots.
- **`classifier.py`**: MAJOR/MINOR/PATCH classification with segment matching (`_field_matches`). Escalation on deletion. UTC timestamps.
- **`renderer.py`**: Rendering in Markdown (grouped by file, sorted by severity) and JSON (`ensure_ascii=False`).

### frameworks/ — Compliance Evaluators

- **`base.py`**: Protocol `ComplianceFramework` (`@runtime_checkable`). Defines interface: `name`, `version`, `description`, `get_requirements()`, `evaluate()`.
- **`registry.py`**: `FrameworkRegistry` — global registry with `register()`, `get()`, `list_all()`. Singleton via `get_registry()`.
- **`eu_ai_act/requirements.py`**: 11 `ControlRequirement` (Art. 9, 10, 12, 13, 14, 14(4)(a), 14(4)(d), 26, 26(5), 27, Annex IV). Helpers: `get_requirement()`, `get_requirements_by_category()`.
- **`eu_ai_act/evaluator.py`**: `EUAIActEvaluator` — dynamic dispatch via `getattr(self, f"_eval_{id}")`. Per-article scoring with `_score_to_status(score, compliant_at, partial_at)`.
- **`eu_ai_act/fria.py`**: `FRIAGenerator` — interactive 5-step questionnaire, 16 questions, auto-detection of 8 fields, Jinja2 report generation.
- **`eu_ai_act/annex_iv.py`**: `AnnexIVGenerator` — auto-populates technical documentation from project metadata (27 template variables).
- **`eu_ai_act/templates/`**: 3 Jinja2 templates (FRIA report, Annex IV, report section).
- **`owasp_agentic/requirements.py`**: 10 `ControlRequirement` (ASI01-ASI10). 10 categories: access-control, input-security, supply-chain, observability, output-security, human-oversight, isolation, resource-limits, error-handling, data-protection.
- **`owasp_agentic/evaluator.py`**: `OWASPAgenticEvaluator` — dynamic dispatch via `getattr(self, f"_eval_{id}")`. Per-control scoring with variable thresholds (ASI08/ASI09 use `compliant_at=2`, the rest `compliant_at=3`). Helpers: `_score_to_status()`, `_safe_float()`.
- **`owasp_agentic/templates/`**: 1 Jinja2 template (report section, aligned with EU AI Act).

### cli.py — Command Line Interface

10 commands registered with Click. Eight functional: `init`, `status`, `connect`, `trace`, `changelog`, `fria`, `annex-iv`, `verify`. The remaining (`report`, `gaps`) have full signatures and help text but depend on modules from future phases. `verify` evaluates both EU AI Act and OWASP Agentic Top 10.

## Implementation Phases

| Phase | Module | Status | Description |
|---|---|---|---|
| 1 | Foundation | **COMPLETED** | Config, models, detection, evidence, CLI, logging |
| 2 | Provenance | **COMPLETED** | git_analyzer, heuristics, JSONL store, HMAC, attestation, session readers, report |
| 3 | Changelog | **COMPLETED** | watcher, semantic differ, classifier (MAJOR/MINOR/PATCH), renderer (MD/JSON) |
| 4 | EU AI Act | **COMPLETED** | Protocol, registry, evaluator (11 articles), interactive FRIA, Annex IV, Jinja2 templates |
| 5 | OWASP | **COMPLETED** | OWASP Agentic Top 10 evaluator (10 controls), risk-based scoring, Jinja2 template |
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
Phase 3: changelog ← core/models + config (COMPLETED)
         changelog/watcher ← subprocess (git)
         changelog/differ ← yaml + json (independent)
         changelog/classifier ← differ + core/models
         changelog/renderer ← core/models
Phase 4: frameworks/eu_ai_act ← core/* + evidence (COMPLETED)
         frameworks/base.py (independent — Protocol)
         frameworks/registry.py ← base.py
         eu_ai_act/requirements.py ← core/models
         eu_ai_act/evaluator.py ← requirements + core/* + evidence
         eu_ai_act/fria.py ← core/project + core/evidence + jinja2
         eu_ai_act/annex_iv.py ← core/project + core/evidence + jinja2
Phase 5: frameworks/owasp ← core/* + evidence + frameworks/base (COMPLETED)
         owasp_agentic/requirements.py ← core/models
         owasp_agentic/evaluator.py ← requirements + core/* + evidence
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
│       ├── changelog/          # Phase 3 (COMPLETED)
│       │   ├── watcher.py      # Git monitoring of agent configs
│       │   ├── differ.py       # Semantic diffing (YAML/JSON/MD/text)
│       │   ├── classifier.py   # MAJOR/MINOR/PATCH classification
│       │   └── renderer.py     # Markdown + JSON rendering
│       ├── frameworks/         # Phases 4-5 (COMPLETED)
│       │   ├── base.py        # Protocol ComplianceFramework
│       │   ├── registry.py    # FrameworkRegistry
│       │   ├── eu_ai_act/     # EU AI Act (Phase 4)
│       │   │   ├── requirements.py  # 11 evaluable requirements
│       │   │   ├── evaluator.py     # Per-article evaluator
│       │   │   ├── fria.py          # Interactive FRIA generator
│       │   │   ├── annex_iv.py      # Annex IV generator
│       │   │   └── templates/       # Jinja2 (FRIA, Annex IV, report section)
│       │   └── owasp_agentic/ # OWASP Agentic Top 10 (Phase 5)
│       │       ├── requirements.py  # 10 risks as ControlRequirements
│       │       ├── evaluator.py     # Per-security-risk evaluator
│       │       └── templates/       # Jinja2 (report section)
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
    ├── test_provenance/
    │   ├── test_heuristics.py      # Heuristics tests (23)
    │   ├── test_git_analyzer.py    # Git analyzer tests (15)
    │   ├── test_store.py           # JSONL store tests (15)
    │   ├── test_attestation.py     # Attestation tests (13)
    │   ├── test_tracker.py         # Tracker tests (7)
    │   ├── test_session_reader.py  # Session reader tests (13)
    │   ├── test_qa_edge_cases.py   # QA Phase 2 tests (81)
    │   └── fixtures/               # Test data
    ├── test_changelog/
    │   ├── test_watcher.py         # Watcher tests (12)
    │   ├── test_differ.py          # Differ tests (19)
    │   ├── test_classifier.py      # Classifier tests (22)
    │   ├── test_renderer.py        # Renderer tests (10)
    │   ├── test_integration.py     # Integration tests (3)
    │   ├── test_qa_edge_cases.py   # QA Phase 3 tests (27)
    │   └── fixtures/               # Test data
    └── test_frameworks/
        ├── test_eu_ai_act/
        │   ├── test_evaluator.py       # Evaluator tests (32)
        │   ├── test_fria.py            # FRIA tests (23)
        │   ├── test_annex_iv.py        # Annex IV tests (17)
        │   ├── test_requirements.py    # Requirements tests (9)
        │   └── test_qa_edge_cases.py   # QA Phase 4 tests (43)
        └── test_owasp/
            ├── test_evaluator.py       # OWASP evaluator tests (40)
            ├── test_requirements.py    # OWASP requirements tests (15)
            └── test_qa_edge_cases.py   # QA Phase 5 tests (48)
```
