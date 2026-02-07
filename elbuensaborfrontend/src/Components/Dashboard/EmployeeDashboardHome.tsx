import {
    AlertTriangle,
    ClipboardList,
    Clock3,
    Package,
    Receipt,
    ShoppingBag,
    Truck
} from "lucide-react";

type EmployeeDashboardHomeProps = {
    subRole?: string | null;
};

const DASHBOARD_CONFIG = {
    COCINERO: {
        title: "Panel de Cocina",
        subtitle: "Bienvenido al panel de gestión de cocina",
        cards: [
            {
                label: "Pedidos activos",
                value: "0",
                description: "Pedidos en cocina o preparación",
                icon: ClipboardList
            },
            {
                label: "Total insumos",
                value: "0",
                description: "Insumos registrados",
                icon: Package
            },
            {
                label: "Stock bajo",
                value: "0",
                description: "Insumos por debajo del mínimo",
                icon: AlertTriangle
            }
        ],
        quickAccessTitle: "Acceso rápido",
        quickAccessBody:
            "Usa el menú lateral para gestionar pedidos, insumos y stock de cocina."
    },
    CAJERO: {
        title: "Panel de Caja",
        subtitle: "Resumen de cobros y pedidos en mostrador",
        cards: [
            {
                label: "Pedidos pendientes",
                value: "0",
                description: "Pedidos esperando cobro",
                icon: ClipboardList
            },
            {
                label: "Ventas del día",
                value: "0",
                description: "Operaciones registradas hoy",
                icon: ShoppingBag
            },
            {
                label: "Cobros en proceso",
                value: "0",
                description: "Pagos en curso",
                icon: Receipt
            }
        ],
        quickAccessTitle: "Acceso rápido",
        quickAccessBody:
            "Revisa los pedidos, registra ventas y actualiza el estado de cobros desde el menú."
    },
    DELIVERY: {
        title: "Panel de Delivery",
        subtitle: "Control de entregas y pedidos listos",
        cards: [
            {
                label: "Entregas activas",
                value: "0",
                description: "Pedidos en ruta",
                icon: Truck
            },
            {
                label: "Pedidos listos",
                value: "0",
                description: "Listos para retirar",
                icon: Package
            },
            {
                label: "Tiempo promedio",
                value: "0 min",
                description: "Promedio de entrega",
                icon: Clock3
            }
        ],
        quickAccessTitle: "Acceso rápido",
        quickAccessBody:
            "Consulta las entregas pendientes y actualiza el estado desde el menú lateral."
    }
};

const DEFAULT_DASHBOARD = {
    title: "Panel de Empleados",
    subtitle: "Resumen general del área de trabajo",
    cards: [
        {
            label: "Pedidos activos",
            value: "0",
            description: "Pedidos en gestión",
            icon: ClipboardList
        },
        {
            label: "Operaciones",
            value: "0",
            description: "Acciones registradas hoy",
            icon: ShoppingBag
        },
        {
            label: "Alertas",
            value: "0",
            description: "Notificaciones pendientes",
            icon: AlertTriangle
        }
    ],
    quickAccessTitle: "Acceso rápido",
    quickAccessBody: "Selecciona una sección del menú para comenzar."
};

const EmployeeDashboardHome = ({subRole}: EmployeeDashboardHomeProps) => {
    const config = subRole && subRole in DASHBOARD_CONFIG
        ? DASHBOARD_CONFIG[subRole as keyof typeof DASHBOARD_CONFIG]
        : DEFAULT_DASHBOARD;

    return (
        <div className="dashboard-home employee-dashboard">
            <div className="dashboard-role-header">
                <div className="dashboard-role-icon">
                    <ClipboardList size={20}/>
                </div>
                <div className="dashboard-heading">
                    <h1>{config.title}</h1>
                    <p>{config.subtitle}</p>
                </div>
            </div>

            <section className="dashboard-summary">
                {config.cards.map((card) => (
                    <article className="summary-card" key={card.label}>
                        <div>
                            <span>{card.label}</span>
                            <strong>{card.value}</strong>
                            <p className="summary-detail">{card.description}</p>
                        </div>
                        <card.icon className="summary-icon" size={16} />
                    </article>
                ))}
            </section>

            <section className="employee-quick-access">
                <div className="activity-header">
                    <h2>{config.quickAccessTitle}</h2>
                </div>
                <p>{config.quickAccessBody}</p>
            </section>
        </div>
    );
};

export default EmployeeDashboardHome;