const SectionHeader = ({ title, subtitle, action }) => (
  <div className="mb-1 flex items-start justify-between gap-4">
    <div>
      <h2 className="text-xl font-semibold text-ledger-navy dark:text-ledger-cream">{title}</h2>
      {subtitle && <p className="mt-0.5 text-sm text-ledger-slate">{subtitle}</p>}
    </div>
    {action}
  </div>
);

export default SectionHeader;
