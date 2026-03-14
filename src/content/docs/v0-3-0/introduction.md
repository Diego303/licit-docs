---
title: "Introducción"
description: "Documentación principal de licit v0.3.0, herramienta CLI de compliance regulatorio y trazabilidad de código para equipos de desarrollo con IA."
order: 1
---

> Herramienta CLI de compliance regulatorio y trazabilidad de código para equipos de desarrollo con IA.

## Índice

| Documento | Descripción |
|---|---|
| [Inicio rápido](/licit-docs/docs/quick-start/) | Guía para tener licit funcionando en 5 minutos |
| [Arquitectura](/licit-docs/docs/architecture/) | Arquitectura del sistema, módulos, fases y decisiones de diseño |
| [Guía de CLI](/licit-docs/docs/cli-guide/) | Referencia completa de todos los comandos y opciones |
| [Configuración](/licit-docs/docs/configuration/) | Guía de configuración de `.licit.yaml` con todos los campos |
| [Modelos de datos](/licit-docs/docs/models/) | Enums, dataclasses y schemas Pydantic usados internamente |
| [Seguridad](/licit-docs/docs/security/) | Modelo de amenazas, firmado criptográfico, protección de datos |
| [Compliance](/licit-docs/docs/compliance/) | Marcos regulatorios soportados: EU AI Act y OWASP Agentic Top 10 |
| [Buenas prácticas](/licit-docs/docs/best-practices/) | Recomendaciones para integrar licit en tu flujo de trabajo |
| [Desarrollo](/licit-docs/docs/development/) | Guía para contribuidores: setup, testing, linting, convenciones |
| [Provenance](/licit-docs/docs/provenance/) | Sistema de trazabilidad: heurísticas, git analyzer, store, attestation, session readers |
| [Changelog](/licit-docs/docs/changelog/) | Sistema de changelog: watcher, differ, classifier, renderer |
| [FAQ](/licit-docs/docs/faq/) | Preguntas frecuentes y resolución de problemas |

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

# Generar changelog de configs de agentes
licit changelog

# Generar reporte de compliance
licit report
```

## Versión actual

- **v0.3.0** — Fase 1 (Foundation) + Fase 2 (Provenance) + Fase 3 (Changelog) completadas
- Python 3.12+ requerido
- 10 comandos CLI registrados, 5 funcionales (`init`, `status`, `connect`, `trace`, `changelog`)
- 373 tests, mypy strict, ruff clean

## Licencia

MIT
