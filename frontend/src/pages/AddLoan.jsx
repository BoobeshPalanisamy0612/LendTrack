import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { loanService } from '../services/loanService';
import LoanForm from '../components/loans/LoanForm';
import SectionHeader from '../components/ui/SectionHeader';
import LedgerDivider from '../components/ui/LedgerDivider';
import Card from '../components/ui/Card';

const AddLoan = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const res = await loanService.createLoan(data);
      toast.success('Loan record created');
      navigate(`/loans/${res.loan._id}`);
    } catch (err) {
      toast.error(err.message || 'Could not create loan record');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <SectionHeader title="Add a loan record" subtitle="Log money you've lent or borrowed, with optional interest." />
      <LedgerDivider />
      <Card>
        <LoanForm onSubmit={onSubmit} submitting={submitting} submitLabel="Create loan record" />
      </Card>
    </div>
  );
};

export default AddLoan;
