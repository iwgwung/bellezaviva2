import type {
  Appointment,
  CajaEntry,
  Client,
  ClientHistoryEntry,
  LoginCredential,
  Product,
  Role,
  Supplier,
  TeamMember,
  User,
} from './types';

export const products: Product[] = [
  { id: 'p1', name: 'Bótox Frontal', category: 'Medico', price: 45000, cost: 22000, stock: 12, minStock: 5, commissionPct: 10, commissionPctDoctor: 8 },
  { id: 'p2', name: 'Ácido Hialurónico Labios', category: 'Medico', price: 68000, cost: 38000, stock: 3, minStock: 6, commissionPct: 12, commissionPctDoctor: 10 },
  { id: 'p3', name: 'Limpieza Facial Profunda', category: 'Estetico', price: 18000, cost: 6000, stock: 0, minStock: 4, commissionPct: 15, commissionPctDoctor: 0 },
  { id: 'p4', name: 'Peeling Químico', category: 'Medico', price: 32000, cost: 14000, stock: 8, minStock: 5, commissionPct: 10, commissionPctDoctor: 7 },
  { id: 'p5', name: 'Mascarilla Hidratante', category: 'Estetico', price: 9500, cost: 2800, stock: 24, minStock: 10, commissionPct: 18, commissionPctDoctor: 0 },
  { id: 'p6', name: 'Drenaje Linfático', category: 'Estetico', price: 15000, cost: 4000, stock: 2, minStock: 5, commissionPct: 20, commissionPctDoctor: 0 },
  { id: 'p7', name: 'Relleno Nasogeniano', category: 'Medico', price: 72000, cost: 41000, stock: 6, minStock: 4, commissionPct: 11, commissionPctDoctor: 9 },
  { id: 'p8', name: 'Radiofrecuencia Facial', category: 'Estetico', price: 28000, cost: 9000, stock: 14, minStock: 6, commissionPct: 16, commissionPctDoctor: 0 },
];

export const clients: Client[] = [
  { id: 'c1', name: 'María González', dni: '30.123.456', phone: '11-5555-1234', email: 'maria.g@email.com', origin: 'Instagram', visits: 8, balance: 0, lastVisit: '2026-08-20' },
  { id: 'c2', name: 'Lucía Fernández', dni: '27.876.543', phone: '11-6666-7890', email: 'lucia.f@email.com', origin: 'Recomendación', visits: 12, balance: -15000, lastVisit: '2026-08-25' },
  { id: 'c3', name: 'Sofía Romero', dni: '35.234.567', phone: '11-7777-3456', email: 'sofia.r@email.com', origin: 'TikTok', visits: 3, balance: 0, lastVisit: '2026-08-10' },
  { id: 'c4', name: 'Carla Pereyra', dni: '24.987.654', phone: '11-8888-9012', email: 'carla.p@email.com', origin: 'Facebook', visits: 15, balance: -32000, lastVisit: '2026-08-27' },
  { id: 'c5', name: 'Daniela Suárez', dni: '31.456.789', phone: '11-9999-4567', email: 'daniela.s@email.com', origin: 'Recomendación', visits: 6, balance: 0, lastVisit: '2026-08-22' },
  { id: 'c6', name: 'Valentina López', dni: '29.345.678', phone: '11-2222-6789', email: 'valen.l@email.com', origin: 'Instagram', visits: 9, balance: 5000, lastVisit: '2026-08-18' },
];

export const clientHistory: Record<string, ClientHistoryEntry[]> = {
  c1: [
    { date: '2026-08-20', product: 'Bótox Frontal', amount: 45000 },
    { date: '2026-07-15', product: 'Limpieza Facial Profunda', amount: 18000 },
    { date: '2026-06-02', product: 'Peeling Químico', amount: 32000 },
  ],
  c2: [
    { date: '2026-08-25', product: 'Ácido Hialurónico Labios', amount: 68000 },
    { date: '2026-07-01', product: 'Bótox Frontal', amount: 45000 },
    { date: '2026-05-10', product: 'Mascarilla Hidratante', amount: 9500 },
  ],
  c3: [
    { date: '2026-08-10', product: 'Limpieza Facial Profunda', amount: 18000 },
  ],
  c4: [
    { date: '2026-08-27', product: 'Relleno Nasogeniano', amount: 72000 },
    { date: '2026-08-01', product: 'Bótox Frontal', amount: 45000 },
    { date: '2026-07-20', product: 'Radiofrecuencia Facial', amount: 28000 },
    { date: '2026-06-15', product: 'Ácido Hialurónico Labios', amount: 68000 },
  ],
  c5: [
    { date: '2026-08-22', product: 'Radiofrecuencia Facial', amount: 28000 },
    { date: '2026-07-18', product: 'Drenaje Linfático', amount: 15000 },
  ],
  c6: [
    { date: '2026-08-18', product: 'Peeling Químico', amount: 32000 },
    { date: '2026-07-05', product: 'Mascarilla Hidratante', amount: 9500 },
    { date: '2026-06-01', product: 'Bótox Frontal', amount: 45000 },
  ],
};

