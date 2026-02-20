import {createContext, useContext, useEffect, useMemo, useState} from "react";
import type {Manufacturado} from "../models/Manufacturado";
import {getAll as getAllManufacturados} from "../services/manufacturadosService";
import {useSucursal} from "./SucursalContext";

interface CatalogCategory {
    id: number;
    name: string;
}

interface CatalogDataContextValue {
    products: Manufacturado[];
    categories: CatalogCategory[];
    isLoading: boolean;
    error: string | null;
}

const CatalogDataContext = createContext<CatalogDataContextValue | undefined>(
    undefined
);

const buildCategories = (products: Manufacturado[]): CatalogCategory[] => {
    const seen = new Map<number, string>();
    products
        .filter((product) => product.activo)
        .forEach((product) => {
            if (product.categoriaId && product.categoria) {
                seen.set(product.categoriaId, product.categoria);
            }
        });

    return Array.from(seen.entries())
        .sort(([, nameA], [, nameB]) => nameA.localeCompare(nameB))
        .map(([id, name]) => ({
            id,
            name,
        }));
};

export const CatalogDataProvider = ({
                                        children,
                                    }: {
    children: React.ReactNode;
}) => {
    const {sucursalId} = useSucursal();
    const [products, setProducts] = useState<Manufacturado[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        const loadProducts = async () => {
            try {
                setIsLoading(true);
                if (!sucursalId) {
                    setProducts([]);
                    setError(null);
                    return;
                }
                const data = await getAllManufacturados(sucursalId);
                if (isMounted) {
                    setProducts(Array.isArray(data) ? data : []);
                    setError(null);
                }
            } catch (fetchError) {
                if (isMounted) {
                    setError("No pudimos cargar el catálogo. Intentá nuevamente.");
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        loadProducts();

        return () => {
            isMounted = false;
        };
    }, [sucursalId]);

    const categories = useMemo(() => buildCategories(products), [products]);

    return (
        <CatalogDataContext.Provider
            value={{products, categories, isLoading, error}}
        >
            {children}
        </CatalogDataContext.Provider>
    );
};

export const useCatalogData = () => {
    const context = useContext(CatalogDataContext);
    if (!context) {
        throw new Error("useCatalogData debe usarse dentro de CatalogDataProvider");
    }
    return context;
};
