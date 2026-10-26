import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Field, inputCls, btnPrimary } from '../components/ui';

const roles = [
  ['admin', 'Admin', 'Admin User'],
  ['store_manager', 'Store manager', 'Store Manager'],
  ['sales_staff', 'Sales staff', 'Sales Staff'],
  ['dispatch_staff', 'Dispatch staff', 'Dispatch Staff'],
];

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('admin');
  const navigate = useNavigate();

  const submit = (e) => {
    e.preventDefault();
    // Demo login: the real role will come from the backend (JWT) later.
    localStorage.setItem('role', role);
    localStorage.setItem('name', roles.find((r) => r[0] === role)[2]);
    navigate('/dashboard');
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-5">
      <section className="flex flex-col justify-between bg-ink p-8 text-white sm:p-12 lg:col-span-3">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-tape text-xl">🧵</span>
          <span className="font-display text-xl font-bold">Uniform ERP</span>
        </div>
        <div className="py-16">
          <h1 className="max-w-xl text-4xl font-bold leading-tight sm:text-5xl">Every roll counted. Every order out on time.</h1>
          <p className="mt-5 max-w-md text-lg text-white/70">
            Track fabric stock, take bulk orders with their designs, and tell dispatch the moment an order is ready.
          </p>
        </div>
        <div className="tape-rule rounded-sm" />
      </section>

      <section className="flex items-center justify-center p-8 lg:col-span-2">
        <form onSubmit={submit} className="w-full max-w-sm space-y-5">
          <div>
            <h2 className="text-2xl font-bold">Log in</h2>
            <p className="mt-1 text-sm text-ink/60">Use your staff account to continue.</p>
          </div>
          <Field label="Email">
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} placeholder="you@company.com" />
          </Field>
          <Field label="Password">
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className={inputCls} />
          </Field>
          <Field label="Log in as" hint="Demo only. Once the backend is connected, your role comes from your account.">
            <select value={role} onChange={(e) => setRole(e.target.value)} className={inputCls}>
              {roles.map(([v, label]) => <option key={v} value={v}>{label}</option>)}
            </select>
          </Field>
          <button type="submit" className={`${btnPrimary} w-full py-2.5`}>Log in</button>
        </form>
      </section>
    </div>
  );
}
