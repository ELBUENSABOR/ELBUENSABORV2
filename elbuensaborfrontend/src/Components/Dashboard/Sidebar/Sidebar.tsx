import { NavLink } from "react-router-dom";
import { useUser } from "../../../contexts/UsuarioContext";
import "./sidebar.css";

const links = [
  { path: "/dashboard/home", label: "Inicio", rol: ["EMPLEADO", "ADMIN"] },
  { path: "/dashboard/sucursales", label: "Sucursales", rol: ["ADMIN"] },
  { path: "/dashboard/usuarios", label: "Usuarios", rol: ["ADMIN"] },
  {
    path: "/dashboard/rubros-insumos",
    label: "Rubros de insumos",
    rol: ["EMPLEADO", "ADMIN"],
  },
  {
    path: "/dashboard/rubros-productos",
    label: "Rubros de productos",
    rol: ["EMPLEADO", "ADMIN"],
  },
  {
    path: "/dashboard/productos-insumos",
    label: "Ingredientes",
    rol: ["EMPLEADO", "ADMIN"],
  },
  {
    path: "/dashboard/productos-manufacturados",
    label: "Productos manufacturados",
    rol: ["EMPLEADO", "ADMIN"],
  },
  {
    path: "/dashboard/stock",
    label: "Alertas de stock",
    rol: ["EMPLEADO", "ADMIN"],
  },
  {
    path: "/dashboard/compras",
    label: "Registro de compras",
    rol: ["EMPLEADO", "ADMIN"],
  },
  {
    path: "/dashboard/productos-venta",
    label: "Productos a la venta",
    rol: ["EMPLEADO", "ADMIN"],
  },
];

const Sidebar = ({ open, close }: { open: boolean; close: () => void }) => {
  const user = useUser();

  return (
    <nav
      className={`sidebar-dashboard ${open ? "open" : ""}`}
      style={{ width: "240px" }}
    >
      {/* Cerrar en mobile */}
      <button className="close-btn" onClick={close}>
        ✕
      </button>

      <NavLink
        to="/dashboard"
        className="d-flex align-items-center mb-3 text-white text-decoration-none"
      >
        <span className="fs-5 fw-semibold">Gestión</span>
      </NavLink>

      <hr className="text-white-50" />

      <ul className="nav nav-pills flex-column mb-auto">
        {links.map(
          (link) =>
            user?.user?.role &&
            link.rol.includes(user.user.role) && (
              <li className="nav-item" key={link.path} onClick={close}>
                <NavLink
                  to={link.path}
                  className={({ isActive }) =>
                    `nav-link text-white ${
                      isActive ? "active bg-secondary" : "text-white-50"
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            )
        )}
      </ul>
    </nav>
  );
};

export default Sidebar;
