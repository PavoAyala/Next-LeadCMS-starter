# Web + LeadCMS + Neon Template

Plantilla profesional para tener **una landing / sitio web en Next.js** y un **CRM / CMS LeadCMS** conectado a **PostgreSQL en Neon**.  
Ideal para montar rápido una web de marketing con gestor de contenido y leads totalmente administrable.

---

## Qué incluye

### Apps y paquetes

- `apps/web`: aplicación **Next.js 16** (React) para la web pública.
- `apps/leadcms`: configuración de **LeadCMS Core** (Docker) como CMS/CRM.
- `@repo/ui`: librería de componentes React compartidos.
- `@repo/eslint-config`: configuración de ESLint (incluye `eslint-config-next` y `eslint-config-prettier`).
- `@repo/typescript-config`: `tsconfig` compartidos en el monorepo.

Todo el código del monorepo está en **TypeScript** donde aplica.

### Arquitectura

```text
┌───────────────────────────────────────────────────────────────┐
│                        DOCKER COMPOSE                         │
├────────────────────┬────────────────────┬─────────────────────┤
│                    │                    │                     │
│  WEB (Next.js)     │  LEADCMS (Core)    │  POSTGRES (Neon)    │
│  Port: 3000        │  Port: 8080        │  Port: 5432         │
│                    │                    │ (DB gestionada)     │
│  - React / TS      │  - .NET + EF Core  │  - neondb           │
│  - Tailwind (opc.) │  - API REST/Graph  │  - SSL by Neon      │
│                    │                    │                     │
└────────────────────┴────────────────────┴─────────────────────┘
          │                       │
          └─────────────── HTTP / HTTPS ───────────────────────┘
```

La app `web` consume contenido y datos de LeadCMS (que a su vez persiste todo en Neon).

---

## ✨ Características

### 🧩 **CMS + CRM listo para usar**

- LeadCMS como **backend de contenido y leads**:
  - Entidades base: `Contact`, `Content`, `ContentType`, `Media`, `User`, `Setting`, `Redirect`, etc.
  - Gestión de usuarios y roles (incluido Admin por defecto).
  - Autenticación vía JWT.

- Configuración de entidades y lenguajes soportados vía `.env`:
  - `ENTITIES__INCLUDE__*`
  - `SUPPORTEDLANGUAGES__*`

### 🌐 **Web en Next.js**

- Aplicación `apps/web` lista para:
  - Conectarse a LeadCMS con `LEADCMS_URL` y `LEADCMS_API_KEY`.
  - Consumir contenido generado en el CMS.
  - Servirse con **Docker** en el puerto `3000`.

### 🗄️ **Base de datos en Neon**

- Conexión directa a **PostgreSQL Neon**:
  - Host similar a: `ep-xxxx.c-4.us-east-1.aws.neon.tech`
  - Usuario: `neondb_owner`
  - Base: `neondb`
- Migraciones de LeadCMS se ejecutan contra Neon al arrancar el contenedor.
- Todo lo que haces en el admin (`/users`, `/content`, etc.) queda persistido en Neon.

### 🔐 **Seguridad y JWT**

- Configuración de JWT vía `.env` en `apps/leadcms`:
  - `JWT__SECRET`
  - `JWT__ISSUER`
  - `JWT__AUDIENCE`
- Clave JWT reutilizada como API key para que `web` consuma LeadCMS:
  - `LEADCMS_API_KEY` en `apps/web/.env`.

---

## 🚀 Quick Start (5 minutos con Docker)

### Prerrequisitos

- **Docker Desktop** (incluye Docker Compose).
- **Node.js 20+** (opcional, para desarrollo sin Docker).
- Cuenta en **Neon** con una base creada (por ejemplo `neondb`).

### 1. Clonar el repositorio

```bash
git clone <tu-repo-url>
cd template-de-web-y-admin-panel
```

### 2. Configurar Neon

En el panel de Neon:

- Crea un proyecto y una base de datos (por ejemplo `neondb`).
- Anota:
  - Host (sin el sufijo `-pooler`).
  - Usuario `neondb_owner` (o el que uses).
  - Password.
  - Nombre de base de datos.

### 3. Configurar LeadCMS (`apps/leadcms/.env`)

Si no existe, puedes basarte en `.env.sample`. Clave crítica: **usar el host directo, no el pooler**.

Ejemplo:

