import { useState } from 'react';
import { Sparkles, Lock, User, Eye, EyeOff } from 'lucide-react';
import type { Role } from '../types';

interface LoginProps {
  onLogin: (name: string, role: Role) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulación de autenticación (Aquí debería ir la llamada a tu API/Supabase)
    if (username === 'admin' && password === 'admin123') {
      onLogin('Administrador', 'Administrador');
    } else {
      setError('Usuario o contraseña incorrectos.');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F9FAFB] p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#D96B52]">
            <Sparkles className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-2xl font-semibold text-zinc-900">Belleza Viva</h1>
          <p className="mt-1 text-sm text-zinc-500">Ingresa con tus credenciales</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-600">Usuario</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="off"
                className="w-full rounded-lg border border-zinc-200 bg-white py-2.5 pl-9 pr-3 text-sm text-zinc-700 focus:border-[#D96B52] focus:outline-none focus:ring-1 focus:ring-[#D96B52]"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-600">Contraseña</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="off"
                className="w-full rounded-lg border border-zinc-200 bg-white py-2.5 pl-9 pr-10 text-sm text-zinc-700 focus:border-[#D96B52] focus:outline-none focus:ring-1 focus:ring-[#D96B52]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full rounded-lg bg-[#D96B52] py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#C85A32]"
          >
            Ingresar
          </button>
        </form>
      </div>
    </div>
  );
}
