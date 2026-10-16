import { Link, Navigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user, loading, logout } = useAuth();

  if (loading) {
    return (
      <div>
        <Header />
        <p className="py-32 text-center text-fasco-muted">Loading profile...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  const initials = `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase();

  return (
    <div>
      <Header />
      <div className="mx-auto max-w-[720px] px-4 py-12 md:px-8">
        <p className="text-sm text-fasco-muted">
          <Link to="/" className="hover:underline">
            Home
          </Link>{' '}
          / Profile
        </p>
        <h1 className="mt-2 font-volkhov text-4xl">My Profile</h1>

        <div className="mt-10 border border-fasco-line p-6 md:p-8">
          <div className="flex flex-wrap items-center gap-5">
            <div className="flex h-20 w-20 items-center justify-center bg-black font-volkhov text-2xl text-white">
              {initials || 'U'}
            </div>
            <div>
              <p className="font-volkhov text-2xl">
                {user.firstName} {user.lastName}
              </p>
              <p className="mt-1 text-sm text-fasco-muted">{user.email}</p>
            </div>
          </div>

          <div className="mt-8 grid gap-4 border-t border-fasco-line pt-6 sm:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-wide text-fasco-muted">First Name</p>
              <p className="mt-1 font-medium">{user.firstName}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-fasco-muted">Last Name</p>
              <p className="mt-1 font-medium">{user.lastName}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-fasco-muted">Email</p>
              <p className="mt-1 font-medium">{user.email}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-fasco-muted">Phone</p>
              <p className="mt-1 font-medium">{user.phone || '—'}</p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/shop" className="btn-primary">
              Continue Shopping
            </Link>
            <button
              type="button"
              onClick={logout}
              className="btn-outline"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
