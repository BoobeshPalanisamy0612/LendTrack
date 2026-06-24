import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { notificationService } from '../services/notificationService';
import { formatCurrency } from '../utils/formatCurrency';
import { formatDate } from '../utils/formatDate';
import SectionHeader from '../components/ui/SectionHeader';
import LedgerDivider from '../components/ui/LedgerDivider';
import Card from '../components/ui/Card';
import EmptyState from '../components/ui/EmptyState';
import Spinner from '../components/ui/Spinner';

const Section = ({ title, items, dotClass, emptyText }) => (
  <Card>
    <div className="mb-3 flex items-center gap-2">
      <span className={`h-2.5 w-2.5 rounded-full ${dotClass}`} />
      <h3 className="font-display text-base font-semibold text-ledger-navy dark:text-ledger-cream">{title}</h3>
      <span className="ml-auto text-xs text-ledger-slate">{items.length}</span>
    </div>
    {items.length === 0 ? (
      <p className="py-6 text-center text-sm text-ledger-slate">{emptyText}</p>
    ) : (
      <ul className="space-y-2">
        {items.map((loan) => (
          <li key={loan._id}>
            <Link
              to={`/loans/${loan._id}`}
              className="flex items-center justify-between rounded-lg px-2 py-2 transition-colors hover:bg-ledger-cream/60 dark:hover:bg-ledger-dark/40"
            >
              <div>
                <p className="text-sm font-medium text-ledger-navy dark:text-ledger-cream">{loan.personName}</p>
                <p className="text-xs text-ledger-slate">Due {formatDate(loan.dueDate)}</p>
              </div>
              <span className={`amount-mono text-sm font-medium ${loan.type === 'lent' ? 'text-ledger-green' : 'text-ledger-amber'}`}>
                {formatCurrency(loan.amount)}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    )}
  </Card>
);

const ReminderCenter = () => {
  const [data, setData] = useState({ overdue: [], dueToday: [], upcoming: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await notificationService.getReminders();
        setData(res);
      } catch (err) {
        toast.error(err.message || 'Could not load reminders');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  const totalActive = data.overdue.length + data.dueToday.length + data.upcoming.length;

  return (
    <div>
      <SectionHeader title="Reminder center" subtitle="Every loan that needs your attention, grouped by urgency." />
      <LedgerDivider />

      {totalActive === 0 ? (
        <EmptyState title="You're all caught up" description="No loans are due today, overdue, or coming up in the next 7 days." />
      ) : (
        <div className="grid gap-5 lg:grid-cols-3">
          <Section title="Overdue" items={data.overdue} dotClass="bg-red-500" emptyText="Nothing overdue. Nice." />
          <Section title="Due today" items={data.dueToday} dotClass="bg-ledger-amber" emptyText="Nothing due today." />
          <Section title="Upcoming (7 days)" items={data.upcoming} dotClass="bg-ledger-green" emptyText="Nothing coming up soon." />
        </div>
      )}

      <p className="mt-6 text-center text-xs text-ledger-slate">
        Reminders are checked automatically every day. Enable browser notifications from the bell icon to get alerted in real time.
      </p>
    </div>
  );
};

export default ReminderCenter;
