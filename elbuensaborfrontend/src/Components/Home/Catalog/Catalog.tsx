import "./catalog.css";
import { useEffect, useState, type ChangeEvent } from "react";
import { getAll } from "../../../services/manufacturadosService";
import type { Manufacturado } from "../../../models/Manufacturado";
import { getRubrosManufacturados } from "../../../services/rubrosService";
import type { Rubro } from "../../../models/Rubro";
import CategoryNode from "./CategoryNode";
import { Link } from "react-router-dom";
import { useSucursal } from "../../../contexts/SucursalContext";
import { useCart } from "../../../contexts/CartContext";
import CartSidebar from "../Cart/CartSidebar";

const BACKEND_URL = "http://localhost:8080";
const Catalog = () => {
  const [productos, setProductos] = useState<Manufacturado[]>([]);
  const [rubros, setRubros] = useState<Rubro[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState<Manufacturado[]>([]);
  const [categorySelected, setCategorySelected] = useState("Todas las categorias");
  const [search, setSearch] = useState("");
  const [categorySelectedId, setCategorySelectedId] = useState<number | null>(null); // null = todas
  const [categoryTree, setCategoryTree] = useState<Rubro[]>([]);
  const [rubroById, setRubroById] = useState<Map<number, Rubro>>(new Map());
  const { sucursales, sucursalId, setSucursalId, loading } = useSucursal();
  const { addItem } = useCart();

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await getAll(sucursalId ?? 0);
        const filtered = response.filter((producto: { activo: boolean; }) => producto.activo === true);
        const rubros = await getRubrosManufacturados();
        console.log(rubros.data);
        setRubros(rubros.data);
        const { roots, byId } = buildTreeAndIndex(rubros.data);
        setCategoryTree(roots);
        setRubroById(byId);
        setProductos(filtered);
        console.log(response);
        setFilteredProducts(filtered);
        setIsLoading(false);
      } catch (error) {
        setError(error);
        setIsLoading(false);
      }
    };
    fetchProductos();
  }, [sucursalId]);

  useEffect(() => {
    let filtered = productos;

    if (categorySelectedId != null) {
      const node = rubroById.get(categorySelectedId);
      const allowedIds = node ? new Set(collectIds(node)) : new Set<number>();
      filtered = filtered.filter(p => allowedIds.has(p.categoriaId));
    }

    if (search.trim() !== "") {
      const q = search.toLowerCase();
      filtered = filtered.filter(p => p.denominacion.toLowerCase().includes(q));
    }

    setFilteredProducts(filtered);
  }, [search, categorySelectedId, productos, rubroById]);

  const buildTreeAndIndex = (rubros: Rubro[]) => {
    const byId = new Map<number, Rubro>();
    const roots: Rubro[] = [];

    rubros.forEach(r => byId.set(r.id, { ...r, children: [] }));
    rubros.forEach(r => {
      const node = byId.get(r.id)!;
      if (r.categoriaPadreId == null) roots.push(node);
      else byId.get(r.categoriaPadreId)?.children.push(node);
    });

    return { roots, byId };
  };

  const collectIds = (node: Rubro): number[] => {
    const ids = [node.id];
    node.children?.forEach(ch => ids.push(...collectIds(ch)));
    return ids;
  };

  const filterBySearch = (search: string) => {
    setSearch(search);
  };

  const handleSucursalChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSucursalId(value ? Number(value) : null);
  };

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>Error al cargar los productos</div>;
  }

  return <div className="catalog-container">
    <h4>Catalogo de productos</h4>
    <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
      <div>
        <p className="text-muted mb-0">
          Elige una sucursal para ver los productos disponibles.
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
    <hr />
    <div className="catalog-content">
      <div className="catalog-content-items">
        <div className="nav-categorias">
          <div>
            <input type="text" placeholder="Buscar productos..." className="form-control mb-3" onChange={(e) => filterBySearch(e.target.value)} value={search} />
          </div>
          <h5>Categorias</h5>
          <hr />
          <ul className="category-tree">
            <li
              className={categorySelectedId === null ? "category-nav active" : "category-nav"}
              onClick={() => setCategorySelectedId(null)}
            >
              Todas las categorias
            </li>
            {categoryTree.map(node => (
              <CategoryNode
                key={node.id}
                node={node}
                selectedId={categorySelectedId}
                onSelect={setCategorySelectedId}
              />
            ))}
          </ul>
        </div>
        <div className="catalog-items">
          {
            filteredProducts.length === 0 ? (
              <p>No se encontraron productos</p>
            ) : (
              filteredProducts.map((producto) => (
                <div key={producto.id} className="catalog-item">
                  <h5>{producto.denominacion}</h5>
                  <img src={`${BACKEND_URL}${producto.imagenes[0]}`} alt={producto.denominacion} />
                  <hr />
                  <p>${producto.precioVenta}</p>
                  {!producto.disponible && (
                    <span className="badge bg-danger mb-2">
                      No disponible por el momento
                    </span>
                  )}
                  <Link to={`/catalog/product/${producto.id}`} className="mb-3">
                    Ver detalle
                  </Link>
                  <button className="btn btn-primary" disabled={!producto.disponible} onClick={() =>
                    addItem({
                      manufacturadoId: producto.id,
                      denominacion: producto.denominacion,
                      precio: producto.precioVenta,
                      cantidad: 1,
                    })
                  }>+ Agregar al carrito</button>
                </div>
              )))}
        </div>
        <CartSidebar />
      </div>
    </div>
  </div>;
};

export default Catalog;
