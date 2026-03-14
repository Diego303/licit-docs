---
title: "Development"
description: "Contributor guide: environment setup, testing, linting, and code conventions."
order: 11
---

Guide for contributors and developers who want to work on licit.

---

## Prerequisites

- **Python 3.12+** (required; the project uses `StrEnum` and other 3.12 features)
- **Git** (for project detection tests)
- **pip** (comes with Python)

Verify your version:
```bash
python3.12 --version
# Python 3.12.x
```

---

## Environment Setup

```bash
# Clone the repository
git clone https://github.com/Diego303/licit-cli.git
cd licit-cli

# Install in development mode with dev dependencies
python3.12 -m pip install -e ".[dev]"

# Verify the installation
licit --version
# licit, version 0.4.0
```

### Development Dependencies

| Package | Version | Purpose |
|---|---|---|
| pytest | 8.0+ | Testing framework |
| pytest-cov | 5.0+ | Code coverage |
| ruff | 0.4+ | Linter and formatter |
| mypy | 1.9+ | Strict type checking |

---

## Development Commands

```bash
# Tests
python3.12 -m pytest tests/ -q              # Run all tests
python3.12 -m pytest tests/ -q -x           # Stop at first failure
python3.12 -m pytest tests/test_cli.py -q   # Only CLI tests
python3.12 -m pytest tests/ -q --tb=short   # Short tracebacks
python3.12 -m pytest tests/ --cov=licit     # With coverage

# Linting
python3.12 -m ruff check src/licit/        # Check for errors
python3.12 -m ruff check src/licit/ --fix  # Auto-fix

# Type checking
python3.12 -m mypy src/licit/ --strict     # Check types (strict mode)

# CLI
python3.12 -m licit --help                  # General help
python3.12 -m licit init                    # Test init
python3.12 -m licit status                  # Test status
```

---

## Code Structure

```
src/licit/
├── __init__.py         # __version__ = "0.4.0"
├── __main__.py         # Entry point: python -m licit
├── py.typed            # PEP 561 marker
├── cli.py              # All Click commands
├── config/
│   ├── schema.py       # Pydantic v2 models (LicitConfig, etc.)
│   ├── loader.py       # load_config(), save_config()
│   └── defaults.py     # DEFAULTS, CONFIG_FILENAME, DATA_DIR
├── core/
│   ├── models.py       # Enums + domain dataclasses
│   ├── project.py      # ProjectDetector
│   └── evidence.py     # EvidenceCollector + EvidenceBundle
├── logging/
│   └── setup.py        # setup_logging(verbose)
├── provenance/         # Phase 2 (COMPLETED)
│   ├── heuristics.py   # 6 AI detection heuristics
│   ├── git_analyzer.py # Git history analysis
│   ├── store.py        # Append-only JSONL store
│   ├── attestation.py  # HMAC-SHA256 + Merkle tree
│   ├── tracker.py      # Provenance orchestrator
│   ├── report.py       # Markdown report generator
│   └── session_readers/
│       ├── base.py     # Protocol SessionReader
│       └── claude_code.py  # Claude Code reader
├── changelog/          # Phase 3 (COMPLETED)
│   ├── watcher.py      # Git monitoring of agent configs
│   ├── differ.py       # Semantic diffing (YAML/JSON/MD/text)
│   ├── classifier.py   # MAJOR/MINOR/PATCH classification
│   └── renderer.py     # Markdown + JSON rendering
├── frameworks/         # Phase 4 (COMPLETED)
│   ├── base.py        # Protocol ComplianceFramework
│   ├── registry.py    # FrameworkRegistry
│   └── eu_ai_act/     # EU AI Act evaluator, FRIA, Annex IV
│       ├── requirements.py
│       ├── evaluator.py
│       ├── fria.py
│       ├── annex_iv.py
│       └── templates/  # Jinja2 templates
├── connectors/         # Phase 7
└── reports/            # Phase 6
```

---

## Code Conventions

### 1. Pydantic Only for Configuration

