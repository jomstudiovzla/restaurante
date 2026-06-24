import { useStore } from '@/stores/useStore';
import { menuItems, recetas } from '@/data/menu';
import { 
  Settings, Database, Shield, GitBranch, Server, FileCode, 
  FolderTree, Lock, AlertTriangle, CheckCircle2, Zap, Globe,
  Monitor, Smartphone, Wifi, HardDrive
} from 'lucide-react';

export function AdminView() {
  const { orders, almacen, ventasLog } = useStore();
  
  const systemChecks = [
    { name: 'Firebase Firestore', status: 'online', detail: 'Latencia: 12ms', icon: <Zap className="w-4 h-4" /> },
    { name: 'Python Backend', status: 'online', detail: 'Uptime: 99.97%', icon: <Server className="w-4 h-4" /> },
    { name: 'Google Sheets API', status: 'online', detail: 'Quota: 72% disponible', icon: <Database className="w-4 h-4" /> },
    { name: 'Pasarela de Pagos (Stripe)', status: 'standby', detail: 'Modo sandbox', icon: <Shield className="w-4 h-4" /> },
    { name: 'CDN / Assets', status: 'online', detail: 'Cache hit: 94%', icon: <Globe className="w-4 h-4" /> },
    { name: 'QR Token Validator', status: 'online', detail: 'Tokens activos: 12', icon: <Lock className="w-4 h-4" /> },
  ];
  
  const folderStructure = [
    { path: 'frontend/', type: 'dir', desc: 'Capa de Interfaz (Feature-Sliced Design)' },
    { path: '  ├── features/menu/', type: 'dir', desc: 'Renderizado del catálogo interactivo' },
    { path: '  ├── features/cart/', type: 'dir', desc: 'Máquina de estados del carrito' },
    { path: '  ├── features/checkout/', type: 'dir', desc: 'Confirmación y split de cuentas' },
    { path: '  ├── entities/dish/', type: 'dir', desc: 'Modelo de plato (alérgenos, precios)' },
    { path: '  └── shared/', type: 'dir', desc: 'Componentes reutilizables' },
    { path: 'backend_python/', type: 'dir', desc: 'Clean Architecture - Servidor API' },
    { path: '  ├── src/core/', type: 'dir', desc: 'Lógica de dominio pura' },
    { path: '  │   └── inventory_engine.py', type: 'file', desc: 'Algoritmia de deducción de gramos' },
    { path: '  ├── src/infrastructure/', type: 'dir', desc: 'Adaptadores externos I/O' },
    { path: '  │   ├── google_sheets.py', type: 'file', desc: 'Cliente gspread + OAuth' },
    { path: '  │   └── firebase_db.py', type: 'file', desc: 'Listeners de Firestore' },
    { path: '  └── src/web/routes.py', type: 'file', desc: 'Endpoints FastAPI' },
    { path: 'firebase/', type: 'dir', desc: 'Configuraciones cloud' },
    { path: '  ├── config.js', type: 'file', desc: 'Configuración pública Firebase' },
    { path: '  └── rules.firestore', type: 'file', desc: 'Reglas de seguridad RBAC' },
  ];
  
  return (
    <div className="min-h-screen bg-slate-950 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-slate-500 to-slate-700 rounded-2xl flex items-center justify-center shadow-lg">
            <Settings className="w-7 h-7 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white">Panel Administrativo</h2>
            <p className="text-xs text-slate-400">Arquitectura del Sistema & Monitoreo</p>
          </div>
        </div>
        <span className="text-xs font-mono text-slate-500 bg-slate-800 px-2 py-1 rounded">v2.0.0-alpha</span>
      </div>

      {/* Architecture Overview */}
      <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 border border-slate-700/40 rounded-2xl p-5 mb-6">
        <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
          <GitBranch className="w-4 h-4 text-primary" />
          Arquitectura Híbrida de Dos Capas
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-blue-400" />
              <span className="text-blue-400 font-bold text-xs uppercase tracking-wider">Capa 1: Transaccional</span>
            </div>
            <h4 className="text-white font-semibold text-sm mb-1">Firebase Firestore</h4>
            <p className="text-slate-400 text-xs leading-relaxed">
              Gestiona el flujo de pedidos, estado de mesas y comandas de cocina 
              en milisegundos con cero latencia. Alta concurrencia sin cuellos de botella.
            </p>
            <div className="mt-3 flex items-center gap-2 text-xs">
              <span className="bg-blue-500/15 text-blue-400 px-2 py-0.5 rounded-full border border-blue-500/20">Real-time</span>
              <span className="bg-blue-500/15 text-blue-400 px-2 py-0.5 rounded-full border border-blue-500/20">WebSocket</span>
              <span className="bg-blue-500/15 text-blue-400 px-2 py-0.5 rounded-full border border-blue-500/20">NoSQL</span>
            </div>
          </div>
          
          <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Database className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-400 font-bold text-xs uppercase tracking-wider">Capa 2: Analítica</span>
            </div>
            <h4 className="text-white font-semibold text-sm mb-1">Python + Google Sheets</h4>
            <p className="text-slate-400 text-xs leading-relaxed">
              Servicio asíncrono que procesa matemática de costos, recetas y 
              deducción de existencias. Puente "agresivo" controlado contra la API de Sheets.
            </p>
            <div className="mt-3 flex items-center gap-2 text-xs">
              <span className="bg-emerald-500/15 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20">gspread</span>
              <span className="bg-emerald-500/15 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20">FastAPI</span>
              <span className="bg-emerald-500/15 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20">Async</span>
            </div>
          </div>
        </div>
      </div>

      {/* System Health */}
      <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
        <Monitor className="w-4 h-4 text-emerald-400" />
        Estado de Servicios
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mb-6">
        {systemChecks.map((check) => (
          <div key={check.name} className="bg-slate-800/40 border border-slate-700/30 rounded-xl p-3 flex items-center gap-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              check.status === 'online' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-primary/15 text-primary'
            }`}>
              {check.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-white text-xs font-semibold truncate">{check.name}</div>
              <div className="text-slate-500 text-[10px]">{check.detail}</div>
            </div>
            <div className={`w-2.5 h-2.5 rounded-full ${
              check.status === 'online' ? 'bg-emerald-400 animate-pulse' : 'bg-primary'
            }`} />
          </div>
        ))}
      </div>

      {/* Data Stats */}
      <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
        <HardDrive className="w-4 h-4 text-purple-400" />
        Estadísticas de Datos (Google Sheets DB)
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-6">
        {[
          { sheet: 'Menu', rows: menuItems.length, color: 'amber' },
          { sheet: 'Almacen', rows: almacen.length, color: 'purple' },
          { sheet: 'Recetas', rows: recetas.length, color: 'blue' },
          { sheet: 'Ventas_Log', rows: ventasLog.length + orders.length, color: 'emerald' },
          { sheet: 'CRM_Clientes', rows: 5, color: 'pink' },
        ].map(s => (
          <div key={s.sheet} className={`bg-slate-800/40 border border-slate-700/30 rounded-xl p-3 text-center`}>
            <div className="text-xl font-black text-white">{s.rows}</div>
            <div className={`text-${s.color}-400 text-[10px] font-semibold uppercase tracking-wider`}>{s.sheet}</div>
          </div>
        ))}
      </div>

      {/* Security RBAC */}
      <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
        <Shield className="w-4 h-4 text-red-400" />
        Control de Acceso RBAC
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6">
        {[
          { role: 'Administrador', perms: 'Acceso total al sistema', color: 'purple', icon: '⚙️' },
          { role: 'Cajero/POS', perms: 'Gestión de cuentas y cierres', color: 'blue', icon: '💳' },
          { role: 'Cocinero', perms: 'Panel visualizador de comandas', color: 'orange', icon: '👨‍🍳' },
          { role: 'Comensal', perms: 'Menú y envío de comandas', color: 'emerald', icon: '🍽️' },
        ].map(r => (
          <div key={r.role} className={`bg-slate-800/40 border border-slate-700/30 rounded-xl p-3 flex items-center gap-3`}>
            <span className="text-2xl">{r.icon}</span>
            <div>
              <div className="text-white text-sm font-bold">{r.role}</div>
              <div className="text-slate-400 text-xs">{r.perms}</div>
            </div>
            <CheckCircle2 className="w-4 h-4 text-emerald-400 ml-auto" />
          </div>
        ))}
      </div>

      {/* Folder Structure */}
      <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
        <FolderTree className="w-4 h-4 text-primary" />
        Topología del Monorepo
      </h3>
      <div className="bg-slate-800/40 border border-slate-700/30 rounded-2xl p-4 font-mono text-xs overflow-x-auto mb-6">
        {folderStructure.map((item, i) => (
          <div key={i} className="flex items-center gap-2 py-0.5">
            {item.type === 'dir' ? (
              <FolderTree className="w-3 h-3 text-primary shrink-0" />
            ) : (
              <FileCode className="w-3 h-3 text-blue-400 shrink-0" />
            )}
            <span className={item.type === 'dir' ? 'text-primary' : 'text-blue-400'}>{item.path}</span>
            <span className="text-slate-600 text-[10px]">— {item.desc}</span>
          </div>
        ))}
      </div>

      {/* Security Notices */}
      <div className="space-y-3">
        <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-red-400 font-bold text-xs uppercase tracking-wider mb-1">PCI-DSS Compliance</h4>
            <p className="text-slate-400 text-xs leading-relaxed">
              Prohibido almacenar números de tarjeta en Firebase, localStorage o Google Sheets. 
              Solo tokens de validación de pasarelas externas (Stripe, PayPal, MercadoPago).
            </p>
          </div>
        </div>
        
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-start gap-3">
          <Lock className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <div>
            <h4 className="text-primary font-bold text-xs uppercase tracking-wider mb-1">Mitigación QRLjacking</h4>
            <p className="text-slate-400 text-xs leading-relaxed">
              Cada QR codifica URL dinámica con parámetros encriptados (?mesa=5&token=xyz_criptografico). 
              Validación contra backend Python con ventana de expiración temporal.
            </p>
          </div>
        </div>
      </div>

      {/* Connection Info */}
      <div className="mt-6 bg-slate-800/30 border border-slate-700/20 rounded-xl p-4">
        <h4 className="text-slate-300 font-bold text-xs uppercase tracking-wider mb-3 flex items-center gap-2">
          <Wifi className="w-4 h-4" />
          Conexión del Sistema
        </h4>
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-slate-500" />
            <span className="text-slate-400">Frontend: React + Vite + TailwindCSS</span>
          </div>
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-slate-500" />
            <span className="text-slate-400">Backend: Python 3.10+ / FastAPI</span>
          </div>
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-slate-500" />
            <span className="text-slate-400">DB Real-time: Firebase Firestore</span>
          </div>
          <div className="flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-slate-500" />
            <span className="text-slate-400">DB Analítica: Google Sheets (gspread)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
