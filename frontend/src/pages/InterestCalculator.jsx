import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { calculatorService } from '../services/calculatorService';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import SectionHeader from '../components/ui/SectionHeader';
import LedgerDivider from '../components/ui/LedgerDivider';
import { formatCurrency } from '../utils/formatCurrency';

const durationUnitOptions = [
  { value: 'years', label: 'Years' },
  { value: 'months', label: 'Months' },
  { value: 'days', label: 'Days' },
];

const typeOptions = [
  { value: 'simple', label: 'Simple interest' },
  { value: 'compound', label: 'Compound interest' },
];

const frequencyOptions = [
  { value: 'yearly', label: 'Yearly' },
  { value: 'half-yearly', label: 'Half-yearly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'monthly', label: 'Monthly' },
];

const InterestCalculator = () => {
  const [result, setResult] = useState(null);
  const [calculating, setCalculating] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: { principal: 10000, rate: 8, duration: 1, durationUnit: 'years', type: 'simple', frequency: 'yearly' },
  });

  const type = watch('type');

  const onSubmit = async (data) => {
    setCalculating(true);
    try {
      const res = await calculatorService.calculate({
        ...data,
        principal: Number(data.principal),
        rate: Number(data.rate),
        duration: Number(data.duration),
      });
      setResult(res.result);
    } catch (err) {
      toast.error(err.message || 'Could not calculate interest');
    } finally {
      setCalculating(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      <SectionHeader title="Interest calculator" subtitle="Work out simple or compound interest before you lend or borrow." />
      <LedgerDivider />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <Input
              label="Principal amount (₹)"
              type="number"
              step="0.01"
              error={errors.principal?.message}
              {...register('principal', { required: 'Required', min: { value: 0.01, message: 'Must be positive' }, valueAsNumber: true })}
            />
            <Input
              label="Interest rate (% per year)"
              type="number"
              step="0.01"
              error={errors.rate?.message}
              {...register('rate', { required: 'Required', min: { value: 0, message: 'Cannot be negative' }, valueAsNumber: true })}
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Duration"
                type="number"
                step="1"
                error={errors.duration?.message}
                {...register('duration', { required: 'Required', min: { value: 1, message: 'Must be at least 1' }, valueAsNumber: true })}
              />
              <Select label="Unit" options={durationUnitOptions} {...register('durationUnit')} />
            </div>
            <Select label="Interest type" options={typeOptions} {...register('type')} />
            {type === 'compound' && <Select label="Compounding frequency" options={frequencyOptions} {...register('frequency')} />}

            <Button type="submit" loading={calculating} className="w-full">
              Calculate
            </Button>
          </form>
        </Card>

        <Card className="flex flex-col justify-center">
          <AnimatePresence mode="wait">
            {result ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div>
                  <p className="text-sm text-ledger-slate">Interest amount</p>
                  <p className="amount-mono mt-1 text-3xl font-semibold text-ledger-amber">{formatCurrency(result.interestAmount)}</p>
                </div>
                <div>
                  <p className="text-sm text-ledger-slate">Total payable amount</p>
                  <p className="amount-mono mt-1 text-3xl font-semibold text-ledger-green">{formatCurrency(result.totalPayable)}</p>
                </div>
              </motion.div>
            ) : (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-10 text-center text-sm text-ledger-slate">
                Fill in the details and calculate to see results here.
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </div>
    </div>
  );
};

export default InterestCalculator;
