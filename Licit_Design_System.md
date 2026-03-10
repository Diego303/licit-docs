# Sistema de Diseño: "Licit"

Guía de Estilos y Arquitectura Visual para Web y Documentación

---

## 1. Concepto Core y Filosofía Visual

La estética de licit se define como **Tipografía Suiza Regulatoria** (Swiss Regulatory Grid).

No es un manual de obra cálido (Architect), ni un plano técnico nocturno (Intake), ni un informe de auditoría verdoso (Vigil). Licit representa la **ley impresa**: un boletín oficial, un documento regulatorio europeo, un tratado tipográfico donde cada píxel está justificado y cada elemento ocupa su lugar exacto en la cuadrícula.

La estética se inspira directamente en el **Estilo Tipográfico Internacional** (Swiss Design): máxima reducción cromática, jerarquía brutal mediante tamaño y peso tipográfico, y composición ortogonal rigurosa.

- **Sensaciones:** Autoridad, claridad absoluta, precisión matemática, neutralidad institucional, peso legal.
- **Elementos clave:** Blanco puro, negro absoluto, un único acento rojo (#FF0000), tipografía geométrica, grids estrictos sin sombras, bordes como único recurso de profundidad.
- **Principio rector:** Lo que no aporta información, se elimina. El diseño más fuerte es el que no necesita decoración.

### 1.1 Posicionamiento dentro del Ecosistema

| Herramienta | Estética | Metáfora |
|-------------|----------|----------|
| **Architect** | Brutalismo editorial cálido | Manual de obra impreso |
| **Intake** | Dark Blueprint nocturno | Mesa de dibujo de ingeniero |
| **Vigil** | Brutalismo de auditoría | Informe de inspección técnica |
| **Licit** | Tipografía Suiza regulatoria | Boletín oficial de la UE |

### 1.2 Reglas Fundamentales

1. **Cero border-radius.** Todos los elementos son rectangulares. Sin excepciones.
2. **Cero sombras difuminadas.** No se usa `blur` en ninguna sombra. La profundidad se crea exclusivamente con bordes.
3. **Cero gradientes decorativos.** Los únicos gradientes permitidos son los funcionales (ej. el backdrop-filter del navbar).
4. **Un solo color de acento.** Rojo puro (`#FF0000`). Todo el sistema funciona en blanco, negro y escala de grises, con rojo como marcador de atención.
5. **La cuadrícula manda.** Todos los componentes se alinean a una cuadrícula implícita. Las celdas de los grids se dividen con bordes visibles, no con gaps vacíos.

---

## 2. Paleta de Colores (Tokens)

La paleta de licit es deliberadamente restringida. Utiliza una escala de grises neutra pura (sin tintes cálidos ni fríos) con un único acento de rojo absoluto. Se gestiona mediante variables CSS nativas en `:root`.

### 2.1 Fondos y Superficies

- **Background (Fondo principal):** `#FFFFFF`
  - **Variable:** `--bg`
  - **Uso:** Color de fondo del `<body>`, navbar, footer, y el espacio entre secciones. Blanco puro para máximo contraste con el texto negro.

- **Background Alt (Fondo alternativo):** `#F7F7F7`
  - **Variable:** `--bg-alt`
  - **Uso:** Secciones alternas que necesitan diferenciarse visualmente del fondo blanco sin usar bordes. Fondos de bloques de código inline.

- **Gray 7 (Gris más claro):** `#F2F2F2`
  - **Variable:** `--g7`
  - **Uso:** Fondo de `<code>` inline, fondo de hover en feature items, fondos de inputs, y áreas de detección de agentes.

### 2.2 Tintas (Texto y Estructura)

La escala de grises tiene 7 niveles numerados del 1 (más oscuro) al 7 (más claro):

- **Black (Tinta absoluta):** `#000000`
  - **Variable:** `--black`
  - **Uso:** Titulares (H1, H2, H3), bordes estructurales gruesos (2px), cabeceras de tablas, fondos de botón primario, navbar sticky. Es el color dominante junto con el blanco.

- **Gray 1:** `#111111`
  - **Variable:** `--g1`
  - **Uso:** Texto de énfasis extremo cuando #000 resulta demasiado duro en cuerpos largos. Rara vez se usa directamente.

- **Gray 2:** `#333333`
  - **Variable:** `--g2`
  - **Uso:** Texto de cuerpo principal en párrafos de documentación, descripciones de CLI, texto dentro de tablas.

- **Gray 3:** `#666666`
  - **Variable:** `--g3`
  - **Uso:** Texto secundario en párrafos del hero, descripciones de features, subtítulos, scope de frameworks, enlaces de navegación en reposo.

- **Gray 4:** `#999999`
  - **Variable:** `--g4`
  - **Uso:** Metadatos, labels de métricas, etiquetas de versión, texto de badges inactivos, meta del footer.

- **Gray 5:** `#CCCCCC`
  - **Variable:** `--g5`
  - **Uso:** Bordes internos de celdas de grid (1px), separadores dentro de tablas, divisores de secciones.

- **Gray 6:** `#E8E8E8`
  - **Variable:** `--g6`
  - **Uso:** Bordes de `<code>` inline, líneas divisorias extremadamente sutiles.

### 2.3 Acento (Rojo Regulatorio)

- **Red (Acento primario):** `#FF0000`
  - **Variable:** `--red`
  - **Uso:** El único color de marca. Se usa para: numeración de secciones, etiquetas de referencia en features (ej. "Provenance", "Art. 27"), badges de frameworks activos, prompts de terminal (`$`), enlaces activos en navbar, fondo de hover en botón primario, color de `::selection`, punto del logo (`licit.`), badges de error/non-compliant.

- **Red Dim (Acento secundario):** `#CC0000`
  - **Variable:** `--red-dim`
  - **Uso:** Estado hover de botones rojos, sombras de botones en el CTA oscuro.

- **Red Background:** `rgba(255, 0, 0, 0.04)`
  - **Variable:** `--red-bg`
  - **Uso:** Fondo de tags con borde rojo (ej. "Language Agnostic"). Opacidad extremadamente baja para no romper la neutralidad.

### 2.4 Colores Semánticos (Solo para bloques de terminal)

Estos colores se usan exclusivamente dentro de bloques de código/terminal y nunca en la UI general:

- **Terminal Green:** `#4ADE80` — Outputs exitosos (`✓`), porcentajes positivos
- **Terminal Yellow:** `#FBBF24` — Warnings (`⚠`), porcentajes de AI
- **Terminal Red:** `#F87171` — Errores (`✗`), controles no compliant
- **Terminal Dim:** `#666666` — Comentarios, metadatos, texto inactivo dentro de terminal

**Regla estricta:** Fuera de los bloques de terminal, el verde, el amarillo y el rojo de terminal NUNCA aparecen. La UI principal es exclusivamente blanco + negro + grises + rojo.

---

## 3. Tipografía

El sistema utiliza dos familias tipográficas de Google Fonts. Solo dos. Esta restricción es intencional y fundamental para la identidad.

### 3.1 Manrope (Sans-serif geométrica)

- **Familia:** `'Manrope', sans-serif`
- **Pesos:** Light (300), Regular (400), Medium (500), SemiBold (600), Bold (700), ExtraBold (800).
- **Fuente:** [Google Fonts — Manrope](https://fonts.google.com/specimen/Manrope)
- **Carácter:** Geométrica, moderna, extremadamente legible. Tiene personalidad suficiente para no ser genérica pero es lo bastante neutral para un contexto regulatorio.

**Usos por peso:**

| Peso | Uso |
|------|-----|
| 300 (Light) | Reservado. Solo para textos decorativos de gran tamaño si se necesitan. |
| 400 (Regular) | Texto de cuerpo principal, párrafos de documentación, descripciones. |
| 500 (Medium) | Texto de cuerpo con ligero énfasis, contenido de tablas. |
| 600 (SemiBold) | Enlaces de navegación, labels, texto intermedio. |
| 700 (Bold) | H3, nombres de frameworks, nombres de features, texto enfatizado. |
| 800 (ExtraBold) | H1, H2, logo, métricas grandes, diferenciadores. Es el peso más usado en titulares. |

**Tracking (letter-spacing):**
- Titulares H1: `letter-spacing: -3px` (tracking muy apretado para impacto visual)
- Titulares H2: `letter-spacing: -1.5px`
- Titulares H3: `letter-spacing: -0.3px`
- Cuerpo: `letter-spacing: 0` (normal)
- Navegación: `letter-spacing: 0.2px` (ligeramente abierto)

### 3.2 Overpass Mono (Monospace técnica)

- **Familia:** `'Overpass Mono', monospace`
- **Pesos:** Regular (400), Medium (500), SemiBold (600), Bold (700).
- **Fuente:** [Google Fonts — Overpass Mono](https://fonts.google.com/specimen/Overpass+Mono)
- **Carácter:** Limpia, geométrica, sin adornos. Diseñada por Red Hat. Más neutral que JetBrains Mono o Fira Code, lo que encaja con la filosofía Swiss.

**Usos:**

| Contexto | Peso | Estilo |
|----------|------|--------|
| Botones y CTAs | 700 (Bold) | `uppercase`, `letter-spacing: 2px` |
| Numeración de secciones (01, 02...) | 700 (Bold) | Color rojo |
| Etiquetas de referencia (Art. 27, CI/CD) | 700 (Bold) | `uppercase`, `letter-spacing: 2px`, color rojo |
| Comandos CLI | 600 (SemiBold) | Tamaño 14px |
| `<code>` inline | 400 (Regular) | Tamaño 0.88em, con fondo `--g7` y borde `--g6` |
| Bloques de terminal | 400-500 | Tamaño 13px, `line-height: 2` |
| Versiones (v0.1.0) | 600 (SemiBold) | Color `--g4` |
| Labels de métricas | 400 | `uppercase`, `letter-spacing: 2px`, color `--g4` |
| Badges (V0, V1) | 700 (Bold) | Tamaño 11px |

### 3.3 Escala Tipográfica

| Elemento | Familia | Tamaño | Peso | Tracking | Color |
|----------|---------|--------|------|----------|-------|
| H1 (Hero) | Manrope | 68px | 800 | -3px | `--black` |
| H2 (Sección) | Manrope | 40-44px | 800 | -1.5px | `--black` |
| H3 (Feature/Card) | Manrope | 18-20px | 800 | -0.3px | `--black` |
| Body | Manrope | 14-16px | 400 | 0 | `--g2` o `--g3` |
| Hero sub | Manrope | 18px | 400 | 0 | `--g3` |
| Nav links | Manrope | 13px | 600 | 0.2px | `--g3` |
| Section num | Overpass Mono | 11px | 700 | 2px | `--red` |
| Section label | Manrope | 13px | 700 | 3px | `--g3` |
| Button text | Overpass Mono | 12px | 700 | 2px | — |
| Code inline | Overpass Mono | 0.88em | 400 | 0 | `--black` |
| Terminal body | Overpass Mono | 13px | 400 | 0 | blanco/gris |
| Table header | Overpass Mono | 10px | 700 | 2px | blanco |
| Badge | Overpass Mono | 11px | 700 | 0 | `--red` o `--g4` |
| Footer meta | Overpass Mono | 11px | 400 | 0.5px | `--g4` |

---

## 4. Lenguaje Visual y Efectos

Licit es el miembro más austero del ecosistema. Donde Architect usa sombras brutalistas, Intake usa texturas de trama y Vigil usa marcas de corte, **licit usa el vacío**. La ausencia de decoración ES la decoración.

### 4.1 Sin Sombras

Licit no utiliza `box-shadow` en ningún componente de la UI principal. Cero. La profundidad y jerarquía se comunican exclusivamente a través de:
- Bordes de 2px (estructura) o 1px (separadores internos)
- Fondos alternos (blanco vs. `--g7`)
- Peso tipográfico (800 vs. 400)
- Color (negro vs. gris)

**Única excepción:** Los botones dentro de la sección CTA (fondo negro) que usan el estilo de otras herramientas del ecosistema no son parte del design system principal.

### 4.2 Bordes como Sistema de Profundidad

Los bordes son el recurso principal de estructuración:

| Tipo | Grosor | Color | Uso |
|------|--------|-------|-----|
| Estructural | 2px solid | `--black` | Contorno de secciones enteras, bordes de tablas exteriores, separadores de sección, navbar inferior, borde de terminal |
| Divisor interno | 1px solid | `--g5` | Separación entre celdas de grid, filas de tabla internas, bordes de métricas |
| Sutil | 1px solid | `--g6` | Bordes de `<code>` inline, bordes internos muy ligeros |

**Patrón de grids con bordes visibles:** A diferencia del pattern común de usar `gap` entre elementos, licit utiliza grids sin gap donde las celdas están separadas por `border-right` y `border-bottom`. Esto crea la estética de tabla/formulario oficial. La última celda de cada fila no tiene `border-right`, y la última fila no tiene `border-bottom`.

### 4.3 Sin Texturas de Fondo

Licit **no** utiliza cuadrículas de fondo (grid pattern), tramas (hatch pattern), marcas de corte (crop marks), ni ruido (noise texture). Esto lo diferencia de Architect, Intake y Vigil. El fondo es blanco puro y vacío.

### 4.4 Color de Selección

La selección de texto (`::selection`) usa fondo rojo (`#FF0000`) con texto blanco. Es una de las pocas "sorpresas" del diseño y refuerza el rojo como color de marca.

```css
::selection {
  background: #FF0000;
  color: #FFFFFF;
}
```

### 4.5 Transiciones

Las transiciones son mínimas y rápidas:

| Propiedad | Duración | Curva | Contexto |
|-----------|----------|-------|----------|
| `color` | 150ms | ease | Enlaces de navegación |
| `background` | 150ms | ease | Hover de feature items, botones |
| `border-color` | 150ms | ease | Hover de botones outline |
| `opacity`, `transform` | 500ms | ease-out | Scroll-reveal (IntersectionObserver) |

No se usan transiciones llamativas, rebotes (bounce), ni efectos elásticos. Todo es lineal y rápido.

### 4.6 Iconografía

Licit **no usa iconos**. La jerarquía se comunica exclusivamente con tipografía, numeración y color. Si en el futuro se necesitaran iconos:

- **Estilo:** Lineal (stroke), grosor 2px, esquinas cuadradas (`stroke-linecap="square"`, `stroke-linejoin="miter"`).
- **Color:** Negro (`#000000`) o rojo (`#FF0000`). Nunca grises.
- **Biblioteca sugerida:** Lucide con configuración personalizada, o SVGs custom monocromáticos.

---

## 5. Componentes Clave (Reglas de Construcción)

### 5.1 Botones

Dos variantes únicamente. Sin variante "ghost" ni "link".

**Primario (btn-black):**
- Fondo: `--black`
- Texto: `--bg` (blanco)
- Borde: 2px solid `--black`
- Tipografía: Overpass Mono, 12px, Bold (700), uppercase, `letter-spacing: 2px`
- Padding: `14px 28px`
- Hover: Fondo cambia a `--red`, borde cambia a `--red`
- No tiene sombra

**Secundario (btn-outline):**
- Fondo: `--bg` (blanco)
- Texto: `--black`
- Borde: 2px solid `--black`
- Tipografía: Overpass Mono, 12px, Bold (700), uppercase, `letter-spacing: 2px`
- Padding: `14px 28px`
- Hover: Texto cambia a `--red`, borde cambia a `--red`
- No tiene sombra

```css
.btn {
  font-family: 'Overpass Mono', monospace;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 2px;
  padding: 14px 28px;
  border: 2px solid transparent;
  text-decoration: none;
  transition: all 0.12s ease;
  cursor: pointer;
}
```

### 5.2 Grids con Bordes (Feature Grids, Problem Grids, etc.)

El componente más utilizado en licit. Un contenedor con borde exterior de 2px negro que se divide internamente en celdas con bordes de 1px gris.

**Estructura:**
```
┌─────────────┬─────────────┬─────────────┐  ← border: 2px solid --black
│  Celda 1    │  Celda 2    │  Celda 3    │
│             │             │             │  ← border-right: 1px solid --g5
├─────────────┼─────────────┼─────────────┤  ← border-bottom: 1px solid --g5
│  Celda 4    │  Celda 5    │  Celda 6    │
│             │             │             │
└─────────────┴─────────────┴─────────────┘
```

**Reglas:**
- Contenedor exterior: `border: 2px solid var(--black)`
- Celdas: `border-right: 1px solid var(--g5)` + `border-bottom: 1px solid var(--g5)`
- Última celda de cada fila: sin `border-right`
- Última fila: sin `border-bottom`
- Padding de celda: `36px 32px` (generoso)
- Hover: `background: var(--g7)` (opcional, solo en feature items)

### 5.3 Tablas (Frameworks, CLI Reference)

Las tablas siguen la estructura de bordes visibles:

**Cabecera:**
- Fondo: `--black`
- Texto: blanco, Overpass Mono, 10px, Bold, uppercase, `letter-spacing: 2px`
- Borde inferior: 2px solid `--black`
- Bordes entre columnas: 1px solid `#333`

**Filas:**
- Fondo: `--bg` (blanco)
- Texto: Manrope, 14px, Regular, color `--g2` o `--g3`
- Borde inferior: 1px solid `--g5`
- Bordes entre columnas: 1px solid `--g5`
- Última fila: sin borde inferior

**Celdas de nombre/ID:**
- Tipografía: Manrope Bold (700) para nombres de framework
- Tipografía: Overpass Mono SemiBold (600) para comandos CLI

### 5.4 Bloques de Terminal

El bloque de terminal es un componente de tipo split: mitad izquierda con texto explicativo sobre fondo blanco, mitad derecha con código sobre fondo negro.

**Mitad izquierda (texto):**
- Fondo: `--bg`
- Padding: `64px 48px 64px 0`
- Contiene H2, párrafo, y un bloque de instalación

**Mitad derecha (terminal):**
- Fondo: `--black`
- Borde izquierdo: `2px solid var(--black)`
- Tipografía: Overpass Mono, 13px, Regular
- Line-height: 2 (doble espacio para legibilidad)
- Padding: `48px`

**Sintaxis de color del terminal:**
```
Prompt ($):     --red (#FF0000)
Comentarios:    #555555 (italic)
OK/Success (✓): #4ADE80
Warning (⚠):    #FBBF24
Error (✗):      #F87171
Metadata/dim:   #666666
```

**Bloque de instalación:**
```css
.install-box {
  font-family: 'Overpass Mono', monospace;
  font-size: 15px;
  font-weight: 600;
  padding: 16px 24px;
  background: var(--g7);
  border: 2px solid var(--black);
  display: inline-block;
}
```
El símbolo `$` dentro del install box se colorea en rojo.

### 5.5 Labels de Sección

Cada sección principal se introduce con un label numerado compuesto por tres elementos en línea:

```
  01 ——————————————————————————————— Capabilities
  ^                                     ^
  Num (rojo, Mono)        Texto (gris, Manrope uppercase)
             ↑
        Línea divisoria (--g5)
```

**Implementación:**
```css
.section-label {
  padding: 80px 0 40px;
  display: flex;
  align-items: center;
  gap: 20px;
}
.section-label .num {
  font-family: 'Overpass Mono', monospace;
  font-size: 11px;
  font-weight: 700;
  color: var(--red);
  letter-spacing: 2px;
}
.section-label .line {
  flex: 1;
  height: 1px;
  background: var(--g5);
}
.section-label .text {
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 3px;
  color: var(--g3);
}
```

### 5.6 Métricas / Stat Blocks

Bloques de números grandes usados en el hero:

- Contenedor: grid de 2×2, cada celda con `border: 1px solid var(--g5)`
- Número: Manrope, 44px, ExtraBold (800), `letter-spacing: -2px`
- Label: Overpass Mono, 10px, Regular, uppercase, `letter-spacing: 2px`, color `--g4`
- Los números destacados usan color `--red`

### 5.7 Badges

Dos variantes:

**Activo (V0):**
- Tipografía: Overpass Mono, 11px, Bold
- Color: `--red`
- Sin fondo, sin borde (solo texto)

**Planificado (V1):**
- Tipografía: Overpass Mono, 11px, Regular
- Color: `--g4`
- Sin fondo, sin borde (solo texto)

### 5.8 Tags / Etiquetas

Para listas de tecnologías o categorías:

- Tipografía: Overpass Mono, 11px, SemiBold (600)
- Padding: `6px 12px`
- Borde: `1px solid var(--g5)`
- Fondo: `var(--g7)`
- Color texto: `--g2`

**Variante destacada (red-tag):**
- Borde: `1px solid var(--red)`
- Color texto: `--red`
- Fondo: `var(--red-bg)` → `rgba(255, 0, 0, 0.04)`

### 5.9 Navbar

- Position: `sticky`, `top: 0`, `z-index: 100`
- Fondo: `rgba(255, 255, 255, 0.95)` con `backdrop-filter: blur(8px)`
- Borde inferior: `2px solid var(--black)`
- Padding vertical: `20px`
- Layout: flex, `justify-content: space-between`, `align-items: baseline`

**Logo:** Manrope, 22px, ExtraBold (800). El punto final (`.`) es color `--red`.

**Versión:** Overpass Mono, 11px, SemiBold, color `--g4`, junto al logo.

**Enlaces:** Manrope, 13px, SemiBold (600), color `--g3`. Hover: `--black`. El enlace a GitHub puede usar color `--red` como acento.

### 5.10 Footer

- Borde superior: ninguno (la sección CTA ya tiene borde)
- Padding: `32px 0`
- Layout: flex, `space-between`, tres bloques (logo, links, meta)
- Logo: Manrope, 18px, ExtraBold, con punto rojo
- Links: Manrope, 13px, color `--g3`
- Meta: Overpass Mono, 11px, color `--g4`

---

## 6. Layout y Composición

### 6.1 Contenedor Principal

```css
.container {
  max-width: 1120px;
  margin: 0 auto;
  padding: 0 48px;
}

@media (max-width: 768px) {
  .container { padding: 0 24px; }
}
```

### 6.2 Grids por Sección

| Sección | Columnas | Gap | Bordes |
|---------|----------|-----|--------|
| Hero | 7fr / 5fr | 80px | No (es asimétrico) |
| Problem (3 items) | 1fr 1fr 1fr | 0 | Sí, 2px exterior + 1px interior |
| Workflow (4 pasos) | repeat(4, 1fr) | 0 | Sí, 2px exterior + 1px interior |
| Terminal | 1fr / 1fr | 0 | Split con borde central |
| Features (3×3) | repeat(3, 1fr) | 0 | Sí, 2px exterior + 1px interior |
| CLI Table | 180px / 1fr | 0 | Sí, tabla |
| Detection | 1fr / 1fr | 0 | Sí, split con borde |
| Frameworks Table | 200px / 1fr / 100px | 0 | Sí, tabla |
| Differentiators (2×3) | 1fr 1fr | 0 | Sí, 2px exterior + 1px interior |
| Roadmap (3 cols) | repeat(3, 1fr) | 0 | Sí, 2px exterior + 1px interior |
| CTA | 1fr 1fr | 80px | No (fondo negro) |

### 6.3 Responsive

La estrategia responsive es simple: todas las grids colapsan a 1 columna por debajo de `768px`. El hero colapsa a 1 columna por debajo de `900px`. Los bordes laterales (`border-right`) se eliminan y se sustituyen por bordes inferiores (`border-bottom`).

---

## 7. Animaciones

### 7.1 Page Load

El hero se anima al cargar la página con un `fadeIn` simple:

```css
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
.hero { animation: fadeIn 0.5s ease-out; }
```

### 7.2 Scroll Reveal

Los grids y tablas principales usan una clase `.reveal` que se activa con `IntersectionObserver`:

```css
.reveal {
  opacity: 0;
  transform: translateY(16px);
  transition: opacity 0.5s ease-out, transform 0.5s ease-out;
}
.reveal.visible {
  opacity: 1;
  transform: translateY(0);
}
```

```javascript
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
```

**Regla:** Las animaciones son siempre de entrada y nunca se repiten. Una vez visible, el elemento permanece visible.

---

## 8. Recomendaciones para el Desarrollo en Astro

### 8.1 Tailwind Config

Si se utiliza Tailwind CSS, extender la configuración con los tokens del design system:

```javascript
// tailwind.config.mjs
export default {
  theme: {
    extend: {
      colors: {
        'licit-black': '#000000',
        'licit-red': '#FF0000',
        'licit-red-dim': '#CC0000',
        'licit-g1': '#111111',
        'licit-g2': '#333333',
        'licit-g3': '#666666',
        'licit-g4': '#999999',
        'licit-g5': '#CCCCCC',
        'licit-g6': '#E8E8E8',
        'licit-g7': '#F2F2F2',
      },
      fontFamily: {
        'display': ['Manrope', 'sans-serif'],
        'mono': ['Overpass Mono', 'monospace'],
      },
      borderRadius: {
        'none': '0px', // Forzar en todos los componentes
      },
    },
  },
}
```

### 8.2 Layout Principal (Layout.astro)

En el layout base, definir los estilos globales:

```astro
<style is:global>
  @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&family=Overpass+Mono:wght@400;500;600;700&display=swap');

  :root {
    --bg: #FFFFFF;
    --black: #000000;
    --red: #FF0000;
    --red-dim: #CC0000;
    --g1: #111111;
    --g2: #333333;
    --g3: #666666;
    --g4: #999999;
    --g5: #CCCCCC;
    --g6: #E8E8E8;
    --g7: #F2F2F2;
    --red-bg: rgba(255,0,0,0.04);
  }

  * { box-sizing: border-box; }
  body {
    font-family: 'Manrope', sans-serif;
    background: var(--bg);
    color: var(--black);
    -webkit-font-smoothing: antialiased;
  }
  ::selection { background: var(--red); color: white; }
  * { border-radius: 0 !important; }
</style>
```

### 8.3 Sistema de Componentes

Crear componentes Astro reutilizables:

- **`<SectionLabel num="01" text="Features" />`** — Label numerado con línea divisoria.
- **`<BorderGrid cols={3}>`** — Grid con bordes internos. Recibe `cols` como prop.
- **`<DataTable>`** — Tabla con cabecera negra y filas con bordes.
- **`<TerminalBlock>`** — Split blanco/negro para mostrar sesiones CLI.
- **`<Badge variant="active|planned">`** — Badge de framework.
- **`<Tag variant="default|red">`** — Tag de tecnología.
- **`<StatBlock num="38%" label="AI-Generated" accent />`** — Métrica grande.

### 8.4 Documentación de Contenido (Prose)

Cuando el markdown se renderiza dentro de la documentación, el componente `<Prose>` debe aplicar estos estilos:

- **Headings (h1-h4):** Manrope ExtraBold, color negro, tracking negativo.
- **Párrafos:** Manrope Regular, color `--g2`, line-height 1.65.
- **Links:** Color `--red`, sin subrayado por defecto, subrayado en hover.
- **Listas:** Viñetas con guión largo (—) en color `--g5`, no bullets redondos.
- **Tablas:** Seguir las reglas de la sección 5.3. Cabecera negra, bordes visibles.
- **Blockquotes:** Borde izquierdo de 2px `--red`, padding izquierdo 20px, texto en `--g3`, italic.
- **Code inline:** Overpass Mono, fondo `--g7`, borde 1px `--g6`, padding 2px 6px.
- **Code blocks:** Fondo `--black`, texto blanco, Overpass Mono 13px, line-height 2. Prompt en rojo.
- **Imágenes:** No se usan fotos ni imágenes con color. Si se necesitan diagramas, usar ASCII art dentro de bloques de código, SVGs monocromáticos (negro/rojo), o diagramas Mermaid en escala de grises.

### 8.5 Admonitions (Callouts)

Si se usan callouts en la documentación:

- **Info/Nota:** Borde izquierdo 2px `--black`, fondo blanco, texto `--g2`.
- **Warning/Atención:** Borde izquierdo 2px `--red`, fondo `--red-bg`, texto `--g2`.
- **Tip/Consejo:** Borde izquierdo 2px `--g5`, fondo `--g7`, texto `--g2`.

No usar colores distintos al rojo, negro y grises. No usar iconos en los callouts — solo el borde izquierdo como indicador visual.

### 8.6 Sidebar de Documentación

- Fondo: blanco
- Borde derecho: `2px solid var(--black)` separándola del contenido
- Tipografía: Overpass Mono, 13px
- Enlace inactivo: color `--g3`
- Enlace activo: color `--black`, fondo `--g7`, o con un indicador de barra izquierda roja
- Sección de versión: badge con Overpass Mono, color `--g4`

---

## 9. Relación con el Ecosistema

Licit comparte el ADN brutalista del ecosistema (0px border-radius, sin sombras difuminadas, ortogonalidad estricta, tipografía monospace para datos técnicos), pero se diferencia por su austeridad extrema:

| Recurso visual | Architect | Intake | Vigil | Licit |
|----------------|-----------|--------|-------|-------|
| Border-radius | 0px | 0px | 0px | 0px |
| Sombras sólidas | ✓ (6px offset) | ✓ (6px offset) | ✓ (4px offset) | ✗ (ninguna) |
| Cuadrícula de fondo | ✓ (60px) | ✓ (40px) | ✓ (40px) | ✗ (fondo vacío) |
| Texturas (hatch/noise) | Subrayado marcador | Trama diagonal | Trama diagonal | ✗ (ninguna) |
| Marcas de corte | ✗ | ✓ | ✓ | ✗ |
| Paleta cromática | Crema + Ink + Brick | Negro + Blanco + Brick | Verde-gris + Emerald + Rojo | Blanco + Negro + Rojo |
| Tema | Light (cálido) | Dark | Light (verdoso) | Light (neutro puro) |
| Metáfora | Manual de obra | Plano nocturno | Informe de auditoría | Boletín oficial |
