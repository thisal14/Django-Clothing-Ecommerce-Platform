import api from './client';
import type { Product, Order, User, PaginatedResponse } from '@/types';

export const adminApi = {
    // Products
    getProducts: (params?: Record<string, string | number>) =>
        api.get<PaginatedResponse<Product>>('/catalog/admin/products/', { params }),

    getProduct: (slug: string) =>
        api.get<Product>(`/catalog/admin/products/${slug}/`),

    createProduct: (data: Partial<Product>) =>
        api.post<Product>('/catalog/admin/products/', data),

    updateProduct: (slug: string, data: Partial<Product>) =>
        api.put<Product>(`/catalog/admin/products/${slug}/`, data),

    deleteProduct: (slug: string) =>
        api.delete(`/catalog/admin/products/${slug}/`),

    // Orders
    getOrders: (params?: Record<string, string | number>) =>
        api.get<PaginatedResponse<Order>>('/orders/admin/orders/', { params }),

    getOrder: (id: string) =>
        api.get<Order>(`/orders/admin/orders/${id}/`),

    updateOrderStatus: (id: string, status: string) =>
        api.patch<Order>(`/orders/admin/orders/${id}/`, { status }),

    // Users
    getUsers: (params?: Record<string, string | number>) =>
        api.get<PaginatedResponse<User>>('/auth/admin/users/', { params }),

    updateUser: (id: string, data: Partial<User>) =>
        api.patch<User>(`/auth/admin/users/${id}/`, data),
};
