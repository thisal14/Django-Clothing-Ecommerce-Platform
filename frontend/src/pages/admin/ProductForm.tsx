import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { adminApi } from '@/api';
import toast from 'react-hot-toast';

export default function ProductForm() {
    const { slug } = useParams();
    const isEditing = Boolean(slug);
    const navigate = useNavigate();

    // In a real app we'd fetch categories, brand, etc. here

    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        base_price: 0,
        description: '',
        short_description: '',
        is_active: true
    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isEditing && slug) {
            setLoading(true);
            adminApi.getProduct(slug).then(({ data }) => {
                setFormData({
                    name: data.name,
                    slug: data.slug,
                    base_price: data.base_price,
                    description: data.description,
                    short_description: data.short_description || '',
                    is_active: data?.is_active ?? true,
                });
            }).catch(() => toast.error('Failed to load product'))
                .finally(() => setLoading(false));
        }
    }, [isEditing, slug]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            if (isEditing && slug) {
                await adminApi.updateProduct(slug, formData);
                toast.success('Product updated!');
            } else {
                await adminApi.createProduct(formData);
                toast.success('Product created!');
            }
            navigate('/admin/products');
        } catch (error) {
            toast.error('Failed to save product. Ensure slug is unique.');
        } finally {
            setLoading(false);
        }
    };

    if (loading && isEditing) return <div className="p-8">Loading product data...</div>;

    return (
        <div className="card" style={{ maxWidth: 800, margin: '0 auto', padding: 40 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--color-text)', marginBottom: 32 }}>
                {isEditing ? 'Edit Product' : 'Add New Product'}
            </h2>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                    <div className="form-group">
                        <label className="form-label">Product Name</label>
                        <input required name="name" value={formData.name} onChange={handleChange} className="form-input" />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Slug (URL)</label>
                        <input required name="slug" value={formData.slug} onChange={handleChange} className="form-input" />
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-label">Base Price (LKR)</label>
                    <input required type="number" name="base_price" value={formData.base_price} onChange={handleChange} className="form-input" />
                </div>

                <div className="form-group">
                    <label className="form-label">Short Description</label>
                    <input name="short_description" value={formData.short_description} onChange={handleChange} className="form-input" />
                </div>

                <div className="form-group">
                    <label className="form-label">Detailed Description</label>
                    <textarea required name="description" value={formData.description} onChange={handleChange} rows={4} className="form-input" />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 8 }}>
                    <input type="checkbox" name="is_active" id="is_active" checked={formData.is_active} onChange={handleChange} style={{ width: 18, height: 18, accentColor: 'var(--color-primary)', cursor: 'pointer' }} />
                    <label htmlFor="is_active" style={{ fontSize: '0.95rem', fontWeight: 500, color: 'var(--color-text)', cursor: 'pointer' }}>Product is Active (Visible on store)</label>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 16, marginTop: 32, paddingTop: 24, borderTop: '1px solid var(--color-border)' }}>
                    <button type="button" onClick={() => navigate('/admin/products')} className="btn btn-outline" style={{ border: 'none', backgroundColor: 'var(--color-surface-2)', color: 'var(--color-text)' }}>Cancel</button>
                    <button type="submit" disabled={loading} className="btn btn-primary" style={{ padding: '12px 32px' }}>
                        {loading ? 'Saving...' : 'Save Product'}
                    </button>
                </div>
            </form>
        </div>
    );
}
