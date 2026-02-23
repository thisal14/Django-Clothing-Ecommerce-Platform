import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useParams } from 'react-router-dom';

export default function OrderConfirmation() {
    useParams<{ id: string }>();

    useEffect(() => { window.scrollTo(0, 0); }, []);

    return (
        <>
            <Helmet><title>Order Confirmed | In Sri Lanka</title></Helmet>
            <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 24px' }}>
                <div style={{ textAlign: 'center', maxWidth: 520 }}>
                    <div style={{ fontSize: '4rem', marginBottom: 20 }}>🎉</div>
                    <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', marginBottom: 16 }}>Thank You!</h1>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '1rem', lineHeight: 1.7, marginBottom: 32 }}>
                        Your order has been placed successfully. We'll send you a confirmation email shortly.
                        Delivery typically takes 3–5 working days across Sri Lanka.
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
                        <Link to="/orders" className="btn btn-outline">Track Order</Link>
                        <Link to="/products" className="btn btn-primary">Continue Shopping</Link>
                    </div>
                </div>
            </div>
        </>
    );
}
