import { useEffect, useState, type FormEvent } from 'react';
import { paymentApi } from '../api/paymentApi';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../context/ToastContext';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';
import type { AddCardRequest, Card, CardType } from '../types';

type FormErrors = Partial<Record<keyof AddCardRequest, string>>;

const NAME_RE = /^[A-Za-z]+( [A-Za-z]+)*$/;

const EMPTY: AddCardRequest = {
  cardType: 'Credit',
  cardNumber: '',
  nameOnCard: '',
  cvv: '',
  expiryDate: '',
  customerEmailId: '',
};

function todayPlus(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}

export default function CardsPage() {
  const { user } = useAuth();
  const { notify } = useToast();

  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<AddCardRequest>(EMPTY);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await paymentApi.getCards(user.emailId, 'all');
      setCards(data);
    } catch {
      setCards([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.emailId]);

  const update = <K extends keyof AddCardRequest>(key: K, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const validate = (): boolean => {
    const next: FormErrors = {};
    if (form.cardType !== 'Credit' && form.cardType !== 'Debit') {
      next.cardType = 'Card type must be Credit or Debit.';
    }
    if (!/^\d{16}$/.test(form.cardNumber)) {
      next.cardNumber = 'Card number should be 16 digits.';
    }
    if (!/^\d{3}$/.test(form.cvv)) {
      next.cvv = 'CVV should be 3 digits.';
    }
    if (!NAME_RE.test(form.nameOnCard.trim()) || form.nameOnCard.length > 50) {
      next.nameOnCard = 'Name should contain only letters with single spaces (max 50 chars).';
    }
    if (!form.expiryDate || new Date(form.expiryDate) <= new Date()) {
      next.expiryDate = 'Expiry date should be a future date.';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user || !validate()) return;
    setSubmitting(true);
    try {
      const payload: AddCardRequest = { ...form, customerEmailId: user.emailId };
      const message = await paymentApi.addCard(user.emailId, payload);
      notify(message || 'Card added successfully!', 'success');
      setForm(EMPTY);
      setErrors({});
      await load();
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Could not add card', 'danger');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container py-4">
      <h1 className="section-title mb-1">My cards</h1>
      <p className="section-subtitle">Manage the cards you use for secure payments.</p>

      <div className="row g-4">
        <div className="col-lg-5">
          <section className="ekart-card p-4">
            <h2 className="h6 mb-3">Add a new card</h2>
            <form onSubmit={handleSubmit} noValidate>
              <div className="mb-3">
                <label htmlFor="card-type" className="form-label">Card type</label>
                <select
                  id="card-type"
                  className={`form-select ${errors.cardType ? 'is-invalid' : ''}`}
                  value={form.cardType}
                  onChange={(e) => update('cardType', e.target.value as CardType)}
                >
                  <option value="Credit">Credit</option>
                  <option value="Debit">Debit</option>
                </select>
                {errors.cardType && <div className="invalid-feedback">{errors.cardType}</div>}
              </div>

              <div className="mb-3">
                <label htmlFor="card-number" className="form-label">Card number</label>
                <input
                  id="card-number"
                  inputMode="numeric"
                  className={`form-control ${errors.cardNumber ? 'is-invalid' : ''}`}
                  value={form.cardNumber}
                  onChange={(e) => update('cardNumber', e.target.value.replace(/\D/g, '').slice(0, 16))}
                  placeholder="4111 1111 1111 1111"
                />
                {errors.cardNumber && <div className="invalid-feedback">{errors.cardNumber}</div>}
              </div>

              <div className="mb-3">
                <label htmlFor="card-name" className="form-label">Name on card</label>
                <input
                  id="card-name"
                  className={`form-control ${errors.nameOnCard ? 'is-invalid' : ''}`}
                  value={form.nameOnCard}
                  onChange={(e) => update('nameOnCard', e.target.value)}
                  placeholder="John Doe"
                  maxLength={50}
                />
                {errors.nameOnCard && <div className="invalid-feedback">{errors.nameOnCard}</div>}
              </div>

              <div className="row">
                <div className="col-6 mb-3">
                  <label htmlFor="card-cvv" className="form-label">CVV</label>
                  <input
                    id="card-cvv"
                    type="password"
                    inputMode="numeric"
                    className={`form-control ${errors.cvv ? 'is-invalid' : ''}`}
                    value={form.cvv}
                    onChange={(e) => update('cvv', e.target.value.replace(/\D/g, '').slice(0, 3))}
                    placeholder="123"
                  />
                  {errors.cvv && <div className="invalid-feedback">{errors.cvv}</div>}
                </div>
                <div className="col-6 mb-3">
                  <label htmlFor="card-expiry" className="form-label">Expiry date</label>
                  <input
                    id="card-expiry"
                    type="date"
                    min={todayPlus()}
                    className={`form-control ${errors.expiryDate ? 'is-invalid' : ''}`}
                    value={form.expiryDate}
                    onChange={(e) => update('expiryDate', e.target.value)}
                  />
                  {errors.expiryDate && <div className="invalid-feedback">{errors.expiryDate}</div>}
                </div>
              </div>

              <button type="submit" className="btn btn-brand w-100" disabled={submitting}>
                {submitting ? 'Adding card…' : 'Add card'}
              </button>
            </form>
          </section>
        </div>

        <div className="col-lg-7">
          <section>
            <h2 className="h6 mb-3">Saved cards</h2>
            {loading ? (
              <Loader label="Loading cards…" />
            ) : cards.length === 0 ? (
              <div className="ekart-card">
                <EmptyState icon="💳" title="No cards yet" message="Add a card to pay faster at checkout." />
              </div>
            ) : (
              <div className="row g-3">
                {cards.map((card) => (
                  <div className="col-md-6" key={card.cardId}>
                    <div className="ekart-card p-3 h-100">
                      <div className="d-flex justify-content-between align-items-start">
                        <span className="badge text-bg-primary">{card.cardType}</span>
                        <span className="small text-muted-2">#{card.cardId}</span>
                      </div>
                      <div className="fw-semibold mt-3" style={{ letterSpacing: '0.06em' }}>
                        •••• •••• •••• {card.cardNumber.slice(-4)}
                      </div>
                      <div className="small text-muted-2 mt-1">{card.nameOnCard}</div>
                      <div className="small text-muted-2">Expires {card.expiryDate}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
