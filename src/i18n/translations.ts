export const translations = {
  es: {
    meta: {
      title: 'Licit | Documentación oficial',
      description:
        'licit es una CLI independiente que rastrea la procedencia del código IA, evalúa el cumplimiento del EU AI Act y OWASP, y genera documentación regulatoria. Open source, zero infrastructure.',
    },
    nav: {
      features: 'Funcionalidades',
      frameworks: 'Frameworks',
      docs: 'Documentación',
      github: 'GitHub',
    },
    hero: {
      title_line1: 'Cumplimiento',
      title_line2: 'para código',
      title_line3: 'generado por\u00A0IA.',
      sub: 'licit rastrea quién escribió qué — humano o IA — evalúa tu proyecto contra el EU AI Act y el OWASP Agentic Top 10, y genera la documentación regulatoria que tu organización necesita. Una CLI. Zero infrastructure.',
      btn_docs: 'Ver documentación',
      btn_cli: 'Referencia CLI',
      metrics: {
        commands: { num: '10', label: 'Comandos CLI' },
        articles: { num: '11', label: 'Artículos EU AI Act' },
        controls: { num: '10', label: 'Controles OWASP' },
        deps: { num: '0', label: 'Dependencias externas' },
      },
    },
    features: {
      label: 'Funcionalidades',
      items: [
        {
          ref: 'Provenance',
          title: 'Rastreo de origen del código',
          desc: 'Seis heurísticas de git analizan patrones de autor, mensajes de commit, cambios masivos, trailers de co-autoría, patrones de archivos y tiempos para clasificar cada archivo como humano, IA o mixto.',
        },
        {
          ref: 'Session Reader',
          title: 'Integración con Claude Code',
          desc: 'Lee los logs de sesión de Claude Code para procedencia de alta fidelidad. Protocolo extensible para agregar lectores de Cursor, Codex y Copilot en V1.',
        },
        {
          ref: 'Attestation',
          title: 'Firmas criptográficas',
          desc: 'Firmas HMAC-SHA256 y hash por lotes Merkle tree proveen registros de procedencia a prueba de manipulación. Integración con Sigstore planificada para V1.',
        },
        {
          ref: 'Art. 27',
          title: 'Generador de FRIA',
          desc: 'Cuestionario interactivo de 5 pasos que cubre descripción del sistema, identificación de derechos, evaluación de impacto, mitigación y monitoreo. Auto-detecta respuestas de tu proyecto.',
        },
        {
          ref: 'Annex IV',
          title: 'Documentación técnica',
          desc: 'Genera documentos Annex IV del EU AI Act auto-poblados desde pyproject.toml, package.json, configs de CI/CD, configs de agentes y frameworks de testing.',
        },
        {
          ref: 'Changelog',
          title: 'Monitoreo de configs de agentes',
          desc: 'Rastrea cambios en CLAUDE.md, .cursorrules, AGENTS.md, configs de architect y más. Clasifica cada cambio como MAJOR, MINOR o PATCH.',
        },
        {
          ref: 'Evaluation',
          title: 'Auditoría multi-framework',
          desc: 'Evalúa artículos 9, 10, 12, 13, 14, 26, 27 del EU AI Act y todos los controles OWASP Agentic Top 10 en una sola pasada con evidencia auto-recolectada.',
        },
        {
          ref: 'Analysis',
          title: 'Analizador de brechas',
          desc: 'Identifica exactamente qué requisitos de cumplimiento faltan, con recomendaciones específicas, nivel de esfuerzo (bajo/medio/alto) y herramientas sugeridas por brecha.',
        },
        {
          ref: 'CI/CD',
          title: 'Gate de pipeline',
          desc: 'licit verify retorna código de salida 0 (cumple), 1 (no cumple), o 2 (parcial). Bloquea deploys no conformes automáticamente.',
        },
      ],
    },
    frameworks: {
      label: 'Frameworks Regulatorios',
      col_framework: 'Framework',
      col_coverage: 'Cobertura',
      col_status: 'Estado',
      items: [
        {
          name: 'EU AI Act',
          scope: 'Regulación 2024/1689 — Art. 9, 10, 12, 13, 14, 26, 27 + Annex IV',
          badge: 'V0',
          active: true,
        },
        {
          name: 'OWASP Agentic',
          scope: 'Top 10 riesgos de seguridad de agentes IA — edición 2026',
          badge: 'V0',
          active: true,
        },
        {
          name: 'NIST AI RMF',
          scope: 'AI 100-1 framework de gestión de riesgos',
          badge: 'V1',
          active: false,
        },
        {
          name: 'ISO/IEC 42001',
          scope: 'Estándar de sistema de gestión de IA (2023)',
          badge: 'V1',
          active: false,
        },
      ],
    },
    cta: {
      title_line1: 'Empieza a construir',
      title_line2: 'sobre terreno firme.',
      desc: 'Tu código ya está siendo moldeado por IA. Ahora puedes demostrar que cumple. Una instalación. Un comando. Visibilidad regulatoria completa.',
      btn_docs: 'Leer los Docs',
      btn_github: 'Github',
    },
    footer: {
      meta: 'MIT License · Open Source · Creado con Claude Code',
    },
    docs_page: {
      title: 'Documentación',
      subtitle: 'Aprende a usar licit paso a paso',
      search_placeholder: 'Buscar en la documentación...',
      version_label: 'Versión',
      back_link: '← Volver a docs',
      toc_title: 'En esta página',
      read_more: 'Leer →',
    },
  },

  en: {
    meta: {
      title: 'Licit | Official Documentation',
      description:
        'licit is a standalone CLI that tracks AI code provenance, evaluates compliance against EU AI Act & OWASP, and generates regulatory documentation. Open source, zero infrastructure.',
    },
    nav: {
      features: 'Features',
      frameworks: 'Frameworks',
      docs: 'Documentation',
      github: 'GitHub',
    },
    hero: {
      title_line1: 'Compliance',
      title_line2: 'for AI\u2011generated',
      title_line3: 'code.',
      sub: 'licit tracks who wrote what — human or AI — evaluates your project against the EU AI Act and OWASP Agentic Top 10, and generates the regulatory documentation your organization needs. One CLI. Zero infrastructure.',
      btn_docs: 'View Documentation',
      btn_cli: 'CLI Reference',
      metrics: {
        commands: { num: '10', label: 'CLI Commands' },
        articles: { num: '11', label: 'EU AI Act Articles' },
        controls: { num: '10', label: 'OWASP Controls' },
        deps: { num: '0', label: 'External Deps' },
      },
    },
    features: {
      label: 'Capabilities',
      items: [
        {
          ref: 'Provenance',
          title: 'Code origin tracking',
          desc: 'Six git heuristics analyze author patterns, commit messages, bulk changes, co-author trailers, file patterns, and timing to classify every file as human, AI, or mixed.',
        },
        {
          ref: 'Session Reader',
          title: 'Claude Code integration',
          desc: 'Reads Claude Code session logs for high-fidelity provenance. Extensible protocol for adding Cursor, Codex, and Copilot readers in V1.',
        },
        {
          ref: 'Attestation',
          title: 'Cryptographic signatures',
          desc: 'HMAC-SHA256 signatures and Merkle tree batch hashing provide tamper-evident provenance records. Sigstore integration planned for V1.',
        },
        {
          ref: 'Art. 27',
          title: 'FRIA generator',
          desc: 'Interactive 5-step questionnaire covering system description, rights identification, impact assessment, mitigation, and monitoring. Auto-detects answers from your project.',
        },
        {
          ref: 'Annex IV',
          title: 'Technical documentation',
          desc: 'Generates EU AI Act Annex IV documents auto-populated from pyproject.toml, package.json, CI/CD configs, agent configs, and test frameworks.',
        },
        {
          ref: 'Changelog',
          title: 'Agent config monitoring',
          desc: 'Tracks changes in CLAUDE.md, .cursorrules, AGENTS.md, architect configs, and more. Classifies each change as MAJOR, MINOR, or PATCH.',
        },
        {
          ref: 'Evaluation',
          title: 'Multi-framework audit',
          desc: 'Evaluates EU AI Act articles 9, 10, 12, 13, 14, 26, 27 and all OWASP Agentic Top 10 controls in a single pass with auto-collected evidence.',
        },
        {
          ref: 'Analysis',
          title: 'Gap analyzer',
          desc: 'Identifies exactly which compliance requirements are missing, with specific recommendations, effort level (low/medium/high), and suggested tools per gap.',
        },
        {
          ref: 'CI/CD',
          title: 'Pipeline gate',
          desc: 'licit verify returns exit code 0 (compliant), 1 (non-compliant), or 2 (partial). Block non-compliant deploys automatically.',
        },
      ],
    },
    frameworks: {
      label: 'Regulatory Frameworks',
      col_framework: 'Framework',
      col_coverage: 'Coverage',
      col_status: 'Status',
      items: [
        {
          name: 'EU AI Act',
          scope: 'Regulation 2024/1689 — Art. 9, 10, 12, 13, 14, 26, 27 + Annex IV',
          badge: 'V0',
          active: true,
        },
        {
          name: 'OWASP Agentic',
          scope: 'Top 10 AI agent security risks — 2026 edition',
          badge: 'V0',
          active: true,
        },
        {
          name: 'NIST AI RMF',
          scope: 'AI 100-1 risk management framework',
          badge: 'V1',
          active: false,
        },
        {
          name: 'ISO/IEC 42001',
          scope: 'AI management system standard (2023)',
          badge: 'V1',
          active: false,
        },
      ],
    },
    cta: {
      title_line1: 'Start building',
      title_line2: 'on solid ground.',
      desc: "Your code is already being shaped by AI. Now you can prove it's compliant. One install. One command. Full regulatory visibility.",
      btn_docs: 'Read the Docs',
      btn_github: 'Github',
    },
    footer: {
      meta: 'MIT License · Open Source · Built with Claude Code',
    },
    docs_page: {
      title: 'Documentation',
      subtitle: 'Learn how to use licit step by step',
      search_placeholder: 'Search documentation...',
      version_label: 'Version',
      back_link: '← Back to docs',
      toc_title: 'On this page',
      read_more: 'Read →',
    },
  },
} as const;

export type Locale = keyof typeof translations;
export type Translations = (typeof translations)[Locale];
