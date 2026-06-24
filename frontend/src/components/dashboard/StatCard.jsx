import { motion } from 'framer-motion';
import clsx from 'clsx';
import { formatCurrency } from '../../utils/formatCurrency';

const colorMap = {
  green: 'text-ledger-green',
  amber: 'text-ledger-amber',
  navy: 'text-ledger-navy dark:text-ledger-cream',
  slate: 'text-ledger-slate',
};

const StatCard = ({ label, value, sublabel, color = 'navy', icon, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, delay }}
    className="card-surface p-5"
  >
    <div className="flex items-center justify-between">
      <span className="text-sm text-ledger-slate">{label}</span>
      {icon && <span className={clsx('opacity-70', colorMap[color])}>{icon}</span>}
    </div>
    <p className={clsx('amount-mono mt-2 text-2xl font-semibold sm:text-[28px]', colorMap[color])}>
      {typeof value === 'number' ? formatCurrency(value) : value}
    </p>
    {sublabel && <p className="mt-1 text-xs text-ledger-slate">{sublabel}</p>}
  </motion.div>
);

export default StatCard;
