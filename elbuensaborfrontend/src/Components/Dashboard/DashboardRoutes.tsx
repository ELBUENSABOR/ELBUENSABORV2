import {Navigate, Route, Routes} from "react-router-dom";
import DashboardLayout from "./DashboardLayout";
import DashboardHome from "./DashboardHome";
import RubrosInsumos from "./Rubros/RubrosInsumos";
import RubrosManufacturados from "./Rubros/RubrosManufacturados";
import ProductosInsumos from "./Productos/ProductosInsumos";
import ProductosManufacturados from "./Productos/ProductosManufacturados";
import StockAlert from "./Stock/StockAlert";
import RegistroCompra from "./Compras/RegistroCompra";
import ProductosVenta from "./ProductosVenta/ProductosVenta";
import Users from "./Users/Users";
import Sucursales from "./Sucursales/Sucursales";
import PrivateRoute from "../PrivateRoute";
import {AddUser} from "./Users/AddUser";
import {EditUser} from "./Users/EditUser";
import AddSucursal from "./Sucursales/AddSucursal";
import AddRubro from "./Rubros/AddRubroInsumo";
import AddRubroManufacturado from "./Rubros/AddRubroManufacturado";
import ManufacturadoForm from "./Productos/ManufacturadoForm";
import InsumoForm from "./Productos/InsumoForm";
import ComprasTable from "./Compras/ComprasTable";
import PedidosAdmin from "./Pedidos/PedidosAdmin";
import PedidosCocina from "./Pedidos/PedidosCocina";
import PedidosDelivery from "./Pedidos/PedidosDelivery";
import {useUser} from "../../contexts/UsuarioContext";
import {getEmployeeDashboardRoute} from "../../utils/employeePanel";

const DashboardIndex = () => {
    const {user} = useUser();

    if (user?.role === "EMPLEADO") {
        return <Navigate to={getEmployeeDashboardRoute(user.role, user.subRole)} replace/>;
    }

    return <DashboardHome/>;
};

const DashboardRoutes = () => (
    <Routes>
        <Route element={<DashboardLayout/>}>
            <Route index element={<DashboardIndex/>}/>
            <Route path="home" element={<DashboardIndex/>}/>
            <Route element={<PrivateRoute roles={["ADMIN"]}/>}>
                <Route path="usuarios" element={<Users/>}/>
                <Route path="usuarios/add" element={<AddUser/>}/>
                <Route path="usuarios/edit/:id" element={<EditUser/>}/>
                <Route path="sucursales" element={<Sucursales/>}/>
                <Route path="sucursales/add/:id" element={<AddSucursal/>}/>
                <Route path="sucursales/add" element={<AddSucursal/>}/>
                <Route path="insumos/rubros/add" element={<AddRubro/>}/>
                <Route path="insumos/rubros/:parentId/add" element={<AddRubro/>}/>
                <Route path="insumos/rubros/edit/:id" element={<AddRubro/>}/>
                <Route
                    path="manufacturados/rubros/add"
                    element={<AddRubroManufacturado/>}
                />
                <Route
                    path="manufacturados/rubros/:parentId/add"
                    element={<AddRubroManufacturado/>}
                />
                <Route
                    path="manufacturados/rubros/edit/:id"
                    element={<AddRubroManufacturado/>}
                />
                <Route path="rubros-insumos" element={<RubrosInsumos/>}/>
                <Route path="rubros-productos" element={<RubrosManufacturados/>}/>
            </Route>
            <Route element={<PrivateRoute roles={["ADMIN", "EMPLEADO"]}/>}>
                <Route
                    path="productos-manufacturados"
                    element={<ProductosManufacturados/>}
                />
                <Route
                    path="manufacturados/add"
                    element={<ManufacturadoForm/>}
                />
                <Route
                    path="manufacturados/edit/:id"
                    element={<ManufacturadoForm/>}
                />
                <Route path="productos-insumos" element={<ProductosInsumos/>}/>
                <Route
                    path="insumos/add"
                    element={<InsumoForm/>}
                />
                <Route
                    path="insumos/edit/:id"
                    element={<InsumoForm/>}
                />
            </Route>
            <Route path="stock" element={<StockAlert/>}/>
            <Route path="compras" element={<RegistroCompra/>}/>
            <Route path="compras/list" element={<ComprasTable/>}/>
            <Route path="productos-venta" element={<ProductosVenta/>}/>
            <Route element={<PrivateRoute roles={["ADMIN", "EMPLEADO"]}/>}>
                <Route path="pedidos" element={<PedidosAdmin/>}/>
            </Route>
            <Route element={<PrivateRoute roles={["COCINERO", "ADMIN"]} />}>
                <Route path="cocina" element={<PedidosCocina />} />
            </Route>
            <Route element={<PrivateRoute roles={["DELIVERY", "ADMIN"]} />}>
                <Route path="delivery" element={<PedidosDelivery />} />
            </Route>
        </Route>
    </Routes>
);

export default DashboardRoutes;
