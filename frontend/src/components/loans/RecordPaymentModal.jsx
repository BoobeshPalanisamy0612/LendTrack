import { useForm } from 'react-hook-form';
import { useState } from 'react';
import toast from 'react-hot-toast';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';
import { loanService } from '../../services/loanService';
import { formatCurrency } from '../../utils/formatCurrency';

const methodOptions = [
  { value: 'cash', label: 'Cash' },
  { value: 'bank_transfer', label: 'Bank transfer' },
  { value: 'upi', label: 'UPI' },
  { value: 'cheque', label: 'Cheque' },
  { value: 'other', label: 'Other' },
];

const RecordPaymentModal = ({ isOpen, onClose, loan, outstanding, onSuccess }) => {
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: { paidAmount: outstanding, paymentDate: new Date().toISOString().split('T')[0], method: 'cash', note: '' },
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const res = await loanService.markPaid(loan._id, { ...data, paidAmount: Number(data.paidAmount) });
      toast.success('Payment recorded');
      onSuccess(res);
      handleClose();
    } catch (err) {
      toast.error(err.message || 'Could not record payment');
    } finally {
      setSubmitting(false);
    }
  };

  const markFullyPaid = async () => {
    setSubmitting(true);
    try {
      const res = await loanService.markPaid(loan._id, { full: true });
      toast.success('Marked as fully paid');
      onSuccess(res);
      handleClose();
    } catch (err) {
      toast.error(err.message || 'Could not update loan');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Record a payment" size="sm">
      <p className="mb-4 text-sm text-ledger-slate">
        Outstanding balance: <span className="amount-mono font-medium text-ledger-navy dark:text-ledger-cream">{formatCurrency(outstanding)}</span>
      </p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <Input
          label="Amount paid"
          type="number"
          step="0.01"
          error={errors.paidAmount?.message}
          {...register('paidAmount', {
            required: 'Amount is required',
            min: { value: 0.01, message: 'Must be greater than 0' },
          })}
        />
        <Input label="Payment date" type="date" {...register('paymentDate', { required: true })} />
        <Select label="Method" options={methodOptions} {...register('method')} />
        <div>
          <label className="input-label">Note (optional)</label>
          <textarea rows={2} className="input-field resize-none" {...register('note')} />
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Button type="submit" loading={submitting} className="flex-1">
            Record payment
          </Button>
          <Button type="button" variant="secondary" onClick={markFullyPaid} loading={submitting} className="flex-1">
            Mark fully paid
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default RecordPaymentModal;
