import { useEffect, useState, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '@/store';
import { logoutThunk } from '@/store/authSlice';
import { openDrawer } from '@/store/cartSlice';

export default function Navbar() {
    const dispatch = useDispatch<AppDispatch>();
    const { isAuthenticated, user } = useSelector((s: RootState) => s.auth);
    const { cart } = useSelector((s: RootState) => s.cart);
    const location = useLocation();

    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Close menu on route change
    useEffect(() => { setMenuOpen(false); }, [location]);

    // Close menu when clicking outside
    useEffect(() => {
        if (!menuOpen) return;
        const handler = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [menuOpen]);

    // Lock body scroll when menu open
    useEffect(() => {
        document.body.style.overflow = menuOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [menuOpen]);

    useEffect(() => {
        const handler = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handler, { passive: true });
        return () => window.removeEventListener('scroll', handler);
    }, []);

    // Active-link helpers (category-aware)
    const isCategoryActive = (cat: string) => {
        const params = new URLSearchParams(location.search);
        return location.pathname === '/products' && params.get('category') === cat;
    };
    const isNewArrivalsActive = () => {
        const params = new URLSearchParams(location.search);
        return location.pathname === '/products' && params.get('is_new_arrival') === 'true';
    };
    const isShopActive = () => {
        const params = new URLSearchParams(location.search);
        return location.pathname === '/products' && !params.has('category') && !params.has('is_new_arrival');
    };

    const navLinks = [
        { label: 'Home', to: '/', isActive: () => location.pathname === '/' },
        { label: 'Shop', to: '/products', isActive: isShopActive },
        { label: 'Men', to: '/products?category=men', isActive: () => isCategoryActive('men') },
        { label: 'Women', to: '/products?category=women', isActive: () => isCategoryActive('women') },
        { label: 'New Arrivals', to: '/products?is_new_arrival=true', isActive: isNewArrivalsActive },
    ];

    return (
        <nav className={`navbar${scrolled ? ' scrolled' : ''}`} ref={menuRef}>
            <div className="container">
                <div className="navbar__inner">

                    {/* Logo */}
                    <Link to="/" className="navbar__logo">In Sri Lanka</Link>

                    {/* Desktop nav */}
                    <ul className="navbar__nav">
                        {navLinks.map((l) => (
                            <li key={l.label}>
                                <Link to={l.to} className={l.isActive() ? 'active' : ''}>
                                    {l.label}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    {/* Actions (always visible) */}
                    <div className="navbar__actions">
                        {/* Cart */}
                        <button
                            className="navbar__icon-btn"
                            onClick={() => dispatch(openDrawer())}
                            aria-label="Open cart"
                        >
                            <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                                <line x1="3" y1="6" x2="21" y2="6" />
                                <path d="M16 10a4 4 0 0 1-8 0" />
                            </svg>
                            {cart && cart.item_count > 0 && (
                                <span className="navbar__badge">{cart.item_count}</span>
                            )}
                        </button>

                        {/* Desktop-only auth buttons */}
                        <div className="navbar__auth-desktop">
                            {isAuthenticated ? (
                                <>
                                    {(user?.role === 'ADMIN' || user?.role === 'STAFF') && (
                                        <Link to="/admin" className="btn btn-sm btn-outline">Dashboard</Link>
                                    )}
                                    <Link to="/orders" className="navbar__icon-btn" aria-label="Orders">
                                        <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                                            <path d="M9 11l3 3L22 4" />
                                            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                                        </svg>
                                    </Link>
                                    <button className="btn btn-sm btn-primary" onClick={() => dispatch(logoutThunk())}>
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" className="btn btn-sm btn-outline">Login</Link>
                                    <Link to="/register" className="btn btn-sm btn-primary">Sign Up</Link>
                                </>
                            )}
                        </div>

                        {/* Hamburger — mobile only */}
                        <button
                            className="navbar__hamburger"
                            onClick={() => setMenuOpen((o) => !o)}
                            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                            aria-expanded={menuOpen}
                        >
                            {/* Animated 3-bar → X */}
                            <span className={`hamburger-line hamburger-line--top${menuOpen ? ' open' : ''}`} />
                            <span className={`hamburger-line hamburger-line--mid${menuOpen ? ' open' : ''}`} />
                            <span className={`hamburger-line hamburger-line--bot${menuOpen ? ' open' : ''}`} />
                        </button>
                    </div>
                </div>
            </div>

            {/* ── Mobile menu drawer ───────────────────────────────────── */}
            <div className={`mobile-menu${menuOpen ? ' mobile-menu--open' : ''}`} aria-hidden={!menuOpen}>
                <ul className="mobile-menu__nav">
                    {navLinks.map((l) => (
                        <li key={l.label}>
                            <Link
                                to={l.to}
                                className={`mobile-menu__link${l.isActive() ? ' active' : ''}`}
                                onClick={() => setMenuOpen(false)}
                            >
                                {l.label}
                            </Link>
                        </li>
                    ))}
                </ul>

                <div className="mobile-menu__auth">
                    {isAuthenticated ? (
                        <>
                            <Link to="/orders" className="btn btn-outline w-full" onClick={() => setMenuOpen(false)}>
                                My Orders
                            </Link>
                            {(user?.role === 'ADMIN' || user?.role === 'STAFF') && (
                                <Link to="/admin" className="btn btn-outline w-full" onClick={() => setMenuOpen(false)}>
                                    Dashboard
                                </Link>
                            )}
                            <button
                                className="btn btn-primary w-full"
                                onClick={() => { dispatch(logoutThunk()); setMenuOpen(false); }}
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="btn btn-outline w-full" onClick={() => setMenuOpen(false)}>Login</Link>
                            <Link to="/register" className="btn btn-primary w-full" onClick={() => setMenuOpen(false)}>Sign Up</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
