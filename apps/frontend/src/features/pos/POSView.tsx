import { useState } from 'react';
import { useStore, Order } from '@/stores/useStore';
import { CreditCard, DollarSign, Receipt, TrendingUp, Clock, Users, CheckCircle, Printer, ArrowUpRight, Banknote, SplitSquareHorizontal } from 'lucide-react';
import { PaymentGateway } from '../checkout/PaymentGateway';
import { SplitBillModal } from './SplitBillModal';

export function POSView() {
  const { orders, ventasLog, updateOrderStatus, addTransaction } = useStore();
  const [tableFilter, setTableFilter] = useState<'Todas' | 'Ocupadas' | 'Libres'>('Todas');
  
  // Pending payments (orders that have not been paid yet)
  const pendingPayments = orders.filter(o => o.paymentStatus === 'PENDIENTE' && o.status !== 'CANCELADO');
  
  // Kitchen pending
  const pendingKitchen = orders.filter(o => o.status === 'PENDIENTE' || o.status === 'EN_PREPARACION');
  
  // Paid today
  const paidOrders = orders.filter(o => o.paymentStatus === 'PAGADO' || o.paymentStatus === 'PAGADO_PARCIAL');
  const todayTotal = ventasLog.reduce((sum, v) => sum + v.Total, 0) + paidOrders.reduce((sum, o) => sum + o.total, 0);
  
  const totalTransactions = ventasLog.length + paidOrders.length;
  const avgTicket = totalTransactions > 0 ? todayTotal / totalTransactions : 0;
  
  // Real table status based on orders
  const tables = Array.from({ length: 12 }, (_, i) => {
    const tableNum = i + 1;
    // Find active order for this table
    const activeOrder = orders.find(o => o.mesa === tableNum && o.status !== 'ENTREGADO' && o.status !== 'CANCELADO');
    
    return {
      number: tableNum,
      status: activeOrder ? 'ocupada' : 'libre',
      order: activeOrder,
    };
  });

  const [splitOrder, setSplitOrder] = useState<Order | null>(null);
  const [paymentOrder, setPaymentOrder] = useState<{order: Order, amount: number} | null>(null);

  const handlePaymentClick = (order: Order, amount: number) => {
    setPaymentOrder({ order, amount });
  };
  
  const [printOrder, setPrintOrder] = useState<Order | null>(null);

  const handlePrintTicket = (order: Order) => {
    setPrintOrder(order);
    setTimeout(() => {
      window.print();
    }, 100);
  };
  
  return (
    <div className="min-h-screen bg-slate-950 p-4 pb-24">
      {/* Print Receipt Section */}
      {printOrder && (
        <div className="print-receipt hidden">
          <div className="font-mono text-sm max-w-sm mx-auto bg-white text-black p-4">
            <div className="text-center mb-4">
              <h1 className="text-xl font-bold">ANTIGRAVITY RESTO</h1>
              <p className="text-xs">123 Culinary Ave, Food City</p>
              <p className="text-xs">Tel: (555) 123-4567</p>
              <div className="border-b-2 border-black border-dashed my-2"></div>
            </div>
            
            <div className="mb-4 text-xs">
              <p>Mesa: {printOrder.mesa}</p>
              <p>Orden: {printOrder.id}</p>
              <p>Fecha: {new Date(printOrder.timestamp).toLocaleString()}</p>
              {printOrder.customerName && <p>Cliente: {printOrder.customerName}</p>}
              <div className="border-b-2 border-black border-dashed my-2"></div>
            </div>

            <div className="mb-4">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-black">
                    <th className="text-left py-1">Cant</th>
                    <th className="text-left py-1">Item</th>
                    <th className="text-right py-1">Precio</th>
                  </tr>
                </thead>
                <tbody>
                  {printOrder.items.map((item, i) => (
                    <tr key={i}>
                      <td className="py-1 align-top">{item.quantity}</td>
                      <td className="py-1">{item.dish.Nombre_Plato}</td>
                      <td className="py-1 text-right">${(item.dish.Precio * item.quantity).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="border-b-2 border-black border-dashed my-2"></div>
            </div>

            <div className="text-right text-xs space-y-1 font-bold">
              <p>Subtotal: ${(printOrder.total - (printOrder.tip || 0)).toFixed(2)}</p>
              <p>Propina: ${(printOrder.tip || 0).toFixed(2)}</p>
              <p className="text-sm mt-1">TOTAL: ${printOrder.total.toFixed(2)}</p>
              <div className="border-b-2 border-black border-dashed my-2"></div>
              <p className="text-sm mt-1">RESTA: ${printOrder.balanceDue.toFixed(2)}</p>
            </div>

            <div className="text-center mt-6 text-xs">
              <p>¡Gracias por su visita!</p>
              <p>Powered by Antigravity</p>
            </div>
          </div>
        </div>
      )}

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
            <span className="text-xs text-emerald-400 font-medium">Ingresos Hoy</span>
          </div>
          <div className="text-2xl font-black text-white">${todayTotal.toFixed(2)}</div>
          <div className="flex items-center gap-1 text-xs text-emerald-400 mt-1">
            <ArrowUpRight className="w-3 h-3" />
            Ventas pagadas
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Receipt className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-blue-400 font-medium">Transacciones</span>
          </div>
          <div className="text-2xl font-black text-white">{totalTransactions}</div>
          <div className="text-xs text-slate-400 mt-1">{pendingPayments.length} por cobrar</div>
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
          <span>Mapa de Mesas en Vivo</span>
        </h3>
        
        {/* Table Filters */}
        <div className="flex items-center gap-2 bg-slate-800/50 p-1 rounded-xl border border-slate-700/50">
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
      
      {/* Tables Grid */}
      {(() => {
        const filteredTables = tables.filter(t => {
          if (tableFilter === 'Ocupadas') return t.status === 'ocupada';
          if (tableFilter === 'Libres') return t.status === 'libre';
          return true;
        });
        
        let gridCols = "grid-cols-4 sm:grid-cols-6";
        if (filteredTables.length <= 4) gridCols = "grid-cols-2 sm:grid-cols-4";
        else if (filteredTables.length <= 8) gridCols = "grid-cols-3 sm:grid-cols-4";

        return (
          <div className={`grid ${gridCols} gap-3 mb-8 transition-all duration-300`}>
            {filteredTables.length === 0 ? (
              <div className="col-span-full py-10 text-center text-slate-500 border border-dashed border-slate-700/50 rounded-2xl">
                No hay mesas en esta categoría.
              </div>
            ) : (
              filteredTables.map(table => (
                <button
                  key={table.number}
                  className={`aspect-square rounded-2xl flex flex-col items-center justify-center text-center transition-all duration-200 border-2 ${
                    table.status === 'ocupada'
                      ? 'bg-primary/10 border-primary/50 hover:bg-primary/20 hover:border-primary'
                      : 'bg-emerald-500/5 border-emerald-500/20 hover:bg-emerald-500/10'
                  }`}
                >
                  <span className={`text-2xl font-black ${
                    table.status === 'ocupada' ? 'text-primary' : 'text-emerald-400'
                  }`}>{table.number}</span>
                  <span className="text-[10px] text-slate-500 uppercase font-bold mt-1 tracking-wider">{table.status}</span>
                  {table.order && (
                    <div className="flex flex-col items-center mt-2 w-full px-2">
                      <span className="text-xs text-white font-bold bg-slate-900/80 px-2 py-0.5 rounded-full border border-slate-700">
                        ${table.order.total.toFixed(2)}
                      </span>
                      <span className="text-[9px] text-slate-400 mt-1">
                        {table.order.paymentStatus === 'PAGADO' ? 'Pagado' : 'Por cobrar'}
                      </span>
                    </div>
                  )}
                </button>
              ))
            )}
          </div>
        );
      })()}

      {/* Pending Orders for Checkout */}
      <div className="flex items-center justify-between mb-4 mt-8 pt-8 border-t border-slate-800">
        <h3 className="text-white font-bold text-lg flex items-center gap-2">
          <Banknote className="w-5 h-5 text-emerald-400" />
          Órdenes por Cobrar
        </h3>
        <span className="bg-slate-800 text-slate-300 text-xs px-2 py-1 rounded-lg font-bold border border-slate-700">
          {pendingPayments.length} pendientes
        </span>
      </div>
      
      <div className="space-y-4">
        {pendingPayments.length === 0 ? (
          <div className="text-center py-10 text-slate-500 bg-slate-800/20 rounded-2xl border border-slate-700/30">
            <CheckCircle className="w-12 h-12 mx-auto mb-3 opacity-20 text-emerald-400" />
            <p className="text-base font-medium text-slate-400">Todas las mesas están al día</p>
            <p className="text-xs mt-1">No hay cobros pendientes</p>
          </div>
        ) : (
          pendingPayments.map(order => (
            <div key={order.id} className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="bg-primary/20 text-primary font-black text-xl px-4 py-2 rounded-xl border border-primary/30">
                    #{order.mesa}
                  </span>
                  <div>
                    <div className="text-white font-bold text-base">{order.customerName || `Mesa ${order.mesa}`}</div>
                    <div className="text-slate-400 text-xs flex items-center gap-1 mt-0.5">
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(order.timestamp).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-white font-black text-2xl">${order.total.toFixed(2)}</div>
                  <span className="text-xs font-mono text-slate-500 bg-slate-900 px-2 py-0.5 rounded mt-1 inline-block border border-slate-800">{order.id}</span>
                </div>
              </div>
              
              <div className="space-y-2 mb-5 bg-slate-900/50 p-3 rounded-xl border border-slate-800">
                {order.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm text-slate-300">
                    <span><span className="text-slate-500 font-mono mr-2">{item.quantity}x</span> {item.dish.Nombre_Plato}</span>
                    <span className="font-medium">${(item.dish.Precio * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button 
                  onClick={() => handlePaymentClick(order, order.balanceDue)}
                  className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold py-3 rounded-xl text-sm transition-all flex items-center justify-center gap-2 active:scale-95 col-span-2"
                >
                  <Banknote className="w-4 h-4" />
                  Cobrar Total
                </button>
                <button 
                  onClick={() => setSplitOrder(order)}
                  className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 rounded-xl text-sm transition-all flex items-center justify-center gap-2 active:scale-95">
                  <SplitSquareHorizontal className="w-4 h-4 text-slate-400" />
                  Dividir
                </button>
                <button 
                  onClick={() => handlePrintTicket(order)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-3 rounded-xl text-sm transition-all flex items-center justify-center gap-2 active:scale-95 border border-slate-700">
                  <Printer className="w-4 h-4" />
                  Ticket
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modals */}
      {splitOrder && (
        <SplitBillModal
          order={splitOrder}
          onClose={() => setSplitOrder(null)}
          onPayPart={(amount) => {
            setSplitOrder(null);
            handlePaymentClick(splitOrder, amount);
          }}
        />
      )}

      {paymentOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setPaymentOrder(null)} />
          <div className="relative w-full min-w-[320px] sm:min-w-[400px] max-w-md shrink-0">
            <PaymentGateway
              total={paymentOrder.amount}
              onSuccess={(method) => {
                addTransaction(paymentOrder.order.id, paymentOrder.amount, method);
                setPaymentOrder(null);
              }}
              onCancel={() => setPaymentOrder(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
