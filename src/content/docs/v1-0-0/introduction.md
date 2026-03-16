---
title: "Introducción"
description: "Documentación principal de licit v1.0.0, herramienta CLI de compliance regulatorio y trazabilidad de código para equipos de desarrollo con IA."
order: 1
---

# Documentación de licit

> Herramienta CLI de compliance regulatorio y trazabilidad de código para equipos de desarrollo con IA.

## Índice

### Para usuarios

| Documento | Descripción |
|---|---|
| [Inicio rápido](../quick-start/) | Guía para tener licit funcionando en 5 minutos |
| [Guía de CLI](../cli-guide/) | Referencia completa de todos los comandos y opciones |
| [Configuración](../configuration/) | Guía de configuración de `.licit.yaml` con todos los campos |
| [Conectores](../connectors/) | Architect y vigil: qué leen, cómo configurarlos, cómo alimentan compliance |
| [Ejemplos y recetas](../examples/) | Flujos de trabajo completos para casos de uso comunes |
| [Buenas prácticas](../best-practices/) | Recomendaciones para integrar licit en tu flujo de trabajo |
| [FAQ](../faq/) | Preguntas frecuentes y resolución de problemas |

### Para compliance y auditoría

| Documento | Descripción |
|---|---|
| [Compliance](../compliance/) | Marcos regulatorios soportados: EU AI Act y OWASP Agentic Top 10 |
| [Marco legal](../legal-framework/) | Contexto legal del EU AI Act, OWASP, NIST, ISO — con referencias oficiales |
| [Interpretación de reportes](../report-interpretation/) | Cómo leer y actuar sobre los reportes de compliance y gap analysis |
| [Guía FRIA](../fria-guide/) | Orientación pregunta por pregunta para completar el FRIA (Art. 27) |
| [Guía para auditores](../auditor-guide/) | Verificación de compliance, evidencia, preparación para auditoría regulatoria |
| [Integración CI/CD](../ci-cd/) | GitHub Actions, GitLab CI, Jenkins — licit como gate de compliance |
| [Guía enterprise](../enterprise/) | Adopción organizacional, modelo de madurez, integración con GRC |

### Para desarrolladores

| Documento | Descripción |
|---|---|
| [Arquitectura](../architecture/) | Arquitectura del sistema, módulos, fases y decisiones de diseño |
| [Modelos de datos](../models/) | Enums, dataclasses y schemas Pydantic usados internamente |
| [Provenance](../provenance/) | Sistema de trazabilidad: heurísticas, git analyzer, store, attestation |
| [Changelog](../changelog/) | Sistema de changelog: watcher, differ, classifier, renderer |
| [API programática](../programmatic-api/) | Uso de licit desde Python: imports, clases, ejemplos |
| [Seguridad](../security/) | Modelo de amenazas, firmado criptográfico, protección de datos |
| [Desarrollo](../development/) | Guía para contribuidores: setup, testing, linting, convenciones |
| [Migración V0 → V1](../migration-v1/) | Contrato de estabilidad, cambios planificados, pasos de migración |

### Referencia

| Documento | Descripción |
|---|---|
| [Glosario](../glossary/) | Términos regulatorios, técnicos y de dominio |

## Inicio rápido

```bash
# Instalar
pip install licit-ai-cli

# Inicializar en tu proyecto
cd tu-proyecto/
licit init

# Ver estado
licit status

# Rastrear proveniencia del código
licit trace --stats

# Generar reporte de compliance
licit report
```

## Versión actual

- **v1.0.0** — Release estable. Fases 1-7 completadas + QA exhaustivo (142 tests manuales × 5 proyectos × 10 edge cases)
- Python 3.12+ requerido
- 10 comandos CLI, todos funcionales (`fria --auto` para CI/CD)
- 789 tests, mypy strict, ruff clean
- Connectors: architect (reports, audit log, config) + vigil (SARIF, SBOM)

## Licencia

MIT — ver [LICENSE](../LICENSE) en la raíz del proyecto.