export const team: TeamMember[] = [
  { id: 't1', name: 'Dra. Patricia Ríos', role: 'Doctora', email: 'patricia@bellezaviva.com', joined: '2024-03-12', commission: 185000 },
  { id: 't2', name: 'Dra. Laura Méndez', role: 'Doctora', email: 'laura@bellezaviva.com', joined: '2025-01-08', commission: 142000 },
  { id: 't3', name: 'Ana Torres', role: 'Vendedora', email: 'ana@bellezaviva.com', joined: '2024-11-20', commission: 68000 },
  { id: 't4', name: 'Julia Castro', role: 'Vendedora', email: 'julia@bellezaviva.com', joined: '2025-06-03', commission: 41000 },
];

export const appointments: Appointment[] = [
  { id: 'a1', date: '2026-08-28', time: '09:00', clientName: 'María González', items: [{ productId: 'p1', qty: 1 }], total: 45000, deposit: 20000, status: 'Confirmada', responsible: 'Ana Torres', doctor: 'Dra. Patricia Ríos', paymentMethods: ['Efectivo'], paidToday: 20000 },
  { id: 'a2', date: '2026-08-28', time: '10:30', clientName: 'Lucía Fernández', items: [{ productId: 'p2', qty: 1 }], total: 68000, deposit: 30000, status: 'Confirmada', responsible: 'Ana Torres', doctor: 'Dra. Laura Méndez', paymentMethods: ['Tarjeta'], paidToday: 30000 },
  { id: 'a3', date: '2026-08-28', time: '12:00', clientName: 'Sofía Romero', items: [{ productId: 'p3', qty: 1 }], total: 18000, deposit: 0, status: 'Confirmada', responsible: 'Julia Castro', doctor: 'Dra. Patricia Ríos', paymentMethods: ['Efectivo'], paidToday: 0 },
  { id: 'a4', date: '2026-08-28', time: '14:00', clientName: 'Carla Pereyra', items: [{ productId: 'p7', qty: 1 }], total: 72000, deposit: 35000, status: 'Pendiente', responsible: 'Ana Torres', doctor: 'Dra. Laura Méndez', paymentMethods: ['Transferencia'], paidToday: 35000 },
  { id: 'a5', date: '2026-08-28', time: '16:00', clientName: 'Daniela Suárez', items: [{ productId: 'p8', qty: 2 }], total: 56000, deposit: 10000, status: 'Confirmada', responsible: 'Julia Castro', doctor: 'Dra. Patricia Ríos', paymentMethods: ['Efectivo', 'Tarjeta'], paidToday: 10000 },
  { id: 'a6', date: '2026-08-27', time: '10:00', clientName: 'Carla Pereyra', items: [{ productId: 'p7', qty: 1 }], total: 72000, deposit: 72000, status: 'Completada', responsible: 'Ana Torres', doctor: 'Dra. Laura Méndez', paymentMethods: ['Transferencia'], paidToday: 72000 },
  { id: 'a7', date: '2026-08-27', time: '11:30', clientName: 'María González', items: [{ productId: 'p1', qty: 1 }, { productId: 'p5', qty: 1 }], total: 54500, deposit: 54500, status: 'Completada', responsible: 'Julia Castro', doctor: 'Dra. Patricia Ríos', paymentMethods: ['Efectivo'], paidToday: 54500 },
  { id: 'a8', date: '2026-08-25', time: '09:30', clientName: 'Lucía Fernández', items: [{ productId: 'p2', qty: 1 }], total: 68000, deposit: 68000, status: 'Completada', responsible: 'Ana Torres', doctor: 'Dra. Laura Méndez', paymentMethods: ['Tarjeta'], paidToday: 68000 },
  { id: 'a9', date: '2026-08-25', time: '15:00', clientName: 'Valentina López', items: [{ productId: 'p4', qty: 1 }], total: 32000, deposit: 32000, status: 'Completada', responsible: 'Julia Castro', doctor: 'Dra. Patricia Ríos', paymentMethods: ['Efectivo'], paidToday: 32000 },
  { id: 'a10', date: '2026-08-22', time: '14:00', clientName: 'Daniela Suárez', items: [{ productId: 'p8', qty: 1 }], total: 28000, deposit: 28000, status: 'Completada', responsible: 'Ana Torres', doctor: 'Dra. Patricia Ríos', paymentMethods: ['Transferencia'], paidToday: 28000 },
  { id: 'a11', date: '2026-08-20', time: '10:00', clientName: 'María González', items: [{ productId: 'p1', qty: 1 }], total: 45000, deposit: 45000, status: 'Completada', responsible: 'Julia Castro', doctor: 'Dra. Patricia Ríos', paymentMethods: ['Efectivo'], paidToday: 45000 },
  { id: 'a12', date: '2026-08-10', time: '11:00', clientName: 'Sofía Romero', items: [{ productId: 'p3', qty: 1 }], total: 18000, deposit: 18000, status: 'Completada', responsible: 'Ana Torres', doctor: 'Dra. Patricia Ríos', paymentMethods: ['Efectivo'], paidToday: 18000 },
  { id: 'a13', date: '2026-08-29', time: '09:00', clientName: 'Sofía Romero', items: [{ productId: 'p4', qty: 1 }], total: 32000, deposit: 0, status: 'Pendiente', responsible: 'Ana Torres', doctor: 'Dra. Laura Méndez', paymentMethods: ['Efectivo'], paidToday: 0 },
];

