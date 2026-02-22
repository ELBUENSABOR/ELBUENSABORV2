const apiBase = import.meta.env.VITE_API_URL ?? "";
const backendBase = apiBase.replace(/\/api\/?$/, "");

export const getImageUrl = (path?: string) => {
    if (!path) {
        return "";
    }

    if (/^https?:\/\//i.test(path)) {
        return path;
    }

    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    return `${backendBase}${normalizedPath}`;
};