import { useEffect, useMemo, useState } from 'react';
import { productApi } from '../api/productApi';
import ProductCard from '../components/ProductCard';
import SearchBar from '../components/SearchBar';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';
import { useDebounce } from '../hooks/useDebounce';
import type { Product } from '../types';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const debounced = useDebounce(search, 250);

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

  // Client-side filter mirrors the backend's case-insensitive name/brand search.
  const filtered = useMemo(() => {
    const term = debounced.trim().toLowerCase();
    if (!term) return products;
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(term) || p.brand.toLowerCase().includes(term),
    );
  }, [debounced, products]);

  return (
    <div className="container py-4">
      <header className="mb-4">
        <h1 className="section-title">All products</h1>
        <p className="section-subtitle">Find exactly what you're looking for.</p>
        <SearchBar products={products} value={search} onChange={setSearch} />
      </header>

      {loading && <Loader label="Loading products…" />}
      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && !error && filtered.length === 0 && (
        <EmptyState
          icon="🔍"
          title="No products found"
          message={
            debounced
              ? `No products match "${debounced}". Try a different name or brand.`
              : 'There are no products available right now.'
          }
        />
      )}

      {!loading && !error && filtered.length > 0 && (
        <>
          <p className="text-muted-2 small mb-3">
            Showing {filtered.length} {filtered.length === 1 ? 'product' : 'products'}
            {debounced && ` for "${debounced}"`}
          </p>
          <div className="row g-4">
            {filtered.map((p) => (
              <div className="col-12 col-sm-6 col-lg-4 col-xl-3" key={p.productId}>
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
