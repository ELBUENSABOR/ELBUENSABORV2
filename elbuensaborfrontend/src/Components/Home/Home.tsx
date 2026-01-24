import Catalog from "./Catalog/Catalog";
import "./home.css";
import {useUser} from "../../contexts/UsuarioContext";
import {ChangePasswordPopup} from "./ChangePasswordPopup.tsx";
import CartSidebar from "./Cart/CartSidebar";

const Home = () => {
    const {user} = useUser();
    return (
        <div className="app-shell">
            <div className="home-container">
                <div className="header-home">
                    <h5>{user ? `¡Bienvenido! ${user.username}` : "¡Bienvenido!"}</h5>
                    <hr/>
                    {user && <ChangePasswordPopup/>}
                </div>
                <div className="home-content">
                    <div className="home-main">
                        <Catalog/>
                    </div>
                    <div className="home-cart">
                        <CartSidebar/>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
