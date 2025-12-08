import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar/Sidebar";
import "./dashboard.css";
import { FaRegArrowAltCircleRight } from "react-icons/fa";
import { useState } from "react";

const DashboardLayout = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="d-flex layout-dashboard">
      <button className="menu-toggle" onClick={() => setOpen(true)}>
        <FaRegArrowAltCircleRight />
      </button>

      {open && <div className="overlay" onClick={() => setOpen(false)}></div>}

      <Sidebar open={open} close={() => setOpen(false)} />
      <main className="flex-grow-1 p-4 main-dashboard">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
