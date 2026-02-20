import {
    Building2,
    Users,
    Package,
    DollarSign,
    TrendingUp,
    ShoppingBag
} from "lucide-react";

const DashboardHome = () => {
    return (
        <div className="dashboard-home">
            <div className="dashboard-heading">
                <h1>Dashboard</h1>
                <p>Bienvenido al panel de administración</p>
            </div>

            <section className="dashboard-summary">
                <article className="summary-card">
                    <div>
                        <span>Sucursales</span>
                        <strong>3</strong>
                    </div>
                    <Building2/>
                </article>
                <article className="summary-card">
                    <div>
                        <span>Usuarios</span>
                        <strong>24</strong>
                    </div>
                    <Users/>
                </article>
                <article className="summary-card">
                    <div>
                        <span>Productos</span>
                        <strong>48</strong>
                    </div>
                    <Package/>
                </article>
                <article className="summary-card">
                    <div>
                        <span>Ventas hoy</span>
                        <strong>156</strong>
                    </div>
                    <ShoppingBag/>
                </article>
                <article className="summary-card">
                    <div>
                        <span>Ingresos</span>
                        <strong>$12,450</strong>
                    </div>
                    < DollarSign/>
                </article>
                <article className="summary-card">
                    <div>
                        <span>Crecimiento</span>
                        <strong>+12%</strong>
                    </div>
                    < TrendingUp/>
                </article>
            </section>

            <section className="dashboard-activity">
                <div className="activity-header">
                    <h2>Actividad Reciente</h2>
                </div>
                <p>Aquí se mostrará la actividad reciente del sistema...</p>
            </section>
        </div>
    );
};

export default DashboardHome;