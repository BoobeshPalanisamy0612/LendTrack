import { useNotifications } from '../context/NotificationContext';
import SectionHeader from '../components/ui/SectionHeader';
import LedgerDivider from '../components/ui/LedgerDivider';
import Card from '../components/ui/Card';
import EmptyState from '../components/ui/EmptyState';
import Button from '../components/ui/Button';
import NotificationItem from '../components/notifications/NotificationItem';

const Notifications = () => {
  const { notifications, unreadCount, markRead, markAllRead, removeNotification } = useNotifications();

  return (
    <div className="mx-auto max-w-2xl">
      <SectionHeader
        title="Notifications"
        subtitle={unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
        action={
          unreadCount > 0 && (
            <Button variant="secondary" onClick={markAllRead}>
              Mark all read
            </Button>
          )
        }
      />
      <LedgerDivider />

      <Card>
        {notifications.length === 0 ? (
          <EmptyState title="No notifications yet" description="Reminders and updates about your loans will show up here." />
        ) : (
          <div className="divide-y divide-ledger-line dark:divide-ledger-lineDark">
            {notifications.map((n) => (
              <NotificationItem key={n._id} notification={n} onRead={markRead} onDelete={removeNotification} />
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default Notifications;
