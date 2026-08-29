import { useState } from 'react';
import { Phone, Mail, CreditCard, Calendar, AlertTriangle, X, History, Pencil, Wallet, Filter, Check, Trash2, Globe } from 'lucide-react';
import { clientHistory } from '../data';
import { formatCurrency } from '../components/Badges';
import type { Appointment, Client, Product, Role } from '../types';

interface ClientasViewProps {
  clients: Client[];
  setClients: React.Dispatch<React.SetStateAction<Client[]>>;
  role: Role;
  products: Product[];
  appointments: Appointment[];
}

type SortMode = 'none' | 'top' | 'bottom' | 'recent' | 'oldest';

export default function ClientasView({ clients, setClients, role, products, appointments }: ClientasViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showDebtOnly, setShowDebtOnly] = useState(false);
  const [sortMode, setSortMode] = useState<SortMode>('none');
  const [historyClient, setHistoryClient] = useState<Client | null>(null);
  const [editClient, setEditClient] = useState<Client | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [showProductFilter, setShowProductFilter] = useState(false);
  const [visibleCount, setVisibleCount] = useState(6);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const PAGE_SIZE = 6;

  const spent = (c: Client) =>
    (clientHistory[c.id] ?? []).reduce((s, h) => s + h.amount, 0);

  const spentByProduct = (c: Client, productIds: string[]) => {
    const history = clientHistory[c.id] ?? [];
    return history
      .filter((h) => productIds.some((pid) => products.find((p) => p.id === pid)?.name === h.product))
      .reduce((s, h) => s + h.amount, 0);
  };

  const hasPurchasedProduct = (c: Client, productIds: string[]) => {
    const history = clientHistory[c.id] ?? [];
    return productIds.every((pid) => {
      const productName = products.find((p) => p.id === pid)?.name;
      return history.some((h) => h.product === productName);
    });
  };

  let list = [...clients];
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    list = list.filter((c) =>
      c.name.toLowerCase().includes(term) ||
      c.email.toLowerCase().includes(term) ||
      c.dni.toLowerCase().includes(term) ||
      c.phone.toLowerCase().includes(term)
    );
  }
  if (showDebtOnly) list = list.filter((c) => c.balance < 0);
  if (selectedProducts.length > 0) {
    list = list.filter((c) => hasPurchasedProduct(c, selectedProducts));
  }
  if (sortMode === 'top') {
    if (selectedProducts.length > 0) {
      list.sort((a, b) => spentByProduct(b, selectedProducts) - spentByProduct(a, selectedProducts));
    } else {
      list.sort((a, b) => spent(b) - spent(a));
    }
  }
  if (sortMode === 'bottom') {
    if (selectedProducts.length > 0) {
      list.sort((a, b) => spentByProduct(a, selectedProducts) - spentByProduct(b, selectedProducts));
    } else {
      list.sort((a, b) => spent(a) - spent(b));
    }
  }
  if (sortMode === 'recent') list.sort((a, b) => b.lastVisit.localeCompare(a.lastVisit));
  if (sortMode === 'oldest') list.sort((a, b) => a.lastVisit.localeCompare(b.lastVisit));

  const toggleProduct = (id: string) => {
    setSelectedProducts((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-zinc-900">Clientas</h2>
          <p className="mt-1 text-sm text-zinc-500">Información personal, historial y estado de cuenta.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
            <input type="text" placeholder="Buscar clienta..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="rounded-lg border border-zinc-200 px-3 py-1.5 text-sm focus:border-[#D96B52] focus:outline-none" />>
          <button
            onClick={() => setShowDebtOnly((v) => !v)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              showDebtOnly
                ? 'bg-red-500 text-white'
                : 'border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50'
            }`}
          >
            Solo con deuda
          </button>
          <div className="relative">
            <button
              onClick={() => setShowProductFilter((v) => !v)}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                selectedProducts.length > 0
                  ? 'bg-[#D96B52] text-white'
                  : 'border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50'
              }`}
            >
              <Filter className="h-3.5 w-3.5" />
              Por producto{selectedProducts.length > 0 ? ` (${selectedProducts.length})` : ''}
            </button>
            {showProductFilter && (
              <div className="absolute right-0 z-30 mt-2 max-h-64 w-64 overflow-y-auto rounded-xl border border-zinc-200 bg-white p-3 shadow-lg">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-xs font-medium text-zinc-600">Filtrar por producto comprado</p>
                  {selectedProducts.length > 0 && (
                    <button onClick={() => setSelectedProducts([])} className="text-xs text-[#D96B52] hover:underline">
                      Limpiar
                    </button>
                  )}
                </div>
                <div className="space-y-1">
                  {products.map((p) => {
                    const checked = selectedProducts.includes(p.id);
                    return (
                      <button
                        key={p.id}
                        onClick={() => toggleProduct(p.id)}
                        className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm hover:bg-zinc-50"
                      >
                        <div className={`flex h-4 w-4 items-center justify-center rounded border ${
                          checked ? 'border-[#D96B52] bg-[#D96B52] text-white' : 'border-zinc-300'
                        }`}>
                          {checked && <Check className="h-3 w-3" />}
                        </div>
                        <span className="text-zinc-700">{p.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
          <select
            value={sortMode}
            onChange={(e) => setSortMode(e.target.value as SortMode)}
            className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-sm font-medium text-zinc-600"
          >
            <option value="none">Ordenar por...</option>
            <option value="top">Mayor gasto (Top)</option>
            <option value="bottom">Menor gasto</option>
            <option value="recent">Última visita (más reciente)</option>
            <option value="oldest">Última visita (más vieja)</option>
          </select>
        </div>
      </div>

      {selectedProducts.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 rounded-xl border border-[#D96B52]/20 bg-[#D96B52]/5 p-3">
          <span className="text-xs font-medium text-zinc-600">Filtrando por:</span>
          {selectedProducts.map((pid) => {
            const p = products.find((x) => x.id === pid);
            return (
              <span key={pid} className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-xs font-medium text-[#D96B52]">
                {p?.name}
                <button onClick={() => toggleProduct(pid)} className="text-zinc-400 hover:text-zinc-600">
                  <X className="h-3 w-3" />
                </button>
              </span>
            );
          })}
          <button onClick={() => setSelectedProducts([])} className="text-xs text-zinc-500 hover:underline">
            Quitar todos
          </button>
        </div>
      )}

      {list.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-200 bg-white py-12 text-center text-sm text-zinc-400">
          No hay clientas que coincidan con los filtros seleccionados.
        </div>
      ) : (
        <>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.length === 0 && (
    <div className="py-12 text-center text-zinc-500 text-sm">
      No se encontraron clientes que coincidan con tu búsqueda.
    </div>
  )}
  {list.slice(0, visibleCount).map((c) => {
            const hasDebt = c.balance < 0;
            const totalSpent = selectedProducts.length > 0
              ? spentByProduct(c, selectedProducts)
              : spent(c);
            return (
              <div key={c.id} className="rounded-xl border border-zinc-200 bg-white p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#D96B52]/10 text-base font-semibold text-[#D96B52]">
                    {c.name.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-zinc-900">{c.name}</p>
                    <p className="text-xs text-zinc-500">DNI: {c.dni}</p>
                  </div>
                  <button
                    onClick={() => setEditClient(c)}
                    className="rounded-lg border border-zinc-200 p-1.5 text-zinc-500 hover:bg-zinc-50"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (deleteConfirmId === c.id) {
                        setClients((prev) => prev.filter((x) => x.id !== c.id));
                        setDeleteConfirmId(null);
                      } else {
                        setDeleteConfirmId(c.id);
                        setTimeout(() => setDeleteConfirmId(null), 3000);
                      }
                    }}
                    className={`rounded-lg border p-1.5 transition-colors ${
                      deleteConfirmId === c.id
                        ? 'border-red-500 bg-red-500 text-white'
                        : 'border-zinc-200 text-red-500 hover:bg-red-50'
                    }`}
                    title={deleteConfirmId === c.id ? 'Clic nuevamente para confirmar' : 'Eliminar'}
                  >
                    {deleteConfirmId === c.id ? <span className="text-xs font-medium px-1">¿Seguro?</span> : <Trash2 className="h-3.5 w-3.5" />}
                  </button>
                </div>

                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-zinc-600">
                    <Phone className="h-3.5 w-3.5 text-zinc-400" />
                    {c.phone}
                  </div>
                  <div className="flex items-center gap-2 text-zinc-600">
                    <Mail className="h-3.5 w-3.5 text-zinc-400" />
                    <span className="truncate">{c.email || 'Sin email'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-600">
                    <Globe className="h-3.5 w-3.5 text-zinc-400" />
                    <span className="truncate">Origen: {c.origin || 'No especificado'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-600">
                    <CreditCard className="h-3.5 w-3.5 text-zinc-400" />
                    {c.visits} visitas · Gastado: {formatCurrency(totalSpent)}
                  </div>
                  <div className="flex items-center gap-2 text-zinc-600">
                    <Calendar className="h-3.5 w-3.5 text-zinc-400" />
                    Última: {c.lastVisit}
                  </div>
                </div>

                <div className={`mt-4 rounded-lg p-3 ${hasDebt ? 'bg-red-50' : c.balance > 0 ? 'bg-blue-50' : 'bg-emerald-50'}`}>
                  <p className="text-xs text-zinc-500">Estado de cuenta</p>
                  <div className="flex items-center gap-2">
                    {hasDebt && <AlertTriangle className="h-4 w-4 text-red-500" />}
                    <p className={`text-base font-semibold ${hasDebt ? 'text-red-600' : c.balance > 0 ? 'text-blue-600' : 'text-emerald-600'}`}>
                      {hasDebt
                        ? `Deuda: ${formatCurrency(Math.abs(c.balance))}`
                        : c.balance > 0
                          ? `Saldo a favor: ${formatCurrency(c.balance)}`
                          : 'Sin deuda'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setHistoryClient(c)}
                  className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg border border-zinc-200 py-2 text-xs font-medium text-zinc-600 hover:bg-zinc-50"
                >
                  <History className="h-3.5 w-3.5" />
                  Ver historial
                </button>
              </div>
            );
          })}
        </div>
        {visibleCount < list.length && (
          <div className="mt-4 flex justify-center">
            <button
              onClick={() => setVisibleCount((v) => v + PAGE_SIZE)}
              className="rounded-lg border border-zinc-200 bg-white px-6 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-50"
            >
              Cargar más ({list.length - visibleCount} restantes)
            </button>
          </div>
        )}
        </>
      )}

      {historyClient && (
        <ClientHistoryModal
          client={historyClient}
          role={role}
          onClose={() => setHistoryClient(null)}
          onUpdateBalance={(id, balance) => {
            setClients((prev) => prev.map((c) => (c.id === id ? { ...c, balance } : c)));
          }}
        />
      )}
      {editClient && (
        <EditClientModal
          client={editClient}
          onClose={() => setEditClient(null)}
          onSave={(updated) => {
            setClients((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
            setEditClient(null);
          }}
        />
      )}
    </div>
  );
}

function ClientHistoryModal({
  client,
  role,
  onClose,
  onUpdateBalance,
}: {
  client: Client;
  role: Role;
  onClose: () => void;
  onUpdateBalance: (id: string, balance: number) => void;
}) {
  const history = clientHistory[client.id] ?? [];
  const totalSpent = history.reduce((s, h) => s + h.amount, 0);
  const hasDebt = client.balance < 0;
  const canEditBalance = role === 'Administrador' || role === 'Vendedora';
  const [editBalance, setEditBalance] = useState(false);
  const [balanceInput, setBalanceInput] = useState(String(client.balance));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-zinc-900">Ficha de {client.name}</h3>
            <p className="text-xs text-zinc-500">DNI: {client.dni} · {client.visits} visitas</p>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-zinc-50 p-3">
            <p className="text-xs text-zinc-500">Total gastado acumulado</p>
            <p className="text-lg font-semibold text-zinc-900">{formatCurrency(totalSpent)}</p>
          </div>
          <div className={`rounded-lg p-3 ${hasDebt ? 'bg-red-50' : client.balance > 0 ? 'bg-blue-50' : 'bg-emerald-50'}`}>
            <div className="flex items-center justify-between">
              <p className="text-xs text-zinc-500">Estado de cuenta</p>
              {canEditBalance && !editBalance && (
                <button onClick={() => setEditBalance(true)} className="text-zinc-400 hover:text-[#D96B52]">
                  <Wallet className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
            {editBalance ? (
              <div className="mt-1 flex items-center gap-2">
                <input
                  type="number"
                  value={balanceInput}
                  onChange={(e) => setBalanceInput(e.target.value)}
                  className="w-24 rounded border border-zinc-200 px-2 py-1 text-sm text-zinc-700 focus:border-[#D96B52] focus:outline-none"
                />
                <button
                  onClick={() => {
                    onUpdateBalance(client.id, Number(balanceInput) || 0);
                    setEditBalance(false);
                  }}
                  className="rounded bg-[#D96B52] px-2 py-1 text-xs font-medium text-white hover:bg-[#C85A32]"
                >
                  Guardar
                </button>
                <button onClick={() => setEditBalance(false)} className="text-xs text-zinc-500 hover:text-zinc-700">
                  Cancelar
                </button>
              </div>
            ) : (
              <p className={`text-lg font-semibold ${hasDebt ? 'text-red-600' : client.balance > 0 ? 'text-blue-600' : 'text-emerald-600'}`}>
                {hasDebt ? `Deuda: ${formatCurrency(Math.abs(client.balance))}` : client.balance > 0 ? `Saldo a favor: ${formatCurrency(client.balance)}` : 'Sin deuda'}
              </p>
            )}
          </div>
        </div>

        <div className="mt-5">
          <p className="mb-2 text-xs font-medium text-zinc-600">Historial de atenciones</p>
          {history.length === 0 ? (
            <p className="rounded-lg border border-dashed border-zinc-200 py-6 text-center text-sm text-zinc-400">
              Sin historial registrado
            </p>
          ) : (
            <div className="space-y-2">
              {history.map((h, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg border border-zinc-100 p-3">
                  <div>
                    <p className="text-sm font-medium text-zinc-900">{h.product}</p>
                    <p className="text-xs text-zinc-500">{h.date}</p>
                  </div>
                  <span className="text-sm font-semibold text-zinc-700">{formatCurrency(h.amount)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end">
          <button onClick={onClose} className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-50">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

function EditClientModal({
  client,
  onClose,
  onSave,
}: {
  client: Client;
  onClose: () => void;
  onSave: (c: Client) => void;
}) {
  const [name, setName] = useState(client.name);
  const [dni, setDni] = useState(client.dni);
  const [phone, setPhone] = useState(client.phone);
  const [origin, setOrigin] = useState(client.origin);
  const [balanceType, setBalanceType] = useState<'deuda' | 'favor'>(client.balance < 0 ? 'deuda' : 'favor');
  const [balanceAmount, setBalanceAmount] = useState(String(Math.abs(client.balance)));

  const inputCls = 'w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-700 focus:border-[#D96B52] focus:outline-none focus:ring-1 focus:ring-[#D96B52]';

  const computedBalance = balanceType === 'deuda' ? -(Number(balanceAmount) || 0) : (Number(balanceAmount) || 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-zinc-900">Editar ficha de clienta</h3>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-5 space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-600">Nombre</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-600">DNI</label>
            <input value={dni} onChange={(e) => setDni(e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-600">Teléfono</label>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-600">Origen / ¿Cómo nos conoció?</label>
            <input value={origin} onChange={(e) => setOrigin(e.target.value)} placeholder="Instagram, Recomendación, TikTok..." className={inputCls} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-600">Saldo / Estado de cuenta</label>
            <div className="flex gap-2">
              <select
                value={balanceType}
                onChange={(e) => setBalanceType(e.target.value as 'deuda' | 'favor')}
                className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-700 focus:border-[#D96B52] focus:outline-none"
              >
                <option value="deuda">Deuda</option>
                <option value="favor">Saldo a favor</option>
              </select>
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-zinc-400">$</span>
                <input
                  type="number"
                  value={balanceAmount}
                  onChange={(e) => setBalanceAmount(e.target.value)}
                  placeholder="0"
                  className="w-full rounded-lg border border-zinc-200 bg-white py-2 pl-7 pr-3 text-sm text-zinc-700 focus:border-[#D96B52] focus:outline-none focus:ring-1 focus:ring-[#D96B52]"
                />
              </div>
            </div>
            <p className={`mt-1.5 text-xs font-medium ${computedBalance < 0 ? 'text-red-600' : computedBalance > 0 ? 'text-blue-600' : 'text-emerald-600'}`}>
              {computedBalance < 0
                ? `Deuda: ${formatCurrency(Math.abs(computedBalance))}`
                : computedBalance > 0
                  ? `Saldo a favor: ${formatCurrency(computedBalance)}`
                  : 'Sin deuda'}
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-50">
            Cancelar
          </button>
          <button
            onClick={() => onSave({ ...client, name, dni, phone, origin, balance: computedBalance })}
            className="rounded-lg bg-[#D96B52] px-4 py-2 text-sm font-medium text-white hover:bg-[#C85A32]"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
