# Proyecto Express + React

Monorepo desarrollado con **TypeScript**, utilizando **Express** para el backend y **React + Vite** para el frontend.

El proyecto utiliza **pnpm** como gestor de paquetes y **Turborepo** para administrar las aplicaciones y paquetes del monorepo.

## Tecnologías utilizadas

* Node.js
* pnpm
* Turborepo
* TypeScript
* Express
* React
* Vite
* React Router DOM
* Tailwind CSS
* shadcn/ui
* Zod
* JWT
* bcrypt
* Cookies HttpOnly

## Estructura del proyecto

```text
.
├── apps/
│   ├── api/          # Backend Express
│   └── web/          # Frontend React
│
├── packages/
│   └── validation/   # Schemas compartidos con Zod
│
├── package.json
├── pnpm-workspace.yaml
├── turbo.json
└── README.md
```

---

# Requisitos

Antes de iniciar el proyecto necesitas tener instalado:

* Node.js
* pnpm

Se recomienda utilizar una versión reciente de Node.js compatible con las dependencias del proyecto.

Puedes comprobar si Node.js ya está instalado:

```bash
node --version
```

Y comprobar pnpm:

```bash
pnpm --version
```

---

# Instalación de pnpm

Si el comando `pnpm` no existe en tu sistema, puedes instalarlo de diferentes maneras.

## Opción 1: Corepack

En versiones recientes de Node.js puedes utilizar Corepack:

```bash
corepack enable
```

Después:

```bash
corepack prepare pnpm@11.21.0 --activate
```

Comprueba la instalación:

```bash
pnpm --version
```

Deberías obtener una versión compatible con la especificada por el proyecto.

## Opción 2: npm

También puedes instalar pnpm globalmente mediante npm:

```bash
npm install -g pnpm
```

Después verifica:

```bash
pnpm --version
```

---

# Clonar el repositorio

Clona el repositorio:

```bash
git clone <URL_DEL_REPOSITORIO>
```

Entra al directorio:

```bash
cd <NOMBRE_DEL_PROYECTO>
```

---

# Instalar dependencias

Desde la raíz del proyecto ejecuta:

```bash
pnpm install
```

No es necesario ejecutar `pnpm install` individualmente dentro de `apps/api`, `apps/web` o `packages/validation`.

Al tratarse de un workspace, pnpm instalará las dependencias del monorepo.

---

# Variables de entorno

El frontend utiliza variables de entorno para su configuracion.

Crea el archivo:

```text
apps/web/.env
```

con las variables necesarias para el proyecto.

Por ejemplo:

```env
API_URL=http://localhost:3033/api
```

El backend utiliza variables de entorno para su configuración.

Crea el archivo:

```text
apps/api/.env
```

con las variables necesarias para el proyecto.

Por ejemplo:

```env
PORT=3033
FRONTEND_URL=http://localhost:5173
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret

SNAILPAY_SIMULATE_ERROR=false
```

## Simular error interno de SnailPay

Para probar el escenario de error interno de SnailPay:

```env
SNAILPAY_SIMULATE_ERROR=true
```

Cuando esta opción está activa, SnailPay debe rechazar las solicitudes simulando un problema interno y **no debe aplicarse ninguna recarga de saldo**.

Después de modificar las variables de entorno, reinicia el servidor.

---

# Ejecutar el proyecto

El proyecto utiliza Turborepo para ejecutar las aplicaciones.

Desde la raíz:

```bash
pnpm dev
```

Esto iniciará las aplicaciones configuradas para desarrollo.

El backend y frontend utilizarán los puertos definidos en sus respectivas configuraciones.

Por ejemplo:

```text
Frontend:
http://localhost:5173

Backend:
http://localhost:3033
```

Los puertos pueden cambiar dependiendo de la configuración local.

---

# Tests automatizados

El proyecto cuenta con pruebas automatizadas separadas para backend y frontend.

## Tests del backend

Para ejecutar las pruebas de la API:

```bash
pnpm --filter api test
```

Estas pruebas corresponden a la aplicación:

```text
apps/api
```

## Tests del frontend

Para ejecutar las pruebas del frontend:

