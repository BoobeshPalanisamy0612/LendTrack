import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { authService } from '../services/authService';
import Card from '../components/ui/Card';
import SectionHeader from '../components/ui/SectionHeader';
import LedgerDivider from '../components/ui/LedgerDivider';
import Select from '../components/ui/Select';

const Toggle = ({ checked, onChange, label, description }) => (
  <div className="flex items-center justify-between py-3">
    <div>
      <p className="text-sm font-medium text-ledger-navy dark:text-ledger-cream">{label}</p>
      {description && <p className="text-xs text-ledger-slate">{description}</p>}
    </div>
    <button
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 rounded-full transition-colors ${checked ? 'bg-ledger-green' : 'bg-ledger-line dark:bg-ledger-lineDark'}`}
      role="switch"
      aria-checked={checked}
    >
      <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-5' : 'translate-x-0.5'}`} />
    </button>
  </div>
);

const dueSoonOptions = [
  { value: 1, label: '1 day before' },
  { value: 3, label: '3 days before' },
  { value: 5, label: '5 days before' },
  { value: 7, label: '7 days before' },
];

const Settings = () => {
  const { user, updateUser } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [prefs, setPrefs] = useState(user?.notificationPrefs || { browser: true, email: true, dueSoonDays: 3 });

  const savePrefs = async (next) => {
    setPrefs(next);
    try {
      const res = await authService.updateProfile({ notificationPrefs: next });
      updateUser(res.user);
    } catch (err) {
      toast.error(err.message || 'Could not update settings');
    }
  };

  const requestBrowserPermission = () => {
    if ('Notification' in window) {
      Notification.requestPermission().then((perm) => {
        if (perm === 'granted') toast.success('Browser notifications enabled');
        else toast.error('Permission denied for browser notifications');
      });
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <SectionHeader title="Settings" subtitle="Customize appearance and how LendTrack notifies you." />
      <LedgerDivider />

      <Card className="mb-6">
        <h3 className="mb-1 font-display text-base font-semibold text-ledger-navy dark:text-ledger-cream">Appearance</h3>
        <div className="divide-y divide-ledger-line dark:divide-ledger-lineDark">
          <Toggle checked={isDark} onChange={toggleTheme} label="Dark mode" description="Switch between light and dark themes" />
        </div>
      </Card>

      <Card>
        <h3 className="mb-1 font-display text-base font-semibold text-ledger-navy dark:text-ledger-cream">Notifications</h3>
        <div className="divide-y divide-ledger-line dark:divide-ledger-lineDark">
          <Toggle
            checked={prefs.email}
            onChange={(val) => savePrefs({ ...prefs, email: val })}
            label="Email reminders"
            description="Get an email when a loan is due soon, due today, or overdue"
          />
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-medium text-ledger-navy dark:text-ledger-cream">Browser notifications</p>
              <p className="text-xs text-ledger-slate">Show desktop notifications for reminders</p>
            </div>
            <button onClick={requestBrowserPermission} className="text-sm font-medium text-ledger-green hover:underline">
              Enable
            </button>
          </div>
          <div className="py-3">
            <Select
              label="Remind me before due date"
              options={dueSoonOptions}
              value={prefs.dueSoonDays}
              onChange={(e) => savePrefs({ ...prefs, dueSoonDays: Number(e.target.value) })}
            />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Settings;
