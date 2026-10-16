import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/forgot-password', { email });
      navigate(`/reset-password/${data.resetToken}`, {
        state: { email, message: data.message },
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Could not process request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden min-h-screen lg:block">
        <img
          src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=1200&q=80"
          alt="Fashion model"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>

      <div className="relative flex flex-col justify-center px-6 py-12 md:px-16 lg:px-20">
        <Link to="/" className="font-volkhov text-[42px] md:text-[66px] leading-none">
          FASCO
        </Link>

        <form onSubmit={onSubmit} className="mt-10 max-w-[628px]">
          <h1 className="font-volkhov text-[30px]">Forget Password?</h1>
          <p className="mt-3 text-sm text-fasco-muted">
            Enter your account email and we will let you set a new password.
          </p>

          {error && <p className="mt-4 text-sm text-red-500">{error}</p>}

          <div className="mt-8">
            <label className="text-fasco-muted">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="underline-input"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary mt-10 w-full max-w-[575px] shadow-lg shadow-black/25"
          >
            {loading ? 'Checking...' : 'Reset Password'}
          </button>

          <p className="mt-6 text-center text-sm">
            Remember your password?{' '}
            <Link to="/signin" className="font-semibold underline">
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
