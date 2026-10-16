import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { MdEmail } from 'react-icons/md';
import { useAuth } from '../context/AuthContext';

export default function SignIn() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Sign in failed');
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
        <Link to="/" className="font-volkhov text-[42px] md:text-[66px] leading-none animate-fade-up">
          FASCO
        </Link>

        <form onSubmit={onSubmit} className="mt-10 max-w-[628px] animate-fade-up animate-delay-1">
          <h1 className="font-volkhov text-[30px]">Sign In To FASCO</h1>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <button type="button" className="btn-outline gap-2 px-4 py-3 text-sm font-normal">
              <FcGoogle className="text-2xl" />
              Sign up with Google
            </button>
            <button type="button" className="btn-outline gap-2 px-4 py-3 text-sm font-normal">
              <MdEmail className="text-2xl" />
              Sign up with Email
            </button>
          </div>

          <div className="my-8 flex items-center gap-4">
            <span className="h-px flex-1 bg-fasco-line" />
            <span className="text-[30px] font-bold">OR</span>
            <span className="h-px flex-1 bg-fasco-line" />
          </div>

          {error && <p className="mb-4 text-sm text-red-500">{error}</p>}

          <div className="space-y-6">
            <div>
              <label className="text-fasco-muted">Email</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={onChange}
                className="underline-input"
                required
              />
            </div>
            <div>
              <label className="text-fasco-muted">Password</label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={onChange}
                className="underline-input"
                required
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary mt-10 w-full max-w-[575px] mx-auto block shadow-lg shadow-black/25">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          <Link
            to="/signup"
            className="btn-outline mt-4 w-full max-w-[575px] mx-auto block text-center"
          >
            Register Now
          </Link>

          <div className="mt-4 flex justify-end">
            <Link to="/forgot-password" className="text-sm font-bold hover:opacity-70">
              Forget Password?
            </Link>
          </div>
        </form>

        <p className="mt-16 text-right text-sm text-fasco-muted">
          FASCO Terms & Codnitions
        </p>
      </div>
    </div>
  );
}
