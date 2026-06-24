import { forwardRef } from 'react';
import clsx from 'clsx';

const Select = forwardRef(({ label, error, options = [], className, placeholder, ...props }, ref) => {
  return (
    <div className="w-full">
      {label && <label className="input-label">{label}</label>}
      <select ref={ref} className={clsx('input-field', error && 'border-red-500', className)} {...props}>
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="input-error">{error}</p>}
    </div>
  );
});

Select.displayName = 'Select';

export default Select;
