import {NavLink} from "react-router-dom";
import {useUser} from "../../../contexts/UsuarioContext";
import "./sidebar.css";

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
    {path: "/dashboard/home", label: "Inicio", icon: Home, rol: ["COCINERO", "ADMIN"]},
    {path: "/dashboard/sucursales", label: "Sucursales", icon: Building2, rol: ["ADMIN"]},
    {path: "/dashboard/usuarios", label: "Usuarios", icon: Users, rol: ["ADMIN"]},
    {path: "/dashboard/rubros-insumos", label: "Rubros de insumos", icon: Tags, rol: ["ADMIN"]},
    {path: "/dashboard/rubros-productos", label: "Rubros de productos", icon: Tags, rol: ["ADMIN"]},
    {path: "/dashboard/productos-insumos", label: "Insumos", icon: Package, rol: ["COCINERO", "ADMIN"]},
    {
        path: "/dashboard/productos-manufacturados",
        label: "Productos manufacturados",
        icon: Factory,
        rol: ["COCINERO", "ADMIN"]
    },
    {path: "/dashboard/stock", label: "Stock", icon: Boxes, rol: ["EMPLEADO", "ADMIN"]},
    {path: "/dashboard/compras", label: "Registro de compras", icon: ClipboardList, rol: ["EMPLEADO", "ADMIN"]},
    {path: "/dashboard/pedidos", label: "Pedidos", icon: ClipboardList, rol: ["CAJERO", "ADMIN"]},
    {path: "/dashboard/cocina", label: "Cocina", icon: ClipboardList, rol: ["COCINERO", "ADMIN"]},
    {path: "/dashboard/delivery", label: "Delivery", icon: ClipboardList, rol: ["DELIVERY", "ADMIN"]},
    {path: "/dashboard/productos-venta", label: "Productos a la venta", icon: ShoppingBag, rol: ["EMPLEADO", "ADMIN"]},
];

const Sidebar = ({open, close}: { open: boolean; close: () => void }) => {
    const user = useUser();

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
                    <span className="brand-title">Admin Panel</span>
                    <span className="brand-subtitle">Gestión del sistema</span>
                </div>
            </div>

            <div className="sidebar-section">Navegación</div>

            <ul className="nav nav-pills flex-column mb-auto">
                {links.map(
                    (link) =>
                        user?.user?.role &&
                        link.rol.includes(
                            user.user.role === "EMPLEADO"
                                ? (user.user.subRole || user.user.role)
                                : user.user.role
                        ) && (
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
                        )
                )}
            </ul>
        </nav>
    );
};

export default Sidebar;
