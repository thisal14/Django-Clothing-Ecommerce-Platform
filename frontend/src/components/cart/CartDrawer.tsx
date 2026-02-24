import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import type { RootState, AppDispatch } from '@/store';
import { closeDrawer, updateCartItemThunk, removeCartItemThunk } from '@/store/cartSlice';

const LKR = (n: number) =>
    new Intl.NumberFormat('si-LK', { style: 'currency', currency: 'LKR', maximumFractionDigits: 0 }).format(n);

export default function CartDrawer() {
    const dispatch = useDispatch<AppDispatch>();
    const { cart, isDrawerOpen, isLoading } = useSelector((s: RootState) => s.cart);

    if (!isDrawerOpen) return null;

    return (
        <div className="cart-overlay" onClick={() => dispatch(closeDrawer())}>
            <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
                <div className="cart-drawer__header">
                    <h2 className="cart-drawer__title">Bag ({cart?.item_count ?? 0})</h2>
                    <button className="navbar__icon-btn" onClick={() => dispatch(closeDrawer())} aria-label="Close cart">
                        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                <div className="cart-drawer__body">
                    {isLoading ? (
                        <div style={{ textAlign: 'center', padding: '40px 0' }}>
                            <div className="skeleton" style={{ width: 40, height: 40, borderRadius: '50%', margin: '0 auto 20px' }} />
                            <p style={{ color: 'var(--color-text-muted)' }}>Updating bag...</p>
                        </div>
                    ) : cart && cart.items.length > 0 ? (
                        cart.items.map((item) => (
                            <div key={item.id} className="cart-item">
                                <img
                                    src={item.variant.attributes[0]?.value ? `/media/products/${item.product_slug}.jpg` : 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=100&q=70'}
                                    alt={item.product_name}
                                    className="cart-item__image"
                                    loading="lazy"
                                />
                                <div className="cart-item__details">
                                    <Link to={`/products/${item.product_slug}`} className="cart-item__name" onClick={() => dispatch(closeDrawer())}>
                                        {item.product_name}
                                    </Link>
                                    <div className="cart-item__meta">
                                        {item.variant.attributes.map(a => `${a.attribute_name}: ${a.value}`).join(' / ')}
                                    </div>
                                    <div className="cart-item__qty">
                                        <button
                                            className="qty-btn"
                                            onClick={() => dispatch(updateCartItemThunk({ itemId: item.id, quantity: item.quantity - 1 }))}
                                            disabled={item.quantity <= 1}
                                        >
                                            −
                                        </button>
                                        <span>{item.quantity}</span>
                                        <button
                                            className="qty-btn"
                                            onClick={() => dispatch(updateCartItemThunk({ itemId: item.id, quantity: item.quantity + 1 }))}
                                        >
                                            +
                                        </button>
                                        <button
                                            style={{ marginLeft: 'auto', fontSize: '0.8rem', color: 'var(--color-error)' }}
                                            onClick={() => dispatch(removeCartItemThunk(item.id))}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                                <div style={{ fontWeight: 600 }}>{LKR(item.line_total)}</div>
                            </div>
                        ))
                    ) : (
                        <div style={{ textAlign: 'center', padding: '60px 0' }}>
                            <p style={{ color: 'var(--color-text-muted)', marginBottom: 24 }}>Your bag is empty</p>
                            <Link to="/products" className="btn btn-primary btn-sm" onClick={() => dispatch(closeDrawer())}>
                                Start Shopping
                            </Link>
                        </div>
                    )}
                </div>

                {cart && cart.items.length > 0 && (
                    <div className="cart-drawer__footer">
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20, fontSize: '1.1rem', fontWeight: 600 }}>
                            <span>Subtotal</span>
                            <span>{LKR(cart.total)}</span>
                        </div>
                        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: 24 }}>
                            Shipping and taxes calculated at checkout.
                        </p>
                        <Link to="/checkout" className="btn btn-primary w-full" onClick={() => dispatch(closeDrawer())}>
                            Checkout
                        </Link>
                        <Link to="/cart" className="btn btn-outline w-full" style={{ marginTop: 12 }} onClick={() => dispatch(closeDrawer())}>
                            View Bag
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
