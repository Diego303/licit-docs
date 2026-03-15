---
title: "Data Models"
description: "Enums, dataclasses, and Pydantic schemas used internally."
order: 16
---

# Data models

licit separates its models into two categories by design:
- **Pydantic v2**: Only for configuration (strict validation, YAML/JSON serialization).
- **Dataclasses**: For domain models (lightweight, no external dependencies).

---

## Enums

All enums use `StrEnum` (Python 3.12+) for direct string serialization.

### ComplianceStatus

Compliance status of a regulatory requirement.

```python
class ComplianceStatus(StrEnum):
    COMPLIANT     = "compliant"       # Requirement fully met
    PARTIAL       = "partial"         # Requirement partially met
    NON_COMPLIANT = "non-compliant"   # Requirement not met
    NOT_APPLICABLE = "n/a"            # Requirement does not apply to the project
    NOT_EVALUATED = "not-evaluated"   # Requirement not yet evaluated
```

**Usage**: In `ControlResult.status` and `GapItem.status`.

### ChangeSeverity

Severity of a change in an AI agent configuration.

```python
class ChangeSeverity(StrEnum):
    MAJOR = "major"   # Model change, guardrail removal
    MINOR = "minor"   # Prompt change, new rule added
    PATCH = "patch"   # Parameter tweak, formatting
```

**Usage**: In `ConfigChange.severity`.

### ProvenanceSource

Method by which code provenance was determined.

```python
class ProvenanceSource(StrEnum):
    GIT_INFER   = "git-infer"     # Inferred by git heuristics
    SESSION_LOG = "session-log"   # Read from agent session logs
    GIT_AI      = "git-ai"        # git-ai annotations
    MANUAL      = "manual"        # Manually annotated
    CONNECTOR   = "connector"     # Information from architect/vigil
```

**Usage**: In `ProvenanceRecord.method`.

---

## Domain dataclasses

### ProvenanceRecord

Provenance record for a file or code fragment.

```python
@dataclass
class ProvenanceRecord:
    file_path: str                              # Path to the file
    source: str                                 # "ai", "human", "mixed"
    confidence: float                           # Confidence (0.0-1.0)
    method: ProvenanceSource                    # How it was determined
    timestamp: datetime                         # When it was recorded
    lines_range: tuple[int, int] | None = None  # Line range (optional)
    model: str | None = None                    # AI model: "claude-sonnet-4"
    agent_tool: str | None = None               # Tool: "claude-code"
    session_id: str | None = None               # Session ID
    spec_ref: str | None = None                 # Reference to intake spec
    cost_usd: float | None = None               # Generation cost
    signature: str | None = None                # HMAC-SHA256 signature
```

**Example:**
```python
record = ProvenanceRecord(
    file_path="src/app/main.py",
    source="ai",
    confidence=0.92,
    method=ProvenanceSource.GIT_INFER,
    timestamp=datetime.now(),
    model="claude-sonnet-4",
    agent_tool="claude-code",
)
```

### ConfigChange

Detected change in an AI agent configuration file.

```python
@dataclass
class ConfigChange:
    file_path: str               # Path to the config file
    field_path: str              # Changed field: "model", "guardrails.protected_files"
    old_value: str | None        # Previous value
    new_value: str | None        # New value
    severity: ChangeSeverity     # MAJOR / MINOR / PATCH
    description: str             # Human-readable description of the change
    timestamp: datetime          # When it occurred
    commit_sha: str | None = None  # Commit SHA
```

**Example:**
```python
change = ConfigChange(
    file_path="CLAUDE.md",
    field_path="model",
    old_value="claude-sonnet-4",
    new_value="claude-opus-4",
    severity=ChangeSeverity.MAJOR,
    description="AI model updated from Sonnet to Opus",
    timestamp=datetime.now(),
    commit_sha="abc1234",
)
```

### ControlRequirement

Individual regulatory requirement from a compliance framework.

```python
@dataclass
class ControlRequirement:
    id: str                          # "ART-9-1", "ASI-01"
    framework: str                   # "eu-ai-act", "owasp-agentic"
    name: str                        # Requirement name
    description: str                 # Full description
    article_ref: str | None = None   # "Article 9(1)" for EU AI Act
    category: str | None = None      # "risk-management", "transparency"
```

### ControlResult

Result of evaluating a requirement against the project.

```python
@dataclass
class ControlResult:
    requirement: ControlRequirement    # The evaluated requirement
    status: ComplianceStatus           # Compliance status
    evidence: str                      # What proves compliance
    details: str = ""                  # Additional details
    source: str = "auto"               # "auto", "architect", "vigil", "manual"
    recommendations: list[str] = field(default_factory=list)
    evaluated_at: datetime = field(default_factory=datetime.now)
```

### ComplianceSummary

Aggregated compliance summary for a regulatory framework.

