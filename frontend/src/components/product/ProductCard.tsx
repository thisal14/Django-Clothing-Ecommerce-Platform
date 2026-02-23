import React from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import type { AppDispatch } from '@/store';
import { addToCartThunk } from '@/store/cartSlice';
import type { Product } from '@/types';
import toast from 'react-hot-toast';

interface Props { product: Product; }

const LKR = (n: number) =>
    new Intl.NumberFormat('si-LK', { style: 'currency', currency: 'LKR', maximumFractionDigits: 0 }).format(n);

export default function ProductCard({ product }: Props) {
    const dispatch = useDispatch<AppDispatch>();

    const firstVariant = product.variants?.[0];

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!firstVariant) return;
        try {
            await dispatch(addToCartThunk({ variant_id: firstVariant.id, quantity: 1 })).unwrap();
            toast.success(`${product.name} added to bag`);
        } catch {
            toast.error('Could not add to cart');
        }
    };

    return (
        <Link to={`/products/${product.slug}`} className="product-card">
            <div className="product-card__image-wrapper">
                <img
                    src={product.primary_image ?? `https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&q=70`}
                    alt={product.name}
                    className="product-card__image"
                    loading="lazy"
                />

                {/* Badges */}
                <div className="product-card__badges">
                    {product.is_new_arrival && <span className="badge badge-new">New</span>}
                    {product.is_on_sale && <span className="badge badge-sale">Sale</span>}
                    {firstVariant?.stock?.is_low_stock && !product.is_on_sale && (
                        <span className="badge badge-accent">Low Stock</span>
                    )}
                </div>

                {/* Quick Add */}
                <div className="product-card__actions">
                    <button
                        className="btn btn-primary btn-sm"
                        onClick={handleAddToCart}
                        aria-label="Add to cart"
                        disabled={!firstVariant?.stock?.is_in_stock}
                    >
                        {firstVariant?.stock?.is_in_stock ? '+ Add' : 'Sold Out'}
                    </button>
                </div>
            </div>

            <div className="product-card__info">
                <div className="product-card__name" title={product.name}>{product.name}</div>
                {product.avg_rating !== null && (
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: 6 }}>
                        {'★'.repeat(Math.round(product.avg_rating))}{'☆'.repeat(5 - Math.round(product.avg_rating))}
                        <span style={{ marginLeft: 4 }}>({product.review_count})</span>
                    </div>
                )}
                <div className="product-card__price">
                    {LKR(product.effective_price)}
                    {product.is_on_sale && product.base_price && (
                        <span className="product-card__price--original">{LKR(product.base_price)}</span>
                    )}
                </div>
            </div>
        </Link>
    );
}
