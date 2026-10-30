import { useState } from 'react';
import { useData, unitFor } from '../context/DataContext';
import { PageHeader, Field, inputCls, btnTape, fmtDate } from '../components/ui';
import { errMsg } from '../services/api';

const today = () => new Date().toISOString().slice(0, 10);
const empty = () => ({ supplier_id: '', fabric_type: 'hosiery', fabric_color: '', quantity: '', total_cost: '', purchase_date: today() });

export default function Purchases() {
  const { purchases, suppliers, fabrics, supplierName, addPurchase } = useData();
  const [form, setForm] = useState(empty());
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const unit = unitFor(form.fabric_type);
  const perUnit = form.quantity && form.total_cost ? Math.round(form.total_cost / form.quantity) : null;
  const colors = [...new Set(fabrics.filter((f) => f.fabric_type === form.fabric_type).map((f) => f.color))];

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setNotice('');
    try {
      await addPurchase({
        supplier_id: +form.supplier_id, fabric_type: form.fabric_type, fabric_color: form.fabric_color.trim(),
        quantity: +form.quantity, total_cost: +form.total_cost, purchase_date: form.purchase_date,
      });
      setNotice(`Recorded ${form.quantity} ${unit} of ${form.fabric_color} ${form.fabric_type}. Stock is updated.`);
      setForm(empty());
    } catch (err) {
      setError(errMsg(err));
    }
  };

  return (
    <>
      <PageHeader title="Purchases" subtitle="Record fabric bought from suppliers. Stock goes up automatically." />

      <div className="grid gap-6 xl:grid-cols-5">
        <form onSubmit={submit} className="h-fit space-y-4 rounded-xl bg-white p-6 ring-1 ring-line xl:col-span-2">
          <h2 className="text-lg font-bold">New purchase</h2>
          {notice && <p role="status" className="rounded-lg bg-ok/10 px-3 py-2 text-sm text-ok">{notice}</p>}
          {error && <p role="alert" className="rounded-lg bg-alert/10 px-3 py-2 text-sm text-alert">{error}</p>}
          <Field label="Supplier">
            <select required value={form.supplier_id} onChange={set('supplier_id')} className={inputCls}>
              <option value="">Choose a supplier</option>
              {suppliers.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Fabric type">
              <select value={form.fabric_type} onChange={set('fabric_type')} className={inputCls}>
                <option value="hosiery">Hosiery</option>
                <option value="shirting">Shirting</option>
                <option value="suiting">Suiting</option>
              </select>
            </Field>
            <Field label="Fabric color" hint="Pick an existing color or type a new one.">
              <input required list="colors" value={form.fabric_color} onChange={set('fabric_color')} className={inputCls} />
              <datalist id="colors">{colors.map((c) => <option key={c} value={c} />)}</datalist>
            </Field>
            <Field label={`Quantity (${unit})`}>
              <input required type="number" min="0.01" step="0.01" value={form.quantity} onChange={set('quantity')} className={inputCls} />
            </Field>
            <Field label="Total cost (Rs.)" hint={perUnit ? `About Rs. ${perUnit} per ${unit}` : ''}>
              <input required type="number" min="0" step="0.01" value={form.total_cost} onChange={set('total_cost')} className={inputCls} />
            </Field>
          </div>
          <Field label="Purchase date">
            <input required type="date" value={form.purchase_date} onChange={set('purchase_date')} className={inputCls} />
          </Field>
          <p className="text-sm text-ink/60">Ordered by {localStorage.getItem('name')}</p>
          <button type="submit" className={`${btnTape} w-full py-2.5`}>Record purchase</button>
        </form>

        <div className="overflow-x-auto rounded-xl bg-white ring-1 ring-line xl:col-span-3">
          <table className="w-full min-w-[34rem] text-left text-sm">
            <thead className="border-b border-line bg-chalk/60 text-ink/70">
              <tr>
                <th className="px-4 py-3 font-semibold">Date</th>
                <th className="px-4 py-3 font-semibold">Fabric</th>
                <th className="px-4 py-3 font-semibold">Supplier</th>
                <th className="px-4 py-3 text-right font-semibold">Quantity</th>
                <th className="px-4 py-3 text-right font-semibold">Total</th>
                <th className="px-4 py-3 font-semibold">Ordered by</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {purchases.map((p) => (
                <tr key={p.id}>
                  <td className="whitespace-nowrap px-4 py-3">{fmtDate(p.purchase_date)}</td>
                  <td className="px-4 py-3"><span className="font-medium">{p.fabric_color}</span> <span className="capitalize text-ink/60">{p.fabric_type}</span></td>
                  <td className="px-4 py-3">{supplierName(p.supplier_id)}</td>
                  <td className="num px-4 py-3 text-right">{p.quantity} {unitFor(p.fabric_type)}</td>
                  <td className="num px-4 py-3 text-right font-semibold">Rs. {p.total_cost.toLocaleString()}</td>
                  <td className="px-4 py-3">{p.ordered_by}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
