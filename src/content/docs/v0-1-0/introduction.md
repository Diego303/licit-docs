---
title: "Introducción"
description: "Documentación principal de licit, la herramienta CLI de compliance regulatorio y trazabilidad de código para equipos de desarrollo con IA."
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

# Generar reporte de compliance
licit report
```

## Versión actual

- **v0.1.0** — Fase 1 (Foundation) completada
- Python 3.12+ requerido
- 10 comandos CLI registrados, 3 funcionales en esta fase (`init`, `status`, `connect`)

## Licencia

MIT — ver `LICENSE` en la raíz del repositorio.
