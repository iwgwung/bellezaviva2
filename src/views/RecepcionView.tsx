import { useState } from 'react';
import { Pencil, Ban, X, Plus, Minus, Trash2, Search, Wallet, UserPlus } from 'lucide-react';
import { CategoryBadge, StatusBadge, formatCurrency } from '../components/Badges';
import { clientHistory } from '../data';
import type { Appointment, Client, ClientHistoryEntry, LineItem, PaymentMethod, Product, Role } from '../types';

interface RecepcionViewProps {
  appointments: Appointment[];
  setAppointments: React.Dispatch<React.SetStateAction<Appointment[]>>;
  products: Product[];
  role: Role;
  clients: Client[];
  setClients: React.Dispatch<React.SetStateAction<Client[]>>;
}

export default function RecepcionView({ appointments, setAppointments, products, role, clients, setClients }: RecepcionViewProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const readOnly = role === 'Doctora';
  const today = '2026-08-28';
  const confirmed = appointments.filter(
    (a) => (a.status === 'Confirmada' || a.status === 'Pendiente') && a.date >= today
  );

  const handleCancel = (id: string) => {
    setAppointments((prev) => prev.filter((a) => a.id !== id));
    setConfirmId(null);
  };

  const editing = appointments.find((a) => a.id === editingId) ?? null;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-zinc-900">Recepción</h2>
        <p className="mt-1 text-sm text-zinc-500">Control de citas confirmadas y pendientes del día.</p>
      </div>

      <div className="flex items-center gap-4 rounded-xl border border-zinc-200 bg-white p-5">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#D96B52]/10">
          <span className="text-lg font-bold text-[#D96B52]">{confirmed.length}</span>
        </div>
        <div>
          <p className="text-sm text-zinc-500">Estado del día</p>
          <p className="text-lg font-semibold text-zinc-900">{confirmed.length} citas para hoy</p>
        </div>
      </div>

      <div className="space-y-3">
        {confirmed.length === 0 ? (
          <div className="rounded-xl border border-dashed border-zinc-200 bg-white py-12 text-center text-sm text-zinc-400">
            No hay citas para hoy.
          </div>
        ) : (
          confirmed.map((a) => {
            const productNames = a.items
              .map((it) => `${it.qty}x ${products.find((p) => p.id === it.productId)?.name ?? ''}`)
              .join(', ');
            const cat = products.find((p) => p.id === a.items[0]?.productId)?.category ?? 'Estetico';
            return (
              <div
                key={a.id}
                className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 flex-col items-center justify-center rounded-lg bg-zinc-50 text-center">
                    <span className="text-sm font-semibold text-zinc-900">{a.time}</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-zinc-900">{a.clientName}</p>
                    <p className="text-xs text-zinc-500">{productNames}</p>
                    <div className="mt-1 flex items-center gap-2">
                      <CategoryBadge category={cat} />
                      <StatusBadge status={a.status} />
                      <span className="text-xs text-zinc-500">Resp: {a.responsible}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-sm font-semibold text-zinc-900">{formatCurrency(a.total)}</span>
                  {readOnly ? (
                    <span className="text-xs text-zinc-400">Solo lectura</span>
                  ) : (
                    <>
                      <button
                        onClick={() => setEditingId(a.id)}
                        className="inline-flex items-center gap-1 rounded-lg bg-[#D96B52] px-2.5 py-1.5 text-xs font-medium text-white transition-colors hover:bg-[#C85A32]"
                      >
                        <Wallet className="h-3.5 w-3.5" />
                        Cobrar
                      </button>
                      <button
                        onClick={() => setEditingId(a.id)}
                        className="rounded-lg border border-zinc-200 p-1.5 text-zinc-500 hover:bg-zinc-50"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      {confirmId === a.id ? (
                        <button
                          onClick={() => handleCancel(a.id)}
                          className="rounded-lg bg-red-500 px-2.5 py-1 text-xs font-medium text-white hover:bg-red-600"
                        >
                          ¿Confirmar?
                        </button>
                      ) : (
                        <button
                          onClick={() => setConfirmId(a.id)}
                          className="rounded-lg border border-zinc-200 p-1.5 text-red-500 hover:bg-red-50"
                        >
                          <Ban className="h-4 w-4" />
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {editing && (
        <EditPaymentModal
          appointment={editing}
          products={products}
          clients={clients}
          setClients={setClients}
          onClose={() => setEditingId(null)}
          onSave={(updated) => {
            setAppointments((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
            setEditingId(null);
          }}
        />
      )}
    </div>
  );
}

function EditPaymentModal({
  appointment,
  products,
  clients,
  setClients,
  onClose,
  onSave,
}: {
  appointment: Appointment;
  products: Product[];
  clients: Client[];
  setClients: React.Dispatch<React.SetStateAction<Client[]>>;
  onClose: () => void;
  onSave: (a: Appointment) => void;
}) {
  const [items, setItems] = useState<LineItem[]>(appointment.items);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(appointment.paymentMethods);
  const [productSearch, setProductSearch] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showQuickClient, setShowQuickClient] = useState(false);
  const [paymentAmounts, setPaymentAmounts] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    appointment.paymentMethods.forEach((m) => {
      init[m] = String(appointment.paidToday);
    });
    return init;
  });

  const total = items.reduce(
    (s, it) => s + (products.find((p) => p.id === it.productId)?.price ?? 0) * it.qty,
    0
  );
  const paid = paymentMethods.reduce((s, m) => s + (Number(paymentAmounts[m]) || 0), 0);
  const diff = paid - total;
  const hasDebt = diff < 0;
  const isFullyPaid = paid === total && total > 0;

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((it) => it.productId !== id));
  };

  const changeQty = (id: string, delta: number) => {
    setItems((prev) =>
      prev.map((it) =>
        it.productId === id ? { ...it, qty: Math.max(1, it.qty + delta) } : it
      )
    );
  };

  const addItem = (id: string) => {
    if (items.some((it) => it.productId === id)) return;
    setItems((prev) => [...prev, { productId: id, qty: 1 }]);
  };

  const togglePayment = (m: PaymentMethod) => {
    setPaymentMethods((prev) => {
      if (prev.includes(m)) {
        setPaymentAmounts((pa) => {
          const next = { ...pa };
          delete next[m];
          return next;
        });
        return prev.filter((x) => x !== m);
      }
      setPaymentAmounts((pa) => ({ ...pa, [m]: '' }));
      return [...prev, m];
    });
  };

  const setAmount = (m: PaymentMethod, val: string) => {
    setPaymentAmounts((prev) => ({ ...prev, [m]: val }));
  };

  const handleCobrar = () => {
    const updated: Appointment = {
      ...appointment,
      items,
      total,
      paymentMethods,
      paidToday: paid,
      deposit: paid,
      status: 'Completada' as const,
    };

    const client = clients.find((c) => c.name === appointment.clientName);
    if (client) {
      const newBalance = client.balance + diff;
      setClients((prev) =>
        prev.map((c) =>
          c.id === client.id
            ? { ...c, balance: newBalance, visits: c.visits + 1, lastVisit: appointment.date }
            : c
        )
      );

      const newEntries: ClientHistoryEntry[] = items.map((it) => {
        const p = products.find((x) => x.id === it.productId);
        return {
          date: appointment.date,
          product: p?.name ?? 'Producto',
          amount: (p?.price ?? 0) * it.qty,
        };
      });

      const existing = clientHistory[client.id] ?? [];
      clientHistory[client.id] = [...newEntries, ...existing];
    }

    onSave(updated);
  };

  const inputCls =
    'w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-700 focus:border-[#D96B52] focus:outline-none focus:ring-1 focus:ring-[#D96B52]';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-zinc-900">Cobrar Cita</h3>
            <p className="text-xs text-zinc-500">
              {appointment.clientName} · {appointment.date} {appointment.time}
            </p>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-5">
          <label className="mb-1 block text-xs font-medium text-zinc-600">
            Productos / Servicios
          </label>
          <div className="space-y-1.5 rounded-lg border border-zinc-200 p-2">
            {items.map((it) => {
              const p = products.find((x) => x.id === it.productId);
              return (
                <div
                  key={it.productId}
                  className="flex items-center justify-between rounded px-2 py-1 text-sm"
                >
                  <span className="text-zinc-700">{p?.name}</span>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => changeQty(it.productId, -1)}
                        className="rounded p-0.5 text-zinc-500 hover:bg-zinc-200"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-6 text-center text-xs font-medium text-zinc-700">
                        {it.qty}x
                      </span>
                      <button
                        onClick={() => changeQty(it.productId, 1)}
                        className="rounded p-0.5 text-zinc-500 hover:bg-zinc-200"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <span className="text-xs text-zinc-500">
                      {formatCurrency((p?.price ?? 0) * it.qty)}
                    </span>
                    <button
                      onClick={() => removeItem(it.productId)}
                      className="text-red-400 hover:text-red-600"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
            {items.length === 0 && (
              <p className="px-2 py-2 text-xs text-zinc-400">Sin productos seleccionados</p>
            )}
          </div>
          <div className="mt-2">
            <p className="mb-1 text-xs font-medium text-zinc-600">Agregar producto</p>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                value={productSearch}
                onChange={(e) => {
                  setProductSearch(e.target.value);
                  setShowSearchResults(true);
                }}
                onFocus={() => setShowSearchResults(true)}
                onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
                placeholder="Buscar producto o servicio..."
                className="w-full rounded-lg border border-zinc-200 bg-white py-2 pl-9 pr-3 text-sm text-zinc-700 placeholder-zinc-400 focus:border-[#D96B52] focus:outline-none focus:ring-1 focus:ring-[#D96B52]"
              />
              {showSearchResults && productSearch && (
                <div className="absolute z-10 mt-1 max-h-48 w-full overflow-y-auto rounded-lg border border-zinc-200 bg-white shadow-lg">
                  {products
                    .filter((p) =>
                      !items.some((it) => it.productId === p.id) &&
                      p.name.toLowerCase().includes(productSearch.toLowerCase())
                    )
                    .map((p) => (
                      <button
                        key={p.id}
                        onClick={() => {
                          addItem(p.id);
                          setProductSearch('');
                          setShowSearchResults(false);
                        }}
                        className="flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-zinc-50"
                      >
                        <span className="text-zinc-700">{p.name}</span>
                        <span className="text-xs text-zinc-500">{formatCurrency(p.price)}</span>
                      </button>
                    ))
                  }
                  {products.filter((p) =>
                    !items.some((it) => it.productId === p.id) &&
                    p.name.toLowerCase().includes(productSearch.toLowerCase())
                  ).length === 0 && (
                    <p className="px-3 py-2 text-sm text-zinc-400">No se encontraron productos.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between rounded-lg bg-zinc-50 px-4 py-3">
          <span className="text-sm font-medium text-zinc-600">Total</span>
          <span className="text-lg font-semibold text-zinc-900">{formatCurrency(total)}</span>
        </div>

        <div className="mt-4">
          <label className="mb-1 block text-xs font-medium text-zinc-600">Métodos de pago</label>
          <div className="flex gap-2">
            {(['Efectivo', 'Tarjeta', 'Transferencia'] as PaymentMethod[]).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => togglePayment(m)}
                className={
                  paymentMethods.includes(m)
                    ? 'rounded-lg bg-[#D96B52] px-3 py-1.5 text-sm font-medium text-white transition-colors'
                    : 'rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-50'
                }
              >
                {m}
              </button>
            ))}
          </div>

          {paymentMethods.length > 0 && (
            <div className="mt-3 space-y-2">
              {paymentMethods.map((m) => (
                <div key={m} className="flex items-center gap-2">
                  <span className="w-24 text-xs font-medium text-zinc-600">{m}</span>
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-zinc-400">
                      $
                    </span>
                    <input
                      type="number"
                      value={paymentAmounts[m] ?? ''}
                      onChange={(e) => setAmount(m, e.target.value)}
                      placeholder="0"
                      className="w-full rounded-lg border border-zinc-200 bg-white py-2 pl-7 pr-3 text-sm text-zinc-700 focus:border-[#D96B52] focus:outline-none focus:ring-1 focus:ring-[#D96B52]"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-3 flex items-center justify-between rounded-lg bg-zinc-50 px-4 py-3">
          <span className="text-sm font-medium text-zinc-600">Total pagado</span>
          <span className="text-lg font-semibold text-zinc-900">{formatCurrency(paid)}</span>
        </div>

        {isFullyPaid ? (
          <div className="mt-3 rounded-lg bg-emerald-50 p-3">
            <p className="text-xs text-emerald-600">Estado</p>
            <p className="text-base font-semibold text-emerald-600">Pagado completo</p>
          </div>
        ) : (
          diff !== 0 && (
            <div className={'mt-3 rounded-lg p-3 ' + (hasDebt ? 'bg-red-50' : 'bg-blue-50')}>
              <p className="text-xs text-zinc-500">
                {hasDebt ? 'Deuda pendiente' : 'Saldo a favor'}
              </p>
              <p
                className={
                  'text-base font-semibold ' +
                  (hasDebt ? 'text-red-600' : 'text-blue-600')
                }
              >
                {hasDebt
                  ? 'Falta pagar: ' + formatCurrency(Math.abs(diff))
                  : 'Abono para próxima cita: ' + formatCurrency(diff)}
              </p>
            </div>
          )
        )}

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleCobrar}
            className="rounded-lg bg-[#D96B52] px-4 py-2 text-sm font-medium text-white hover:bg-[#C85A32]"
          >
            Cobrar
          </button>
        </div>
      </div>
    </div>
  );
}
