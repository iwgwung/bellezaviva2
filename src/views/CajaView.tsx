import { useState } from 'react';
import { Wallet, TrendingUp, TrendingDown, Banknote, CreditCard, ArrowLeftRight, Truck } from 'lucide-react';
import { cajaData } from '../data';
import { formatCurrency } from '../components/Badges';
import type { Supplier } from '../types';

type Period = 'diaria' | 'mensual' | 'anual';

interface CajaViewProps {
  suppliers: Supplier[];
}

export default function CajaView({ suppliers }: CajaViewProps) {
  const [period, setPeriod] = useState<Period>('diaria');

  const today = '2026-08-29';

  let entries = cajaData;
  let periodLabel = '';
  let periodStart = '';
  let periodEnd = '';

  if (period === 'diaria') {
    entries = cajaData.filter((e) => e.date === '2026-08-28');
    periodLabel = 'Caja Diaria — 28 de agosto, 2026';
    periodStart = '2026-08-28';
    periodEnd = '2026-08-28';
  } else if (period === 'mensual') {
    entries = cajaData.filter((e) => e.date.startsWith('2026-08'));
    periodLabel = 'Caja Mensual — Agosto 2026';
    periodStart = '2026-08-01';
    periodEnd = '2026-08-31';
  } else {
    entries = cajaData;
    periodLabel = 'Caja Anual — 2026';
    periodStart = '2026-01-01';
    periodEnd = '2026-12-31';
  }

  const totalEfectivo = entries.reduce((s, e) => s + e.efectivo, 0);
  const totalTarjeta = entries.reduce((s, e) => s + e.tarjeta, 0);
  const totalTransferencia = entries.reduce((s, e) => s + e.transferencia, 0);
  const totalSenias = entries.reduce((s, e) => s + e.senias, 0);
  const totalDeudas = entries.reduce((s, e) => s + e.deudas, 0);

  const paidSuppliers = suppliers.filter(
    (s) => s.status === 'Pagado' && s.paidDate && s.paidDate >= periodStart && s.paidDate <= periodEnd
  );
  const supplierPayments = paidSuppliers.reduce((sum, s) => sum + s.amount, 0);

  const grossBalance = totalEfectivo + totalTarjeta + totalTransferencia - totalDeudas;
  const balance = grossBalance - supplierPayments;

  const cards = [
    { label: 'Efectivo', value: totalEfectivo, icon: Banknote, tint: 'text-emerald-600 bg-emerald-100' },
    { label: 'Tarjeta', value: totalTarjeta, icon: CreditCard, tint: 'text-blue-600 bg-blue-100' },
    { label: 'Transferencia', value: totalTransferencia, icon: ArrowLeftRight, tint: 'text-purple-600 bg-purple-100' },
    { label: 'Señas cobradas', value: totalSenias, icon: Wallet, tint: 'text-[#D96B52] bg-[#D96B52]/10' },
    { label: 'Deudas generadas', value: totalDeudas, icon: TrendingDown, tint: 'text-red-600 bg-red-100' },
    { label: 'Pagos a proveedores', value: supplierPayments, icon: Truck, tint: 'text-amber-600 bg-amber-100' },
    { label: 'Balance final', value: balance, icon: TrendingUp, tint: balance >= 0 ? 'text-emerald-600 bg-emerald-100' : 'text-red-600 bg-red-100' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-zinc-900">Caja</h2>
          <p className="mt-1 text-sm text-zinc-500">{periodLabel}</p>
        </div>
        <div className="flex gap-2">
          {(['diaria', 'mensual', 'anual'] as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                period === p
                  ? 'bg-[#D96B52] text-white'
                  : 'border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50'
              }`}
            >
              {p === 'diaria' ? 'Caja Diaria' : p === 'mensual' ? 'Caja Mensual' : 'Caja Anual'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <div key={c.label} className="rounded-xl border border-zinc-200 bg-white p-4">
              <div className={`mb-3 flex h-9 w-9 items-center justify-center rounded-lg ${c.tint}`}>
                <Icon className="h-4.5 w-4.5" />
              </div>
              <p className="text-xs font-medium text-zinc-500">{c.label}</p>
              <p className="mt-0.5 text-lg font-semibold text-zinc-900">{formatCurrency(c.value)}</p>
            </div>
          );
        })}
      </div>

      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-zinc-50 text-left text-xs text-zinc-500">
            <tr>
              {['Fecha', 'Efectivo', 'Tarjeta', 'Transferencia', 'Señas', 'Deudas', 'Balance'].map((h) => (
                <th key={h} className="px-4 py-3 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {entries.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-zinc-400">
                  No hay movimientos para este período.
                </td>
              </tr>
            ) : (
              entries.map((e) => {
                const rowBalance = e.efectivo + e.tarjeta + e.transferencia - e.deudas;
                return (
                  <tr key={e.date} className="hover:bg-zinc-50">
                    <td className="px-4 py-3 font-medium text-zinc-900">{e.date}</td>
                    <td className="px-4 py-3 text-zinc-600">{formatCurrency(e.efectivo)}</td>
                    <td className="px-4 py-3 text-zinc-600">{formatCurrency(e.tarjeta)}</td>
                    <td className="px-4 py-3 text-zinc-600">{formatCurrency(e.transferencia)}</td>
                    <td className="px-4 py-3 text-zinc-600">{formatCurrency(e.senias)}</td>
                    <td className="px-4 py-3 text-red-600">{formatCurrency(e.deudas)}</td>
                    <td className={`px-4 py-3 font-medium ${rowBalance >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                      {formatCurrency(rowBalance)}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="overflow-hidden rounded-xl border border-amber-200 bg-white">
        <div className="flex items-center justify-between bg-amber-50 px-4 py-3">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-amber-800">
            <Truck className="h-4 w-4" />
            Egresos por Proveedores Pagados
          </h3>
          <span className="text-xs font-medium text-amber-700">
            Total: {formatCurrency(supplierPayments)}
          </span>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-amber-50/50 text-left text-xs text-amber-700">
            <tr>
              {['Proveedor', 'Concepto', 'Monto', 'Fecha de Pago'].map((h) => (
                <th key={h} className="px-4 py-3 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-amber-100">
            {paidSuppliers.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-zinc-400">
                  No hay pagos a proveedores en este período.
                </td>
              </tr>
            ) : (
              paidSuppliers.map((s) => (
                <tr key={s.id} className="hover:bg-amber-50/30">
                  <td className="px-4 py-3 font-medium text-zinc-900">{s.name}</td>
                  <td className="px-4 py-3 text-zinc-600">{s.concept}</td>
                  <td className="px-4 py-3 font-medium text-amber-700">−{formatCurrency(s.amount)}</td>
                  <td className="px-4 py-3 text-zinc-600">{s.paidDate}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
