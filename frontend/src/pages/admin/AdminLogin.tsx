import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import type { AppDispatch, RootState } from '@/store';
import { loginThunk } from '@/store/authSlice';
import toast from 'react-hot-toast';
import { ShieldAlert, LockKeyhole } from 'lucide-react';

export default function AdminLogin() {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const location = useLocation();
    const { user, isAuthenticated, isLoading } = useSelector((s: RootState) => s.auth);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const from = (location.state as any)?.from?.pathname || '/admin/dashboard';

    // If already authenticated and is admin, redirect to admin dashboard
    if (isAuthenticated && user && (user.role === 'ADMIN' || user.role === 'STAFF')) {
        return <Navigate to={from} replace />;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const loggedInUser = await dispatch(loginThunk({ email, password })).unwrap();
            if (loggedInUser.role === 'ADMIN' || loggedInUser.role === 'STAFF') {
                toast.success('Admin access granted.');
                navigate(from, { replace: true });
            } else {
                toast.error('Unauthorized access. Admin privileges required.');
                // We keep them logged in but they can't access admin
                navigate('/', { replace: true });
            }
        } catch (err: any) {
            console.error('Login error:', err);
            toast.error(err.detail || err.message || 'Invalid credentials');
        }
    };

    return (
        <>
            <Helmet>
                <title>Admin Login | In Sri Lanka</title>
            </Helmet>

            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--color-background)', padding: 'var(--content-pad)' }}>
                <div className="card" style={{ width: '100%', maxWidth: 450, padding: 48 }}>
                    <div style={{ textAlign: 'center', marginBottom: 40 }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 64, height: 64, borderRadius: '50%', backgroundColor: 'var(--color-primary)', color: 'white', marginBottom: 24, boxShadow: '0 4px 14px rgba(181, 69, 27, 0.35)' }}>
                            <LockKeyhole size={32} />
                        </div>
                        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', marginBottom: 8, color: 'var(--color-text)' }}>Admin Portal</h2>
                        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>Sign in with your staff operations account.</p>
                    </div>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                        <div className="form-group">
                            <label className="form-label">Email Address</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="form-input"
                                placeholder="admin@srilanka.com"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Password</label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="form-input"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="btn btn-primary w-full btn-lg"
                            style={{ padding: '16px', marginTop: 8 }}
                        >
                            {isLoading ? 'Authenticating...' : 'Sign In to Dashboard'}
                        </button>
                    </form>

                    <div style={{ marginTop: 32, paddingTop: 24, borderTop: '1px solid var(--color-border)', display: 'flex', gap: 12, alignItems: 'center', fontSize: '0.85rem', color: 'var(--color-warning)' }}>
                        <ShieldAlert size={28} />
                        <p>This is a restricted area. All activities are monitored. Unauthorized access is prohibited.</p>
                    </div>
                </div>
            </div>
        </>
    );
}
