import { FormEvent, useEffect, useState } from 'react';
import { apiRequest } from '../api/http';
import { Client, Invoice, Notification, Project, Task } from '../types';
import { useAuth } from '../context/AuthContext';

interface Stats {
  clients: number;
  activeProjects: number;
  pendingTasks: number;
  overdueInvoices: number;
}

const emptyStats: Stats = {
  clients: 0,
  activeProjects: 0,
  pendingTasks: 0,
  overdueInvoices: 0
};

export function DashboardPage() {
  const { user, logout } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [stats, setStats] = useState<Stats>(emptyStats);
  const [error, setError] = useState('');

  const [clientForm, setClientForm] = useState({ companyName: '', contactName: '', email: '', phone: '' });
  const [projectForm, setProjectForm] = useState({ name: '', description: '', clientId: '', dueDate: '' });
  const [taskForm, setTaskForm] = useState({ title: '', projectId: '', dueDate: '' });
  const [invoiceForm, setInvoiceForm] = useState({ projectId: '', clientId: '', amount: '' });

  async function fetchAll() {
    const [statsData, clientsData, projectsData, tasksData, invoicesData, noticesData] = await Promise.all([
      apiRequest<Stats>('/dashboard/stats'),
      apiRequest<Client[]>('/clients'),
      apiRequest<Project[]>('/projects'),
      apiRequest<Task[]>('/tasks'),
      apiRequest<Invoice[]>('/invoices'),
      apiRequest<Notification[]>('/notifications')
    ]);

    setStats(statsData);
    setClients(clientsData);
    setProjects(projectsData);
    setTasks(tasksData);
    setInvoices(invoicesData);
    setNotifications(noticesData);
  }

  useEffect(() => {
    fetchAll().catch((err) => setError((err as Error).message));
  }, []);

  async function onCreateClient(event: FormEvent) {
    event.preventDefault();
    await apiRequest('/clients', { method: 'POST', body: JSON.stringify({ ...clientForm, status: 'active' }) });
    setClientForm({ companyName: '', contactName: '', email: '', phone: '' });
    await fetchAll();
  }

  async function onCreateProject(event: FormEvent) {
    event.preventDefault();
    if (!user) return;
    await apiRequest('/projects', {
      method: 'POST',
      body: JSON.stringify({
        ...projectForm,
        managerId: user.id,
        startDate: new Date().toISOString(),
        budget: 0,
        status: 'active'
      })
    });
    setProjectForm({ name: '', description: '', clientId: '', dueDate: '' });
    await fetchAll();
  }

  async function onCreateTask(event: FormEvent) {
    event.preventDefault();
    if (!user) return;
    await apiRequest('/tasks', {
      method: 'POST',
      body: JSON.stringify({ ...taskForm, assigneeId: user.id, priority: 'medium' })
    });
    setTaskForm({ title: '', projectId: '', dueDate: '' });
    await fetchAll();
  }

  async function onCreateInvoice(event: FormEvent) {
    event.preventDefault();
    await apiRequest('/invoices', {
      method: 'POST',
      body: JSON.stringify({
        ...invoiceForm,
        amount: Number(invoiceForm.amount),
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        billingType: 'full'
      })
    });
    setInvoiceForm({ projectId: '', clientId: '', amount: '' });
    await fetchAll();
  }

  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">ClientVault</h1>
            <p className="text-slate-600">{user?.name} ({user?.role}) dashboard</p>
          </div>
          <button className="border rounded px-4 py-2" onClick={logout}>Logout</button>
        </header>

        <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-white rounded shadow p-4"><p className="text-sm text-slate-500">Clients</p><p className="text-2xl font-bold">{stats.clients}</p></div>
          <div className="bg-white rounded shadow p-4"><p className="text-sm text-slate-500">Active projects</p><p className="text-2xl font-bold">{stats.activeProjects}</p></div>
          <div className="bg-white rounded shadow p-4"><p className="text-sm text-slate-500">Pending tasks</p><p className="text-2xl font-bold">{stats.pendingTasks}</p></div>
          <div className="bg-white rounded shadow p-4"><p className="text-sm text-slate-500">Overdue invoices</p><p className="text-2xl font-bold">{stats.overdueInvoices}</p></div>
        </section>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <section className="grid lg:grid-cols-2 gap-4">
          <form onSubmit={onCreateClient} className="bg-white rounded shadow p-4 space-y-2">
            <h2 className="font-semibold">Client Management</h2>
            <input className="w-full border rounded px-2 py-1" placeholder="Company" value={clientForm.companyName} onChange={(e) => setClientForm((v) => ({ ...v, companyName: e.target.value }))} />
            <input className="w-full border rounded px-2 py-1" placeholder="Contact" value={clientForm.contactName} onChange={(e) => setClientForm((v) => ({ ...v, contactName: e.target.value }))} />
            <input className="w-full border rounded px-2 py-1" placeholder="Email" value={clientForm.email} onChange={(e) => setClientForm((v) => ({ ...v, email: e.target.value }))} />
            <input className="w-full border rounded px-2 py-1" placeholder="Phone" value={clientForm.phone} onChange={(e) => setClientForm((v) => ({ ...v, phone: e.target.value }))} />
            <button className="bg-slate-900 text-white rounded px-3 py-1">Save client</button>
          </form>

          <form onSubmit={onCreateProject} className="bg-white rounded shadow p-4 space-y-2">
            <h2 className="font-semibold">Project Management</h2>
            <input className="w-full border rounded px-2 py-1" placeholder="Project name" value={projectForm.name} onChange={(e) => setProjectForm((v) => ({ ...v, name: e.target.value }))} />
            <select className="w-full border rounded px-2 py-1" value={projectForm.clientId} onChange={(e) => setProjectForm((v) => ({ ...v, clientId: e.target.value }))}>
              <option value="">Select client</option>
              {clients.map((item) => <option key={item._id} value={item._id}>{item.companyName}</option>)}
            </select>
            <input className="w-full border rounded px-2 py-1" type="date" value={projectForm.dueDate} onChange={(e) => setProjectForm((v) => ({ ...v, dueDate: e.target.value }))} />
            <button className="bg-slate-900 text-white rounded px-3 py-1">Create project</button>
          </form>

          <form onSubmit={onCreateTask} className="bg-white rounded shadow p-4 space-y-2">
            <h2 className="font-semibold">Task Management</h2>
            <input className="w-full border rounded px-2 py-1" placeholder="Task title" value={taskForm.title} onChange={(e) => setTaskForm((v) => ({ ...v, title: e.target.value }))} />
            <select className="w-full border rounded px-2 py-1" value={taskForm.projectId} onChange={(e) => setTaskForm((v) => ({ ...v, projectId: e.target.value }))}>
              <option value="">Select project</option>
              {projects.map((item) => <option key={item._id} value={item._id}>{item.name}</option>)}
            </select>
            <input className="w-full border rounded px-2 py-1" type="date" value={taskForm.dueDate} onChange={(e) => setTaskForm((v) => ({ ...v, dueDate: e.target.value }))} />
            <button className="bg-slate-900 text-white rounded px-3 py-1">Create task</button>
          </form>

          <form onSubmit={onCreateInvoice} className="bg-white rounded shadow p-4 space-y-2">
            <h2 className="font-semibold">Invoice Management</h2>
            <select className="w-full border rounded px-2 py-1" value={invoiceForm.projectId} onChange={(e) => setInvoiceForm((v) => ({ ...v, projectId: e.target.value }))}>
              <option value="">Select project</option>
              {projects.map((item) => <option key={item._id} value={item._id}>{item.name}</option>)}
            </select>
            <select className="w-full border rounded px-2 py-1" value={invoiceForm.clientId} onChange={(e) => setInvoiceForm((v) => ({ ...v, clientId: e.target.value }))}>
              <option value="">Select client</option>
              {clients.map((item) => <option key={item._id} value={item._id}>{item.companyName}</option>)}
            </select>
            <input className="w-full border rounded px-2 py-1" placeholder="Amount" value={invoiceForm.amount} onChange={(e) => setInvoiceForm((v) => ({ ...v, amount: e.target.value }))} />
            <button className="bg-slate-900 text-white rounded px-3 py-1">Generate invoice</button>
          </form>
        </section>

        <section className="grid lg:grid-cols-4 gap-4">
          <div className="bg-white rounded shadow p-4"><h3 className="font-semibold mb-2">Clients</h3>{clients.slice(0, 4).map((item) => <p key={item._id} className="text-sm">{item.companyName}</p>)}</div>
          <div className="bg-white rounded shadow p-4"><h3 className="font-semibold mb-2">Projects</h3>{projects.slice(0, 4).map((item) => <p key={item._id} className="text-sm">{item.name} ({item.status})</p>)}</div>
          <div className="bg-white rounded shadow p-4"><h3 className="font-semibold mb-2">Tasks</h3>{tasks.slice(0, 4).map((item) => <p key={item._id} className="text-sm">{item.title} ({item.status})</p>)}</div>
          <div className="bg-white rounded shadow p-4"><h3 className="font-semibold mb-2">Notifications</h3>{notifications.slice(0, 4).map((item) => <p key={item._id} className="text-sm">{item.title}</p>)}</div>
        </section>
      </div>
    </main>
  );
}
