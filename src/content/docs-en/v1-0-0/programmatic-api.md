---
title: "Programmatic API"
description: "Using licit from Python: imports, classes, integration examples."
order: 19
---

# Programmatic Usage (Python API)

licit is designed as a CLI, but all its modules are importable and usable directly from Python. This is useful for:

- Integrating licit into custom pipelines
- Building dashboards or wrappers
- Compliance automation scripts
- Programmatic testing and validation

---

## Loading configuration

```python
from licit.config.loader import load_config, save_config
from licit.config.schema import LicitConfig

# Load from .licit.yaml (or defaults if it doesn't exist)
config = load_config()

# Load from explicit path
config = load_config("/path/to/my-config.yaml")

# Create default config and modify
config = LicitConfig()
config.frameworks.owasp_agentic = False
config.connectors.architect.enabled = True
config.connectors.architect.config_path = ".architect/config.yaml"

# Save
save_config(config)
save_config(config, "/path/custom.yaml")
```

---

## Project detection

```python
from licit.core.project import ProjectDetector

detector = ProjectDetector()
context = detector.detect("/path/to/project")

# Access detected data
print(context.name)                  # "my-app"
print(context.languages)             # ["python", "typescript"]
print(context.agent_configs)         # [AgentConfigFile(path="CLAUDE.md", ...)]
print(context.cicd.platform)         # "github-actions"
print(context.security.has_vigil)    # True
print(context.total_commits)         # 142
```

---

## Evidence collection

```python
from licit.core.evidence import EvidenceCollector

# Without config (inline detection)
collector = EvidenceCollector("/path/to/project", context)
evidence = collector.collect()

# With config (uses formal connectors)
collector = EvidenceCollector("/path/to/project", context, config)
evidence = collector.collect()

# Verify evidence
print(evidence.has_provenance)              # True
print(evidence.has_guardrails)              # True
print(evidence.guardrail_count)             # 7
print(evidence.security_findings_total)     # 3
print(evidence.security_findings_critical)  # 1

# Connector results
for result in collector.connector_results:
    print(f"{result.connector_name}: {result.files_read} files, {len(result.errors)} errors")
```

---

## Provenance tracking

```python
from licit.provenance.tracker import ProvenanceTracker
from licit.provenance.store import ProvenanceStore

# Analyze
tracker = ProvenanceTracker("/path/to/project", config.provenance)
records = tracker.analyze(since="2026-01-01")

# Statistics
for r in records:
    print(f"{r.file_path}: {r.source} (confidence={r.confidence:.2f}, tool={r.agent_tool})")

# Direct store
store = ProvenanceStore(".licit/provenance.jsonl")
stats = store.get_stats()
print(f"AI: {stats['ai_percentage']:.1f}%")

# Search by file
file_records = store.get_by_file("src/main.py")
```

---

## Compliance evaluation

```python
from licit.frameworks.eu_ai_act.evaluator import EUAIActEvaluator
from licit.frameworks.owasp_agentic.evaluator import OWASPAgenticEvaluator
from licit.core.models import ComplianceStatus

# EU AI Act
eu_evaluator = EUAIActEvaluator()
results = eu_evaluator.evaluate(context, evidence)

for result in results:
    print(f"{result.requirement.id}: {result.status.value}")
    if result.status == ComplianceStatus.NON_COMPLIANT:
        for rec in result.recommendations:
            print(f"  → {rec}")

# OWASP
owasp_evaluator = OWASPAgenticEvaluator()
owasp_results = owasp_evaluator.evaluate(context, evidence)
```

---

## Reports

```python
from licit.reports.unified import UnifiedReportGenerator
from licit.reports import markdown, json_fmt, html

# Generate report
generator = UnifiedReportGenerator(context, evidence, config)
report = generator.generate([eu_evaluator, owasp_evaluator])

# Render
md_content = markdown.render(report)
json_content = json_fmt.render(report)
html_content = html.render(report)

# Access report data
print(f"Overall: {report.overall_compliance_rate:.1f}%")
for fw in report.frameworks:
    print(f"  {fw.name}: {fw.summary.compliance_rate:.1f}%")
```

---

## Gap analysis

```python
from licit.reports.gap_analyzer import GapAnalyzer

analyzer = GapAnalyzer(context, evidence, config)
gaps = analyzer.analyze([eu_evaluator, owasp_evaluator])

for gap in gaps:
    print(f"[P{gap.priority}] {gap.requirement.id}: {gap.gap_description}")
    print(f"  → {gap.recommendation} (effort: {gap.effort})")
    print(f"  Tools: {', '.join(gap.tools_suggested)}")
```

---

## Direct connectors

```python
from licit.config.schema import ConnectorArchitectConfig, ConnectorVigilConfig
from licit.connectors.architect import ArchitectConnector
from licit.connectors.vigil import VigilConnector
from licit.core.evidence import EvidenceBundle

# Architect
arch_config = ConnectorArchitectConfig(
    enabled=True,
    config_path=".architect/config.yaml",
    audit_log=".architect/audit.jsonl",
)
arch = ArchitectConnector("/path/to/project", arch_config)

if arch.available():
    ev = EvidenceBundle()
    result = arch.collect(ev)
    print(f"Guardrails: {ev.guardrail_count}, Audit entries: {ev.audit_entry_count}")

# Vigil
vig_config = ConnectorVigilConfig(enabled=True, sarif_path="results.sarif")
vig = VigilConnector("/path/to/project", vig_config, sarif_files=["scan.sarif"])
result = vig.collect(ev)
print(f"Findings: {ev.security_findings_total} ({ev.security_findings_critical} critical)")
```

---

## Config changelog

```python
from licit.changelog.watcher import ConfigWatcher
from licit.changelog.classifier import ChangeClassifier
from licit.changelog.renderer import ChangelogRenderer

watcher = ConfigWatcher("/path/to/project", ["CLAUDE.md", ".cursorrules"])
history = watcher.get_config_history(since="2026-01-01")

classifier = ChangeClassifier()
all_changes = []
for file_path, snapshots in history.items():
    for i in range(len(snapshots) - 1):
        changes = classifier.classify_changes(
            old_content=snapshots[i + 1].content,
            new_content=snapshots[i].content,
            file_path=file_path,
            commit_sha=snapshots[i].commit_sha,
            timestamp=snapshots[i].timestamp,
        )
        all_changes.extend(changes)

renderer = ChangelogRenderer()
print(renderer.render(all_changes, fmt="markdown"))
```

---

## FRIA and Annex IV

```python
from licit.frameworks.eu_ai_act.fria import FRIAGenerator
from licit.frameworks.eu_ai_act.annex_iv import AnnexIVGenerator

# FRIA (without interactivity — pass answers directly)
fria_gen = FRIAGenerator(context, evidence)
# fria_gen.run_interactive()  # Only works in terminal

# Annex IV
annex_gen = AnnexIVGenerator(context, evidence)
annex_gen.generate(
    output_path=".licit/annex-iv.md",
    organization="ACME Corp",
    product_name="WebApp",
)
```

---

## Important notes

1. **All classes use strict type hints** — take advantage of IDE autocompletion.
2. **Evaluators are stateless** — you can instantiate and use them in any order.
3. **EvidenceBundle is mutable** — connectors mutate it in-place.
4. **structlog** is configured automatically when importing modules. To silence in scripts, configure before importing licit.
5. **subprocess calls** (git) have timeouts — they won't hang indefinitely.
