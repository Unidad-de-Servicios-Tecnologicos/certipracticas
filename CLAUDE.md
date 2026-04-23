# CLAUDE.md — CertiPrácticas 

## Proyecto
**CertiPrácticas** — "Forja cartas profesionales con precisión".
Aplicación web client-side para generar Certificaciones de Ejecución de Etapa Productiva del SENA. Incluye dictado por voz, generación asistida por IA y exportación a PDF/DOCX.

## Stack
- **React 19** + **TypeScript** (Vite + SWC)
- **Zustand** — estado global
- **TailwindCSS v4** (plugin de Vite, sin `tailwind.config.js`)
- **Web Speech API** — dictado por voz
- **jspdf** + **html-to-image** — exportación PDF
- **docx** + **file-saver** — exportación DOCX
- **Vitest** + **React Testing Library** + **jsdom** — testing
- **Gemini API** (con extensión a OpenAI/Anthropic) — generación asistida

## Idioma
- UI en **español**
- Código (variables, comentarios, commits) en **inglés**
- Documentación de proyecto en **español**

## Arquitectura

```
src/
├── components/
│   ├── form/       → Formulario, campos, dictado, generación IA
│   ├── layout/     → AppShell, Header, SplitView, ThemeToggle
│   ├── preview/    → LetterPreview, ExportBar, ZoomControl, templates/
│   └── ui/         → Componentes UI atómicos (Button, Input, Modal, Toast, …)
├── data/           → Constantes, definición de campos, valores por defecto
├── hooks/          → useSpeechToText, useExport, useAutosave, useTheme, useLocalStorage
├── pages/          → LandingPage, GeneratorPage
├── services/       → Lógica pura: aiService, pdfExporter, docxExporter, validators, letterFormatter, speechService, storageService
├── store/          → useFormStore, useAppStore (Zustand)
├── types/          → Interfaces del dominio: letter, intern, center, period, instructor, signer, drafter, activities, metadata
├── utils/          → cn, fileDownload, formatDate
└── test/           → Setup global de testing
```

### Reglas por carpeta
- `components/ui/` — Sin lógica de negocio. Solo presentación + props.
- `components/layout/` — Estructura visual, sin lógica de datos.
- `services/` — Sin imports de React. Funciones puras exportables.
- `pages/` — Componen layout + components + hooks. Un archivo por página.
- `store/` — Un archivo por store, nombrado `use*Store.ts`.
- `hooks/` — Nombrados `use*.ts`. Encapsulan lógica con estado React.
- `data/` — Solo constantes y configuración estática exportada.
- `utils/` — Helpers genéricos, sin dependencia del dominio.
- Tests colocados junto al código fuente como `*.test.tsx` o `*.test.ts`.

## Estándares de código
- Solo componentes funcionales (no class components).
- **Named exports** (no default exports excepto rutas lazy-loaded).
- Props interfaces nombradas `{ComponentName}Props`.
- Usar `clsx` (vía `utils/cn.ts`) para classnames condicionales.
- Sin estilos inline; usar utilidades de Tailwind exclusivamente.
- Preferir composición sobre prop drilling; usar Zustand para estado cross-component.
- Alias de importación `@/` apunta a `src/`.

## State Management
- **`useFormStore`** — Datos del formulario: aprendiz, centro de formación, periodo, actividades, fortalezas técnicas, evaluación, instructor, firmante, proyectó, metadata.
- **`useAppStore`** — Estado de UI: panel activo, modales, notificaciones, tema.

## Plantilla de referencia
- Formato: Certificación de Ejecución de Etapa Productiva del SENA.
- Componente: `src/components/preview/templates/SenaTemplate.tsx`.
- Estructura: 2 páginas con logo SENA, clasificación de información, cuerpo de certificación, actividades, fortalezas técnicas, evaluación, firma y pie de página.

## Variables de entorno
Definidas en `.env` (ver `.env.example`):
- `VITE_AI_PROVIDER` — `gemini` | `openai` | `anthropic` (solo `gemini` implementado).
- `VITE_GEMINI_API_KEY` — API key de Gemini (requerido si `VITE_AI_PROVIDER=gemini`).

## Testing
- Escribir tests antes de implementar (TDD).
- Vitest (API compatible con Jest).
- Mockear Web Speech API con `vi.fn()`.
- Archivos: `ComponentName.test.tsx` o `hookName.test.ts` junto al fuente.

## Comandos
- `npm run dev` — Servidor de desarrollo (Vite).
- `npm run build` — Build de producción (`tsc -b && vite build`).
- `npm run preview` — Previsualizar build.
- `npm run test` — Tests en modo watch.
- `npm run test:run` — Tests una vez.
- `npm run test:coverage` — Reporte de cobertura.
- `npm run lint` — Type check (`tsc --noEmit`).

## Docker
- `docker compose up --build` — Build y arranque del contenedor (sirve en `http://localhost:8080`).
- Build multi-stage: Node 20 alpine para compilar + nginx alpine para servir `dist/`.
- Variables `VITE_*` se inyectan en build-time como build args.

## Workflow por fases
- **Fase 0** — `docs/acta-proyecto.md` (acta de proyecto).
- **Fase 1** — `docs/requerimientos.md` (requerimientos + historias de usuario).
- **Fase 2** — `docs/diseno-ui-ux.md` (diseño UI/UX).
- **Fase 3** — `src/` (arquitectura + implementación).
- **Fase 4** — `*.test.ts` (TDD, junto con Fase 3).
- **NO avanzar a la siguiente fase sin aprobación explícita del usuario.**
