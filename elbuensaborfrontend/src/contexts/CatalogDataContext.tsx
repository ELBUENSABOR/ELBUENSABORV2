import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Manufacturado } from "../models/Manufacturado";
import type { Rubro } from "../models/Rubro";
import { getAll as getAllManufacturados } from "../services/manufacturadosService";

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
  const seen = new Map<number, Rubro>();
  products.forEach((product) => {
    if (product.categoria) {
      seen.set(product.categoria.id, product.categoria);
    }
  });

  return Array.from(seen.values())
    .sort((a, b) => a.denominacion.localeCompare(b.denominacion))
    .map((category) => ({
      id: category.id,
      name: category.denominacion,
    }));
};

export const CatalogDataProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [products, setProducts] = useState<Manufacturado[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadProducts = async () => {
      try {
        setIsLoading(true);
        const data = await getAllManufacturados();
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
  }, []);

  const categories = useMemo(() => buildCategories(products), [products]);

  return (
    <CatalogDataContext.Provider
      value={{ products, categories, isLoading, error }}
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
