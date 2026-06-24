import { motion } from 'framer-motion';

const EmptyState = ({ icon, title, description, action }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="flex flex-col items-center justify-center rounded-card border border-dashed border-ledger-line dark:border-ledger-lineDark py-14 px-6 text-center"
  >
    {icon && <div className="mb-3 text-ledger-slate">{icon}</div>}
    <h3 className="font-display text-lg text-ledger-navy dark:text-ledger-cream">{title}</h3>
    {description && <p className="mt-1 max-w-sm text-sm text-ledger-slate">{description}</p>}
    {action && <div className="mt-4">{action}</div>}
  </motion.div>
);

export default EmptyState;
