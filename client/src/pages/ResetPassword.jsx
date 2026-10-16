import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { setSession } = useAuth();
  const [form, setForm] = useState({ password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const { data } = await api.post(`/auth/reset-password/${token}`, form);
      setSession(data.token, data.user);
      setSuccess('Password updated successfully. Redirecting...');
      setTimeout(() => navigate('/'), 800);
    } catch (err) {
      setError(err.response?.data?.message || 'Reset failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden min-h-screen lg:block">
        <img
          src="https://images.unsplash.com/photo-1488161628813-04466f872be2?w=1200&q=80"
          alt="Fashion model"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>

      <div className="relative flex flex-col justify-center px-6 py-12 md:px-16 lg:px-20">
        <Link to="/" className="font-volkhov text-[42px] md:text-[66px] leading-none">
          FASCO
        </Link>

        <form onSubmit={onSubmit} className="mt-10 max-w-[628px]">
          <h1 className="font-volkhov text-[30px]">Set New Password</h1>
          <p className="mt-3 text-sm text-fasco-muted">
            Enter a new password for your FASCO account.
          </p>

          {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
          {success && <p className="mt-4 text-sm text-green-600">{success}</p>}

          <div className="mt-8 space-y-6">
            <div>
              <label className="text-fasco-muted">New Password</label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={onChange}
                className="underline-input"
                minLength={6}
                required
              />
            </div>
            <div>
              <label className="text-fasco-muted">Confirm Password</label>
              <input
                name="confirmPassword"
                type="password"
                value={form.confirmPassword}
                onChange={onChange}
                className="underline-input"
                minLength={6}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary mt-10 w-full max-w-[575px] shadow-lg shadow-black/25"
          >
            {loading ? 'Updating...' : 'Update Password'}
          </button>

          <p className="mt-6 text-center text-sm">
            <Link to="/signin" className="font-semibold underline">
              Back to Sign In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
