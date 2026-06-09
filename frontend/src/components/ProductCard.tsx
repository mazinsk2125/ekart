import { Link } from 'react-router-dom';
import type { Product } from '@/types';

const FALLBACK_IMG =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect width="100%" height="100%" fill="%23eef1f6"/><text x="50%" y="50%" font-family="sans-serif" font-size="18" fill="%2394a3b8" text-anchor="middle" dominant-baseline="middle">No image</text></svg>';

function formatPrice(value: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
}

export default function ProductCard({ product }: { product: Product }) {
  const outOfStock = product.availableQuantity <= 0;

  return (
    <article className="product-card d-flex flex-column">
      <Link to={`/products/${product.productId}`} className="text-decoration-none text-reset">
        <img
          className="product-thumb"
          src={product.imageUrl || FALLBACK_IMG}
          alt={product.name}
          loading="lazy"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = FALLBACK_IMG;
          }}
        />
      </Link>
      <div className="p-3 d-flex flex-column flex-grow-1">
        <span className="brand-chip">{product.brand}</span>
        <Link
          to={`/products/${product.productId}`}
          className="text-decoration-none text-reset"
        >
          <h3 className="h6 mt-1 mb-2">{product.name}</h3>
        </Link>
        <p className="small text-muted-2 mb-3 flex-grow-1">
          {product.description.length > 80
            ? `${product.description.slice(0, 80)}…`
            : product.description}
        </p>
        <div className="d-flex justify-content-between align-items-center">
          <span className="price-tag">{formatPrice(product.price)}</span>
          {outOfStock ? (
            <span className="badge text-bg-secondary">Out of stock</span>
          ) : (
            <span className="badge text-bg-success-subtle text-success border border-success-subtle">
              In stock
            </span>
          )}
        </div>
        <Link
          to={`/products/${product.productId}`}
          className="btn btn-brand w-100 mt-3"
        >
          View Details
        </Link>
      </div>
    </article>
  );
}

export { formatPrice };
