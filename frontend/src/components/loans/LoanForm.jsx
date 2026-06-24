import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';

const relationshipOptions = [
  { value: 'Friend', label: 'Friend' },
  { value: 'Sister', label: 'Sister' },
  { value: 'Brother', label: 'Brother' },
  { value: 'Parent', label: 'Parent' },
  { value: 'Relative', label: 'Relative' },
  { value: 'Colleague', label: 'Colleague' },
  { value: 'Neighbor', label: 'Neighbor' },
  { value: 'Other', label: 'Other' },
];

const typeOptions = [
  { value: 'lent', label: 'I lent this money' },
  { value: 'borrowed', label: 'I borrowed this money' },
];

const interestTypeOptions = [
  { value: 'none', label: 'No interest' },
  { value: 'simple', label: 'Simple interest' },
  { value: 'compound', label: 'Compound interest' },
];

const frequencyOptions = [
  { value: 'yearly', label: 'Yearly' },
  { value: 'half-yearly', label: 'Half-yearly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'monthly', label: 'Monthly' },
];

const toDateInputValue = (date) => {
  if (!date) return '';
  return new Date(date).toISOString().split('T')[0];
};

const LoanForm = ({ defaultValues, onSubmit, submitting, submitLabel = 'Save loan record' }) => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      personName: '',
      relationship: 'Friend',
      type: 'lent',
      amount: '',
      interestRate: 0,
      interestType: 'none',
      compoundFrequency: 'yearly',
      startDate: toDateInputValue(new Date()),
      dueDate: '',
      notes: '',
    },
  });

  useEffect(() => {
    if (defaultValues) {
      reset({
        ...defaultValues,
        startDate: toDateInputValue(defaultValues.startDate),
        dueDate: toDateInputValue(defaultValues.dueDate),
      });
    }
  }, [defaultValues, reset]);

  const interestType = watch('interestType');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Person's name"
          placeholder="e.g. Ravi Kumar"
          error={errors.personName?.message}
          {...register('personName', { required: 'Person name is required' })}
        />
        <Select
          label="Relationship"
          options={relationshipOptions}
          {...register('relationship')}
        />
      </div>

      <Select label="Loan type" options={typeOptions} {...register('type', { required: true })} />

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Amount (₹)"
          type="number"
          step="0.01"
          placeholder="10000"
          error={errors.amount?.message}
          {...register('amount', {
            required: 'Amount is required',
            valueAsNumber: true,
            min: { value: 0.01, message: 'Amount must be greater than 0' },
          })}
        />
        <Input
          label="Interest rate (% per year)"
          type="number"
          step="0.01"
          placeholder="0"
          error={errors.interestRate?.message}
          {...register('interestRate', { valueAsNumber: true, min: { value: 0, message: 'Cannot be negative' } })}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Select label="Interest type" options={interestTypeOptions} {...register('interestType')} />
        {interestType === 'compound' && (
          <Select label="Compounding frequency" options={frequencyOptions} {...register('compoundFrequency')} />
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Start date"
          type="date"
          error={errors.startDate?.message}
          {...register('startDate', { required: 'Start date is required' })}
        />
        <Input
          label="Due date"
          type="date"
          error={errors.dueDate?.message}
          {...register('dueDate', { required: 'Due date is required' })}
        />
      </div>

      <div>
        <label className="input-label">Notes</label>
        <textarea
          rows={3}
          placeholder="Optional notes about this loan…"
          className="input-field resize-none"
          {...register('notes')}
        />
      </div>

      <Button type="submit" loading={submitting} className="w-full sm:w-auto">
        {submitLabel}
      </Button>
    </form>
  );
};

export default LoanForm;
