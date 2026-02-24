import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { adminApi } from '@/api';
import type { Order } from '@/types';
import { ArrowLeft, Package, User, MapPin, CreditCard } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminOrderDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchOrder = async () => {
        if (!id) return;
        try {
            setLoading(true);
            const { data } = await adminApi.getOrder(id);
            setOrder(data);
        } catch (error) {
            toast.error('Failed to load order details');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrder();
    }, [id]);

    const handleStatusChange = async (newStatus: string) => {
        if (!id) return;
        try {
            await adminApi.updateOrderStatus(id, newStatus);
            toast.success('Order status updated');
            fetchOrder();
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PENDING': return { bg: 'var(--color-warning-bg)', text: 'var(--color-warning)' };
            case 'PROCESSING': return { bg: '#EBF8FF', text: '#2B6CB0' };
            case 'SHIPPED': return { bg: '#FAF5FF', text: '#6B46C1' };
            case 'DELIVERED': return { bg: 'var(--color-success-bg)', text: 'var(--color-success)' };
            case 'CANCELLED': return { bg: 'var(--color-error-bg)', text: 'var(--color-error)' };
            default: return { bg: 'var(--color-surface-2)', text: 'var(--color-text-muted)' };
        }
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                <div style={{ width: 200, height: 40, backgroundColor: 'var(--color-surface-2)', borderRadius: 'var(--radius-sm)' }} className="skeleton" />
                <div style={{ width: '100%', height: 400, backgroundColor: 'var(--color-surface-2)', borderRadius: 'var(--radius-md)' }} className="skeleton" />
            </div>
        );
    }

    if (!order) return <div style={{ textAlign: 'center', padding: 40 }}>Order not found.</div>;

    const statusColors = getStatusColor(order.status);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32, maxWidth: 1200 }}>
            {/* Header */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <button
                    onClick={() => navigate('/admin/orders')}
                    style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--color-text-muted)', fontSize: '0.9rem', fontWeight: 500, transition: 'color var(--transition-fast)' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-primary)'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text-muted)'}
                >
                    <ArrowLeft size={16} />
                    <span>Back to Orders</span>
                </button>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', color: 'var(--color-text)' }}>
                                Order #{order.order_number}
                            </h2>
                            <span style={{
                                fontSize: '0.85rem', fontWeight: 600, padding: '4px 16px', borderRadius: 'var(--radius-full)',
                                backgroundColor: statusColors.bg, color: statusColors.text
                            }}>
                                {order.status}
                            </span>
                        </div>
                        <p style={{ color: 'var(--color-text-muted)', fontSize: '1rem' }}>
                            Placed on {new Date(order.created_at).toLocaleString()}
                        </p>
                    </div>

                    <div style={{ display: 'flex', gap: 12 }}>
                        <select
                            value={order.status}
                            onChange={(e) => handleStatusChange(e.target.value)}
                            className="form-input"
                            style={{ minWidth: 160, padding: '8px 16px' }}
                        >
                            <option value="PENDING">PENDING</option>
                            <option value="PROCESSING">PROCESSING</option>
                            <option value="SHIPPED">SHIPPED</option>
                            <option value="DELIVERED">DELIVERED</option>
                            <option value="CANCELLED">CANCELLED</option>
                        </select>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 32 }}>
                {/* Left Side: Order Items */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                    <div className="card" style={{ padding: 0 }}>
                        <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: 12 }}>
                            <Package size={20} style={{ color: 'var(--color-primary)' }} />
                            <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--color-text)' }}>Order Items</h3>
                            <span style={{ marginLeft: 'auto', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                                {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                            </span>
                        </div>
                        <div>
                            {order.items.map((item) => (
                                <div key={item.id} style={{ display: 'flex', gap: 24, padding: '24px 32px', borderBottom: '1px solid var(--color-border)' }}>
                                    <div style={{ width: 80, height: 100, backgroundColor: 'var(--color-surface-2)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
                                        {item.product_snapshot.image && (
                                            <img src={item.product_snapshot.image} alt={item.product_snapshot.name} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        )}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <h4 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: 4 }}>{item.product_snapshot.name}</h4>
                                        <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                                            SKU: <span style={{ color: 'var(--color-text)', fontWeight: 500 }}>{item.product_snapshot.sku}</span>
                                        </p>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 12 }}>
                                            <p style={{ fontSize: '0.95rem', color: 'var(--color-text)' }}>
                                                LKR {item.unit_price} × {item.quantity}
                                            </p>
                                            <p style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-text)' }}>
                                                LKR {item.total_price}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {/* Totals */}
                        <div style={{ padding: '24px 32px', backgroundColor: 'var(--color-surface-2)', borderBottomLeftRadius: 'var(--radius-md)', borderBottomRightRadius: 'var(--radius-md)' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
                                    <span>Subtotal</span>
                                    <span>LKR {order.subtotal}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
                                    <span>Shipping</span>
                                    <span>LKR {order.shipping_cost}</span>
                                </div>
                                {order.discount_total > 0 && (
                                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-success)', fontSize: '0.95rem' }}>
                                        <span>Discount</span>
                                        <span>-LKR {order.discount_total}</span>
                                    </div>
                                )}
                                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text)', fontSize: '1.2rem', fontWeight: 700, marginTop: 8, borderTop: '1px solid var(--color-border)', paddingTop: 16 }}>
                                    <span>Total</span>
                                    <span style={{ color: 'var(--color-primary)' }}>LKR {order.grand_total}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Customer & Shipping */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                    {/* Customer Info */}
                    <div className="card" style={{ padding: 24 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                            <User size={18} style={{ color: 'var(--color-primary)' }} />
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--color-text)' }}>Customer</h3>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            <div>
                                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Full Name</p>
                                <p style={{ fontWeight: 600, color: 'var(--color-text)' }}>{order.shipping_address?.full_name}</p>
                            </div>
                            <div>
                                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Contact</p>
                                <p style={{ fontWeight: 500, color: 'var(--color-text)' }}>{order.shipping_address?.phone}</p>
                            </div>
                        </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="card" style={{ padding: 24 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                            <MapPin size={18} style={{ color: 'var(--color-primary)' }} />
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--color-text)' }}>Shipping Address</h3>
                        </div>
                        <div style={{ lineHeight: 1.6, color: 'var(--color-text)' }}>
                            <p style={{ fontWeight: 600, marginBottom: 4 }}>{order.shipping_address?.line1}</p>
                            {order.shipping_address?.line2 && <p>{order.shipping_address?.line2}</p>}
                            <p>{order.shipping_address?.city}, {order.shipping_address?.district}</p>
                            <p>{order.shipping_address?.postal_code}</p>
                        </div>
                    </div>

                    {/* Payment Info */}
                    <div className="card" style={{ padding: 24 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                            <CreditCard size={18} style={{ color: 'var(--color-primary)' }} />
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--color-text)' }}>Payment</h3>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <p style={{ color: 'var(--color-text-muted)' }}>Status</p>
                            <span style={{
                                fontSize: '0.75rem', fontWeight: 700, padding: '4px 12px', borderRadius: 'var(--radius-sm)',
                                backgroundColor: 'var(--color-success-bg)', color: 'var(--color-success)'
                            }}>
                                {order.payment_status || 'PAID'}
                            </span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
