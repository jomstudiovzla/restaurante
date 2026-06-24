import { useState } from 'react';
import { UserPlus, Shield, CheckCircle2, AlertTriangle, Key } from 'lucide-react';

export function AdminAuthView() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'mesero' | 'cocinero' | 'cajero'>('mesero');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    // Simulating Firebase Callable function
    setTimeout(() => {
      setStatus('success');
      setTimeout(() => setStatus('idle'), 3000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-950 p-4 flex flex-col items-center pt-10">
      {/* Header */}
      <div className="w-[400px] max-w-[90vw] flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center border border-primary/30 shadow-lg shadow-primary/10">
          <Shield className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-black text-white">Seguridad RBAC</h2>
          <p className="text-xs text-slate-400">Creación exclusiva por Administrador</p>
        </div>
      </div>

      {/* Form Card */}
      <div className="w-[400px] max-w-[90vw] bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
        
        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
          <UserPlus className="w-5 h-5 text-primary" />
          Registrar Empleado
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Nombre Completo</label>
            <input 
              required
              type="text" 
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary/50 outline-none transition-all"
              placeholder="Ej. Carlos Mendoza"
            />
          </div>
          
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Correo Electrónico</label>
            <input 
              required
              type="email" 
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary/50 outline-none transition-all"
              placeholder="carlos@restaurante.com"
            />
          </div>
          
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Rol de Acceso (RBAC)</label>
            <select 
              value={role}
              onChange={e => setRole(e.target.value as any)}
              className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary/50 outline-none transition-all appearance-none cursor-pointer"
            >
              <option value="mesero">Mesero (App Comandas)</option>
              <option value="cocinero">Cocinero (Kitchen Display)</option>
              <option value="cajero">Cajero (Terminal POS)</option>
            </select>
          </div>
          
          {/* Default Password Notice */}
          <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700 flex items-start gap-3 mt-6">
            <Key className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <p className="text-xs text-slate-400 leading-relaxed">
              El usuario recibirá una contraseña temporal predeterminada segura, la cual deberá cambiar en su primer inicio de sesión.
            </p>
          </div>

          <button 
            disabled={status === 'loading'}
            type="submit"
            className="w-full mt-6 bg-primary hover:bg-primary/90 text-on-primary font-bold rounded-xl py-3.5 shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:active:scale-100"
          >
            {status === 'loading' ? (
              <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
            ) : status === 'success' ? (
              <><CheckCircle2 className="w-5 h-5" /> Usuario Creado</>
            ) : (
              <><UserPlus className="w-5 h-5" /> Generar Credenciales</>
            )}
          </button>
        </form>
      </div>

      {/* Info */}
      <div className="w-[400px] max-w-[90vw] mt-6 bg-red-500/5 border border-red-500/20 rounded-2xl p-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
        <div>
          <h4 className="text-red-400 text-xs font-bold uppercase tracking-wider mb-1">Zona Restringida</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Esta acción se conecta al caso de uso <strong>createUserUseCase</strong> en el Backend. 
            El Middleware rechaza cualquier petición cuyo JWT no contenga el Custom Claim <code>role: 'admin'</code>.
          </p>
        </div>
      </div>
    </div>
  );
}
