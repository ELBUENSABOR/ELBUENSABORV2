import { useState } from "react";
import { Container, Form, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./navbar.css";
import { useUser } from "../../contexts/UsuarioContext";
import { useCatalogFilters } from "../../contexts/CatalogFiltersContext";
import { useSucursal } from "../../contexts/SucursalContext";
import { LogIn, Search, ShoppingCart } from "lucide-react";
import { HiOutlineUserCircle } from "react-icons/hi";
import { getImageUrl } from "../../utils/image";

interface MyNavbarProps {
    onCartOpen: () => void;
    isCartOpen: boolean;
}

export default function MyNavbar({ onCartOpen, isCartOpen }: MyNavbarProps) {
    const { user, logout } = useUser();
    const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
    const { sucursales, sucursalId, setSucursalId, loading: loadingSucursales } = useSucursal();
    const { searchTerm, setSearchTerm } = useCatalogFilters();

    const dropdownTitle = user ? user.username : "Cuenta";
    const profilePhotoUrl = user?.fotoPerfil ? getImageUrl(user.fotoPerfil) : "";
    const showSucursalSelector = user?.role !== "EMPLEADO";

    return (
        <Navbar expand="lg" className="navbar-container" sticky="top">
            <Container className="navbar-main">
                <Navbar.Brand as={Link} to="/" className="navbar-brand-group" aria-label="Ir al inicio">
                    <img src="/logo.png" alt="El Buen Sabor" className="navbar-brand-logo-img" />
                </Navbar.Brand>

                {showSucursalSelector && (
                    <div className="navbar-mobile-sucursal">
                        <Form.Select
                            className="navbar-mobile-sucursal-select"
                            value={sucursalId ?? ""}
                            onChange={(event) =>
                                setSucursalId(event.target.value ? Number(event.target.value) : null)
                            }
                            disabled={loadingSucursales || sucursales.length === 0}
                            aria-label="Seleccionar sucursal"
                        >
                            <option value="">{loadingSucursales ? "Cargando..." : "Sucursal"}</option>
                            {sucursales.map((sucursal) => (
                                <option key={sucursal.id} value={sucursal.id}>
                                    {sucursal.nombre}
                                </option>
                            ))}
                        </Form.Select>
                    </div>
                )}

                <div className="navbar-controls">
                    <button
                        type="button"
                        className="navbar-icon-button"
                        onClick={onCartOpen}
                        aria-label="Abrir carrito"
                        aria-expanded={isCartOpen}
                    >
                        <ShoppingCart size={18} />
                    </button>

                    <button
                        type="button"
                        className="navbar-icon-button"
                        onClick={() => setIsMobileSearchOpen((prev) => !prev)}
                        aria-label="Abrir buscador"
                        aria-expanded={isMobileSearchOpen}
                    >
                        <Search size={18} />
                    </button>

                    <Navbar.Toggle aria-controls="main-navbar" className="navbar-toggle" />
                </div>

                <Navbar.Collapse id="main-navbar">
                    <Nav className="navbar-mobile-menu d-lg-none">
                        <Nav.Link as={Link} to="/" className="navbar-link">
                            Inicio
                        </Nav.Link>

                        <Nav.Link as={Link} to="/catalog" className="navbar-link">
                            Catálogo
                        </Nav.Link>

                        {!user && (
                            <>
                                <Nav.Link as={Link} to="/login" className="navbar-link">
                                    Ingresar
                                </Nav.Link>
                                <Nav.Link as={Link} to="/register" className="navbar-link">
                                    Registrarme
                                </Nav.Link>
                            </>
                        )}

                        {user?.role === "ADMIN" && (
                            <Nav.Link as={Link} to="/dashboard/home" className="navbar-admin-link">
                                Panel de administración
                            </Nav.Link>
                        )}
                    </Nav>

                    <div className="d-none d-lg-flex w-100 align-items-center">
                        <Nav className="me-auto align-items-lg-center gap-lg-2">
                            <Form className="navbar-search navbar-search--desktop" role="search" aria-label="Buscar">
                <span className="navbar-search-icon" aria-hidden="true">
                  <Search size={16} />
                </span>
                                <Form.Control
                                    type="search"
                                    placeholder="Buscar comida o bebida"
                                    value={searchTerm}
                                    onChange={(event) => setSearchTerm(event.target.value)}
                                />
                            </Form>

                            <Nav.Link as={Link} to="/" className="navbar-link">
                                Inicio
                            </Nav.Link>

                            <Nav.Link as={Link} to="/catalog" className="navbar-link">
                                Catálogo
                            </Nav.Link>

                            {showSucursalSelector && (
                                <Form className="navbar-sucursal">
                                    <Form.Label className="navbar-sucursal-label">Sucursal</Form.Label>
                                    <Form.Select
                                        value={sucursalId ?? ""}
                                        onChange={(event) =>
                                            setSucursalId(event.target.value ? Number(event.target.value) : null)
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

                            {user?.role === "ADMIN" && (
                                <Nav.Link as={Link} to="/dashboard/home" className="navbar-admin-link">
                                    Panel de administración
                                </Nav.Link>
                            )}
                        </Nav>

                        <Nav className="navbar-actions">
                            {!user ? (
                                <div className="navbar-auth-buttons">
                                    <Link className="btn navbar-auth-btn" to="/login">
                                        <LogIn size={18} />
                                        Ingresar
                                    </Link>

                                    <Link className="btn btn-light" to="/register">
                                        Registrarse
                                    </Link>
                                </div>
                            ) : (
                                <NavDropdown
                                    title={
                                        <span className="navbar-user-trigger">
                      <span className="navbar-user-name">{dropdownTitle}</span>

                                            {profilePhotoUrl ? (
                                                <img
                                                    src={profilePhotoUrl}
                                                    alt="Foto de perfil"
                                                    className="navbar-user-avatar"
                                                />
                                            ) : (
                                                <HiOutlineUserCircle className="navbar-user-avatar navbar-user-avatar--fallback" />
                                            )}
                    </span>
                                    }
                                    id="basic-nav-dropdown"
                                    align="end"
                                >
                                    <NavDropdown.Item as={Link} to="/account">
                                        Perfil
                                    </NavDropdown.Item>

                                    {(user?.role === "CLIENTE" || user?.role === "ADMIN") && (
                                        <NavDropdown.Item as={Link} to="/pedidos">
                                            Mis pedidos
                                        </NavDropdown.Item>
                                    )}

                                    <hr />
                                    <NavDropdown.Item onClick={logout}>Cerrar sesión</NavDropdown.Item>
                                </NavDropdown>
                            )}
                        </Nav>
                    </div>
                </Navbar.Collapse>
            </Container>

            <div className={`navbar-search-wrapper${isMobileSearchOpen ? " is-open" : ""}`}>
                <Container>
                    <Form className="navbar-search navbar-search--mobile" role="search" aria-label="Buscar">
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