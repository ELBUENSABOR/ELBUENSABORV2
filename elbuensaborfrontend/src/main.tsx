import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { UserProvider } from "./contexts/UsuarioContext.tsx";
import { SucursalProvider } from "./contexts/SucursalContext.tsx";
import { CatalogDataProvider } from "./contexts/CatalogDataContext.tsx";
import { CatalogFiltersProvider } from "./contexts/CatalogFiltersContext.tsx";
import { CartProvider } from "./contexts/CartContext.tsx";

createRoot(document.getElementById("root")!).render(
  <UserProvider>
    <SucursalProvider>
      <CatalogDataProvider>
        <CatalogFiltersProvider>
          <CartProvider>
            <App />
          </CartProvider>
        </CatalogFiltersProvider>
      </CatalogDataProvider>
    </SucursalProvider>
  </UserProvider>
);
