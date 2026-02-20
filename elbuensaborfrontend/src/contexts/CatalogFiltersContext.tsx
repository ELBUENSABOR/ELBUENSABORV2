import {createContext, useContext, useState} from "react";

interface CatalogFiltersContextValue {
    searchTerm: string;
    setSearchTerm: (value: string) => void;
    selectedCategoryId: number | null;
    setSelectedCategoryId: (value: number | null) => void;
}

const CatalogFiltersContext = createContext<CatalogFiltersContextValue | undefined>(
    undefined
);

export const CatalogFiltersProvider = ({
                                           children,
                                       }: {
    children: React.ReactNode;
}) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
        null
    );

    return (
        <CatalogFiltersContext.Provider
            value={{
                searchTerm,
                setSearchTerm,
                selectedCategoryId,
                setSelectedCategoryId,
            }}
        >
            {children}
        </CatalogFiltersContext.Provider>
    );
};

export const useCatalogFilters = () => {
    const context = useContext(CatalogFiltersContext);
    if (!context) {
        throw new Error(
            "useCatalogFilters debe usarse dentro de CatalogFiltersProvider"
        );
    }
    return context;
};