```env
# JWT
JWT__SECRET=...clavemuyLARGA...
JWT__ISSUER=leadcms-issuer
JWT__AUDIENCE=leadcms-audience

# Admin por defecto
DEFAULTUSERS__0__USERNAME=admin
DEFAULTUSERS__0__EMAIL=admin@yourdomain.com
DEFAULTUSERS__0__PASSWORD=tu-password-segura
DEFAULTUSERS__0__ROLES__0=Admin

# Postgres (Neon)
POSTGRES__SERVER=ep-tu-endpoint.c-4.us-east-1.aws.neon.tech   # sin -pooler
POSTGRES__PORT=5432
POSTGRES__USERNAME=neondb_owner
POSTGRES__PASSWORD=tuPasswordNeon
POSTGRES__DATABASE=neondb

# CORS
CORS__ALLOWEDORIGINS__0=http://localhost:8080
CORS__ALLOWEDORIGINS__1=http://localhost:3000
```

> **Importante**: evita usar el host con `-pooler` porque LeadCMS usa advisory locks de Postgres y el pooler puede generar errores tipo  
> `Attempted to release a lock that was not held`.

### 4. Configurar la web (`apps/web/.env`)

Ejemplo:

```env
LEADCMS_URL=http://leadcms:80
LEADCMS_API_KEY=<mismo JWT__SECRET de leadcms>
LEADCMS_DEFAULT_LANGUAGE=en
LEADCMS_CONTENT_DIR=.leadcms/content
LEADCMS_MEDIA_DIR=public/media
LEADCMS_ENABLE_DRAFTS=false

# Conexión directa a Neon (opcional para utilidades de la web)
NEON_DATABASE_URL=postgresql://neondb_owner:<password>@ep-tu-endpoint.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

### 5. Levantar todo con Docker

Desde la raíz del proyecto:

```bash
docker compose up -d
```

Esto levanta:

- `leadcms` → `http://localhost:8080`
- `web` → `http://localhost:3000`

### 6. Acceder a las apps

- **LeadCMS Admin**: `http://localhost:8080`
  - Usuario: el de `DEFAULTUSERS__0__USERNAME`
  - Password: el de `DEFAULTUSERS__0__PASSWORD`

- **Web pública**: `http://localhost:3000`

### 7. Verificar en Neon

En el dashboard de Neon (SQL editor), ejecuta:

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
```

Deberías ver tablas como `_migrations`, `users`, `content`, `media`, etc.

---

## 🧱 Estructura del proyecto

```text
template-de-web-y-admin-panel/
├── apps/
│   ├── web/                # Next.js app (sitio público)
│   │   ├── app/            # Rutas / páginas
│   │   ├── public/
│   │   ├── .env
│   │   └── Dockerfile
│   └── leadcms/            # Config de despliegue de LeadCMS
│       ├── .env
│       ├── .env.sample
│       ├── docker-compose.yml   # Ejemplo solo-LeadCMS
│       ├── generate-env.*       # Scripts para generar .env
│       ├── pg-backup.*          # Scripts de backup
│       └── pg-restore.*         # Scripts de restore
├── packages/
│   ├── ui/
│   ├── eslint-config/
│   └── typescript-config/
├── docker-compose.yml       # Orquestación web + LeadCMS
├── package.json
├── pnpm-workspace.yaml
├── turbo.json
└── README.md
```

---

## 🔧 Desarrollo sin Docker (opcional)

Si prefieres desarrollar la web sin Docker (solo usando LeadCMS en contenedor):

1. Levanta solo LeadCMS con Docker (desde `apps/leadcms` o usando el `docker-compose.yml` raíz).
2. En `apps/web/.env`, apunta `LEADCMS_URL` al host correcto (por ejemplo `http://localhost:8080` si expones el contenedor así).
3. Desde la raíz:

```bash
pnpm install
pnpm dev --filter=web
```

La web quedará en `http://localhost:3000` usando LeadCMS como backend.

---

## 🐘 Scripts útiles de Postgres (LeadCMS)

En `apps/leadcms` tienes scripts para gestionar backups/restauraciones usando las credenciales del `.env`:

- **Backup completo**:

  ```bash
  ./pg-backup.sh leadcms
  # o en Windows
  .\pg-backup.ps1 leadcms
  ```

- **Restore desde backup**:

  ```bash
  ./pg-restore.sh leadcms backup.sql
  # o en Windows
  .\pg-restore.ps1 leadcms backup.sql
  ```

