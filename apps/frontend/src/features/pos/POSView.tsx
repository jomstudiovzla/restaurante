import { useState } from 'react';
import { useStore } from '@/stores/useStore';
import { CreditCard, DollarSign, Receipt, TrendingUp, Clock, Users, CheckCircle, Printer, ArrowUpRight, Banknote } from 'lucide-react';

export function POSView() {
  const { orders, ventasLog } = useStore();
  const [tableFilter, setTableFilter] = useState<'Todas' | 'Ocupadas' | 'Libres'>('Todas');
  
  const completedOrders = orders.filter(o => o.status === 'ENTREGADO' || o.status === 'LISTO');
  const pendingOrders = orders.filter(o => o.status === 'PENDIENTE' || o.status === 'EN_PREPARACION');
  
  const todayTotal = ventasLog.reduce((sum, v) => sum + v.Total, 0) + orders.filter(o => o.status !== 'CANCELADO').reduce((sum, o) => sum + o.total, 0);
  const avgTicket = todayTotal / Math.max(1, ventasLog.length + orders.length);
  const totalTransactions = ventasLog.length + orders.length;
  
  // Simulated table status
  const tables = Array.from({ length: 12 }, (_, i) => {
    const tableNum = i + 1;
    const hasOrder = orders.find(o => o.mesa === tableNum && o.status !== 'ENTREGADO' && o.status !== 'CANCELADO');
    return {
      number: tableNum,
      status: hasOrder ? 'ocupada' : (Math.random() > 0.6 ? 'reservada' : 'libre'),
      order: hasOrder,
    };
  });
  
  return (
    <div className="min-h-screen bg-slate-950 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
            <CreditCard className="w-7 h-7 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white">Terminal POS</h2>
            <p className="text-xs text-slate-400">Gestión de Caja y Cobros</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-slate-400">Cajero activo</div>
          <div className="text-sm font-bold text-blue-400">María G.</div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-500/20 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <span className="text-xs text-emerald-400 font-medium">Ventas Hoy</span>
          </div>
          <div className="text-2xl font-black text-white">${todayTotal.toFixed(0)}</div>
          <div className="flex items-center gap-1 text-xs text-emerald-400 mt-1">
            <ArrowUpRight className="w-3 h-3" />
            +12.5% vs ayer
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Receipt className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-blue-400 font-medium">Transacciones</span>
          </div>
          <div className="text-2xl font-black text-white">{totalTransactions}</div>
          <div className="text-xs text-slate-400 mt-1">{pendingOrders.length} pendientes</div>
        </div>
        
        <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            <span className="text-xs text-primary font-medium">Ticket Promedio</span>
          </div>
          <div className="text-2xl font-black text-white">${avgTicket.toFixed(2)}</div>
          <div className="flex items-center gap-1 text-xs text-primary mt-1">
            <ArrowUpRight className="w-3 h-3" />
            Objetivo: $25
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-purple-400" />
            <span className="text-xs text-purple-400 font-medium">Mesas Activas</span>
          </div>
          <div className="text-2xl font-black text-white">{tables.filter(t => t.status === 'ocupada').length}/12</div>
          <div className="text-xs text-slate-400 mt-1">{tables.filter(t => t.status === 'libre').length} libres</div>
        </div>
      </div>

      {/* Tables Grid Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <h3 className="text-white font-bold text-sm flex items-center gap-2">
          <span>Mapa de Mesas</span>
        </h3>
        
        {/* Table Filters */}
        <div className="flex items-center gap-2 bg-slate-800/50 p-1 rounded-xl">
          <button 
            onClick={() => setTableFilter('Todas')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${tableFilter === 'Todas' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            Todas
          </button>
          <button 
            onClick={() => setTableFilter('Ocupadas')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1 ${tableFilter === 'Ocupadas' ? 'bg-primary/20 text-primary' : 'text-slate-400 hover:text-white'}`}
          >
            <div className={`w-2 h-2 rounded-full ${tableFilter === 'Ocupadas' ? 'bg-primary' : 'bg-slate-500'}`} />
            Ocupadas
          </button>
          <button 
            onClick={() => setTableFilter('Libres')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1 ${tableFilter === 'Libres' ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-400 hover:text-white'}`}
          >
            <div className={`w-2 h-2 rounded-full ${tableFilter === 'Libres' ? 'bg-emerald-400' : 'bg-slate-500'}`} />
            Libres
          </button>
        </div>
      </div>
      
      {(() => {
        const filteredTables = tables.filter(t => {
          if (tableFilter === 'Ocupadas') return t.status === 'ocupada';
          if (tableFilter === 'Libres') return t.status === 'libre' || t.status === 'reservada';
          return true;
        });
        
        let gridCols = "grid-cols-4 sm:grid-cols-6";
        if (filteredTables.length <= 4) gridCols = "grid-cols-2 sm:grid-cols-4";
        else if (filteredTables.length <= 8) gridCols = "grid-cols-3 sm:grid-cols-4";

        return (
          <div className={`grid ${gridCols} gap-3 mb-6 transition-all duration-300`}>
            {filteredTables.length === 0 ? (
              <div className="col-span-full py-10 text-center text-slate-500 border border-dashed border-slate-700/50 rounded-2xl">
                No hay mesas en esta categoría.
              </div>
            ) : (
              filteredTables.map(table => (
          <button
            key={table.number}
            className={`aspect-square rounded-xl flex flex-col items-center justify-center text-center transition-all duration-200 border ${
              table.status === 'ocupada'
                ? 'bg-primary/10 border-primary hover:bg-primary/20'
                : table.status === 'reservada'
                ? 'bg-blue-500/10 border-blue-500/30 hover:bg-blue-500/20'
                : 'bg-emerald-500/5 border-emerald-500/20 hover:bg-emerald-500/10'
            }`}
          >
            <span className={`text-lg font-black ${
              table.status === 'ocupada' ? 'text-primary' : table.status === 'reservada' ? 'text-blue-400' : 'text-emerald-400'
            }`}>{table.number}</span>
            <span className="text-[9px] text-slate-500 uppercase font-medium">{table.status}</span>
            {table.order && (
              <div className="flex flex-col items-center mt-1 w-full px-1">
                <div className="flex flex-col text-center mb-1">
                  {table.order.items.slice(0, 2).map((item: any, idx: number) => (
                    <span key={idx} className="text-[8px] text-slate-300 truncate w-full">{item.quantity}x {item.dish.Nombre_Plato}</span>
                  ))}
                  {table.order.items.length > 2 && (
                    <span className="text-[8px] text-slate-500">+{table.order.items.length - 2} más</span>
                  )}
                </div>
                <span className="text-[10px] text-primary font-bold">${table.order.total.toFixed(0)}</span>
              </div>
            )}
          </button>
              ))
            )}
          </div>
        );
      })()}

      {/* Pending Orders for Checkout */}
      <h3 className="text-white font-bold text-sm mb-3">Órdenes Listas para Cobro</h3>
      <div className="space-y-3">
        {completedOrders.length === 0 ? (
          <div className="text-center py-8 text-slate-500 bg-slate-800/30 rounded-2xl border border-slate-700/20">
            <CheckCircle className="w-10 h-10 mx-auto mb-2 opacity-30" />
            <p className="text-sm font-medium">Sin órdenes pendientes de cobro</p>
          </div>
        ) : (
          completedOrders.map(order => (
            <div key={order.id} className="bg-slate-800/40 border border-slate-700/30 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="bg-primary/20 text-primary font-black text-lg px-3 py-1 rounded-lg">
                    #{order.mesa}
                  </span>
                  <div>
                    <div className="text-white font-bold text-sm">{order.customerName || `Mesa ${order.mesa}`}</div>
                    <div className="text-slate-400 text-xs flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(order.timestamp).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-white font-black text-xl">${order.total.toFixed(2)}</div>
                  <span className="text-[10px] font-mono text-slate-500">{order.id}</span>
                </div>
              </div>
              
              <div className="space-y-1 mb-3">
                {order.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-xs text-slate-400">
                    <span>{item.quantity}× {item.dish.Nombre_Plato}</span>
                    <span>${(item.dish.Precio * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              
              <div className="flex gap-2">
                <button className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-2.5 rounded-xl text-sm transition-colors flex items-center justify-center gap-2 active:scale-95">
                  <Banknote className="w-4 h-4" />
                  Efectivo
                </button>
                <button className="flex-1 bg-blue-500 hover:bg-blue-400 text-white font-bold py-2.5 rounded-xl text-sm transition-colors flex items-center justify-center gap-2 active:scale-95">
                  <CreditCard className="w-4 h-4" />
                  Tarjeta
                </button>
                <button className="w-12 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-xl flex items-center justify-center transition-colors">
                  <Printer className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
