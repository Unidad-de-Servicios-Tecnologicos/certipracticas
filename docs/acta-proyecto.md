# Acta de Proyecto — CertiPrácticas

## 1. Información general

- **Nombre del proyecto**: CertiPrácticas
- **Eslogan**: “Forja cartas profesionales con precisión”.
- **Tipo de solución**: Aplicación web SPA **100% client-side** (sin backend propio).
- **Propósito**: Generar **Certificaciones de Ejecución de Etapa Productiva del SENA** con vista previa en tiempo real, generación asistida por IA y exportación a PDF/DOCX.
- **Alcance organizacional**: Uso interno / institucional.

## 2. Antecedentes y necesidad

Actualmente la elaboración de certificaciones se realiza con alta carga manual y riesgo de inconsistencias (formato, redacción, datos). Se requiere una herramienta que:

- Estandarice el formato de la carta con una plantilla fiel al SENA.
- Acelere la captura de información mediante formularios estructurados.
- Apoye la redacción de secciones repetitivas mediante IA (actividades, fortalezas, evaluación).
- Permita exportar el resultado a **PDF** y **DOCX**.

## 3. Objetivo general

Construir una aplicación web client-side que permita **crear, previsualizar y exportar** certificaciones de etapa productiva del SENA, reduciendo el tiempo de elaboración y mejorando la consistencia documental.

## 4. Objetivos específicos

- Implementar un formulario estructurado con persistencia local (autosave).
- Renderizar una vista previa en tiempo real basada en una plantilla institucional.
- Integrar generación asistida por IA para secciones textuales.
- Exportar el documento a PDF (captura DOM por páginas) y a DOCX (generación programática).
- Incorporar controles de calidad y consistencia (validaciones).

## 5. Alcance (incluye / excluye)

### Incluye

- Captura de datos del aprendiz, centro, periodo, actividades y datos de firmantes.
- Generación de contenido asistida por IA (proveedor Gemini).
- Exportación PDF/DOCX.
- Persistencia en `localStorage`.
- Tema claro/oscuro.

### Excluye

- Backend, base de datos o autenticación propia.
- Multiusuario / roles / auditoría en servidor.
- Firma digital con certificados (PKI) y validez jurídica avanzada.
- Integración con sistemas institucionales externos (por ahora).

## 6. Entregables

- **Acta de proyecto**: `docs/acta-proyecto.md`
- **Requerimientos funcionales e historias de usuario**: `docs/requerimientos.md`
- **Diagramas C4**: `docs/c4.md`
- **Arquitectura del sistema**: `docs/arquitectura.md`
- **Manual de usuario**: `docs/manual-usuario.md`
- **Manual técnico**: `docs/manual-tecnico.md`
- **Manual de instalación**: `docs/manual-instalacion.md`

## 7. Stakeholders y roles

- **Patrocinador**: Área/Coordinación responsable del proceso de certificación.
- **Usuarios finales**: Personal administrativo/docente que elabora certificaciones.
- **Equipo técnico**: Desarrollo frontend, QA, soporte.

## 8. Requerimientos no funcionales clave (NFR)

- **Ejecución local**: navegador moderno.
- **Disponibilidad**: offline parcial (sin IA); IA requiere red.
- **Seguridad**: variables `VITE_*` quedan embebidas en el bundle; la API key debe restringirse por HTTP referrer.
- **Privacidad**: los datos persisten en `localStorage` sin cifrado; no usar para información sensible fuera del propósito.
- **Calidad de exportación**: PDF de alta resolución; DOCX editable.

## 9. Supuestos y restricciones

- La aplicación se distribuye como SPA (Vite) y puede desplegarse en Nginx.
- No existe servidor propio; cualquier integración futura requerirá rediseño de la arquitectura.
_Nota_: El dictado por voz no hace parte de las funcionalidades actuales del sistema.

## 10. Riesgos y mitigaciones

- **API key expuesta**: mitigar con restricciones en Google Cloud Console (HTTP referrers + cuotas).
- **Limitación PDF rasterizado**: documentar que el PDF no es texto buscable/accesible; ofrecer DOCX como alternativa editable.
- **Compatibilidad de navegador**: documentar variaciones entre navegadores y versiones.
- **Persistencia local**: riesgo por limpieza de navegador; incluir export y recomendaciones de respaldo.

## 11. Criterios de aceptación del proyecto

- Permite diligenciar el formulario, ver el documento en tiempo real y exportar PDF/DOCX.
- La plantilla corresponde al formato institucional esperado (estructura por páginas).
- La IA genera texto utilizable en español y se integra al flujo sin bloquear la edición manual.
- El autosave restaura el trabajo al recargar.

## 12. Aprobaciones

| Nombre | Rol | Firma | Fecha |
|---|---|---|---|
|  | Patrocinador |  |  |
|  | Líder funcional |  |  |
|  | Líder técnico |  |  |

