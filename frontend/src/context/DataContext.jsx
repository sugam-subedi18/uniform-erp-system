import { createContext, useContext, useState } from 'react';
import * as seed from '../data/mockData';

const DataContext = createContext(null);
export const useData = () => useContext(DataContext);

const nextId = (list) => Math.max(0, ...list.map((x) => x.id)) + 1;
const today = () => new Date().toISOString().slice(0, 10);
const currentUser = () => localStorage.getItem('name') || 'Staff';
export const unitFor = (type) => (type === 'hosiery' ? 'kg' : 'meter');

export function DataProvider({ children }) {
  const [fabrics, setFabrics] = useState(seed.fabrics);
  const [purchases, setPurchases] = useState(seed.purchases);
  const [orders, setOrders] = useState(seed.orders);
  const [dispatches, setDispatches] = useState(seed.dispatches);
  const suppliers = seed.suppliers;
  const customers = seed.customers;

  const customerName = (id) => customers.find((c) => c.id === id)?.name ?? 'Unknown';
  const supplierName = (id) => suppliers.find((s) => s.id === id)?.name ?? 'Unknown';
  const fabricName = (id) => {
    const f = fabrics.find((x) => x.id === id);
    return f ? `${f.color} ${f.fabric_type}` : 'Unknown fabric';
  };

  const addFabric = (f) => setFabrics((p) => [...p, { ...f, id: nextId(p), unit: unitFor(f.fabric_type) }]);

  // A purchase restocks the matching fabric, or creates a new fabric line if it is new.
  const addPurchase = (pu) => {
    setPurchases((p) => [{ ...pu, id: nextId(p), ordered_by: currentUser() }, ...p]);
    setFabrics((p) => {
      const hit = p.find((f) => f.fabric_type === pu.fabric_type && f.color.toLowerCase() === pu.fabric_color.toLowerCase());
      if (hit) return p.map((f) => (f.id === hit.id ? { ...f, quantity: f.quantity + pu.quantity } : f));
      return [...p, {
        id: nextId(p), fabric_type: pu.fabric_type, color: pu.fabric_color, unit: unitFor(pu.fabric_type),
        quantity: pu.quantity, cost_per_unit: Math.round(pu.total_cost / pu.quantity),
        reorder_threshold: 50, supplier_id: pu.supplier_id,
      }];
    });
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
      fabrics, suppliers, customers, purchases, orders, dispatches,
      customerName, supplierName, fabricName,
      addFabric, addPurchase, addOrder, updateOrder, updateItem, confirmOrder, dispatchOrder, updateDelivery,
    }}>
      {children}
    </DataContext.Provider>
  );
}
