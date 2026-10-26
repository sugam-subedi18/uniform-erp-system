export const inputCls = 'w-full rounded-lg border border-line bg-white px-3 py-2 text-sm outline-none focus:border-ink focus:ring-2 focus:ring-tape/60';
export const btnPrimary = 'rounded-lg bg-ink px-4 py-2 text-sm font-semibold text-white hover:bg-ink/85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:cursor-not-allowed disabled:opacity-40';
export const btnTape = 'rounded-lg bg-tape px-4 py-2 text-sm font-semibold text-ink hover:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:cursor-not-allowed disabled:opacity-40';
export const btnGhost = 'rounded-lg border border-line bg-white px-4 py-2 text-sm font-medium hover:bg-chalk focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink';

export const statusLabel = {
  pending: 'Pending', confirmed: 'Confirmed', in_production: 'In production', ready: 'Ready to dispatch',
  dispatched: 'Dispatched', shipped: 'Shipped', delivered: 'Delivered',
};
const statusStyles = {
  pending: 'bg-tape/30 text-ink', confirmed: 'bg-sky-100 text-sky-900', in_production: 'bg-indigo-100 text-indigo-900',
  ready: 'bg-ok/15 text-ok', dispatched: 'bg-ink/10 text-ink', shipped: 'bg-sky-100 text-sky-900', delivered: 'bg-ok/15 text-ok',
};
export const statusStripe = {
  pending: 'border-l-tape', confirmed: 'border-l-sky-500', in_production: 'border-l-indigo-500', ready: 'border-l-ok', dispatched: 'border-l-ink/30',
};

export const fmtDate = (d) => new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
export const daysLeft = (d) => Math.ceil((new Date(d) - new Date()) / 86400000);

export function Badge({ status }) {
  return <span className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusStyles[status]}`}>{statusLabel[status]}</span>;
}

export function PageHeader({ title, subtitle, action }) {
  return (
    <header className="mb-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">{title}</h1>
          {subtitle && <p className="mt-1 text-ink/60">{subtitle}</p>}
        </div>
        {action}
      </div>
      <div className="tape-rule mt-5 rounded-sm" />
    </header>
  );
}

export function Field({ label, hint, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-ink/55">{hint}</span>}
    </label>
  );
}

export function Modal({ title, onClose, wide, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink/60 p-4 sm:p-10" onClick={onClose}>
      <div className={`w-full ${wide ? 'max-w-3xl' : 'max-w-lg'} rounded-xl bg-white shadow-xl`} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-line px-6 py-4">
          <h2 className="text-xl font-bold">{title}</h2>
          <button onClick={onClose} aria-label="Close" className="rounded px-2 text-2xl leading-none text-ink/50 hover:text-ink">×</button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

// Stock shown as a stretch of measuring tape
export function TapeBar({ value, max, low }) {
  const pct = Math.max(4, Math.min(100, (value / max) * 100));
  return (
    <div className="h-3 w-full overflow-hidden rounded-sm bg-white ring-1 ring-line">
      <div className={`tape-fill h-full ${low ? 'low' : ''}`} style={{ width: `${pct}%` }} />
    </div>
  );
}
