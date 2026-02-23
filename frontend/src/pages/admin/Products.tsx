import { Helmet } from 'react-helmet-async';
export default function AdminProducts() {
    return (
        <>
            <Helmet><title>Manage Products | Admin</title></Helmet>
            <div className="container" style={{ padding: '60px var(--content-pad)' }}>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem' }}>Manage Products</h1>
                <p style={{ color: 'var(--color-text-muted)', marginTop: 8 }}>Product CRUD coming soon.</p>
            </div>
        </>
    );
}
