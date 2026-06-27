## Why

CertiPrácticas es funcional pero su UX no alcanza el nivel de herramientas de productividad modernas (Canva, Notion, Linear). El formulario monolítico en acordeones, la navegación fragmentada, el feedback de guardado engañoso y la ausencia de progreso visible generan carga cognitiva alta y fricción innecesaria. Este cambio eleva la experiencia de interacción sin tocar la lógica de negocio, exportación ni integración con IA.

## What Changes

- **Layout principal**: Header minimalista con acciones globales; sidebar izquierda con navegación por secciones; área central con formulario de una sección a la vez; panel derecho con preview enriquecido (zoom, páginas, cambios, centrar).
- **Formulario por secciones**: Reemplazar acordeón gigante por navegación lateral con estado, progreso y errores por sección.
- **Barra de progreso global**: Porcentaje completado, secciones pendientes/completas, errores visibles.
- **Estados vacíos**: Diseño para formulario nuevo, actividades, firma, logos, historial e IA.
- **Feedback y autosave**: Indicador persistente de estado (guardando, guardado, sin cambios, error) con toasts claros para exportación, IA y errores.
- **Acciones rápidas**: Barra superior con guardar, exportar PDF/DOCX, duplicar, importar, configuración.
- **Onboarding**: Recorrido inicial omitible, solo primera vez.
- **Atajos de teclado**: Ctrl+S, Ctrl+Z, Ctrl+Shift+Z, Ctrl+P, Ctrl+K, /, ? con documentación.
- **Ayuda contextual**: Tooltips, hints e información inline (sin modales invasivos).
- **Responsive**: Layout dedicado para tablet y móvil (no adaptación directa del desktop).
- **Microinteracciones**: Animaciones suaves en transiciones de sección, guardado, validación y exportación.
- **Historial (solo diseño)**: Deshacer/rehacer, últimos cambios, restaurar versión — especificado pero no implementado en esta fase.
- **Landing mejorada**: Flujo Bienvenida → Elegir cómo comenzar → Generador optimizado.

**Sin cambios:**
- Reglas de negocio, generación de documento, exportación PDF/DOCX, integración IA, estructura de datos del store.

## Capabilities

### New Capabilities

- `app-layout`: Header global, sidebar de navegación, área central y panel de preview con estructura profesional.
- `form-navigation`: Navegación por secciones del formulario con estado, progreso y errores por bloque.
- `progress-indicator`: Barra de progreso global con porcentaje, secciones y errores.
- `empty-states`: Estados vacíos informativos para secciones sin contenido.
- `autosave-feedback`: Indicador persistente de estado de guardado y feedback inmediato de acciones.
- `quick-actions`: Barra de acciones frecuentes (guardar, exportar, duplicar, importar, config).
- `onboarding`: Recorrido guiado inicial omitible para usuarios nuevos.
- `keyboard-shortcuts`: Atajos de teclado documentados con panel de ayuda (?).
- `contextual-help`: Tooltips, hints y ayuda inline no invasiva.
- `preview-panel`: Panel derecho con zoom, navegación por páginas, indicador de cambios y centrar documento.
- `responsive-layout`: Experiencia adaptada para tablet y móvil con flujo propio.
- `microinteractions`: Animaciones de transición para secciones, guardado, validación y exportación.
- `history-design`: Especificación de diseño para historial/deshacer (sin implementación).

### Modified Capabilities

- _(ninguna — no existen specs previas en `openspec/specs/`)_

## Impact

- **Componentes layout**: `AppShell`, `Header`, `SplitView` — reestructuración mayor.
- **Componentes form**: `LetterForm`, `FormSection` — migración a navegación por secciones.
- **Componentes preview**: `ExportBar`, `ZoomControl`, `LetterPreview` — redistribución en panel derecho.
- **Páginas**: `LandingPage`, `GeneratorPage` — flujo de bienvenida y layout nuevo.
- **Hooks**: `useAutosave` — alinear indicador con persistencia real; nuevo hook de progreso y atajos.
- **Store UI**: `useAppStore` — nuevos estados para sección activa, onboarding, historial de navegación.
- **Estilos**: `index.css` — tokens y utilidades para nuevo layout.
- **Sin impacto**: `services/` (pdf, docx, ai, validators), tipos de dominio, persistencia de datos.
