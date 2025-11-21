import Catalog from "./Catalog/Catalog";
import "./home.css";
import { useUser } from "../../contexts/UsuarioContext";

const Home = () => {
  const { user } = useUser();
  return (
    <div className="home-container">
      <div className="header-home">
        <h5>¡Bienvenido! {user?.username || ""}</h5>
        <hr />
      </div>

      <Catalog />
    </div>
  );
};

export default Home;
