import { Helmet } from 'react-helmet-async';
export default function AdminOrders() {
    return (
        <>
            <Helmet><title>Manage Orders | Admin</title></Helmet>
            <div className="container" style={{ padding: '60px var(--content-pad)' }}>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem' }}>Manage Orders</h1>
                <p style={{ color: 'var(--color-text-muted)', marginTop: 8 }}>Order management coming soon.</p>
            </div>
        </>
    );
}
