import { useState } from 'react';
import Sidebar from './components/Sidebar';
import DashboardView from './views/DashboardView';
import CitasView from './views/CitasView';
import RecepcionView from './views/RecepcionView';
import ClientasView from './views/ClientasView';
import InventarioView from './views/InventarioView';
import UsuariosView from './views/UsuariosView';
import CajaView from './views/CajaView';
import HistorialView from './views/HistorialView';
import ProveedoresView from './views/ProveedoresView';
import LoginView from './views/LoginView';
import type { Appointment, Client, Product, Role, Supplier, User, View } from './types';
import { appointments as initialAppointments, clients as initialClients, products as initialProducts, users as initialUsers, suppliers as initialSuppliers } from './data';

const roleAccess: Record<Role, View[]> = {
  Administrador: ['dashboard', 'citas', 'recepcion', 'clientas', 'historial', 'inventario', 'caja', 'proveedores', 'usuarios'],
  Vendedora: ['dashboard', 'citas', 'recepcion', 'clientas', 'historial'],
  Doctora: ['citas', 'recepcion', 'historial'],
};

const titles: Record<View, string> = {
  dashboard: 'Dashboard',
  citas: 'Citas y Ventas',
  recepcion: 'Recepción',
  clientas: 'Clientas',
  historial: 'Historial de Asistencia',
  inventario: 'Inventario',
  caja: 'Caja',
  proveedores: 'Proveedores',
  usuarios: 'Usuarios',
};

export default function App() {
  const [role, setRole] = useState<Role | null>(() => {
    const savedRole = localStorage.getItem('userRole');
    return savedRole ? (savedRole as Role) : null;
  });
  const [userName, setUserName] = useState(() => localStorage.getItem('userName') || '');
  const [view, setView] = useState<View>('dashboard');
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [suppliers, setSuppliers] = useState<Supplier[]>(initialSuppliers);

  const handleLogin = (name: string, r: Role) => {
    setUserName(name);
    setRole(r);
    setView(roleAccess[r][0]);
    localStorage.setItem('userRole', r);
    localStorage.setItem('userName', name);
  };

  const handleLogout = () => {
    setRole(null);
    setUserName('');
    setView('dashboard');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
  };

  if (role === null) {
    return <LoginView onLogin={handleLogin} />;
  }

  const allowedViews = roleAccess[role];
  const safeView = allowedViews.includes(view) ? view : allowedViews[0];

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <Sidebar view={safeView} setView={setView} role={role} userName={userName} onLogout={handleLogout} />

      <div className="sticky top-0 z-20 flex items-center justify-between bg-[#18181B] px-4 py-3 md:hidden">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#D96B52] text-xs font-bold text-white">
            BV
          </div>
          <span className="text-sm font-semibold text-white">Belleza Viva</span>
        </div>
        <select
          value={safeView}
          onChange={(e) => setView(e.target.value as View)}
          className="rounded-lg border border-zinc-700 bg-zinc-800 px-2 py-1.5 text-xs text-white"
        >
          {allowedViews.map((v) => (
            <option key={v} value={v}>{titles[v]}</option>
          ))}
        </select>
      </div>

      <main className="p-4 md:ml-64 md:p-8">
        <div className="mx-auto max-w-7xl">
          {safeView === 'dashboard' && (
            <DashboardView appointments={appointments} products={products} role={role} userName={userName} />
          )}
          {safeView === 'citas' && (
            <CitasView appointments={appointments} setAppointments={setAppointments} products={products} role={role} clients={clients} setClients={setClients} />
          )}
          {safeView === 'recepcion' && (
            <RecepcionView appointments={appointments} setAppointments={setAppointments} products={products} role={role} clients={clients} setClients={setClients} />
          )}
          {safeView === 'clientas' && (
            <ClientasView clients={clients} setClients={setClients} role={role} products={products} appointments={appointments} />
          )}
          {safeView === 'historial' && (
            <HistorialView appointments={appointments} products={products} />
          )}
          {safeView === 'inventario' && (
            <InventarioView products={products} setProducts={setProducts} appointments={appointments} />
          )}
          {safeView === 'caja' && <CajaView suppliers={suppliers} />}
          {safeView === 'proveedores' && (
            <ProveedoresView suppliers={suppliers} setSuppliers={setSuppliers} />
          )}
          {safeView === 'usuarios' && (
            <UsuariosView users={users} setUsers={setUsers} />
          )}
        </div>
      </main>
    </div>
  );
}
