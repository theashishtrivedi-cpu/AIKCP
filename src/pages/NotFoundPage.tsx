import { Link } from 'react-router-dom';
import { ArrowLeft, Home } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-2xl items-center justify-center px-5 py-16">
      <section className="w-full rounded-2xl border border-[#e9e4db] bg-white px-7 py-12 text-center shadow-sm">
        <p className="text-6xl font-semibold text-[#9a6a1f]">404</p>

        <h1 className="mt-5 text-3xl font-semibold text-[#182331]">
          Page not found
        </h1>

        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#68717c]">
          The page you are looking for does not exist or the address may be
          incorrect.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-lg bg-[#182331] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#273545]"
          >
            <Home size={16} />
            Go home
          </Link>

          <button
            type="button"
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 rounded-lg border border-[#dcd7ce] bg-[#fbfaf7] px-4 py-2.5 text-sm font-semibold text-[#182331] transition hover:bg-white"
          >
            <ArrowLeft size={16} />
            Go back
          </button>
        </div>
      </section>
    </main>
  );
}