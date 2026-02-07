const EMPLOYEE_PANEL_ROUTES: Record<string, string> = {
    COCINERO: "/dashboard/cocina",
    DELIVERY: "/dashboard/delivery",
    CAJERO: "/dashboard/pedidos",
};

const EMPLOYEE_PANEL_LABELS: Record<string, string> = {
    COCINERO: "Panel de cocina",
    DELIVERY: "Panel de delivery",
    CAJERO: "Panel de caja",
};

export const getEmployeeDashboardRoute = (
    role?: string | null,
    subRole?: string | null
) => {
    if (role !== "EMPLEADO") {
        return "/";
    }

    if (subRole && EMPLOYEE_PANEL_ROUTES[subRole]) {
        return EMPLOYEE_PANEL_ROUTES[subRole];
    }

    return "/dashboard";
};

export const getEmployeePanelLabel = (subRole?: string | null) => {
    if (subRole && EMPLOYEE_PANEL_LABELS[subRole]) {
        return EMPLOYEE_PANEL_LABELS[subRole];
    }

    return "Panel de empleados";
};
