import { useState } from 'react';
import { Pencil, Trash2, UserPlus, X } from 'lucide-react';
import type { User } from '../types';

interface UsuariosViewProps {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
}

const roleStyles: Record<string, string> = {
  Administrador: 'bg-[#D96B52]/10 text-[#D96B52]',
  Doctora: 'bg-blue-100 text-blue-700',
  Vendedora: 'bg-pink-100 text-pink-700',
};

export default function UsuariosView({ users, setUsers }: UsuariosViewProps) {
  const [newOpen, setNewOpen] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    if (deleteConfirmId === id) {
      setUsers((prev) => prev.filter((u) => u.id !== id));
      setDeleteConfirmId(null);
    } else {
      setDeleteConfirmId(id);
      setTimeout(() => setDeleteConfirmId(null), 3000);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-zinc-900">Usuarios</h2>
          <p className="mt-1 text-sm text-zinc-500">Gestiona los usuarios y roles del sistema.</p>
        </div>
        <button
          onClick={() => setNewOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-[#D96B52] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#C85A32]"
        >
          <UserPlus className="h-4 w-4" />
          Nuevo usuario
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-zinc-50 text-left text-xs text-zinc-500">
            <tr>
              {['Nombre', 'Usuario', 'Rol', 'Fecha de alta', 'Acciones'].map((h) => (
                <th key={h} className={`px-4 py-3 font-medium ${h === 'Acciones' ? 'text-right' : ''}`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-zinc-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 text-xs font-semibold text-zinc-600">
                      {u.name.charAt(0)}
                    </div>
                    <span className="font-medium text-zinc-900">{u.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-zinc-600">{u.username}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${roleStyles[u.role]}`}>
                    {u.role}
                  </span>
                </td>
                <td className="px-4 py-3 text-zinc-600">{u.joined}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setEditUser(u)}
                      className="rounded-lg border border-zinc-200 p-1.5 text-zinc-500 hover:bg-zinc-50"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(u.id)}
                      className={`rounded-lg border p-1.5 transition-colors ${
                        deleteConfirmId === u.id
                          ? 'border-red-500 bg-red-500 text-white'
                          : 'border-zinc-200 text-red-500 hover:bg-red-50'
                      }`}
                      title={deleteConfirmId === u.id ? 'Clic nuevamente para confirmar' : 'Eliminar'}
                    >
                      {deleteConfirmId === u.id ? <span className="text-xs font-medium px-1">¿Seguro?</span> : <Trash2 className="h-4 w-4" />}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {newOpen && (
        <UserModal
          onClose={() => setNewOpen(false)}
          onSave={(u) => {
            setUsers((prev) => [...prev, u]);
            setNewOpen(false);
          }}
        />
      )}
      {editUser && (
        <UserModal
          user={editUser}
          onClose={() => setEditUser(null)}
          onSave={(u) => {
            setUsers((prev) => prev.map((x) => (x.id === u.id ? u : x)));
            setEditUser(null);
          }}
        />
      )}
    </div>
  );
}

function UserModal({
  user,
  onClose,
  onSave,
}: {
  user?: User;
  onClose: () => void;
  onSave: (u: User) => void;
}) {
  const [name, setName] = useState(user?.name ?? '');
  const [username, setUsername] = useState(user?.username ?? '');
  const [password, setPassword] = useState(user?.password ?? '');
  const [role, setRole] = useState<User['role']>(user?.role ?? 'Vendedora');
  const [joined, setJoined] = useState(user?.joined ?? '2026-08-29');

  const inputCls = 'w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-700 focus:border-[#D96B52] focus:outline-none focus:ring-1 focus:ring-[#D96B52]';

  const handleSave = () => {
    onSave({
      id: user?.id ?? `u${Date.now()}`,
      name: name || 'Usuario',
      username: username || 'usuario',
      password: password || '12345',
      role,
      joined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-zinc-900">
            {user ? 'Editar usuario' : 'Nuevo usuario'}
          </h3>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-5 space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-600">Nombre completo</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="ej. Dra. Camila Soto" className={inputCls} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-600">Nombre de usuario</label>
            <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="ej. camila_doc" className={inputCls} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-600">Contraseña</label>
            <input type="text" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Contraseña de acceso" className={inputCls} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-600">Rol</label>
            <select value={role} onChange={(e) => setRole(e.target.value as User['role'])} className={inputCls}>
              <option value="Administrador">Administrador</option>
              <option value="Doctora">Doctora</option>
              <option value="Vendedora">Vendedora</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-600">Fecha de alta</label>
            <input type="date" value={joined} onChange={(e) => setJoined(e.target.value)} className={inputCls} />
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
