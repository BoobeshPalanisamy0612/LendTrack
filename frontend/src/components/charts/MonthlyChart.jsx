import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { formatCompact, formatCurrency } from '../../utils/formatCurrency';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="card-surface px-3 py-2 text-xs">
      <p className="mb-1 font-medium text-ledger-navy dark:text-ledger-cream">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ color: p.color }}>
          {p.name}: {formatCurrency(p.value)}
        </p>
      ))}
    </div>
  );
};

const MonthlyChart = ({ data = [] }) => (
  <ResponsiveContainer width="100%" height={280}>
    <BarChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }} barGap={4}>
      <CartesianGrid strokeDasharray="4 6" stroke="#E3DFD2" vertical={false} />
      <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#8B95A6' }} axisLine={false} tickLine={false} />
      <YAxis tickFormatter={formatCompact} tick={{ fontSize: 12, fill: '#8B95A6' }} axisLine={false} tickLine={false} width={48} />
      <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(139,149,166,0.08)' }} />
      <Legend wrapperStyle={{ fontSize: 12 }} iconType="circle" />
      <Bar dataKey="lent" name="Lent" fill="#2F9E6E" radius={[4, 4, 0, 0]} maxBarSize={26} />
      <Bar dataKey="borrowed" name="Borrowed" fill="#D9763B" radius={[4, 4, 0, 0]} maxBarSize={26} />
    </BarChart>
  </ResponsiveContainer>
);

export default MonthlyChart;
