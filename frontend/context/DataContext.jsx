import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import * as seed from '../data/mockData';

const DataContext = createContext(null);
export const useData = () => useContext(DataContext);

const nextId = (list) => Math.max(0, ...list.map((x) => x.id)) + 1;
const today = () => new Date().toISOString().slice(0, 10);
const currentUser = () => localStorage.getItem('name') || 'Staff';
export const unitFor = (type) => (type === 'hosiery' ? 'kg' : 'meter');

export function DataProvider({ children }) {
  // LIVE from the backend
  const [fabrics, setFabrics] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  // Still sample data until their backend routes are built
  const [purchases, setPurchases] = useState(seed.purchases);
  const [orders, setOrders] = useState(seed.orders);
  const [dispatches, setDispatches] = useState(seed.dispatches);
  const customers = seed.customers;

  const loadFabrics = useCallback(async () => {
    if (!localStorage.getItem('token')) return setFabrics([]);
    try { setFabrics((await api.get('/fabrics')).data); } catch { setFabrics([]); }
  }, []);

  const loadSuppliers = useCallback(async () => {
    const role = localStorage.getItem('role');
    if (!localStorage.getItem('token') || !['admin', 'store_manager'].includes(role)) return setSuppliers([]);
    try { setSuppliers((await api.get('/suppliers')).data); } catch { setSuppliers([]); }
  }, []);

  const reload = useCallback(() => Promise.all([loadFabrics(), loadSuppliers()]), [loadFabrics, loadSuppliers]);
  useEffect(() => { reload(); }, [reload]);

  const customerName = (id) => customers.find((c) => c.id === id)?.name ?? 'Unknown';
  const supplierName = (id) => suppliers.find((s) => s.id === id)?.name ?? 'Unknown';
  const fabricName = (id) => {
    const f = fabrics.find((x) => x.id === id);
    return f ? `${f.color} ${f.fabric_type}` : 'Unknown fabric';
  };

  // Saved in the database. Throws if the server refuses, so the form can show the message.
  const addFabric = async (f) => {
    await api.post('/fabrics', f);
    await loadFabrics();
  };

  // Restocks the fabric in the database. The purchase history list is still sample data for now.
  const addPurchase = async (pu) => {
    const hit = fabrics.find((f) => f.fabric_type === pu.fabric_type && f.color.toLowerCase() === pu.fabric_color.toLowerCase());
    if (hit) {
      await api.put(`/fabrics/${hit.id}`, { quantity: +(hit.quantity + pu.quantity).toFixed(2) });
    } else {
      await api.post('/fabrics', {
        fabric_type: pu.fabric_type, color: pu.fabric_color, quantity: pu.quantity,
        cost_per_unit: Math.round(pu.total_cost / pu.quantity), reorder_threshold: 50, supplier_id: pu.supplier_id,
      });
    }
    setPurchases((p) => [{ ...pu, id: nextId(p), ordered_by: currentUser() }, ...p]);
    await loadFabrics();
  };

  const addOrder = (o) => setOrders((p) => [{ ...o, id: nextId(p), status: 'pending', confirmed_at: null, created_by: currentUser() }, ...p]);
  const updateOrder = (id, patch) => setOrders((p) => p.map((o) => (o.id === id ? { ...o, ...patch } : o)));
  const updateItem = (orderId, itemId, patch) =>
    setOrders((p) => p.map((o) => (o.id === orderId ? { ...o, items: o.items.map((i) => (i.id === itemId ? { ...i, ...patch } : i)) } : o)));
  const confirmOrder = (id) => updateOrder(id, { status: 'confirmed', confirmed_at: today() });

  const dispatchOrder = (orderId, notes) => {
    setDispatches((p) => [{ id: nextId(p), order_id: orderId, dispatch_date: today(), dispatched_by: currentUser(), delivery_status: 'shipped', notes }, ...p]);
    updateOrder(orderId, { status: 'dispatched' });
  };
  const updateDelivery = (id, status) => setDispatches((p) => p.map((d) => (d.id === id ? { ...d, delivery_status: status } : d)));

  return (
    <DataContext.Provider value={{
      fabrics, suppliers, customers, purchases, orders, dispatches, reload,
      customerName, supplierName, fabricName,
      addFabric, addPurchase, addOrder, updateOrder, updateItem, confirmOrder, dispatchOrder, updateDelivery,
    }}>
      {children}
    </DataContext.Provider>
  );
}
