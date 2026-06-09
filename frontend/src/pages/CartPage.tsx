import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { cartApi } from '@/api/cartApi';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/context/ToastContext';
import Loader from '@/components/Loader';
import EmptyState from '@/components/EmptyState';
import { formatPrice } from '@/components/ProductCard';
import type { CartProduct } from '@/types';

export default function CartPage() {
  const { user } = useAuth();
  const { refresh } = useCart();
  const { notify } = useToast();
  const navigate = useNavigate();

  const [items, setItems] = useState<CartProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<CartProduct | null>(null);

  const load = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await cartApi.getCart(user.emailId);
      setItems(data);
    } catch {
      // Empty cart returns 400 — show empty state.
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.emailId]);

  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
    [items],
  );

  const changeQty = async (item: CartProduct, delta: number) => {
    if (!user) return;
    const newQty = item.quantity + delta;
    if (newQty < 1 || newQty > item.product.availableQuantity) return;

    setBusyId(item.cartProductId);
    try {
      await cartApi.updateQuantity(user.emailId, item.product.productId, newQty);
      setItems((prev) =>
        prev.map((i) =>
          i.cartProductId === item.cartProductId ? { ...i, quantity: newQty } : i,
        ),
      );
      await refresh();
      notify('Quantity updated successfully.', 'success');
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Could not update quantity', 'danger');
    } finally {
      setBusyId(null);
    }
  };

  const doDelete = async () => {
    if (!user || !confirmDelete) return;
    const item = confirmDelete;
    setConfirmDelete(null);
    setBusyId(item.cartProductId);
    try {
      const message = await cartApi.deleteProduct(user.emailId, item.product.productId);
      setItems((prev) => prev.filter((i) => i.cartProductId !== item.cartProductId));
      await refresh();
      notify(message || 'Your item has been removed from cart.', 'success');
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Could not remove item', 'danger');
    } finally {
      setBusyId(null);
    }
  };

  if (loading) return <div className="container py-5"><Loader label="Loading your cart…" /></div>;

  if (items.length === 0) {
    return (
      <div className="container py-4">
        <h1 className="section-title mb-4">Your cart</h1>
        <div className="ekart-card">
          <EmptyState
            icon="🛒"
            title="Your cart is empty"
            message="Looks like you haven't added anything yet."
            action={<Link to="/products" className="btn btn-brand">Start shopping</Link>}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h1 className="section-title mb-4">Your cart</h1>

      <div className="row g-4">
        <div className="col-lg-8">
          <div className="ekart-card p-0 overflow-hidden">
            <div className="table-responsive">
              <table className="table align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th scope="col">Product</th>
                    <th scope="col" className="text-center">Quantity</th>
                    <th scope="col" className="text-end">Subtotal</th>
                    <th scope="col" className="text-end">Remove</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.cartProductId}>
                      <td>
                        <div className="d-flex align-items-center gap-3">
                          <img
                            src={item.product.imageUrl}
                            alt={item.product.name}
                            width={56}
                            height={56}
                            style={{ objectFit: 'cover', borderRadius: 8, background: '#eef1f6' }}
                          />
                          <div>
                            <Link
                              to={`/products/${item.product.productId}`}
                              className="fw-semibold text-decoration-none text-reset d-block"
                            >
                              {item.product.name}
                            </Link>
                            <span className="small text-muted-2">
                              {item.product.brand} · {formatPrice(item.product.price)}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="text-center">
                        <div className="qty-stepper" role="group" aria-label={`Quantity for ${item.product.name}`}>
                          <button
                            type="button"
                            onClick={() => changeQty(item, -1)}
                            disabled={busyId === item.cartProductId || item.quantity <= 1}
                            aria-label="Decrease quantity"
                          >
                            −
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => changeQty(item, 1)}
                            disabled={
                              busyId === item.cartProductId ||
                              item.quantity >= item.product.availableQuantity
                            }
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="text-end fw-semibold">
                        {formatPrice(item.product.price * item.quantity)}
                      </td>
                      <td className="text-end">
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => setConfirmDelete(item)}
                          disabled={busyId === item.cartProductId}
                          aria-label={`Remove ${item.product.name}`}
                          title="Remove item"
                        >
                          🗑
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <Link to="/products" className="btn btn-outline-brand mt-3">
            ← Continue shopping
          </Link>
        </div>

        <div className="col-lg-4">
          <aside className="ekart-card p-4">
            <h2 className="h5 mb-3">Order summary</h2>
            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted-2">Items</span>
              <span>{items.reduce((s, i) => s + i.quantity, 0)}</span>
            </div>
            <div className="d-flex justify-content-between mb-3">
              <span className="text-muted-2">Subtotal</span>
              <span className="fw-semibold">{formatPrice(subtotal)}</span>
            </div>
            <hr />
            <p className="small text-muted-2">
              A discount of 10% (credit card) or 5% (debit card) is applied at checkout.
            </p>
            <button className="btn btn-brand w-100 py-2" onClick={() => navigate('/place-order')}>
              Place Order
            </button>
          </aside>
        </div>
      </div>

      {/* Delete confirmation modal */}
      {confirmDelete && (
        <>
          <div className="modal fade show d-block" tabIndex={-1} role="dialog" aria-modal="true">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content ekart-card">
                <div className="modal-header border-0">
                  <h5 className="modal-title">Remove item?</h5>
                  <button
                    type="button"
                    className="btn-close"
                    aria-label="Close"
                    onClick={() => setConfirmDelete(null)}
                  />
                </div>
                <div className="modal-body">
                  Are you sure you want to remove <strong>{confirmDelete.product.name}</strong> from
                  your cart?
                </div>
                <div className="modal-footer border-0">
                  <button className="btn btn-light" onClick={() => setConfirmDelete(null)}>
                    Cancel
                  </button>
                  <button className="btn btn-danger" onClick={doDelete}>
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show" />
        </>
      )}
    </div>
  );
}
