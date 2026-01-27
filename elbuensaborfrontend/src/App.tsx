import {useState} from "react";
import {BrowserRouter, Routes, Route, Outlet, useLocation} from "react-router-dom";
import Navbar from "./Components/Navbar/Navbar";
import Home from "./Components/Home/Home";
import Register from "./Components/Auth/Register";
import Login from "./Components/Auth/Login";
import PrivateRoute from "./Components/PrivateRoute";
import Account from "./Components/Account/Account";
import DashboardRoutes from "./Components/Dashboard/DashboardRoutes";
import Catalog from "./Components/Home/Catalog/Catalog";
import ProductDetails from "./Components/Home/Catalog/ProductDetails/ProductDetails";
import ConfirmOrder from "./Components/Home/Cart/ConfirmOrder/ConfirmOrder";
import OrderDetails from "./Components/Home/OrderDetails/OrderDetails";

function MainLayout() {
    const [isCartOpen, setIsCartOpen] = useState(false);
    const location = useLocation();
    const isDashboardRoute = location.pathname.startsWith("/dashboard");

    return (
        <>
            {!isDashboardRoute && (
                <>
                    <Navbar
                        isCartOpen={isCartOpen}
                        onCartOpen={() => setIsCartOpen(true)}
                    />
                    <CartSidebar
                        variant="drawer"
                        isOpen={isCartOpen}
                        onClose={() => setIsCartOpen(false)}
                    />
                </>
            )}
            <Outlet/>
        </>
    );
}

function EmptyLayout() {
    return <Outlet/>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/catalog/product/:id" element={<ProductDetails />} />
          <Route path="/confirm-order" element={<ConfirmOrder />} />
          <Route element={<PrivateRoute roles={["CLIENTE", "EMPLEADO", "ADMIN"]} />}>
            <Route path="/account" element={<Account />} />
          </Route>
          <Route element={<PrivateRoute roles={["EMPLEADO", "ADMIN"]} />}>
            <Route path="/dashboard/*" element={<DashboardRoutes />} />
          </Route>
          <Route path="/pedido/:id" element={<OrderDetails />} />
        </Route>
        <Route element={<EmptyLayout />}>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