export const users: User[] = [
  { id: 'u1', name: 'Administrador', username: 'admin', password: 'admin123', role: 'Administrador', joined: '2024-01-15' },
  { id: 'u2', name: 'Dra. Patricia Ríos', username: 'patricia_doc', password: 'doc123', role: 'Doctora', joined: '2024-03-12' },
  { id: 'u3', name: 'Dra. Laura Méndez', username: 'laura_doc', password: 'doc123', role: 'Doctora', joined: '2025-01-08' },
  { id: 'u4', name: 'Ana Torres', username: 'vendedora', password: 'vend123', role: 'Vendedora', joined: '2024-11-20' },
  { id: 'u5', name: 'Julia Castro', username: 'julia_vend', password: 'vend123', role: 'Vendedora', joined: '2025-06-03' },
];

export const loginUsers: { name: string; role: Role }[] = [
  { name: 'quiet', role: 'Administrador' },
  { name: 'Ana Torres', role: 'Vendedora' },
  { name: 'Dra. Patricia Ríos', role: 'Doctora' },
];

export const loginCredentials: LoginCredential[] = [];

export const cajaData: CajaEntry[] = [
  { date: '2026-08-28', efectivo: 30000, tarjeta: 30000, transferencia: 35000, senias: 95000, deudas: 15000 },
  { date: '2026-08-27', efectivo: 45000, tarjeta: 68000, transferencia: 0, senias: 113000, deudas: 32000 },
  { date: '2026-08-26', efectivo: 18000, tarjeta: 0, transferencia: 28000, senias: 46000, deudas: 0 },
  { date: '2026-08-25', efectivo: 22000, tarjeta: 45000, transferencia: 15000, senias: 82000, deudas: 5000 },
  { date: '2026-08-20', efectivo: 45000, tarjeta: 0, transferencia: 32000, senias: 77000, deudas: 0 },
  { date: '2026-07-28', efectivo: 120000, tarjeta: 95000, transferencia: 60000, senias: 275000, deudas: 47000 },
  { date: '2026-07-15', efectivo: 85000, tarjeta: 110000, transferencia: 40000, senias: 235000, deudas: 22000 },
  { date: '2026-06-30', efectivo: 95000, tarjeta: 78000, transferencia: 55000, senias: 228000, deudas: 18000 },
  { date: '2026-06-15', efectivo: 70000, tarjeta: 88000, transferencia: 30000, senias: 188000, deudas: 12000 },
];

export const kpis = {
  appointmentsToday: 5,
  activeClients: 6,
  productsCount: 8,
  netProfit: 412000,
  totalRevenue: 980000,
  cogs: 386000,
  commissions: 182000,
};

export const suppliers: Supplier[] = [
  { id: 's1', name: 'Dermofarm S.A.', concept: 'Bótox y Ácido Hialurónico (5 unidades)', amount: 180000, purchaseDate: '2026-08-20', dueDate: '2026-09-05', status: 'Pendiente' },
  { id: 's2', name: 'Estética Premium', concept: 'Mascarillas y Peeling (lote mensual)', amount: 45000, purchaseDate: '2026-08-15', dueDate: '2026-08-30', status: 'Pagado', paidDate: '2026-08-15' },
  { id: 's3', name: 'MedSupply Corp', concept: 'Radiofrecuencia repuestos', amount: 72000, purchaseDate: '2026-08-10', dueDate: '2026-08-25', status: 'Pagado', paidDate: '2026-08-10' },
  { id: 's4', name: 'Belleza Pro Distribuidora', concept: 'Drenaje Linfático insumos', amount: 28000, purchaseDate: '2026-08-26', dueDate: '2026-09-10', status: 'Pendiente' },
];
