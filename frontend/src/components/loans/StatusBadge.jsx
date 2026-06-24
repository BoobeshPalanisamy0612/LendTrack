import clsx from 'clsx';

const statusConfig = {
  active: { label: 'Active', cls: 'badge-neutral' },
  paid: { label: 'Paid', cls: 'badge-success' },
  overdue: { label: 'Overdue', cls: 'badge-danger' },
  partially_paid: { label: 'Partially paid', cls: 'badge-warning' },
};

const StatusBadge = ({ status, className }) => {
  const config = statusConfig[status] || statusConfig.active;
  return <span className={clsx('badge', config.cls, className)}>{config.label}</span>;
};

export default StatusBadge;
