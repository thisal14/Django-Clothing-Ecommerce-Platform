import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer__top">
                    <div>
                        <div className="footer__brand-name">In Sri Lanka</div>
                        <p className="footer__tagline">
                            Authentic clothing inspired by the island's rich culture, vibrant colours,
                            and timeless elegance. Crafted with love from Sri Lanka.
                        </p>
                    </div>
                    <div>
                        <div className="footer__col-title">Shop</div>
                        <ul className="footer__links">
                            <li><Link to="/products">All Products</Link></li>
                            <li><Link to="/products?category=men">Men</Link></li>
                            <li><Link to="/products?category=women">Women</Link></li>
                            <li><Link to="/products?is_new_arrival=true">New Arrivals</Link></li>
                            <li><Link to="/products?on_sale=true">Sale</Link></li>
                        </ul>
                    </div>
                    <div>
                        <div className="footer__col-title">Customer</div>
                        <ul className="footer__links">
                            <li><Link to="/orders">Order Tracking</Link></li>
                            <li><Link to="/profile">My Account</Link></li>
                            <li><Link to="/returns">Returns & Exchanges</Link></li>
                            <li><Link to="/sizing">Size Guide</Link></li>
                            <li><Link to="/faq">FAQ</Link></li>
                        </ul>
                    </div>
                    <div>
                        <div className="footer__col-title">About</div>
                        <ul className="footer__links">
                            <li><Link to="/about">Our Story</Link></li>
                            <li><Link to="/sustainability">Sustainability</Link></li>
                            <li><Link to="/contact">Contact Us</Link></li>
                            <li><Link to="/careers">Careers</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="footer__bottom">
                    <span>© {new Date().getFullYear()} In Sri Lanka. All rights reserved.</span>
                    <span style={{ display: 'flex', gap: 20 }}>
                        <Link to="/privacy">Privacy Policy</Link>
                        <Link to="/terms">Terms of Service</Link>
                    </span>
                </div>
            </div>
        </footer>
    );
}
