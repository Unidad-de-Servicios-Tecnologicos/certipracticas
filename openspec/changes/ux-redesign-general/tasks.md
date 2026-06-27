## 1. Scaffold y feature flag

- [x] 1.1 Agregar `VITE_UX_V2` en `.env.example` y toggle en `App.tsx`
- [x] 1.2 Crear `AppShellV2.tsx` paralelo sin eliminar layout actual
- [x] 1.3 Agregar `activeSection` y estados UI nuevos en `useAppStore`

## 2. Layout — Header y footer (app-layout)

- [x] 2.1 Rediseñar `Header.tsx` con acciones globales: nuevo, guardar, exportar ▾, config, tema
- [x] 2.2 Crear `StatusBar.tsx` con indicador autosave persistente
- [x] 2.3 Crear `ExportDropdown.tsx` agrupando PDF, DOCX, JSON
- [x] 2.4 Integrar Header + StatusBar en `AppShellV2`

## 3. Layout — Tres columnas (app-layout)

- [x] 3.1 Crear `SidebarNav.tsx` con lista de secciones e iconos
- [x] 3.2 Crear `MainContent.tsx` como contenedor del formulario activo
- [x] 3.3 Crear `PreviewPanel.tsx` como contenedor del panel derecho
- [x] 3.4 Ensamblar layout 3 columnas en `GeneratorPageV2` (240px | flex | 480px min)

## 4. Navegación por secciones (form-navigation)

- [x] 4.1 Definir mapa de secciones con ids, labels, iconos y campos asociados
- [x] 4.2 Refactorizar `LetterForm` para renderizar una sección según `activeSection`
- [x] 4.3 Agregar título + descripción por sección en `FormSectionHeader.tsx`
- [x] 4.4 Crear `SectionNavButtons.tsx` (Anterior / Siguiente)
- [x] 4.5 Conectar sidebar → `activeSection` con highlight y badge de errores

## 5. Barra de progreso (progress-indicator)

- [x] 5.1 Crear hook `useFormProgress.ts` calculando % desde `validators.ts`
- [x] 5.2 Crear `ProgressBar.tsx` con porcentaje, secciones completas/pendientes
- [x] 5.3 Mostrar contador de errores con navegación al primer error
- [x] 5.4 Integrar progress bar en sidebar (desktop) y bajo header (mobile)

## 6. Autosave y feedback (autosave-feedback)

- [x] 6.1 Refactorizar `useAutosave.ts` para sincronizar con Zustand persist
- [x] 6.2 Implementar estados: guardando, guardado, sin cambios, error
- [x] 6.3 Mejorar toasts de exportación, IA y errores con mensajes claros
- [x] 6.4 Agregar retry en estado de error de guardado

## 7. Panel preview (preview-panel)

- [x] 7.1 Mover `ZoomControl` al panel derecho
- [x] 7.2 Crear `PageNavigator.tsx` para navegación multi-página
- [x] 7.3 Crear botón "Centrar" documento en preview
- [x] 7.4 Agregar indicador de cambios pendientes en preview
- [x] 7.5 Consolidar `ExportBar` dentro del header (eliminar barra bottom duplicada)

## 8. Acciones rápidas (quick-actions)

- [x] 8.1 Cablear guardar, export PDF/DOCX, duplicar, importar en header
- [x] 8.2 Crear `CommandPalette.tsx` modal para Ctrl+K
- [x] 8.3 Registrar acciones en palette: navegar sección, exportar, tema, ayuda

## 9. Estados vacíos (empty-states)

- [x] 9.1 Crear componente `EmptyState.tsx` reutilizable
- [x] 9.2 Implementar empty states: documento nuevo, actividades, firma, logos, IA
- [x] 9.3 Cada empty state con acción primaria (agregar, generar IA, dibujar)

## 10. Responsive (responsive-layout)

- [x] 10.1 Crear `MobileTabLayout.tsx` con tabs Formulario / Preview
- [x] 10.2 Crear `MobileSectionCarousel.tsx` con prev/next y nombre sección
- [x] 10.3 Implementar sidebar colapsado a iconos en tablet (768–1023px)
- [x] 10.4 Probar breakpoints: mobile, tablet, desktop

## 11. Onboarding (onboarding)

- [x] 11.1 Crear `OnboardingTour.tsx` con 4+ pasos
- [x] 11.2 Persistir flag `onboardingCompleted` en localStorage
- [x] 11.3 Pasos: secciones, IA, exportar, personalización
- [x] 11.4 Botón "Omitir" y no repetir en visitas posteriores

## 12. Atajos de teclado (keyboard-shortcuts)

- [x] 12.1 Crear hook `useKeyboardShortcuts.ts`
- [x] 12.2 Implementar: Ctrl+S, Ctrl+Z, Ctrl+Shift+Z, Ctrl+P, Ctrl+K, /, ?
- [x] 12.3 Crear `ShortcutsPanel.tsx` activado con ?
- [x] 12.4 Ignorar atajos cuando focus está en input (excepto Ctrl+S)

## 13. Ayuda contextual (contextual-help)

- [ ] 13.1 Agregar tooltips a campos complejos via componente `FieldTooltip.tsx`
- [x] 13.2 Agregar hints inline en secciones que lo requieran
- [x] 13.3 Verificar que ayuda no use modales bloqueantes

## 14. Microinteracciones (microinteractions)

- [x] 14.1 Animar transición de secciones con Motion `AnimatePresence`
- [x] 14.2 Animar confirmación de guardado en StatusBar
- [x] 14.3 Spinner en botones de export durante procesamiento
- [x] 14.4 Respetar `prefers-reduced-motion` en todas las animaciones

## 15. Validación pre-export

- [x] 15.1 Crear `ValidationSummary.tsx` modal antes de exportar
- [x] 15.2 Listar campos faltantes con link a sección correspondiente
- [x] 15.3 Permitir exportar forzado con advertencia (no hard block)

## 16. Landing y flujo de inicio

- [x] 16.1 Agregar pantalla "Elegir cómo comenzar" (nuevo, ejemplo, importar)
- [ ] 16.2 Conectar CTAs de landing al nuevo flujo
- [x] 16.3 Agregar navegación "Inicio" en header del generador

## 17. Cutover y cleanup

- [x] 17.1 Activar `VITE_UX_V2=true` por defecto tras QA
- [ ] 17.2 Eliminar layout v1 (`SplitView` legacy, toolbars duplicadas)
- [ ] 17.3 Actualizar tests de componentes afectados
- [x] 17.4 Verificar export PDF/DOCX sin regresiones
- [ ] 17.5 Auditoría a11y WCAG 2.2 en layout nuevo

## 18. Historial — solo diseño (history-design)

- [x] 18.1 Documentar API propuesta para undo/redo basada en `schemaHistory`
- [x] 18.2 NO implementar — dejar spec como referencia futura
