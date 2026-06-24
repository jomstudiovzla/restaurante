import { useStore } from '@/stores/useStore';
import { X, Plus, Minus, Trash2, Send, CreditCard, SplitSquareHorizontal } from 'lucide-react';
import { useState } from 'react';

export function CartDrawer() {
  const { cart, updateQuantity, clearCart, toggleCart, addOrder, currentMesa, deductInventory } = useStore();
  const [orderSent, setOrderSent] = useState(false);
  const [customerName, setCustomerName] = useState('');
  
  const total = cart.reduce((sum, item) => sum + item.dish.Precio * item.quantity, 0);
  const tax = total * 0.16;
  const grandTotal = total + tax;
  
  const handleSendOrder = () => {
    if (cart.length === 0) return;
    
    // Add order
    addOrder({
      mesa: currentMesa,
      items: [...cart],
      status: 'PENDIENTE',
      total: grandTotal,
      customerName: customerName || undefined,
    });
    
    // Deduct inventory for each item
    cart.forEach(item => {
      deductInventory(item.dish.ID_Plato, item.quantity);
    });
    
    setOrderSent(true);
    
    setTimeout(() => {
      clearCart();
      toggleCart();
      setOrderSent(false);
    }, 2500);
  };
  
  return (
    <div className="fixed inset-0 z-50">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={toggleCart} />
      
      {/* Drawer */}
      <div className="absolute bottom-0 left-0 right-0 bg-slate-900 rounded-t-3xl max-h-[85vh] flex flex-col animate-slide-up border-t border-primary shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
          <div>
            <h3 className="text-lg font-black text-white">Tu Pedido</h3>
            <p className="text-xs text-slate-400">Mesa #{useStore.getState().currentMesa}</p>
          </div>
          <button
            onClick={toggleCart}
            className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {orderSent ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 gap-4">
            <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center animate-bounce">
              <Send className="w-10 h-10 text-emerald-400" />
            </div>
            <h3 className="text-xl font-black text-white">¡Pedido Enviado!</h3>
            <p className="text-slate-400 text-center text-sm">
              Tu orden ha sido registrada en cocina. Recibirás tu pedido en breve.
            </p>
            <div className="flex items-center gap-2 text-primary text-xs font-semibold">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              Comanda en tiempo real activa
            </div>
          </div>
        ) : (
          <>
            {/* Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {cart.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  <p className="text-lg mb-2">🛒</p>
                  <p className="font-medium">Tu carrito está vacío</p>
                  <p className="text-xs mt-1">Agrega platillos desde el menú</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.dish.ID_Plato} className="bg-slate-800/50 rounded-xl p-3 flex items-center gap-3 border border-slate-700/30">
                    <img src={item.dish.Foto_URL} alt={item.dish.Nombre_Plato} className="w-16 h-16 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white font-semibold text-sm truncate">{item.dish.Nombre_Plato}</h4>
                      <p className="text-primary font-bold text-sm">${(item.dish.Precio * item.quantity).toFixed(2)}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => updateQuantity(item.dish.ID_Plato, item.quantity - 1)}
                        className="w-8 h-8 rounded-lg bg-slate-700 hover:bg-red-500/50 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                      >
                        {item.quantity === 1 ? <Trash2 className="w-3.5 h-3.5" /> : <Minus className="w-3.5 h-3.5" />}
                      </button>
                      <span className="text-white font-bold text-sm w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.dish.ID_Plato, item.quantity + 1)}
                        className="w-8 h-8 rounded-lg bg-primary/20 hover:bg-primary/40 text-primary flex items-center justify-center transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            {/* Footer */}
            {cart.length > 0 && (
              <div className="border-t border-slate-700/50 p-4 space-y-3">
                {/* Customer name */}
                <input
                  type="text"
                  placeholder="Tu nombre (opcional)"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-slate-800/60 text-white text-sm rounded-xl px-4 py-2.5 outline-none border border-slate-700/50 focus:border-primary/50 placeholder:text-slate-500"
                />
                
                {/* Totals */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-sm text-slate-400">
                    <span>Subtotal</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-slate-400">
                    <span>IVA (16%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-black text-white pt-2 border-t border-slate-700/50">
                    <span>Total</span>
                    <span className="text-primary">${grandTotal.toFixed(2)}</span>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={handleSendOrder}
                    className="flex-1 bg-primary hover:bg-primary/90 text-on-primary font-bold py-3.5 rounded-xl text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-primary/20 active:scale-[0.98]"
                  >
                    <Send className="w-4 h-4" />
                    Enviar a Cocina
                  </button>
                </div>
                
                <div className="flex gap-2">
                  <button className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium py-2.5 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 border border-slate-700/50">
                    <CreditCard className="w-3.5 h-3.5" />
                    Pagar con tarjeta
                  </button>
                  <button className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium py-2.5 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 border border-slate-700/50">
                    <SplitSquareHorizontal className="w-3.5 h-3.5" />
                    Dividir cuenta
                  </button>
                </div>

                <p className="text-[10px] text-slate-500 text-center">
                  🔒 Pagos procesados vía pasarela externa certificada PCI-DSS. No almacenamos datos de tarjeta.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
