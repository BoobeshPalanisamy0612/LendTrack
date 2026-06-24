import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { loanService } from '../services/loanService';
import { formatCurrency } from '../utils/formatCurrency';
import { formatDate, getDueUrgency, urgencyLabel, urgencyBadgeClass } from '../utils/formatDate';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import SectionHeader from '../components/ui/SectionHeader';
import LedgerDivider from '../components/ui/LedgerDivider';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import StatusBadge from '../components/loans/StatusBadge';
import PaymentHistoryList from '../components/loans/PaymentHistoryList';
import DocumentUploader from '../components/loans/DocumentUploader';
import RecordPaymentModal from '../components/loans/RecordPaymentModal';
import { useAuth } from '../context/AuthContext';

const LoanDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchLoan = useCallback(async () => {
    try {
      const res = await loanService.getLoanById(id);
      setData(res);
    } catch (err) {
      toast.error(err.message || 'Could not load loan record');
      navigate('/loans');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchLoan();
  }, [fetchLoan]);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!data) return null;

  const { loan, payments, interestBreakdown } = data;
  const isLent = loan.type === 'lent';
  const outstanding = Math.max(interestBreakdown.total - loan.amountPaid, 0);
  const urgency = getDueUrgency(loan.dueDate, loan.status);
  const canEdit = loan.createdBy._id === user?.id || user?.role === 'admin';

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await loanService.deleteLoan(id);
      toast.success('Loan record deleted');
      navigate('/loans');
    } catch (err) {
      toast.error(err.message || 'Could not delete record');
      setDeleting(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl">
      <SectionHeader
        title={loan.personName}
        subtitle={`${loan.relationship} · Created by ${loan.createdBy.name}`}
        action={
          canEdit && (
            <div className="flex gap-2">
              <Link to={`/loans/${id}/edit`}>
                <Button variant="secondary">Edit</Button>
              </Link>
              <Button variant="danger" onClick={() => setDeleteOpen(true)}>
                Delete
              </Button>
            </div>
          )
        }
      />
      <LedgerDivider />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-ledger-slate">{isLent ? 'Amount lent' : 'Amount borrowed'}</p>
              <p className={`amount-mono text-3xl font-semibold ${isLent ? 'text-ledger-green' : 'text-ledger-amber'}`}>
                {formatCurrency(loan.amount)}
              </p>
            </div>
            <StatusBadge status={loan.status} />
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
            <Detail label="Start date" value={formatDate(loan.startDate)} />
            <Detail label="Due date" value={formatDate(loan.dueDate)} />
            <Detail label="Interest rate" value={`${loan.interestRate}% / yr`} />
            <Detail label="Interest type" value={loan.interestType === 'none' ? 'No interest' : loan.interestType} />
            <Detail label="Interest amount" value={formatCurrency(interestBreakdown.interest)} />
            <Detail label="Total payable" value={formatCurrency(interestBreakdown.total)} />
          </div>

          {loan.notes && (
            <div className="mt-5 rounded-lg bg-ledger-cream/60 p-3 text-sm text-ledger-navy/80 dark:bg-ledger-dark/40 dark:text-ledger-cream/80">
              {loan.notes}
            </div>
          )}

          <div className="mt-6 flex items-center justify-between rounded-lg border border-ledger-line p-4 dark:border-ledger-lineDark">
            <div>
              <p className="text-xs text-ledger-slate">Outstanding balance</p>
              <p className="amount-mono text-lg font-semibold text-ledger-navy dark:text-ledger-cream">{formatCurrency(outstanding)}</p>
            </div>
            {loan.status !== 'paid' && canEdit && <Button onClick={() => setPaymentModalOpen(true)}>Record payment</Button>}
          </div>
        </Card>

        <Card>
          <h3 className="mb-3 font-display text-base font-semibold text-ledger-navy dark:text-ledger-cream">Status</h3>
          <span className={`badge ${urgencyBadgeClass[urgency]} mb-4 inline-block`}>{urgencyLabel[urgency]}</span>
          <h3 className="mb-3 font-display text-base font-semibold text-ledger-navy dark:text-ledger-cream">Documents</h3>
          <DocumentUploader
            loanId={id}
            documents={loan.documents}
            canEdit={canEdit}
            onChange={(documents) => setData((prev) => ({ ...prev, loan: { ...prev.loan, documents } }))}
          />
        </Card>
      </div>

      <Card className="mt-6">
        <h3 className="mb-3 font-display text-base font-semibold text-ledger-navy dark:text-ledger-cream">Payment history</h3>
        <PaymentHistoryList payments={payments} />
      </Card>

      <RecordPaymentModal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        loan={loan}
        outstanding={outstanding}
        onSuccess={() => fetchLoan()}
      />

      <ConfirmDialog
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete this loan record?"
        description="This will permanently remove the record, its payment history, and documents. This can't be undone."
      />
    </div>
  );
};

const Detail = ({ label, value }) => (
  <div>
    <p className="text-xs text-ledger-slate">{label}</p>
    <p className="mt-0.5 text-sm font-medium text-ledger-navy dark:text-ledger-cream">{value}</p>
  </div>
);

export default LoanDetails;
