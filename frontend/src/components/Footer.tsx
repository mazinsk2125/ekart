export default function Footer() {
  return (
    <footer className="ekart-footer py-4 mt-5">
      <div className="container">
        <div className="row gy-3 align-items-center">
          <div className="col-md-6">
            <span className="ekart-brand">
              <span className="logo-badge" aria-hidden="true">E</span>
              EKart
            </span>
            <p className="mb-0 small mt-2">
              A modern online shopping experience — browse, add to cart and checkout securely.
            </p>
          </div>
          <div className="col-md-6 text-md-end small">
            <p className="mb-1">&copy; {new Date().getFullYear()} EKart. All rights reserved.</p>
            <p className="mb-0">Built with React, TypeScript &amp; Spring Boot microservices.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
