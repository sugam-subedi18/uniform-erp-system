import { NavLink, Outlet, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useData } from '../context/DataContext';

const ALL = ['admin', 'store_manager', 'sales_staff', 'dispatch_staff'];
const links = [
  { to: '/dashboard', label: 'Dashboard', icon: '▦', roles: ALL },
  { to: '/fabrics', label: 'Fabric inventory', icon: '🧵', roles: ['admin', 'store_manager'] },
  { to: '/purchases', label: 'Purchases', icon: '🧾', roles: ['admin', 'store_manager'] },
  { to: '/orders', label: 'Orders', icon: '📋', roles: ['admin', 'sales_staff'] },
  { to: '/dispatch', label: 'Dispatch', icon: '🚚', roles: ['admin', 'dispatch_staff'] },
];
const roleLabel = { admin: 'Admin', store_manager: 'Store manager', sales_staff: 'Sales staff', dispatch_staff: 'Dispatch staff' };

export default function Layout() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { fabrics, orders } = useData();
  const role = localStorage.getItem('role');
  const name = localStorage.getItem('name');

  if (!role) return <Navigate to="/login" replace />;
  const current = links.find((l) => pathname.startsWith(l.to));
  if (current && !current.roles.includes(role)) return <Navigate to="/dashboard" replace />;

  const allowed = links.filter((l) => l.roles.includes(role));
  const counts = {
    '/fabrics': fabrics.filter((f) => f.quantity < f.reorder_threshold).length,
    '/dispatch': orders.filter((o) => o.status === 'ready').length,
  };
  const logout = () => { localStorage.clear(); navigate('/login'); };

  const linkCls = ({ isActive }) =>
    `flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${isActive ? 'bg-tape text-ink' : 'text-white/75 hover:bg-white/10'}`;

  return (
    <div className="min-h-screen md:flex">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col bg-ink p-5 text-white md:flex">
        <div className="mb-8 flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-tape text-lg">🧵</span>
          <span className="font-display text-xl font-bold">Uniform ERP</span>
        </div>
        <nav className="flex flex-1 flex-col gap-1">
          {allowed.map((l) => (
            <NavLink key={l.to} to={l.to} className={linkCls}>
              <span className="flex items-center gap-3"><span aria-hidden>{l.icon}</span>{l.label}</span>
              {counts[l.to] > 0 && <span className="rounded-full bg-alert px-2 text-xs font-bold text-white">{counts[l.to]}</span>}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-white/15 pt-4">
          <p className="font-semibold">{name}</p>
          <p className="text-sm text-white/60">{roleLabel[role]}</p>
          <button onClick={logout} className="mt-3 text-sm text-tape hover:underline">Log out</button>
        </div>
      </aside>

      <div className="flex-1">
        <nav className="flex items-center gap-1 overflow-x-auto bg-ink p-2 md:hidden">
          {allowed.map((l) => (
            <NavLink key={l.to} to={l.to} className={linkCls}>{l.label}</NavLink>
          ))}
          <button onClick={logout} className="ml-auto whitespace-nowrap px-3 text-sm text-tape">Log out</button>
        </nav>
        <main className="p-5 sm:p-8 lg:p-10"><Outlet /></main>
      </div>
    </div>
  );
}
