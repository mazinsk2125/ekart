interface LoaderProps {
  label?: string;
}

export default function Loader({ label = 'Loading…' }: LoaderProps) {
  return (
    <div className="text-center py-5" role="status" aria-live="polite">
      <div className="spinner-border text-primary" aria-hidden="true" />
      <p className="mt-3 text-muted-2 mb-0">{label}</p>
    </div>
  );
}
