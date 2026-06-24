import { useStore } from '@/stores/useStore';
import { Shield, X } from 'lucide-react';

export function ConsentBanner() {
  const { consentAccepted, acceptConsent } = useStore();
  
  if (consentAccepted) return null;
  
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-r from-slate-900 to-slate-800 text-white p-4 shadow-2xl border-t border-primary">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center gap-3">
        <Shield className="w-6 h-6 text-primary shrink-0" />
        <p className="text-sm text-slate-300 flex-1 text-center sm:text-left">
          Al utilizar este menú digital, aceptas nuestros{' '}
          <button className="text-primary underline hover:text-primary transition-colors font-medium">
            Términos, Condiciones y Aviso de Privacidad
          </button>
          . Recopilamos datos mínimos para mejorar tu experiencia. No almacenamos datos de pago.
          Cumplimiento PCI-DSS garantizado.
        </p>
        <button
          onClick={acceptConsent}
          className="bg-primary hover:bg-primary text-on-primary font-bold px-6 py-2 rounded-lg transition-all duration-200 shrink-0 flex items-center gap-2"
        >
          Aceptar
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
