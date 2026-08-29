import {
  CalendarDays,
  LayoutDashboard,
  ClipboardList,
  Users,
  Package,
  UserCog,
  Sparkles,
  Wallet,
  LogOut,
  History,
  Truck,
} from 'lucide-react';
import type { Role, View } from '../types';

interface SidebarProps {
  view: View;
  setView: (v: View) => void;
  role: Role;
  userName: string;
  onLogout: () => void;
}

const allNavItems: { id: View; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'citas', label: 'Citas y Ventas', icon: CalendarDays },
  { id: 'recepcion', label: 'Recepción', icon: ClipboardList },
  { id: 'clientas', label: 'Clientas', icon: Users },
  { id: 'historial', label: 'Historial', icon: History },
  { id: 'inventario', label: 'Inventario', icon: Package },
  { id: 'caja', label: 'Caja', icon: Wallet },
  { id: 'proveedores', label: 'Proveedores', icon: Truck },
  { id: 'usuarios', label: 'Usuarios', icon: UserCog },
];

const roleAccess: Record<Role, View[]> = {
  Administrador: ['dashboard', 'citas', 'recepcion', 'clientas', 'historial', 'inventario', 'caja', 'proveedores', 'usuarios'],
  Vendedora: ['dashboard', 'citas', 'recepcion', 'clientas', 'historial'],
  Doctora: ['citas', 'recepcion', 'historial'],
};

export default function Sidebar({ view, setView, role, userName, onLogout }: SidebarProps) {
  const navItems = allNavItems.filter((item) => roleAccess[role].includes(item.id));

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col bg-[#18181B] text-zinc-300 md:flex">
      <div className="flex items-center gap-2.5 px-6 py-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#D96B52]">
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-base font-semibold tracking-tight text-white">Belleza Viva</h1>
          <p className="text-[11px] text-zinc-500">Gestión de centro</p>
        </div>
      </div>

      <nav className="mt-2 flex-1 space-y-1 overflow-y-auto px-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = view === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? 'bg-[#D96B52] text-white'
                  : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100'
              }`}
            >
              <Icon className="h-4.5 w-4.5" />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="border-t border-zinc-800 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-700 text-sm font-semibold text-white">
            {userName.charAt(0)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-white">{userName}</p>
            <p className="truncate text-[11px] text-zinc-500">{role}</p>
          </div>
          <button onClick={onLogout} className="text-zinc-500 hover:text-zinc-200" title="Cerrar sesión">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