```bash
pnpm --filter web test
```

Estas pruebas corresponden a:

```text
apps/web
```

## Ejecutar ambas pruebas

Puedes ejecutar ambos comandos por separado:

```bash
pnpm --filter api test
pnpm --filter web test
```

---

# SnailPay

SnailPay es una **pasarela de pagos simulada** implementada directamente dentro del backend.

No se conecta con servicios externos y no procesa información financiera real.

Para solicitar una recarga se utilizan:

* Número de tarjeta
* Fecha de vencimiento
* CVV
* Nombre completo
* Monto
* Identificador del usuario
* Correo del usuario

El identificador y correo del usuario se obtienen desde la sesión autenticada y no deben confiarse a valores enviados directamente por el frontend.

## Transacción exitosa

Los siguientes datos producen una transacción aprobada:

```text
Número de tarjeta: 1234123412341234
Fecha:             12/26
CVV:               543
Nombre:            cualquier valor no vacío
Monto:             cualquier cantidad mayor que 0
```

Cuando la transacción es aprobada:

1. SnailPay devuelve el resultado aprobado.
2. Se actualiza el saldo del usuario.
3. El nuevo saldo se devuelve al frontend.
4. El frontend actualiza el dashboard.
5. El saldo puede almacenarse en LocalStorage.

## Transacción rechazada

Se pueden utilizar datos diferentes a los valores válidos de prueba para provocar una transacción rechazada.

Por ejemplo, utilizar un número de tarjeta diferente al definido para la aprobación puede producir:

```json
{
  "status": "rejected",
  "status_detail": "Card declined"
}
```

## Error interno

El error interno de SnailPay puede simularse mediante:

```env
SNAILPAY_SIMULATE_ERROR=true
```

En este escenario SnailPay debe devolver un error interno y **no debe actualizarse el saldo del usuario**.

---

# Validación

La validación compartida se encuentra en:

```text
packages/validation
```

Esto permite reutilizar los mismos schemas desde el frontend y backend.

---

# Desarrollo

Durante el desarrollo se recomienda trabajar desde la raíz del monorepo:

```bash
pnpm dev
```

Las dependencias compartidas deben agregarse al paquete correspondiente dentro de `packages`.

---

# Comandos principales

| Comando                  | Descripción                           |
| ------------------------ | ------------------------------------- |
| `pnpm install`           | Instala las dependencias del monorepo |
| `pnpm dev`               | Inicia el entorno de desarrollo       |
| `pnpm --filter api dev`  | Inicia solamente el backend           |
| `pnpm --filter web dev`  | Inicia solamente el frontend          |
| `pnpm --filter api test` | Ejecuta las pruebas del backend       |
| `pnpm --filter web test` | Ejecuta las pruebas del frontend      |

---

# Flujo rápido para comenzar

Si ya tienes Node.js instalado, los pasos principales son:

```bash
# 1. Clonar
git clone <URL_DEL_REPOSITORIO>

# 2. Entrar al proyecto
cd <NOMBRE_DEL_PROYECTO>

# 3. Instalar dependencias
pnpm install

# 4. Configurar variables de entorno
# Crear apps/api/.env

# 5. Iniciar frontend y backend
pnpm dev
```

Para ejecutar las pruebas:

```bash
pnpm --filter api test
pnpm --filter web test
```

---

# Estado del proyecto

Este proyecto está planteado como una prueba local y prioriza una implementación sencilla y funcional.

Actualmente incluye:

* Monorepo con pnpm y Turborepo.
* Backend Express con TypeScript.
* Frontend React con TypeScript.
* Tailwind CSS y shadcn/ui.
* React Router DOM.
* Validaciones con Zod.
* Registro y login local.
* Autenticación JWT.
* Access token y refresh token.
* Cookies HttpOnly.
* Endpoint de usuario autenticado.
* Renovación del access token.
* Mock de pagos SnailPay.
* Recarga de saldo.
* Manejo de transacciones aprobadas y rechazadas.
* Simulación de errores internos de SnailPay.
* Pruebas automatizadas para backend y frontend.

La persistencia mediante una base de datos y otras características de producción pueden incorporarse posteriormente.
