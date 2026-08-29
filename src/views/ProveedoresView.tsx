import { useState } from 'react';
import { Plus, X, Truck, CheckCircle2, Clock, Wallet } from 'lucide-react';
import { formatCurrency } from '../components/Badges';
import type { Supplier } from '../types';

interface ProveedoresViewProps {
  suppliers: Supplier[];
  setSuppliers: React.Dispatch<React.SetStateAction<Supplier[]>>;
}

export default function ProveedoresView({ suppliers, setSuppliers }: ProveedoresViewProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [showPaid, setShowPaid] = useState(false);

  const pendientes = suppliers.filter((s) => s.status === 'Pendiente');
  const pagados = suppliers.filter((s) => s.status === 'Pagado');

  const totalPendiente = pendientes.reduce((sum, s) => sum + s.amount, 0);
  const totalPagado = pagados.reduce((sum, s) => sum + s.amount, 0);

  const handlePay = (id: string) => {
    const today = '2026-08-29';
    setSuppliers((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, status: 'Pagado' as const, paidDate: today } : s
      )
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-zinc-900">Proveedores</h2>
          <p className="mt-1 text-sm text-zinc-500">
            Registro de compras a proveedores y estado de pagos.
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-[#D96B52] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#C85A32]"
        >
          <Plus className="h-4 w-4" />
          Nueva Compra
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-zinc-200 bg-white p-4">
          <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
            <Truck className="h-4.5 w-4.5" />
          </div>
          <p className="text-xs font-medium text-zinc-500">Total compras</p>
          <p className="mt-0.5 text-lg font-semibold text-zinc-900">
            {formatCurrency(totalPendiente + totalPagado)}
          </p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-4">
          <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
            <Clock className="h-4.5 w-4.5" />
          </div>
          <p className="text-xs font-medium text-zinc-500">Pendiente de pago</p>
          <p className="mt-0.5 text-lg font-semibold text-amber-600">
            {formatCurrency(totalPendiente)}
          </p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-4">
          <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
            <CheckCircle2 className="h-4.5 w-4.5" />
          </div>
          <p className="text-xs font-medium text-zinc-500">Pagado</p>
          <p className="mt-0.5 text-lg font-semibold text-emerald-600">
            {formatCurrency(totalPagado)}
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
        <div className="flex items-center justify-between bg-zinc-50 px-4 py-3">
          <h3 className="text-sm font-semibold text-zinc-700">Compras Pendientes</h3>
          <span className="text-xs text-zinc-500">{pendientes.length} registros</span>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-zinc-50 text-left text-xs text-zinc-500">
            <tr>
              {['Proveedor', 'Concepto', 'Monto', 'Fecha Compra', 'Fecha Límite', 'Acción'].map((h) => (
                <th key={h} className="px-4 py-3 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {pendientes.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-zinc-400">
                  No hay compras pendientes. Todas las compras han sido pagadas.
                </td>
              </tr>
            ) : (
              pendientes.map((s) => (
                <tr key={s.id} className="hover:bg-zinc-50">
                  <td className="px-4 py-3 font-medium text-zinc-900">{s.name}</td>
                  <td className="px-4 py-3 text-zinc-600">{s.concept}</td>
                  <td className="px-4 py-3 font-medium text-zinc-900">{formatCurrency(s.amount)}</td>
                  <td className="px-4 py-3 text-zinc-600">{s.purchaseDate}</td>
                  <td className="px-4 py-3 text-zinc-600">{s.dueDate}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handlePay(s.id)}
                      className="inline-flex items-center gap-1 rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-emerald-600"
                    >
                      <Wallet className="h-3.5 w-3.5" />
                      Pagar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
        <button
          onClick={() => setShowPaid((v) => !v)}
          className="flex w-full items-center justify-between bg-zinc-50 px-4 py-3 text-left"
        >
          <h3 className="flex items-center gap-2 text-sm font-semibold text-zinc-700">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            Proveedores Pagados
          </h3>
          <span className="text-xs text-zinc-500">
            {pagados.length} registros {showPaid ? '▲' : '▼'}
          </span>
        </button>
        {showPaid && (
          <table className="w-full text-sm">
            <thead className="bg-zinc-50 text-left text-xs text-zinc-500">
              <tr>
                {['Proveedor', 'Concepto', 'Monto', 'Fecha Compra', 'Fecha Pago'].map((h) => (
                  <th key={h} className="px-4 py-3 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {pagados.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-zinc-400">
                    No hay proveedores pagados.
                  </td>
                </tr>
              ) : (
                pagados.map((s) => (
                  <tr key={s.id} className="hover:bg-zinc-50">
                    <td className="px-4 py-3 font-medium text-zinc-900">{s.name}</td>
                    <td className="px-4 py-3 text-zinc-600">{s.concept}</td>
                    <td className="px-4 py-3 font-medium text-emerald-600">{formatCurrency(s.amount)}</td>
                    <td className="px-4 py-3 text-zinc-600">{s.purchaseDate}</td>
                    <td className="px-4 py-3 text-zinc-600">{s.paidDate ?? '—'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {modalOpen && (
        <NewSupplierModal
          onClose={() => setModalOpen(false)}
          onSave={(s) => {
            setSuppliers((prev) => [s, ...prev]);
            setModalOpen(false);
          }}
        />
      )}
    </div>
  );
}

function NewSupplierModal({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave: (s: Supplier) => void;
}) {
  const [name, setName] = useState('');
  const [concept, setConcept] = useState('');
  const [amount, setAmount] = useState('');
  const [purchaseDate, setPurchaseDate] = useState('2026-08-29');
  const [dueDate, setDueDate] = useState('2026-09-10');
  const [status, setStatus] = useState<'Pendiente' | 'Pagado'>('Pendiente');

  const inputCls =
    'w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-700 focus:border-[#D96B52] focus:outline-none focus:ring-1 focus:ring-[#D96B52]';

  const handleSave = () => {
    onSave({
      id: 's' + Date.now(),
      name: name || 'Proveedor',
      concept: concept || 'Sin especificar',
      amount: Number(amount) || 0,
      purchaseDate,
      dueDate,
      status,
      paidDate: status === 'Pagado' ? purchaseDate : undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-zinc-900">Nueva Compra a Proveedor</h3>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-5 space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-600">Nombre del Proveedor</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Dermofarm S.A." className={inputCls} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-600">Concepto / Productos</label>
            <input value={concept} onChange={(e) => setConcept(e.target.value)} placeholder="Bótox y Ácido Hialurónico" className={inputCls} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-600">Monto Total</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-zinc-400">$</span>
              <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0" className="w-full rounded-lg border border-zinc-200 bg-white py-2 pl-7 pr-3 text-sm text-zinc-700 focus:border-[#D96B52] focus:outline-none focus:ring-1 focus:ring-[#D96B52]" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-600">Fecha de Compra</label>
              <input type="date" value={purchaseDate} onChange={(e) => setPurchaseDate(e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-600">Fecha Límite de Pago</label>
              <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className={inputCls} />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-600">Estado de Pago</label>
            <select value={status} onChange={(e) => setStatus(e.target.value as 'Pendiente' | 'Pagado')} className={inputCls}>
              <option value="Pendiente">Pendiente</option>
              <option value="Pagado">Pagado</option>
            </select>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-50">
            Cancelar
          </button>
          <button onClick={handleSave} className="rounded-lg bg-[#D96B52] px-4 py-2 text-sm font-medium text-white hover:bg-[#C85A32]">
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
