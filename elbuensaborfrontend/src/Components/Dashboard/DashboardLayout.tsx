import { useState, type ChangeEvent } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar/Sidebar";
import { useSucursal } from "../../contexts/SucursalContext";
import "./dashboard.css";
import { FaRegArrowAltCircleRight } from "react-icons/fa";

const DashboardLayout = () => {
  const { sucursales, sucursalId, setSucursalId, loading } = useSucursal();
  const [open, setOpen] = useState(false);

  const handleSucursalChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSucursalId(value ? Number(value) : null);
  };

  return (
    <div className="d-flex layout-dashboard">
      <button className="menu-toggle" onClick={() => setOpen(true)}>
        <FaRegArrowAltCircleRight />
      </button>

      {/* Overlay */}
      {open && <div className="overlay" onClick={() => setOpen(false)}></div>}

      <Sidebar open={open} close={() => setOpen(false)} />
      <main className="flex-grow-1 p-4 main-dashboard">
        {/*<div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
          <div>
            <h1 className="h4 mb-0">Dashboard</h1>
            <p className="text-muted mb-0">
              Gestioná los rubros, productos y stock según la sucursal
              seleccionada.
            </p>
          </div>
          <div className="d-flex align-items-center gap-2">
            <label className="mb-0 text-muted" htmlFor="sucursal-select">
              Sucursal:
            </label>
            <select
              id="sucursal-select"
              className="form-select form-select-sm w-auto"
              value={sucursalId ?? ""}
              onChange={handleSucursalChange}
              disabled={loading || sucursales.length === 0}
            >
              <option value="">Seleccione</option>
              {sucursales.map((sucursal) => (
                <option key={sucursal.id} value={sucursal.id}>
                  {sucursal.nombre}
                </option>
              ))}
            </select>
            {loading && <span className="text-muted small">cargando...</span>}
          </div>
        </div>*/}
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