```python
@dataclass
class ComplianceSummary:
    framework: str              # "eu-ai-act", "owasp-agentic"
    total_controls: int         # Total controls
    compliant: int              # Compliant
    partial: int                # Partially compliant
    non_compliant: int          # Non-compliant
    not_applicable: int         # Not applicable
    not_evaluated: int          # Not evaluated
    compliance_rate: float      # Compliance percentage
    evaluated_at: datetime = field(default_factory=datetime.now)
```

**compliance_rate calculation:**
```
compliance_rate = compliant / (total - not_applicable - not_evaluated) * 100
```

### GapItem

Identified compliance gap with recommendation.

```python
@dataclass
class GapItem:
    requirement: ControlRequirement    # Requirement with gap
    status: ComplianceStatus           # Current status
    gap_description: str               # What is missing
    recommendation: str                # How to fix it
    effort: str                        # "low", "medium", "high"
    tools_suggested: list[str] = field(default_factory=list)
    priority: int = 0                  # Priority (1 = highest)
```

---

## Provenance models (Phase 2)

### CommitInfo

Parsed git commit with metadata for heuristic analysis.

```python
@dataclass
class CommitInfo:
    sha: str                     # Full commit SHA hash
    author: str                  # Author name
    author_email: str            # Author email
    date: datetime               # Commit date
    message: str                 # Commit subject
    files_changed: list[str]     # Modified files
    insertions: int              # Lines added
    deletions: int               # Lines deleted
    co_authors: list[str] = []   # Co-authors (extracted from body)
```

**Usage**: Produced by `GitAnalyzer._parse_git_log()`, consumed by `AICommitHeuristics.score_commit()`.

### HeuristicResult

Result of applying an individual heuristic to a commit.

```python
@dataclass
class HeuristicResult:
    name: str       # Identifier: "author_pattern", "message_pattern", etc.
    score: float    # Contribution to the final score (0.0-1.0)
    weight: float   # Relative weight of this heuristic
    reason: str     # Human-readable explanation of the result
```

**Usage**: Produced internally by each heuristic, aggregated in `score_commit()`.

**Final score calculation**: Only heuristics with score > 0 (signaling) are averaged:
```python
signaling = [r for r in results if r.score > 0]
total_weight = sum(r.weight for r in signaling)
score = sum(r.score * r.weight for r in signaling) / total_weight
```

---

## Changelog models (Phase 3)

### ConfigSnapshot

Snapshot of a configuration file at a point in git history.

```python
@dataclass
class ConfigSnapshot:
    path: str          # Relative file path
    content: str       # File content at that commit
    commit_sha: str    # Commit SHA hash
    timestamp: datetime # Commit date (timezone-aware from git)
    author: str        # Commit author
```

**Usage**: Produced by `ConfigWatcher._get_file_history()`, consumed by `ChangeClassifier.classify_changes()`.

### FieldDiff

Field-level difference between two versions of a configuration file.

```python
@dataclass
class FieldDiff:
    field_path: str           # "model", "llm.provider", "section:Rules", "(content)"
    old_value: str | None     # Previous value (None if addition)
    new_value: str | None     # New value (None if removal)
    is_addition: bool = False # New field
    is_removal: bool = False  # Removed field
```

**Usage**: Produced by `diff_configs()`, consumed by `ChangeClassifier._classify_field()`.

**`field_path` conventions:**
- YAML/JSON: dotted path (`model`, `llm.model`, `guardrails.protected_files`)
- Markdown: `section:{heading}` (e.g., `section:Rules`, `section:Instructions`)
- Plain text / Markdown without headings: `(content)`
- Parse errors: `(parse-error)`
- Non-dict roots: `(root)`

---

## Detection models

Used by `ProjectDetector` to describe the project context.

### ProjectContext

Complete auto-detected project context.

```python
@dataclass
class ProjectContext:
    root_dir: str
    name: str
    languages: list[str]           # ["python", "javascript", "go", ...]
    frameworks: list[str]          # ["fastapi", "react", "express", ...]
    package_managers: list[str]    # ["pip", "npm", "cargo", ...]
    agent_configs: list[AgentConfigFile]
    has_architect: bool
    architect_config_path: str | None
    cicd: CICDConfig
    test_framework: str | None     # "pytest", "jest", "vitest"
    test_dirs: list[str]
    security: SecurityTooling
    git_initialized: bool
    total_commits: int
    total_contributors: int
    first_commit_date: str | None
    last_commit_date: str | None
```

### AgentConfigFile

Detected AI agent configuration file.

```python
@dataclass
class AgentConfigFile:
    path: str            # Path to the file
    agent_type: str      # "claude-code", "cursor", "architect", "copilot", "generic"
    exists: bool = True
```

### CICDConfig

Detected CI/CD configuration.

