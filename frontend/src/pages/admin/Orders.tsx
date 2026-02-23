import { useEffect, useState } from 'react';
import { adminApi } from '@/api';
import type { Order } from '@/types';
import { Eye } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminOrders() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const { data } = await adminApi.getOrders({ page_size: 100 });
            setOrders(data.results);
        } catch (error) {
            toast.error('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleStatusChange = async (id: string, newStatus: string) => {
        try {
            await adminApi.updateOrderStatus(id, newStatus);
            toast.success('Order status updated');
            fetchOrders();
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PENDING': return { bg: 'var(--color-warning-bg)', text: 'var(--color-warning)' };
            case 'PROCESSING': return { bg: '#EBF8FF', text: '#2B6CB0' }; // Custom blue
            case 'SHIPPED': return { bg: '#FAF5FF', text: '#6B46C1' };     // Custom purple
            case 'DELIVERED': return { bg: 'var(--color-success-bg)', text: 'var(--color-success)' };
            case 'CANCELLED': return { bg: 'var(--color-error-bg)', text: 'var(--color-error)' };
            default: return { bg: 'var(--color-surface-2)', text: 'var(--color-text-muted)' };
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', color: 'var(--color-text)' }}>Orders Management</h2>
            </div>

            <div className="card" style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                    <thead style={{ backgroundColor: 'var(--color-surface-2)', borderBottom: '1px solid var(--color-border)' }}>
                        <tr>
                            <th style={{ padding: '16px 24px', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em' }}>Order ID</th>
                            <th style={{ padding: '16px 24px', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em' }}>Customer Info</th>
                            <th style={{ padding: '16px 24px', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em' }}>Date</th>
                            <th style={{ padding: '16px 24px', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em' }}>Total</th>
                            <th style={{ padding: '16px 24px', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em' }}>Status</th>
                            <th style={{ padding: '16px 24px', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em', textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={6} style={{ padding: '32px 24px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                                    Loading orders...
                                </td>
                            </tr>
                        ) : orders.length === 0 ? (
                            <tr>
                                <td colSpan={6} style={{ padding: '32px 24px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                                    No orders found.
                                </td>
                            </tr>
                        ) : (
                            orders.map((order) => {
                                const statusColors = getStatusColor(order.status);
                                return (
                                    <tr key={order.id} style={{ borderBottom: '1px solid var(--color-border)', transition: 'background-color var(--transition-fast)' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-surface-2)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                                        <td style={{ padding: '16px 24px', fontWeight: 600, color: 'var(--color-text)' }}>
                                            #{order.order_number}
                                        </td>
                                        <td style={{ padding: '16px 24px' }}>
                                            <div style={{ color: 'var(--color-text)', fontWeight: 500 }}>{order.shipping_address?.full_name}</div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: 2 }}>{order.shipping_address?.phone}</div>
                                        </td>
                                        <td style={{ padding: '16px 24px', color: 'var(--color-text-muted)' }}>
                                            {new Date(order.created_at).toLocaleDateString()}
                                        </td>
                                        <td style={{ padding: '16px 24px', fontWeight: 600, color: 'var(--color-text)' }}>
                                            LKR {order.grand_total}
                                        </td>
                                        <td style={{ padding: '16px 24px' }}>
                                            <select
                                                value={order.status}
                                                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                                style={{
                                                    fontSize: '0.75rem', fontWeight: 600, padding: '4px 12px', borderRadius: 'var(--radius-full)',
                                                    border: '1px solid transparent', cursor: 'pointer', outline: 'none',
                                                    backgroundColor: statusColors.bg, color: statusColors.text, appearance: 'none'
                                                }}
                                            >
                                                <option value="PENDING">PENDING</option>
                                                <option value="PROCESSING">PROCESSING</option>
                                                <option value="SHIPPED">SHIPPED</option>
                                                <option value="DELIVERED">DELIVERED</option>
                                                <option value="CANCELLED">CANCELLED</option>
                                            </select>
                                        </td>
                                        <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                                            <button
                                                style={{ color: 'var(--color-primary)', transition: 'all var(--transition-fast)', padding: 8, borderRadius: 'var(--radius-sm)' }}
                                                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--color-surface-2)'; e.currentTarget.style.color = 'var(--color-primary-dark)' }}
                                                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--color-primary)' }}
                                            >
                                                <Eye size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
