import { useState } from 'react';
import { useData, unitFor } from '../context/DataContext';
import { PageHeader, Modal, Field, TapeBar, inputCls, btnPrimary, btnTape, btnGhost } from '../components/ui';
import { errMsg } from '../services/api';

const types = ['all', 'hosiery', 'shirting', 'suiting'];
const empty = { fabric_type: 'hosiery', color: '', quantity: '', cost_per_unit: '', reorder_threshold: '', supplier_id: '' };

export default function FabricInventory() {
  const { fabrics, suppliers, supplierName, addFabric } = useData();
  const [q, setQ] = useState('');
  const [type, setType] = useState('all');
  const [lowOnly, setLowOnly] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState(empty);
  const [error, setError] = useState('');
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const rows = fabrics.filter((f) =>
    (type === 'all' || f.fabric_type === type) &&
    (!lowOnly || f.quantity < f.reorder_threshold) &&
    f.color.toLowerCase().includes(q.toLowerCase()));

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await addFabric({
        fabric_type: form.fabric_type, color: form.color.trim(),
        quantity: +form.quantity, cost_per_unit: +form.cost_per_unit,
        reorder_threshold: +form.reorder_threshold, supplier_id: +form.supplier_id,
      });
      setForm(empty);
      setShowAdd(false);
    } catch (err) {
      setError(errMsg(err));
    }
  };

  return (
    <>
      <PageHeader
        title="Fabric inventory"
        subtitle="Hosiery is counted in kg. Shirting and suiting are counted in meters."
        action={<button className={btnTape} onClick={() => setShowAdd(true)}>Add fabric</button>}
      />

      <div className="mb-5 flex flex-wrap items-center gap-3">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by color" className={`${inputCls} max-w-56`} />
        <div className="flex rounded-lg bg-white p-1 ring-1 ring-line">
          {types.map((t) => (
            <button key={t} onClick={() => setType(t)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium capitalize ${type === t ? 'bg-ink text-white' : 'hover:bg-chalk'}`}>{t}</button>
          ))}
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={lowOnly} onChange={(e) => setLowOnly(e.target.checked)} className="h-4 w-4 accent-ink" />
          Low stock only
        </label>
      </div>

      <div className="overflow-x-auto rounded-xl bg-white ring-1 ring-line">
        <table className="w-full min-w-[56rem] text-left text-sm">
          <thead className="border-b border-line bg-chalk/60 text-ink/70">
            <tr>
              <th className="px-4 py-3 font-semibold">Fabric</th>
              <th className="px-4 py-3 font-semibold">In stock</th>
              <th className="w-48 px-4 py-3 font-semibold">Stock level</th>
              <th className="px-4 py-3 font-semibold">Reorder at</th>
              <th className="px-4 py-3 font-semibold">Cost per unit</th>
              <th className="px-4 py-3 font-semibold">Supplier</th>
              <th className="px-4 py-3 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {rows.map((f) => {
              const low = f.quantity < f.reorder_threshold;
              return (
                <tr key={f.id} className={low ? 'bg-alert/5' : ''}>
                  <td className="px-4 py-3">
                    <p className="font-medium">{f.color}</p>
                    <p className="text-xs capitalize text-ink/60">{f.fabric_type}</p>
                  </td>
                  <td className="num px-4 py-3 font-semibold">{f.quantity} {f.unit}</td>
                  <td className="px-4 py-3"><TapeBar value={f.quantity} max={f.reorder_threshold * 2} low={low} /></td>
                  <td className="num px-4 py-3">{f.reorder_threshold} {f.unit}</td>
                  <td className="num px-4 py-3">Rs. {f.cost_per_unit} per {f.unit}</td>
                  <td className="px-4 py-3">{supplierName(f.supplier_id)}</td>
                  <td className="px-4 py-3">
                    {low
                      ? <span className="rounded-full bg-alert/15 px-2.5 py-0.5 text-xs font-semibold text-alert">Reorder now</span>
                      : <span className="rounded-full bg-ok/15 px-2.5 py-0.5 text-xs font-semibold text-ok">In stock</span>}
                  </td>
                </tr>
              );
            })}
            {rows.length === 0 && (
              <tr><td colSpan="7" className="px-4 py-10 text-center text-ink/60">No fabric matches these filters. Clear the search or add a new fabric.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {showAdd && (
        <Modal title="Add fabric" onClose={() => setShowAdd(false)}>
          <form onSubmit={submit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Fabric type">
                <select value={form.fabric_type} onChange={set('fabric_type')} className={inputCls}>
                  <option value="hosiery">Hosiery</option>
                  <option value="shirting">Shirting</option>
                  <option value="suiting">Suiting</option>
                </select>
              </Field>
              <Field label="Color">
                <input required value={form.color} onChange={set('color')} className={inputCls} placeholder="e.g. Maroon" />
              </Field>
              <Field label={`Quantity in stock (${unitFor(form.fabric_type)})`}>
                <input required type="number" min="0" step="0.01" value={form.quantity} onChange={set('quantity')} className={inputCls} />
              </Field>
              <Field label={`Reorder point (${unitFor(form.fabric_type)})`} hint="You get a low-stock email when stock falls below this.">
                <input required type="number" min="0" step="0.01" value={form.reorder_threshold} onChange={set('reorder_threshold')} className={inputCls} />
              </Field>
              <Field label={`Cost per ${unitFor(form.fabric_type)} (Rs.)`}>
                <input required type="number" min="0" step="0.01" value={form.cost_per_unit} onChange={set('cost_per_unit')} className={inputCls} />
              </Field>
              <Field label="Usual supplier">
                <select required value={form.supplier_id} onChange={set('supplier_id')} className={inputCls}>
                  <option value="">Choose a supplier</option>
                  {suppliers.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </Field>
            </div>
            {error && <p role="alert" className="rounded-lg bg-alert/10 px-3 py-2 text-sm text-alert">{error}</p>}
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" className={btnGhost} onClick={() => { setError(''); setShowAdd(false); }}>Cancel</button>
              <button type="submit" className={btnPrimary}>Save fabric</button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
