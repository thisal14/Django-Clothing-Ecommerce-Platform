
import { Package, ShoppingCart, Users, DollarSign } from 'lucide-react';

export default function Dashboard() {
    // In a real app, these would come from an API
    const metrics = [
        { title: 'Total Revenue', value: 'LKR 45,231.89', icon: DollarSign, trend: '+20.1% from last month' },
        { title: 'New Orders', value: '+235', icon: ShoppingCart, trend: '+180.1% from last month' },
        { title: 'Active Products', value: '1,203', icon: Package, trend: '+19 added this week' },
        { title: 'Total Customers', value: '2,300', icon: Users, trend: '+30 this week' },
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', color: 'var(--color-text)' }}>Dashboard Overview</h2>
            </div>

            {/* Metrics Grid */}
            <div style={{ display: 'grid', gap: 24, gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
                {metrics.map((metric) => {
                    const Icon = metric.icon;
                    return (
                        <div key={metric.title} className="card" style={{ padding: 24 }}>
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
                                <p style={{ fontSize: '0.85rem', color: 'var(--color-success)', marginTop: 8, fontWeight: 500 }}>
                                    {metric.trend}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Recent Activity Placeholder */}
            <div className="card" style={{ padding: 24, minHeight: 400 }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 600, fontFamily: 'var(--font-display)', color: 'var(--color-text)', marginBottom: 24 }}>Recent Orders Activity</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div className="skeleton" style={{ height: 48, borderRadius: 'var(--radius-sm)' }}></div>
                    <div className="skeleton" style={{ height: 48, borderRadius: 'var(--radius-sm)' }}></div>
                    <div className="skeleton" style={{ height: 48, borderRadius: 'var(--radius-sm)' }}></div>
                    <div className="skeleton" style={{ height: 48, borderRadius: 'var(--radius-sm)' }}></div>
                </div>
                <p style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--color-text-light)', marginTop: 32 }}>Connecting to live order stream...</p>
            </div>
        </div>
    );
}
