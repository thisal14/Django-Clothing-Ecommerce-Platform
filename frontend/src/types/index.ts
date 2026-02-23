// ── Auth Types ──────────────────────────────────────────────
export interface User {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    phone: string;
    role: 'CUSTOMER' | 'STAFF' | 'ADMIN';
    is_verified: boolean;
    is_staff?: boolean;
    is_superuser?: boolean;
    avatar: string | null;
    date_joined: string;
    full_name?: string;
}

export interface Address {
    id: string;
    full_name: string;
    phone: string;
    line1: string;
    line2?: string;
    city: string;
    district: string;
    postal_code?: string;
    is_default: boolean;
}

export interface AuthTokens {
    access: string;
    refresh: string;
}

// ── Catalog Types ────────────────────────────────────────────
export interface Category {
    id: string;
    name: string;
    slug: string;
    image: string | null;
    description: string;
    children: Category[];
    parent: string | null;
    sort_order: number;
}

export interface Brand {
    id: string;
    name: string;
    slug: string;
    logo: string | null;
}

export interface AttributeValue {
    id: string;
    attribute_name: string;
    value: string;
    color_hex: string;
}

export interface Stock {
    quantity: number;
    available: number;
    is_in_stock: boolean;
    is_low_stock: boolean;
}

export interface ProductVariant {
    id: string;
    sku: string;
    attributes: AttributeValue[];
    effective_price: number;
    price_override: number | null;
    stock: Stock;
    is_active: boolean;
}

export interface ProductImage {
    id: string;
    image: string;
    alt_text: string;
    sort_order: number;
    is_primary: boolean;
}

export interface Product {
    id: string;
    name: string;
    slug: string;
    category: Category;
    brand: Brand | null;
    description: string;
    short_description: string;
    base_price: number;
    sale_price: number | null;
    effective_price: number;
    is_on_sale: boolean;
    is_new_arrival: boolean;
    is_featured: boolean;
    meta_title: string;
    meta_description: string;
    is_active: boolean;
    images: ProductImage[];
    variants: ProductVariant[];
    primary_image?: string | null;
    category_name?: string;
    avg_rating: number | null;
    review_count: number;
}

// ── Cart Types ───────────────────────────────────────────────
export interface CartItem {
    id: string;
    variant: ProductVariant;
    quantity: number;
    line_total: number;
    product_name: string;
    product_slug: string;
}

export interface Cart {
    id: string;
    items: CartItem[];
    total: number;
    item_count: number;
}

// ── Order Types ──────────────────────────────────────────────
export type OrderStatus =
    | 'PENDING'
    | 'CONFIRMED'
    | 'PROCESSING'
    | 'SHIPPED'
    | 'DELIVERED'
    | 'CANCELLED'
    | 'REFUNDED';

export interface OrderItem {
    id: string;
    product_snapshot: {
        name: string;
        sku: string;
        image: string | null;
        price: string;
    };
    quantity: number;
    unit_price: number;
    total_price: number;
}

export interface OrderStatusHistory {
    status: OrderStatus;
    note: string;
    changed_by_name: string | null;
    created_at: string;
}

export interface Order {
    id: string;
    order_number: string;
    status: OrderStatus;
    shipping_address: Address;
    shipping_method: string;
    shipping_cost: number;
    subtotal: number;
    discount_total: number;
    tax_total: number;
    grand_total: number;
    notes: string;
    tracking_number: string;
    created_at: string;
    items: OrderItem[];
    status_history: OrderStatusHistory[];
    payment_status: string | null;
}

// ── Shipping Types ───────────────────────────────────────────
export interface ShippingMethod {
    id: string;
    name: string;
    carrier: string;
    base_rate: number;
    zone_name: string;
    estimated_delivery: string;
}

// ── Coupon Types ─────────────────────────────────────────────
export interface CouponResult {
    valid: boolean;
    type?: 'PERCENTAGE' | 'FIXED_AMOUNT' | 'FREE_SHIPPING';
    value?: number;
    description?: string;
    error?: string;
}

// ── API Response Types ───────────────────────────────────────
export interface PaginatedResponse<T> {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
}

export interface ApiError {
    detail?: string;
    [key: string]: string | string[] | undefined;
}

// ── Analytics Types ──────────────────────────────────────────
export interface DashboardMetrics {
    total_revenue: number;
    monthly_revenue: number;
    pending_orders: number;
    processing_orders: number;
    total_products: number;
    total_customers: number;
    new_customers_30d: number;
    daily_sales: { date: string; revenue: number; orders: number }[];
    top_products: { name: string; slug: string; order_count: number }[];
}
