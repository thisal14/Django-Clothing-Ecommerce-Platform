import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import type { AppDispatch, RootState } from '@/store';
import { loginThunk } from '@/store/authSlice';
import toast from 'react-hot-toast';

export default function Login() {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const location = useLocation();
    const { isLoading } = useSelector((s: RootState) => s.auth);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const from = (location.state as any)?.from?.pathname || '/';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await dispatch(loginThunk({ email, password })).unwrap();
            toast.success('Welcome back!');
            navigate(from, { replace: true });
        } catch (err: any) {
            console.error('Login error:', err);
            toast.error(err.detail || err.message || 'Invalid email or password');
        }
    };

    return (
        <>
            <Helmet>
                <title>Login | In Sri Lanka</title>
            </Helmet>

            <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px var(--content-pad)' }}>
                <div className="card" style={{ width: '100%', maxWidth: 450, padding: 48 }}>
                    <div style={{ textAlign: 'center', marginBottom: 40 }}>
                        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', marginBottom: 12 }}>Welcome Back</h1>
                        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Please enter your details to sign in.</p>
                    </div>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                        <div className="form-group">
                            <label className="form-label">Email Address</label>
                            <input
                                type="email"
                                className="form-input"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@example.com"
                            />
                        </div>

                        <div className="form-group">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <label className="form-label">Password</label>
                                <Link to="/forgot-password" style={{ fontSize: '0.8rem', color: 'var(--color-primary)' }}>Forgot?</Link>
                            </div>
                            <input
                                type="password"
                                className="form-input"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                            />
                        </div>

                        <button className="btn btn-primary w-full btn-lg" disabled={isLoading} style={{ marginTop: 12 }}>
                            {isLoading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>

                    <div style={{ textAlign: 'center', marginTop: 32, fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                        Don't have an account? <Link to="/register" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>Sign Up</Link>
                    </div>
                </div>
            </div>
        </>
    );
}
