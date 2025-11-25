import { Route, Routes } from "react-router-dom";
import DashboardLayout from "./DashboardLayout";
import DashboardHome from "./DashboardHome";
import RubrosInsumos from "./Rubros/RubrosInsumos";
import RubrosManufacturados from "./Rubros/RubrosManufacturados";
import ProductosInsumos from "./Productos/ProductosInsumos";
import ProductosManufacturados from "./Productos/ProductosManufacturados";
import StockAlert from "./Stock/StockAlert";
import RegistroCompra from "./Compras/RegistroCompra";
import ProductosVenta from "./ProductosVenta/ProductosVenta";

const DashboardRoutes = () => (
  <Routes>
    <Route element={<DashboardLayout />}>
      <Route index element={<DashboardHome />} />
      <Route path="home" element={<DashboardHome />} />
      <Route path="rubros-insumos" element={<RubrosInsumos />} />
      <Route path="rubros-productos" element={<RubrosManufacturados />} />
      <Route path="productos-insumos" element={<ProductosInsumos />} />
      <Route
        path="productos-manufacturados"
        element={<ProductosManufacturados />}
      />
      <Route path="stock" element={<StockAlert />} />
      <Route path="compras" element={<RegistroCompra />} />
      <Route path="productos-venta" element={<ProductosVenta />} />
    </Route>
  </Routes>
);

export default DashboardRoutes;
