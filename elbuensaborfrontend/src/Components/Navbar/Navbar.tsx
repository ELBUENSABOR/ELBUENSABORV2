import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./navbar.css";
import { useUser } from "../../contexts/UsuarioContext";

export default function MyNavbar() {
    const { user, logout } = useUser();

    const dropdownTitle = user ? user.username : "Cuenta";

    return (
        <Navbar expand="lg" className="navbar-container">
            <Container>
                <Navbar.Brand as={Link} to="/">
                    EL BUEN SABOR
                </Navbar.Brand>

                <Navbar.Toggle aria-controls="main-navbar" />

                <Navbar.Collapse id="main-navbar">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/">
                            Inicio
                        </Nav.Link>
                        <Nav.Link as={Link} to="/catalog">
                            Productos
                        </Nav.Link>
                        {(user?.role === "ADMIN" || user?.role === "EMPLEADO") && (
                            <Nav.Link as={Link} to="/dashboard/home">
                                Panel de administración
                            </Nav.Link>
                        )}

                        <NavDropdown title={dropdownTitle} id="basic-nav-dropdown">
                            {!user ? (
                                <>
                                    <NavDropdown.Item as={Link} to="/login">
                                        Ingresar
                                    </NavDropdown.Item>
                                    <NavDropdown.Item as={Link} to="/register">
                                        Registrarse
                                    </NavDropdown.Item>
                                </>
                            ) : (
                                <>
                                    <NavDropdown.Item as={Link} to="/account">
                                        Perfil
                                    </NavDropdown.Item>
                                    <hr />
                                    <NavDropdown.Item onClick={logout}>
                                        Cerrar sesión
                                    </NavDropdown.Item>
                                </>
                            )}
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}
