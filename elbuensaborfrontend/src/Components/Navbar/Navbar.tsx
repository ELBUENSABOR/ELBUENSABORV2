import {Navbar, Nav, Container, NavDropdown, Form} from "react-bootstrap";
import {Link} from "react-router-dom";
import "./navbar.css";
import {useUser} from "../../contexts/UsuarioContext";
import {useCatalogData} from "../../contexts/CatalogDataContext";
import {useCatalogFilters} from "../../contexts/CatalogFiltersContext";
import {LogIn, ShoppingCart} from 'lucide-react';

interface MyNavbarProps {
    onCartOpen: () => void;
    isCartOpen: boolean;
}

export default function MyNavbar({onCartOpen, isCartOpen}: MyNavbarProps) {
    const {user, logout} = useUser();
    const {categories} = useCatalogData();
    const {
        searchTerm,
        setSearchTerm,
        selectedCategoryId,
        setSelectedCategoryId,
    } = useCatalogFilters();

    const dropdownTitle = user ? user.username : "Cuenta";

    const handleCategoryClick = (categoryId: number | null) => {
        setSelectedCategoryId(categoryId);
    };

    const catalogPath = "/catalog";

    return (
        <Navbar expand="lg" className="navbar-container" sticky="top">
            <Container className="navbar-main">
                <Navbar.Brand as={Link} to="/">
                    EL BUEN SABOR
                </Navbar.Brand>

                <div className="navbar-controls">
                    <button
                        type="button"
                        className="navbar-icon-button"
                        onClick={onCartOpen}
                        aria-label="Abrir carrito"
                        aria-expanded={isCartOpen}
                    >
                        <ShoppingCart/>
                    </button>
                    <Navbar.Toggle aria-controls="main-navbar"/>
                </div>

                <Navbar.Collapse id="main-navbar">
                    <Nav className="me-auto align-items-lg-center gap-lg-3">
                        <Form className="navbar-search navbar-search--desktop">
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
                            Catalogo
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
                        {(user?.role === "ADMIN") && (
                            <Nav.Link as={Link} to="/dashboard/home" className="navbar-admin-link">
                                Panel de administración
                            </Nav.Link>
                        )}
                    </Nav>

                    <Nav className="navbar-actions">
                        {!user ? (
                            <div className="navbar-auth-buttons">

                                <Link className="btn navbar-auth-btn" to="/login">
                                    <LogIn/>
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
                                <hr/>
                                <NavDropdown.Item onClick={logout}>
                                    Cerrar sesión
                                </NavDropdown.Item>
                            </NavDropdown>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>

            <div className="navbar-search-wrapper">
                <Container>
                    <Form className="navbar-search navbar-search--mobile">
                        <Form.Control
                            type="search"
                            placeholder="Buscar comida o bebida"
                            value={searchTerm}
                            onChange={(event) => setSearchTerm(event.target.value)}
                        />
                    </Form>
                </Container>
            </div>
        </Navbar>
    );
}
