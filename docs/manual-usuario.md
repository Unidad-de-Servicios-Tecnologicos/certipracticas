# Manual de Usuario — CertiPrácticas

## 1. Introducción

CertiPrácticas es una aplicación web para elaborar **Certificaciones de Ejecución de Etapa Productiva del SENA** con vista previa en tiempo real y exportación a **PDF** y **DOCX**.  
La aplicación funciona **en el navegador** y guarda el trabajo automáticamente en `localStorage`.

> Nota: la versión actual **no incluye dictado por voz**.

## 2. Requisitos para usar el sistema

- Navegador moderno (Chrome/Edge recomendado).
- Conexión a Internet **solo si** se utiliza la generación asistida por IA.

## 3. Flujo de trabajo recomendado (paso a paso)

### 3.1 Diligenciar la información

1. Abra la pantalla de generación.
2. Complete el formulario por secciones (aprendiz, centro, periodo, actividades/proyectos, firmantes, metadatos).
3. Verifique la vista previa en el panel de previsualización.

### 3.2 Registrar proyectos (Actividades)

En la sección de actividades, registre los **proyectos** como elementos estructurados:

- **Código** (si aplica)
- **Nombre**
- **Descripción**

Use “Agregar” para incluir nuevos proyectos y “Eliminar” para remover.

### 3.3 Agregar firma manuscrita (Proyectó)

En la sección de firma:

- Seleccione **Dibujar** para firmar con mouse/touch, o **Subir imagen** para cargar una firma escaneada/fotografiada.
- Guarde la firma.

#### Ajustar la firma en el documento

Cuando la firma esté guardada, puede ajustar:

- **Escala**
- **Rotación**
- **Alineación** (izquierda/centro/derecha)
- **Reset** para volver a valores por defecto

### 3.4 Editar visualmente el documento (Canvas)

El sistema incluye un modo de edición visual para aplicar formato de texto:

- Negrita, cursiva, subrayado, tachado
- Alineación (izquierda/centro/derecha/justificado)
- Tamaño de fuente
- Color y resaltado
- Limpiar formato

#### Recomendación

Si necesita máxima consistencia entre vista previa y exportaciones, haga los cambios principalmente desde el **formulario**.  
El modo canvas está diseñado para ajustes visuales controlados y ofrece la opción de **restaurar desde formulario**.

### 3.5 Logos del documento (plantilla visual)

Puede agregar y administrar logos:

- **Agregar logo** (imagen)
- Cambiar **sección** (header/footer/body)
- Ajustar posición con sliders **X/Y**
- **Duplicar**, **bloquear** y **quitar**

Además, puede **alinear** logos (izquierda/centro/derecha/justificar) para todos o para la selección.

### 3.6 Importar / exportar plantilla JSON

En la barra inferior:

- **JSON**: descarga la plantilla actual en formato `.json`.
- **Importar**: carga una plantilla `.json` (por ejemplo, para replicar la configuración en otro equipo).

### 3.7 Exportar el documento

En la barra de exportación:

- **DOCX**: genera un archivo editable para Word/LibreOffice.
- **Exportar PDF**: genera un PDF listo para compartir/imprimir.

Mientras se exporta, el sistema mostrará un indicador de proceso.

## 4. Guardado automático y recuperación

- El sistema guarda automáticamente el avance en el navegador.
- Si borra los datos del navegador, puede perder el trabajo. Para respaldo:
  - Exporte a PDF/DOCX cuando termine.
  - Exporte el JSON de plantilla si configuró logos/plantilla.

## 5. Solución de problemas (FAQ)

### “No veo el logo en el PDF/DOCX”

- Verifique que el logo fue agregado desde un archivo local (recomendado).
- Si el logo proviene de una URL, puede fallar por CORS.

### “La firma se ve muy grande/pequeña”

- Ajuste la **escala** en la sección de firma y use **Reset** si es necesario.

### “La IA no genera texto”

- Verifique conexión a Internet.
- Verifique que la variable `VITE_GEMINI_API_KEY` esté configurada en el entorno de despliegue.

