import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { productApi } from '../api/productApi';
import { cartApi } from '../api/cartApi';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import { useToast } from '../context/ToastContext';
import Loader from '../components/Loader';
import { formatPrice } from '../components/ProductCard';
import type { Product } from '../types';

const FALLBACK_IMG =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="450"><rect width="100%" height="100%" fill="%23eef1f6"/><text x="50%" y="50%" font-family="sans-serif" font-size="22" fill="%2394a3b8" text-anchor="middle" dominant-baseline="middle">No image</text></svg>';

export default function ProductDetailsPage() {
  const { productId } = useParams<{ productId: string }>();
  const { user } = useAuth();
  const { items, refresh } = useCart();
  const { notify } = useToast();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    if (!productId) return;
    let active = true;
    setLoading(true);
    productApi
      .getById(Number(productId))
      .then((data) => {
        if (active) setProduct(data);
      })
      .catch((err: unknown) => {
        if (active) setError(err instanceof Error ? err.message : 'Sorry product is not available');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [productId]);

  const alreadyInCart = product
    ? items.some((i) => i.product.productId === product.productId)
    : false;

  const handleAddToCart = async () => {
    if (!product || !user) return;
    if (alreadyInCart) {
      notify('This product is already added to your cart.', 'warning');
      return;
    }
    setAdding(true);
    try {
      const message = await cartApi.addToCart({
        customerEmailId: user.emailId,
        cartProducts: [{ product: { productId: product.productId }, quantity }],
      });
      await refresh();
      notify(message || 'Product added to cart!', 'success');
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Could not add to cart', 'danger');
    } finally {
      setAdding(false);
    }
  };

  if (loading) return <div className="container py-5"><Loader /></div>;

  if (error || !product) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">{error ?? 'Sorry product is not available'}</div>
        <Link to="/products" className="btn btn-outline-brand">Back to products</Link>
      </div>
    );
  }

  const outOfStock = product.availableQuantity <= 0;

  return (
    <div className="container py-4">
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link to="/products">Products</Link></li>
          <li className="breadcrumb-item active" aria-current="page">{product.name}</li>
        </ol>
      </nav>

      <article className="row g-4 ekart-card p-3 p-md-4">
        <div className="col-md-6">
          <img
            className="img-fluid rounded w-100"
            style={{ aspectRatio: '4 / 3', objectFit: 'cover', background: '#eef1f6' }}
            src={product.imageUrl || FALLBACK_IMG}
            alt={product.name}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = FALLBACK_IMG;
            }}
          />
        </div>

        <div className="col-md-6">
          <span className="brand-chip">{product.brand}</span>
          <h1 className="h3 mt-1">{product.name}</h1>
          <div className="d-flex align-items-center gap-2 mb-3">
            <span className="badge text-bg-light border">{product.category}</span>
            {outOfStock ? (
              <span className="badge text-bg-secondary">Out of stock</span>
            ) : (
              <span className="badge text-bg-success-subtle text-success border border-success-subtle">
                {product.availableQuantity} in stock
              </span>
            )}
          </div>

          <p className="price-tag fs-3 mb-3">{formatPrice(product.price)}</p>
          <p className="text-muted-2">{product.description}</p>

          <div className="d-flex align-items-center gap-3 my-4">
            <span className="fw-semibold">Quantity</span>
            <div className="qty-stepper" role="group" aria-label="Select quantity">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1}
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span aria-live="polite">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.min(product.availableQuantity, q + 1))}
                disabled={quantity >= product.availableQuantity}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          </div>

          <div className="d-flex flex-wrap gap-2">
            <button
              className="btn btn-brand btn-lg"
              onClick={handleAddToCart}
              disabled={adding || outOfStock || alreadyInCart}
            >
              {alreadyInCart ? 'Already in cart' : adding ? 'Adding…' : 'Add to Cart'}
            </button>
            <button className="btn btn-outline-brand btn-lg" onClick={() => navigate('/cart')}>
              Go to Cart
            </button>
          </div>
        </div>
      </article>
    </div>
  );
}
