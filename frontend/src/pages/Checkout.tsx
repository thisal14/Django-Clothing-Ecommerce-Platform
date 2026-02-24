import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import type { RootState, AppDispatch } from '@/store';
import { ordersApi } from '@/api';
import { fetchCartThunk } from '@/store/cartSlice';
import toast from 'react-hot-toast';
import { Helmet } from 'react-helmet-async';

const LKR = (n: number) =>
    new Intl.NumberFormat('si-LK', { style: 'currency', currency: 'LKR', maximumFractionDigits: 0 }).format(n);

export default function Checkout() {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const { cart } = useSelector((s: RootState) => s.cart);
    const { user } = useSelector((s: RootState) => s.auth);

    const [step] = useState(1);
    const [isProcessing, setIsProcessing] = useState(false);

    const [formData, setFormData] = useState({
        full_name: `${user?.first_name ?? ''} ${user?.last_name ?? ''}`.trim(),
        phone: user?.phone ?? '',
        line1: '',
        line2: '',
        city: '',
        district: 'Colombo',
        postal_code: '',
        notes: '',
        shipping_method: 'standard'
    });

    useEffect(() => {
        if (!cart || cart.items.length === 0) {
            navigate('/cart');
        }
    }, [cart, navigate]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmitOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);
        try {
            const orderData = {
                shipping_address: {
                    full_name: formData.full_name,
                    phone: formData.phone,
                    line1: formData.line1,
                    line2: formData.line2,
                    city: formData.city,
                    district: formData.district,
                    postal_code: formData.postal_code,
                },
                shipping_method_id: 'standard', // Mocked for simplicity
                notes: formData.notes
            };

            const { data } = await ordersApi.createOrder(orderData);
            toast.success('Order placed successfully!');
            dispatch(fetchCartThunk());
            navigate(`/order/${data.id}/thank-you`);
        } catch (error: any) {
            toast.error(error.response?.data?.detail ?? 'Failed to place order');
        } finally {
            setIsProcessing(false);
        }
    };

    if (!cart) return null;

    return (
        <>
            <Helmet>
                <title>Secure Checkout | In Sri Lanka</title>
            </Helmet>

            <div className="container" style={{ padding: '60px var(--content-pad)' }}>
                <h1 style={{ marginBottom: 48 }}>Checkout</h1>

                <div className="checkout-steps">
                    <div className={`checkout-step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
                        <div className="checkout-step__num">{step > 1 ? '✓' : '1'}</div>
                        <span>Shipping</span>
                    </div>
                    <div className="checkout-step__line" />
                    <div className={`checkout-step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
                        <div className="checkout-step__num">{step > 2 ? '✓' : '2'}</div>
                        <span>Payment</span>
                    </div>
                    <div className="checkout-step__line" />
                    <div className={`checkout-step ${step >= 3 ? 'active' : ''}`}>
                        <div className="checkout-step__num">3</div>
                        <span>Review</span>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: 60, alignItems: 'flex-start' }}>

                    <form onSubmit={handleSubmitOrder} style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
                        <div className="card" style={{ padding: 40 }}>
                            <h3 style={{ marginBottom: 32 }}>Shipping Information</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                    <label className="form-label">Full Name</label>
                                    <input name="full_name" className="form-input" required value={formData.full_name} onChange={handleInputChange} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Phone Number</label>
                                    <input name="phone" className="form-input" required value={formData.phone} onChange={handleInputChange} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">District</label>
                                    <select name="district" className="form-input" value={formData.district} onChange={handleInputChange}>
                                        <option value="Colombo">Colombo</option>
                                        <option value="Gampaha">Gampaha</option>
                                        <option value="Kalutara">Kalutara</option>
                                        <option value="Kandy">Kandy</option>
                                        {/* ... more districts ... */}
                                    </select>
                                </div>
                                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                    <label className="form-label">Address Line 1</label>
                                    <input name="line1" className="form-input" required placeholder="House number and street name" value={formData.line1} onChange={handleInputChange} />
                                </div>
                                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                    <label className="form-label">Address Line 2 (Optional)</label>
                                    <input name="line2" className="form-input" placeholder="Apartment, suite, unit, etc." value={formData.line2} onChange={handleInputChange} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">City</label>
                                    <input name="city" className="form-input" required value={formData.city} onChange={handleInputChange} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Postal Code</label>
                                    <input name="postal_code" className="form-input" required value={formData.postal_code} onChange={handleInputChange} />
                                </div>
                            </div>
                        </div>

                        <div className="card" style={{ padding: 40 }}>
                            <h3 style={{ marginBottom: 32 }}>Payment Method</h3>
                            <div style={{ padding: 20, border: '2px solid var(--color-primary)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: 16 }}>
                                <div style={{ width: 24, height: 24, borderRadius: '50%', border: '6px solid var(--color-primary)' }} />
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 600 }}>Cash on Delivery</div>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Pay when your order is delivered to your doorstep.</div>
                                </div>
                                <svg width="40" height="24" viewBox="0 0 40 24" fill="none">
                                    <rect width="40" height="24" rx="4" fill="#F5F4F0" />
                                    <path d="M12 8H28M12 12H28M12 16H20" stroke="#9E9488" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Link to="/cart" className="btn btn-ghost">← Back to Bag</Link>
                            <button type="submit" className="btn btn-primary btn-lg" disabled={isProcessing}>
                                {isProcessing ? 'Processing...' : 'Place Order'}
                            </button>
                        </div>
                    </form>

                    {/* Summary Sidebar */}
                    <div className="card" style={{ padding: 0, position: 'sticky', top: 120 }}>
                        <div style={{ padding: 32, borderBottom: '1px solid var(--color-border)' }}>
                            <h3 style={{ marginBottom: 24 }}>In Your Bag ({cart.item_count})</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                {cart.items.map(item => (
                                    <div key={item.id} style={{ display: 'flex', gap: 12 }}>
                                        <div style={{ width: 48, height: 60, borderRadius: 4, background: 'var(--color-surface-2)', overflow: 'hidden', flexShrink: 0 }}>
                                            <img src={`/media/products/${item.product_slug}.jpg`} alt="" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        </div>
                                        <div style={{ flex: 1, fontSize: '0.85rem' }}>
                                            <div style={{ fontWeight: 600, color: 'var(--color-text)' }}>{item.product_name}</div>
                                            <div style={{ color: 'var(--color-text-muted)' }}>Qty: {item.quantity} · {item.variant.attributes[0]?.value}</div>
                                        </div>
                                        <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{LKR(item.line_total)}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div style={{ padding: 32, background: 'var(--color-surface-2)' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span>Subtotal</span>
                                    <span>{LKR(cart.total)}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span>Shipping</span>
                                    <span>{LKR(450)}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 700, marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--color-border)' }}>
                                    <span>Total</span>
                                    <span>{LKR(cart.total + 450)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}
