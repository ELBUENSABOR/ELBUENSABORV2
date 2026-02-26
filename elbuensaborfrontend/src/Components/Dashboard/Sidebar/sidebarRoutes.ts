import {
    BarChart3,
    Boxes,
    Building2,
    ClipboardList,
    Factory,
    Home,
    Package,
    Tags,
    Users,
} from "lucide-react";
import type {LucideIcon} from "lucide-react";

export type SidebarRole = string;

export type SidebarRoute = {
    key: string;
    dashboardPath: string;
    fullPath: string;
    label: string;
    description: string;
    icon: LucideIcon;
    roles: SidebarRole[];
};

const buildDashboardPath = (path: string) => `dashboard/${path}`;
const buildFullPath = (path: string) => `/${buildDashboardPath(path)}`;

const createSidebarRoute = (
    key: string,
    path: string,
    label: string,
    description: string,
    icon: LucideIcon,
    roles: SidebarRole[]
): SidebarRoute => ({
    key,
    dashboardPath: path,
    fullPath: buildFullPath(path),
    label,
    description,
    icon,
    roles,
});

export const SIDEBAR_ROUTES: SidebarRoute[] = [
    createSidebarRoute("home", "home", "Inicio", "Resumen general del panel y actividad reciente.", Home, ["ADMIN", "EMPLEADO", "COCINERO", "DELIVERY", "CAJERO"]),
    createSidebarRoute("sucursales", "sucursales", "Sucursales", "Administración de sucursales y su configuración.", Building2, ["ADMIN"]),
    createSidebarRoute("usuarios", "usuarios", "Usuarios", "Gestión de empleados y clientes registrados.", Users, ["ADMIN"]),
    createSidebarRoute("pedidos", "pedidos", "Pedidos Caja", "Seguimiento y gestión de pedidos para caja.", ClipboardList, ["CAJERO", "ADMIN"]),
    createSidebarRoute("cocina", "cocina", "Pedidos Cocina", "Control del estado de pedidos en cocina.", ClipboardList, ["COCINERO", "ADMIN"]),
    createSidebarRoute("delivery", "delivery", "Pedidos Delivery", "Asignación y control de entregas en curso.", ClipboardList, ["DELIVERY", "ADMIN"]),
    createSidebarRoute("productos-insumos", "productos-insumos", "Insumos", "Catálogo de insumos disponibles para producción.", Package, ["COCINERO", "ADMIN"]),
    createSidebarRoute(
        "productos-manufacturados",
        "productos-manufacturados",
        "Productos manufacturados",
        "Administración de productos elaborados y recetas.",
        Factory,
        ["COCINERO", "ADMIN"]
    ),
    createSidebarRoute("stock", "stock", "Stock", "Monitoreo de stock mínimo y alertas por sucursal.", Boxes, ["COCINERO", "ADMIN"]),
    createSidebarRoute("compras", "compras", "Registro de compras", "Alta y consulta de compras de insumos.", ClipboardList, ["COCINERO", "ADMIN"]),
    createSidebarRoute("rubros-insumos", "rubros-insumos", "Rubros de insumos", "Clasificación y mantenimiento de rubros de insumos.", Tags, ["COCINERO", "ADMIN"]),
    createSidebarRoute("rubros-productos", "rubros-productos", "Rubros de productos", "Clasificación y mantenimiento de rubros de productos.", Tags, ["COCINERO", "ADMIN"]),
    createSidebarRoute(
        "reportes-productos-mas-vendidos",
        "reportes/productos-mas-vendidos",
        "Productos más vendidos",
        "Reporte de productos con mayor volumen de ventas.",
        BarChart3,
        ["ADMIN"]
    ),
    createSidebarRoute(
        "reportes-clientes-por-pedidos",
        "reportes/clientes-por-pedidos",
        "Clientes por pedidos",
        "Ranking de clientes según cantidad de pedidos.",
        BarChart3,
        ["ADMIN"]
    ),
    createSidebarRoute(
        "reportes-balance-financiero",
        "reportes/balance-financiero",
        "Balance financiero",
        "Análisis de ingresos y egresos consolidados.",
        BarChart3,
        ["ADMIN"]
    ),
];

export const DASHBOARD_PATHS = {
    home: "home",
    usuarios: "usuarios",
    sucursales: "sucursales",
    rubrosInsumos: "rubros-insumos",
    rubrosProductos: "rubros-productos",
    productosManufacturados: "productos-manufacturados",
    productosInsumos: "productos-insumos",
    stock: "stock",
    compras: "compras",
    comprasList: "compras/list",
    productosVenta: "productos-venta",
    reportesProductosMasVendidos: "reportes/productos-mas-vendidos",
    reportesClientesPorPedidos: "reportes/clientes-por-pedidos",
    reportesBalanceFinanciero: "reportes/balance-financiero",
    pedidos: "pedidos",
    cocina: "cocina",
    delivery: "delivery",
} as const;