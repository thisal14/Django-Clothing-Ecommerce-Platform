import { useEffect, useState } from 'react';
import { adminApi } from '@/api';
import type { Product } from '@/types';
import { Plus, Edit2, Trash2, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function AdminProducts() {
    const navigate = useNavigate();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const { data } = await adminApi.getProducts({ page_size: 100 }); // Simplification for demo
            setProducts(data.results);
        } catch (error) {
            toast.error('Failed to load products');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleDelete = async (slug: string) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;
        try {
            await adminApi.deleteProduct(slug);
            toast.success('Product deleted successfully');
            fetchProducts();
        } catch (error) {
            toast.error('Failed to delete product');
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', color: 'var(--color-text)' }}>Products Management</h2>
                <button
                    onClick={() => navigate('/admin/products/new')}
                    className="btn btn-primary"
                >
                    <Plus size={16} />
                    <span>Add Product</span>
                </button>
            </div>

            <div className="card" style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                    <thead style={{ backgroundColor: 'var(--color-surface-2)', borderBottom: '1px solid var(--color-border)' }}>
                        <tr>
                            <th style={{ padding: '16px 24px', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em' }}>Product</th>
                            <th style={{ padding: '16px 24px', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em' }}>Category</th>
                            <th style={{ padding: '16px 24px', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em' }}>Price</th>
                            <th style={{ padding: '16px 24px', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em' }}>Status</th>
                            <th style={{ padding: '16px 24px', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em', textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={5} style={{ padding: '32px 24px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                                    Loading products...
                                </td>
                            </tr>
                        ) : products.length === 0 ? (
                            <tr>
                                <td colSpan={5} style={{ padding: '32px 24px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                                    No products found.
                                </td>
                            </tr>
                        ) : (
                            products.map((product) => (
                                <tr key={product.id} style={{ borderBottom: '1px solid var(--color-border)', transition: 'background-color var(--transition-fast)' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-surface-2)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                                    <td style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', gap: 12, fontWeight: 500, color: 'var(--color-text)' }}>
                                        {product.primary_image ? (
                                            <img src={product.primary_image} alt={product.name} style={{ width: 40, height: 40, borderRadius: 'var(--radius-sm)', objectFit: 'cover' }} />
                                        ) : (
                                            <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--color-surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-light)' }}>
                                                <Package size={20} />
                                            </div>
                                        )}
                                        {product.name}
                                    </td>
                                    <td style={{ padding: '16px 24px', color: 'var(--color-text-muted)' }}>{product.category?.name || 'Uncategorized'}</td>
                                    <td style={{ padding: '16px 24px', color: 'var(--color-text)' }}>LKR {product.base_price}</td>
                                    <td style={{ padding: '16px 24px' }}>
                                        <span className="badge" style={{ backgroundColor: product.is_active !== false ? 'var(--color-success-bg)' : 'var(--color-surface-2)', color: product.is_active !== false ? 'var(--color-success)' : 'var(--color-text-muted)' }}>
                                            {product.is_active !== false ? 'Active' : 'Hidden'}
                                        </span>
                                    </td>
                                    <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                                        <div style={{ display: 'flex', gap: 16, justifyContent: 'flex-end' }}>
                                            <button
                                                onClick={() => navigate(`/admin/products/${product.slug}/edit`)}
                                                style={{ color: 'var(--color-primary)', transition: 'color var(--transition-fast)' }}
                                                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-primary-dark)'}
                                                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-primary)'}
                                            >
                                                <Edit2 size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(product.slug)}
                                                style={{ color: 'var(--color-error)', transition: 'color var(--transition-fast)' }}
                                                onMouseEnter={(e) => e.currentTarget.style.color = '#9B2C2C'}
                                                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-error)'}
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
