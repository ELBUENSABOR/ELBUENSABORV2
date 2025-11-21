import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Navbar from "./Components/Navbar/Navbar";
import Home from "./Components/Home/Home";
import Register from "./Components/Auth/Register";
import Login from "./Components/Auth/Login";
import PrivateRoute from "./Components/PrivateRoute";
import Account from "./Components/Account/Account";

function MainLayout() {
  return (
    <>
      <Navbar />
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
          <Route element={<PrivateRoute roles={["CLIENTE", "EMPLEADO", "ADMIN"]} />}>
            <Route path="/account" element={<Account />} />
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
