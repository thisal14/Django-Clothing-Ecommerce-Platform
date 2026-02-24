import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { catalogApi } from '@/api';
import type { Product, ProductVariant } from '@/types';
import { useDispatch } from 'react-redux';
import { addToCartThunk, openDrawer } from '@/store/cartSlice';
import type { AppDispatch } from '@/store';
import toast from 'react-hot-toast';

import { useAppSelector } from '@/store/hooks';
import { clearSSRData } from '@/store/ssrSlice';

const LKR = (n: number) =>
    new Intl.NumberFormat('si-LK', { style: 'currency', currency: 'LKR', maximumFractionDigits: 0 }).format(n);

export default function ProductDetail() {
    const { slug } = useParams<{ slug: string }>();
    const ssrData = useAppSelector((state) => state.ssr.data[`productDetail-${slug}`]);
    const dispatch = useDispatch<AppDispatch>();

    const [product, setProduct] = useState<Product | null>(ssrData || null);
    const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(ssrData?.variants?.[0] || null);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(!ssrData);

    useEffect(() => {
        if (!slug) return;
        if (ssrData) {
            dispatch(clearSSRData(`productDetail-${slug}`));
            return;
        }
        async function fetchProduct(productSlug: string) {
            setLoading(true);
            try {
                const { data } = await catalogApi.getProductBySlug(productSlug);
                setProduct(data);
                if (data.variants?.length > 0) {
                    setSelectedVariant(data.variants[0]);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        fetchProduct(slug);
    }, [slug]);

    const handleAddToCart = async () => {
        if (!selectedVariant) return;
        try {
            await dispatch(addToCartThunk({
                variant_id: selectedVariant.id,
                quantity
            })).unwrap();
            toast.success('Added to bag');
            dispatch(openDrawer());
        } catch {
            toast.error('Failed to add item');
        }
    };

    if (loading) return <div className="container" style={{ padding: '100px 0' }}><div className="skeleton" style={{ height: 600 }} /></div>;
    if (!product) return <div className="container" style={{ padding: '100px 0', textAlign: 'center' }}><h2>Product not found</h2><Link to="/products">Back to Shop</Link></div>;

    return (
        <>
            <Helmet>
                <title>{product.name} | In Sri Lanka</title>
                <meta name="description" content={product.meta_description} />
            </Helmet>

            <div className="container" style={{ padding: '60px var(--content-pad)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 60 }}>

                    {/* Media */}
                    <div>
                        <div style={{ aspectRatio: '3/4', borderRadius: 'var(--radius-md)', overflow: 'hidden', background: 'var(--color-surface-2)' }}>
                            <img
                                src={product.primary_image ?? 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=70'}
                                alt={product.name}
                                loading="eager"
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        </div>
                    </div>

                    {/* Info */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                        <div>
                            <span style={{ color: 'var(--color-primary)', fontWeight: 600, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                                {product.category?.name}
                            </span>
                            <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', margin: '8px 0 16px' }}>{product.name}</h1>
                            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-text)' }}>
                                {LKR(product.effective_price)}
                                {product.is_on_sale && <span style={{ marginLeft: 12, textDecoration: 'line-through', color: 'var(--color-text-muted)', fontSize: '1.1rem', fontWeight: 400 }}>{LKR(product.base_price)}</span>}
                            </div>
                        </div>

                        <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.8 }}>{product.description}</p>

                        {/* Variants */}
                        {product.variants.length > 0 && (
                            <div>
                                <div className="form-label" style={{ marginBottom: 12 }}>Select Size</div>
                                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                                    {product.variants.map((v) => {
                                        const size = v.attributes.find(a => a.attribute_name === 'Size')?.value;
                                        const isActive = selectedVariant?.id === v.id;
                                        return (
                                            <button
                                                key={v.id}
                                                className={`filter-chip${isActive ? ' active' : ''}`}
                                                onClick={() => setSelectedVariant(v)}
                                                disabled={!v.stock.is_in_stock}
                                            >
                                                {size} {!v.stock.is_in_stock && '(Sold Out)'}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Quantity & Add */}
                        <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginTop: 20 }}>
                            <div className="cart-item__qty" style={{ margin: 0, padding: '8px 16px', border: '1.5px solid var(--color-border)', borderRadius: 'var(--radius-full)' }}>
                                <button className="qty-btn" style={{ border: 'none' }} onClick={() => setQuantity(q => Math.max(1, q - 1))}>−</button>
                                <span style={{ minWidth: 20, textAlign: 'center' }}>{quantity}</span>
                                <button className="qty-btn" style={{ border: 'none' }} onClick={() => setQuantity(q => q + 1)}>+</button>
                            </div>
                            <button
                                className="btn btn-primary btn-lg"
                                style={{ flex: 1 }}
                                onClick={handleAddToCart}
                                disabled={!selectedVariant?.stock.is_in_stock}
                            >
                                {selectedVariant?.stock.is_in_stock ? 'Add to Bag' : 'Sold Out'}
                            </button>
                        </div>

                        {/* meta info */}
                        <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 32, display: 'flex', flexDirection: 'column', gap: 12, fontSize: '0.85rem' }}>
                            <div><span style={{ fontWeight: 600 }}>SKU:</span> {selectedVariant?.sku}</div>
                            <div><span style={{ fontWeight: 600 }}>Brand:</span> {product.brand?.name ?? 'In Sri Lanka'}</div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
