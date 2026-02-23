import { Helmet } from 'react-helmet-async';

export default function AdminDashboard() {
    return (
        <>
            <Helmet><title>Admin Dashboard | In Sri Lanka</title></Helmet>
            <div className="container" style={{ padding: '60px var(--content-pad)' }}>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', marginBottom: 8 }}>Admin Dashboard</h1>
                <p style={{ color: 'var(--color-text-muted)' }}>Metrics and analytics coming soon.</p>
            </div>
        </>
    );
}
