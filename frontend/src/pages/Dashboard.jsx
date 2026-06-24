import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { dashboardService } from '../services/dashboardService';
import StatCard from '../components/dashboard/StatCard';
import UpcomingDueDates from '../components/dashboard/UpcomingDueDates';
import RecentTransactions from '../components/dashboard/RecentTransactions';
import MonthlyChart from '../components/charts/MonthlyChart';
import SectionHeader from '../components/ui/SectionHeader';
import LedgerDivider from '../components/ui/LedgerDivider';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [monthly, setMonthly] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [summaryRes, monthlyRes] = await Promise.all([
          dashboardService.getSummary(),
          dashboardService.getMonthlyStats(6),
        ]);
        setSummary(summaryRes);
        setMonthly(monthlyRes.data);
      } catch (err) {
        toast.error(err.message || 'Could not load dashboard');
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

  const { summary: s, upcomingDueDates, recentTransactions } = summary || {};

  return (
    <div>
      <SectionHeader
        title="Dashboard"
        subtitle="A snapshot of everything you've lent and borrowed."
        action={
          <Link to="/loans/add">
            <Button>+ Add loan</Button>
          </Link>
        }
      />
      <LedgerDivider />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total lent"
          value={s?.totalLent || 0}
          sublabel={`₹${(s?.totalLentOutstanding || 0).toLocaleString()} still outstanding`}
          color="green"
          delay={0}
        />
        <StatCard
          label="Total borrowed"
          value={s?.totalBorrowed || 0}
          sublabel={`₹${(s?.totalBorrowedOutstanding || 0).toLocaleString()} still owed`}
          color="amber"
          delay={0.05}
        />
        <StatCard
          label="Net position"
          value={s?.netPosition || 0}
          sublabel={s?.netPosition >= 0 ? "You're owed more than you owe" : 'You owe more than you are owed'}
          color="navy"
          delay={0.1}
        />
        <StatCard
          label="Due this week"
          value={(s?.dueTodayCount || 0) + (s?.upcomingCount || 0)}
          sublabel={`${s?.overdueCount || 0} overdue`}
          color="slate"
          delay={0.15}
        />
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <h3 className="mb-1 font-display text-base font-semibold text-ledger-navy dark:text-ledger-cream">
            Monthly activity
          </h3>
          <p className="mb-2 text-xs text-ledger-slate">Lent vs borrowed over the last 6 months</p>
          <MonthlyChart data={monthly} />
        </Card>

        <Card>
          <div className="mb-2 flex items-center justify-between">
            <h3 className="font-display text-base font-semibold text-ledger-navy dark:text-ledger-cream">
              Upcoming due dates
            </h3>
            <Link to="/reminders" className="text-xs font-medium text-ledger-green hover:underline">
              View all
            </Link>
          </div>
          <UpcomingDueDates items={upcomingDueDates} />
        </Card>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="font-display text-base font-semibold text-ledger-navy dark:text-ledger-cream">
              Recent transactions
            </h3>
            <Link to="/loans" className="text-xs font-medium text-ledger-green hover:underline">
              View all loans
            </Link>
          </div>
          <RecentTransactions transactions={recentTransactions} />
        </Card>

        <Card>
          <h3 className="mb-3 font-display text-base font-semibold text-ledger-navy dark:text-ledger-cream">
            Quick actions
          </h3>
          <div className="space-y-2">
            <Link to="/loans/add" className="btn-secondary w-full justify-start">
              + New loan record
            </Link>
            <Link to="/calculator" className="btn-secondary w-full justify-start">
              Interest calculator
            </Link>
            <Link to="/family" className="btn-secondary w-full justify-start">
              Invite a family member
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
