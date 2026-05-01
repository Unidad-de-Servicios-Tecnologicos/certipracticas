# Manual de Instalación — CertiPrácticas

## 1. Alcance

Este manual cubre instalación y ejecución:

- **Desarrollo local** (Vite dev server)
- **Build de producción** (dist estático)
- **Despliegue con Docker/Nginx**

## 2. Requisitos previos

- **Node.js** ≥ 20
- **npm** ≥ 10

Opcional (despliegue):

- Docker + Docker Compose

## 3. Configuración del proyecto (desarrollo)

### 3.1 Clonar e instalar dependencias

```bash
git clone <repo-url> certipracticas
cd certipracticas
npm install
```

### 3.2 Variables de entorno

1. Copie el ejemplo:

```bash
cp .env.example .env
```

2. Configure al menos:

- `VITE_AI_PROVIDER=gemini`
- `VITE_GEMINI_API_KEY=...`

> Importante: las variables `VITE_*` se inyectan en **build-time**.

### 3.3 Ejecutar en modo desarrollo

```bash
npm run dev
```

Abra `http://localhost:5173`.

## 4. Build de producción (sin Docker)

### 4.1 Generar build

```bash
npm run build
```

Salida: `dist/`

### 4.2 Probar el build localmente

```bash
npm run preview
```

## 5. Despliegue con Docker (recomendado)

### 5.1 Docker Compose

1. Configure `.env` (mismo formato que en desarrollo).
2. Construya y levante:

```bash
docker compose up --build
```

Disponible en `http://localhost:8080`.

### 5.2 Docker build/run (alternativa)

```bash
docker build \
  --build-arg VITE_AI_PROVIDER=gemini \
  --build-arg VITE_GEMINI_API_KEY=tu_api_key \
  -t certipracticas .

docker run -p 8080:80 certipracticas
```

## 6. Configuración de seguridad (producción)

### 6.1 Restricción de API key de Gemini

La app es **100% client-side**: la key `VITE_GEMINI_API_KEY` queda expuesta en el navegador. Para mitigación:

- Restringir por **HTTP referrer** (dominio) en Google Cloud Console.
- Restringir por **API** (solo Generative Language API).
- Configurar **cuotas** y alertas de presupuesto.

### 6.2 HTTPS

Servir siempre bajo **HTTPS** en producción (reverse proxy o Nginx).

## 7. Verificación post-instalación

- La aplicación carga y permite diligenciar el formulario.
- Exporta correctamente a **PDF** y **DOCX**.
- La importación/exportación de plantilla JSON funciona.
- La firma se puede dibujar/subir y aparece en exportaciones.
- Si IA está habilitada, genera texto correctamente con Gemini.

## 8. Solución de problemas

### Error: IA no funciona

- Verifique `VITE_GEMINI_API_KEY`.
- Revise restricciones en Google Cloud Console (referrers).
- Revise consola del navegador para mensajes de error.

### Logos no aparecen en export

- Preferir logos cargados como archivos (dataURL).
- Evitar URLs externas por posibles restricciones CORS.