Estos scripts leen los datos de conexión del `.env`, por lo que funcionarán contra Neon si allí están tus credenciales.

---

## ⚙️ Variables de entorno principales

### LeadCMS (`apps/leadcms/.env`)

| Variable                         | Descripción                                 |
| -------------------------------- | ------------------------------------------- |
| `JWT__SECRET`                    | Clave para firmar tokens JWT (muy larga)   |
| `JWT__ISSUER`                    | Issuer de los tokens                        |
| `JWT__AUDIENCE`                  | Audience de los tokens                      |
| `DEFAULTUSERS__0__USERNAME`     | Usuario admin por defecto                   |
| `DEFAULTUSERS__0__PASSWORD`     | Password admin inicial                      |
| `DEFAULTUSERS__0__EMAIL`        | Email admin inicial                         |
| `POSTGRES__SERVER`              | Host de Neon (sin `-pooler`)                |
| `POSTGRES__PORT`                | Puerto Postgres (normalmente 5432)          |
| `POSTGRES__USERNAME`            | Usuario Neon                                |
| `POSTGRES__PASSWORD`            | Password Neon                               |
| `POSTGRES__DATABASE`            | Base de datos (ej. `neondb`)                |
| `CORS__ALLOWEDORIGINS__*`       | Orígenes permitidos (`http://localhost:3000`) |
| `IDENTITY__REQUIREDIGIT`        | (Opcional) Bypass de política: `false` para no exigir números |
| `IDENTITY__REQUIREUPPERCASE`    | (Opcional) Bypass de política: `false` para no exigir mayúsculas |
| `IDENTITY__REQUIRELOWERCASE`    | (Opcional) Bypass de política: `false` para no exigir minúsculas |
| `IDENTITY__REQUIRENONALPHANUMERIC`| (Opcional) Bypass de política: `false` para no exigir caracteres especiales |
| `IDENTITY__REQUIREDLENGTH`      | (Opcional) Bypass de política: Longitud mínima de contraseña (ej. `5`) |

> **Nota sobre Contraseñas:** Por defecto, LeadCMS usa las políticas estrictas de ASP.NET Core (mínimo 6 caracteres, mayúscula, minúscula, número y símbolo). Si deseas usar una contraseña simple de desarrollo como `admin`, debes añadir las variables `IDENTITY__*` a tu `.env` para saltarte estas reglas antes de levantar el contenedor por primera vez.

### Web (`apps/web/.env`)

| Variable                      | Descripción                                   |
| ----------------------------- | --------------------------------------------- |
| `LEADCMS_URL`                | URL interna del servicio LeadCMS              |
| `LEADCMS_API_KEY`           | API key / JWT secret para autenticar contra CMS |
| `LEADCMS_DEFAULT_LANGUAGE`   | Idioma por defecto (`en`, `es`, etc.)         |
| `LEADCMS_CONTENT_DIR`        | Carpeta local donde se guardan contenidos     |
| `LEADCMS_MEDIA_DIR`          | Carpeta para media estático                   |
| `LEADCMS_ENABLE_DRAFTS`      | Si se usan borradores o solo publicado        |
| `NEON_DATABASE_URL`          | (Opcional) URL de conexión directa a Neon     |

---

## 🧪 Comandos Docker frecuentes

```bash
# Levantar servicios
docker compose up

# Levantar en segundo plano
docker compose up -d

# Ver estado
docker compose ps

# Ver logs
docker compose logs -f
docker compose logs -f leadcms
docker compose logs -f web

# Reiniciar servicios
docker compose restart
docker compose restart leadcms

# Bajar servicios
docker compose down
```

---

## 🐛 Troubleshooting rápido

- **LeadCMS en bucle con errores de lock**  
  - Asegúrate de que `POSTGRES__SERVER` **no** usa el host con `-pooler`.  
  - Usa el endpoint directo de Neon.

- **`http://localhost:8080` no responde**  
  - Revisa con `docker compose logs leadcms`.  
  - Confirma que las credenciales de Neon son correctas y la IP no está bloqueada.

- **La web en `3000` no puede hablar con LeadCMS**  
  - Verifica `LEADCMS_URL` y `LEADCMS_API_KEY` en `apps/web/.env`.  

---

## 📄 Licencia

Puedes adaptar este proyecto libremente para tus propios sitios y CRM internos. Asegúrate de revisar las licencias de LeadCMS y de cualquier otro servicio externo (Neon, etc.) al usarlo en producción.

