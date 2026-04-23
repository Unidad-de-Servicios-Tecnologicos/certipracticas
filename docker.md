# Despliegue con Docker — CertiPrácticas

Guía para arrancar **CertiPrácticas** en un servidor usando Docker. Pensada para personal técnico que recibe el proyecto sin contexto previo.

---

## 1. Requisitos previos

| Componente        | Versión mínima | Verificación             |
| ----------------- | -------------- | ------------------------ |
| Docker Engine     | 24.x           | `docker --version`       |
| Docker Compose    | v2 (plugin)    | `docker compose version` |
| Puerto disponible | `8080/tcp`     | `ss -ltn \| grep 8080`   |

> En Windows/macOS basta con instalar **Docker Desktop**, que incluye ambos.

---

## 2. Obtener el código

```bash
git clone <URL-DEL-REPO> certipracticas
cd certipracticas
```

Si recibe el proyecto como `.zip`, descomprímalo y entre a la carpeta resultante.

---

## 3. Configurar variables de entorno

Copie el archivo de ejemplo y edítelo:

```bash
cp .env.example .env
```

Edite `.env` y rellene como mínimo:

```env
VITE_AI_PROVIDER=gemini
VITE_GEMINI_API_KEY=su_api_key_real_aqui
VITE_GEMINI_MODEL=gemini-2.5-flash
```

### Cómo obtener la API key de Gemini

1. Ingrese a <https://aistudio.google.com/app/apikey>.
2. Cree una API key nueva.
3. **Restrinja la key por HTTP referrer** en Google Cloud Console (la key viaja en el bundle público):
   - Edit API key → *Application restrictions* → *HTTP referrers*.
   - Añada el dominio público: `https://su-dominio.com/*`.
4. Restrinja la key a la API **Generative Language**.
5. Configure cuotas y alertas de presupuesto.

> ⚠️ Si omite estas restricciones, cualquier visitante puede extraer la key con DevTools y consumir su cuota.

---

## 4. Construir y arrancar

```bash
docker compose up --build -d
```

- `--build` fuerza la compilación del bundle de producción dentro de la imagen.
- `-d` ejecuta en segundo plano (modo detached).

La aplicación queda disponible en:

```
http://<host>:8080
```

---

## 5. Verificar el estado

```bash
docker compose ps
docker compose logs -f web
```

El contenedor expone un **healthcheck** interno; el estado debe pasar a `healthy` en unos 30 s.

```bash
docker inspect --format='{{.State.Health.Status}}' certipracticas
```

---

## 6. Operación diaria

| Acción                    | Comando                            |
| ------------------------- | ---------------------------------- |
| Detener                   | `docker compose stop`              |
| Iniciar (sin reconstruir) | `docker compose start`             |
| Reiniciar                 | `docker compose restart`           |
| Ver logs en vivo          | `docker compose logs -f web`       |
| Bajar y eliminar          | `docker compose down`              |
| Eliminar incluyendo imagen| `docker compose down --rmi local`  |

---

## 7. Actualizar a una nueva versión

```bash
git pull
docker compose up --build -d
```

> Si cambia algún valor en `.env`, **debe** reconstruir (`--build`): las variables `VITE_*` se incrustan en build-time dentro del bundle JavaScript.

---

## 8. Despliegue detrás de un proxy inverso (recomendado)

La imagen sirve HTTP plano en el puerto `80` del contenedor (mapeado a `8080` del host). Para producción, colóquela detrás de **Nginx**, **Traefik** o **Caddy** para añadir TLS.

Ejemplo Nginx (host) — `/etc/nginx/sites-available/certipracticas`:

```nginx
server {
    listen 443 ssl http2;
    server_name certificados.suempresa.com;

    ssl_certificate     /etc/letsencrypt/live/certificados.suempresa.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/certificados.suempresa.com/privkey.pem;

    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host              $host;
        proxy_set_header X-Real-IP         $remote_addr;
        proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

> El **dictado por voz** (Web Speech API) requiere HTTPS en cualquier dominio que no sea `localhost`.

---

## 9. Cambiar el puerto público

Edite `docker-compose.yml`, sección `ports`:

```yaml
ports:
  - "9090:80"   # ahora disponible en http://host:9090
```

Aplique con `docker compose up -d`.

---

## 10. Solución de problemas

| Síntoma                                          | Causa probable                                              | Solución                                                                |
| ------------------------------------------------ | ----------------------------------------------------------- | ----------------------------------------------------------------------- |
| `port is already allocated`                      | Otro servicio usa el `8080`.                                | Cambie el puerto en `docker-compose.yml` o detenga el servicio rival.   |
| La generación con IA falla con `API_KEY_INVALID` | `.env` vacío o key incorrecta.                              | Corrija `VITE_GEMINI_API_KEY` y reconstruya con `docker compose up --build`. |
| El dictado por voz no inicia                     | El sitio se sirve por HTTP en un dominio distinto a `localhost`. | Configure HTTPS detrás de un proxy inverso.                             |
| Logs muestran `permission denied` en `/app`      | Volumen montado con propietario incorrecto.                 | Esta imagen no usa volúmenes; verifique no haber añadido `volumes:` manualmente. |
| Cambios en `.env` no surten efecto               | El bundle se compiló con los valores anteriores.            | Reconstruya: `docker compose up --build -d`.                            |

---

## 11. Desinstalar

```bash
docker compose down --rmi local --volumes
```

Elimina contenedor, imagen local y cualquier volumen asociado. El código fuente y `.env` permanecen en disco.

---

## Referencias internas

- `Dockerfile` — build multi-stage (Node 20 alpine → nginx 1.27 alpine).
- `nginx.conf` — configuración del servidor con CSP, HSTS y SPA fallback.
- `docker-compose.yml` — definición del servicio `web`.
- `.env.example` — plantilla de variables de entorno.
