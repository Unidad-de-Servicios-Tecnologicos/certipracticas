# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

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
- **react-hot-toast** (vía `utils/toast.ts` como `notify`) — notificaciones
- **react-icons** — iconografía
- **Vitest** + **React Testing Library** + **jsdom** — testing
- **Gemini API** (`@google/genai`) — generación asistida (OpenAI/Anthropic pendientes)

## Idioma
- UI en **español**
- Código (variables, comentarios, commits) en **inglés**
- Documentación de proyecto en **español**

## Comandos
```bash
npm run dev          # Servidor de desarrollo (Vite)
npm run build        # Build de producción (tsc -b && vite build)
npm run preview      # Previsualizar build
npm run test         # Tests en modo watch
npm run test:run     # Tests una vez
npm run test:coverage # Reporte de cobertura
npm run lint         # Type check (tsc --noEmit)

# Ejecutar un solo archivo de test
npx vitest run src/services/validators.test.ts
```

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
├── utils/          → cn, fileDownload, formatDate, toast
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
- **`useFormStore`** — Datos del formulario con `persist` a `localStorage`. Contiene: aprendiz, centro de formación, periodo, actividades, fortalezas técnicas, evaluación, instructor, firmante, proyectó, metadata.
- **`useAppStore`** — Estado de UI sin persistencia: zoom, micFieldId activo, isExporting, tema.

### Comportamientos no obvios del store
- `setPeriod`: cuando cambia `duration` o `endDate`, recalcula `startDate` automáticamente restando meses.
- `updateTask` / `updateStrength`: si el valor contiene `\n` o ` - `, hace split automático e inserta múltiples ítems en la lista (soporte para pegar texto con viñetas).
- `useFormStore` tiene un `merge` personalizado al rehidratar desde localStorage que restaura campos faltantes (`documentNumber`, `issueDate`, `startDate`, `endDate`, `gender`) a sus valores por defecto si no existen en el estado persistido.

## Plantilla de referencia
- Componente: `src/components/preview/templates/SenaTemplate.tsx`.
- Estructura: 2 páginas marcadas con `data-letter-page`; el `pdfExporter` usa ese atributo para capturar cada página independientemente.
- Todo el texto de la carta se construye mediante funciones puras en `src/services/letterFormatter.ts`. La función `val(value, fieldName)` devuelve el valor o `[fieldName]` como placeholder si está vacío.

## Variables de entorno
Definidas en `.env` (ver `.env.example`):
- `VITE_AI_PROVIDER` — `gemini` | `openai` | `anthropic` (solo `gemini` implementado).
- `VITE_GEMINI_API_KEY` — API key de Gemini (requerido si `VITE_AI_PROVIDER=gemini`).
- `VITE_GEMINI_MODEL` — Modelo a usar; por defecto `gemini-2.5-flash`.

> **Seguridad**: Las `VITE_*` se compilan en el bundle público. Para producción, restringir la API key por HTTP referrer en Google Cloud Console.

## Testing
- Vitest (API compatible con Jest).
- `src/test/setup.ts` provee mocks globales de Web Speech API (`SpeechRecognition`, `webkitSpeechRecognition`) y `window.matchMedia`.
- Los tests de Zustand usan `useFormStore.setState(...)` directamente, sin wrappers de React.
- Archivos: `ComponentName.test.tsx` o `hookName.test.ts` junto al fuente.

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