```python
# Correct — config uses Pydantic
class ProvenanceConfig(BaseModel):
    enabled: bool = True

# Correct — domain uses dataclasses
@dataclass
class ProvenanceRecord:
    file_path: str
    source: str
```

### 2. StrEnum for Enums

```python
# Correct — Python 3.12+
class ComplianceStatus(StrEnum):
    COMPLIANT = "compliant"

# Incorrect — ruff UP042
class ComplianceStatus(str, Enum):
    COMPLIANT = "compliant"
```

### 3. Protocols for Interfaces

```python
# Correct — typing.Protocol
class Evaluator(Protocol):
    def evaluate(self, evidence: EvidenceBundle) -> list[ControlResult]: ...

# Incorrect — ABC
class Evaluator(ABC):
    @abstractmethod
    def evaluate(self, evidence: EvidenceBundle) -> list[ControlResult]: ...
```

### 4. structlog for Logging

```python
import structlog
logger = structlog.get_logger()

# Correct — events + structured data
logger.info("config_loaded", path=str(config_path), framework="eu-ai-act")

# Incorrect — free-text messages
logger.info(f"Config loaded from {config_path} for framework eu-ai-act")
```

### 5. Lazy Imports for Future Modules

When a command needs a module that does not yet exist, use lazy imports with `type: ignore`:

```python
@main.command()
def my_command() -> None:
    """Command depending on future phase."""
    from licit.reports.unified import (  # type: ignore[import-not-found]
        UnifiedReportGenerator,
    )
    generator: Any = UnifiedReportGenerator(...)
```

> **Note**: Modules from Phases 2-4 (provenance, changelog, eu_ai_act) are already implemented and imported directly without `type: ignore`. Only `reports/` (Phase 6) and `owasp_agentic/` (Phase 5) use lazy stubs.

### 6. Ruff and mypy

- **ruff** with rules: `E` (errors), `F` (f-strings), `I` (imports), `UP` (upgrades)
- **mypy** in `--strict` mode
- Maximum line length: 100 characters
- Target: Python 3.12

---

## Testing

### Test Structure

```
tests/
├── conftest.py                     # Shared fixtures
├── test_cli.py                     # 13 tests
├── test_qa_edge_cases.py           # 61 tests (QA Phase 1)
├── test_config/
│   ├── test_schema.py              # 7 tests
│   └── test_loader.py              # 9 tests
├── test_core/
│   ├── test_project.py             # 12 tests
│   └── test_evidence.py            # 11 tests
├── test_provenance/
│   ├── test_heuristics.py          # 23 tests
│   ├── test_git_analyzer.py        # 15 tests
│   ├── test_store.py               # 15 tests
│   ├── test_attestation.py         # 13 tests
│   ├── test_tracker.py             # 7 tests
│   ├── test_session_reader.py      # 13 tests
│   ├── test_qa_edge_cases.py       # 81 tests (QA Phase 2)
│   └── fixtures/                   # Test data
├── test_changelog/
│   ├── test_watcher.py             # 12 tests
│   ├── test_differ.py              # 19 tests
│   ├── test_classifier.py          # 22 tests
│   ├── test_renderer.py            # 10 tests
│   ├── test_integration.py         # 3 tests
│   ├── test_qa_edge_cases.py       # 27 tests (QA Phase 3)
│   └── fixtures/                   # Test data
└── test_frameworks/
    └── test_eu_ai_act/
        ├── test_evaluator.py       # 32 tests
        ├── test_fria.py            # 23 tests
        ├── test_annex_iv.py        # 17 tests
        ├── test_requirements.py    # 9 tests
        └── test_qa_edge_cases.py   # 43 tests (QA Phase 4)
```

**Total: 497 tests**

### Available Fixtures (conftest.py)

```python
# Temporary project with pyproject.toml
def tmp_project(tmp_path) -> Path: ...

# Temporary project with git initialized
def git_project(tmp_path) -> Path: ...

# ProjectContext factory
def make_context(root_dir, name, languages, ...) -> ProjectContext: ...

# EvidenceBundle factory
def make_evidence(has_provenance, has_fria, ...) -> EvidenceBundle: ...
```

