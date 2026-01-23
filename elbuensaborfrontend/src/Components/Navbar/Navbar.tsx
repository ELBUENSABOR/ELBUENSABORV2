import { Navbar, Nav, Container, NavDropdown, Form } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import "./navbar.css";
import { useUser } from "../../contexts/UsuarioContext";
import { useCatalogData } from "../../contexts/CatalogDataContext";
import { useCatalogFilters } from "../../contexts/CatalogFiltersContext";

export default function MyNavbar() {
  const { user, logout } = useUser();
  const { categories } = useCatalogData();
  const {
    searchTerm,
    setSearchTerm,
    selectedCategoryId,
    setSelectedCategoryId,
  } = useCatalogFilters();
  const location = useLocation();

  const dropdownTitle = user ? user.username : "Cuenta";

  const handleCategoryClick = (categoryId: number | null) => {
    setSelectedCategoryId(categoryId);
  };

  const catalogPath = location.pathname === "/catalog" ? "/catalog" : "/";

  return (
    <Navbar expand="lg" className="navbar-container" sticky="top">
      <Container>
        <Navbar.Brand as={Link} to="/">
          EL BUEN SABOR
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="main-navbar" />

        <Navbar.Collapse id="main-navbar">
          <Nav className="me-auto align-items-lg-center gap-lg-3">
            <Form className="navbar-search">
              <Form.Control
                type="search"
                placeholder="Buscar comida o bebida"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </Form>
            <Nav.Link as={Link} to="/">
              Inicio
            </Nav.Link>
            <Nav.Link as={Link} to="/catalog">
              Productos
            </Nav.Link>
            {categories.length > 0 && (
              <NavDropdown title="Categorías" id="categories-nav-dropdown">
                <NavDropdown.Item
                  as={Link}
                  to={catalogPath}
                  onClick={() => handleCategoryClick(null)}
                  active={selectedCategoryId === null}
                >
                  Todas
                </NavDropdown.Item>
                {categories.map((category) => (
                  <NavDropdown.Item
                    as={Link}
                    key={category.id}
                    to={`${catalogPath}#categoria-${category.id}`}
                    onClick={() => handleCategoryClick(category.id)}
                    active={selectedCategoryId === category.id}
                  >
                    {category.name}
                  </NavDropdown.Item>
                ))}
              </NavDropdown>
            )}
            {(user?.role === "ADMIN" || user?.role === "EMPLEADO") && (
              <Nav.Link as={Link} to="/dashboard/home">
                Panel de administración
              </Nav.Link>
            )}
          </Nav>

          <Nav className="navbar-actions">
            {!user ? (
              <div className="navbar-auth-buttons">

                <Link className="btn btn-outline-light" to="/login">
                    <img
                        src="../../../../public/images/login_icon.svg"
                        alt="Carrito"
                        className="cart-sidebar__icon"
                    />
                  Ingresar
                </Link>
                <Link className="btn btn-light" to="/register">
                  Registrarse
                </Link>
              </div>
            ) : (
              <NavDropdown title={dropdownTitle} id="basic-nav-dropdown">
                <NavDropdown.Item as={Link} to="/account">
                  Perfil
                </NavDropdown.Item>
                <hr />
                <NavDropdown.Item onClick={logout}>
                  Cerrar sesión
                </NavDropdown.Item>
              </NavDropdown>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
