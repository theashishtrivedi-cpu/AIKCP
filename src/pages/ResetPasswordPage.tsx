import { FormEvent, useEffect, useState } from 'react';
import { LockKeyhole, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const { updatePassword } = useAuth();

  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let mounted = true;

    const initialise = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!mounted) return;

      if (!session) {
        setError(
          'The password recovery session is missing or has expired. Please request a new recovery email.'
        );
        return;
      }

      setReady(true);
    };

    void initialise();

    return () => {
      mounted = false;
    };
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError('');
    setMessage('');

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setSubmitting(true);

    const result = await updatePassword(password);

    setSubmitting(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    setMessage('Password updated successfully. You can now sign in.');

    await supabase.auth.signOut();

    setTimeout(() => {
      navigate('/login', { replace: true });
    }, 800);
  };

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-md items-center justify-center px-5 py-12">
      <section className="w-full rounded-2xl border border-[#e9e4db] bg-white p-7 shadow-sm">
        <div className="mb-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.16em] text-[#9a6a1f]">
            Sanatan Board India
          </p>

          <h1 className="text-3xl font-semibold text-[#182331]">
            Reset password
          </h1>

          <p className="mt-2 text-sm leading-6 text-[#68717c]">
            Set a new password for your account.
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

        {message && (
          <div
            role="status"
            className="mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
          >
            {message}
          </div>
        )}

        {ready && !message && (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="reset-password"
                className="mb-2 block text-sm font-medium text-[#182331]"
              >
                New password
              </label>

              <div className="relative">
                <LockKeyhole
                  size={17}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#8a939d]"
                />

                <input
                  id="reset-password"
                  type="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter new password"
                  className="w-full rounded-lg border border-[#dcd7ce] bg-[#fbfaf7] py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-[#b27a24] focus:ring-2 focus:ring-[#b27a24]/10"
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="reset-password-confirm"
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
                  id="reset-password-confirm"
                  type="password"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder="Confirm new password"
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
              {submitting ? 'Updating password...' : 'Update password'}
              {!submitting && <ArrowRight size={16} />}
            </button>
          </form>
        )}
      </section>
    </main>
  );
}
