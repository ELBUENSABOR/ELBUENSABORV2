import {Link} from "react-router-dom";
import {ChangePasswordPopup} from "./ChangePasswordPopup";
import "./home.css";
import {
    BadgePercent,
    MapPinned,
    Clock4,
    Phone
} from 'lucide-react';


//Hardcodeado, tal vez podemos hacer "ofertas" con una propiedad "descuento" en los productos.
const offers = [
    {
        title: "Burger Clásica",
        description:
            "Carne de res 200g, lechuga, tomate, queso cheddar y salsa especial.",
        price: "$1850.00",
        oldPrice: "$2200.00",
        badge: "20% OFF",
        image:
            "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=700&q=80",
    },
    {
        title: "Burger Doble",
        description:
            "Doble carne de res 400g, doble queso, bacon crocante y cebolla caramelizada.",
        price: "$2650.00",
        oldPrice: "$3100.00",
        badge: "15% OFF",
        image:
            "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=700&q=80",
    },
    {
        title: "Burger Veggie",
        description:
            "Medallón de lentejas y quinoa, rúcula, tomate seco y mayonesa vegana.",
        price: "$1750.00",
        oldPrice: "$2100.00",
        badge: "2x1",
        image:
            "https://images.unsplash.com/photo-1520072959219-c595dc870360?auto=format&fit=crop&w=700&q=80",
    },
];

const Home = () => {
    return (
        <div className="home-page">
            <ChangePasswordPopup/>
            <section className="home-hero">
                <h1>
                    ¡Bienvenido a <span>El Buen Sabor</span>!
                </h1>
                <p className="home-hero__subtitle">
                    Descubrí nuestros favoritos del día y hacé tu pedido en minutos.
                </p>
                <Link to="/catalog" className="btn home-hero__button">
                    Explorar Catálogo
                </Link>
            </section>

            <section className="home-offers">
                <div className="home-section-title">
                    <BadgePercent size={28}/>
                    <h2>Ofertas del Día</h2>
                </div>

                <div className="home-offers__grid">
                    {offers.map((offer) => (
                        <article key={offer.title} className="home-offer-card">
                            <div className="home-offer-card__image">
                                <img src={offer.image} alt={offer.title} loading="lazy"/>
                                <span className="home-offer-card__badge">{offer.badge}</span>
                            </div>
                            <div className="home-offer-card__content">
                                <h3>{offer.title}</h3>
                                <p>{offer.description}</p>
                                <div className="home-offer-card__price">
                                    <span className="home-offer-card__old">{offer.oldPrice}</span>
                                    <strong>{offer.price}</strong>
                                </div>
                                <button type="button" className="btn home-offer-card__button">
                                    Ver más
                                </button>
                            </div>
                        </article>
                    ))}
                </div>

                <Link to="/catalog" className="btn home-offers__button">
                    Ver todas las ofertas
                </Link>
            </section>

            <section className="home-location">
                <div className="home-section-title">
                    <MapPinned size={28}/>
                    <h2>Aquí estamos</h2>
                </div>

                <div className="home-location__content">
                    <div className="home-location__map">
                        <iframe
                            title="Mapa El Buen Sabor"
                            src="https://www.google.com/maps?q=Mendoza,+Argentina&output=embed"
                            loading="lazy"
                            allowFullScreen
                        />
                    </div>

                    <div className="home-location__cards">
                        <article className="info-card">
                            <div className="info-card__icon">
                                <MapPinned size={18}/>
                            </div>

                            <div className="info-card__body">
                                <h3>Dirección</h3>
                                <p>Av. San Martín 1234</p>
                                <span>Ciudad de Mendoza, Mendoza</span>
                            </div>
                        </article>

                        <article className="info-card">
                            <div className="info-card__icon">
                                <Clock4 size={18}/>
                            </div>

                            <div className="info-card__body">
                                <h3>Horarios</h3>
                                <p>Lunes a Viernes: 11:00 - 23:00</p>
                                <span>Sábados y Domingos: 12:00 - 00:00</span>
                            </div>
                        </article>

                        <article className="info-card">
                            <div className="info-card__icon">
                                <Phone size={18}/>
                            </div>

                            <div className="info-card__body">
                                <h3>Contacto</h3>
                                <p>Tel: (261) 123-4567</p>
                                <span>WhatsApp: +54 9 261 123-4567</span>
                            </div>
                        </article>
                    </div>

                </div>
            </section>

            <footer className="home-footer">© 2024 El Buen Sabor. Todos los derechos reservados.</footer>
        </div>
    );
};

export default Home;
