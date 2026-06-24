import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { loanService } from '../services/loanService';
import LoanForm from '../components/loans/LoanForm';
import SectionHeader from '../components/ui/SectionHeader';
import LedgerDivider from '../components/ui/LedgerDivider';
import Card from '../components/ui/Card';
import Spinner from '../components/ui/Spinner';

const EditLoan = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loan, setLoan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await loanService.getLoanById(id);
        setLoan(res.loan);
      } catch (err) {
        toast.error(err.message || 'Could not load loan record');
        navigate('/loans');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, navigate]);

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      await loanService.updateLoan(id, data);
      toast.success('Loan record updated');
      navigate(`/loans/${id}`);
    } catch (err) {
      toast.error(err.message || 'Could not update loan record');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <SectionHeader title="Edit loan record" subtitle={`Updating record for ${loan.personName}`} />
      <LedgerDivider />
      <Card>
        <LoanForm defaultValues={loan} onSubmit={onSubmit} submitting={submitting} submitLabel="Save changes" />
      </Card>
    </div>
  );
};

export default EditLoan;
