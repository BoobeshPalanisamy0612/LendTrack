import clsx from 'clsx';

const sizeMap = { sm: 'h-4 w-4 border-2', md: 'h-7 w-7 border-2', lg: 'h-12 w-12 border-[3px]' };

const Spinner = ({ size = 'md', className }) => (
  <span
    className={clsx(
      'inline-block animate-spin rounded-full border-ledger-line dark:border-ledger-lineDark border-t-ledger-green',
      sizeMap[size],
      className
    )}
    role="status"
    aria-label="Loading"
  />
);

export const FullPageSpinner = ({ label = 'Loading LendTrack…' }) => (
  <div className="flex h-screen w-full flex-col items-center justify-center gap-3 bg-ledger-cream dark:bg-ledger-dark">
    <Spinner size="lg" />
    <p className="text-sm text-ledger-slate">{label}</p>
  </div>
);

export default Spinner;
