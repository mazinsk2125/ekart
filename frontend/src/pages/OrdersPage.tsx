import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { orderApi } from '@/api/orderApi';
import { useAuth } from '@/hooks/useAuth';
import Loader from '@/components/Loader';
import EmptyState from '@/components/EmptyState';
import { formatPrice } from '@/components/ProductCard';
import type { Order } from '@/types';

function formatDate(value: string): string {
  const d = new Date(value);
  return Number.isNaN(d.getTime())
    ? value
    : d.toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short',
      });
}

function statusBadge(status: string): string {
  if (status === 'CONFIRMED') return 'text-bg-success';
  if (status === 'PENDING_PAYMENT') return 'text-bg-warning';
  return 'text-bg-secondary';
}

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    let active = true;
    orderApi
      .getOrders(user.emailId)
      .then((data) => {
        if (active) setOrders(data);
      })
      .catch(() => {
        if (active) setOrders([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [user]);

  if (loading) return <div className="container py-5"><Loader label="Loading your orders…" /></div>;

  return (
    <div className="container py-4">
      <h1 className="section-title mb-1">My orders</h1>
      <p className="section-subtitle">Review your purchase history and order details.</p>

      {orders.length === 0 ? (
        <div className="ekart-card">
          <EmptyState
            icon="📦"
            title="No orders yet"
            message="When you place an order, it will appear here."
            action={<Link to="/products" className="btn btn-brand">Start shopping</Link>}
          />
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {orders.map((order) => (
            <article className="ekart-card p-4" key={order.orderId}>
              <div className="d-flex flex-wrap justify-content-between align-items-start gap-2 mb-3">
                <div>
                  <h2 className="h6 mb-1">Order #{order.orderId}</h2>
                  <p className="small text-muted-2 mb-0">Placed on {formatDate(order.dateOfOrder)}</p>
                </div>
                <span className={`badge ${statusBadge(order.orderStatus)}`}>
                  {order.orderStatus.replace('_', ' ')}
                </span>
              </div>

              <div className="row g-3 small text-muted-2 mb-3">
                <div className="col-sm-6 col-lg-3">
                  <span className="d-block fw-semibold text-dark">Delivery address</span>
                  {order.deliveryAddress}
                </div>
                <div className="col-sm-6 col-lg-3">
                  <span className="d-block fw-semibold text-dark">Payment</span>
                  {order.paymentThrough} card
                </div>
                <div className="col-sm-6 col-lg-3">
                  <span className="d-block fw-semibold text-dark">Delivery by</span>
                  {formatDate(order.dateOfDelivery)}
                </div>
                <div className="col-sm-6 col-lg-3">
                  <span className="d-block fw-semibold text-dark">Discount</span>
                  {formatPrice(order.discount)}
                </div>
              </div>

              <div className="table-responsive">
                <table className="table table-sm align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Item</th>
                      <th className="text-center">Qty</th>
                      <th className="text-end">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.orderedProducts.map((op) => (
                      <tr key={op.orderedProductId}>
                        <td>{op.product.name}</td>
                        <td className="text-center">{op.quantity}</td>
                        <td className="text-end">{formatPrice(op.product.price)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan={2} className="text-end fw-semibold">Total paid</td>
                      <td className="text-end fw-bold">{formatPrice(order.totalPrice)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
