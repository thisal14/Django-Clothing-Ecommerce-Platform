import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import type { RootState } from '@/store';
import { Helmet } from 'react-helmet-async';

export default function Profile() {
    const { user } = useSelector((s: RootState) => s.auth);

    if (!user) return null;

    return (
        <>
            <Helmet>
                <title>My Account | In Sri Lanka</title>
            </Helmet>

            <div className="container" style={{ padding: '60px var(--content-pad)' }}>
                <div style={{ maxWidth: 800, margin: '0 auto' }}>

                    <div className="section-header" style={{ textAlign: 'left', marginBottom: 60 }}>
                        <h1 className="section-title">My Account</h1>
                        <p className="section-subtitle" style={{ marginLeft: 0 }}>Welcome back, {user.first_name}!</p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 32 }}>

                        {/* Personal Info */}
                        <div className="card" style={{ padding: 32 }}>
                            <h3 style={{ marginBottom: 24, fontSize: '1.2rem' }}>Personal Profile</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                                <div>
                                    <div className="form-label">Full Name</div>
                                    <div style={{ fontWeight: 500 }}>{user.first_name} {user.last_name}</div>
                                </div>
                                <div>
                                    <div className="form-label">Email Address</div>
                                    <div style={{ fontWeight: 500 }}>{user.email}</div>
                                </div>
                                <div>
                                    <div className="form-label">Phone Number</div>
                                    <div style={{ fontWeight: 500 }}>{user.phone || 'Not provided'}</div>
                                </div>
                                <button className="btn btn-outline btn-sm" style={{ marginTop: 12 }}>Edit Profile</button>
                            </div>
                        </div>

                        {/* Recent Orders Shortcut */}
                        <div className="card" style={{ padding: 32 }}>
                            <h3 style={{ marginBottom: 24, fontSize: '1.2rem' }}>Recent Orders</h3>
                            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: 24 }}>
                                View your order history, track shipments, and request returns.
                            </p>
                            <Link to="/orders" className="btn btn-primary btn-sm">View All Orders</Link>
                        </div>

                        {/* Addresses */}
                        <div className="card" style={{ padding: 32, gridColumn: 'span 1' }}>
                            <h3 style={{ marginBottom: 24, fontSize: '1.2rem' }}>Saved Addresses</h3>
                            <div style={{ padding: 20, border: '1.5px dashed var(--color-border)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                                <p style={{ color: 'var(--color-text-light)', fontSize: '0.85rem', marginBottom: 16 }}>No addresses saved yet.</p>
                                <button className="btn btn-ghost btn-sm">+ Add New</button>
                            </div>
                        </div>

                        {/* Account Settings */}
                        <div className="card" style={{ padding: 32 }}>
                            <h3 style={{ marginBottom: 24, fontSize: '1.2rem' }}>Account Security</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                <button className="btn btn-ghost btn-sm" style={{ justifyContent: 'flex-start', width: '100%', textAlign: 'left' }}>Change Password</button>
                                <button className="btn btn-ghost btn-sm" style={{ justifyContent: 'flex-start', width: '100%', textAlign: 'left', color: 'var(--color-error)' }}>Delete Account</button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}
