import Select from '../ui/Select';
import Input from '../ui/Input';

const typeOptions = [
  { value: '', label: 'All types' },
  { value: 'lent', label: 'Lent' },
  { value: 'borrowed', label: 'Borrowed' },
];

const statusOptions = [
  { value: '', label: 'All statuses' },
  { value: 'active', label: 'Active' },
  { value: 'partially_paid', label: 'Partially paid' },
  { value: 'overdue', label: 'Overdue' },
  { value: 'paid', label: 'Paid' },
];

const sortOptions = [
  { value: '-createdAt', label: 'Newest first' },
  { value: 'createdAt', label: 'Oldest first' },
  { value: 'dueDate', label: 'Due date (soonest)' },
  { value: '-amount', label: 'Amount (highest)' },
  { value: 'amount', label: 'Amount (lowest)' },
];

const LoanFilterBar = ({ filters, onChange }) => {
  const update = (field, value) => onChange({ ...filters, [field]: value, page: 1 });

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <Input
        placeholder="Search by name or notes…"
        value={filters.search || ''}
        onChange={(e) => update('search', e.target.value)}
      />
      <Select options={typeOptions} value={filters.type || ''} onChange={(e) => update('type', e.target.value)} />
      <Select options={statusOptions} value={filters.status || ''} onChange={(e) => update('status', e.target.value)} />
      <Select options={sortOptions} value={filters.sortBy || '-createdAt'} onChange={(e) => update('sortBy', e.target.value)} />
    </div>
  );
};

export default LoanFilterBar;
