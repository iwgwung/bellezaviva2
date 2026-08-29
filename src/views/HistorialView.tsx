import { useState } from 'react';
import { Search, Calendar, X } from 'lucide-react';
import { formatCurrency } from '../components/Badges';
import type { Appointment, Product } from '../types';

interface HistorialViewProps {
  appointments: Appointment[];
  products: Product[];
}

export default function HistorialView({ appointments, products }: HistorialViewProps) {
  const today = '2026-08-28';
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [query, setQuery] = useState('');

  const completed = appointments.filter((a) => a.status === 'Completada');

  const filtered = completed.filter((a) => {
    if (fromDate && a.date < fromDate) return false;
    if (toDate && a.date > toDate) return false;
    if (query && !a.clientName.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  const sorted = [...filtered].sort((a, b) => (b.date + b.time).localeCompare(a.date + a.time));

  const totalAmount = sorted.reduce((s, a) => s + a.paidToday, 0);

  const inputCls =
    'w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-700 focus:border-[#D96B52] focus:outline-none focus:ring-1 focus:ring-[#D96B52]';

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-zinc-900">Historial de Asistencia</h2>
        <p className="mt-1 text-sm text-zinc-500">
          Consulta las clientas atendidas por fecha, tratamientos y montos.
        </p>
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-4 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label className="mb-1 block text-xs font-medium text-zinc-600">Desde</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className={inputCls}
          />
        </div>
        <div className="flex-1">
          <label className="mb-1 block text-xs font-medium text-zinc-600">Hasta</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className={inputCls}
          />
        </div>
        <div className="flex-1">
          <label className="mb-1 block text-xs font-medium text-zinc-600">Buscar clienta</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Nombre..."
              className="w-full rounded-lg border border-zinc-200 bg-white py-2 pl-9 pr-3 text-sm text-zinc-700 placeholder-zinc-400 focus:border-[#D96B52] focus:outline-none focus:ring-1 focus:ring-[#D96B52]"
            />
          </div>
        </div>
        <button
          onClick={() => {
            setFromDate('');
            setToDate('');
            setQuery('');
          }}
          className="rounded-lg border border-zinc-200 px-3 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-50"
        >
          Limpiar
        </button>
      </div>

      <div className="flex items-center gap-4 rounded-xl border border-zinc-200 bg-white p-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#D96B52]/10">
          <Calendar className="h-5 w-5 text-[#D96B52]" />
        </div>
        <div>
          <p className="text-sm text-zinc-500">Resultados</p>
          <p className="text-lg font-semibold text-zinc-900">
            {sorted.length} atenciones · {formatCurrency(totalAmount)} recaudado
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-zinc-50 text-left text-xs text-zinc-500">
            <tr>
              {['Fecha', 'Hora', 'Clienta', 'Tratamientos', 'Profesional', 'Responsable', 'Monto'].map((h) => (
                <th key={h} className="px-4 py-3 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {sorted.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-zinc-400">
                  No hay atenciones registradas en el rango seleccionado.
                </td>
              </tr>
            ) : (
              sorted.map((a) => {
                const productNames = a.items
                  .map((it) => `${it.qty}x ${products.find((p) => p.id === it.productId)?.name ?? ''}`)
                  .join(', ');
                return (
                  <tr key={a.id} className="hover:bg-zinc-50">
                    <td className="px-4 py-3 text-zinc-600">{a.date}</td>
                    <td className="px-4 py-3 text-zinc-600">{a.time}</td>
                    <td className="px-4 py-3 font-medium text-zinc-900">{a.clientName}</td>
                    <td className="px-4 py-3 text-zinc-600">{productNames}</td>
                    <td className="px-4 py-3 text-zinc-600">{a.doctor}</td>
                    <td className="px-4 py-3 text-zinc-600">{a.responsible}</td>
                    <td className="px-4 py-3 font-medium text-zinc-900">{formatCurrency(a.paidToday)}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
