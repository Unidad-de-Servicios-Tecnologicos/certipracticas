# Requerimientos — CertiPrácticas

## 1. Objetivo del documento

Definir los **requerimientos funcionales**, **no funcionales** e **historias de usuario** para CertiPrácticas, asegurando trazabilidad con el alcance del proyecto y coherencia con la arquitectura (SPA client-side).

## 2. Alcance del sistema (resumen)

CertiPrácticas permite crear certificaciones del SENA a partir de un formulario estructurado, con:

- Vista previa en tiempo real.
- Generación asistida por IA (Gemini) para textos de apoyo.
- Exportación a PDF (captura DOM por páginas) y DOCX (generación programática).
- Persistencia local con `localStorage`.

## 3. Requerimientos funcionales (RF)

### RF-01. Gestión de carta (crear/editar)

- El sistema debe permitir diligenciar datos del aprendiz, centro, periodo, actividades, instructor, firmante, proyectó y metadatos.
- El sistema debe reflejar cambios en la vista previa de forma inmediata.

### RF-02. Persistencia local (autosave)

- El sistema debe guardar automáticamente el estado del formulario en `localStorage`.
- El sistema debe restaurar el estado guardado al recargar la página.
- El sistema debe soportar migraciones suaves al agregar nuevos campos (merge de rehidratación).

### RF-03. (No aplica) Dictado por voz

- El dictado por voz **no está implementado** actualmente. Si se incorpora en el futuro, se definirá en una versión posterior de este documento.

### RF-04. Generación asistida por IA

- El sistema debe permitir generar texto sugerido para:
  - Actividades / proyectos desarrollados.
  - Fortalezas técnicas.
  - Evaluación de desempeño.
- El usuario debe poder aceptar, editar o reemplazar el texto generado.
- El sistema debe mostrar mensajes de error en español ante fallos del proveedor.

### RF-05. Plantilla de carta (preview)

- El sistema debe renderizar una plantilla institucional (SENA) con:
  - Estructura de 2 páginas.
  - Elementos de identificación (logo, numeración, clasificación si aplica).
  - Texto construido desde el modelo de `Letter`.
- La plantilla debe marcar cada página con el atributo `data-letter-page` (contrato para exportación PDF por páginas).

### RF-06. Exportación a PDF

- El sistema debe exportar la carta a PDF capturando cada página del DOM (por `data-letter-page`).
- El sistema debe generar un nombre de archivo consistente basado en nombre del aprendiz y fecha.
- El sistema debe bloquear/indicar el estado de exportación mientras se genera el archivo.

### RF-07. Exportación a DOCX

- El sistema debe exportar la carta a DOCX generando el documento programáticamente.
- El DOCX debe conservar estructura, encabezados básicos y contenido textual consistente con la plantilla.

### RF-08. Validaciones

- El sistema debe validar campos mínimos requeridos para exportación.
- El sistema debe mostrar mensajes claros cuando falten datos esenciales (por secciones/campos).

### RF-09. Tema (claro/oscuro)

- El sistema debe permitir alternar tema claro/oscuro.
- El tema debe persistir o respetar preferencia del sistema (según implementación).

### RF-10. (Planificado) Estructura de “proyectos” en actividades

- El sistema debe permitir registrar actividades como lista de **proyectos** estructurados:
  - Código (opcional según caso).
  - Nombre.
  - Descripción.
- El sistema debe exportar los proyectos de forma consistente en PDF/DOCX.

### RF-11. (Planificado) Firma de “Proyectó”

- El sistema debe permitir asociar una firma manuscrita como imagen en el área “Proyectó”, mediante:
  - Dibujo en canvas, o
  - Carga de imagen.
- El sistema debe persistir la firma en `localStorage` y renderizarla en el preview/export.

### RF-12. (Planificado) Editor de textos estáticos de plantilla

- El sistema debe permitir editar textos estáticos de la plantilla (p.ej. encabezado del firmante, “HACE CONSTAR QUE:”, textos de contacto) mediante edición inline.
- El sistema debe persistir los overrides en `localStorage`.
- El sistema debe permitir restaurar los textos por defecto.

## 4. Requerimientos no funcionales (RNF)

### RNF-01. Arquitectura y ejecución

- SPA client-side, sin backend propio.
- El sistema debe funcionar en navegadores modernos.

### RNF-02. Rendimiento percibido

- La vista previa debe actualizarse sin bloqueos perceptibles ante edición normal de campos.
- La exportación debe indicar progreso/estado de bloqueo mientras se procesa.

### RNF-03. Seguridad

