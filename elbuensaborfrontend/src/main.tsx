import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { UserProvider } from "./contexts/UsuarioContext.tsx";
import { SucursalProvider } from "./contexts/SucursalContext.tsx";

createRoot(document.getElementById("root")!).render(
  <UserProvider>
    <SucursalProvider>
      <App />
    </SucursalProvider>
  </UserProvider>
);
