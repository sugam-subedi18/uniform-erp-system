import { useState } from 'react';
import { useData } from '../context/DataContext';
import { PageHeader, Badge, inputCls, btnTape, fmtDate, daysLeft } from '../components/ui';

export default function Dispatch() {
  const { orders, dispatches, customerName, dispatchOrder, updateDelivery } = useData();
  const [notes, setNotes] = useState({});
  const ready = orders.filter((o) => o.status === 'ready');
  const inProduction = orders.filter((o) => o.status === 'in_production').length;

  return (
    <>
      <PageHeader title="Dispatch" subtitle="Orders that are finished and waiting to leave the shop." />

      <section>
        <h2 className="mb-4 text-lg font-bold">Ready to dispatch <span className="num text-ink/50">{ready.length}</span></h2>
        {ready.length === 0 ? (
          <p className="rounded-xl bg-white p-6 text-ink/60 ring-1 ring-line">
            Nothing is waiting right now. {inProduction} {inProduction === 1 ? 'order is' : 'orders are'} still in production.
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {ready.map((o) => {
              const d = daysLeft(o.due_date);
              return (
                <article key={o.id} className="rounded-xl border-l-4 border-l-ok bg-white p-5 ring-1 ring-line">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-bold leading-tight">{customerName(o.customer_id)}</h3>
                      <p className="text-sm text-ink/60">Order #{o.id}, due {fmtDate(o.due_date)} ({d < 0 ? `${-d} days overdue` : `${d} days left`})</p>
                    </div>
                    <Badge status="ready" />
                  </div>
                  <ul className="mt-3 text-sm">
                    {o.items.map((i) => <li key={i.id} className="num">{i.quantity} x {i.uniform_type}, size {i.size}, {i.color}</li>)}
                  </ul>
                  <input value={notes[o.id] ?? ''} onChange={(e) => setNotes({ ...notes, [o.id]: e.target.value })}
                    placeholder="Vehicle, driver or tracking note" className={`${inputCls} mt-4`} />
                  <button className={`${btnTape} mt-3 w-full`} onClick={() => dispatchOrder(o.id, notes[o.id] ?? '')}>Dispatch order</button>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <section className="mt-10">
        <h2 className="mb-4 text-lg font-bold">Dispatch history</h2>
        <div className="overflow-x-auto rounded-xl bg-white ring-1 ring-line">
          <table className="w-full min-w-[44rem] text-left text-sm">
            <thead className="border-b border-line bg-chalk/60 text-ink/70">
              <tr>
                <th className="px-4 py-3 font-semibold">Dispatched</th>
                <th className="px-4 py-3 font-semibold">Order</th>
                <th className="px-4 py-3 font-semibold">Dispatched by</th>
                <th className="px-4 py-3 font-semibold">Notes</th>
                <th className="px-4 py-3 font-semibold">Delivery status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {dispatches.map((d) => {
                const o = orders.find((x) => x.id === d.order_id);
                return (
                  <tr key={d.id}>
                    <td className="whitespace-nowrap px-4 py-3">{fmtDate(d.dispatch_date)}</td>
                    <td className="px-4 py-3"><span className="font-medium">#{d.order_id}</span> {o && customerName(o.customer_id)}</td>
                    <td className="px-4 py-3">{d.dispatched_by}</td>
                    <td className="px-4 py-3 text-ink/70">{d.notes || 'No note'}</td>
                    <td className="px-4 py-3">
                      <select value={d.delivery_status} onChange={(e) => updateDelivery(d.id, e.target.value)} className={`${inputCls} max-w-36`} aria-label={`Delivery status for order ${d.order_id}`}>
                        <option value="pending">Pending</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                      </select>
                    </td>
                  </tr>
                );
              })}
              {dispatches.length === 0 && <tr><td colSpan="5" className="px-4 py-10 text-center text-ink/60">No shipments yet. Dispatched orders will be listed here.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