- Las variables `VITE_*` son públicas (embebidas en el bundle); la documentación debe exigir restricciones por **HTTP referrer** para la API key de Gemini.
- Debe recomendarse HTTPS en producción y políticas de seguridad en cabeceras (CSP, etc.) si se usa Nginx.

### RNF-04. Privacidad

- Los datos se almacenan en `localStorage` sin cifrado; advertir al usuario sobre el uso apropiado.

### RNF-05. Mantenibilidad

- La lógica de negocio debe residir en `services/` (sin imports de React).
- Los componentes `ui/` deben ser presentacionales y sin lógica de negocio.

### RNF-06. Calidad y pruebas

- Deben existir pruebas unitarias para servicios críticos (exportadores, validadores, store).
- Las pruebas deben ejecutarse con Vitest en entorno jsdom cuando aplique.

## 5. Historias de usuario (HU)

> Convención: “Como [rol] quiero [objetivo] para [beneficio]”.

### HU-01. Diligenciar datos base del aprendiz

- **Como** usuario final  
  **quiero** ingresar datos del aprendiz (nombre, documento, programa, etc.)  
  **para** generar la certificación sin errores de digitación.

**Criterios de aceptación**
- Al editar cualquier campo del aprendiz, el preview se actualiza inmediatamente.
- Si un campo clave está vacío, se visualiza un placeholder consistente (p.ej. `[Nombre]`) y/o se marca en validación.

### HU-02. Guardado automático del progreso

- **Como** usuario final  
  **quiero** que el sistema guarde mi progreso automáticamente  
  **para** no perder información si cierro el navegador.

**Criterios de aceptación**
- Tras recargar la página, el formulario conserva los últimos datos guardados.

### HU-03. (No aplica) Dictar texto por voz

- **Como** usuario final  
  **quiero** dictar por voz actividades y evaluación  
  **para** capturar información más rápido.

**Estado**
- Esta historia **no aplica** a la versión actual del sistema (funcionalidad no implementada).

### HU-04. Generar actividades con IA

- **Como** usuario final  
  **quiero** generar sugerencias de actividades con IA  
  **para** acelerar la redacción inicial.

**Criterios de aceptación**
- El usuario puede editar manualmente el texto generado antes de exportar.
- Si falla la llamada al proveedor, se muestra un error en español y no se pierde lo ya escrito.

### HU-05. Exportar a PDF

- **Como** usuario final  
  **quiero** exportar la certificación a PDF  
  **para** imprimir o compartir el documento.

**Criterios de aceptación**
- El PDF incluye todas las páginas del documento (por `data-letter-page`).
- El nombre del archivo es consistente (incluye nombre y fecha).

### HU-06. Exportar a DOCX

- **Como** usuario final  
  **quiero** exportar a DOCX  
  **para** poder editar el documento en un procesador de texto si es necesario.

**Criterios de aceptación**
- El DOCX contiene el mismo contenido esencial que el preview.

### HU-07. Validación antes de exportar

- **Como** usuario final  
  **quiero** que el sistema me avise si faltan datos esenciales  
  **para** evitar exportar documentos incompletos.

**Criterios de aceptación**
- Al exportar, si faltan datos mínimos, se muestra una lista de campos/secciones con error.

### HU-08. (Planificado) Registrar proyectos estructurados

- **Como** usuario final  
  **quiero** registrar proyectos con código/nombre/descripcion  
  **para** reflejar fielmente el formato del documento institucional.

**Criterios de aceptación**
- Puedo agregar, editar y eliminar proyectos desde el formulario.
- La exportación PDF/DOCX muestra los proyectos con formato coherente.

### HU-09. (Planificado) Adjuntar firma en “Proyectó”

- **Como** usuario final  
  **quiero** dibujar o subir una firma  
  **para** que la certificación quede lista con la firma manuscrita en “Proyectó”.

**Criterios de aceptación**
- Puedo dibujar una firma y guardarla.
- Puedo subir una imagen, previsualizarla y guardarla.
- La firma aparece en la vista previa y en la exportación.

### HU-10. (Planificado) Editar textos estáticos del template

- **Como** usuario final  
  **quiero** editar ciertos textos fijos del template  
  **para** adaptar la carta a variaciones institucionales sin tocar código.

**Criterios de aceptación**
- Existe un modo “editar” y un modo “vista previa”.
- Los cambios persisten en recargas.
- Puedo restaurar valores por defecto.

## 6. Trazabilidad (alto nivel)

- Exportación PDF: `pdfExporter` + contrato `data-letter-page`.
- Exportación DOCX: `docxExporter`.
- IA: `aiService` (Gemini).
- Persistencia: Zustand `persist` a `localStorage`.

