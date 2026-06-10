import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Product } from '../types';

interface SearchBarProps {
  products: Product[];
  value: string;
  onChange: (value: string) => void;
}

/**
 * Search input with live suggestions. Suggestions are derived from the
 * already-loaded product list (name or brand contains the typed text).
 */
export default function SearchBar({ products, value, onChange }: SearchBarProps) {
  const [focused, setFocused] = useState(false);
  const navigate = useNavigate();

  const suggestions = useMemo(() => {
    const term = value.trim().toLowerCase();
    if (!term) return [];
    return products
      .filter(
        (p) =>
          p.name.toLowerCase().includes(term) || p.brand.toLowerCase().includes(term),
      )
      .slice(0, 6);
  }, [value, products]);

  // Hide suggestions shortly after blur so clicks register.
  const [showList, setShowList] = useState(false);
  useEffect(() => {
    if (focused) {
      setShowList(true);
      return;
    }
    const id = window.setTimeout(() => setShowList(false), 150);
    return () => window.clearTimeout(id);
  }, [focused]);

  return (
    <div className="search-wrap w-100">
      <label htmlFor="product-search" className="visually-hidden">
        Search products
      </label>
      <input
        id="product-search"
        type="search"
        className="form-control form-control-lg"
        placeholder="Search by product name or brand…"
        value={value}
        autoComplete="off"
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        aria-expanded={showList && suggestions.length > 0}
        aria-controls="search-suggestions"
        role="combobox"
      />
      {showList && suggestions.length > 0 && (
        <div className="suggestions" id="search-suggestions" role="listbox">
          {suggestions.map((p) => (
            <button
              key={p.productId}
              type="button"
              role="option"
              aria-selected="false"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => navigate(`/products/${p.productId}`)}
            >
              {p.imageUrl && <img src={p.imageUrl} alt="" />}
              <span>
                <strong>{p.name}</strong>
                <span className="d-block small text-muted-2">{p.brand}</span>
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
