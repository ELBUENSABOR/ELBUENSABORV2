import {Building2, DollarSign, Package, ShoppingBag, TrendingUp, Users} from "lucide-react";
import {useEffect, useMemo, useState} from "react";
import {fetchSucursales} from "../../services/dashboardService";
import {getAllUsers} from "../../services/userService";
import {getAll as getAllInsumos, getAllComprasInsumos} from "../../services/insumosService";
import {getAll as getAllManufacturados} from "../../services/manufacturadosService";
import {getPedidosAll} from "../../services/pedidoService";

type ActivityItem = {
    id: string;
    title: string;
    description: string;
    date: Date;
};

const isSameDay = (date: Date, reference: Date) => date.toDateString() === reference.toDateString();

const formatMoney = (amount: number) =>
    new Intl.NumberFormat("es-AR", {style: "currency", currency: "ARS", maximumFractionDigits: 0}).format(amount);

const formatDateTime = (date: Date) =>
    date.toLocaleString("es-AR", {dateStyle: "short", timeStyle: "short"});

const DashboardHome = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [sucursales, setSucursales] = useState(0);
    const [usuarios, setUsuarios] = useState(0);
    const [productos, setProductos] = useState(0);
    const [ventasHoy, setVentasHoy] = useState(0);
    const [ingresosHoy, setIngresosHoy] = useState(0);
    const [crecimiento, setCrecimiento] = useState("0%");
    const [activity, setActivity] = useState<ActivityItem[]>([]);

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                setLoading(true);
                setError("");

                const [sucursalesData, usersRes, insumosData, pedidosData, comprasData] = await Promise.all([
                    fetchSucursales(),
                    getAllUsers(),
                    getAllInsumos(),
                    getPedidosAll(),
                    getAllComprasInsumos(),
                ]);

                const manufacturadosPorSucursal = await Promise.all(
                    sucursalesData
                        .filter((sucursal) => sucursal.id !== undefined)
                        .map((sucursal) => getAllManufacturados(sucursal.id as number).catch(() => []))
                );

                const manufacturadosIds = new Set<number>();
                manufacturadosPorSucursal.flat().forEach((manufacturado: { id?: number }) => {
                    if (typeof manufacturado.id === "number") {
                        manufacturadosIds.add(manufacturado.id);
                    }
                });

                const today = new Date();
                const yesterday = new Date(today);
                yesterday.setDate(today.getDate() - 1);

                const pedidosHoy = pedidosData.filter((pedido: { fechaPedido: string }) =>
                    isSameDay(new Date(pedido.fechaPedido), today)
                );
                const pedidosAyer = pedidosData.filter((pedido: { fechaPedido: string }) =>
                    isSameDay(new Date(pedido.fechaPedido), yesterday)
                );

                const ingresos = pedidosHoy.reduce((acc: number, pedido: { total: number }) => acc + (pedido.total ?? 0), 0);
                const crecimientoCalculado = pedidosAyer.length === 0
                    ? pedidosHoy.length > 0 ? 100 : 0
                    : Math.round(((pedidosHoy.length - pedidosAyer.length) / pedidosAyer.length) * 100);

                const pedidosActivity: ActivityItem[] = pedidosData
                    .filter((pedido: { fechaPedido?: string; id: number; cliente?: { nombre?: string; apellido?: string } }) => pedido.fechaPedido)
                    .map((pedido: { fechaPedido: string; id: number; cliente?: { nombre?: string; apellido?: string } }) => ({
                        id: `pedido-${pedido.id}`,
                        title: `Pedido #${pedido.id} registrado`,
                        description: `Cliente: ${pedido.cliente?.nombre ?? "N/A"} ${pedido.cliente?.apellido ?? ""}`.trim(),
                        date: new Date(pedido.fechaPedido),
                    }));

                const comprasActivity: ActivityItem[] = comprasData
                    .filter((compra: { fechaCompra?: string; id: number; insumo?: { denominacion?: string } }) => compra.fechaCompra)
                    .map((compra: {
                        fechaCompra: string;
                        id: number;
                        insumo?: { denominacion?: string };
                        cantidad?: number;
                    }) => ({
                        id: `compra-${compra.id}`,
                        title: `Compra de insumo #${compra.id}`,
                        description: `${compra.insumo?.denominacion ?? "Insumo"} x ${compra.cantidad ?? 0}`,
                        date: new Date(compra.fechaCompra),
                    }));

                setSucursales(sucursalesData.length);
                setUsuarios(usersRes.data?.length ?? 0);
                setProductos((insumosData?.length ?? 0) + manufacturadosIds.size);
                setVentasHoy(pedidosHoy.length);
                setIngresosHoy(ingresos);
                setCrecimiento(`${crecimientoCalculado >= 0 ? "+" : ""}${crecimientoCalculado}%`);
                setActivity([...pedidosActivity, ...comprasActivity]
                    .sort((a, b) => b.date.getTime() - a.date.getTime())
                    .slice(0, 8));
            } catch (e) {
                setError("No se pudieron cargar los indicadores del dashboard.");
            } finally {
                setLoading(false);
            }
        };

        loadDashboard();
    }, []);

    const cards = useMemo(() => ([
        {label: "Sucursales", value: String(sucursales), icon: Building2},
        {label: "Usuarios", value: String(usuarios), icon: Users},
        {label: "Productos", value: String(productos), icon: Package},
        {label: "Ventas hoy", value: String(ventasHoy), icon: ShoppingBag},
        {label: "Ingresos", value: formatMoney(ingresosHoy), icon: DollarSign},
        {label: "Crecimiento", value: crecimiento, icon: TrendingUp},
    ]), [crecimiento, ingresosHoy, productos, sucursales, usuarios, ventasHoy]);

    return (
        <div className="dashboard-home">
            <div className="dashboard-heading">
                <h1>Dashboard</h1>
                <p>Bienvenido al panel de administración</p>
            </div>

            <section className="dashboard-summary">
                {cards.map((card) => (
                    <article className="summary-card" key={card.label}>
                        <div>
                            <span>{card.label}</span>
                            <strong>{loading ? "..." : card.value}</strong>
                        </div>
                        <card.icon/>
                    </article>
                ))}
            </section>

            <section className="dashboard-activity">
                <div className="activity-header">
                    <h2>Actividad Reciente</h2>
                </div>
                {error && <p>{error}</p>}
                {!error && loading && <p>Cargando actividad...</p>}
                {!error && !loading && activity.length === 0 && <p>No hay actividad reciente para mostrar.</p>}
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

export default DashboardHome;