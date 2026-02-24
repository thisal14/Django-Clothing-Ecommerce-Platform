import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import type { RootState, AppDispatch } from '@/store';
import { updateCartItemThunk, removeCartItemThunk } from '@/store/cartSlice';
import { Helmet } from 'react-helmet-async';

const LKR = (n: number) =>
    new Intl.NumberFormat('si-LK', { style: 'currency', currency: 'LKR', maximumFractionDigits: 0 }).format(n);

export default function Cart() {
    const dispatch = useDispatch<AppDispatch>();
    const { cart } = useSelector((s: RootState) => s.cart);

    return (
        <>
            <Helmet>
                <title>Shopping Bag | In Sri Lanka</title>
            </Helmet>

            <div className="container" style={{ padding: '60px var(--content-pad)' }}>
                <h1 style={{ marginBottom: 40 }}>Your Shopping Bag</h1>

                {!cart || cart.items.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '100px 0', background: 'var(--color-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                        <p style={{ fontSize: '1.2rem', color: 'var(--color-text-muted)', marginBottom: 24 }}>Your bag is currently empty.</p>
                        <Link to="/products" className="btn btn-primary">Start Shopping</Link>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 60, alignItems: 'flex-start' }}>

                        {/* Items List */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                            {cart.items.map((item) => (
                                <div key={item.id} className="card" style={{ display: 'flex', gap: 24, padding: 24, paddingRight: 32 }}>
                                    <img
                                        src={item.variant.attributes[0]?.value ? `/media/products/${item.product_slug}.jpg` : 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=200&q=70'}
                                        alt={item.product_name}
                                        loading="lazy"
                                        style={{ width: 140, height: 180, objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
                                    />
                                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                            <Link to={`/products/${item.product_slug}`} style={{ fontSize: '1.2rem', fontWeight: 600, fontFamily: 'var(--font-display)' }}>
                                                {item.product_name}
                                            </Link>
                                            <div style={{ fontWeight: 700 }}>{LKR(item.line_total)}</div>
                                        </div>
                                        <div style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: 20 }}>
                                            {item.variant.attributes.map(a => `${a.attribute_name}: ${a.value}`).join(' / ')}
                                        </div>

                                        <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <div className="cart-item__qty" style={{ margin: 0, padding: '6px 14px', border: '1.5px solid var(--color-border)', borderRadius: 'var(--radius-full)' }}>
                                                <button className="qty-btn" style={{ border: 'none' }} onClick={() => dispatch(updateCartItemThunk({ itemId: item.id, quantity: item.quantity - 1 }))} disabled={item.quantity <= 1}>−</button>
                                                <span style={{ minWidth: 20, textAlign: 'center' }}>{item.quantity}</span>
                                                <button className="qty-btn" style={{ border: 'none' }} onClick={() => dispatch(updateCartItemThunk({ itemId: item.id, quantity: item.quantity + 1 }))}>+</button>
                                            </div>
                                            <button
                                                style={{ color: 'var(--color-error)', fontSize: '0.85rem', fontWeight: 500 }}
                                                onClick={() => dispatch(removeCartItemThunk(item.id))}
                                            >
                                                Remove Item
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Order Summary */}
                        <div className="card" style={{ padding: 32, background: 'var(--color-background)', position: 'sticky', top: 120 }}>
                            <h3 style={{ marginBottom: 24 }}>Order Summary</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 32 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span>Subtotal</span>
                                    <span>{LKR(cart.total)}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span>Estimated Shipping</span>
                                    <span style={{ color: 'var(--color-success)' }}>Calculated at checkout</span>
                                </div>
                                <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 16, marginTop: 8, display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 700 }}>
                                    <span>Total</span>
                                    <span>{LKR(cart.total)}</span>
                                </div>
                            </div>
                            <Link to="/checkout" className="btn btn-primary w-full btn-lg">Checkout Now</Link>
                            <p style={{ textAlign: 'center', marginTop: 20, fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                                Secure Checkout Powered by Island Pay
                            </p>
                        </div>

                    </div>
                )}
            </div>
        </>
    );
}
