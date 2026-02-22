import {
    BarChart3,
    Boxes,
    Building2,
    ClipboardList,
    Factory,
    Home,
    Package,
    ShoppingBag,
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
    icon: LucideIcon;
    roles: SidebarRole[];
};

const buildDashboardPath = (path: string) => `dashboard/${path}`;
const buildFullPath = (path: string) => `/${buildDashboardPath(path)}`;

const createSidebarRoute = (
    key: string,
    path: string,
    label: string,
    icon: LucideIcon,
    roles: SidebarRole[]
): SidebarRoute => ({
    key,
    dashboardPath: path,
    fullPath: buildFullPath(path),
    label,
    icon,
    roles,
});

export const SIDEBAR_ROUTES: SidebarRoute[] = [
    createSidebarRoute("home", "home", "Inicio", Home, ["ADMIN", "EMPLEADO", "COCINERO", "DELIVERY", "CAJERO"]),
    createSidebarRoute("sucursales", "sucursales", "Sucursales", Building2, ["ADMIN"]),
    createSidebarRoute("usuarios", "usuarios", "Usuarios", Users, ["ADMIN"]),
    createSidebarRoute("pedidos", "pedidos", "Pedidos Caja", ClipboardList, ["CAJERO", "ADMIN"]),
    createSidebarRoute("cocina", "cocina", "Pedidos Cocina", ClipboardList, ["COCINERO", "ADMIN"]),
    createSidebarRoute("delivery", "delivery", "Pedidos Delivery", ClipboardList, ["DELIVERY", "ADMIN"]),
    createSidebarRoute("productos-insumos", "productos-insumos", "Insumos", Package, ["COCINERO", "ADMIN"]),
    createSidebarRoute(
        "productos-manufacturados",
        "productos-manufacturados",
        "Productos manufacturados",
        Factory,
        ["COCINERO", "ADMIN"]
    ),
    createSidebarRoute("stock", "stock", "Stock", Boxes, ["COCINERO", "ADMIN"]),
    createSidebarRoute("compras", "compras", "Registro de compras", ClipboardList, ["COCINERO", "ADMIN"]),
    createSidebarRoute("rubros-insumos", "rubros-insumos", "Rubros de insumos", Tags, ["COCINERO", "ADMIN"]),
    createSidebarRoute("rubros-productos", "rubros-productos", "Rubros de productos", Tags, ["COCINERO", "ADMIN"]),
    createSidebarRoute("productos-venta", "productos-venta", "Productos a la venta", ShoppingBag, ["ADMIN"]),
    createSidebarRoute(
        "reportes-productos-mas-vendidos",
        "reportes/productos-mas-vendidos",
        "Productos más vendidos",
        BarChart3,
        ["ADMIN"]
    ),
    createSidebarRoute(
        "reportes-clientes-por-pedidos",
        "reportes/clientes-por-pedidos",
        "Clientes por pedidos",
        BarChart3,
        ["ADMIN"]
    ),
    createSidebarRoute(
        "reportes-balance-financiero",
        "reportes/balance-financiero",
        "Balance financiero",
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
    reportesProductosMasVendidos: "reportes/productos-mas-vendidos",
    reportesClientesPorPedidos: "reportes/clientes-por-pedidos",
    reportesBalanceFinanciero: "reportes/balance-financiero",
    pedidos: "pedidos",
    cocina: "cocina",
    delivery: "delivery",
} as const;