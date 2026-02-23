import { useState, useEffect, useCallback, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { catalogApi } from '@/api';
import type { Product, PaginatedResponse } from '@/types';
import ProductCard from '@/components/product/ProductCard';
import { useSearchParams } from 'react-router-dom';

export default function ProductListing() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState<Product[]>([]);
    const [meta, setMeta] = useState<{ count: number; next: string | null; previous: string | null } | null>(null);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [search, setSearch] = useState(searchParams.get('search') ?? '');

    // Sentinel element for IntersectionObserver
    const sentinelRef = useRef<HTMLDivElement | null>(null);
    // Track the "base" params (everything except page) to detect filter changes
    const baseParamsKey = (() => {
        const p = new URLSearchParams(searchParams);
        p.delete('page');
        return p.toString();
    })();

    // ── Fetch a specific page ───────────────────────────────────────────────
    const fetchPage = useCallback(
        async (pageNum: number, replace: boolean) => {
            if (replace) setLoading(true);
            else setLoadingMore(true);

            try {
                const params: Record<string, string | number | boolean> = { page: pageNum };
                searchParams.forEach((val, key) => {
                    if (key !== 'page') params[key] = val;
                });

                const { data } = await catalogApi.getProducts(params);
                const result = data as PaginatedResponse<Product>;

                setMeta({ count: result.count, next: result.next, previous: result.previous });
                setProducts((prev) => (replace ? result.results : [...prev, ...result.results]));
                setPage(pageNum);
            } finally {
                setLoading(false);
                setLoadingMore(false);
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [baseParamsKey],
    );

    // Reset to page 1 whenever filters / search change
    useEffect(() => {
        setProducts([]);
        setPage(1);
        fetchPage(1, true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [baseParamsKey]);

    // ── IntersectionObserver — auto-load next page when sentinel is visible ─
    useEffect(() => {
        const sentinel = sentinelRef.current;
        if (!sentinel) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && meta?.next && !loadingMore && !loading) {
                    fetchPage(page + 1, false);
                }
            },
            { rootMargin: '300px' }, // trigger 300px before sentinel enters viewport
        );

        observer.observe(sentinel);
        return () => observer.disconnect();
    }, [meta?.next, loadingMore, loading, page, fetchPage]);

    // ── Filter helpers ──────────────────────────────────────────────────────
    const setFilter = (key: string, value: string | null) => {
        const next = new URLSearchParams(searchParams);
        if (value) next.set(key, value);
        else next.delete(key);
        next.delete('page');
        setSearchParams(next);
    };

    const categoryLabel = searchParams.get('category');
    const pageTitle = categoryLabel
        ? `${categoryLabel.charAt(0).toUpperCase() + categoryLabel.slice(1)}'s Collection`
        : 'All Products';

    const filters = [
        { label: 'All', key: null },
        { label: 'New Arrivals', key: 'is_new_arrival', value: 'true' },
        { label: 'On Sale', key: 'on_sale', value: 'true' },
        { label: 'Featured', key: 'is_featured', value: 'true' },
    ];

    const noActiveFilter =
        !searchParams.get('is_new_arrival') &&
        !searchParams.get('on_sale') &&
        !searchParams.get('is_featured');

    const loadedCount = products.length;
    const totalCount = meta?.count ?? 0;
    const hasMore = !!meta?.next;

    return (
        <>
            <Helmet>
                <title>{pageTitle} | In Sri Lanka</title>
                <meta name="description" content="Browse the full In Sri Lanka clothing collection. Filter by category, price, size and more." />
            </Helmet>

            <div className="container" style={{ padding: '60px var(--content-pad)' }}>

                {/* ── Header ─────────────────────────────────────────────── */}
                <div style={{ marginBottom: 40 }}>
                    <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', marginBottom: 8 }}>
                        {pageTitle}
                    </h1>
                    {meta && (
                        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                            {loadedCount < totalCount
                                ? `Showing ${loadedCount} of ${totalCount} products`
                                : `${totalCount} product${totalCount !== 1 ? 's' : ''}`}
                        </p>
                    )}
                </div>

                {/* ── Filters & Search ────────────────────────────────────── */}
                <div className="filters-bar">
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', flex: 1 }}>
                        {filters.map((f) => (
                            <button
                                key={f.label}
                                className={
                                    `filter-chip` +
                                    (!f.key && noActiveFilter ? ' active' : '') +
                                    (f.key && searchParams.get(f.key) === f.value ? ' active' : '')
                                }
                                onClick={() => {
                                    if (!f.key) {
                                        setSearchParams(new URLSearchParams());
                                    } else {
                                        setFilter(f.key, searchParams.get(f.key) === f.value ? null : (f.value ?? null));
                                    }
                                }}
                            >
                                {f.label}
                            </button>
                        ))}
                    </div>

                    {/* Search */}
                    <form
                        onSubmit={(e) => { e.preventDefault(); setFilter('search', search || null); }}
                        style={{ display: 'flex', gap: 8 }}
                    >
                        <input
                            className="form-input"
                            style={{ width: 220 }}
                            placeholder="Search products..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <button type="submit" className="btn btn-primary btn-sm">Search</button>
                    </form>

                    {/* Sort */}
                    <select
                        className="form-input"
                        style={{ width: 'auto' }}
                        value={searchParams.get('ordering') ?? ''}
                        onChange={(e) => setFilter('ordering', e.target.value || null)}
                    >
                        <option value="">Sort: Latest</option>
                        <option value="base_price">Price: Low → High</option>
                        <option value="-base_price">Price: High → Low</option>
                        <option value="name">Name A→Z</option>
                    </select>
                </div>

                {/* ── Product Grid ─────────────────────────────────────────── */}
                {loading ? (
                    /* Initial skeleton */
                    <div className="product-grid">
                        {Array.from({ length: 12 }).map((_, i) => (
                            <div key={i} className="skeleton" style={{ aspectRatio: '3/4', borderRadius: 'var(--radius-md)' }} />
                        ))}
                    </div>
                ) : products.length > 0 ? (
                    <>
                        <div className="product-grid">
                            {products.map((p) => <ProductCard key={p.id} product={p} />)}

                            {/* Skeleton cards at the bottom while loading more */}
                            {loadingMore && Array.from({ length: 4 }).map((_, i) => (
                                <div key={`skel-${i}`} className="skeleton" style={{ aspectRatio: '3/4', borderRadius: 'var(--radius-md)' }} />
                            ))}
                        </div>

                        {/* Invisible sentinel — IntersectionObserver watches this */}
                        <div ref={sentinelRef} style={{ height: 1 }} aria-hidden="true" />

                        {/* Progress bar + Load More fallback button */}
                        {(hasMore || loadingMore) && (
                            <div style={{ textAlign: 'center', marginTop: 48 }}>
                                {/* Progress indicator */}
                                <div style={{
                                    width: 200,
                                    height: 3,
                                    background: 'var(--color-border)',
                                    borderRadius: 99,
                                    margin: '0 auto 20px',
                                    overflow: 'hidden',
                                }}>
                                    <div style={{
                                        height: '100%',
                                        width: `${Math.min(100, (loadedCount / totalCount) * 100)}%`,
                                        background: 'var(--color-primary)',
                                        borderRadius: 99,
                                        transition: 'width 0.4s ease',
                                    }} />
                                </div>
                                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: 16 }}>
                                    {loadedCount} of {totalCount} products
                                </p>
                                <button
                                    className="btn btn-outline"
                                    disabled={loadingMore}
                                    onClick={() => fetchPage(page + 1, false)}
                                >
                                    {loadingMore ? 'Loading…' : 'Load More'}
                                </button>
                            </div>
                        )}

                        {/* All loaded message */}
                        {!hasMore && !loadingMore && totalCount > 0 && (
                            <p style={{
                                textAlign: 'center',
                                marginTop: 60,
                                fontSize: '0.85rem',
                                color: 'var(--color-text-muted)',
                                letterSpacing: '0.05em',
                            }}>
                                ✦ You've seen all {totalCount} products ✦
                            </p>
                        )}
                    </>
                ) : (
                    <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--color-text-muted)' }}>
                        <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', marginBottom: 16 }}>
                            No products found
                        </p>
                        <button className="btn btn-outline" onClick={() => setSearchParams(new URLSearchParams())}>
                            Clear Filters
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}
