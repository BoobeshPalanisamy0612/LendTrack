export const emailPattern = {
  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  message: 'Enter a valid email address',
};

export const passwordRules = {
  required: 'Password is required',
  minLength: { value: 6, message: 'Password must be at least 6 characters' },
};

export const requiredRule = (label) => ({ required: `${label} is required` });

export const positiveNumberRule = (label) => ({
  required: `${label} is required`,
  min: { value: 0.01, message: `${label} must be greater than 0` },
  valueAsNumber: true,
});
