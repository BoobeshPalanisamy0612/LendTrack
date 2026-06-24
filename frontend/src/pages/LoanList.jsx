import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import useLoans from '../hooks/useLoans';
import useDebounce from '../hooks/useDebounce';
import LoanCard from '../components/loans/LoanCard';
import LoanFilterBar from '../components/loans/LoanFilterBar';
import SectionHeader from '../components/ui/SectionHeader';
import LedgerDivider from '../components/ui/LedgerDivider';
import EmptyState from '../components/ui/EmptyState';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import { exportService } from '../services/exportService';

const LoanList = () => {
  const { loans, pagination, filters, setFilters, loading, refetch, removeLoan } = useLoans({ page: 1, limit: 20 });
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [exporting, setExporting] = useState(null);

  const debouncedFilters = useDebounce(filters, 350);

  // re-fetch is handled inside useLoans via filters dependency, but search needs debounce
  const handleFilterChange = (next) => setFilters(next);

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    setDeleting(true);
    await removeLoan(pendingDelete._id);
    setDeleting(false);
    setPendingDelete(null);
  };

  const handleExport = async (type) => {
    setExporting(type);
    try {
      if (type === 'pdf') await exportService.exportPDF();
      else await exportService.exportExcel();
      toast.success(`Exported as ${type.toUpperCase()}`);
    } catch (err) {
      toast.error(err.message || 'Export failed');
    } finally {
      setExporting(null);
    }
  };

  return (
    <div>
      <SectionHeader
        title="Loan records"
        subtitle={`${pagination.total} record${pagination.total === 1 ? '' : 's'} total`}
        action={
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" onClick={() => handleExport('excel')} loading={exporting === 'excel'}>
              Export Excel
            </Button>
            <Button variant="secondary" onClick={() => handleExport('pdf')} loading={exporting === 'pdf'}>
              Export PDF
            </Button>
            <Link to="/loans/add">
              <Button>+ New loan</Button>
            </Link>
          </div>
        }
      />
      <LedgerDivider />

      <div className="mb-6">
        <LoanFilterBar filters={filters} onChange={handleFilterChange} />
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Spinner size="lg" />
        </div>
      ) : loans.length === 0 ? (
        <EmptyState
          title="No loan records found"
          description="Try adjusting your filters, or create your first loan record."
          action={
            <Link to="/loans/add">
              <Button>+ Add a loan</Button>
            </Link>
          }
        />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence>
              {loans.map((loan, i) => (
                <LoanCard key={loan._id} loan={loan} index={i} onDelete={setPendingDelete} />
              ))}
            </AnimatePresence>
          </div>

          {pagination.pages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-2">
              <Button
                variant="secondary"
                disabled={pagination.page <= 1}
                onClick={() => setFilters({ ...filters, page: pagination.page - 1 })}
              >
                Previous
              </Button>
              <span className="px-3 text-sm text-ledger-slate">
                Page {pagination.page} of {pagination.pages}
              </span>
              <Button
                variant="secondary"
                disabled={pagination.page >= pagination.pages}
                onClick={() => setFilters({ ...filters, page: pagination.page + 1 })}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}

      <ConfirmDialog
        isOpen={Boolean(pendingDelete)}
        onClose={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
        loading={deleting}
        title="Delete this loan record?"
        description={`This will permanently remove the record for ${pendingDelete?.personName}, along with its payment history and documents. This can't be undone.`}
      />
    </div>
  );
};

export default LoanList;
