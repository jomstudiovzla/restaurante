import { useState } from 'react';
import { X, Users, List, DollarSign, CheckCircle } from 'lucide-react';
import { Order } from '@/stores/useStore';

interface SplitBillModalProps {
  order: Order;
  onClose: () => void;
  onPayPart: (amount: number) => void;
}

export function SplitBillModal({ order, onClose, onPayPart }: SplitBillModalProps) {
  const [splitType, setSplitType] = useState<'EQUAL' | 'CUSTOM'>('EQUAL');
  const [parts, setParts] = useState(2);
  const [customAmount, setCustomAmount] = useState<string>('');

  const handlePayEqual = () => {
    const amountPerPart = order.balanceDue / parts;
    onPayPart(amountPerPart);
  };

  const handlePayCustom = () => {
    const amount = parseFloat(customAmount);
    if (!isNaN(amount) && amount > 0 && amount <= order.balanceDue) {
      onPayPart(amount);
      setCustomAmount('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-slate-900 border border-slate-700 w-full min-w-[320px] sm:min-w-[400px] max-w-md shrink-0 rounded-3xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <h3 className="text-xl font-black text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Dividir Cuenta
          </h3>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5">
          <div className="flex items-center justify-between mb-6 bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50">
            <span className="text-slate-400 font-medium">Restante por cobrar</span>
            <span className="text-3xl font-black text-primary">${order.balanceDue.toFixed(2)}</span>
          </div>

          <div className="flex gap-2 mb-6 bg-slate-800/80 p-1 rounded-xl">
            <button
              onClick={() => setSplitType('EQUAL')}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${splitType === 'EQUAL' ? 'bg-slate-700 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
            >
              Partes Iguales
            </button>
            <button
              onClick={() => setSplitType('CUSTOM')}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${splitType === 'CUSTOM' ? 'bg-slate-700 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
            >
              Monto Libre
            </button>
          </div>

          {splitType === 'EQUAL' ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-slate-800/50 rounded-xl p-2 border border-slate-700/50">
                <button
                  onClick={() => setParts(Math.max(2, parts - 1))}
                  className="w-12 h-12 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-bold text-xl transition-colors"
                >
                  -
                </button>
                <div className="text-center">
                  <span className="block text-2xl font-black text-white">{parts}</span>
                  <span className="text-xs text-slate-400">personas</span>
                </div>
                <button
                  onClick={() => setParts(parts + 1)}
                  className="w-12 h-12 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-bold text-xl transition-colors"
                >
                  +
                </button>
              </div>
              
              <div className="pt-4 border-t border-slate-800">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-slate-400 font-medium">Monto por persona</span>
                  <span className="text-2xl font-black text-white">${(order.balanceDue / parts).toFixed(2)}</span>
                </div>
                
                <button
                  onClick={handlePayEqual}
                  className="w-full bg-primary hover:bg-primary/90 text-on-primary font-black py-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 active:scale-95"
                >
                  <DollarSign className="w-5 h-5" />
                  Cobrar 1 Parte (${(order.balanceDue / parts).toFixed(2)})
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400">Monto a cobrar ahora</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg font-bold">$</span>
                  <input
                    type="number"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    placeholder="0.00"
                    max={order.balanceDue}
                    step="0.01"
                    className="w-full bg-slate-900 text-white text-2xl font-black rounded-xl pl-10 pr-4 py-4 outline-none border border-slate-700 focus:border-primary transition-colors placeholder:text-slate-700"
                  />
                </div>
              </div>
              
              <button
                onClick={handlePayCustom}
                disabled={!customAmount || parseFloat(customAmount) <= 0 || parseFloat(customAmount) > order.balanceDue}
                className="w-full bg-primary hover:bg-primary/90 text-on-primary font-black py-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:active:scale-100 mt-6"
              >
                <DollarSign className="w-5 h-5" />
                Cobrar Monto
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
