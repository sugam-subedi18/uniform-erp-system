import { useState } from 'react';
import { useData } from '../context/DataContext';
import { Badge, Modal, PageHeader, Field, inputCls, btnPrimary, btnTape, btnGhost, statusLabel, statusStripe, fmtDate, daysLeft } from '../components/ui';

const filters = ['all', 'pending', 'confirmed', 'in_production', 'ready', 'dispatched'];
const nextStep = { confirmed: ['in_production', 'Start production'], in_production: ['ready', 'Mark ready for dispatch'] };
const today = () => new Date().toISOString().slice(0, 10);
const blankItem = () => ({ uid: Math.random(), uniform_type: '', size: '', color: '', quantity: '', fabric_id: '' });
const pieces = (o) => o.items.reduce((n, i) => n + i.quantity, 0);

export default function Orders() {
  const { orders, customerName } = useData();
  const [filter, setFilter] = useState('all');
  const [openId, setOpenId] = useState(null);
  const [showNew, setShowNew] = useState(false);
  const [notice, setNotice] = useState('');

  const shown = orders.filter((o) => filter === 'all' || o.status === filter);
  const open = orders.find((o) => o.id === openId);

  return (
    <>
      <PageHeader
        title="Orders"
        subtitle="From the first call to confirmed designs, production and dispatch."
        action={<button className={btnTape} onClick={() => setShowNew(true)}>New order</button>}
      />
      {notice && <p role="status" className="mb-5 rounded-lg bg-ok/10 px-4 py-3 text-sm text-ok">{notice}</p>}

      <div className="mb-5 flex flex-wrap gap-2">
        {filters.map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`rounded-full px-3.5 py-1.5 text-sm font-medium ring-1 ring-line ${filter === f ? 'bg-ink text-white ring-ink' : 'bg-white hover:bg-chalk'}`}>
            {f === 'all' ? 'All orders' : statusLabel[f]} <span className="num opacity-60">{f === 'all' ? orders.length : orders.filter((o) => o.status === f).length}</span>
          </button>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {shown.map((o) => {
          const d = daysLeft(o.due_date);
          return (
            <article key={o.id} className={`rounded-xl border-l-4 bg-white p-5 ring-1 ring-line ${statusStripe[o.status]}`}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-bold leading-tight">{customerName(o.customer_id)}</h3>
                  <p className="text-sm text-ink/60">Order #{o.id}</p>
                </div>
                <Badge status={o.status} />
              </div>
              <p className="mt-4 text-sm">{o.items.length} uniform {o.items.length === 1 ? 'type' : 'types'}, <span className="num">{pieces(o)}</span> pieces</p>
              <p className="mt-1 text-sm text-ink/60">
                Due {fmtDate(o.due_date)}
                {o.status !== 'dispatched' && <span className={d < 0 ? ' font-semibold text-alert' : ''}>{d < 0 ? ` (${-d} days overdue)` : ` (${d} days left)`}</span>}
              </p>
              <button className={`${btnGhost} mt-4 w-full`} onClick={() => setOpenId(o.id)}>
                {o.status === 'pending' ? 'Add designs and confirm' : 'View details'}
              </button>
            </article>
          );
        })}
        {shown.length === 0 && <p className="text-ink/60">No orders with this status yet.</p>}
      </div>

      {open && <OrderDetail order={open} onClose={() => setOpenId(null)} onNotice={setNotice} />}
      {showNew && <NewOrder onClose={() => setShowNew(false)} />}
    </>
  );
}

