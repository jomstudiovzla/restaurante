import { useStore, AppView, UserRole } from '@/stores/useStore';
import { 
  UtensilsCrossed, ChefHat, CreditCard, Package, Users, Settings,
  QrCode, ShieldCheck, UserPlus, Scissors, Building2, Network
} from 'lucide-react';

const roleViews: Record<UserRole, { view: AppView; label: string; icon: React.ReactNode }[]> = {
  cliente: [
    { view: 'menu', label: 'Menú', icon: <UtensilsCrossed className="w-5 h-5" /> },
  ],
  cocinero: [
    { view: 'miseenplace', label: 'Mise en Place', icon: <Scissors className="w-5 h-5" /> },
    { view: 'kitchen', label: 'Comandas', icon: <ChefHat className="w-5 h-5" /> },
  ],
  cajero: [
    { view: 'pos', label: 'POS', icon: <CreditCard className="w-5 h-5" /> },
    { view: 'kitchen', label: 'Cocina', icon: <ChefHat className="w-5 h-5" /> },
  ],
  admin: [
    { view: 'menu', label: 'Menú', icon: <UtensilsCrossed className="w-5 h-5" /> },
    { view: 'miseenplace', label: 'Mise en Place', icon: <Scissors className="w-5 h-5" /> },
    { view: 'kitchen', label: 'Comandas', icon: <ChefHat className="w-5 h-5" /> },
    { view: 'pos', label: 'POS', icon: <CreditCard className="w-5 h-5" /> },
    { view: 'inventory', label: 'Inventario', icon: <Package className="w-5 h-5" /> },
    { view: 'crm', label: 'CRM', icon: <Users className="w-5 h-5" /> },
    { view: 'onboarding', label: 'Setup', icon: <Network className="w-5 h-5" /> },
    { view: 'saas', label: 'Suscripción', icon: <Building2 className="w-5 h-5" /> },
    { view: 'auth', label: 'Usuarios', icon: <UserPlus className="w-5 h-5" /> },
    { view: 'admin', label: 'Admin', icon: <Settings className="w-5 h-5" /> },
  ],
};

const roleLabels: Record<UserRole, { label: string; color: string }> = {
  cliente: { label: 'Comensal', color: 'bg-emerald-500' },
  cocinero: { label: 'Cocina', color: 'bg-primary' },
  cajero: { label: 'Cajero', color: 'bg-blue-500' },
  admin: { label: 'Admin', color: 'bg-purple-500' },
};

export function Navigation() {
  const { currentView, setView, currentRole, setRole, currentMesa } = useStore();
  const views = roleViews[currentRole];
  const roleInfo = roleLabels[currentRole];
  
  return (
    <header className="bg-slate-900 text-white sticky top-0 z-40 shadow-xl">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700/50">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <QrCode className="w-6 h-6 text-white" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-slate-900 animate-pulse" />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tight bg-primary bg-clip-text text-transparent">
              ANTIGRAVITY
            </h1>
            <p className="text-[10px] text-slate-400 tracking-widest uppercase">Restaurante QR en Tiempo Real</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {currentRole === 'cliente' && (
            <div className="text-right mr-2">
              <div className="text-xs text-slate-400">Mesa Activa</div>
              <div className="text-xl font-black text-primary">#{currentMesa}</div>
            </div>
          )}
          
          <div className="flex items-center gap-1 bg-slate-800 rounded-lg p-1">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-500 ml-1" />
            <select
              value={currentRole}
              onChange={(e) => {
                const role = e.target.value as UserRole;
                setRole(role);
                setView(roleViews[role][0].view);
              }}
              className="bg-transparent text-xs font-semibold text-slate-300 outline-none cursor-pointer pr-1 py-1"
            >
              <option value="cliente" className="bg-slate-800">🍽️ Comensal</option>
              <option value="cocinero" className="bg-slate-800">👨‍🍳 Cocina</option>
              <option value="cajero" className="bg-slate-800">💳 Cajero</option>
              <option value="admin" className="bg-slate-800">⚙️ Admin</option>
            </select>
          </div>
          
          <span className={`${roleInfo.color} text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider`}>
            {roleInfo.label}
          </span>
        </div>
      </div>
      
      {/* Navigation tabs */}
      {views.length > 1 && (
        <nav className="flex overflow-x-auto scrollbar-hide">
          {views.map((item) => (
            <button
              key={item.view}
              onClick={() => setView(item.view)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-all duration-200 border-b-2 ${
                currentView === item.view
                  ? 'border-primary text-primary bg-primary/5'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>
      )}
    </header>
  );
}
