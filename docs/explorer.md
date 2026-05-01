● Agent "Exploración completa del proyecto CertiPrácticas" completed                                   

● La exploración completó. Tengo todo el código. Aquí está el diagnóstico completo.                    
                                                                                                         ---                                                                                                  
  Diagnóstico Técnico — CertiPrácticas                                                                                                                                                                        
  1. Estado actual del proyecto                                                                                                                                                                               
  El proyecto tiene una base sólida y bien arquitecturada. No es un comienzo desde cero — es una         aplicación funcional con infraestructura real. Lo que existe:                                                                                                                                                 ┌────────────────────────────┬─────────────────┬───────────────────────┐                               │           Módulo           │     Estado      │        Calidad        │                               ├────────────────────────────┼─────────────────┼───────────────────────┤                               │ Formulario dinámico        │ ✅ Implementado │ Buena                 │                               ├────────────────────────────┼─────────────────┼───────────────────────┤                               │ Preview en tiempo real     │ ✅ Implementado │ Buena                 │                               ├────────────────────────────┼─────────────────┼───────────────────────┤                               │ Exportación PDF            │ ✅ Implementado │ Regular (rasterizado) │                               ├────────────────────────────┼─────────────────┼───────────────────────┤                               │ Exportación DOCX           │ ✅ Implementado │ Buena                 │                             
  ├────────────────────────────┼─────────────────┼───────────────────────┤
  │ Dictado por voz            │ ✅ Implementado │ Buena                 │
  ├────────────────────────────┼─────────────────┼───────────────────────┤
  │ Generación IA (Gemini)     │ ✅ Implementado │ Buena                 │
  ├────────────────────────────┼─────────────────┼───────────────────────┤
  │ Autosave localStorage      │ ✅ Implementado │ Buena                 │
  ├────────────────────────────┼─────────────────┼───────────────────────┤
  │ Testing suite              │ ✅ Implementado │ Buena                 │
  ├────────────────────────────┼─────────────────┼───────────────────────┤
  │ Editor visual (Canva-like) │ ❌ No existe    │ —                     │
  ├────────────────────────────┼─────────────────┼───────────────────────┤
  │ Sistema de firmas          │ ❌ No existe    │ —                     │
  ├────────────────────────────┼─────────────────┼───────────────────────┤
  │ Firma dibujada en línea    │ ❌ No existe    │ —                     │
  └────────────────────────────┴─────────────────┴───────────────────────┘

  ---
  2. Problemas encontrados

  P1 — Modelo de datos no coincide con el PDF de referencia

  El PDF muestra proyectos con estructura tripartita (código + nombre + descripción), pero el tipo     
  actual es string[]:

  // Actual (incorrecto para el PDF)
  Activities { tasks: string[] }

  // Lo que el PDF requiere
  interface Project {
    code: string       // "P2023-014296-13274"
    name: string       // "StampArt"
    description: string // "Plataforma e-commerce..."
  }
  Activities { tasks: Project[] }

  P2 — Campo extension ausente en Instructor

  El PDF dice: "teléfono 6045760000 extensión 42253"

  // Actual — falta extensión
  Instructor { fullName, phone, email }

  // Necesario
  Instructor { fullName, phone, extension, email }

  P3 — Calidad de PDF rasterizado

  El exporter actual hace DOM → PNG (html-to-image) → jspdf. El texto queda pixelado porque se captura 
  a resolución de pantalla. Al imprimir o hacer zoom en el PDF, se nota claramente.

  P4 — Textos estáticos de la plantilla no son editables

  El título "El SUBDIRECTOR ENCARGADO DEL CENTRO DE SERVICIOS Y GESTIÓN EMPRESARIAL", el "HACE CONSTAR 
  QUE:", el párrafo de contacto — todo está hardcodeado en SenaTemplate.tsx. Para personalizar un      
  centro diferente habría que tocar código.

  P5 — Sin sistema de firmas

  El PDF muestra claramente una imagen de firma manuscrita ("Proyectó: ..."). La app no tiene mecanismo
   para:
  - Subir imagen de firma
  - Dibujar firma en canvas
  - Posicionar/redimensionar la firma en el documento

  P6 — Sin editor visual

  No hay editor tipo Canva para modificar bloques estáticos de la plantilla.

  ---
  3. Propuesta de solución

  Arquitectura recomendada para las nuevas funcionalidades

  src/
  ├── components/
  │   ├── editor/                    ← NUEVO
  │   │   ├── TemplateEditor.tsx     ← Editor inline de bloques estáticos
  │   │   ├── EditableBlock.tsx      ← Bloque de texto click-to-edit
  │   │   ├── BlockStyleBar.tsx      ← Barra de estilos (bold, size, align)
  │   │   └── EditorToolbar.tsx      ← Toolbar principal del editor
  │   │
  │   ├── signature/                 ← NUEVO
  │   │   ├── SignaturePanel.tsx     ← Panel con tabs Upload/Draw
  │   │   ├── SignatureCanvas.tsx    ← Canvas para dibujar firma
  │   │   ├── SignatureUpload.tsx    ← Subida de imagen con preview
  │   │   └── SignaturePreview.tsx   ← Preview posicionable en documento
  │   │
  │   └── preview/
  │       └── templates/
  │           └── SenaTemplate.tsx   ← Actualizar para soportar Projects[] + firma
  │
  ├── types/
  │   ├── activities.ts              ← Cambiar tasks: string[] → Project[]
  │   ├── intern.ts                  ← Agregar extension a Instructor
  │   └── signature.ts               ← NUEVO: SignatureData
  │
  └── store/
      └── useFormStore.ts            ← Agregar signature, template overrides

  Decisiones técnicas clave

  Editor visual: Recomiendo inline editing sobre un canvas Canva completo. Razón: la carta tiene un    
  formato oficial fijo — un editor de arrastrar bloques libres rompería el layout institucional. La    
  solución correcta es click-to-edit sobre los bloques estáticos del template, con una barra de estilos
   flotante (bold, tamaño, alineación). Mismo resultado visual para el usuario, arquitectura 10x más   
  simple.

  Firma dibujada: Usar <canvas> nativo con eventos mousedown/mousemove/mouseup +
  touchstart/touchmove/touchend. Sin dependencias externas. Exportar como dataURL PNG y almacenar en el
   store.

  Calidad PDF: Subir el pixelRatio de html-to-image a 3 (equivale a 288 DPI efectivos). Costo: archivos
   ~3x más grandes, pero calidad de impresión profesional.

  Template overrides: Guardar overrides de texto estático en useFormStore como Record<string, string>  
  (blockId → texto personalizado). El SenaTemplate consulta el override antes de renderizar su texto   
  hardcodeado.

  ---
  4. Plan de implementación por fases

  ▎ Cada fase requiere aprobación antes de continuar (según CLAUDE.md)

  Fase A — Modelo de datos correcto (~2h)

  1. Crear interface Project { code, name, description }
  2. Actualizar Activities.tasks: string[] → Project[]
  3. Agregar Instructor.extension: string
  4. Agregar type SignatureData { type, dataUrl, position, size }
  5. Actualizar useFormStore (setters para Project CRUD)
  6. Actualizar letterFormatter.ts
  7. Actualizar SenaTemplate.tsx (renderizar proyectos estructurados)
  8. Actualizar DynamicList para campos de Project
  9. Actualizar validators.ts
  10. Actualizar tests afectados

  Fase B — Sistema de firmas (~3h)

  1. SignatureData type + store slice
  2. SignatureCanvas (dibujar con mouse/touch)
  3. SignatureUpload (drag & drop + click)
  4. SignaturePanel (tabs: Dibujar | Subir)
  5. Integrar en SenaTemplate (zona "Proyectó")
  6. Controles de posición/tamaño en ExportBar
  7. Persistir firma en localStorage (dataURL base64)

  Fase C — Editor visual inline (~4h)

  1. Tipo TemplateOverrides { [blockId: string]: BlockStyle }
  2. BlockStyle { text, fontSize, fontWeight, textAlign, color }
  3. EditableBlock - wrapper click-to-edit para bloques del template
  4. BlockStyleBar - barra flotante (bold, size, align, color)
  5. Actualizar SenaTemplate para usar EditableBlock en textos estáticos
  6. Integrar overrides en useFormStore con persist
  7. Botón "Resetear plantilla" para volver a defaults
  8. Modo edición / modo preview (toggle en toolbar)

  Fase D — Calidad PDF (~1h)

  1. Subir pixelRatio a 3 en pdfExporter.ts
  2. Usar jsPDF con compresión FAST
  3. Ajustar dimensiones A4 para mantener proporciones
  4. Test de calidad en tamaño A4 real

  ---
  5. Estructura de carpetas recomendada (final)

  src/
  ├── components/
  │   ├── editor/        ← Nuevo: editor inline de plantilla
  │   ├── form/          ← Existente + actualizar DynamicList para Project
  │   ├── layout/        ← Existente (sin cambios)
  │   ├── preview/       ← Existente + actualizar SenaTemplate
  │   ├── signature/     ← Nuevo: firma digital
  │   └── ui/            ← Existente + posible Tabs component
  │
  ├── types/
  │   ├── activities.ts  ← Project interface
  │   ├── signature.ts   ← Nuevo
  │   └── ...rest        ← Sin cambios mayores
  │
  ├── store/
  │   ├── useFormStore.ts  ← + signature slice + template overrides
  │   └── useAppStore.ts   ← + editorMode: 'preview' | 'edit'
  │
  └── services/
      └── pdfExporter.ts   ← Actualizar pixelRatio

  ---
  6. Resumen de prioridades

  ┌───────────┬───────────────────┬───────────────────────────────────────────────────────┐
  │ Prioridad │       Fase        │                        Impacto                        │
  ├───────────┼───────────────────┼───────────────────────────────────────────────────────┤
  ---
  6. Resumen de prioridades

  ┌───────────┬───────────────────┬───────────────────────────────────────────────────────┐
  │ Prioridad │       Fase        │                        Impacto                        │
  ├───────────┼───────────────────┼───────────────────────────────────────────────────────┤
  │ 🔴 Alta   │ A — Modelo datos  │ Sin esto, la app muestra proyectos incorrectamente    │
  ├───────────┼───────────────────┼───────────────────────────────────────────────────────┤
  │ 🔴 Alta   │ B — Firmas        │ Feature explícitamente pedido, visualmente prominente │
  ├───────────┼───────────────────┼───────────────────────────────────────────────────────┤
  │ 🟡 Media  │ C — Editor visual │ Feature diferenciador, más complejo                   │
  ├───────────┼───────────────────┼───────────────────────────────────────────────────────┤
  │ 🟢 Baja   │ D — Calidad PDF   │ Mejora incremental, ya funciona                       │
  └───────────┴───────────────────┴───────────────────────────────────────────────────────┘

  ---
  ¿Aprobamos este plan y arrancamos con la Fase A? Puedo comenzar inmediatamente con la corrección del 
  modelo de datos (Project[] + extension + SignatureData) y actualizar todos los consumidores en       
  cascada.