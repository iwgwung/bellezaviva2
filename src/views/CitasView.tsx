import { useState } from 'react';
import { Plus, Search, X, Minus, Trash2, UserPlus } from 'lucide-react';
import { products as allProducts, team } from '../data';
import { StatusBadge, formatCurrency } from '../components/Badges';
import type { Appointment, Client, LineItem, PaymentMethod, Role } from '../types';

interface CitasViewProps {
  appointments: Appointment[];
  setAppointments: React.Dispatch<React.SetStateAction<Appointment[]>>;
  products: typeof allProducts;
  role: Role;
  clients: Client[];
  setClients: React.Dispatch<React.SetStateAction<Client[]>>;
}

export default function CitasView({ appointments, setAppointments, products, role, clients, setClients }: CitasViewProps) {
  const [query, setQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const readOnly = role === 'Doctora';
  const today = '2026-08-28';

  const filtered = appointments.filter(
    (a) =>
      a.date >= today &&
      a.status !== 'Completada' &&
      a.status !== 'Cancelada' &&
      (a.clientName.toLowerCase().includes(query.toLowerCase()) ||
        a.items
          .map((it) => products.find((p) => p.id === it.productId)?.name ?? '')
          .join(' ')
          .toLowerCase()
          .includes(query.toLowerCase()))
  );

  const handleDelete = (id: string) => {
    setAppointments((prev) => prev.filter((a) => a.id !== id));
    setConfirmId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-zinc-900">Citas y Ventas</h2>
          <p className="mt-1 text-sm text-zinc-500">Gestiona las citas y ventas del centro.</p>
        </div>
        <div className="flex flex-1 gap-3 sm:max-w-md sm:justify-end">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por cliente o producto..."
              className="w-full rounded-xl border border-zinc-200 bg-white py-2.5 pl-9 pr-3 text-sm text-zinc-700 placeholder-zinc-400 focus:border-[#D96B52] focus:outline-none focus:ring-1 focus:ring-[#D96B52]"
            />
          </div>
          {!readOnly && (
            <button
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-[#D96B52] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#C85A32]"
            >
              <Plus className="h-4 w-4" />
              Nueva Cita / Venta
            </button>
          )}
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-zinc-50 text-left text-xs text-zinc-500">
            <tr>
              {['Fecha', 'Hora', 'Clienta', 'Productos', 'Total', 'Seña', 'Estado', 'Acción'].map((h) => (
                <th key={h} className="px-4 py-3 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center text-zinc-400">
                  No hay citas registradas. Crea una nueva con el botón superior.
                </td>
              </tr>
            ) : (
              filtered.map((a) => {
                const productNames = a.items
                  .map((it) => `${it.qty}x ${products.find((p) => p.id === it.productId)?.name ?? ''}`)
                  .join(', ');
                return (
                  <tr key={a.id} className="hover:bg-zinc-50">
                    <td className="px-4 py-3 text-zinc-600">{a.date}</td>
                    <td className="px-4 py-3 text-zinc-600">{a.time}</td>
                    <td className="px-4 py-3 font-medium text-zinc-900">{a.clientName}</td>
                    <td className="px-4 py-3 text-zinc-600">{productNames}</td>
                    <td className="px-4 py-3 font-medium text-zinc-900">{formatCurrency(a.total)}</td>
                    <td className="px-4 py-3 text-zinc-600">{formatCurrency(a.deposit)}</td>
                    <td className="px-4 py-3"><StatusBadge status={a.status} /></td>
                    <td className="px-4 py-3">
                      {readOnly ? (
                        <span className="text-xs text-zinc-400">Solo lectura</span>
                      ) : confirmId === a.id ? (
                        <button
                          onClick={() => handleDelete(a.id)}
                          className="rounded-lg bg-red-500 px-2.5 py-1 text-xs font-medium text-white hover:bg-red-600"
                        >
                          ¿Confirmar?
                        </button>
                      ) : (
                        <button
                          onClick={() => setConfirmId(a.id)}
                          className="text-xs font-medium text-[#D96B52] hover:underline"
                        >
                          Eliminar
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <NewAppointmentModal
          products={products}
          clients={clients}
          setClients={setClients}
          onClose={() => setModalOpen(false)}
          onSave={(a) => {
            setAppointments((prev) => [a, ...prev]);
            setModalOpen(false);
          }}
        />
      )}
    </div>
  );
}

function NewAppointmentModal({
  products,
  clients,
  setClients,
  onClose,
  onSave,
}: {
  products: typeof allProducts;
  clients: Client[];
  setClients: React.Dispatch<React.SetStateAction<Client[]>>;
  onClose: () => void;
  onSave: (a: Appointment) => void;
}) {
  const [clientName, setClientName] = useState('');
  const [items, setItems] = useState<LineItem[]>([]);
  const [productSearch, setProductSearch] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showClientResults, setShowClientResults] = useState(false);
  const [showQuickClient, setShowQuickClient] = useState(false);
  const [newClientName, setNewClientName] = useState('');
  const [newClientDni, setNewClientDni] = useState('');
  const [newClientPhone, setNewClientPhone] = useState('');
  const [newClientOrigin, setNewClientOrigin] = useState('');
  const [date, setDate] = useState('2026-08-28');
  const [time, setTime] = useState('09:00');
  const [responsible, setResponsible] = useState('');
  const [doctor, setDoctor] = useState('');
  const [deposit, setDeposit] = useState('');
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);

  const total = items.reduce((s, it) => s + (products.find((p) => p.id === it.productId)?.price ?? 0) * it.qty, 0);

  const toggleProduct = (id: string) => {
    setItems((prev) =>
      prev.some((it) => it.productId === id)
        ? prev.filter((it) => it.productId !== id)
        : [...prev, { productId: id, qty: 1 }]
    );
  };

  const changeQty = (id: string, delta: number) => {
    setItems((prev) =>
      prev.map((it) =>
        it.productId === id ? { ...it, qty: Math.max(1, it.qty + delta) } : it
      )
    );
  };

  const togglePayment = (m: PaymentMethod) => {
    setPaymentMethods((prev) => (prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]));
  };

  const handleSave = () => {
    const dep = Number(deposit) || 0;
    onSave({
      id: `a${Date.now()}`,
      date,
      time,
      clientName: clientName || 'Cliente nuevo',
      items: items.length > 0 ? items : [{ productId: products[0].id, qty: 1 }],
      total,
      deposit: dep,
      status: dep > 0 ? 'Confirmada' : 'Pendiente',
      responsible: responsible || 'Ana Torres',
      doctor: doctor || 'Dra. Patricia Ríos',
      paymentMethods: paymentMethods.length > 0 ? paymentMethods : ['Efectivo'],
      paidToday: dep,
    });
  };

  const inputCls = 'w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-700 focus:border-[#D96B52] focus:outline-none focus:ring-1 focus:ring-[#D96B52]';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-zinc-900">Nueva Cita / Venta</h3>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-5 space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-600">Buscar clienta</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                value={clientName}
                onChange={(e) => {
                  setClientName(e.target.value);
                  setShowClientResults(true);
                }}
                onFocus={() => setShowClientResults(true)}
                onBlur={() => setTimeout(() => setShowClientResults(false), 200)}
                placeholder="Nombre o DNI..."
                className="w-full rounded-lg border border-zinc-200 bg-white py-2 pl-9 pr-3 text-sm text-zinc-700 placeholder-zinc-400 focus:border-[#D96B52] focus:outline-none focus:ring-1 focus:ring-[#D96B52]"
              />
              {showClientResults && clientName && (
                <div className="absolute z-10 mt-1 max-h-40 w-full overflow-y-auto rounded-lg border border-zinc-200 bg-white shadow-lg">
                  {clients
                    .filter((c) => c.name.toLowerCase().includes(clientName.toLowerCase()) || c.dni.includes(clientName))
                    .map((c) => (
                      <button
                        key={c.id}
                        onClick={() => {
                          setClientName(c.name);
                          setShowClientResults(false);
                        }}
                        className="flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-zinc-50"
                      >
                        <span className="text-zinc-700">{c.name}</span>
                        <span className="text-xs text-zinc-500">DNI: {c.dni}</span>
                      </button>
                    ))
                  }
                  {clients.filter((c) => c.name.toLowerCase().includes(clientName.toLowerCase()) || c.dni.includes(clientName)).length === 0 && (
                    <button
                      onClick={() => {
                        setNewClientName(clientName);
                        setShowQuickClient(true);
                        setShowClientResults(false);
                      }}
                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-[#D96B52] hover:bg-[#D96B52]/5"
                    >
                      <UserPlus className="h-3.5 w-3.5" />
                      Crear nueva clienta: "{clientName}"
                    </button>
                  )}
                </div>
              )}
            </div>
            {showQuickClient && (
              <div className="mt-2 rounded-lg border border-[#D96B52]/20 bg-[#D96B52]/5 p-3">
                <p className="mb-2 text-xs font-medium text-[#D96B52]">Crear clienta rápida</p>
                <div className="grid grid-cols-2 gap-2">
                  <input value={newClientName} onChange={(e) => setNewClientName(e.target.value)} placeholder="Nombre" className={inputCls} />
                  <input value={newClientDni} onChange={(e) => setNewClientDni(e.target.value)} placeholder="DNI" className={inputCls} />
                  <input value={newClientPhone} onChange={(e) => setNewClientPhone(e.target.value)} placeholder="Teléfono" className={inputCls} />
                  <input value={newClientOrigin} onChange={(e) => setNewClientOrigin(e.target.value)} placeholder="Origen / Cómo nos conoció" className={inputCls} />
                </div>
                <div className="mt-2 flex justify-end gap-2">
                  <button onClick={() => setShowQuickClient(false)} className="text-xs text-zinc-500 hover:text-zinc-700">Cancelar</button>
                  <button
                    onClick={() => {
                      const newClient: Client = {
                        id: `c${Date.now()}`,
                        name: newClientName || clientName,
                        dni: newClientDni || 'Sin DNI',
                        phone: newClientPhone || 'Sin teléfono',
                        email: '',
                        origin: newClientOrigin || 'No especificado',
                        visits: 0,
                        balance: 0,
                        lastVisit: date,
                      };
                      setClients((prev) => [...prev, newClient]);
                      setClientName(newClient.name);
                      setShowQuickClient(false);
                      setNewClientDni('');
                      setNewClientPhone('');
                      setNewClientOrigin('');
                    }}
                    className="rounded-lg bg-[#D96B52] px-3 py-1 text-xs font-medium text-white hover:bg-[#C85A32]"
                  >
                    Crear y seleccionar
                  </button>
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-600">Agregar productos / servicios</label>

            {items.length > 0 && (
              <div className="mb-2 space-y-1 rounded-lg border border-zinc-200 p-2">
                {items.map((it) => {
                  const p = products.find((x) => x.id === it.productId);
                  const qty = it.qty;
                  return (
                    <div key={it.productId} className="flex items-center gap-2 rounded px-2 py-1 text-sm">
                      <span className="flex-1 text-zinc-700">{p?.name}</span>
                      <div className="flex items-center gap-1">
                        <button onClick={() => changeQty(it.productId, -1)} className="rounded p-0.5 text-zinc-500 hover:bg-zinc-200">
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-6 text-center text-xs font-medium text-zinc-700">{qty}</span>
                        <button onClick={() => changeQty(it.productId, 1)} className="rounded p-0.5 text-zinc-500 hover:bg-zinc-200">
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <span className="text-xs text-zinc-500">{formatCurrency((p?.price ?? 0) * qty)}</span>
                      <button onClick={() => toggleProduct(it.productId)} className="text-red-400 hover:text-red-600">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

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
                placeholder="Buscar producto o servicio para agregar..."
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
                          toggleProduct(p.id);
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
            {total > 0 && (
              <p className="mt-1.5 text-right text-sm font-semibold text-zinc-900">Total: {formatCurrency(total)}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-600">Fecha</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-600">Hora</label>
              <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className={inputCls} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-600">Responsable</label>
              <select value={responsible} onChange={(e) => setResponsible(e.target.value)} className={inputCls}>
                <option value="">Seleccionar...</option>
                {team.filter((t) => t.role === 'Vendedora').map((t) => <option key={t.id}>{t.name}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-600">Doctora</label>
              <select value={doctor} onChange={(e) => setDoctor(e.target.value)} className={inputCls}>
                <option value="">Seleccionar...</option>
                {team.filter((t) => t.role === 'Doctora').map((t) => <option key={t.id}>{t.name}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-600">Métodos de pago</label>
            <div className="flex gap-2">
              {(['Efectivo', 'Tarjeta', 'Transferencia'] as PaymentMethod[]).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => togglePayment(m)}
                  className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                    paymentMethods.includes(m)
                      ? 'bg-[#D96B52] text-white'
                      : 'border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-600">Seña pagada</label>
            <input type="number" value={deposit} onChange={(e) => setDeposit(e.target.value)} placeholder="0" className={inputCls} />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-50">
            Cancelar
          </button>
          <button onClick={handleSave} className="rounded-lg bg-[#D96B52] px-4 py-2 text-sm font-medium text-white hover:bg-[#C85A32]">
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}
