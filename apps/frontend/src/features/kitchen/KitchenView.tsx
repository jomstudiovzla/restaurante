import { useState } from 'react';
import { useStore, OrderStatus } from '@/stores/useStore';
import { ChefHat, Clock, CheckCircle2, Truck, XCircle, Timer, Flame } from 'lucide-react';

const statusConfig: Record<OrderStatus, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  PENDIENTE: { label: 'Pendiente', color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/30', icon: <Clock className="w-5 h-5" /> },
  EN_PREPARACION: { label: 'En Preparación', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/30', icon: <Flame className="w-5 h-5" /> },
  LISTO: { label: 'Listo', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30', icon: <CheckCircle2 className="w-5 h-5" /> },
  ENTREGADO: { label: 'Entregado', color: 'text-slate-400', bg: 'bg-slate-500/10 border-slate-500/30', icon: <Truck className="w-5 h-5" /> },
  CANCELADO: { label: 'Cancelado', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/30', icon: <XCircle className="w-5 h-5" /> },
};

const nextStatus: Partial<Record<OrderStatus, OrderStatus>> = {
  PENDIENTE: 'EN_PREPARACION',
  EN_PREPARACION: 'LISTO',
  LISTO: 'ENTREGADO',
};

function getTimeSince(timestamp: string): string {
  const diff = Date.now() - new Date(timestamp).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Hace un momento';
  if (mins < 60) return `Hace ${mins} min`;
  return `Hace ${Math.floor(mins / 60)}h ${mins % 60}m`;
}

export function KitchenView() {
  const { orders, updateOrderStatus, estaciones } = useStore();
  const [selectedEstacionId, setSelectedEstacionId] = useState<string>('all');
  
  const selectedEstacion = estaciones.find(e => e.ID_Estacion === selectedEstacionId);
  
  // Filtrar comandas según la estación seleccionada
  const processOrders = (ordersList: typeof orders) => {
    return ordersList
      .map(order => {
        // Si hay una estación seleccionada, filtramos los ítems de la orden
        if (selectedEstacion) {
          const filteredItems = order.items.filter(item => 
            selectedEstacion.Categorias.includes(item.dish.Categoria)
          );
          return { ...order, items: filteredItems };
        }
        return order;
      })
      .filter(order => order.items.length > 0); // Solo mantener órdenes que tengan ítems para esta estación
  };

  const activeOrders = processOrders(orders.filter(o => o.status !== 'ENTREGADO' && o.status !== 'CANCELADO'));
  const completedOrders = processOrders(orders.filter(o => o.status === 'ENTREGADO'));
  
  return (
    <div className="min-h-screen bg-slate-950 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
            <ChefHat className="w-7 h-7 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white">Panel de Producción</h2>
            <p className="text-xs text-slate-400">Comandas en tiempo real • {activeOrders.length} activas</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <select
            value={selectedEstacionId}
            onChange={(e) => setSelectedEstacionId(e.target.value)}
            className="bg-slate-800 text-slate-200 border border-slate-700 text-sm rounded-lg focus:ring-primary focus:border-primary block p-2"
          >
            <option value="all">🌐 Todas las estaciones</option>
            {estaciones.map(est => (
              <option key={est.ID_Estacion} value={est.ID_Estacion}>
                🖨️ {est.Nombre} (IP: {est.Direccion_IP})
              </option>
            ))}
          </select>
          <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium">
            <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse" />
            En Vivo
          </div>
        </div>
      </div>

      {/* Status summary */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {(['PENDIENTE', 'EN_PREPARACION', 'LISTO'] as OrderStatus[]).map(status => {
          const count = orders.filter(o => o.status === status).length;
          const cfg = statusConfig[status];
          return (
            <div key={status} className={`${cfg.bg} border rounded-xl p-3 text-center`}>
              <div className={`${cfg.color} text-2xl font-black`}>{count}</div>
              <div className={`${cfg.color} text-[10px] font-semibold uppercase tracking-wider`}>{cfg.label}</div>
            </div>
          );
        })}
      </div>

      {/* Active orders */}
      <div className="space-y-4 mb-8">
        {activeOrders.length === 0 ? (
          <div className="text-center py-16 text-slate-500">
            <ChefHat className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-semibold">Sin comandas activas</p>
            <p className="text-sm">Las órdenes aparecerán aquí en tiempo real</p>
          </div>
        ) : (
          activeOrders.map(order => {
            const cfg = statusConfig[order.status];
            const next = nextStatus[order.status];
            
            return (
              <div key={order.id} className={`${cfg.bg} border rounded-2xl overflow-hidden`}>
                {/* Order header */}
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`${cfg.color} flex items-center gap-2`}>
                      {cfg.icon}
                      <span className="font-bold text-sm uppercase">{cfg.label}</span>
                    </div>
                    <span className="text-slate-500 text-xs">|</span>
                    <span className="text-white font-black text-lg">Mesa #{order.mesa}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400 text-xs">
                    <Timer className="w-3.5 h-3.5" />
                    {getTimeSince(order.timestamp)}
                  </div>
                </div>
                
                {/* Order items */}
                <div className="px-4 pb-3 space-y-2">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-slate-900/40 rounded-lg px-3 py-2">
                      <div className="flex items-center gap-2">
                        <span className="text-primary font-black text-lg">{item.quantity}×</span>
                        <span className="text-white font-medium text-sm">{item.dish.Nombre_Plato}</span>
                      </div>
                      <span className="text-slate-400 text-xs">{item.dish.Tiempo_Preparacion}</span>
                    </div>
                  ))}
                </div>
                
                {/* Order ID & actions */}
                <div className="px-4 pb-4 flex items-center justify-between">
                  <span className="text-slate-500 text-xs font-mono">{order.id}</span>
                  <div className="flex gap-2">
                    {order.status !== 'CANCELADO' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'CANCELADO')}
                        className="px-3 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-semibold transition-colors border border-red-500/20"
                      >
                        Cancelar
                      </button>
                    )}
                    {next && (
                      <button
                        onClick={() => updateOrderStatus(order.id, next)}
                        className="px-4 py-2 rounded-lg bg-primary hover:bg-primary text-on-primary text-sm font-bold transition-colors shadow-lg shadow-primary/20 active:scale-95"
                      >
                        {next === 'EN_PREPARACION' && '🔥 Comenzar'}
                        {next === 'LISTO' && '✅ Listo'}
                        {next === 'ENTREGADO' && '🚀 Entregar'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Completed */}
      {completedOrders.length > 0 && (
        <div>
          <h3 className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-3">Historial Completado</h3>
          <div className="space-y-2">
            {completedOrders.map(order => (
              <div key={order.id} className="bg-slate-800/30 border border-slate-700/20 rounded-xl p-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500/50" />
                  <span className="text-slate-400 text-sm font-medium">Mesa #{order.mesa}</span>
                  <span className="text-slate-600 text-xs">{order.items.length} items</span>
                </div>
                <span className="text-slate-500 text-xs font-mono">{order.id}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
