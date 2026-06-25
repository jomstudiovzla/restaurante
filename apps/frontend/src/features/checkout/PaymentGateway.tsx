import { useState } from 'react';
import { CreditCard, Lock, CheckCircle, AlertCircle } from 'lucide-react';
import { useStore } from '@/stores/useStore';

interface PaymentGatewayProps {
  total: number;
  onSuccess: (paymentMethod: 'TARJETA' | 'EFECTIVO' | 'MIXTO') => void;
  onCancel: () => void;
}

export function PaymentGateway({ total, onSuccess, onCancel }: PaymentGatewayProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Simulating Stripe Elements behavior
  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setError(null);

    try {
      // Here goes actual Stripe API integration
      // const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, { payment_method: { card: elements.getElement(CardElement) } });
      
      // Simulating network request
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      onSuccess('TARJETA');
    } catch (err: any) {
      setError(err.message || 'Error procesando el pago. Intenta de nuevo.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700/50 shadow-2xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-primary" />
          Pago Seguro
        </h3>
        <span className="text-xl font-black text-primary">${total.toFixed(2)}</span>
      </div>

      <form onSubmit={handlePaymentSubmit} className="space-y-4">
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
                <Lock className="w-4 h-4" />
                Pagar ${total.toFixed(2)}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
