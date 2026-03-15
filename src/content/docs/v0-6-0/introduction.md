---
title: "Introducción"
description: "Documentación principal de licit v0.6.0, herramienta CLI de compliance regulatorio y trazabilidad de código para equipos de desarrollo con IA."
order: 1
---

# Documentación de licit

> Herramienta CLI de compliance regulatorio y trazabilidad de código para equipos de desarrollo con IA.

## Índice

| Documento | Descripción |
|---|---|
| [Inicio rápido](../quick-start/) | Guía para tener licit funcionando en 5 minutos |
| [Guía de CLI](../cli-guide/) | Referencia completa de todos los comandos y opciones |
| [Interpretación de reportes](../report-interpretation/) | Cómo leer y actuar sobre los reportes de compliance y gap analysis |
| [Guía FRIA](../fria-guide/) | Orientación pregunta por pregunta para completar el FRIA (Art. 27) |
| [Guía para auditores](../auditor-guide/) | Verificación de compliance, evidencia, preparación para auditoría regulatoria |
| [Integración CI/CD](../ci-cd/) | GitHub Actions, GitLab CI, Jenkins — licit como gate de compliance |
| [Configuración](../configuration/) | Guía de configuración de `.licit.yaml` con todos los campos |
| [Compliance](../compliance/) | Marcos regulatorios soportados: EU AI Act y OWASP Agentic Top 10 |
| [Arquitectura](../architecture/) | Arquitectura del sistema, módulos, fases y decisiones de diseño |
| [Modelos de datos](../models/) | Enums, dataclasses y schemas Pydantic usados internamente |
| [Provenance](../provenance/) | Sistema de trazabilidad: heurísticas, git analyzer, store, attestation |
| [Changelog](../changelog/) | Sistema de changelog: watcher, differ, classifier, renderer |
| [Seguridad](../security/) | Modelo de amenazas, firmado criptográfico, protección de datos |
| [Buenas prácticas](../best-practices/) | Recomendaciones para integrar licit en tu flujo de trabajo |
| [Desarrollo](../development/) | Guía para contribuidores: setup, testing, linting, convenciones |
| [FAQ](../faq/) | Preguntas frecuentes y resolución de problemas |

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

- **v0.6.0** — Fases 1-6 completadas (Foundation + Provenance + Changelog + EU AI Act + OWASP Agentic Top 10 + Reports)
- Python 3.12+ requerido
- 10 comandos CLI, todos funcionales
- 706 tests, mypy strict, ruff clean

## Licencia

MIT — ver LICENSE en la raíz del proyecto.
