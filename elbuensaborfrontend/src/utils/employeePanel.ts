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

    if (subRole) {
        return "/dashboard/home";
    }

    return "/dashboard/home";
};

export const getEmployeePanelLabel = (subRole?: string | null) => {
    if (subRole && EMPLOYEE_PANEL_LABELS[subRole]) {
        return EMPLOYEE_PANEL_LABELS[subRole];
    }

    return "Panel de empleados";
};
