import { forwardRef } from 'react';
import clsx from 'clsx';

const Input = forwardRef(({ label, error, hint, className, type = 'text', ...props }, ref) => {
  return (
    <div className="w-full">
      {label && <label className="input-label">{label}</label>}
      <input ref={ref} type={type} className={clsx('input-field', error && 'border-red-500 focus:border-red-500 focus:ring-red-500', className)} {...props} />
      {hint && !error && <p className="mt-1 text-xs text-ledger-slate">{hint}</p>}
      {error && <p className="input-error">{error}</p>}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
