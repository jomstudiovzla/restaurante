import { useStore } from '@/stores/useStore';
import { Package, AlertTriangle, TrendingDown, ArrowUpRight, Search, RefreshCw, Scale, Boxes, Plus, Minus, FileText, Camera } from 'lucide-react';
import { useState, useRef } from 'react';

export function InventoryView() {
  const { 
    almacen, 
    movimientosLog, 
    registroMermas, 
    ingresarMercancia, 
    extraerAlmacen 
  } = useStore();
  
  const [activeTab, setActiveTab] = useState<'almacen' | 'ingreso' | 'salida' | 'auditoria'>('almacen');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Forms state
  const [selectedItem, setSelectedItem] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [fotoUrl, setFotoUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredItems = almacen.filter(item =>
    item.Nombre_Ingrediente.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.ID_Ingrediente.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.Proveedor.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const lowStockCount = almacen.filter(i => i.Stock_Gramos <= i.Stock_Minimo).length;
  const criticalCount = almacen.filter(i => i.Stock_Gramos <= i.Stock_Minimo * 0.5).length;
  const totalValue = almacen.reduce((sum, i) => sum + (i.Stock_Gramos * i.Costo_Gramo), 0);
  
  const getStockPercentage = (current: number, min: number) => {
    const max = min * 5; 
    return Math.min(100, (current / max) * 100);
  };
  
  const getStockColor = (current: number, min: number) => {
    if (current <= min * 0.5) return { bar: 'bg-red-500', text: 'text-red-400', badge: 'bg-red-500/15 text-red-400 border-red-500/20' };
    if (current <= min) return { bar: 'bg-primary', text: 'text-primary', badge: 'bg-primary/15 text-primary border-primary/20' };
    return { bar: 'bg-emerald-500', text: 'text-emerald-400', badge: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20' };
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setFotoUrl(url);
    }
  };

  const handleIngreso = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem || !cantidad) return;
    ingresarMercancia(selectedItem, parseFloat(cantidad), 'Admin', fotoUrl);
    setSelectedItem('');
    setCantidad('');
    setFotoUrl('');
    alert('Ingreso registrado con éxito');
  };

  const handleSalida = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem || !cantidad) return;
    extraerAlmacen(selectedItem, parseFloat(cantidad), 'Admin');
    setSelectedItem('');
    setCantidad('');
    alert('Salida hacia cocina registrada');
  };

  return (
    <div className="min-h-screen bg-slate-950 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Package className="w-7 h-7 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white">Almacén Principal</h2>
            <p className="text-xs text-slate-400">Control en Tiempo Real al Gramo</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 mb-6 bg-slate-900/50 p-1.5 rounded-xl border border-slate-800">
        {[
          { id: 'almacen', label: 'Stock en Vivo', icon: Boxes },
          { id: 'ingreso', label: 'Recepción', icon: Plus },
          { id: 'salida', label: 'Extracción', icon: Minus },
          { id: 'auditoria', label: 'Auditoría', icon: FileText }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all flex-1 justify-center
              ${activeTab === tab.id 
                ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}
          >
            <tab.icon className="w-4 h-4" />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {activeTab === 'almacen' && (
        <>
          {/* KPI Summary */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Boxes className="w-4 h-4 text-purple-400" />
                <span className="text-xs text-purple-400 font-medium">Ingredientes</span>
              </div>
              <div className="text-2xl font-black text-white">{almacen.length}</div>
            </div>
            
            <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-500/20 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Scale className="w-4 h-4 text-emerald-400" />
                <span className="text-xs text-emerald-400 font-medium">Valor Total</span>
              </div>
              <div className="text-2xl font-black text-white">${totalValue.toFixed(0)}</div>
            </div>
            
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown className="w-4 h-4 text-primary" />
                <span className="text-xs text-primary font-medium">Stock Bajo</span>
              </div>
              <div className="text-2xl font-black text-white">{lowStockCount}</div>
            </div>
            
            <div className="bg-gradient-to-br from-red-500/10 to-red-600/5 border border-red-500/20 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <span className="text-xs text-red-400 font-medium">Críticos</span>
              </div>
              <div className="text-2xl font-black text-white">{criticalCount}</div>
            </div>
          </div>

          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Buscar ingrediente..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-800/80 text-white text-sm rounded-xl pl-10 pr-4 py-2.5 outline-none border border-slate-700/50 focus:border-purple-500/50"
            />
          </div>

          <div className="space-y-2">
            {filteredItems.map(item => {
              const colors = getStockColor(item.Stock_Gramos, item.Stock_Minimo);
              const pct = getStockPercentage(item.Stock_Gramos, item.Stock_Minimo);
              
              return (
                <div key={item.ID_Ingrediente} className="bg-slate-800/40 border border-slate-700/30 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-white font-bold text-sm">{item.Nombre_Ingrediente}</span>
                        {item.Stock_Gramos <= item.Stock_Minimo && (
                          <AlertTriangle className="w-3.5 h-3.5 text-primary" />
                        )}
                      </div>
                      <span className="text-slate-500 text-xs font-mono">{item.ID_Ingrediente}</span>
                    </div>
                    <div className="text-right">
                      <span className={`${colors.text} font-black text-xl`}>
                        {item.Stock_Gramos.toLocaleString()}g
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-700/50 rounded-full h-1.5 mb-2">
                    <div className={`${colors.bar} h-1.5 rounded-full transition-all duration-500`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {activeTab === 'ingreso' && (
        <div className="max-w-2xl mx-auto bg-slate-800/40 border border-slate-700/30 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">Recepción de Mercancía (Ingreso)</h3>
          <form onSubmit={handleIngreso} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Ingrediente</label>
              <select 
                value={selectedItem} 
                onChange={e => setSelectedItem(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white"
                required
              >
                <option value="">Seleccionar ingrediente...</option>
                {almacen.map(i => <option key={i.ID_Ingrediente} value={i.ID_Ingrediente}>{i.Nombre_Ingrediente}</option>)}
              </select>
            </div>
            
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Cantidad (Gramos/Mililitros)</label>
              <input 
                type="number" 
                value={cantidad} 
                onChange={e => setCantidad(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white"
                placeholder="Ej. 5000"
                required
                min="1"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Foto de Báscula o Factura (Obligatorio)</label>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-32 border-2 border-dashed border-slate-600 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-purple-500/50 hover:bg-purple-500/5 transition-all overflow-hidden"
              >
                {fotoUrl ? (
                  <img src={fotoUrl} alt="Evidencia" className="h-full w-full object-cover" />
                ) : (
                  <>
                    <Camera className="w-8 h-8 text-slate-500 mb-2" />
                    <span className="text-sm text-slate-400">Clic para subir foto local</span>
                  </>
                )}
              </div>
              <input 
                type="file" 
                accept="image/*"
                ref={fileInputRef} 
                onChange={handlePhotoUpload} 
                className="hidden" 
                required 
              />
            </div>

            <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-xl transition-colors">
              Registrar Ingreso
            </button>
          </form>
        </div>
      )}

      {activeTab === 'salida' && (
        <div className="max-w-2xl mx-auto bg-slate-800/40 border border-slate-700/30 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">Extracción a Cocina (Salida)</h3>
          <p className="text-sm text-slate-400 mb-6">Registra la materia prima que se traslada a la zona de Mise en Place o Producción.</p>
          <form onSubmit={handleSalida} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Ingrediente</label>
              <select 
                value={selectedItem} 
                onChange={e => setSelectedItem(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white"
                required
              >
                <option value="">Seleccionar ingrediente...</option>
                {almacen.map(i => <option key={i.ID_Ingrediente} value={i.ID_Ingrediente}>{i.Nombre_Ingrediente} (Disp: {i.Stock_Gramos}g)</option>)}
              </select>
            </div>
            
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Cantidad a Extraer (Gramos/Mililitros)</label>
              <input 
                type="number" 
                value={cantidad} 
                onChange={e => setCantidad(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white"
                placeholder="Ej. 2000"
                required
                min="1"
              />
            </div>

            <button type="submit" className="w-full bg-primary hover:bg-orange-500 text-white font-bold py-3 rounded-xl transition-colors">
              Registrar Salida
            </button>
          </form>
        </div>
      )}

      {activeTab === 'auditoria' && (
        <div className="space-y-6">
          <div className="bg-slate-800/40 border border-slate-700/30 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">Registro de Mermas y Diferencias</h3>
            {registroMermas.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-sm">No hay mermas registradas hoy.</div>
            ) : (
              <div className="space-y-3">
                {registroMermas.map(m => (
                  <div key={m.ID_Merma} className="bg-slate-900/50 p-4 rounded-xl border border-slate-700 flex justify-between items-center">
                    <div>
                      <div className="text-white font-semibold">{m.Nombre}</div>
                      <div className="text-red-400 text-xs">Motivo: {m.Motivo}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-red-500 font-bold">-{m.Cantidad} {m.Unidad}</div>
                      <div className="text-slate-500 text-xs">{new Date(m.Fecha_Hora).toLocaleTimeString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-slate-800/40 border border-slate-700/30 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">Últimos Movimientos</h3>
            <div className="space-y-3">
              {movimientosLog.map(m => (
                <div key={m.ID_Movimiento} className="bg-slate-900/50 p-4 rounded-xl border border-slate-700 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      m.Tipo === 'INGRESO_ALMACEN' ? 'bg-emerald-500/20 text-emerald-400' :
                      m.Tipo === 'SALIDA_ALMACEN' ? 'bg-orange-500/20 text-orange-400' :
                      m.Tipo === 'MERMA' ? 'bg-red-500/20 text-red-400' :
                      m.Tipo === 'VENTA' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-purple-500/20 text-purple-400'
                    }`}>
                      {m.Tipo === 'INGRESO_ALMACEN' ? <Plus className="w-4 h-4" /> : 
                       m.Tipo === 'SALIDA_ALMACEN' ? <Minus className="w-4 h-4" /> : 
                       <RefreshCw className="w-4 h-4" />}
                    </div>
                    <div>
                      <div className="text-white font-medium text-sm">{m.Tipo.replace(/_/g, ' ')}</div>
                      <div className="text-slate-400 text-xs">{m.Nombre_Item}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-bold">{m.Cantidad} {m.Unidad}</div>
                    <div className="text-slate-500 text-xs">{new Date(m.Fecha_Hora).toLocaleTimeString()}</div>
                  </div>
                </div>
              ))}
              {movimientosLog.length === 0 && (
                <div className="text-center py-8 text-slate-500 text-sm">No hay movimientos recientes.</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
