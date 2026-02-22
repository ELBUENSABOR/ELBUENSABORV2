import {NavLink} from "react-router-dom";
import {useUser} from "../../../contexts/UsuarioContext";
import "./sidebar.css";
import {getEmployeePanelLabel} from "../../../utils/employeePanel";

import {
    Home,
    Building2,
    Users,
    Tags,
    Package,
    Boxes,
    Factory,
    BarChart3,
    ClipboardList,
    ShoppingBag
} from "lucide-react";

const links = [
    {
        path: "/dashboard/home",
        label: "Inicio",
        icon: Home,
        rol: ["ADMIN", "EMPLEADO", "COCINERO", "DELIVERY", "CAJERO"]
    },
    {path: "/dashboard/sucursales", label: "Sucursales", icon: Building2, rol: ["ADMIN"]},
    {path: "/dashboard/usuarios", label: "Usuarios", icon: Users, rol: ["ADMIN"]},
    {path: "/dashboard/pedidos", label: "Pedidos Caja", icon: ClipboardList, rol: ["CAJERO", "ADMIN"]},
    {path: "/dashboard/cocina", label: "Pedidos Cocina", icon: ClipboardList, rol: ["COCINERO", "ADMIN"]},
    {path: "/dashboard/delivery", label: "Pedidos Delivery", icon: ClipboardList, rol: ["DELIVERY", "ADMIN"]},
    {path: "/dashboard/productos-insumos", label: "Insumos", icon: Package, rol: ["COCINERO", "ADMIN"]},
    {
        path: "/dashboard/productos-manufacturados",
        label: "Productos manufacturados",
        icon: Factory,
        rol: ["COCINERO", "ADMIN"]
    },
    {path: "/dashboard/stock", label: "Stock", icon: Boxes, rol: ["COCINERO", "ADMIN"]},
    {path: "/dashboard/compras", label: "Registro de compras", icon: ClipboardList, rol: ["COCINERO", "ADMIN"]},
    {
        path: "/dashboard/rubros-insumos",
        label: "Rubros de insumos",
        icon: Tags,
        rol: ["COCINERO", "ADMIN"]
    },
    {
        path: "/dashboard/rubros-productos",
        label: "Rubros de productos",
        icon: Tags,
        rol: ["COCINERO", "ADMIN"]
    },

    {
        path: "/dashboard/reportes/productos-mas-vendidos",
        label: "Productos más vendidos",
        icon: BarChart3,
        rol: ["ADMIN"],
    },
    {
        path: "/dashboard/reportes/clientes-por-pedidos",
        label: "Clientes por pedidos",
        icon: BarChart3,
        rol: ["ADMIN"],
    },
    {
        path: "/dashboard/reportes/balance-financiero",
        label: "Balance financiero",
        icon: BarChart3,
        rol: ["ADMIN"],
    },
];

const Sidebar = ({open, close}: { open: boolean; close: () => void }) => {
    const user = useUser();
    const isEmployee = user.user?.role === "EMPLEADO";
    const panelTitle = isEmployee
        ? getEmployeePanelLabel(user.user?.subRole)
        : "Admin Panel";
    const panelSubtitle = isEmployee ? "Área de trabajo" : "Gestión del sistema";

    return (
        <nav
            className={`sidebar-dashboard ${open ? "open" : ""}`}
            style={{width: "240px"}}
        >
            {/* Cerrar en mobile */}
            <button className="close-btn" onClick={close}>
                ✕
            </button>

            <div className="sidebar-brand">
                <div className="brand-logo"><BarChart3/></div>
                <div>
                    <span className="brand-title">{panelTitle}</span>
                    <span className="brand-subtitle">{panelSubtitle}</span>
                </div>
            </div>

            <div className="sidebar-section">Navegación</div>

            <ul className="nav nav-pills flex-column mb-auto">
                {links.map((link) => {
                    if (!user?.user?.role) return null;
                    const matchesRole = link.rol.includes(user.user.role);
                    const matchesSubRole = user.user.subRole
                        ? link.rol.includes(user.user.subRole)
                        : false;

                    if (!matchesRole && !matchesSubRole) return null;

                    return (
                        <li className="nav-item" key={link.path} onClick={close}>
                            <NavLink
                                to={link.path}
                                className={({isActive}) =>
                                    `nav-link ${isActive ? "active" : ""}`
                                }
                            >
                                <link.icon size={18} className="nav-icon"/>
                                <span>{link.label}</span>
                            </NavLink>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
};

export default Sidebar;
