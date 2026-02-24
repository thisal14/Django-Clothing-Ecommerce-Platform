import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';

const BASE_URL = '/api';

export const api = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true,
    timeout: 15000,
});

// ── Response interceptor: auto-refresh on 401 ────────────────
let isRefreshing = false;
let failedQueue: Array<{
    resolve: () => void;
    reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: unknown) => {
    failedQueue.forEach((prom) => {
        if (error) prom.reject(error);
        else prom.resolve();
    });
    failedQueue = [];
};

api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise<void>((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(() => {
                    return api(originalRequest);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                await axios.post(`${BASE_URL}/auth/token/refresh/`, {}, { withCredentials: true });
                processQueue(null);
                return api(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError);
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('isAuth');
                    window.location.href = '/login';
                }
                if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
                    window.location.href = '/login';
                }
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default api;
