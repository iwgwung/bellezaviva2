export const syncToGoogle = async (type: 'sheets' | 'calendar', payload: any) => {
  const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/sync/${type}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error('Error en la sincronización');
  return response.json();
};
