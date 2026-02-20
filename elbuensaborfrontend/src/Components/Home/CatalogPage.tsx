import Catalog from "./Catalog/Catalog";
import CartSidebar from "./Cart/CartSidebar";
import {ChangePasswordPopup} from "./ChangePasswordPopup";
import "./catalogPage.css";

const CatalogPage = () => {
    return (
        <div className="catalog-page">
            <ChangePasswordPopup/>
            <div className="catalog-page__content">
                <div className="catalog-page__main">
                    <Catalog/>
                </div>
                <div className="catalog-page__cart">
                    <CartSidebar/>
                </div>
            </div>
        </div>
    );
};

export default CatalogPage;