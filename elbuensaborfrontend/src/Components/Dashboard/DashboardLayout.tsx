import {Outlet} from "react-router-dom";
import {useState} from "react";
import {FaRegArrowAltCircleRight} from "react-icons/fa";
import {FiExternalLink, FiGrid} from "react-icons/fi";
import Sidebar from "./Sidebar/Sidebar";
import "./dashboard.css";


const DashboardLayout = () => {
    const [open, setOpen] = useState(false);

    return (
        <div className="d-flex layout-dashboard">
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
                        Panel de Administración
                    </div>
                    <a className="topbar-link" href="/">
                        <FiExternalLink/> Ir a la tienda
                    </a>
                </header>
                <main className="flex-grow-1 p-4 main-dashboard">
                    <Outlet/>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
