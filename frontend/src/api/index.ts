import api from './client';
export { adminApi } from './admin';
import type {
    User, Address, PaginatedResponse,
    Product, Category, Cart, Order, ShippingMethod, CouponResult, DashboardMetrics
} from '@/types';

// ── Auth ─────────────────────────────────────────────────────
export const authApi = {
    register: (data: {
        email: string; first_name: string; last_name: string;
        phone: string; password: string; password2: string;
    }) => api.post<{ user: User }>('/auth/register/', data),

    login: (email: string, password: string) =>
        api.post<{ user: User }>('/auth/login/', { email, password }),

    logout: () => api.post('/auth/logout/'),

    refreshToken: () =>
        api.post<{ access: string }>('/auth/token/refresh/'),

    getProfile: () => api.get<User>('/auth/profile/'),

    updateProfile: (data: Partial<User>) => api.patch<User>('/auth/profile/', data),

    changePassword: (old_password: string, new_password: string) =>
        api.put('/auth/password/change/', { old_password, new_password }),

    getAddresses: () => api.get<Address[]>('/auth/addresses/'),

    createAddress: (data: Omit<Address, 'id' | 'is_default'> & { is_default?: boolean }) =>
        api.post<Address>('/auth/addresses/', data),

    updateAddress: (id: string, data: Partial<Address>) =>
        api.patch<Address>(`/auth/addresses/${id}/`, data),

    deleteAddress: (id: string) => api.delete(`/auth/addresses/${id}/`),
};

// ── Catalog ──────────────────────────────────────────────────
export const catalogApi = {
    getCategories: () => api.get<Category[]>('/catalog/categories/'),

    getProducts: (params?: Record<string, string | number | boolean>) =>
        api.get<PaginatedResponse<Product>>('/catalog/products/', { params }),

    getProductBySlug: (slug: string) => api.get<Product>(`/catalog/products/${slug}/`),
};

// ── Cart ─────────────────────────────────────────────────────
export const cartApi = {
    getCart: () => api.get<Cart>('/cart/'),

    addItem: (variant_id: string, quantity: number) =>
        api.post<Cart>('/cart/items/', { variant_id, quantity }),

    updateItem: (itemId: string, quantity: number) =>
        api.patch<Cart>(`/cart/items/${itemId}/`, { quantity }),

    removeItem: (itemId: string) => api.delete<Cart>(`/cart/items/${itemId}/`),

    clearCart: () => api.delete('/cart/'),
};

// ── Orders ───────────────────────────────────────────────────
export const ordersApi = {
    getOrders: () => api.get<Order[]>('/orders/'),

    getOrder: (id: string) => api.get<Order>(`/orders/${id}/`),

    createOrder: (data: {
        shipping_address: any;
        shipping_method_id: string;
        notes?: string;
    }) => api.post<Order>('/orders/checkout/', data),
};

// ── Payments ─────────────────────────────────────────────────
export const paymentsApi = {
    initiatePayment: (order_id: string) =>
        api.post('/payments/initiate/', { order_id }),
};

// ── Shipping ─────────────────────────────────────────────────
export const shippingApi = {
    getMethods: (district?: string) =>
        api.get<ShippingMethod[]>('/shipping/methods/', { params: district ? { district } : {} }),
};

// ── Promotions ───────────────────────────────────────────────
export const promotionsApi = {
    validateCoupon: (code: string) =>
        api.post<CouponResult>('/promotions/coupons/validate/', { code }),
};

// ── Analytics ────────────────────────────────────────────────
export const analyticsApi = {
    getDashboard: () => api.get<DashboardMetrics>('/admin/dashboard/'),
};
