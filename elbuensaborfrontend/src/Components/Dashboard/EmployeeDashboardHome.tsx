import {AlertTriangle, ClipboardList, Clock3, Package, Receipt, ShoppingBag, Truck} from "lucide-react";
import {useEffect, useMemo, useState} from "react";
import {getPedidosAll} from "../../services/pedidoService";
import {getAll as getAllInsumos} from "../../services/insumosService";

type EmployeeDashboardHomeProps = {
    subRole?: string | null;
};

type ActivityItem = {
    id: string;
    title: string;
    description: string;
    date: Date;
};

const formatDateTime = (date: Date) =>
    date.toLocaleString("es-AR", {dateStyle: "short", timeStyle: "short"});

const EmployeeDashboardHome = ({subRole}: EmployeeDashboardHomeProps) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [cards, setCards] = useState<Array<{ label: string; value: string; description: string; icon: any }>>([]);
    const [activity, setActivity] = useState<ActivityItem[]>([]);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                setError("");

                const [pedidos, insumos] = await Promise.all([
                    getPedidosAll(),
                    getAllInsumos(),
                ]);

                const pedidosActivos = pedidos.filter((p: {
                    estado: string
                }) => ["A_CONFIRMAR", "A_COCINA", "LISTO", "EN_DELIVERY"].includes(p.estado));
                const pedidosPendientesCobro = pedidos.filter((p: { estado: string }) => p.estado === "ENTREGADO");
                const pedidosListos = pedidos.filter((p: { estado: string }) => p.estado === "LISTO");
                const entregasActivas = pedidos.filter((p: { estado: string }) => p.estado === "EN_DELIVERY");
                const ventasHoy = pedidos.filter((p: {
                    fechaPedido: string
                }) => new Date(p.fechaPedido).toDateString() === new Date().toDateString());

                const stockBajo = insumos.filter((insumo: {
                    stockSucursal?: Array<{ stockActual: number; stockMinimo: number }>;
                }) => (insumo.stockSucursal ?? []).some((stock) => stock.stockActual <= stock.stockMinimo)).length;

                const deliveryTimes = pedidos
                    .filter((p: { tipoEnvio: string; fechaPedido?: string; horaEstimadaFinalizacion?: string }) =>
                        p.tipoEnvio === "DELIVERY" && p.fechaPedido && p.horaEstimadaFinalizacion
                    )
                    .map((p: { fechaPedido: string; horaEstimadaFinalizacion: string }) => {
                        const start = new Date(p.fechaPedido).getTime();
                        const end = new Date(p.horaEstimadaFinalizacion).getTime();
                        return Math.max(0, Math.round((end - start) / 60000));
                    });
                const avgDeliveryTime = deliveryTimes.length
                    ? Math.round(deliveryTimes.reduce((acc: number, val: number) => acc + val, 0) / deliveryTimes.length)
                    : 0;

                const nextCards = subRole === "COCINERO"
                    ? [
                        {
                            label: "Pedidos activos",
                            value: String(pedidosActivos.length),
                            description: "Pedidos en cocina o preparación",
                            icon: ClipboardList,
                        },
                        {
                            label: "Total insumos",
                            value: String(insumos.length),
                            description: "Insumos registrados",
                            icon: Package,
                        },
                        {
                            label: "Stock bajo",
                            value: String(stockBajo),
                            description: "Insumos por debajo del mínimo",
                            icon: AlertTriangle,
                        },
                    ]
                    : subRole === "CAJERO"
                        ? [
                            {
                                label: "Pedidos pendientes",
                                value: String(pedidosPendientesCobro.length),
                                description: "Pedidos esperando cobro/facturación",
                                icon: ClipboardList,
                            },
                            {
                                label: "Ventas del día",
                                value: String(ventasHoy.length),
                                description: "Pedidos generados hoy",
                                icon: ShoppingBag,
                            },
                            {
                                label: "Cobros en proceso",
                                value: String(pedidosActivos.length),
                                description: "Pedidos aún no finalizados",
                                icon: Receipt,
                            },
                        ]
                        : subRole === "DELIVERY"
                            ? [
                                {
                                    label: "Entregas activas",
                                    value: String(entregasActivas.length),
                                    description: "Pedidos en ruta",
                                    icon: Truck,
                                },
                                {
                                    label: "Pedidos listos",
                                    value: String(pedidosListos.length),
                                    description: "Listos para retirar",
                                    icon: Package,
                                },
                                {
                                    label: "Tiempo promedio",
                                    value: `${avgDeliveryTime} min`,
                                    description: "Promedio estimado de entrega",
                                    icon: Clock3,
                                },
                            ]
                            : [
                                {
                                    label: "Pedidos activos",
                                    value: String(pedidosActivos.length),
                                    description: "Pedidos en gestión",
                                    icon: ClipboardList,
                                },
                                {
                                    label: "Operaciones",
                                    value: String(ventasHoy.length),
                                    description: "Acciones registradas hoy",
                                    icon: ShoppingBag,
                                },
                                {
                                    label: "Alertas",
                                    value: String(stockBajo),
                                    description: "Notificaciones pendientes",
                                    icon: AlertTriangle,
                                },
                            ];

                const activityFromPedidos: ActivityItem[] = pedidos
                    .filter((pedido: { id: number; fechaPedido?: string; estado: string }) => pedido.fechaPedido)
                    .map((pedido: { id: number; fechaPedido: string; estado: string }) => ({
                        id: `pedido-${pedido.id}`,
                        title: `Pedido #${pedido.id}`,
                        description: `Cambio/estado actual: ${pedido.estado}`,
                        date: new Date(pedido.fechaPedido),
                    }));

                setCards(nextCards);
                setActivity(activityFromPedidos
                    .sort((a, b) => b.date.getTime() - a.date.getTime())
                    .slice(0, 8));
            } catch {
                setError("No se pudieron cargar métricas reales para el panel.");
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [subRole]);

    const config = useMemo(() => {
        if (subRole === "COCINERO") {
            return {
                title: "Panel de Cocina",
                subtitle: "Bienvenido al panel de gestión de cocina",
                quickAccessTitle: "Actividad reciente",
                quickAccessBody: "Pedidos en curso y movimientos recientes del área de cocina.",
            };
        }
        if (subRole === "CAJERO") {
            return {
                title: "Panel de Caja",
                subtitle: "Resumen de cobros y pedidos en mostrador",
                quickAccessTitle: "Actividad reciente",
                quickAccessBody: "Cobros, pedidos registrados y operaciones de caja recientes.",
            };
        }
        if (subRole === "DELIVERY") {
            return {
                title: "Panel de Delivery",
                subtitle: "Control de entregas y pedidos listos",
                quickAccessTitle: "Actividad reciente",
                quickAccessBody: "Entregas activas y últimos pedidos despachados.",
            };
        }
        return {
            title: "Panel de Empleados",
            subtitle: "Resumen general del área de trabajo",
            quickAccessTitle: "Actividad reciente",
            quickAccessBody: "Últimos movimientos relacionados a pedidos y operación diaria.",
        };
    }, [subRole]);

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
                {cards.map((card) => (
                    <article className="summary-card" key={card.label}>
                        <div>
                            <span>{card.label}</span>
                            <strong>{loading ? "..." : card.value}</strong>
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
                {error && <p>{error}</p>}
                {!error && loading && <p>Cargando actividad...</p>}
                {!error && !loading && activity.length === 0 && <p>{config.quickAccessBody}</p>}
                {!error && !loading && activity.length > 0 && (
                    <ul className="dashboard-activity-list">
                        {activity.map((item) => (
                            <li key={item.id} className="dashboard-activity-item">
                                <strong>{item.title}</strong>
                                <span>{item.description}</span>
                                <small>{formatDateTime(item.date)}</small>
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </div>
    );
};

export default EmployeeDashboardHome;