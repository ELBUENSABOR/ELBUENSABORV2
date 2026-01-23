import { useState } from "react";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Navbar from "./Components/Navbar/Navbar";
import Home from "./Components/Home/Home";
import Register from "./Components/Auth/Register";
import Login from "./Components/Auth/Login";
import PrivateRoute from "./Components/PrivateRoute";
import Account from "./Components/Account/Account";
import DashboardRoutes from "./Components/Dashboard/DashboardRoutes";
import Catalog from "./Components/Home/Catalog/Catalog";
import ProductDetail from "./Components/Home/ProductDetail/ProductDetail";
import CartSidebar from "./Components/Home/Cart/CartSidebar";

function MainLayout() {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <>
      <Navbar isCartOpen={isCartOpen} onCartOpen={() => setIsCartOpen(true)} />
      <CartSidebar
        variant="drawer"
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />
      <Outlet />
    </>
  );
}

function EmptyLayout() {
  return <Outlet />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/producto/:id" element={<ProductDetail />} />
          <Route element={<PrivateRoute roles={["CLIENTE", "EMPLEADO", "ADMIN"]} />}>
            <Route path="/account" element={<Account />} />
          </Route>
          <Route element={<PrivateRoute roles={["EMPLEADO", "ADMIN"]} />}>
            <Route path="/dashboard/*" element={<DashboardRoutes />} />
          </Route>
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
