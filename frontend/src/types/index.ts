export type Role = 'admin' | 'manager' | 'staff' | 'client';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface Client {
  _id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  status: 'lead' | 'active' | 'inactive';
  notes: string;
  createdAt: string;
}

export interface Project {
  _id: string;
  name: string;
  status: 'planned' | 'active' | 'on_hold' | 'completed';
  dueDate: string;
}

export interface Task {
  _id: string;
  title: string;
  status: 'todo' | 'in_progress' | 'blocked' | 'completed';
  dueDate: string;
}

export interface Invoice {
  _id: string;
  invoiceNo: string;
  amount: number;
  status: 'draft' | 'issued' | 'paid' | 'overdue';
  dueDate: string;
}

export interface Notification {
  _id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}
