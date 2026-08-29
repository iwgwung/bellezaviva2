import { useState } from 'react';
import { syncToGoogle } from '../services/api';

export default function SyncModal({ type, payload, onClose }: { type: 'sheets' | 'calendar', payload: any, onClose: () => void }) {
  const [loading, setLoading] = useState(false);

  const handleSync = async () => {
    setLoading(true);
    try {
      await syncToGoogle(type, payload);
      alert('Sincronizado correctamente');
      onClose();
    } catch (err) {
      alert('Error en la sincronización');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white p-6 rounded-lg w-80">
        <h3 className="text-lg font-bold">¿Sincronizar con Google?</h3>
        <p className="text-sm mt-2">¿Deseas enviar este registro a Google {type === 'sheets' ? 'Sheets' : 'Calendar'}?</p>
        <div className="mt-4 flex gap-2">
          <button onClick={onClose} className="px-4 py-2 border rounded">Cancelar</button>
          <button onClick={handleSync} disabled={loading} className="px-4 py-2 bg-[#D96B52] text-white rounded">
            {loading ? 'Sincronizando...' : 'Confirmar'}
          </button>
        </div>
      </div>
    </div>
  );
}
