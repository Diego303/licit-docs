---
title: "Connectors"
description: "Read-only integrations with external tools: Architect and Vigil."
order: 5
---

## Overview

Licit connectors are read-only integrations with external tools that enrich compliance evidence. They are **optional** — licit works completely without them — but when enabled, they provide data that improves the evaluation.

> **Principle**: Connectors **enrich, not enable**. No core functionality depends on a connector.

### Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    EvidenceCollector                      │
│                                                          │
│  ┌─────────────────┐   With LicitConfig   Without config│
│  │  _run_connectors │──┬── enabled ──→ Connector formal │
│  └─────────────────┘  │                                  │
│                        └── disabled ──→ Inline temporal  │
│                            or absent   (delegates to     │
│                                         connector class) │
└──────────────┬───────────────────────────┬──────────────┘
               │                           │
    ┌──────────▼──────────┐    ┌───────────▼──────────┐
    │ ArchitectConnector   │    │  VigilConnector       │
    │                      │    │                       │
    │ _read_reports()      │    │ _resolve_sarif_paths()│
    │ _read_audit_log()    │    │ _read_sarif()         │
    │ _read_config()       │    │ _read_sbom()          │
    └──────────────────────┘    └───────────────────────┘
```

### Connector Protocol

All connectors implement the `Connector` Protocol:

```python
@runtime_checkable
class Connector(Protocol):
    @property
    def name(self) -> str: ...        # "architect", "vigil"

    @property
    def enabled(self) -> bool: ...    # From config

    def available(self) -> bool: ...  # Data on disk?

    def collect(self, evidence: EvidenceBundle) -> ConnectorResult: ...
```

### ConnectorResult

Each execution of `collect()` returns a `ConnectorResult`:

```python
@dataclass
class ConnectorResult:
    connector_name: str
    files_read: int = 0
    errors: list[str] = field(default_factory=list)

    @property
    def success(self) -> bool:
        """True if it read >=1 file without errors."""
        return self.files_read > 0 and len(self.errors) == 0
