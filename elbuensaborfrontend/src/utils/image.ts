const apiBase = (import.meta.env.VITE_API_URL ?? "").trim();

const isLocalHost = (value: string) => /https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?/i.test(value);

const resolveBackendBase = () => {
    const configuredBase = apiBase.replace(/\/api\/?$/, "");

    if (!configuredBase) {
        return typeof window !== "undefined" ? window.location.origin : "";
    }

    if (typeof window !== "undefined" && !isLocalHost(window.location.origin) && isLocalHost(configuredBase)) {
        return window.location.origin;
    }

    return configuredBase;
};

const backendBase = resolveBackendBase();

export const getImageUrl = (path?: string) => {
    if (!path) {
        return "";
    }

    if (/^data:image\//i.test(path)) {
        return path;
    }

    if (/^https?:\/\//i.test(path)) {
        if (backendBase && isLocalHost(path) && !isLocalHost(backendBase)) {
            try {
                const absoluteUrl = new URL(path);
                return `${backendBase}${absoluteUrl.pathname}`;
            } catch {
                return path;
            }
        }
        return path;
    }

    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    return `${backendBase}${normalizedPath}`;
};