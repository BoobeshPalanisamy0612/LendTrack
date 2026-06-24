import { Outlet, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const AuthLayout = () => {
  return (
    <div className="flex min-h-screen bg-ledger-cream dark:bg-ledger-dark">
      <div className="flex w-full flex-col items-center justify-center px-4 py-10 sm:px-6 lg:w-1/2">
        <div className="w-full max-w-sm">
          <Link to="/" className="mb-10 flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-ledger-navy dark:bg-ledger-green">
              <svg width="17" height="17" viewBox="0 0 32 32" fill="none">
                <path d="M9 10h14M9 16h14M9 22h9" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
              </svg>
            </div>
            <span className="font-display text-xl font-semibold tracking-tight text-ledger-navy dark:text-ledger-cream">LendTrack</span>
          </Link>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
            <Outlet />
          </motion.div>
        </div>
      </div>

      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-ledger-navy p-12 dark:bg-ledger-darkSurface lg:flex">
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{ backgroundImage: 'repeating-linear-gradient(0deg, #fff 0, #fff 1px, transparent 1px, transparent 28px)' }}
        />
        <div className="relative z-10">
          <p className="font-display text-3xl leading-tight text-white">
            Every rupee you lend or borrow,
            <br />
            kept in one honest ledger.
          </p>
          <p className="mt-4 max-w-md text-sm text-white/60">
            Track money between friends and family without the awkwardness — due dates, interest, and payment
            history, all in one place.
          </p>
        </div>
        <div className="relative z-10 flex items-center gap-8 text-white/80">
          <div>
            <p className="font-mono text-2xl font-semibold text-ledger-green">₹24.5L+</p>
            <p className="text-xs text-white/50">tracked by users</p>
          </div>
          <div>
            <p className="font-mono text-2xl font-semibold text-ledger-amber">12,400+</p>
            <p className="text-xs text-white/50">reminders sent</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
