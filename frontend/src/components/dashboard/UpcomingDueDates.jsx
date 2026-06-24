import { Link } from 'react-router-dom';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';
import EmptyState from '../ui/EmptyState';

const urgencyDot = {
  overdue: 'bg-red-500',
  due_today: 'bg-ledger-amber',
  upcoming: 'bg-ledger-green',
};

const urgencyText = {
  overdue: 'Overdue',
  due_today: 'Due today',
  upcoming: 'Upcoming',
};

const UpcomingDueDates = ({ items = [] }) => {
  if (items.length === 0) {
    return (
      <EmptyState
        title="Nothing due soon"
        description="Loans due within the next 7 days, or overdue ones, will show up here."
      />
    );
  }

  return (
    <div className="divide-y divide-ledger-line dark:divide-ledger-lineDark">
      {items.map((item) => (
        <Link
          key={item._id}
          to={`/loans/${item._id}`}
          className="flex items-center justify-between gap-3 py-3 transition-colors hover:bg-ledger-cream/60 dark:hover:bg-ledger-dark/40 -mx-2 px-2 rounded-lg"
        >
          <div className="flex items-center gap-3">
            <span className={`h-2 w-2 shrink-0 rounded-full ${urgencyDot[item.urgency]}`} />
            <div>
              <p className="text-sm font-medium text-ledger-navy dark:text-ledger-cream">{item.personName}</p>
              <p className="text-xs text-ledger-slate">
                {urgencyText[item.urgency]} · {formatDate(item.dueDate)}
              </p>
            </div>
          </div>
          <span className={`amount-mono text-sm font-medium ${item.type === 'lent' ? 'text-ledger-green' : 'text-ledger-amber'}`}>
            {formatCurrency(item.amount)}
          </span>
        </Link>
      ))}
    </div>
  );
};

export default UpcomingDueDates;