function OrderDetail({ order, onClose, onNotice }) {
  const { customerName, fabricName, updateItem, updateOrder, confirmOrder } = useData();
  const editable = order.status === 'pending';
  const complete = order.items.every((i) => i.design_image && i.printing_details.trim());
  const step = nextStep[order.status];

  const upload = (item, file) => {
    if (!file) return;
    // Preview only. With the backend, send the file as FormData and store the returned path.
    updateItem(order.id, item.id, { design_image: URL.createObjectURL(file) });
  };

  const advance = () => {
    updateOrder(order.id, { status: step[0] });
    if (step[0] === 'ready') onNotice(`Order #${order.id} is ready. Dispatch staff get an email alert once the backend is connected.`);
    onClose();
  };

  return (
    <Modal wide title={`Order #${order.id}, ${customerName(order.customer_id)}`} onClose={onClose}>
      <div className="mb-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-ink/70">
        <Badge status={order.status} />
        <span>Placed {fmtDate(order.order_date)}</span>
        <span>Due {fmtDate(order.due_date)}</span>
        {order.confirmed_at && <span>Confirmed {fmtDate(order.confirmed_at)}</span>}
      </div>

      <div className="space-y-4">
        {order.items.map((item) => (
          <div key={item.id} className="rounded-lg border border-line p-4">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="font-semibold">{item.uniform_type}, size {item.size}, {item.color}</p>
              <p className="num text-sm text-ink/70">{item.quantity} pieces from {fabricName(item.fabric_id)}</p>
            </div>
            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              <div>
                <p className="mb-1 text-sm font-medium">Design photo</p>
                {item.design_image === 'sample' ? (
                  <div className="grid h-32 place-items-center rounded-lg bg-chalk text-sm text-ink/60">Design on file</div>
                ) : item.design_image ? (
                  <img src={item.design_image} alt={`Design for ${item.uniform_type}`} className="h-32 w-full rounded-lg object-contain ring-1 ring-line" />
                ) : (
                  <div className="grid h-32 place-items-center rounded-lg border-2 border-dashed border-line text-sm text-ink/50">No design yet</div>
                )}
                {editable && (
                  <input type="file" accept="image/*" onChange={(e) => upload(item, e.target.files[0])}
                    className="mt-2 block w-full text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-tape file:px-3 file:py-1.5 file:font-semibold file:text-ink" />
                )}
              </div>
              <Field label="Printing details">
                <textarea rows="5" disabled={!editable} value={item.printing_details}
                  onChange={(e) => updateItem(order.id, item.id, { printing_details: e.target.value })}
                  placeholder="Logo position, size, thread or ink color, text to print"
                  className={`${inputCls} disabled:bg-chalk`} />
              </Field>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
        {editable ? (
          <>
            <p className="text-sm text-ink/60">{complete ? 'All designs are in. You can confirm this order.' : 'Add a design photo and printing details for every item to confirm.'}</p>
            <button className={btnPrimary} disabled={!complete} onClick={() => { confirmOrder(order.id); onClose(); }}>Confirm order</button>
          </>
        ) : (
          <>
            <button className={btnGhost} onClick={onClose}>Close</button>
            {step && <button className={btnPrimary} onClick={advance}>{step[1]}</button>}
          </>
        )}
      </div>
    </Modal>
  );
}

function NewOrder({ onClose }) {
  const { customers, fabrics, addOrder } = useData();
  const [customer_id, setCustomer] = useState('');
  const [order_date, setOrderDate] = useState(today());
  const [due_date, setDueDate] = useState('');
  const [items, setItems] = useState([blankItem()]);

  const setItem = (uid, k, v) => setItems((p) => p.map((i) => (i.uid === uid ? { ...i, [k]: v } : i)));

  const submit = (e) => {
    e.preventDefault();
    addOrder({
      customer_id: +customer_id, order_date, due_date,
      items: items.map((i, n) => ({
        id: Date.now() + n, uniform_type: i.uniform_type.trim(), size: i.size.trim(), color: i.color.trim(),
        quantity: +i.quantity, fabric_id: +i.fabric_id, design_image: '', printing_details: '',
      })),
    });
    onClose();
  };

  return (
    <Modal wide title="New order" onClose={onClose}>
      <form onSubmit={submit} className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Customer">
            <select required value={customer_id} onChange={(e) => setCustomer(e.target.value)} className={inputCls}>
              <option value="">Choose a customer</option>
              {customers.map((c) => <option key={c.id} value={c.id}>{c.name} ({c.type})</option>)}
            </select>
          </Field>
          <Field label="Order date"><input required type="date" value={order_date} onChange={(e) => setOrderDate(e.target.value)} className={inputCls} /></Field>
          <Field label="Due date"><input required type="date" min={order_date} value={due_date} onChange={(e) => setDueDate(e.target.value)} className={inputCls} /></Field>
        </div>

        <div className="space-y-3">
          <h3 className="font-semibold">Uniform items</h3>
          {items.map((i) => (
            <div key={i.uid} className="grid gap-3 rounded-lg border border-line p-3 sm:grid-cols-6">
              <input required list="uniform-types" placeholder="Uniform type" value={i.uniform_type} onChange={(e) => setItem(i.uid, 'uniform_type', e.target.value)} className={`${inputCls} sm:col-span-2`} />
              <input required placeholder="Size" value={i.size} onChange={(e) => setItem(i.uid, 'size', e.target.value)} className={inputCls} />
              <input required placeholder="Color" value={i.color} onChange={(e) => setItem(i.uid, 'color', e.target.value)} className={inputCls} />
              <input required type="number" min="1" placeholder="Pieces" value={i.quantity} onChange={(e) => setItem(i.uid, 'quantity', e.target.value)} className={inputCls} />
              <select required value={i.fabric_id} onChange={(e) => setItem(i.uid, 'fabric_id', e.target.value)} className={`${inputCls} sm:col-span-5`}>
                <option value="">Fabric to use</option>
                {fabrics.map((f) => <option key={f.id} value={f.id}>{f.color} {f.fabric_type} ({f.quantity} {f.unit} in stock)</option>)}
              </select>
              <button type="button" disabled={items.length === 1} onClick={() => setItems((p) => p.filter((x) => x.uid !== i.uid))}
                className="rounded-lg text-sm text-alert hover:underline disabled:opacity-30">Remove</button>
            </div>
          ))}
          <datalist id="uniform-types">
            {['Shirt', 'Trouser', 'Skirt', 'Blazer', 'T-shirt', 'Tracksuit', 'Sweater', 'Tie'].map((t) => <option key={t} value={t} />)}
          </datalist>
          <button type="button" className={btnGhost} onClick={() => setItems((p) => [...p, blankItem()])}>Add another item</button>
        </div>

        <p className="text-sm text-ink/60">The order starts as pending. Add the design photo and printing details when the customer confirms.</p>
        <div className="flex justify-end gap-3">
          <button type="button" className={btnGhost} onClick={onClose}>Cancel</button>
          <button type="submit" className={btnPrimary}>Save order</button>
        </div>
      </form>
    </Modal>
  );
}
