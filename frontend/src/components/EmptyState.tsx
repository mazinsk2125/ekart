import type { ReactNode } from 'react';

interface EmptyStateProps {
  icon?: string;
  title: string;
  message?: string;
  action?: ReactNode;
}

export default function EmptyState({ icon = '🛍️', title, message, action }: EmptyStateProps) {
  return (
    <div className="empty-state">
      <div className="icon" aria-hidden="true">{icon}</div>
      <h3 className="h5 mt-2">{title}</h3>
      {message && <p className="mb-3">{message}</p>}
      {action}
    </div>
  );
}
