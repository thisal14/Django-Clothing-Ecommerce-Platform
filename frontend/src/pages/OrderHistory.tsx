import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ordersApi } from '@/api';
import type { Order } from '@/types';

const LKR = (n: number) =>
    new Intl.NumberFormat('si-LK', { style: 'currency', currency: 'LKR', maximumFractionDigits: 0 }).format(n);

const statusColor: Record<string, string> = {
    PENDING: '#B7791F', CONFIRMED: '#2D6A4F', PROCESSING: '#2563EB',
    SHIPPED: '#7C3AED', DELIVERED: '#2D6A4F', CANCELLED: '#C53030', REFUNDED: '#6B7280',
};

export default function OrderHistory() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        ordersApi.getOrders()
            .then(({ data }) => setOrders(data))
            .finally(() => setLoading(false));
    }, []);

    return (
        <>
            <Helmet><title>My Orders | In Sri Lanka</title></Helmet>
            <div className="container" style={{ padding: '60px var(--content-pad)', maxWidth: 900, margin: '0 auto' }}>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', marginBottom: 40 }}>My Orders</h1>

                {loading ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="skeleton" style={{ height: 120, borderRadius: 'var(--radius-md)' }} />
                        ))}
                    </div>
                ) : orders.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--color-text-muted)' }}>
                        <div style={{ fontSize: '3rem', marginBottom: 16 }}>📦</div>
                        <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', marginBottom: 20 }}>No orders yet</p>
                        <Link to="/products" className="btn btn-primary">Start Shopping</Link>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {orders.map((order: Order) => (
                            <div key={order.id} className="card" style={{ padding: 24 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                                    <div>
                                        <div style={{ fontWeight: 700, fontFamily: 'var(--font-display)', fontSize: '1.1rem' }}>
                                            #{order.order_number}
                                        </div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: 4 }}>
                                            {new Date(order.created_at).toLocaleDateString('en-LK', { dateStyle: 'long' })}
                                        </div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: 2 }}>
                                            {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <span className="badge" style={{ background: statusColor[order.status] + '20', color: statusColor[order.status], border: `1px solid ${statusColor[order.status]}40` }}>
                                            {order.status}
                                        </span>
                                        <div style={{ fontWeight: 700, fontSize: '1.1rem', marginTop: 8, color: 'var(--color-primary)' }}>
                                            {LKR(order.grand_total)}
                                        </div>
                                    </div>
                                </div>
                                {order.tracking_number && (
                                    <div style={{ marginTop: 12, padding: '8px 12px', background: 'var(--color-surface-2)', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem' }}>
                                        Tracking: <strong>{order.tracking_number}</strong>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}
