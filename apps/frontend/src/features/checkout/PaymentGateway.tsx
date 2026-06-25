import { useState } from 'react';
import { CreditCard, Lock, CheckCircle, AlertCircle, Smartphone } from 'lucide-react';

interface PaymentGatewayProps {
  total: number;
  onSuccess: (paymentMethod: 'TARJETA' | 'EFECTIVO' | 'APPLE_PAY' | 'GOOGLE_PAY' | 'MIXTO') => void;
  onCancel: () => void;
}

export function PaymentGateway({ total, onSuccess, onCancel }: PaymentGatewayProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'TARJETA' | 'APPLE_PAY' | 'GOOGLE_PAY'>('TARJETA');

  const handleWalletPayment = async (method: 'APPLE_PAY' | 'GOOGLE_PAY') => {
    setIsProcessing(true);
    setError(null);
    try {
      // Simulando Payment Request API
      await new Promise(resolve => setTimeout(resolve, 1500));
      onSuccess(method);
    } catch (err: any) {
      setError(`Error procesando ${method}. Intenta de nuevo.`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCardSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setError(null);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      onSuccess('TARJETA');
    } catch (err: any) {
      setError(err.message || 'Error procesando el pago con tarjeta.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700/50 shadow-2xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Lock className="w-5 h-5 text-emerald-400" />
          Pago Seguro
        </h3>
        <span className="text-xl font-black text-primary">${total.toFixed(2)}</span>
      </div>

      <div className="flex gap-2 mb-4 bg-slate-900/50 p-1 rounded-xl">
        <button
          type="button"
          onClick={() => setPaymentMethod('TARJETA')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${paymentMethod === 'TARJETA' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'}`}
        >
          <CreditCard className="w-4 h-4" /> Tarjeta
        </button>
        <button
          type="button"
          onClick={() => setPaymentMethod('APPLE_PAY')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${paymentMethod === 'APPLE_PAY' ? 'bg-slate-100 text-black' : 'text-slate-400 hover:text-white'}`}
        >
          <Smartphone className="w-4 h-4" /> Apple Pay
        </button>
        <button
          type="button"
          onClick={() => setPaymentMethod('GOOGLE_PAY')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${paymentMethod === 'GOOGLE_PAY' ? 'bg-white text-slate-800' : 'text-slate-400 hover:text-white'}`}
        >
          <Smartphone className="w-4 h-4" /> GPay
        </button>
      </div>

      {paymentMethod === 'TARJETA' ? (
        <form onSubmit={handleCardSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400">Nombre en la tarjeta</label>
            <input
              type="text"
              required
              placeholder="Juan Pérez"
              className="w-full bg-slate-900/50 text-white rounded-xl px-4 py-3 outline-none border border-slate-700 focus:border-primary transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400">Datos de la Tarjeta (Simulado Stripe)</label>
            <div className="w-full bg-slate-900/50 text-white rounded-xl px-4 py-3 outline-none border border-slate-700 focus:border-primary flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-slate-500" />
              <input 
                type="text" 
                placeholder="0000 0000 0000 0000" 
                className="bg-transparent outline-none flex-1 font-mono text-sm"
                required
              />
              <input 
                type="text" 
                placeholder="MM/YY" 
                className="bg-transparent outline-none w-14 font-mono text-sm"
                required
              />
              <input 
                type="text" 
                placeholder="CVC" 
                className="bg-transparent outline-none w-10 font-mono text-sm"
                required
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-400 bg-red-500/10 p-3 rounded-lg text-sm border border-red-500/20">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              disabled={isProcessing}
              className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isProcessing}
              className="flex-[2] bg-primary hover:bg-primary/90 text-on-primary font-black py-3 rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:scale-100 active:scale-[0.98]"
            >
              {isProcessing ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Pagar ${total.toFixed(2)}
                </>
              )}
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-4 py-4 text-center">
          <div className="w-16 h-16 mx-auto bg-slate-900 rounded-full flex items-center justify-center border border-slate-700">
            <Smartphone className={`w-8 h-8 ${paymentMethod === 'APPLE_PAY' ? 'text-white' : 'text-blue-400'}`} />
          </div>
          <p className="text-slate-400 text-sm">Abre tu Wallet en el dispositivo para confirmar el pago con {paymentMethod === 'APPLE_PAY' ? 'Apple Pay' : 'Google Pay'}.</p>
          
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              disabled={isProcessing}
              className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={() => handleWalletPayment(paymentMethod)}
              disabled={isProcessing}
              className={`flex-[2] text-black font-black py-3 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:scale-100 active:scale-[0.98] ${paymentMethod === 'APPLE_PAY' ? 'bg-slate-100 hover:bg-white' : 'bg-white hover:bg-gray-100'}`}
            >
              {isProcessing ? (
                <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              ) : (
                <>
                  Pagar ${total.toFixed(2)} con {paymentMethod === 'APPLE_PAY' ? 'Apple Pay' : 'GPay'}
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
