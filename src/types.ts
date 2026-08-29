export type View =
  | 'dashboard'
  | 'citas'
  | 'recepcion'
  | 'clientas'
  | 'inventario'
  | 'usuarios'
  | 'caja'
  | 'historial'
  | 'proveedores';

export type Category = 'Medico' | 'Estetico';

export type AppointmentStatus =
  | 'Confirmada'
  | 'Pendiente'
  | 'Cancelada'
  | 'Completada';

export type PaymentMethod = 'Efectivo' | 'Tarjeta' | 'Transferencia';

export type Role = 'Administrador' | 'Doctora' | 'Vendedora';

export interface Product {
  id: string;
  name: string;
  category: Category;
  price: number;
  cost: number;
  stock: number;
  minStock: number;
  commissionPct: number;
  commissionPctDoctor: number;
}

export interface Client {
  id: string;
  name: string;
  dni: string;
  phone: string;
  email: string;
  origin: string;
  visits: number;
  balance: number;
  lastVisit: string;
}

export interface ClientHistoryEntry {
  date: string;
  product: string;
  amount: number;
}

export interface TeamMember {
  id: string;
  name: string;
  role: Role;
  email: string;
  joined: string;
  commission: number;
}

export interface LineItem {
  productId: string;
  qty: number;
}

export interface Appointment {
  id: string;
  date: string;
  time: string;
  clientName: string;
  items: LineItem[];
  total: number;
  deposit: number;
  status: AppointmentStatus;
  responsible: string;
  doctor: string;
  paymentMethods: PaymentMethod[];
  paidToday: number;
}

export interface User {
  id: string;
  name: string;
  username: string;
  password: string;
  role: Role;
  joined: string;
}

export interface CajaEntry {
  date: string;
  efectivo: number;
  tarjeta: number;
  transferencia: number;
  senias: number;
  deudas: number;
}

export interface Supplier {
  id: string;
  name: string;
  concept: string;
  amount: number;
  purchaseDate: string;
  dueDate: string;
  status: 'Pendiente' | 'Pagado';
  paidDate?: string;
}

export interface LoginCredential {
  username: string;
  password: string;
  name: string;
  role: Role;
}
