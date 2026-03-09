# El Buen Sabor 🍔

Plataforma full stack para gestión y venta online de una cadena gastronómica, con catálogo de productos, carrito, checkout con Mercado Pago, generación de comprobantes PDF y paneles operativos por rol (admin, cocina, caja, delivery).

## Tabla de contenidos
- [1. Arquitectura general](#1-arquitectura-general)
- [2. Stack tecnológico](#2-stack-tecnológico)
- [3. Funcionalidades principales](#3-funcionalidades-principales)
- [4. Flujo funcional del sistema](#4-flujo-funcional-del-sistema)
- [5. Estructura del repositorio](#5-estructura-del-repositorio)
- [6. Requisitos previos](#6-requisitos-previos)
- [7. Configuración de entorno](#7-configuración-de-entorno)
- [8. Ejecución local](#8-ejecución-local)
- [9. Integraciones externas](#9-integraciones-externas)
- [10. Deploy en Railway](#10-deploy-en-railway)
- [11. Seguridad](#11-seguridad)

---

## 1. Arquitectura general

El proyecto está dividido en dos aplicaciones:

- **Frontend SPA** en React + Vite + TypeScript.
- **Backend API REST** en Spring Boot (Java 17), con persistencia en MySQL.

Comunicación:
1. El frontend consume la API vía `VITE_API_URL`.
2. El backend valida autenticación JWT para endpoints protegidos.
3. Los pagos online se inician contra Mercado Pago y se sincronizan por webhook/verificación.
4. Al aprobarse un pago, se genera factura PDF y se envía por email.

---

## 2. Stack tecnológico

### Frontend
- React 19
- TypeScript
- Vite 7
- React Router DOM
- Axios
- Bootstrap + React Bootstrap
- Lucide React / React Icons

### Backend
- Java 17
- Spring Boot 3.5
- Spring Web, Validation, Security, Data JPA
- OAuth2 Resource Server / OAuth2 Client
- MySQL + Hibernate
- JWT (`jjwt`)
- Mercado Pago SDK (Java)
- PDFBox (comprobantes PDF)
- Resend (envío de emails transaccionales)

### Infra / Deploy
- **Railway** para despliegue (frontend y backend)
- CORS preparado para dominios `*.up.railway.app`

---

## 3. Funcionalidades principales

### Cliente
- Registro/Login tradicional.
- Login con Google.
- Catálogo de productos e insumos.
- Carrito y confirmación de pedido.
- Pago de pedido con Mercado Pago.
- Historial y detalle de pedidos.

### Operación interna
- Panel de empleados por rol.
- Gestión de productos manufacturados, insumos, rubros y unidades de medida.
- Gestión de stock y alertas de stock bajo.
- Gestión de sucursales y compras de insumos.
- Reportes operativos.

### Facturación y post-pago
- Sincronización de estado de pago desde Mercado Pago.
- Generación de factura PDF.
- Generación de nota de crédito.
- Envío de comprobantes por email.

---

## 4. Flujo funcional del sistema

1. El usuario navega el catálogo y arma el carrito.
2. Confirma el pedido desde frontend.
3. Se crea preferencia de pago en backend (`/api/pagos/mercadopago/{pedidoId}`).
4. El usuario paga en Mercado Pago.
5. Mercado Pago notifica al webhook (`/api/pagos/mercadopago/webhook`).
6. El backend valida/consulta el pago, actualiza estado y marca pedido como pagado.
7. Se genera factura automáticamente y se envía por email.

---

## 5. Estructura del repositorio

```bash
.
├── elbuensaborfrontend/   # SPA React + Vite
├── elbuensaborbackend/    # API Spring Boot
└── uploads/               # Archivos generados (imagenes, facturas, notas de crédito)
```

---

## 6. Requisitos previos

- Node.js 20+
- npm 10+
- Java 17
- MySQL 8+
- (Opcional en local) ngrok para webhook de Mercado Pago

---

## 7. Configuración de entorno

> Recomendación: crear archivos `.env` en frontend y configurar variables en Railway para producción.

### 7.1 Frontend (`elbuensaborfrontend/.env`)

```env
VITE_API_URL=http://localhost:8080/api
VITE_GOOGLE_CLIENT_ID=tu_google_client_id
```

### 7.2 Backend (variables de entorno)

```env
# Server
PORT=8080

# Base de datos
SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/elbuensabor
SPRING_DATASOURCE_USERNAME=root
SPRING_DATASOURCE_PASSWORD=admin

# Mercado Pago
MERCADOPAGO_ACCESS_TOKEN=TEST-...
MERCADOPAGO_FRONTEND_BASE_URL=http://localhost:5173
MERCADOPAGO_WEBHOOK_URL=https://tu-url-publica/api/pagos/mercadopago/webhook

# Google OAuth
GOOGLE_CLIENT_ID=tu_google_client_id
GOOGLE_ISSUER=https://accounts.google.com

# Email (deploy)
RESEND_API_KEY=re_...
APP_MAIL_FROM=onboarding@resend.dev

# CORS
APP_CORS_ALLOWED_ORIGIN_PATTERNS=http://localhost:5173,https://*.up.railway.app

# Uploads
APP_UPLOAD_DIR=uploads
```

---

## 8. Ejecución local

### 8.1 Backend

```bash
cd elbuensaborbackend
./gradlew bootRun
```

### 8.2 Frontend

```bash
cd elbuensaborfrontend
npm install
npm run dev
```

La app web quedará disponible por defecto en `http://localhost:5173`.

---

## 9. Integraciones externas

### 9.1 Mercado Pago API

- Se usa para crear preferencias de pago y validar estado de transacciones.
- Endpoints clave:
  - `POST /api/pagos/mercadopago/{pedidoId}`
  - `POST /api/pagos/mercadopago/webhook`
  - `GET /api/pagos/mercadopago/verificar/{pedidoId}`
- Requiere `MERCADOPAGO_ACCESS_TOKEN` y URL pública de webhook en entornos no locales.

### 9.2 Email en deploy: Resend

- El backend utiliza Resend para enviar facturas y notas de crédito.
- Variables mínimas: `RESEND_API_KEY` y `APP_MAIL_FROM`.
- Si no hay API key, el envío se omite y se registra en logs.

### 9.3 Email en localhost: SMTP (alternativa recomendada)

Actualmente el flujo productivo implementado es Resend. Para desarrollo local, se recomienda contar con un SMTP de pruebas (MailHog/Mailpit/Gmail sandbox) si querés simular inbox local sin depender de un proveedor externo.

> Nota: el proyecto ya incluye `spring-boot-starter-mail`, por lo que puede extenderse fácilmente con un `EmailService` SMTP para ambientes locales.

---

## 10. Deploy en Railway

Estrategia sugerida:

### Backend
1. Crear servicio Railway apuntando a `elbuensaborbackend`.
2. Build: `./gradlew build`.
3. Start: `java -jar build/libs/*.jar`.
4. Configurar variables de entorno (DB, Mercado Pago, Resend, CORS).

### Frontend
1. Crear servicio Railway apuntando a `elbuensaborfrontend`.
2. Build command: `npm ci && npm run build:railway`.
3. Publicar carpeta `dist`.
4. Configurar `VITE_API_URL` apuntando al backend deployado.

### Consideraciones
- Agregar dominio frontend en `APP_CORS_ALLOWED_ORIGIN_PATTERNS`.
- Configurar `MERCADOPAGO_FRONTEND_BASE_URL` con URL pública del frontend.
- Configurar `MERCADOPAGO_WEBHOOK_URL` con URL pública del backend.

---

## 11. Seguridad

- Autenticación JWT stateless.
- Filtro JWT para rutas protegidas.
- BCrypt para hash de contraseñas.
- CORS configurable por variable de entorno.
- Rutas públicas específicas (auth, health, webhook, catálogo), resto autenticadas.

---

## 12. Endpoints base del backend

Prefijo principal: `/api`

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/google`
- `POST /api/auth/change-password`
- `POST /api/pagos/mercadopago/{pedidoId}`
- `POST /api/pagos/mercadopago/webhook`
- `GET /api/pagos/mercadopago/verificar/{pedidoId}`
- `GET /health`
- `GET /actuator/health`

Además existen controladores para pedidos, insumos, manufacturados, stock, rubros, reportes, sucursales, usuarios, imágenes y unidades de medida.

