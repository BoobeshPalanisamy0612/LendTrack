import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { loanService } from '../services/loanService';

const useLoans = (initialFilters = {}) => {
  const [loans, setLoans] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
  const [filters, setFilters] = useState(initialFilters);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLoans = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await loanService.getLoans(filters);
      setLoans(data.loans);
      setPagination(data.pagination);
    } catch (err) {
      setError(err.message);
      toast.error(err.message || 'Failed to load loan records');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchLoans();
  }, [fetchLoans]);

  const removeLoan = async (id) => {
    try {
      await loanService.deleteLoan(id);
      setLoans((prev) => prev.filter((l) => l._id !== id));
      toast.success('Loan record deleted');
    } catch (err) {
      toast.error(err.message || 'Could not delete record');
    }
  };

  return { loans, pagination, filters, setFilters, loading, error, refetch: fetchLoans, removeLoan };
};

export default useLoans;
