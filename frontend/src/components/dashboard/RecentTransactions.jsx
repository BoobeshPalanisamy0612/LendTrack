import { formatCurrency } from '../../utils/formatCurrency';
import { formatRelative } from '../../utils/formatDate';
import EmptyState from '../ui/EmptyState';

const RecentTransactions = ({ transactions = [] }) => {
  if (transactions.length === 0) {
    return <EmptyState title="No payments yet" description="Recorded payments will appear here as they come in." />;
  }

  return (
    <ul className="divide-y divide-ledger-line dark:divide-ledger-lineDark">
      {transactions.map((t) => (
        <li key={t._id} className="flex items-center justify-between py-3">
          <div>
            <p className="text-sm font-medium text-ledger-navy dark:text-ledger-cream">
              {t.loanId?.personName || 'Unknown'}
            </p>
            <p className="text-xs text-ledger-slate">{formatRelative(t.paymentDate)} · {t.method.replace('_', ' ')}</p>
          </div>
          <span className="amount-mono text-sm font-medium text-ledger-green">+{formatCurrency(t.paidAmount)}</span>
        </li>
      ))}
    </ul>
  );
};

export default RecentTransactions;
