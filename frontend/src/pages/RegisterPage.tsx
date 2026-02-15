import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError('');
    try {
      await register(name, email, password);
      navigate('/dashboard');
    } catch (err) {
      setError((err as Error).message);
    }
  }

  return (
    <main className="min-h-screen grid place-items-center bg-slate-100 p-6">
      <form className="w-full max-w-md bg-white rounded-xl shadow p-6" onSubmit={onSubmit}>
        <h1 className="text-2xl font-bold">Create account</h1>
        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
        <label className="block mt-4 text-sm font-medium">Name</label>
        <input className="mt-1 w-full border rounded px-3 py-2" value={name} onChange={(e) => setName(e.target.value)} />
        <label className="block mt-4 text-sm font-medium">Email</label>
        <input className="mt-1 w-full border rounded px-3 py-2" value={email} onChange={(e) => setEmail(e.target.value)} />
        <label className="block mt-4 text-sm font-medium">Password</label>
        <input className="mt-1 w-full border rounded px-3 py-2" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className="mt-6 w-full bg-slate-900 text-white py-2 rounded">Create account</button>
        <p className="mt-4 text-sm text-slate-600">
          Already have an account? <Link className="underline" to="/login">Login</Link>
        </p>
      </form>
    </main>
  );
}
