# CertiPrácticas

> **Forja cartas profesionales con precisión.**

Aplicación web client-side para generar **Certificaciones de Ejecución de Etapa Productiva del SENA** con vista previa en tiempo real, dictado por voz, generación asistida por IA y exportación a PDF/DOCX.

---

## Características

- Editor de carta con vista previa en vivo (split-view).
- Dictado por voz en campos de texto (Web Speech API).
- Generación asistida por IA (Gemini) para actividades, fortalezas técnicas y evaluación.
- Exportación a **PDF** (jspdf + html-to-image) y **DOCX** (docx).
- Autosave en `localStorage`.
- Tema claro/oscuro.
- Plantilla fiel al formato oficial SENA.
- 100% client-side, sin backend.

---

## Stack tecnológico

| Capa | Tecnología |
|------|------------|
| UI | React 19 + TypeScript |
| Build | Vite 6 + SWC |
| Estilos | TailwindCSS v4 |
| Estado | Zustand |
| Testing | Vitest + React Testing Library |
| Voz | Web Speech API |
| Export | jspdf, html-to-image, docx, file-saver |
| IA | Google Gemini (extensible a OpenAI/Anthropic) |

---

## Requisitos

- **Node.js** ≥ 20
- **npm** ≥ 10

---

## Instalación

```bash
git clone <repo-url> certipracticas
cd certipracticas
npm install
cp .env.example .env
# Edita .env y agrega tu VITE_GEMINI_API_KEY
npm run dev
```

Abre `http://localhost:5173`.

---

## Variables de entorno

Copia `.env.example` a `.env` y configura:

| Variable | Descripción | Requerido |
|----------|-------------|-----------|
| `VITE_AI_PROVIDER` | `gemini` \| `openai` \| `anthropic` | Sí |
| `VITE_GEMINI_API_KEY` | API key de Google Gemini | Si usas `gemini` |

> Las variables `VITE_*` se inyectan en build-time. Cambiarlas requiere reconstruir.

---

## Scripts disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo con HMR |
| `npm run build` | Build de producción (`dist/`) |
| `npm run preview` | Previsualiza el build |
| `npm run test` | Tests en modo watch |
| `npm run test:run` | Ejecuta tests una vez |
| `npm run test:coverage` | Reporte de cobertura |
| `npm run lint` | Type check con TypeScript |

---

## Docker

Build multi-stage (Node para compilar + Nginx para servir).

### Con Docker Compose (recomendado)

```bash
# Configura .env primero (mismo formato que el de desarrollo)
docker compose up --build
```

Disponible en `http://localhost:8080`.

### Con Docker directo

```bash
docker build \
  --build-arg VITE_AI_PROVIDER=gemini \
  --build-arg VITE_GEMINI_API_KEY=tu_api_key \
  -t certipracticas .

docker run -p 8080:80 certipracticas
```

> Las variables `VITE_*` se compilan dentro del bundle, por lo que deben pasarse en build-time, no en runtime.

---

## Estructura del proyecto

```
src/
├── components/
│   ├── form/       Formulario, campos, dictado, IA
│   ├── layout/     AppShell, Header, SplitView, ThemeToggle
│   ├── preview/    LetterPreview, ExportBar, ZoomControl, templates/
│   └── ui/         Componentes UI atómicos
├── data/           Constantes y configuración estática
├── hooks/          useSpeechToText, useExport, useAutosave, useTheme
├── pages/          LandingPage, GeneratorPage
├── services/       aiService, pdfExporter, docxExporter, validators, …
├── store/          useFormStore, useAppStore (Zustand)
├── types/          Interfaces del dominio
├── utils/          cn, fileDownload, formatDate
└── test/           Setup global de testing
```

Consulta [`CLAUDE.md`](./CLAUDE.md) para convenciones detalladas.

---

## Testing

```bash
npm run test           # watch
npm run test:run       # CI
npm run test:coverage  # cobertura
```

Los tests viven junto al código fuente como `*.test.ts(x)`.

---

## Seguridad

La app es **100 % client-side**, por lo que cualquier variable `VITE_*` queda embebida en el bundle público. Esto implica:

- **La API key de Gemini es visible en el navegador.** Para producción es **obligatorio** restringirla en [Google Cloud Console](https://console.cloud.google.com/apis/credentials):
  1. `Application restrictions` → **HTTP referrers** → añadir `https://tu-dominio.com/*`.
  2. `API restrictions` → limitar sólo a **Generative Language API**.
  3. Configurar **cuotas** y **alertas de presupuesto**.
  4. **Rotar la key** si sospechas que se filtró.
- Los datos del formulario se guardan en **`localStorage` sin cifrar**. No uses la app para datos sensibles fuera de su propósito.
- En producción, servir **siempre bajo HTTPS** (el `nginx.conf` incluye HSTS + CSP + Permissions-Policy).
- Ejecuta `npm audit` periódicamente. Las vulnerabilidades residuales en `vite`/`vitest`/`esbuild` sólo afectan al dev server, no al bundle de producción.

## Compatibilidad de navegador

- **Chromium** (Chrome, Edge, Brave): soporte completo, incluyendo Web Speech API.
- **Firefox / Safari**: la app funciona, pero el dictado por voz puede no estar disponible.

---

## Licencia

Privado — uso interno.