```python
@dataclass
class CICDConfig:
    platform: str                    # "github-actions", "gitlab-ci", "jenkins", etc.
    config_path: str | None = None
    has_ai_steps: bool = False       # CI/CD runs AI agents
```

### SecurityTooling

Security tools detected in the project.

```python
@dataclass
class SecurityTooling:
    has_vigil: bool = False
    has_semgrep: bool = False
    has_snyk: bool = False
    has_codeql: bool = False
    has_trivy: bool = False
    has_eslint_security: bool = False
    vigil_config_path: str | None = None
    sarif_files: list[str] = field(default_factory=list)
```

---

## EvidenceBundle

Complete evidence collection from the project (18 fields). Used by evaluators to determine compliance.

```python
@dataclass
class EvidenceBundle:
    # Provenance
    has_provenance: bool = False
    provenance_stats: dict[str, object] = field(default_factory=dict)

    # Changelog
    has_changelog: bool = False
    changelog_entry_count: int = 0

    # Regulatory documentation
    has_fria: bool = False
    fria_path: str | None = None
    has_annex_iv: bool = False
    annex_iv_path: str | None = None

    # Guardrails
    has_guardrails: bool = False
    guardrail_count: int = 0

    # Quality assurance
    has_quality_gates: bool = False
    quality_gate_count: int = 0
    has_budget_limits: bool = False
    has_dry_run: bool = False
    has_rollback: bool = False

    # Auditing
    has_audit_trail: bool = False
    audit_entry_count: int = 0
    has_otel: bool = False

    # Human review
    has_human_review_gate: bool = False

    # Requirements traceability
    has_requirements_traceability: bool = False

    # Security (SARIF)
    security_findings_total: int = 0
    security_findings_critical: int = 0
    security_findings_high: int = 0
```

---

## Pydantic models (Configuration)

The configuration models are documented in detail in the [Configuration guide](../configuration/). Here is the hierarchy:

```
LicitConfig (root)
├── provenance: ProvenanceConfig
├── changelog: ChangelogConfig
├── frameworks: FrameworkConfig
├── connectors: ConnectorsConfig
│   ├── architect: ConnectorArchitectConfig
│   └── vigil: ConnectorVigilConfig
├── fria: FRIAConfig
├── annex_iv: AnnexIVConfig
└── reports: ReportConfig
```

All Pydantic models implicitly use `model_config = ConfigDict(extra="ignore")` and allow extra fields in the YAML without error (they are silently ignored).

---

## Connector models (Phase 7)

### ConnectorResult

Result of a connector read operation.

```python
@dataclass
class ConnectorResult:
    connector_name: str              # "architect", "vigil"
    files_read: int = 0              # Files read successfully
    errors: list[str] = field(default_factory=list)

    @property
    def success(self) -> bool:
        """True if files were read and there were no errors."""
        return self.files_read > 0 and len(self.errors) == 0

    @property
    def has_errors(self) -> bool:
        return len(self.errors) > 0
```

**Usage**: Returned by `Connector.collect()`, exposed via `EvidenceCollector.connector_results`.

### ArchitectReport

Parsed summary of an architect JSON report.

```python
@dataclass
class ArchitectReport:
    path: str
    task_id: str | None = None
    status: str | None = None
    model: str | None = None
    cost_usd: float | None = None
    files_changed: list[str] = field(default_factory=list)
    timestamp: str | None = None
```

### AuditEntry

Individual entry from the architect JSONL audit log.

```python
@dataclass
class AuditEntry:
    event: str                                   # "task_start", "file_write", etc.
    timestamp: str | None = None
    details: dict[str, object] = field(default_factory=dict)
```

### SARIFFinding

Individual finding from a SARIF file.

```python
@dataclass
class SARIFFinding:
    rule_id: str                     # "VIGIL-001", "semgrep-rule-xyz"
    level: str                       # "error", "warning", "note", "none"
    message: str
    file_path: str | None = None     # URI of the affected file
    start_line: int | None = None    # Start line
    tool_name: str = ""              # Name of the tool from the SARIF run
```

### SARIFSummary

Summary of findings from a SARIF run.

```python
@dataclass
class SARIFSummary:
    tool_name: str
    total: int = 0
    critical: int = 0               # level == "error"
    high: int = 0                   # level == "warning"
    medium: int = 0                 # level == "note"
    low: int = 0                    # level == other
    findings: list[SARIFFinding] = field(default_factory=list)
```

### Connector Protocol

Protocol that all connectors implement.

```python
@runtime_checkable
class Connector(Protocol):
    @property
    def name(self) -> str: ...

    @property
    def enabled(self) -> bool: ...

    def available(self) -> bool: ...

    def collect(self, evidence: EvidenceBundle) -> ConnectorResult: ...
```

**Implementations**: `ArchitectConnector`, `VigilConnector`.