```

---

## Architect Connector

### What is architect

[architect](https://github.com/Diego303/architect) is an autonomous coding agent that produces execution reports, audit logs, and a YAML config with guardrails and quality controls.

### Data sources

| Source | Format | What it extracts | Evidence |
|---|---|---|---|
| **Reports** | `reports_dir/*.json` | Completed tasks (task_id, model, cost, files) | `has_audit_trail`, `audit_entry_count` |
| **Audit log** | `audit_log` (JSONL) | Task lifecycle events | `has_audit_trail`, `audit_entry_count` |
| **Config** | `config_path` (YAML) | Guardrails, quality gates, budget, capabilities | `guardrail_count`, `has_quality_gates`, `has_budget_limits`, `has_dry_run`, `has_rollback` |

### Config fields extracted

```yaml
# .architect/config.yaml
model: claude-sonnet-4
provider: anthropic

guardrails:
  protected_files:              # → guardrail_count += N
    - .env
    - secrets.yaml
  blocked_commands:             # → guardrail_count += N
    - rm -rf
    - DROP TABLE
  code_rules:                   # → guardrail_count += N
    - no-eval
    - no-exec
  quality_gates:                # → has_quality_gates, quality_gate_count
    - lint
    - typecheck
    - test

costs:
  budget_usd: 50.0              # → has_budget_limits

dry_run: true                   # → has_dry_run (default True if absent)
rollback: true                  # → has_rollback (default True if absent)
```

> **Note**: `guardrail_count` is additive (`+=`). If other connectors also contribute guardrails, they are summed.

### JSON reports format

Each file in `reports_dir/` must be a JSON object with optional fields:

```json
{
  "task_id": "task-001",
  "status": "completed",
  "model": "claude-sonnet-4",
  "cost_usd": 0.42,
  "files_changed": ["src/auth.py", "tests/test_auth.py"],
  "timestamp": "2026-03-10T14:30:00Z"
}
```

All fields are optional. An empty `{}` is valid and counts as an audit entry.

### JSONL audit log format

Each line is an independent JSON object:

```jsonl
{"event": "task_start", "timestamp": "2026-03-10T14:00:00Z", "task_id": "task-001"}
{"event": "file_write", "timestamp": "2026-03-10T14:15:00Z", "path": "src/auth.py"}
{"event": "task_complete", "timestamp": "2026-03-10T14:30:00Z", "cost_usd": 0.42}
```

Malformed lines are logged as errors but do not abort the reading.

### Configuration

```yaml
connectors:
  architect:
    enabled: true
    reports_dir: .architect/reports         # Default
    config_path: .architect/config.yaml     # Default if not configured
    audit_log: .architect/audit.jsonl       # Optional
```

### Enabling

```bash
licit connect architect
# → architect data found at: .architect/reports
# → Connector 'architect' enabled.
```

`licit init` auto-detects `.architect/` and enables the connector automatically.

---

## Vigil Connector

### What is vigil

[vigil](https://github.com/vigil-ai/vigil) is a security scanner for AI-generated code that produces findings in SARIF format (Static Analysis Results Interchange Format).

### SARIF 2.1.0

The connector parses any SARIF 2.1.0 file, not just those from vigil. It works with Semgrep, CodeQL, Snyk, and any tool that produces standard SARIF.

### Path resolution

```
1. Explicit sarif_path (file) → reads it
2. Explicit sarif_path (directory) → reads all *.sarif
3. Auto-detected (ProjectContext.security.sarif_files) → reads non-duplicates
```

### Severity mapping

| SARIF Level | EvidenceBundle Field | Classification |
|---|---|---|
| `error` | `security_findings_critical` | Critical |
| `warning` | `security_findings_high` | High |
| `note` | (total only) | Medium |
| other | (total only) | Low |

### SBOM (Software Bill of Materials)

The connector reads SBOM in CycloneDX JSON format. In V0 it only validates the structure. In V1 it will feed the OWASP ASI03 (Supply Chain Vulnerabilities) evaluation.

```json
{
  "bomFormat": "CycloneDX",
  "specVersion": "1.4",
  "components": [
    {"type": "library", "name": "click", "version": "8.1.7"},
    {"type": "library", "name": "pydantic", "version": "2.6.0"}
  ]
}
```

### Configuration

```yaml
connectors:
  vigil:
    enabled: true
    sarif_path: reports/security/    # File or directory
    sbom_path: sbom.json             # CycloneDX JSON
```

### Enabling

```bash
licit connect vigil
# → vigil data found
# → Connector 'vigil' enabled.
```

`licit init` auto-detects `.vigil.yaml` and enables the connector automatically.

---

## How connectors feed compliance

### EU AI Act

| Article | Architect evidence | Vigil evidence |
|---|---|---|
| Art. 9 (Risks) | Guardrails, quality gates, budget | Security scanning present |
| Art. 12 (Logging) | Audit trail (reports + audit log) | — |
| Art. 13 (Transparency) | — | — |
| Art. 14 (Oversight) | Dry-run, rollback, quality gates | — |

### OWASP Agentic Top 10

| Risk | Architect evidence | Vigil evidence |
|---|---|---|
| ASI01 (Excessive Agency) | Guardrails, budget, quality gates | — |
| ASI02 (Prompt Injection) | Guardrails | Security findings |
| ASI03 (Supply Chain) | — | SBOM (V1) |
| ASI04 (Logging) | Audit trail | — |
| ASI07 (Sandboxing) | Guardrails (blocked commands) | — |
| ASI10 (Data Exposure) | Protected files | Security scanning |

---

## Developing a custom connector (V1)

In V1, the plugin system will allow registering custom connectors. The interface will be:

```python
from licit.connectors.base import Connector, ConnectorResult
from licit.core.evidence import EvidenceBundle

class MyConnector:
    name = "my-tool"

    def __init__(self, root_dir: str, config: MyConfig) -> None:
        self.root = Path(root_dir)
        self.config = config

    @property
    def enabled(self) -> bool:
        return self.config.enabled

    def available(self) -> bool:
        return (self.root / ".my-tool.yaml").exists()

    def collect(self, evidence: EvidenceBundle) -> ConnectorResult:
        result = ConnectorResult(connector_name=self.name)
        # ... read data and enrich evidence ...
        return result
```

The connector must:
1. Implement the complete `Connector` Protocol
2. Mutate `evidence` in-place (do not return a new bundle)
3. Report files read and errors in `ConnectorResult`
4. Gracefully handle missing or malformed files
5. Use `encoding="utf-8"` for all reads
6. Log with `structlog.get_logger()`
