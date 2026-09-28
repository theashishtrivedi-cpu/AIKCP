import { FormEvent, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, LockKeyhole, Mail } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const { user, loading, signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const from = (location.state as { from?: string } | null)?.from || '/';

  useEffect(() => {
    if (!loading && user) {
      navigate(from, { replace: true });
    }
  }, [loading, user, navigate, from]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError('');

    const normalizedEmail = email.trim();

    if (!normalizedEmail || !password) {
      setError('Please enter your email and password.');
      return;
    }

    setSubmitting(true);

    const result = await signIn(normalizedEmail, password);

    setSubmitting(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    navigate(from, { replace: true });
  };

  if (loading) {
    return (
      <main className="mx-auto flex min-h-[70vh] max-w-md items-center justify-center px-5">
        <p className="text-sm text-[#68717c]">Checking your session...</p>
      </main>
    );
  }

  if (user) {
    return null;
  }

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-md items-center justify-center px-5 py-12">
      <section className="w-full rounded-2xl border border-[#e9e4db] bg-white p-7 shadow-sm">
        <div className="mb-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.16em] text-[#9a6a1f]">
            Sanatan Board India
          </p>

          <h1 className="text-3xl font-semibold text-[#182331]">
            Welcome back
          </h1>

          <p className="mt-2 text-sm leading-6 text-[#68717c]">
            Sign in to continue to your account.
          </p>
        </div>

        {error && (
          <div
            role="alert"
            className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="login-email"
              className="mb-2 block text-sm font-medium text-[#182331]"
            >
              Email
            </label>

            <div className="relative">
              <Mail
                size={17}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#8a939d]"
              />

              <input
                id="login-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-lg border border-[#dcd7ce] bg-[#fbfaf7] py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-[#b27a24] focus:ring-2 focus:ring-[#b27a24]/10"
                required
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="login-password"
              className="mb-2 block text-sm font-medium text-[#182331]"
            >
              Password
            </label>

            <div className="relative">
              <LockKeyhole
                size={17}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#8a939d]"
              />

              <input
                id="login-password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                className="w-full rounded-lg border border-[#dcd7ce] bg-[#fbfaf7] py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-[#b27a24] focus:ring-2 focus:ring-[#b27a24]/10"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#182331] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#273545] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? 'Signing in...' : 'Sign in'}
            {!submitting && <ArrowRight size={16} />}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[#68717c]">
          Don't have an account?{' '}
          <Link
            to="/signup"
            className="font-semibold text-[#9a6a1f] hover:underline"
          >
            Create one
          </Link>
        </p>
      </section>
    </main>
  );
}