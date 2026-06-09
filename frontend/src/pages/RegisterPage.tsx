import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/context/ToastContext';
import type { RegisterRequest } from '@/types';

type FormErrors = Partial<Record<keyof RegisterRequest, string>>;

const NAME_RE = /^[A-Za-z]+( [A-Za-z]+)*$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\d{10}$/;
const PASSWORD_RE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

const EMPTY: RegisterRequest = {
  name: '',
  emailId: '',
  phoneNumber: '',
  address: '',
  password: '',
};

export default function RegisterPage() {
  const { register } = useAuth();
  const { notify } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState<RegisterRequest>(EMPTY);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const update = <K extends keyof RegisterRequest>(key: K, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const validate = (): boolean => {
    const next: FormErrors = {};
    if (!NAME_RE.test(form.name.trim())) {
      next.name = 'Name should contain only alphabets with a single space between words.';
    }
    if (!EMAIL_RE.test(form.emailId.trim())) {
      next.emailId = 'Enter a valid email address with a domain.';
    }
    if (!PHONE_RE.test(form.phoneNumber.trim())) {
      next.phoneNumber = 'Phone number should be exactly 10 digits.';
    }
    if (!form.address.trim()) {
      next.address = 'Address is required.';
    }
    if (!PASSWORD_RE.test(form.password)) {
      next.password =
        'Password must have at least one uppercase, one lowercase, one digit and one special character (min 8 chars).';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setServerError(null);
    if (!validate()) return;

    setSubmitting(true);
    try {
      const message = await register({ ...form, newPassword: form.password });
      notify(message || 'Registration successful! Please sign in.', 'success');
      navigate('/login', { replace: true });
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="auth-wrapper">
      <div className="auth-card" style={{ maxWidth: 520 }}>
        <header className="text-center mb-4">
          <span className="ekart-brand justify-content-center">
            <span className="logo-badge" aria-hidden="true">E</span>
            EKart
          </span>
          <h1 className="h4 mt-3 mb-1">Create your account</h1>
          <p className="text-muted-2 mb-0">Join EKart and start shopping in minutes.</p>
        </header>

        {serverError && (
          <div className="alert alert-danger py-2" role="alert">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-3">
            <label htmlFor="reg-name" className="form-label">Full name</label>
            <input
              id="reg-name"
              type="text"
              className={`form-control ${errors.name ? 'is-invalid' : ''}`}
              value={form.name}
              onChange={(e) => update('name', e.target.value)}
              placeholder="John Doe"
              required
            />
            {errors.name && <div className="invalid-feedback">{errors.name}</div>}
          </div>

          <div className="mb-3">
            <label htmlFor="reg-email" className="form-label">Email address</label>
            <input
              id="reg-email"
              type="email"
              className={`form-control ${errors.emailId ? 'is-invalid' : ''}`}
              value={form.emailId}
              onChange={(e) => update('emailId', e.target.value)}
              placeholder="you@example.com"
              required
            />
            {errors.emailId && <div className="invalid-feedback">{errors.emailId}</div>}
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="reg-phone" className="form-label">Phone number</label>
              <input
                id="reg-phone"
                type="tel"
                inputMode="numeric"
                className={`form-control ${errors.phoneNumber ? 'is-invalid' : ''}`}
                value={form.phoneNumber}
                onChange={(e) => update('phoneNumber', e.target.value.replace(/\D/g, '').slice(0, 10))}
                placeholder="9876543210"
                required
              />
              {errors.phoneNumber && <div className="invalid-feedback">{errors.phoneNumber}</div>}
            </div>

            <div className="col-md-6 mb-3">
              <label htmlFor="reg-password" className="form-label">Password</label>
              <input
                id="reg-password"
                type="password"
                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                value={form.password}
                onChange={(e) => update('password', e.target.value)}
                placeholder="••••••••"
                autoComplete="new-password"
                required
              />
              {errors.password && <div className="invalid-feedback">{errors.password}</div>}
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="reg-address" className="form-label">Address</label>
            <textarea
              id="reg-address"
              className={`form-control ${errors.address ? 'is-invalid' : ''}`}
              rows={2}
              value={form.address}
              onChange={(e) => update('address', e.target.value)}
              placeholder="12 Baker Street, Springfield"
              required
            />
            {errors.address && <div className="invalid-feedback">{errors.address}</div>}
          </div>

          <button type="submit" className="btn btn-brand w-100 py-2" disabled={submitting}>
            {submitting ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="text-center mt-4 mb-0 small">
          Already have an account?{' '}
          <Link to="/login" className="fw-semibold">
            Sign in
          </Link>
        </p>
      </div>
    </section>
  );
}