### Log Suppression in Tests

Tests configure structlog at CRITICAL level to avoid noise:

```python
# tests/conftest.py
structlog.configure(
    wrapper_class=structlog.make_filtering_bound_logger(logging.CRITICAL),
    cache_logger_on_first_use=False,
)
```

### Writing a New Test

```python
# tests/test_core/test_my_module.py

def test_my_feature(tmp_project: Path) -> None:
    """Clear description of what is being tested."""
    # Arrange
    (tmp_project / "CLAUDE.md").write_text("# Agent config")

    # Act
    result = my_function(str(tmp_project))

    # Assert
    assert result.expected_value == "something"
```

### Tests with Click CLI

```python
from click.testing import CliRunner
from licit.cli import main

def test_my_command(tmp_path: Path) -> None:
    runner = CliRunner()
    with runner.isolated_filesystem(temp_dir=tmp_path):
        result = runner.invoke(main, ["my-command", "--flag"])
        assert result.exit_code == 0
        assert "expected text" in result.output
```

---

## Adding a New CLI Command

1. Define the command in `src/licit/cli.py`:

```python
@main.command()
@click.pass_context
def my_command(ctx: click.Context) -> None:
    """Command description."""
    config = ctx.obj["config"]
    # ... implementation ...
    click.echo("Done.")
```

2. Add tests in `tests/test_cli.py`:

```python
def test_my_command(tmp_path: Path) -> None:
    runner = CliRunner()
    with runner.isolated_filesystem(temp_dir=tmp_path):
        result = runner.invoke(main, ["my-command"])
        assert result.exit_code == 0
```

3. Verify:

```bash
python3.12 -m pytest tests/test_cli.py -q
python3.12 -m ruff check src/licit/cli.py
python3.12 -m mypy src/licit/cli.py --strict
```

---

## Adding a New Configuration Model

1. Define the model in `src/licit/config/schema.py`:

```python
class MyConfig(BaseModel):
    enabled: bool = True
    my_field: str = "default"
```

2. Add it to `LicitConfig`:

```python
class LicitConfig(BaseModel):
    # ... existing fields ...
    my_config: MyConfig = Field(default_factory=MyConfig)
```

3. Add tests in `tests/test_config/test_schema.py`.

---

## Recommended Workflow

```
1. Create a feature branch
   git checkout -b feat/my-feature

2. Implement
   - Code in src/licit/
   - Tests in tests/

3. Verify
   python3.12 -m pytest tests/ -q      # 497+ tests passing
   python3.12 -m ruff check src/licit/  # All checks passed
   python3.12 -m mypy src/licit/ --strict  # No issues found

4. Commit and PR
   git add src/licit/ tests/
   git commit -m "feat: my new feature"
```

---

## Implementation Phases

| Phase | Modules | Directory | Status |
|---|---|---|---|
| 1 | `cli.py`, `config/`, `core/`, `logging/` | multiple | **COMPLETED** |
| 2 | `heuristics.py`, `git_analyzer.py`, `store.py`, `attestation.py`, `tracker.py`, `report.py`, `session_readers/` | `provenance/` | **COMPLETED** |
| 3 | `watcher.py`, `differ.py`, `classifier.py`, `renderer.py` | `changelog/` | **COMPLETED** |
| 4 | `base.py`, `registry.py`, `requirements.py`, `evaluator.py`, `fria.py`, `annex_iv.py`, `templates/` | `frameworks/`, `frameworks/eu_ai_act/` | **COMPLETED** |
| 5 | `requirements.py`, `evaluator.py`, `templates/` | `frameworks/owasp_agentic/` | Pending |
| 6 | `unified.py`, `gap_analyzer.py`, `markdown.py`, `json_fmt.py`, `html.py` | `reports/` | Pending |
| 7 | `base.py`, `architect.py`, `vigil.py` | `connectors/` | Pending |

Each phase has its detailed section in the implementation plan.
