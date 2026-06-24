import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';
import EmptyState from '../ui/EmptyState';

const methodLabel = {
  cash: 'Cash',
  bank_transfer: 'Bank transfer',
  upi: 'UPI',
  cheque: 'Cheque',
  other: 'Other',
};

const PaymentHistoryList = ({ payments = [] }) => {
  if (payments.length === 0) {
    return <EmptyState title="No payments recorded" description="Payments you record against this loan will show up here." />;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-ledger-line text-left text-xs uppercase tracking-wide text-ledger-slate dark:border-ledger-lineDark">
            <th className="py-2 pr-4 font-medium">Date</th>
            <th className="py-2 pr-4 font-medium">Amount</th>
            <th className="py-2 pr-4 font-medium">Method</th>
            <th className="py-2 font-medium">Note</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((p) => (
            <tr key={p._id} className="border-b border-ledger-line/60 dark:border-ledger-lineDark/60">
              <td className="py-2.5 pr-4 text-ledger-navy dark:text-ledger-cream">{formatDate(p.paymentDate)}</td>
              <td className="amount-mono py-2.5 pr-4 font-medium text-ledger-green">{formatCurrency(p.paidAmount)}</td>
              <td className="py-2.5 pr-4 text-ledger-slate">{methodLabel[p.method] || p.method}</td>
              <td className="py-2.5 text-ledger-slate">{p.note || '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PaymentHistoryList;
