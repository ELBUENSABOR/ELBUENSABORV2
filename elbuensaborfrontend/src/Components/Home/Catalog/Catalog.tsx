import "./catalog.css";
import {Link} from "react-router-dom";
import {useCatalogData} from "../../../contexts/CatalogDataContext";
import {useCatalogFilters} from "../../../contexts/CatalogFiltersContext";
import {useCart} from "../../../contexts/CartContext";
import type {Manufacturado} from "../../../models/Manufacturado";

const formatCurrency = (value: number) =>
    new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
        maximumFractionDigits: 0,
    }).format(value);

const buildGroups = (products: Manufacturado[]) => {
    const grouped = new Map<string, { label: string; items: Manufacturado[] }>();
    products.forEach((product) => {
        const key = product.categoria
            ? `categoria-${product.categoria.id}`
            : "sin-categoria";
        const label = product.categoria?.denominacion ?? "Sin categoría";
        const existing = grouped.get(key);
        if (existing) {
            existing.items.push(product);
        } else {
            grouped.set(key, {label, items: [product]});
        }
    });
    return Array.from(grouped.entries());
};

const Catalog = () => {
    const {products, isLoading, error, categories} = useCatalogData();
    const {searchTerm, selectedCategoryId, setSelectedCategoryId} =
        useCatalogFilters();
    const {addItem} = useCart();

    const normalizedSearch = searchTerm.trim().toLowerCase();
    const filteredProducts = products.filter((product) => {
        const matchesSearch = normalizedSearch
            ? product.denominacion.toLowerCase().includes(normalizedSearch)
            : true;
        const matchesCategory = selectedCategoryId
            ? product.categoria?.id === selectedCategoryId
            : true;
        return matchesSearch && matchesCategory;
    });

    const groupedProducts = buildGroups(filteredProducts);

    return (
        <div className="app-shell">
            <div className="catalog-container">
                <section className="catalog-hero">
                    <div>
                        <h4>
                            ¡Bienvenido a <span>El Buen Sabor</span>!
                        </h4>
                        <p>Los mejores platos, directo a tu mesa 🍽️</p>
                    </div>
                </section>

                <section className="catalog-categories">
                    <button

                        type="button"
                        className={`catalog-pill${
                            selectedCategoryId === null ? " is-active" : ""
                        }`}
                        onClick={() => setSelectedCategoryId(null)}
                    >
                        Todos
                    </button>
                    {categories.map((category) => (
                        <button
                            key={category.id}
                            type="button"
                            className={`catalog-pill${
                                selectedCategoryId === category.id ? " is-active" : ""
                            }`}
                            onClick={() => setSelectedCategoryId(category.id)}
                        >
                            {category.name}
                        </button>
                    ))}
                </section>

                {isLoading && <p>Cargando productos...</p>}
                {error && <p className="catalog-error">{error}</p>}

                {!isLoading && !error && groupedProducts.length === 0 && (
                    <div className="catalog-empty">
                        <h6>No encontramos resultados.</h6>
                        <p>Probá con otro nombre o seleccioná otra categoría.</p>
                    </div>
                )}

                {!isLoading &&
                    !error &&
                    groupedProducts.map(([key, group]) => (
                        <section className="catalog-category" key={key} id={key}>
                            <div className="catalog-category__header">
                                <h5>{group.label}</h5>
                            </div>
                            <div className="catalog-grid">
                                {group.items.map((product) => {
                                    const isAvailable = product.activo;
                                    return (
                                        <article
                                            key={product.id}
                                            className={`product-card${
                                                !isAvailable ? " product-card--disabled" : ""
                                            }`}
                                        >
                                            <div className="product-card__image">
                                                {product.imagenes?.[0]?.url ? (
                                                    <img
                                                        src={product.imagenes[0].url}
                                                        alt={product.denominacion}
                                                    />
                                                ) : (
                                                    <div className="product-card__placeholder">
                                                        Sin imagen
                                                    </div>
                                                )}
                                                {!isAvailable && (
                                                    <span className="product-card__overlay">
                            No disponible
                          </span>
                                                )}
                                            </div>
                                            <div className="product-card__body">
                                                <div>
                                                    <h6>{product.denominacion}</h6>
                                                    <span className="product-card__price">
                            {formatCurrency(product.precioVenta)}
                          </span>
                                                </div>
                                                {!isAvailable && (
                                                    <p className="product-card__note">
                                                        No disponible por el momento
                                                    </p>
                                                )}
                                            </div>
                                            <div className="product-card__actions">
                                                <Link
                                                    to={`/producto/${product.id}`}
                                                    className="btn btn-sm btn-outline-primary"
                                                >
                                                    Ver detalle
                                                </Link>
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-primary"
                                                    disabled={!isAvailable}
                                                    onClick={() => addItem(product)}
                                                >
                                                    Agregar al carrito
                                                </button>
                                            </div>

                                        </article>
                                    );
                                })}
                            </div>
                        </section>
                    ))}
            </div>

        </div>
    );
};

export default Catalog;
