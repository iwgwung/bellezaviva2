import {
  CalendarDays,
  Users,
  Package,
  TrendingUp,
  DollarSign,
  Receipt,
  Percent,
} from 'lucide-react';
import { kpis, team } from '../data';
import {
  CategoryBadge,
  LowStockBadge,
  formatCurrency,
} from '../components/Badges';
import type { Appointment, Product, Role } from '../types';

interface DashboardViewProps {
  appointments: Appointment[];
  products: Product[];
  role: Role;
  userName: string;
}

export default function DashboardView({ appointments, products, role, userName }: DashboardViewProps) {
  const lowStock = products.filter((p) => p.stock <= p.minStock);
  const todays = appointments.filter((a) => a.date === '2026-08-28');

  const isAdmin = role === 'Administrador';
  const isVendedora = role === 'Vendedora';

  let kpiCards: { label: string; value: string | number; icon: typeof CalendarDays; tint: string }[] = [];

  if (isAdmin) {
    kpiCards = [
      { label: 'Citas hoy', value: kpis.appointmentsToday, icon: CalendarDays, tint: 'text-[#D96B52] bg-[#D96B52]/10' },
      { label: 'Clientas activas', value: kpis.activeClients, icon: Users, tint: 'text-blue-600 bg-blue-100' },
      { label: 'Productos', value: kpis.productsCount, icon: Package, tint: 'text-zinc-600 bg-zinc-100' },
      { label: 'Ganancia neta', value: formatCurrency(kpis.netProfit), icon: TrendingUp, tint: 'text-emerald-600 bg-emerald-100' },
      { label: 'Ingresos totales', value: formatCurrency(kpis.totalRevenue), icon: DollarSign, tint: 'text-emerald-600 bg-emerald-100' },
      { label: 'COGS', value: formatCurrency(kpis.cogs), icon: Receipt, tint: 'text-amber-600 bg-amber-100' },
      { label: 'Comisiones', value: formatCurrency(kpis.commissions), icon: Percent, tint: 'text-pink-600 bg-pink-100' },
    ];
  } else if (isVendedora) {
    const myCommission = team.find((t) => t.name === userName)?.commission ?? 0;
    kpiCards = [
      { label: 'Citas hoy', value: kpis.appointmentsToday, icon: CalendarDays, tint: 'text-[#D96B52] bg-[#D96B52]/10' },
      { label: 'Clientas activas', value: kpis.activeClients, icon: Users, tint: 'text-blue-600 bg-blue-100' },
      { label: 'Productos', value: kpis.productsCount, icon: Package, tint: 'text-zinc-600 bg-zinc-100' },
      { label: 'Mi comisión', value: formatCurrency(myCommission), icon: Percent, tint: 'text-pink-600 bg-pink-100' },
    ];
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-[#18181B] p-6 text-white">
        <h2 className="text-xl font-semibold">Bienvenida, {userName}</h2>
        <p className="mt-1 text-sm text-zinc-400">Resumen del día 28 de agosto, 2026.</p>
      </div>

      {kpiCards.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {kpiCards.map((k) => {
            const Icon = k.icon;
            return (
              <div key={k.label} className="rounded-xl border border-zinc-200 bg-white p-4">
                <div className={`mb-3 flex h-9 w-9 items-center justify-center rounded-lg ${k.tint}`}>
                  <Icon className="h-4.5 w-4.5" />
                </div>
                <p className="text-xs font-medium text-zinc-500">{k.label}</p>
                <p className="mt-0.5 text-lg font-semibold text-zinc-900">{k.value}</p>
              </div>
            );
          })}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-zinc-200 bg-white p-5">
          <h3 className="text-sm font-semibold text-zinc-900">Citas de hoy</h3>
          {todays.length === 0 ? (
            <div className="mt-4 flex flex-col items-center justify-center rounded-lg border border-dashed border-zinc-200 py-10 text-center">
              <CalendarDays className="h-8 w-8 text-zinc-300" />
              <p className="mt-2 text-sm text-zinc-400">No hay citas programadas para hoy</p>
            </div>
          ) : (
            <ul className="mt-4 space-y-3">
              {todays.map((a) => (
                <li key={a.id} className="flex items-center justify-between rounded-lg border border-zinc-100 p-3">
                  <div>
                    <p className="text-sm font-medium text-zinc-900">{a.time} · {a.clientName}</p>
                    <p className="text-xs text-zinc-500">
                      {a.items.map((it) => `${it.qty}x ${products.find((p) => p.id === it.productId)?.name ?? ''}`).join(', ')}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <CategoryBadge category={products.find((p) => p.id === a.items[0]?.productId)?.category ?? 'Estetico'} />
                    <span className="text-sm font-medium text-zinc-700">{formatCurrency(a.total)}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {isAdmin && (
          <div className="rounded-xl border border-zinc-200 bg-white p-5">
            <h3 className="text-sm font-semibold text-zinc-900">Alertas de inventario</h3>
            <div className="mt-4 overflow-hidden rounded-lg border border-zinc-100">
              <table className="w-full text-sm">
                <thead className="bg-zinc-50 text-left text-xs text-zinc-500">
                  <tr>
                    <th className="px-4 py-2.5 font-medium">Producto</th>
                    <th className="px-4 py-2.5 font-medium">Stock</th>
                    <th className="px-4 py-2.5 font-medium">Mín.</th>
                    <th className="px-4 py-2.5 font-medium">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {lowStock.map((p) => (
                    <tr key={p.id}>
                      <td className="px-4 py-2.5 font-medium text-zinc-900">{p.name}</td>
                      <td className="px-4 py-2.5 text-zinc-600">{p.stock}</td>
                      <td className="px-4 py-2.5 text-zinc-600">{p.minStock}</td>
                      <td className="px-4 py-2.5"><LowStockBadge /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {isAdmin && (
        <div className="rounded-xl border border-zinc-200 bg-white p-5">
          <h3 className="text-sm font-semibold text-zinc-900">Equipo y Comisiones</h3>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((m) => (
              <div key={m.id} className="rounded-xl border border-zinc-100 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#D96B52]/10 text-sm font-semibold text-[#D96B52]">
                    {m.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-zinc-900">{m.name}</p>
                    <p className="text-xs text-zinc-500">{m.role}</p>
                  </div>
                </div>
                <p className="mt-3 text-xs text-zinc-500">Comisión acumulada</p>
                <p className="text-lg font-semibold text-zinc-900">{formatCurrency(m.commission)}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
