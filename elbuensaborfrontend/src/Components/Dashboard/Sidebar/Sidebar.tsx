import { NavLink } from "react-router-dom";

const links = [
  { path: "/dashboard/home", label: "Inicio" },
  { path: "/dashboard/rubros-insumos", label: "Rubros de insumos" },
  { path: "/dashboard/rubros-productos", label: "Rubros de productos" },
  { path: "/dashboard/productos-insumos", label: "Ingredientes" },
  {
    path: "/dashboard/productos-manufacturados",
    label: "Productos manufacturados",
  },
  { path: "/dashboard/stock", label: "Alertas de stock" },
  { path: "/dashboard/compras", label: "Registro de compras" },
  { path: "/dashboard/productos-venta", label: "Productos a la venta" },
];

const Sidebar = () => {
  return (
    <nav
      className="d-flex flex-column flex-shrink-0 p-3 text-white bg-dark"
      style={{ width: "240px", minHeight: "100vh" }}
    >
      <NavLink
        to="/dashboard"
        className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none"
      >
        <span className="fs-5 fw-semibold">Gestión</span>
      </NavLink>
      <hr className="text-white-50" />
      <ul className="nav nav-pills flex-column mb-auto">
        {links.map((link) => (
          <li className="nav-item" key={link.path}>
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
        ))}
      </ul>
    </nav>
  );
};

export default Sidebar;
