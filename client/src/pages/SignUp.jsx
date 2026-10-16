import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { MdEmail } from 'react-icons/md';
import { useAuth } from '../context/AuthContext';

export default function SignUp() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
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
        <Link to="/" className="font-volkhov text-[42px] md:text-[66px] leading-none animate-fade-up">
          FASCO
        </Link>

        <form onSubmit={onSubmit} className="mt-8 max-w-[628px] animate-fade-up animate-delay-1">
          <h1 className="font-volkhov text-[30px]">Create Account</h1>

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

          <div className="grid gap-6 sm:grid-cols-2">
            {[
              ['firstName', 'First Name'],
              ['lastName', 'Last Name'],
              ['email', 'Email Address', 'email'],
              ['phone', 'Phone Number', 'tel'],
              ['password', 'Password', 'password'],
              ['confirmPassword', 'Confirm Password', 'password'],
            ].map(([name, label, type = 'text']) => (
              <div key={name}>
                <label className="text-fasco-muted">{label}</label>
                <input
                  name={name}
                  type={type}
                  value={form[name]}
                  onChange={onChange}
                  className="underline-input"
                  required={name !== 'phone'}
                />
              </div>
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary mt-10 w-full shadow-lg shadow-black/25"
          >
            {loading ? 'Creating...' : 'Create Account'}
          </button>

          <p className="mt-6 text-center text-sm">
            Already have an account?{' '}
            <Link to="/signin" className="font-semibold underline">
              Login
            </Link>
          </p>
        </form>

        <p className="mt-12 text-right text-sm text-fasco-muted">
          FASCO Terms & Codnitions
        </p>
      </div>
    </div>
  );
}
