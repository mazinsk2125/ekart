import { useEffect, useState } from 'react';
import { authApi } from '@/api/authApi';
import { useAuth } from '@/hooks/useAuth';
import Loader from '@/components/Loader';
import type { Customer } from '@/types';

export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const [profile, setProfile] = useState<Customer | null>(user);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    let active = true;
    authApi
      .getProfile(user.emailId)
      .then((data) => {
        if (!active) return;
        setProfile(data);
        setUser(data);
      })
      .catch((err: unknown) => {
        if (active) setError(err instanceof Error ? err.message : 'Could not load profile');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.emailId]);

  if (loading) return <div className="container py-5"><Loader label="Loading your details…" /></div>;
  if (error) return <div className="container py-5"><div className="alert alert-danger">{error}</div></div>;
  if (!profile) return null;

  const initials = profile.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="container py-4">
      <h1 className="section-title mb-1">My details</h1>
      <p className="section-subtitle">Your personal information on file with EKart.</p>

      <div className="row justify-content-center">
        <div className="col-lg-7">
          <section className="ekart-card p-4">
            <div className="d-flex align-items-center gap-3 mb-4">
              <div
                className="rounded-circle d-grid place-items-center text-white fw-bold"
                style={{
                  width: 64,
                  height: 64,
                  display: 'grid',
                  placeItems: 'center',
                  fontSize: '1.4rem',
                  background: 'linear-gradient(135deg, var(--ek-primary), var(--ek-accent))',
                }}
                aria-hidden="true"
              >
                {initials}
              </div>
              <div>
                <h2 className="h5 mb-0">{profile.name}</h2>
                <span className="text-muted-2">{profile.emailId}</span>
              </div>
            </div>

            <dl className="row mb-0">
              <dt className="col-sm-4 text-muted-2">Full name</dt>
              <dd className="col-sm-8">{profile.name}</dd>

              <dt className="col-sm-4 text-muted-2">Email</dt>
              <dd className="col-sm-8">{profile.emailId}</dd>

              <dt className="col-sm-4 text-muted-2">Phone number</dt>
              <dd className="col-sm-8">{profile.phoneNumber}</dd>

              <dt className="col-sm-4 text-muted-2">Address</dt>
              <dd className="col-sm-8">{profile.address}</dd>
            </dl>
          </section>
        </div>
      </div>
    </div>
  );
}
