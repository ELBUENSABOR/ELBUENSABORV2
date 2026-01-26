import { useEffect, useState } from "react";
import type { InsumoRequest } from "../../../models/Insumo";
import type { Sucursal } from "../../../models/Sucursal";
import type { Rubro } from "../../../models/Rubro";
import type { Imagen } from "../../../models/Imagen";
import type { UnidadMedida } from "../../../models/UnidadMedida";
import { fetchSucursales } from "../../../services/dashboardService";
import { getRubrosInsumos } from "../../../services/rubrosService";
import { createInsumo, getAllUnidadesMedida, getInsumoById, updateInsumo } from "../../../services/insumosService";
import { useSucursal } from "../../../contexts/SucursalContext";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const initialState: InsumoRequest = {
  id: 0,
  denominacion: "",
  precioCompra: 0,
  precioVenta: 0,
  stockSucursal: [],
  esParaElaborar: false,
  categoriaId: 0,
  unidadMedidaId: 0,
  tiempoEstimado: 0,
  activo: true,
  imagenes: [],
};

const InsumoForm = () => {
  const { sucursalId, sucursales: sucursalesContext } = useSucursal();
  const [form, setForm] = useState<InsumoRequest>(initialState);
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [categorias, setCategorias] = useState<Rubro[]>([]);
  const [unidadesMedida, setUnidadesMedida] = useState<UnidadMedida[]>([]);
  const [imagenesActuales, setImagenesActuales] = useState<Imagen[]>([]);
  const [imagenesNuevas, setImagenesNuevas] = useState<File[]>([]);
  const [sucursalSeleccionada, setSucursalSeleccionada] = useState<Sucursal>();
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();

  const isEdit = Boolean(id);

  useEffect(() => {
    const load = async () => {
      const s = await fetchSucursales();
      setSucursales(s);
      const sucursalSeleccionada = s.find((sx) => sx.id === sucursalId);
      setSucursalSeleccionada(sucursalSeleccionada);

      if (isEdit) {
        const insumo = await getInsumoById(id ?? "");

        setForm((f) => ({
          ...f,
          ...insumo,
          stockSucursal: insumo.stockSucursal || [],
          categoriaId: insumo.categoria.id,
          unidadMedidaId: insumo.unidadMedida.id,
        }));
      }
    };

    load();
  }, [sucursalId]);

  useEffect(() => {
    const loadData = async () => {
      const resRubros = await getRubrosInsumos();
      setCategorias(resRubros);
      const resUnidades = await getAllUnidadesMedida();
      setUnidadesMedida(resUnidades);
    };
    loadData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        if (!form.categoriaId || form.categoriaId <= 0) {
            alert("Debe seleccionar una categoría válida.");
            return;
        }

        if (!form.unidadMedidaId || form.unidadMedidaId <= 0) {
            alert("Debe seleccionar una unidad de medida válida.");
            return;
        }

        const stockSucursal = form.stockSucursal
            .filter((s) => s.sucursalId && s.sucursalId > 0)
            .map((s) => ({
                sucursalId: s.sucursalId,
                stockActual: s.stockActual,
                stockMinimo: s.stockMinimo,
                stockMaximo: s.stockMaximo,
            }));
      const payload = {
        denominacion: form.denominacion,
        precioVenta: form.precioVenta,
        precioCompra: form.precioCompra,
        categoriaId: form.categoriaId,
        activo: form.activo,
        esParaElaborar: form.esParaElaborar,
        unidadMedidaId: form.unidadMedidaId,
        stockSucursal,
      };

      console.log("Enviando payload:", payload);
      if (isEdit) {
        await updateInsumo(Number(id), payload);
        alert("Insumo actualizado con éxito");
      } else {
        await createInsumo(payload);
        alert("Insumo creado con éxito");
      }
      navigate("/dashboard/productos-insumos");
    } catch (error) {
      console.error(error);
      alert("Error al crear el insumo");
    }
  };

  return (
    <form className="p-4 border rounded" onSubmit={handleSubmit}>
      <h2 className="mb-4">{isEdit ? "Editar" : "Crear"} Insumo</h2>
      <div className="mb-3">
        <label htmlFor="denominacion" className="form-label">
          Denominación
        </label>
        <input
          type="text"
          className="form-control"
          id="denominacion"
          value={form.denominacion}
          onChange={(e) => setForm({ ...form, denominacion: e.target.value })}
          required
        />
      </div>

      <div className="mb-3">
        <label htmlFor="precioCosto" className="form-label">
          Precio Costo
        </label>
        <input
          type="number"
          className="form-control"
          id="precioCosto"
          value={form.precioCompra}
          onChange={(e) =>
            setForm({ ...form, precioCompra: Number(e.target.value) })
          }
          required
        />
      </div>

      <div className="mb-3">
        <label htmlFor="precioVenta" className="form-label">
          Precio Venta
        </label>
        <input
          type="number"
          className="form-control"
          id="precioVenta"
          value={form.precioVenta}
          onChange={(e) =>
            setForm({ ...form, precioVenta: Number(e.target.value) })
          }
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Stock por Sucursal</label>
        {sucursales.map((sucursal) => {
          const stock = form.stockSucursal.find((s) => s.sucursalId === sucursal.id) || {
            sucursalId: sucursal.id,
            id: 0,
            stockActual: 0,
            stockMinimo: 0,
            stockMaximo: 0,
            activo: true,
          };

          const handleStockChange = (field: string, value: number) => {
            setForm((prev) => {
              const newStocks = [...prev.stockSucursal];
              const index = newStocks.findIndex((s) => s.sucursalId === sucursal.id);

              const newStockEntry = {
                ...stock,
                [field]: value,
                sucursalId: sucursal.id ?? 0,
                id: stock.id || 0
              };

              if (index >= 0) {
                newStocks[index] = newStockEntry;
              } else {
                newStocks.push(newStockEntry);
              }

              return { ...prev, stockSucursal: newStocks };
            });
          };

          return (
            <div key={sucursal.id} className="card mb-3 p-3 bg-light">
              <h6 className="mb-2">{sucursal.nombre}</h6>
              <div className="row">
                <div className="col-md-4">
                  <label className="form-label small">Stock Actual</label>
                  <input
                    type="number"
                    className="form-control form-control-sm"
                    value={stock.stockActual}
                    onChange={(e) => handleStockChange("stockActual", Number(e.target.value))}
                    min="0"
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label small">Mínimo</label>
                  <input
                    type="number"
                    className="form-control form-control-sm"
                    value={stock.stockMinimo}
                    onChange={(e) => handleStockChange("stockMinimo", Number(e.target.value))}
                    min="0"
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label small">Máximo</label>
                  <input
                    type="number"
                    className="form-control form-control-sm"
                    value={stock.stockMaximo}
                    onChange={(e) => handleStockChange("stockMaximo", Number(e.target.value))}
                    min="0"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mb-3">
        <label htmlFor="categoria" className="form-label">Categoría</label>
        <select
          id="categoria"
          className="form-select"
          value={form.categoriaId}
          onChange={(e) =>
            setForm({
              ...form,
              categoriaId: Number(e.target.value),
            })
          }
          required
        >
          <option value="">Seleccione</option>
          {categorias.map((c) => (
            <option key={c.id} value={c.id}>
              {c.denominacion}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label htmlFor="unidadMedida" className="form-label">Unidad de Medida</label>
        <select
          id="unidadMedida"
          className="form-select"
          value={form.unidadMedidaId}
          onChange={(e) =>
            setForm({
              ...form,
              unidadMedidaId: Number(e.target.value),
            })
          }
          required
        >
          <option value="">Seleccione</option>
          {unidadesMedida.map((u) => (
            <option key={u.id} value={u.id}>
              {u.denominacion}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label htmlFor="esParaElaborar" className="form-label">
          Para Elaborar
        </label>
        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            id="esParaElaborar"
            checked={form.esParaElaborar}
            onChange={(e) =>
              setForm({ ...form, esParaElaborar: e.target.checked })
            }
          />
          <label className="form-check-label" htmlFor="esParaElaborar">
            Es insumo para elaborar
          </label>
        </div>
      </div>

      <div className="mb-3">
        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            id="activo"
            checked={form.activo}
            onChange={(e) => setForm({ ...form, activo: e.target.checked })}
          />
          <label className="form-check-label" htmlFor="activo">
            Activo
          </label>
        </div>
      </div>

      <div className="mb-3">
        <label htmlFor="imagenes" className="form-label">
          Imágenes
        </label>
        <input
          type="file"
          className="form-control"
          multiple
          onChange={(e) => {
            const files = e.target.files ? Array.from(e.target.files) : [];
            setImagenesNuevas(files);
          }}
        />
      </div>

      <button type="submit" className="btn btn-primary">
        Guardar
      </button>
    </form>
  );
};

export default InsumoForm;
