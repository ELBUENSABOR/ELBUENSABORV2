import {Container, Form, Nav, Navbar, NavDropdown} from "react-bootstrap";
import {Link} from "react-router-dom";
import "./navbar.css";
import {useUser} from "../../contexts/UsuarioContext";
import {useCatalogFilters} from "../../contexts/CatalogFiltersContext";
import {useSucursal} from "../../contexts/SucursalContext";
import {LogIn, ShoppingCart} from 'lucide-react';

interface MyNavbarProps {
    onCartOpen: () => void;
    isCartOpen: boolean;
}

export default function MyNavbar({onCartOpen, isCartOpen}: MyNavbarProps) {
    const {user, logout} = useUser();
    const {sucursales, sucursalId, setSucursalId, loading: loadingSucursales} = useSucursal();
    const {
        searchTerm,
        setSearchTerm,
    } = useCatalogFilters();

    const dropdownTitle = user ? user.username : "Cuenta";
    const showSucursalSelector = user?.role !== "EMPLEADO";

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
                        {showSucursalSelector && (
                            <Form className="navbar-sucursal">
                                <Form.Label className="navbar-sucursal-label">
                                    Sucursal
                                </Form.Label>
                                <Form.Select
                                    value={sucursalId ?? ""}
                                    onChange={(event) =>
                                        setSucursalId(
                                            event.target.value
                                                ? Number(event.target.value)
                                                : null
                                        )
                                    }
                                    disabled={loadingSucursales || sucursales.length === 0}
                                    aria-label="Seleccionar sucursal"
                                >
                                    <option value="">Seleccioná una sucursal...</option>
                                    {sucursales.map((sucursal) => (
                                        <option key={sucursal.id} value={sucursal.id}>
                                            {sucursal.nombre}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form>
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
                                {(user?.role === "CLIENTE" || user?.role === "ADMIN") && (
                                    <NavDropdown.Item as={Link} to="/pedidos">
                                        Mis pedidos
                                    </NavDropdown.Item>
                                )}
                                <hr/>
                                <NavDropdown.Item onClick={logout}>
                                    Cerrar sesión
                                </NavDropdown.Item>
                            </NavDropdown>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>

            <div className="navbar-search-wrapper navbar-search--mobile">
                <Container>
                    <Form className="navbar-search">
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
