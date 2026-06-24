import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate, getDueUrgency, urgencyLabel, urgencyBadgeClass } from '../../utils/formatDate';
import StatusBadge from './StatusBadge';

const LoanCard = ({ loan, onDelete, index = 0 }) => {
  const urgency = getDueUrgency(loan.dueDate, loan.status);
  const isLent = loan.type === 'lent';

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: Math.min(index * 0.03, 0.3) }}
      className="card-surface group p-4"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
              isLent ? 'bg-ledger-green/10 text-ledger-greenDark' : 'bg-ledger-amber/10 text-ledger-amberDark'
            }`}
          >
            {loan.personName.charAt(0).toUpperCase()}
          </div>
          <div>
            <Link to={`/loans/${loan._id}`} className="font-medium text-ledger-navy hover:underline dark:text-ledger-cream">
              {loan.personName}
            </Link>
            <p className="text-xs text-ledger-slate">{loan.relationship}</p>
          </div>
        </div>
        <StatusBadge status={loan.status} />
      </div>

      <div className="mt-4 flex items-end justify-between">
        <div>
          <p className={`amount-mono text-lg font-semibold ${isLent ? 'text-ledger-green' : 'text-ledger-amber'}`}>
            {formatCurrency(loan.amount)}
          </p>
          <p className="text-xs text-ledger-slate">{isLent ? 'Lent' : 'Borrowed'} · {loan.interestRate}% {loan.interestType !== 'none' ? loan.interestType : 'no interest'}</p>
        </div>
        <div className="text-right">
          <span className={`badge ${urgencyBadgeClass[urgency]}`}>{urgencyLabel[urgency]}</span>
          <p className="mt-1 text-xs text-ledger-slate">Due {formatDate(loan.dueDate)}</p>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 border-t border-ledger-line pt-3 opacity-0 transition-opacity group-hover:opacity-100 dark:border-ledger-lineDark">
        <Link to={`/loans/${loan._id}`} className="text-xs font-medium text-ledger-navy hover:underline dark:text-ledger-cream">
          View details
        </Link>
        <span className="text-ledger-line dark:text-ledger-lineDark">·</span>
        <Link to={`/loans/${loan._id}/edit`} className="text-xs font-medium text-ledger-navy hover:underline dark:text-ledger-cream">
          Edit
        </Link>
        <span className="text-ledger-line dark:text-ledger-lineDark">·</span>
        <button onClick={() => onDelete?.(loan)} className="text-xs font-medium text-red-600 hover:underline">
          Delete
        </button>
      </div>
    </motion.div>
  );
};

export default LoanCard;
