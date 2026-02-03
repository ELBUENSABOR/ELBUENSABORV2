import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "../contexts/UsuarioContext";

const EMPLOYEE_ROLES = ["CAJERO", "DELIVERY", "COCINERO", "ADMINISTRADOR"];

const PrivateRoute = ({ roles }: { roles: string[] }) => {
  const { user } = useUser();

  if (!user) return <Navigate to="/login" />;

  const hasPermission = roles.some((role) => {
    if (user.role === role) return true;
    if (user.role === "EMPLEADO" && user.subRole && role === user.subRole) return true;
    if (role === "EMPLEADO" && user.subRole && EMPLOYEE_ROLES.includes(user.subRole)) return true;
    return false;
  });

  if (!hasPermission) return <Navigate to="/" />;

  return <Outlet />;
};

export default PrivateRoute;
