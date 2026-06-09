import { useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/context/ToastContext';

interface LocationState {
  from?: string;
}

export default function LoginPage() {
  const { login, isLoading } = useAuth();
  const { notify } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as LocationState | null)?.from ?? '/';

  const [emailId, setEmailId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    try {
      await login({ emailId, password });
      notify('Welcome back to EKart!', 'success');
      navigate(from, { replace: true });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed';
      setError(message);
    }
  };

  return (
    <section className="auth-wrapper">
      <div className="auth-card">
        <header className="text-center mb-4">
          <span className="ekart-brand justify-content-center">
            <span className="logo-badge" aria-hidden="true">E</span>
            EKart
          </span>
          <h1 className="h4 mt-3 mb-1">Sign in to your account</h1>
          <p className="text-muted-2 mb-0">Browse products and shop securely.</p>
        </header>

        {error && (
          <div className="alert alert-danger py-2" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-3">
            <label htmlFor="login-email" className="form-label">
              Email address
            </label>
            <input
              id="login-email"
              type="email"
              className="form-control"
              value={emailId}
              onChange={(e) => setEmailId(e.target.value)}
              required
              autoComplete="email"
              placeholder="you@example.com"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="login-password" className="form-label">
              Password
            </label>
            <input
              id="login-password"
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              placeholder="Enter your password"
            />
          </div>

          <button type="submit" className="btn btn-brand w-100 py-2" disabled={isLoading}>
            {isLoading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="text-center mt-4 mb-0 small">
          New to EKart?{' '}
          <Link to="/register" className="fw-semibold">
            Register here
          </Link>
        </p>
      </div>
    </section>
  );
}
