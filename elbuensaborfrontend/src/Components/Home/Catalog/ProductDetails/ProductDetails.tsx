import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getManufacturadoById } from "../../../../services/manufacturadosService";
import type { Manufacturado } from "../../../../models/Manufacturado";
import { useSucursal } from "../../../../contexts/SucursalContext";
import CartSidebar from "../../Cart/CartSidebar";
import "./productDetails.css";
import { useCart } from "../../../../contexts/CartContext";

const BACKEND_URL = "http://localhost:8080";

const ProductDetails = () => {
    const { id } = useParams();
    const [producto, setProducto] = useState<Manufacturado | null>(null);
    const [loading, setLoading] = useState(true);
    const { sucursalId } = useSucursal();
    const { addItem } = useCart();

    useEffect(() => {
        const fetch = async () => {
            try {
                const data = await getManufacturadoById(id!, sucursalId ?? 0);
                console.log(data);
                setProducto(data);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, [id]);

    if (loading) return <p>Cargando...</p>;
    if (!producto) return <p>Producto no encontrado</p>;

    return (
        <div className="container-product-detail">
            <div className="product-detail container mt-4">
                <Link to="/catalog" className="btn btn-outline-secondary mb-3">Volver al catalogo</Link>
                <div className="row">
                    <div className="col-md-6">
                        <img
                            src={`${BACKEND_URL}${producto.imagenes[0]}`}
                            alt={producto.denominacion}
                            className="img-fluid rounded"
                        />
                    </div>
                    <div className="col-md-6">
                        <h2>{producto.denominacion}</h2>
                        <p className="text-muted">{producto.categoria}</p>

                        <h4 className="text-success">${producto.precioVenta}</h4>

                        {!producto.disponible && (
                            <span className="badge bg-danger mb-2">
                                No disponible por el momento
                            </span>
                        )}

                        <p className="mt-3">{producto.descripcion}</p>

                        <p>
                            ⏱ Tiempo estimado: {producto.tiempoEstimado} min
                        </p>

                        <button
                            className="btn btn-primary w-100 mt-3"
                            disabled={!producto.disponible}
                            onClick={() => addItem({
                                manufacturadoId: producto.id,
                                denominacion: producto.denominacion,
                                precio: producto.precioVenta,
                                cantidad: 1,
                            })}
                        >
                            + Agregar al carrito
                        </button>
                    </div>
                </div>
                <hr />
                <h5>Ingredientes</h5>
                <ul>
                    {producto.ingredientes.map((ing) => (
                        <li key={ing.insumoId}>
                            {ing.insumoDenominacion} – {ing.cantidad} {ing.unidadMedida}
                        </li>
                    ))}
                </ul>
            </div>
            <CartSidebar />
        </div>
    );
};

export default ProductDetails;