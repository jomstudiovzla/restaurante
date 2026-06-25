import { useStore } from '@/stores/useStore';
import { X, Plus, Minus, Trash2, Send, CreditCard, SplitSquareHorizontal, ArrowLeft, Heart, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { PaymentGateway } from '../checkout/PaymentGateway';

type CheckoutStep = 'CART' | 'TIP' | 'PAYMENT' | 'SUCCESS';

export function CartDrawer() {
  const { cart, updateQuantity, clearCart, toggleCart, addOrder, currentMesa, deductInventory } = useStore();
  const [step, setStep] = useState<CheckoutStep>('CART');
  const [customerName, setCustomerName] = useState('');
  const [tipPercentage, setTipPercentage] = useState<number>(0);
  
  const subtotal = cart.reduce((sum, item) => sum + item.dish.Precio * item.quantity, 0);
  const tax = subtotal * 0.16;
  const tipAmount = subtotal * (tipPercentage / 100);
  const grandTotal = subtotal + tax + tipAmount;
  
  const handleFinalizeOrder = (paymentMethod: 'EFECTIVO' | 'TARJETA' | 'MIXTO', paymentStatus: 'PENDIENTE' | 'PAGADO') => {
    if (cart.length === 0) return;
    
    addOrder({
      mesa: currentMesa,
      items: [...cart],
      status: 'PENDIENTE',
      paymentStatus: paymentStatus,
      paymentMethod: paymentMethod,
      tip: tipAmount,
      total: grandTotal,
      customerName: customerName || undefined,
    });
    
    cart.forEach(item => {
      deductInventory(item.dish.ID_Plato, item.quantity);
    });
    
    setStep('SUCCESS');
    
    setTimeout(() => {
      clearCart();
      toggleCart();
    }, 3000);
  };
  
  return (
    <div className="fixed inset-0 z-50">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity" onClick={() => step === 'CART' && toggleCart()} />
      
      {/* Drawer */}
      <div className="absolute bottom-0 left-0 right-0 bg-slate-900 rounded-t-3xl max-h-[90vh] flex flex-col animate-slide-up border-t border-primary shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
          <div className="flex items-center gap-3">
            {step !== 'CART' && step !== 'SUCCESS' && (
              <button onClick={() => setStep(step === 'PAYMENT' ? 'TIP' : 'CART')} className="p-2 -ml-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <div>
              <h3 className="text-lg font-black text-white">
                {step === 'CART' ? 'Tu Pedido' : step === 'TIP' ? 'Propina' : step === 'PAYMENT' ? 'Checkout' : 'Confirmado'}
              </h3>
              <p className="text-xs text-slate-400">Mesa #{currentMesa}</p>
            </div>
          </div>
          {step === 'CART' && (
            <button
              onClick={toggleCart}
              className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
        
        {step === 'SUCCESS' ? (
          <div className="flex-1 flex flex-col items-center justify-center p-10 gap-5">
            <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center animate-bounce">
              <CheckCircle className="w-12 h-12 text-emerald-400" />
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-black text-white mb-2">¡Comanda Exitosa!</h3>
              <p className="text-slate-400 text-sm">
                Tu orden ya está en la cocina y el pago ha sido registrado.
              </p>
            </div>
            <div className="flex items-center gap-2 text-primary text-xs font-semibold bg-primary/10 px-4 py-2 rounded-full mt-4">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              Sincronizado con POS y Cocina
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col min-h-0">
            {/* Step Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              
              {step === 'CART' && (
                <>
                  {cart.length === 0 ? (
                    <div className="text-center py-16 text-slate-500">
                      <p className="text-lg mb-2">🛒</p>
                      <p className="font-medium text-white">Tu carrito está vacío</p>
                      <p className="text-xs mt-1">Agrega platillos desde el menú</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {cart.map((item) => (
                        <div key={item.dish.ID_Plato} className="bg-slate-800/60 rounded-2xl p-3 flex items-center gap-3 border border-slate-700/30 shadow-lg">
                          <img src={item.dish.Foto_URL} alt={item.dish.Nombre_Plato} className="w-20 h-20 rounded-xl object-cover bg-slate-700" />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-white font-bold text-sm leading-tight mb-1">{item.dish.Nombre_Plato}</h4>
                            <p className="text-primary font-black text-sm">${(item.dish.Precio * item.quantity).toFixed(2)}</p>
                          </div>
                          <div className="flex items-center gap-2 bg-slate-900/50 rounded-xl p-1 border border-slate-700/50">
                            <button
                              onClick={() => updateQuantity(item.dish.ID_Plato, item.quantity - 1)}
                              className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-red-500/80 text-slate-300 hover:text-white flex items-center justify-center transition-colors active:scale-95"
                            >
                              {item.quantity === 1 ? <Trash2 className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
                            </button>
                            <span className="text-white font-black text-sm w-6 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.dish.ID_Plato, item.quantity + 1)}
                              className="w-8 h-8 rounded-lg bg-primary/20 hover:bg-primary text-primary hover:text-on-primary flex items-center justify-center transition-colors active:scale-95"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {step === 'TIP' && (
                <div className="space-y-6 py-4">
                  <div className="text-center space-y-2">
                    <Heart className="w-12 h-12 text-pink-500 mx-auto opacity-80" />
                    <h4 className="text-xl font-bold text-white">¿Deseas agregar propina?</h4>
                    <p className="text-sm text-slate-400">El 100% va directamente al equipo que te atiende hoy.</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    {[0, 10, 15, 20].map(pct => (
                      <button
                        key={pct}
                        onClick={() => setTipPercentage(pct)}
                        className={`py-4 rounded-2xl font-bold text-lg border-2 transition-all active:scale-95 ${
                          tipPercentage === pct 
                            ? 'bg-primary/20 border-primary text-primary' 
                            : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600'
                        }`}
                      >
                        {pct === 0 ? 'Sin Propina' : `${pct}%`}
                        {pct > 0 && <span className="block text-xs font-normal opacity-70">+${(subtotal * (pct/100)).toFixed(2)}</span>}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 'PAYMENT' && (
                <div className="py-2">
                  <PaymentGateway 
                    total={grandTotal} 
                    onSuccess={(method) => handleFinalizeOrder(method, 'PAGADO')} 
                    onCancel={() => setStep('TIP')} 
                  />
                  <div className="mt-6 text-center">
                    <div className="flex items-center justify-center gap-4 text-xs font-semibold text-slate-500">
                      <div className="h-px bg-slate-700 flex-1" />
                      Otras Opciones
                      <div className="h-px bg-slate-700 flex-1" />
                    </div>
                    <button 
                      onClick={() => handleFinalizeOrder('EFECTIVO', 'PENDIENTE')}
                      className="mt-4 w-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-3.5 rounded-xl transition-all border border-slate-700"
                    >
                      Pagar en Efectivo (Caja)
                    </button>
                  </div>
                </div>
              )}

            </div>
            
            {/* Footer Summary & Actions */}
            {cart.length > 0 && step !== 'PAYMENT' && (
              <div className="border-t border-slate-700/50 p-5 bg-slate-900/90 backdrop-blur-lg">
                {step === 'CART' && (
                  <div className="mb-4">
                    <input
                      type="text"
                      placeholder="Nombre del cliente (opcional)"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full bg-slate-800 text-white text-sm rounded-xl px-4 py-3 outline-none border border-slate-700 focus:border-primary placeholder:text-slate-500 transition-colors"
                    />
                  </div>
                )}
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm text-slate-400">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-slate-400">
                    <span>IVA (16%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  {tipPercentage > 0 && (
                    <div className="flex justify-between text-sm text-pink-400 font-medium">
                      <span>Propina ({tipPercentage}%)</span>
                      <span>${tipAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-xl font-black text-white pt-3 border-t border-slate-700/50">
                    <span>Total</span>
                    <span className="text-primary">${grandTotal.toFixed(2)}</span>
                  </div>
                </div>
                
                {step === 'CART' && (
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleFinalizeOrder('EFECTIVO', 'PENDIENTE')}
                      className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-semibold py-3.5 rounded-xl text-sm transition-all border border-slate-600 flex items-center justify-center gap-2"
                    >
                      <Send className="w-4 h-4 text-slate-400" />
                      Enviar y Pagar Después
                    </button>
                    <button
                      onClick={() => setStep('TIP')}
                      className="flex-[1.5] bg-primary hover:bg-primary/90 text-on-primary font-black py-3.5 rounded-xl text-sm transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 active:scale-95"
                    >
                      <CreditCard className="w-4 h-4" />
                      Pagar Ahora
                    </button>
                  </div>
                )}

                {step === 'TIP' && (
                  <button
                    onClick={() => setStep('PAYMENT')}
                    className="w-full bg-primary hover:bg-primary/90 text-on-primary font-black py-4 rounded-xl text-sm transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 active:scale-95"
                  >
                    Continuar al Pago ${grandTotal.toFixed(2)}
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
