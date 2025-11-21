import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "../contexts/UsuarioContext";

const PrivateRoute = ({ roles }: { roles: string[] }) => {
  const { user } = useUser();

  if (!user) return <Navigate to="/login" />;
  if (!roles.includes(user.role)) return <Navigate to="/" />;

  return <Outlet />;
};

export default PrivateRoute;
