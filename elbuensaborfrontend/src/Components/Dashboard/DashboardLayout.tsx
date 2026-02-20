import {Link, Outlet} from "react-router-dom";
import {useState} from "react";
import {FaRegArrowAltCircleRight} from "react-icons/fa";
import {FiExternalLink, FiGrid} from "react-icons/fi";
import {NavDropdown} from "react-bootstrap";
import {HiOutlineUserCircle} from "react-icons/hi";
import Sidebar from "./Sidebar/Sidebar";
import "./dashboard.css";
import {useUser} from "../../contexts/UsuarioContext";
import {getEmployeePanelLabel} from "../../utils/employeePanel";
import {ChangePasswordPopup} from "../Home/ChangePasswordPopup";
import {getImageUrl} from "../../utils/image";

const DashboardLayout = () => {
    const [open, setOpen] = useState(false);
    const {user, logout} = useUser();
    const isEmployee = user?.role === "EMPLEADO";
    const panelTitle = isEmployee
        ? getEmployeePanelLabel(user?.subRole)
        : "Panel de Administración";

    const profilePhotoUrl = user?.fotoPerfil ? getImageUrl(user.fotoPerfil) : "";

    return (
        <div className="d-flex layout-dashboard">
            <ChangePasswordPopup/>
            <button className="menu-toggle" onClick={() => setOpen(true)}>
                <FaRegArrowAltCircleRight/>
            </button>

            {open && <div className="overlay" onClick={() => setOpen(false)}></div>}

            <Sidebar open={open} close={() => setOpen(false)}/>
            <div className="dashboard-content">
                <header className="dashboard-topbar">
                    <div className="topbar-title">
            <span className="topbar-icon">
              <FiGrid/>
            </span>
                        {panelTitle}
                    </div>
                    <div className="d-flex align-items-center gap-3">
                        {!isEmployee && (
                            <a className="topbar-link" href="/">
                                <FiExternalLink/> Ir a la tienda
                            </a>
                        )}
                        <NavDropdown
                            title={
                                <span className="navbar-user-trigger">
                                    <span className="navbar-user-name">{user?.username ?? "Cuenta"}</span>
                                    {profilePhotoUrl ? (
                                        <img
                                            src={profilePhotoUrl}
                                            alt="Foto de perfil"
                                            className="navbar-user-avatar"
                                        />
                                    ) : (
                                        <HiOutlineUserCircle className="navbar-user-avatar navbar-user-avatar--fallback"/>
                                    )}
                                </span>
                            }
                            id="dashboard-user-dropdown"
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
                            <NavDropdown.Divider/>
                            <NavDropdown.Item onClick={logout}>
                                Cerrar sesión
                            </NavDropdown.Item>
                        </NavDropdown>
                    </div>
                </header>
                <main className="flex-grow-1 p-4 main-dashboard">
                    <Outlet/>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
