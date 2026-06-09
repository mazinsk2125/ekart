import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="container py-5 text-center">
      <p className="display-1 fw-bold text-primary mb-0">404</p>
      <h1 className="h4">Page not found</h1>
      <p className="text-muted-2">The page you're looking for doesn't exist or has moved.</p>
      <Link to="/" className="btn btn-brand mt-2">Back to home</Link>
    </div>
  );
}
