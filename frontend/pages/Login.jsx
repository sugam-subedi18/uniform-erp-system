import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { errMsg } from '../services/api';
import { useData } from '../context/DataContext';
import { Field, inputCls, btnPrimary } from '../components/ui';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  const { reload } = useData();

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.user.role);
      localStorage.setItem('name', data.user.name);
      await reload(); // load fabrics and suppliers for this user
      navigate('/dashboard');
    } catch (err) {
      setError(errMsg(err));
    } finally {
      setBusy(false);
    }
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
            <p className="mt-1 text-sm text-ink/60">Use the account your admin created for you.</p>
          </div>
          {error && <p role="alert" className="rounded-lg bg-alert/10 px-3 py-2 text-sm text-alert">{error}</p>}
          <Field label="Email">
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} placeholder="you@company.com" />
          </Field>
          <Field label="Password">
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className={inputCls} />
          </Field>
          <button type="submit" disabled={busy} className={`${btnPrimary} w-full py-2.5`}>{busy ? 'Logging in...' : 'Log in'}</button>
        </form>
      </section>
    </div>
  );
}
