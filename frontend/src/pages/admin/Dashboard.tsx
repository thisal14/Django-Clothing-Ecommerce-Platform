import { useEffect, useState } from 'react';
import { Package, ShoppingCart, Users, DollarSign, TrendingUp } from 'lucide-react';
import { analyticsApi } from '@/api';
import type { DashboardMetrics } from '@/types';
import toast from 'react-hot-toast';

export default function Dashboard() {
    const [metricsData, setMetricsData] = useState<DashboardMetrics | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const { data } = await analyticsApi.getDashboard();
                setMetricsData(data);
            } catch (error) {
                toast.error('Failed to load dashboard metrics');
            } finally {
                setLoading(false);
            }
        };
        fetchDashboard();
    }, []);

    const metrics = [
        { title: 'Total Revenue', value: `LKR ${metricsData?.total_revenue.toLocaleString() || '0'}`, icon: DollarSign, trend: `Last 30 days: LKR ${metricsData?.monthly_revenue.toLocaleString() || '0'}` },
        { title: 'New Orders', value: `+${metricsData?.pending_orders || '0'}`, icon: ShoppingCart, trend: `${metricsData?.processing_orders || '0'} currently processing` },
        { title: 'Active Products', value: metricsData?.total_products.toString() || '0', icon: Package, trend: 'Published in store' },
        { title: 'Total Customers', value: metricsData?.total_customers.toString() || '0', icon: Users, trend: `+${metricsData?.new_customers_30d || '0'} new this month` },
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', color: 'var(--color-text)' }}>Dashboard Overview</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                    <TrendingUp size={16} />
                    <span>Live analytics active</span>
                </div>
            </div>

            {/* Metrics Grid */}
            <div style={{ display: 'grid', gap: 24, gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
                {metrics.map((metric) => {
                    const Icon = metric.icon;
                    return (
                        <div key={metric.title} className="card" style={{ padding: 24 }}>
                            {loading ? (
                                <div className="skeleton" style={{ height: 120, width: '100%' }} />
                            ) : (
                                <>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                                        <h3 style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                            {metric.title}
                                        </h3>
                                        <div style={{ color: 'var(--color-primary)', backgroundColor: 'var(--color-surface-2)', padding: 8, borderRadius: 'var(--radius-sm)' }}>
                                            <Icon size={20} />
                                        </div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '2rem', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--color-text)', lineHeight: 1.2 }}>{metric.value}</div>
                                        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: 8, fontWeight: 500 }}>
                                            {metric.trend}
                                        </p>
                                    </div>
                                </>
                            )}
                        </div>
                    );
                })}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 32 }}>
                {/* Recent Activity */}
                <div className="card" style={{ padding: 0 }}>
                    <div style={{ padding: 24, borderBottom: '1px solid var(--color-border)' }}>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 600, fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>Recent Performance</h3>
                    </div>
                    {loading ? (
                        <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
                            <div className="skeleton" style={{ height: 48, borderRadius: 'var(--radius-sm)' }}></div>
                            <div className="skeleton" style={{ height: 48, borderRadius: 'var(--radius-sm)' }}></div>
                            <div className="skeleton" style={{ height: 48, borderRadius: 'var(--radius-sm)' }}></div>
                        </div>
                    ) : (
                        <div style={{ padding: '0 24px' }}>
                            {metricsData?.daily_sales.length === 0 ? (
                                <p style={{ padding: '40px 0', textAlign: 'center', color: 'var(--color-text-muted)' }}>No recent sales data available.</p>
                            ) : (
                                metricsData?.daily_sales.map((day, idx) => (
                                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 0', borderBottom: idx === metricsData.daily_sales.length - 1 ? 'none' : '1px solid var(--color-border)' }}>
                                        <div>
                                            <div style={{ fontWeight: 600, color: 'var(--color-text)' }}>{new Date(day.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{day.orders} orders fulfilled</div>
                                        </div>
                                        <div style={{ fontWeight: 700, color: 'var(--color-primary)' }}>LKR {day.revenue.toLocaleString()}</div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>

                {/* Top Products */}
                <div className="card" style={{ padding: 0 }}>
                    <div style={{ padding: 24, borderBottom: '1px solid var(--color-border)' }}>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 600, fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>Best Sellers</h3>
                    </div>
                    {loading ? (
                        <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
                            <div className="skeleton" style={{ height: 60, borderRadius: 'var(--radius-sm)' }}></div>
                            <div className="skeleton" style={{ height: 60, borderRadius: 'var(--radius-sm)' }}></div>
                        </div>
                    ) : (
                        <div style={{ padding: '0 24px' }}>
                            {metricsData?.top_products.length === 0 ? (
                                <p style={{ padding: '40px 0', textAlign: 'center', color: 'var(--color-text-muted)' }}>No product data yet.</p>
                            ) : (
                                metricsData?.top_products.map((product, idx) => (
                                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '20px 0', borderBottom: idx === metricsData.top_products.length - 1 ? 'none' : '1px solid var(--color-border)' }}>
                                        <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--color-surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'var(--color-primary)', fontSize: '0.9rem' }}>
                                            {idx + 1}
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontWeight: 600, color: 'var(--color-text)', fontSize: '0.95rem' }}>{product.name}</div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{product.order_count} units sold</div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

