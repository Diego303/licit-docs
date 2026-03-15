---
title: "Migration V0 → V1"
description: "Stability contract, planned changes, migration steps."
order: 22
---

# Migration guide V0 → V1

> **Status**: This document will be updated when V1 enters development. For now, it documents the V0 contract and planned changes.

---

## V0 stability contract

### What will NOT change in V1

These elements are stable and there will be no breaking changes:

1. **CLI commands**: The 10 commands (`init`, `trace`, `changelog`, `fria`, `annex-iv`, `report`, `gaps`, `verify`, `status`, `connect`) maintain their interface.
2. **Exit codes**: `verify` will continue returning 0/1/2.
3. **Config schema**: `.licit.yaml` will remain compatible — new fields will be optional with defaults.
4. **Data formats**: `provenance.jsonl`, `fria-data.json`, MD/JSON/HTML reports maintain their structure.
5. **EvidenceBundle**: The existing 18 fields will not change. New fields may be added.

### What MAY change in V1

1. **New config fields** — `frameworks.nist_ai_rmf`, `frameworks.iso_42001` will default to `true` when implemented.
2. **New EvidenceBundle fields** — To support SBOM, NIST, ISO.
3. **New requirements** — More `ControlRequirement` entries in EU AI Act and OWASP.
4. **Plugin system** — Mechanism to register custom frameworks and connectors.
5. **Sigstore integration** — `provenance.sign` may support keyless signing in addition to HMAC.

---

## New frameworks in V1

### NIST AI RMF (AI 100-1)

The NIST AI Risk Management Framework will be structured as an evaluator implementing the `ComplianceFramework` Protocol:

- **Functions**: Govern, Map, Measure, Manage
- **Categories**: ~20 evaluable subcategories
- **Evidence**: Will reuse the existing `EvidenceBundle` + new fields for advanced data governance

### ISO/IEC 42001

The AI management standard will be structured as an evaluator with:

- **Clauses**: 4-10 (Context, Leadership, Planning, Support, Operation, Evaluation, Improvement)
- **Annex A Controls**: ~35 evaluable controls
- **Evidence**: Will require new fields for organizational policy and training records

---

## Plugin system (V1)

V1 will introduce a plugin registration mechanism:

```python
# licit-mi-framework/src/mi_framework/__init__.py
from licit.frameworks.base import ComplianceFramework

class MiFrameworkEvaluator:
    name = "mi-framework"
    version = "1.0"
    description = "Mi marco custom"

    def get_requirements(self) -> list[ControlRequirement]: ...
    def evaluate(self, context, evidence) -> list[ControlResult]: ...
```

Registration via entry points in `pyproject.toml`:

```toml
[project.entry-points."licit.frameworks"]
mi-framework = "mi_framework:MiFrameworkEvaluator"
```

---

## Migration steps (when V1 is available)

### 1. Update

```bash
pip install --upgrade licit-ai-cli
licit --version
# licit, version 1.0.0
```

### 2. Verify config

```bash
# V1 will add new defaults. Verify that your config is valid:
licit status
```

### 3. Re-evaluate

```bash
# New frameworks may detect new gaps:
licit report --format json -o v1-baseline.json
licit gaps
```

### 4. Compare with V0

```bash
# Compare the V0 report with V1 to see changes:
diff v0-report.json v1-baseline.json
```

---

## Estimated timeline

| Milestone | Estimate |
|---|---|
| V0.x (session readers, PDF, GitHub Action) | 2-3 weeks post-V0 |
| V1.0-alpha (NIST AI RMF) | 4 weeks post-V0 |
| V1.0-beta (ISO 42001, plugin system) | 6 weeks post-V0 |
| V1.0 release | 8 weeks post-V0 |

---

## Migration FAQ

### Do I need to re-run `licit init`?

No. Your existing `.licit.yaml` will continue to work. New fields will take default values.

### Will provenance data be lost?

No. `provenance.jsonl` is forwards-compatible. V1 can add fields to new records without invalidating existing ones.

### Is the existing FRIA still valid?

Yes. If V1 adds new questions to the FRIA, you can update it with `licit fria --update`.

### Can V0 reports be compared with V1 reports?

Yes, if you use JSON format. The base structure (`overall`, `frameworks[]`, `results[]`) will not change. V1 may add new fields but will not remove existing ones.
