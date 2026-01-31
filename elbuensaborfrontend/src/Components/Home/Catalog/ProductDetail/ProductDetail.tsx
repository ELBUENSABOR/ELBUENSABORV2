import "./productDetail.css";
import {Link, useParams} from "react-router-dom";
import {useCatalogData} from "../../../../contexts/CatalogDataContext.tsx";
import {useCart} from "../../../../contexts/CartContext.tsx";
import {getImageUrl} from "../../../../utils/image";

const formatCurrency = (value: number) =>
    new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
        maximumFractionDigits: 0,
    }).format(value);

const ProductDetail = () => {
    const {id} = useParams();
    const {products, isLoading, error} = useCatalogData();
    const {addItem} = useCart();

    const productId = Number(id);
    const product = products.find((item) => item.id === productId);

    if (isLoading) {
        return (
            <div className="product-detail">
                <p>Cargando detalle...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="product-detail">
                <p className="product-detail__error">{error}</p>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="product-detail">
                <p>Producto no encontrado.</p>
                <Link to="/">Volver al catálogo</Link>
            </div>
        );
    }

    const isAvailable = product.activo && (product.disponible ?? true);

    return (
        <div className="product-detail">
            <Link to="/" className="product-detail__back">
                ← Volver al catálogo
            </Link>
            <div className="product-detail__content">
                <div className="product-detail__image">
                    {product.imagenes?.[0] ? (
                        <img src={getImageUrl(product.imagenes[0])} alt={product.denominacion}/>
                    ) : (
                        <div className="product-detail__placeholder">Sin imagen</div>
                    )}
                </div>
                <div className="product-detail__info">
                    <h3>{product.denominacion}</h3>
                    <p className="product-detail__category">
                        {product.categoria ?? "Sin categoría"}
                    </p>
                    <p className="product-detail__price">
                        {formatCurrency(product.precioVenta)}
                    </p>
                    {!isAvailable && (
                        <span className="product-detail__badge">
              No disponible por el momento
            </span>
                    )}
                    <div className="product-detail__actions">
                        <button
                            type="button"
                            className="btn btn-primary"
                            disabled={!isAvailable}
                            onClick={() =>
                                addItem({
                                    manufacturadoId: product.id,
                                    denominacion: product.denominacion,
                                    precio: product.precioVenta,
                                    cantidad: 1,
                                })
                            }
                        >
                            Agregar al carrito
                        </button>
                    </div>
                    <div className="product-detail__extra">
                        <p>
                            Tiempo estimado: {product.tiempoEstimado} min · Precio costo: {" "}
                            {formatCurrency(product.precioCosto)}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
