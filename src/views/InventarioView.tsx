import { useState } from 'react';
import { Plus, TrendingUp, Receipt, Percent, Wallet, X, Pencil, BarChart3, Trophy } from 'lucide-react';
import { CategoryBadge, LowStockBadge, formatCurrency } from '../components/Badges';
import type { Appointment, Category, Product } from '../types';

type Filter = 'Todos' | Category;

interface InventarioViewProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  appointments: Appointment[];
}

export default function InventarioView({ products, setProducts, appointments }: InventarioViewProps) {
  const [filter, setFilter] = useState<Filter>('Todos');
  const [newOpen, setNewOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const totalRevenue = products.reduce((s, p) => s + p.price * 10, 0);
  const totalCogs = products.reduce((s, p) => s + p.cost * 10, 0);
  const totalCommission = products.reduce((s, p) => s + (p.price * p.commissionPct) / 100 * 10, 0);
  const netProfit = totalRevenue - totalCogs - totalCommission;

  const filtered = filter === 'Todos' ? products : products.filter((p) => p.category === filter);

  const completedAppts = appointments.filter((a) => a.status === 'Completada');
  const dateFiltered = completedAppts.filter((a) => {
    if (fromDate && a.date < fromDate) return false;
    if (toDate && a.date > toDate) return false;
    return true;
  });

  const productStats = products
    .map((p) => {
      let units = 0;
      let revenue = 0;
      dateFiltered.forEach((a) => {
        a.items.forEach((it) => {
          if (it.productId === p.id) {
            units += it.qty;
            revenue += it.qty * p.price;
          }
        });
      });
      return { product: p, units, revenue };
    })
    .filter((s) => s.units > 0)
    .sort((a, b) => b.revenue - a.revenue);

  const totalUnitsSold = productStats.reduce((s, p) => s + p.units, 0);
  const totalReportRevenue = productStats.reduce((s, p) => s + p.revenue, 0);

  const summaryCards = [
    { label: 'Ingresos', value: formatCurrency(totalRevenue), icon: TrendingUp, tint: 'text-emerald-600 bg-emerald-100' },
    { label: 'COGS + Comisiones', value: formatCurrency(totalCogs + totalCommission), icon: Receipt, tint: 'text-amber-600 bg-amber-100' },
    { label: 'Comisiones', value: formatCurrency(totalCommission), icon: Percent, tint: 'text-pink-600 bg-pink-100' },
    { label: 'Ganancia Neta', value: formatCurrency(netProfit), icon: Wallet, tint: 'text-[#D96B52] bg-[#D96B52]/10' },
  ];

  const inputCls = 'w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-700 focus:border-[#D96B52] focus:outline-none focus:ring-1 focus:ring-[#D96B52]';

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-zinc-900">Inventario / Dashboard Financiero</h2>
          <p className="mt-1 text-sm text-zinc-500">Resumen financiero y catálogo de productos.</p>
        </div>
        <button
          onClick={() => setNewOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-[#D96B52] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#C85A32]"
        >
          <Plus className="h-4 w-4" />
          Nuevo producto
        </button>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {summaryCards.map((c) => {
            const Icon = c.icon;
            return (
              <div key={c.label} className="rounded-lg border border-zinc-100 p-4">
                <div className={`mb-3 flex h-9 w-9 items-center justify-center rounded-lg ${c.tint}`}>
                  <Icon className="h-4.5 w-4.5" />
                </div>
                <p className="text-xs text-zinc-500">{c.label}</p>
                <p className="mt-0.5 text-lg font-semibold text-zinc-900">{c.value}</p>
              </div>
            );
          })}
        </div>
        <div className="mt-4 rounded-lg bg-zinc-50 p-3 text-center text-sm text-zinc-600">
          <span className="font-medium text-emerald-600">Ingresos</span>
          {' − '}
          <span className="font-medium text-amber-600">[COGS + Comisiones]</span>
          {' = '}
          <span className="font-semibold text-[#D96B52]">Ganancia Neta {formatCurrency(netProfit)}</span>
        </div>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-zinc-900">
            <BarChart3 className="h-4 w-4 text-[#D96B52]" />
            Productos Más Vendidos
          </h3>
          <div className="flex flex-wrap items-end gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-600">Desde</label>
              <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-600">Hasta</label>
              <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className={inputCls} />
            </div>
            <button
              onClick={() => { setFromDate(''); setToDate(''); }}
              className="rounded-lg border border-zinc-200 px-3 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-50"
            >
              Limpiar
            </button>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <div className="rounded-lg bg-zinc-50 px-4 py-2">
            <span className="text-zinc-500">Período: </span>
            <span className="font-medium text-zinc-900">
              {fromDate || 'Inicio'} → {toDate || 'Hoy'}
            </span>
          </div>
          <div className="rounded-lg bg-zinc-50 px-4 py-2">
            <span className="text-zinc-500">Unidades vendidas: </span>
            <span className="font-medium text-zinc-900">{totalUnitsSold}</span>
          </div>
          <div className="rounded-lg bg-zinc-50 px-4 py-2">
            <span className="text-zinc-500">Ingresos totales: </span>
            <span className="font-medium text-emerald-600">{formatCurrency(totalReportRevenue)}</span>
          </div>
        </div>

        <div className="mt-4 overflow-hidden rounded-lg border border-zinc-100">
          <table className="w-full text-sm">
            <thead className="bg-zinc-50 text-left text-xs text-zinc-500">
              <tr>
                {['#', 'Producto', 'Categoría', 'Unidades', 'Ingresos', '% del total'].map((h) => (
                  <th key={h} className="px-4 py-2.5 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {productStats.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-zinc-400">
                    No hay ventas registradas en el rango seleccionado.
                  </td>
                </tr>
              ) : (
                productStats.map((s, i) => (
                  <tr key={s.product.id} className="hover:bg-zinc-50">
                    <td className="px-4 py-2.5">
                      {i === 0 ? (
                        <Trophy className="h-4 w-4 text-amber-500" />
                      ) : (
                        <span className="text-xs font-medium text-zinc-500">{i + 1}</span>
                      )}
                    </td>
                    <td className="px-4 py-2.5 font-medium text-zinc-900">{s.product.name}</td>
                    <td className="px-4 py-2.5"><CategoryBadge category={s.product.category} /></td>
                    <td className="px-4 py-2.5 text-zinc-600">{s.units}</td>
                    <td className="px-4 py-2.5 font-medium text-emerald-600">{formatCurrency(s.revenue)}</td>
                    <td className="px-4 py-2.5 text-zinc-500">
                      {totalReportRevenue > 0 ? ((s.revenue / totalReportRevenue) * 100).toFixed(1) : '0'}%
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex gap-2">
        {(['Todos', 'Medico', 'Estetico'] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              filter === f ? 'bg-[#D96B52] text-white' : 'border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50'
            }`}
          >
            {f === 'Medico' ? 'Médico' : f === 'Estetico' ? 'Estético' : 'Todos'}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((p) => {
          const low = p.stock <= p.minStock;
          return (
            <div key={p.id} className="rounded-xl border border-zinc-200 bg-white p-4">
              <div className="flex items-start justify-between">
                <h3 className="text-sm font-semibold text-zinc-900">{p.name}</h3>
                <CategoryBadge category={p.category} />
              </div>
              <div className="mt-3 grid grid-cols-2 gap-y-2 text-sm">
                <div>
                  <p className="text-xs text-zinc-500">Precio público</p>
                  <p className="font-medium text-zinc-900">{formatCurrency(p.price)}</p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500">Costo interno</p>
                  <p className="font-medium text-zinc-600">{formatCurrency(p.cost)}</p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500">Stock</p>
                  <p className={`font-medium ${low ? 'text-orange-600' : 'text-zinc-900'}`}>
                    {p.stock} {low && <span className="text-xs">(mín: {p.minStock})</span>}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500">Comisión Vendedora</p>
                  <p className="font-medium text-zinc-900">{p.commissionPct}%</p>
                </div>
                {p.category === 'Medico' && (
                  <div>
                    <p className="text-xs text-zinc-500">Comisión Doctora</p>
                    <p className="font-medium text-zinc-900">{p.commissionPctDoctor}%</p>
                  </div>
                )}
              </div>
              <div className="mt-3 flex items-center justify-between">
                {low ? <LowStockBadge /> : <span />}
                <button
                  onClick={() => setEditProduct(p)}
                  className="inline-flex items-center gap-1 text-xs font-medium text-[#D96B52] hover:underline"
                >
                  <Pencil className="h-3 w-3" />
                  Editar
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {newOpen && (
        <ProductModal
          onClose={() => setNewOpen(false)}
          onSave={(p) => {
            setProducts((prev) => [...prev, p]);
            setNewOpen(false);
          }}
        />
      )}
      {editProduct && (
        <ProductModal
          product={editProduct}
          onClose={() => setEditProduct(null)}
          onSave={(p) => {
            setProducts((prev) => prev.map((x) => (x.id === p.id ? p : x)));
            setEditProduct(null);
          }}
        />
      )}
    </div>
  );
}

function ProductModal({
  product,
  onClose,
  onSave,
}: {
  product?: Product;
  onClose: () => void;
  onSave: (p: Product) => void;
}) {
  const [name, setName] = useState(product?.name ?? '');
  const [category, setCategory] = useState<Category>(product?.category ?? 'Medico');
  const [price, setPrice] = useState(product?.price ? String(product.price) : '');
  const [cost, setCost] = useState(product?.cost ? String(product.cost) : '');
  const [stock, setStock] = useState(product?.stock ? String(product.stock) : '');
  const [minStock, setMinStock] = useState(product?.minStock ? String(product.minStock) : '');
  const [commissionPct, setCommissionPct] = useState(product?.commissionPct ? String(product.commissionPct) : '');
  const [commissionPctDoctor, setCommissionPctDoctor] = useState(product?.commissionPctDoctor ? String(product.commissionPctDoctor) : '');

  const inputCls = 'w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-700 focus:border-[#D96B52] focus:outline-none focus:ring-1 focus:ring-[#D96B52]';

  const handleSave = () => {
    onSave({
      id: product?.id ?? `p${Date.now()}`,
      name: name || 'Producto sin nombre',
      category,
      price: Number(price) || 0,
      cost: Number(cost) || 0,
      stock: Number(stock) || 0,
      minStock: Number(minStock) || 0,
      commissionPct: Number(commissionPct) || 0,
      commissionPctDoctor: category === 'Medico' ? (Number(commissionPctDoctor) || 0) : 0,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-zinc-900">
            {product ? 'Editar producto' : 'Nuevo producto'}
          </h3>
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
            <label className="mb-1 block text-xs font-medium text-zinc-600">Categoría</label>
            <select value={category} onChange={(e) => setCategory(e.target.value as Category)} className={inputCls}>
              <option value="Medico">Médico</option>
              <option value="Estetico">Estético</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-600">Precio público</label>
              <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-600">Costo (COGS)</label>
              <input type="number" value={cost} onChange={(e) => setCost(e.target.value)} className={inputCls} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-600">Stock inicial</label>
              <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-600">Stock mínimo</label>
              <input type="number" value={minStock} onChange={(e) => setMinStock(e.target.value)} className={inputCls} />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-600">% Comisión Vendedora</label>
            <input type="number" value={commissionPct} onChange={(e) => setCommissionPct(e.target.value)} className={inputCls} />
          </div>
          {category === 'Medico' && (
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-600">% Comisión Médica/Doctora</label>
              <input type="number" value={commissionPctDoctor} onChange={(e) => setCommissionPctDoctor(e.target.value)} className={inputCls} />
            </div>
          )}
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
