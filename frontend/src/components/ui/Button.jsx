import { motion } from 'framer-motion';
import clsx from 'clsx';

const variantClass = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  danger: 'btn-danger',
  ghost: 'inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-ledger-slate hover:bg-ledger-cream dark:hover:bg-ledger-darkSurface transition-colors',
};

const Button = ({
  children,
  variant = 'primary',
  type = 'button',
  loading = false,
  disabled = false,
  className,
  icon,
  ...props
}) => {
  return (
    <motion.button
      type={type}
      whileTap={{ scale: 0.97 }}
      disabled={disabled || loading}
      className={clsx(variantClass[variant], className)}
      {...props}
    >
      {loading ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
      ) : (
        icon
      )}
      {children}
    </motion.button>
  );
};

export default Button;
