import type { Category } from '../types';

export function CategoryBadge({ category }: { category: Category }) {
  if (category === 'Medico') {
    return (
      <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700">
        Médico
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-full bg-pink-100 px-2.5 py-0.5 text-xs font-medium text-pink-700">
      Estético
    </span>
  );
}

export function StatusBadge({
  status,
}: {
  status: 'Confirmada' | 'Pendiente' | 'Cancelada' | 'Completada';
}) {
  const styles: Record<string, string> = {
    Confirmada: 'bg-emerald-100 text-emerald-700',
    Pendiente: 'bg-amber-100 text-amber-700',
    Cancelada: 'bg-red-100 text-red-700',
    Completada: 'bg-zinc-100 text-zinc-600',
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[status]}`}
    >
      {status}
    </span>
  );
}

export function LowStockBadge() {
  return (
    <span className="inline-flex items-center rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-medium text-orange-700">
      Stock bajo
    </span>
  );
}

export function formatCurrency(n: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
  }).format(n);
}
