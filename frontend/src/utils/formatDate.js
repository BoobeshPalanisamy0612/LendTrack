import { format, formatDistanceToNow, isToday, isPast, differenceInCalendarDays } from 'date-fns';

export const formatDate = (date) => {
  if (!date) return '—';
  return format(new Date(date), 'dd MMM yyyy');
};

export const formatDateTime = (date) => {
  if (!date) return '—';
  return format(new Date(date), 'dd MMM yyyy, h:mm a');
};

export const formatRelative = (date) => {
  if (!date) return '—';
  return formatDistanceToNow(new Date(date), { addSuffix: true });
};

export const getDueUrgency = (dueDate, status) => {
  if (status === 'paid') return 'paid';
  const due = new Date(dueDate);
  if (isPast(due) && !isToday(due)) return 'overdue';
  if (isToday(due)) return 'due_today';
  const daysLeft = differenceInCalendarDays(due, new Date());
  if (daysLeft <= 7) return 'upcoming';
  return 'normal';
};

export const urgencyLabel = {
  overdue: 'Overdue',
  due_today: 'Due today',
  upcoming: 'Upcoming',
  normal: 'On track',
  paid: 'Paid',
};

export const urgencyBadgeClass = {
  overdue: 'badge-danger',
  due_today: 'badge-warning',
  upcoming: 'badge-warning',
  normal: 'badge-neutral',
  paid: 'badge-success',
};
