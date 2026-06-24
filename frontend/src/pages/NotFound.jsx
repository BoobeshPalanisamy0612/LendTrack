import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

const NotFound = () => (
  <div className="flex h-screen flex-col items-center justify-center gap-3 bg-ledger-cream px-4 text-center dark:bg-ledger-dark">
    <p className="font-display text-6xl font-semibold text-ledger-navy/20 dark:text-ledger-cream/20">404</p>
    <h1 className="font-display text-2xl font-semibold text-ledger-navy dark:text-ledger-cream">Page not found</h1>
    <p className="max-w-sm text-sm text-ledger-slate">The page you're looking for doesn't exist or may have moved.</p>
    <Link to="/dashboard">
      <Button className="mt-4">Back to dashboard</Button>
    </Link>
  </div>
);

export default NotFound;
