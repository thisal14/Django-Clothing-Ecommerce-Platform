import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { catalogApi } from '@/api';
import type { Product } from '@/types';
import { Link } from 'react-router-dom';
import ProductCard from '@/components/product/ProductCard';

export default function Home() {
    const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
    const [newArrivals, setNewArrivals] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [hoveredCat, setHoveredCat] = useState<string | null>(null);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                const [featRes, newRes] = await Promise.all([
                    catalogApi.getProducts({ is_featured: true, page_size: 4 }),
                    catalogApi.getProducts({ is_new_arrival: true, page_size: 4 })
                ]);
                setFeaturedProducts(featRes.data.results);
                setNewArrivals(newRes.data.results);
            } catch (error) {
                console.error('Failed to fetch home data', error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    const bannerCategories = [
        { label: "Men's Collection", slug: 'men', img: 'https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=800&q=80', desc: 'Timeless style for the modern man.' },
        { label: "Women's Collection", slug: 'women', img: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80', desc: 'Elegant pieces for every occasion.' },
        { label: "New Arrivals", slug: '', query: 'is_new_arrival=true', img: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=800&q=80', desc: 'The latest trends, straight from the island.' }
    ];

    return (
        <>
            <Helmet>
                <title>In Sri Lanka | Authentic Island Style</title>
                <meta name="description" content="Discover authentic Sri Lankan clothing. From island threads to modern luxury, shop our curated collection." />
            </Helmet>

            {/* Hero Section */}
            <section className="hero">
                <div className="hero__bg">
                    <img src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1600&q=80" alt="Hero" loading="eager" />
                </div>
                <div className="hero__overlay" />
                <div className="container">
                    <div className="hero__content">
                        <span className="hero__tag">✦ Island Inspired ✦</span>
                        <h1 className="hero__title">
                            Elegance <span>In Sri Lanka</span>
                        </h1>
                        <p className="hero__subtitle">
                            Premium clothing crafted with the soul of the island.
                            Experience authentic style, vibrant textures, and timeless quality.
                        </p>
                        <div className="hero__actions">
                            <Link to="/products" className="btn btn-primary btn-lg">Shop Collection</Link>
                            <Link to="/about" className="btn btn-ghost btn-lg">Our Story</Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Categories Grid */}
            <section style={{ padding: '100px 0', background: 'var(--color-surface)' }}>
                <div className="container">
                    <div className="section-header">
                        <span className="section-tag">Explore</span>
                        <h2 className="section-title">Shop by Category</h2>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: 30 }}>
                        {bannerCategories.map((cat) => (
                            <Link
                                key={cat.label}
                                to={cat.query ? `/products?${cat.query}` : `/products?category=${cat.slug}`}
                                className="card"
                                style={{
                                    height: 500,
                                    position: 'relative',
                                    overflow: 'hidden',
                                    border: 'none',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'flex-end',
                                    padding: 40,
                                    transform: hoveredCat === cat.label ? 'translateY(-10px)' : 'none',
                                    transition: 'transform 0.5s cubic-bezier(0.2, 1, 0.3, 1)'
                                }}
                                onMouseEnter={() => setHoveredCat(cat.label)}
                                onMouseLeave={() => setHoveredCat(null)}
                            >
                                <img
                                    src={cat.img}
                                    alt={cat.label}
                                    loading="lazy"
                                    style={{
                                        position: 'absolute',
                                        inset: 0,
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        zIndex: 0,
                                        transform: hoveredCat === cat.label ? 'scale(1.1)' : 'scale(1.0)',
                                        transition: 'transform 1.2s cubic-bezier(0.2, 1, 0.3, 1)'
                                    }}
                                />
                                <div style={{
                                    position: 'absolute',
                                    inset: 0,
                                    background: hoveredCat === cat.label
                                        ? 'linear-gradient(to top, rgba(13,9,6,0.9), rgba(13,9,6,0.3))'
                                        : 'linear-gradient(to top, rgba(13,9,6,0.8), rgba(13,9,6,0.1))',
                                    zIndex: 1,
                                    transition: 'background 0.5s ease'
                                }} />
                                <div style={{ position: 'relative', zIndex: 2, color: 'white' }}>
                                    <h3 style={{ fontSize: '2rem', marginBottom: 12 }}>{cat.label}</h3>
                                    <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1rem', marginBottom: 20 }}>{cat.desc}</p>
                                    <span className="btn btn-ghost btn-sm" style={{ border: '1px solid rgba(255,255,255,0.5)' }}>Browse →</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            <section style={{ padding: '100px 0' }}>
                <div className="container">
                    <div className="section-header">
                        <span className="section-tag">Premium</span>
                        <h2 className="section-title">Featured Collections</h2>
                        <p className="section-subtitle">Exquisite pieces selected for the discerning eye.</p>
                    </div>

                    {loading ? (
                        <div className="product-grid">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="skeleton" style={{ aspectRatio: '3/4', borderRadius: 'var(--radius-md)' }} />
                            ))}
                        </div>
                    ) : (
                        <div className="product-grid">
                            {featuredProducts.map(p => <ProductCard key={p.id} product={p} />)}
                        </div>
                    )}

                    <div style={{ textAlign: 'center', marginTop: 60 }}>
                        <Link to="/products" className="btn btn-outline">View All Products</Link>
                    </div>
                </div>
            </section>

            {/* New Arrivals Section */}
            <section style={{ padding: '0 0 100px 0' }}>
                <div className="container">
                    <div className="section-header">
                        <span className="section-tag">Latest</span>
                        <h2 className="section-title">New Arrivals</h2>
                        <p className="section-subtitle">Freshest picks from our local artisans.</p>
                    </div>

                    {loading ? (
                        <div className="product-grid">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="skeleton" style={{ aspectRatio: '3/4', borderRadius: 'var(--radius-md)' }} />
                            ))}
                        </div>
                    ) : (
                        <div className="product-grid">
                            {newArrivals.map(p => <ProductCard key={p.id} product={p} />)}
                        </div>
                    )}

                    <div style={{ textAlign: 'center', marginTop: 60 }}>
                        <Link to="/products?is_new_arrival=true" className="btn btn-outline">Explore More New Arrivals</Link>
                    </div>
                </div>
            </section>
        </>
    );
}
