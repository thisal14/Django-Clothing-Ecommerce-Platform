import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import type { AppDispatch, RootState } from '@/store';
import { registerThunk } from '@/store/authSlice';
import toast from 'react-hot-toast';

export default function Register() {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { isLoading } = useSelector((s: RootState) => s.auth);

    const [formData, setFormData] = useState({
        email: '',
        first_name: '',
        last_name: '',
        phone: '',
        password: '',
        confirm_password: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.password !== formData.confirm_password) {
            return toast.error('Passwords do not match');
        }

        try {
            await dispatch(registerThunk(formData)).unwrap();
            toast.success('Account created! Please login.');
            navigate('/login');
        } catch (err: any) {
            toast.error(err.detail || 'Registration failed');
        }
    };

    return (
        <>
            <Helmet>
                <title>Create Account | In Sri Lanka</title>
            </Helmet>

            <div style={{ minHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px var(--content-pad)' }}>
                <div className="card" style={{ width: '100%', maxWidth: 550, padding: 48 }}>
                    <div style={{ textAlign: 'center', marginBottom: 40 }}>
                        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', marginBottom: 12 }}>Join the Island</h1>
                        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Create your account to start shopping.</p>
                    </div>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                            <div className="form-group">
                                <label className="form-label">First Name</label>
                                <input name="first_name" className="form-input" required value={formData.first_name} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Last Name</label>
                                <input name="last_name" className="form-input" required value={formData.last_name} onChange={handleChange} />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Email Address</label>
                            <input type="email" name="email" className="form-input" required value={formData.email} onChange={handleChange} />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Phone Number</label>
                            <input type="tel" name="phone" className="form-input" required value={formData.phone} onChange={handleChange} placeholder="+94 77 123 4567" />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                            <div className="form-group">
                                <label className="form-label">Password</label>
                                <input type="password" name="password" className="form-input" required value={formData.password} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Confirm Password</label>
                                <input type="password" name="confirm_password" className="form-input" required value={formData.confirm_password} onChange={handleChange} />
                            </div>
                        </div>

                        <button className="btn btn-primary w-full btn-lg" disabled={isLoading} style={{ marginTop: 12 }}>
                            {isLoading ? 'Creating account...' : 'Create Account'}
                        </button>
                    </form>

                    <div style={{ textAlign: 'center', marginTop: 32, fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                        Already have an account? <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>Log In</Link>
                    </div>
                </div>
            </div>
        </>
    );
}
