import {NavLink} from "react-router-dom";
import {BarChart3} from "lucide-react";

import {useUser} from "../../../contexts/UsuarioContext";
import {getEmployeePanelLabel} from "../../../utils/employeePanel";
import {SIDEBAR_ROUTES} from "./sidebarRoutes";

import "./sidebar.css";

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
                {SIDEBAR_ROUTES.map((route) => {
                    if (!user?.user?.role) return null;

                    const matchesRole = route.roles.includes(user.user.role);
                    const matchesSubRole = user.user.subRole
                        ? route.roles.includes(user.user.subRole)
                        : false;

                    if (!matchesRole && !matchesSubRole) return null;

                    return (
                        <li className="nav-item" key={route.key} onClick={close}>
                            <NavLink
                                to={route.fullPath}
                                className={({isActive}) =>
                                    `nav-link ${isActive ? "active" : ""}`
                                }
                            >
                                <route.icon size={18} className="nav-icon"/>
                                <span>{route.label}</span>
                            </NavLink>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
};

export default Sidebar;