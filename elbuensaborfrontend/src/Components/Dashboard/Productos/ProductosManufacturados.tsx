import React, { useEffect, useState, type ChangeEvent } from "react";
import { useSucursal } from "../../../contexts/SucursalContext";
import { useUser } from "../../../contexts/UsuarioContext";
import { getAll } from "../../../services/manufacturadosService";
import type { Manufacturado } from "../../../models/Manufacturado";
import { useNavigate } from "react-router-dom";

const ProductosManufacturados = () => {
  const { sucursales, sucursalId, setSucursalId, loading } = useSucursal();
  const { user } = useUser();
  const [manufacturados, setManufacturados] = useState<Manufacturado[]>();
  const [originalManufacturados, setOriginalManufacturados] =
    useState<Manufacturado[]>();
  const [filterStatus, setFilterStatus] = useState("activo");

  const [filterValue, setFilterValue] = useState("");

  const navigate = useNavigate();

  const handleSucursalChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSucursalId(value ? Number(value) : null);
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await getAll();
        console.log(response);
        if (response) {
          setManufacturados(response);
          setOriginalManufacturados(response);
        }
      } catch (error) {
        console.error("Error al obtener manufacturados");
      }
    };

    getData();
  }, []);

  const filterData = (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>
  ) => {
    const text = e.target.value.toLowerCase();
    if (e.target.name === "status") {
      setFilterStatus(text);
    } else {
      setFilterValue(text);
    }

    if (text.trim() === "") {
      setManufacturados(originalManufacturados);
      return;
    }

    if (originalManufacturados) {
      const filtered = originalManufacturados.filter(
        (u) =>
          u.denominacion.toLowerCase().includes(text) ||
          u.categoria.denominacion.toLowerCase().includes(text)
      );

      setManufacturados(filtered);
    }
  };

  return (
    <div>
      <div>
        <h5>Manufacturados</h5>
        <hr />
        <div>
          {user?.role === "ADMIN" && (
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
              <div>
                <p className="text-muted mb-0">
                  Gestioná productos y stock según la sucursal seleccionada.
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
                {loading && (
                  <span className="text-muted small">cargando...</span>
                )}
              </div>
            </div>
          )}
        </div>
        <div className="header-dashboard">
          <input
            name="search"
            type="text"
            placeholder="Buscar manufacturados..."
            className="form-control"
            value={filterValue}
            onChange={filterData}
          />

          <select
            name="status"
            className="form-select"
            value={filterStatus}
            onChange={(e) => filterData(e)}
          >
            <option value="">Todos</option>
            <option value="activo">Activos</option>
            <option value="no-activo">No activos</option>
          </select>

          <button
            className="btn btn-success"
            onClick={() => navigate("/dashboard/manufacturados/add")}
          >
            + Nuevo Rubro
          </button>
        </div>
        <table className="table table-hover">
          <thead>
            <th>#</th>
            <th>Denominación</th>
            <th>Precio de costo</th>
            <th>Precio de venta</th>
            <th>Categoría</th>
            <th>Acciones</th>
          </thead>
          <tbody className="table-group-divider">
            {manufacturados?.map((m, index) => (
              <tr key={index}>
                <td>{m.id}</td>
                <td>{m.denominacion}</td>
                <td>{m.precioCosto}</td>
                <td>{m.precioVenta}</td>
                <td>{m.categoria.denominacion}</td>
                <td>
                  <button className="btn btn-primary">Editar</button>
                  <button className="btn btn-danger">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductosManufacturados;
