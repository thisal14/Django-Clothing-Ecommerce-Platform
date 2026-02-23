
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, Users, LogOut } from 'lucide-react';
import { useAppDispatch } from '@/store/hooks';
import { logoutThunk } from '@/store/authSlice';

export default function AdminLayout() {
    const location = useLocation();
    const dispatch = useAppDispatch();

    const navigation = [
        { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Products', href: '/admin/products', icon: Package },
        { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
        { name: 'Users', href: '/admin/users', icon: Users },
    ];

    const handleLogout = async () => {
        try {
            await dispatch(logoutThunk());
        } catch (error) {
            console.error('Logout failed', error);
        }
    };

    return (
        <div style={{ display: 'flex', height: '100vh', backgroundColor: 'var(--color-background)', WebkitFontSmoothing: 'antialiased' }}>
            {/* Sidebar */}
            <aside style={{ width: 260, backgroundColor: 'var(--color-surface)', borderRight: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column' }} className="hidden md:flex">
                <div style={{ padding: '24px', borderBottom: '1px solid var(--color-border)' }}>
                    <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--color-primary)', fontWeight: 700, marginBottom: 4 }}>In Sri Lanka</h1>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>Admin Panel</span>
                </div>

                <nav style={{ flex: 1, padding: '16px', display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {navigation.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname.startsWith(item.href);
                        return (
                            <Link
                                key={item.name}
                                to={item.href}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 'var(--radius-sm)',
                                    backgroundColor: isActive ? 'var(--color-primary)' : 'transparent',
                                    color: isActive ? '#fff' : 'var(--color-text-muted)',
                                    fontWeight: isActive ? 600 : 500,
                                    transition: 'all var(--transition-fast)'
                                }}
                                onMouseEnter={(e) => {
                                    if (!isActive) {
                                        e.currentTarget.style.backgroundColor = 'var(--color-surface-2)';
                                        e.currentTarget.style.color = 'var(--color-primary)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!isActive) {
                                        e.currentTarget.style.backgroundColor = 'transparent';
                                        e.currentTarget.style.color = 'var(--color-text-muted)';
                                    }
                                }}
                            >
                                <Icon size={20} />
                                <span>{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div style={{ padding: '16px', borderTop: '1px solid var(--color-border)' }}>
                    <button
                        onClick={handleLogout}
                        style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', padding: '12px 16px', borderRadius: 'var(--radius-sm)', color: 'var(--color-error)', fontWeight: 500, transition: 'all var(--transition-fast)' }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'var(--color-error-bg)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                    >
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                    <div style={{ marginTop: 16, textAlign: 'center' }}>
                        <Link to="/" style={{ fontSize: '0.85rem', color: 'var(--color-text-light)' }}>
                            <span style={{ borderBottom: '1px solid currentColor' }}>Return to Store</span>
                        </Link>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main style={{ flex: 1, overflowY: 'auto' }}>
                <div style={{ padding: '40px' }}>
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
