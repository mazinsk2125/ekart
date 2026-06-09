import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { productApi } from '@/api/productApi';
import { useAuth } from '@/hooks/useAuth';
import ProductCard from '@/components/ProductCard';
import Loader from '@/components/Loader';
import type { Product } from '@/types';

export default function HomePage() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    productApi
      .getAll()
      .then((data) => {
        if (active) setProducts(data);
      })
      .catch((err: unknown) => {
        if (active) setError(err instanceof Error ? err.message : 'Failed to load products');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const featured = products.slice(0, 4);

  return (
    <div className="container py-4">
      <section className="hero mb-5">
        <span className="hero-orb" style={{ width: 220, height: 220, top: -60, right: -40 }} />
        <span className="hero-orb" style={{ width: 120, height: 120, bottom: -30, left: 40 }} />
        <p className="text-uppercase fw-semibold mb-2" style={{ letterSpacing: '0.08em' }}>
          Welcome back, {user?.name?.split(' ')[0]} 👋
        </p>
        <h1>Everything you need, delivered with care.</h1>
        <p className="mt-3">
          Discover curated electronics, apparel and home essentials — all in one place.
          Add to cart, checkout securely and track your orders effortlessly.
        </p>
        <Link to="/products" className="btn btn-light btn-lg mt-3 fw-semibold text-primary">
          Browse all products
        </Link>
      </section>

      <section>
        <div className="d-flex justify-content-between align-items-end mb-3">
          <div>
            <h2 className="section-title">Featured products</h2>
            <p className="section-subtitle mb-0">Handpicked items you might love.</p>
          </div>
          <Link to="/products" className="btn btn-outline-brand">
            View all
          </Link>
        </div>

        {loading && <Loader label="Loading featured products…" />}
        {error && <div className="alert alert-danger">{error}</div>}

        {!loading && !error && (
          <div className="row g-4">
            {featured.map((p) => (
              <div className="col-12 col-sm-6 col-lg-3" key={p.productId}>
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
