import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { PageHeader, TapeBar, fmtDate, daysLeft, statusLabel } from '../components/ui';

const pipeline = ['pending', 'confirmed', 'in_production', 'ready', 'dispatched'];
const barColor = { pending: 'bg-tape', confirmed: 'bg-sky-500', in_production: 'bg-indigo-500', ready: 'bg-ok', dispatched: 'bg-ink/30' };

export default function Dashboard() {
  const { fabrics, orders, customerName } = useData();
  const name = localStorage.getItem('name');

  const low = fabrics.filter((f) => f.quantity < f.reorder_threshold);
  const active = orders.filter((o) => o.status !== 'dispatched');
  const ready = orders.filter((o) => o.status === 'ready');
  const dueSoon = [...active].sort((a, b) => a.due_date.localeCompare(b.due_date)).slice(0, 5);

  const stats = [
    { label: 'Fabric lines in stock', value: fabrics.length, to: '/fabrics' },
    { label: 'Below reorder point', value: low.length, to: '/fabrics', tone: low.length ? 'text-alert' : '' },
    { label: 'Orders in progress', value: active.length, to: '/orders' },
    { label: 'Ready to dispatch', value: ready.length, to: '/dispatch', tone: ready.length ? 'text-ok' : '' },
  ];

  return (
    <>
      <PageHeader title={`Welcome back, ${name}`} subtitle="Here is where the shop floor stands today." />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <Link key={s.label} to={s.to} className="rounded-xl bg-white p-5 ring-1 ring-line transition hover:ring-ink/40">
            <div className={`font-display text-4xl font-bold num ${s.tone}`}>{s.value}</div>
            <div className="mt-1 text-sm text-ink/60">{s.label}</div>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-5">
        <section className="rounded-xl bg-white p-6 ring-1 ring-line lg:col-span-3">
          <h2 className="text-lg font-bold">Orders due soon</h2>
          {dueSoon.length === 0 ? (
            <p className="mt-4 text-sm text-ink/60">No open orders. New orders will show up here.</p>
          ) : (
            <ul className="mt-4 divide-y divide-line">
              {dueSoon.map((o) => {
                const d = daysLeft(o.due_date);
                return (
                  <li key={o.id} className="flex items-center justify-between gap-4 py-3">
                    <div>
                      <p className="font-medium">{customerName(o.customer_id)}</p>
                      <p className="text-sm text-ink/60">Order #{o.id}, {statusLabel[o.status].toLowerCase()}</p>
                    </div>
                    <div className="text-right text-sm">
                      <p className="font-medium">{fmtDate(o.due_date)}</p>
                      <p className={d < 0 ? 'font-semibold text-alert' : d <= 3 ? 'font-semibold text-amber-700' : 'text-ink/60'}>
                        {d < 0 ? `${-d} days overdue` : d === 0 ? 'Due today' : `${d} days left`}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <section className="rounded-xl bg-white p-6 ring-1 ring-line lg:col-span-2">
          <h2 className="text-lg font-bold">Fabric to reorder</h2>
          {low.length === 0 ? (
            <p className="mt-4 text-sm text-ink/60">Every fabric is above its reorder point.</p>
          ) : (
            <ul className="mt-4 space-y-4">
              {low.map((f) => (
                <li key={f.id}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="font-medium">{f.color} {f.fabric_type}</span>
                    <span className="num text-alert">{f.quantity} of {f.reorder_threshold} {f.unit}</span>
                  </div>
                  <TapeBar value={f.quantity} max={f.reorder_threshold * 2} low />
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section className="mt-6 rounded-xl bg-white p-6 ring-1 ring-line">
        <h2 className="text-lg font-bold">Order pipeline</h2>
        <div className="mt-4 space-y-3">
          {pipeline.map((s) => {
            const n = orders.filter((o) => o.status === s).length;
            return (
              <div key={s} className="grid grid-cols-[9rem_1fr_2rem] items-center gap-3 text-sm">
                <span>{statusLabel[s]}</span>
                <div className="h-3 rounded-sm bg-chalk">
                  <div className={`h-full rounded-sm ${barColor[s]}`} style={{ width: `${orders.length ? (n / orders.length) * 100 : 0}%` }} />
                </div>
                <span className="num text-right font-semibold">{n}</span>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
