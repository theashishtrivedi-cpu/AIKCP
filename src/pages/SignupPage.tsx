import { FormEvent, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, LockKeyhole, Mail, UserRound } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function SignupPage() {
  const { user, loading, signUp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
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
    setSuccess('');

    const normalizedDisplayName = displayName.trim();
    const normalizedEmail = email.trim();

    if (!normalizedDisplayName || !normalizedEmail || !password) {
      setError('Please complete all required fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setSubmitting(true);

    const result = await signUp(
      normalizedEmail,
      password,
      normalizedDisplayName
    );

    setSubmitting(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    setSuccess('Your account has been created. Redirecting...');

    setTimeout(() => {
      navigate(from, { replace: true });
    }, 800);
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
            Create your account
          </h1>

          <p className="mt-2 text-sm leading-6 text-[#68717c]">
            Join the community and participate in discussions.
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

        {success && (
          <div
            role="status"
            className="mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
          >
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="signup-name"
              className="mb-2 block text-sm font-medium text-[#182331]"
            >
              Display name
            </label>

            <div className="relative">
              <UserRound
                size={17}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#8a939d]"
              />

              <input
                id="signup-name"
                type="text"
                autoComplete="name"
                value={displayName}
                onChange={(event) => setDisplayName(event.target.value)}
                placeholder="Your display name"
                className="w-full rounded-lg border border-[#dcd7ce] bg-[#fbfaf7] py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-[#b27a24] focus:ring-2 focus:ring-[#b27a24]/10"
                required
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="signup-email"
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
                id="signup-email"
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
              htmlFor="signup-password"
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
                id="signup-password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="At least 6 characters"
                className="w-full rounded-lg border border-[#dcd7ce] bg-[#fbfaf7] py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-[#b27a24] focus:ring-2 focus:ring-[#b27a24]/10"
                required
                minLength={6}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="signup-confirm-password"
              className="mb-2 block text-sm font-medium text-[#182331]"
            >
              Confirm password
            </label>

            <div className="relative">
              <LockKeyhole
                size={17}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#8a939d]"
              />

              <input
                id="signup-confirm-password"
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Re-enter your password"
                className="w-full rounded-lg border border-[#dcd7ce] bg-[#fbfaf7] py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-[#b27a24] focus:ring-2 focus:ring-[#b27a24]/10"
                required
                minLength={6}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#182331] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#273545] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? 'Creating account...' : 'Create account'}
            {!submitting && <ArrowRight size={16} />}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[#68717c]">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-semibold text-[#9a6a1f] hover:underline"
          >
            Sign in
          </Link>
        </p>
      </section>
    </main>
  );
}