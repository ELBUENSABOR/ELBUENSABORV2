# El Buen Sabor V2

Aplicación web full stack para la gestión integral de un local gastronómico. El sistema combina una **API REST en Spring Boot** y una **interfaz web en React + Vite** para cubrir operaciones de venta, catálogo, stock, usuarios, reportes y pagos.

## 🚀 Tecnologías principales

### Backend (`elbuensaborbackend`)
- Java 21
- Spring Boot 3
- Spring Security + JWT
- Spring Data JPA
- MySQL
- Integración con Mercado Pago
- Generación de PDF (facturas / notas de crédito)

### Frontend (`elbuensaborfrontend`)
- React 19
- TypeScript
- Vite
- React Router
- Axios
- Bootstrap / React-Bootstrap

## 🧩 Módulos funcionales

- **Autenticación y usuarios**: login, registro y gestión de perfiles/roles.
- **Catálogo de productos**: gestión de insumos y productos manufacturados con imágenes.
- **Pedidos y ventas**: flujo de compra, detalle de pedidos e historial.
- **Stock y compras**: control de inventario, alertas y registro de compras de insumos.
- **Sucursal y configuración**: gestión de sucursales, rubros y unidades de medida.
- **Reportes**: métricas de clientes, productos más vendidos y balance financiero.
- **Pagos online**: integración de checkout/webhooks con Mercado Pago.

## 🏗️ Arquitectura técnica

### Vista general

El sistema está dividido en dos aplicaciones desacopladas:

1. **SPA Frontend (React + Vite)**
   - Consume la API vía `VITE_API_URL`.
   - Maneja navegación, estado de sesión y pantallas de cliente/admin/empleado.
2. **API Backend (Spring Boot)**
   - Expone endpoints REST bajo `/api/**`.
   - Implementa reglas de negocio, seguridad, persistencia y archivos.
3. **Base de datos MySQL**
   - Persistencia de usuarios, productos, pedidos, stock, facturación, etc.
4. **Servicios externos**
   - **Mercado Pago** para cobros y webhooks de pago.
   - **Google OAuth** para autenticación social.
   - **SMTP Gmail(Localhost)/Resend(Deploy)** para notificaciones por correo.

### Flujo de capas (backend)

```text
Controller -> Service -> Repository (Spring Data JPA) -> MySQL
                |
                +-> Integraciones (Mercado Pago, Mail, PDF, almacenamiento en uploads/)
```

### Componentes clave

- **Seguridad**:
  - JWT para autenticación de requests.
  - Control de acceso por roles (admin, empleado, cliente).
- **Gestión de archivos**:
  - Imágenes de perfil/productos y comprobantes en `uploads/`.
- **Módulo de pedidos**:
  - Alta/seguimiento de pedidos, actualización de estados, marcado de pago.
- **Módulo financiero**:
  - Facturas, notas de crédito y reportes agregados.

## 🗺️ Mapa de endpoints (backend)

> Base URL local: `http://localhost:8080`

### Salud de servicio
- `GET /`
- `GET /health`

### Autenticación (`/api/auth`)
- `POST /register`
- `POST /login`
- `POST /google`
- `POST /change-password`

### Usuarios (`/api/user`)
- `POST /`
- `GET /`
- `GET /{id}`
- `PUT /{id}`
- `DELETE /{id}`
- `POST /{id}/foto-perfil`

### Sucursales (`/api/sucursales`)
- `GET /`
- `GET /{id}`
- `POST /`
- `PUT /{id}`

### Insumos (`/api/insumos`)
- `GET /`
- `GET /{id}`
- `POST /`
- `PUT /{id}`
- `DELETE /{id}`
- `POST /{id}/imagenes` (carga de imágenes)

### Compras de insumos (`/api/insumos/compras`)
- `GET /`
- `POST /`

### Rubros de insumos (`/api/insumos/rubros`)
- `GET /`
- `GET /{id}`
- `POST /`
- `PUT /{id}`
- `DELETE /{id}`

### Manufacturados (`/api/manufacturados`)
- `GET /`
- `GET /{id}`
- `POST /`
- `PUT /{id}`
- `DELETE /{id}`
- `POST /{id}/imagenes` (carga de imágenes)

### Rubros de manufacturados (`/api/manufacturados/rubros`)
- `GET /`
- `GET /{id}`
- `POST /`
- `PUT /{id}`
- `DELETE /{id}`

### Pedidos (`/api/pedidos`)
- `POST /`
- `GET /`
- `GET /{id}`
- `PUT /{id}`
- `DELETE /{id}`
- `PUT /{id}/estado`
- `PUT /{id}/nota-credito`
- `PUT /{id}/pagado`

### Pagos (`/api/pagos`)
- `POST /mercadopago/{pedidoId}`
- `POST /mercadopago/webhook`
- `GET /mercadopago/verificar/{pedidoId}`

### Stock (`/api/stock`)
- `GET /verificar-manufacturado`
- `GET /verificar-insumo`
- `GET /alertas`

### Reportes (`/api/reportes`)
- `GET /productos-mas-vendidos`
- `GET /clientes-por-pedidos`
- `GET /balance-financiero`

### Soporte administrativo
- **Localidades** (`/api/localidad`): `GET /`
- **Unidades de medida** (`/api/unidades-medida`): `GET /`, `GET /{id}`, `POST /`, `PUT /{id}`, `DELETE /{id}`
- **Notas de crédito** (`/api/notas-credito`): `POST /factura/{facturaId}`

## 📁 Estructura del repositorio

```text
.
├── elbuensaborbackend/   # API REST y lógica de negocio
├── elbuensaborfrontend/  # SPA React
├── uploads/              # Archivos subidos (imágenes, facturas, etc.)
└── README.md
```

## ⚙️ Requisitos

- Java 21
- Node.js 20+ (recomendado)
- npm
- MySQL 8+

## 🛠️ Configuración rápida (desarrollo)

### 1) Backend

```bash
cd elbuensaborbackend
./gradlew bootRun
```

La API queda disponible por defecto en `http://localhost:8080`.

Variables recomendadas (ejemplo):

- `SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/elbuensabor`
- `SPRING_DATASOURCE_USERNAME=tu_usuario`
- `SPRING_DATASOURCE_PASSWORD=tu_password`
- `MERCADOPAGO_ACCESS_TOKEN=tu_token`
- `GOOGLE_CLIENT_ID=tu_client_id`

> Nota: para entornos productivos, usar secretos/variables de entorno y no credenciales embebidas en archivos versionados.

### 2) Frontend

```bash
cd elbuensaborfrontend
npm install
npm run dev
```

La app web corre por defecto en `http://localhost:5173`.

Configurar `.env` del frontend (ejemplo):

```env
VITE_API_URL=http://localhost:8080/api
VITE_GOOGLE_CLIENT_ID=tu_client_id_google
```

## 🧪 Scripts útiles

### Frontend

```bash
npm run dev      # desarrollo
npm run build    # build de producción
npm run lint     # análisis estático
npm run preview  # previsualizar build
```

### Backend

```bash
./gradlew bootRun
./gradlew test
```
