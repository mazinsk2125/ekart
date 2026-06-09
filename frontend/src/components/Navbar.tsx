import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { count, refresh } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      void refresh();
    }
  }, [isAuthenticated, refresh]);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <header>
      <nav className="navbar navbar-expand-lg ekart-navbar sticky-top" aria-label="Main navigation">
        <div className="container">
          <Link className="navbar-brand ekart-brand" to={isAuthenticated ? '/' : '/login'}>
            <span className="logo-badge" aria-hidden="true">E</span>
            EKart
          </Link>

          {isAuthenticated && (
            <>
              <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#mainNav"
                aria-controls="mainNav"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span className="navbar-toggler-icon" />
              </button>

              <div className="collapse navbar-collapse" id="mainNav">
                <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-3">
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/" end>
                      Home
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/products">
                      Products
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/orders">
                      My Orders
                    </NavLink>
                  </li>
                </ul>

                <div className="d-flex align-items-center gap-2">
                  <NavLink
                    to="/cart"
                    className="btn btn-outline-brand position-relative"
                    aria-label={`Cart with ${count} items`}
                  >
                    Cart
                    {count > 0 && (
                      <span className="position-absolute top-0 start-100 badge rounded-pill text-bg-danger cart-badge">
                        {count}
                        <span className="visually-hidden">items in cart</span>
                      </span>
                    )}
                  </NavLink>

                  <div className="dropdown">
                    <button
                      className="btn btn-brand dropdown-toggle"
                      type="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      {user?.name?.split(' ')[0] ?? 'Account'}
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end shadow">
                      <li>
                        <span className="dropdown-item-text small text-muted-2">{user?.emailId}</span>
                      </li>
                      <li><hr className="dropdown-divider" /></li>
                      <li>
                        <Link className="dropdown-item" to="/profile">My Details</Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" to="/cards">My Cards</Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" to="/orders">My Orders</Link>
                      </li>
                      <li><hr className="dropdown-divider" /></li>
                      <li>
                        <button className="dropdown-item text-danger" onClick={handleLogout}>
                          Logout
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
