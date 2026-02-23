import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

export default function NotFound() {
    return (
        <>
            <Helmet><title>404 Not Found | In Sri Lanka</title></Helmet>
            <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 24px', textAlign: 'center' }}>
                <div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '8rem', fontWeight: 700, color: 'var(--color-border)', lineHeight: 1 }}>404</div>
                    <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', margin: '16px 0 12px' }}>Page Not Found</h1>
                    <p style={{ color: 'var(--color-text-muted)', marginBottom: 32 }}>The page you're looking for doesn't exist or has been moved.</p>
                    <Link to="/" className="btn btn-primary">Return Home</Link>
                </div>
            </div>
        </>
    );
}
