import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { cartApi } from '../api/cartApi';
import { paymentApi } from '../api/paymentApi';
import { orderApi } from '../api/orderApi';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import { useToast } from '../context/ToastContext';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';
import { formatPrice } from '../components/ProductCard';
import type { Card, CardType, CartProduct } from '../types';

type Step = 'review' | 'confirm' | 'pay' | 'done';

function maskCard(cardNumber: string): string {
  return `•••• •••• •••• ${cardNumber.slice(-4)}`;
}

/** Parses "...with order id : 5" into 5. */
function extractOrderId(message: string): number | null {
  const match = message.match(/(\d+)\s*$/);
  return match ? Number(match[1]) : null;
}

export default function PlaceOrderPage() {
  const { user } = useAuth();
  const { refresh, clearLocal } = useCart();
  const { notify } = useToast();

  const [items, setItems] = useState<CartProduct[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);

  const [step, setStep] = useState<Step>('review');
  const [selectedCardId, setSelectedCardId] = useState<number | null>(null);
  const [orderId, setOrderId] = useState<number | null>(null);
  const [cvv, setCvv] = useState('');
  const [working, setWorking] = useState(false);

  useEffect(() => {
    if (!user) return;
    let active = true;
    Promise.all([
      cartApi.getCart(user.emailId).catch(() => [] as CartProduct[]),
      paymentApi.getCards(user.emailId, 'all').catch(() => [] as Card[]),
    ])
      .then(([cartItems, cardList]) => {
        if (!active) return;
        setItems(cartItems);
        setCards(cardList);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [user]);

  const selectedCard = useMemo(
    () => cards.find((c) => c.cardId === selectedCardId) ?? null,
    [cards, selectedCardId],
  );

  const subtotal = useMemo(
    () => items.reduce((s, i) => s + i.product.price * i.quantity, 0),
    [items],
  );

  const discountRate =
    selectedCard?.cardType === 'Credit' ? 0.1 : selectedCard?.cardType === 'Debit' ? 0.05 : 0;
  const discount = Math.round(subtotal * discountRate * 100) / 100;
  const total = Math.round((subtotal - discount) * 100) / 100;

  const confirmOrder = async () => {
    if (!user || !selectedCard) return;
    setWorking(true);
    try {
      const message = await orderApi.placeOrder({
        customerEmailId: user.emailId,
        paymentThrough: selectedCard.cardType as CardType,
      });
      const id = extractOrderId(message);
      if (!id) throw new Error('Could not read the generated order id');
      setOrderId(id);
      clearLocal();
      await refresh();
      notify(`Order generated with id ${id}. Enter CVV to pay.`, 'info');
      setStep('pay');
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Could not place order', 'danger');
    } finally {
      setWorking(false);
    }
  };

  const pay = async () => {
    if (!user || !selectedCard || orderId == null) return;
    if (!/^\d{3}$/.test(cvv)) {
      notify('CVV must be exactly 3 digits.', 'warning');
      return;
    }
    setWorking(true);
    try {
      const message = await paymentApi.makePayment(user.emailId, orderId, {
        cardId: selectedCard.cardId,
        cvv,
      });
      notify(message || 'Payment successful!', 'success');
      setStep('done');
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Payment failed', 'danger');
    } finally {
      setWorking(false);
    }
  };

  if (loading) return <div className="container py-5"><Loader label="Preparing checkout…" /></div>;

  if (items.length === 0 && step === 'review') {
    return (
      <div className="container py-4">
        <h1 className="section-title mb-4">Checkout</h1>
        <div className="ekart-card">
          <EmptyState
            icon="🧾"
            title="Nothing to checkout"
            message="Your cart is empty. Add products before placing an order."
            action={<Link to="/products" className="btn btn-brand">Browse products</Link>}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h1 className="section-title mb-1">Checkout</h1>
      <p className="section-subtitle">Choose a card, confirm your order and pay securely.</p>

      <div className="row g-4">
        <div className="col-lg-7">
          {step === 'done' ? (
            <div className="ekart-card p-4 text-center">
              <div style={{ fontSize: '3rem' }}>✅</div>
              <h2 className="h4 mt-2">Payment successful!</h2>
              <p className="text-muted-2">
                Your order <strong>#{orderId}</strong> has been confirmed and is on its way.
              </p>
              <div className="d-flex gap-2 justify-content-center mt-3">
                <Link to="/orders" className="btn btn-brand">View my orders</Link>
                <Link to="/products" className="btn btn-outline-brand">Keep shopping</Link>
              </div>
            </div>
          ) : (
            <div className="ekart-card p-4">
              {/* Step indicator */}
              <div className="d-flex align-items-center gap-2 mb-4">
                {(['Select card', 'Confirm', 'Pay'] as const).map((label, idx) => {
                  const states: Step[] = ['review', 'confirm', 'pay'];
                  const current = states.indexOf(step);
                  const active = idx <= current;
                  return (
                    <div key={label} className="d-flex align-items-center gap-2">
                      <span
                        className="step-pill"
                        style={active ? { background: 'var(--ek-primary)', color: '#fff' } : undefined}
                      >
                        {idx + 1}
                      </span>
                      <span className={active ? 'fw-semibold' : 'text-muted-2'}>{label}</span>
                      {idx < 2 && <span className="text-muted-2 mx-1">→</span>}
                    </div>
                  );
                })}
              </div>

              {/* Card selection */}
              {(step === 'review' || step === 'confirm') && (
                <section>
                  <h2 className="h6 mb-3">Select a payment card</h2>
                  {cards.length === 0 ? (
                    <EmptyState
                      icon="💳"
                      title="No saved cards"
                      message="Add a card to continue with your purchase."
                      action={<Link to="/cards" className="btn btn-brand">Add a card</Link>}
                    />
                  ) : (
                    <div className="row g-3">
                      {cards.map((card) => (
                        <div className="col-md-6" key={card.cardId}>
                          <button
                            type="button"
                            className={`ekart-card selectable-card p-3 w-100 text-start ${
                              selectedCardId === card.cardId ? 'selected' : ''
                            }`}
                            onClick={() => setSelectedCardId(card.cardId)}
                            aria-pressed={selectedCardId === card.cardId}
                          >
                            <div className="d-flex justify-content-between">
                              <span className="badge text-bg-primary">{card.cardType}</span>
                              {selectedCardId === card.cardId && <span aria-hidden="true">✓</span>}
                            </div>
                            <div className="fw-semibold mt-2" style={{ letterSpacing: '0.05em' }}>
                              {maskCard(card.cardNumber)}
                            </div>
                            <div className="small text-muted-2">
                              {card.nameOnCard} · exp {card.expiryDate}
                            </div>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {cards.length > 0 && (
                    <button
                      className="btn btn-brand mt-4"
                      disabled={!selectedCard || working}
                      onClick={confirmOrder}
                    >
                      {working ? 'Generating order…' : 'Confirm Order'}
                    </button>
                  )}
                </section>
              )}

              {/* Payment (CVV) */}
              {step === 'pay' && selectedCard && (
                <section>
                  <div className="alert alert-info">
                    Order <strong>#{orderId}</strong> generated. Enter the CVV of your{' '}
                    {selectedCard.cardType.toLowerCase()} card ending{' '}
                    {selectedCard.cardNumber.slice(-4)} to complete payment.
                  </div>
                  <div className="mb-3" style={{ maxWidth: 220 }}>
                    <label htmlFor="pay-cvv" className="form-label">CVV</label>
                    <input
                      id="pay-cvv"
                      type="password"
                      inputMode="numeric"
                      className="form-control"
                      value={cvv}
                      maxLength={3}
                      onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                      placeholder="123"
                    />
                  </div>
                  <button className="btn btn-brand" onClick={pay} disabled={working}>
                    {working ? 'Processing…' : `Pay ${formatPrice(total)}`}
                  </button>
                </section>
              )}
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="col-lg-5">
          <aside className="ekart-card p-4">
            <h2 className="h6 mb-3">Order summary</h2>
            <ul className="list-unstyled mb-3">
              {items.map((i) => (
                <li key={i.cartProductId} className="d-flex justify-content-between small mb-2">
                  <span>{i.product.name} × {i.quantity}</span>
                  <span>{formatPrice(i.product.price * i.quantity)}</span>
                </li>
              ))}
            </ul>
            <hr />
            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted-2">Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted-2">
                Discount {selectedCard ? `(${discountRate * 100}%)` : ''}
              </span>
              <span className="text-success">− {formatPrice(discount)}</span>
            </div>
            <hr />
            <div className="d-flex justify-content-between fs-5 fw-bold">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
            {!selectedCard && (
              <p className="small text-muted-2 mt-2 mb-0">
                Select a card to see your discount and final total.
              </p>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
