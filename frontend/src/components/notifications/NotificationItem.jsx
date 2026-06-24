import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { formatRelative } from '../../utils/formatDate';

const typeIcon = {
  due_today: '⏰',
  upcoming: '📅',
  overdue: '⚠️',
  payment_received: '💰',
  family_invite: '👥',
  general: '🔔',
};

const NotificationItem = ({ notification, onRead, onDelete }) => (
  <div
    className={clsx(
      'flex items-start justify-between gap-3 rounded-lg px-3 py-3 transition-colors',
      !notification.isRead && 'bg-ledger-green/5 dark:bg-ledger-green/10'
    )}
  >
    <Link
      to={notification.loanId ? `/loans/${notification.loanId._id || notification.loanId}` : '#'}
      onClick={() => !notification.isRead && onRead(notification._id)}
      className="flex flex-1 items-start gap-3"
    >
      <span className="text-lg">{typeIcon[notification.type] || '🔔'}</span>
      <div>
        <p className="text-sm text-ledger-navy dark:text-ledger-cream">{notification.message}</p>
        <p className="mt-0.5 text-xs text-ledger-slate">{formatRelative(notification.createdAt)}</p>
      </div>
    </Link>
    <div className="flex shrink-0 items-center gap-2">
      {!notification.isRead && <span className="h-2 w-2 rounded-full bg-ledger-green" />}
      <button onClick={() => onDelete(notification._id)} className="text-ledger-slate hover:text-red-600" aria-label="Delete notification">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  </div>
);

export default NotificationItem;
