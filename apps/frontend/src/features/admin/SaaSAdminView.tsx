import { useState } from 'react';
import { useStore } from '@/stores/useStore';
import { Building2, CreditCard, LifeBuoy, AlertTriangle, CheckCircle2, Ticket } from 'lucide-react';

export function SaaSAdminView() {
  const { suscripcionSaaS, ticketsSoporte, crearTicketSoporte, actualizarSuscripcion } = useStore();
  const [nuevoAsunto, setNuevoAsunto] = useState('');
  const [mostrarModalSoporte, setMostrarModalSoporte] = useState(false);

  const isPremium = suscripcionSaaS.Plan === 'Premium';
  const hasFreeTickets = suscripcionSaaS.Tickets_Gratis_Restantes > 0;
  const requiresPayment = !isPremium && !hasFreeTickets;

  const handleCrearTicket = () => {
    if (!nuevoAsunto.trim()) return;
    crearTicketSoporte(nuevoAsunto);
    setNuevoAsunto('');
    setMostrarModalSoporte(false);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-black text-slate-100 flex items-center gap-2">
          <Building2 className="w-6 h-6 text-primary" />
          Mi Suscripción y Soporte
        </h2>
        <p className="text-slate-400 text-sm mt-1">
          Gestiona tu plan de facturación del software y solicita asistencia técnica.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Plan Actual */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-bl-full -z-10" />
          
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-1">Plan Actual</div>
              <h3 className="text-2xl font-black text-white flex items-center gap-2">
                {suscripcionSaaS.Plan}
                {isPremium && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
              </h3>
            </div>
            <div className="text-right">
              <div className="text-3xl font-black text-primary">${suscripcionSaaS.PrecioMensual}</div>
              <div className="text-xs text-slate-500 uppercase">/ mes</div>
            </div>
          </div>

          <div className="space-y-3 text-sm text-slate-300 mb-8">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Software POS completo
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Enrutamiento inteligente de comandas
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Actualizaciones en la nube
            </div>
            {isPremium ? (
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Soporte técnico 24/7 sin costo extra
              </div>
            ) : (
              <div className="flex items-center gap-2 opacity-50">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Soporte técnico con costo por evento
              </div>
            )}
          </div>

          <button 
            onClick={() => actualizarSuscripcion(isPremium ? 'Base' : 'Premium')}
            className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors ${
              isPremium 
                ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                : 'bg-gradient-to-r from-primary to-orange-500 text-white hover:from-primary/90 hover:to-orange-500/90 shadow-lg shadow-primary/20'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            {isPremium ? 'Bajar a Plan Base' : 'Upgrade a Premium'}
          </button>
        </div>

        {/* Soporte Técnico */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <LifeBuoy className="w-5 h-5 text-blue-400" />
                Soporte Técnico
              </h3>
              <p className="text-xs text-slate-400 mt-1">¿Necesitas ayuda con las impresoras o la red?</p>
            </div>
            {!isPremium && (
              <div className="text-right">
                <div className="text-2xl font-black text-white">{suscripcionSaaS.Tickets_Gratis_Restantes}</div>
                <div className="text-[10px] text-slate-500 uppercase font-bold">Tickets Gratis</div>
              </div>
            )}
          </div>

          <div className="flex-1 bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 mb-6 overflow-y-auto max-h-[200px]">
            {ticketsSoporte.length === 0 ? (
              <div className="text-center text-slate-500 text-sm py-4">No hay tickets recientes.</div>
            ) : (
              <div className="space-y-3">
                {ticketsSoporte.map(tk => (
                  <div key={tk.ID_Ticket} className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                    <div className="flex justify-between items-start mb-1">
                      <div className="font-semibold text-sm text-slate-200">{tk.Asunto}</div>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-bold ${
                        tk.Estado === 'Abierto' ? 'bg-yellow-500/10 text-yellow-400' :
                        tk.Estado === 'En Progreso' ? 'bg-blue-500/10 text-blue-400' :
                        'bg-emerald-500/10 text-emerald-400'
                      }`}>
                        {tk.Estado}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs text-slate-500">
                      <span>{tk.Fecha}</span>
                      {tk.Costo > 0 && (
                        <span className="text-red-400 font-bold bg-red-400/10 px-1.5 py-0.5 rounded">
                          Costo: ${tk.Costo} {tk.Facturado ? '(Cobrado)' : '(Pendiente)'}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button 
            onClick={() => setMostrarModalSoporte(true)}
            className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm flex items-center justify-center gap-2 border border-slate-600 transition-colors"
          >
            <Ticket className="w-4 h-4" />
            Solicitar Asistencia
          </button>
        </div>
      </div>

      {/* Modal Paywall */}
      {mostrarModalSoporte && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-2">Crear Ticket de Soporte</h3>
              
              {requiresPayment ? (
                <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl mb-4 flex gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
                  <div>
                    <div className="text-red-400 font-bold text-sm">Cobro por Evento</div>
                    <p className="text-xs text-red-400/80 mt-1">
                      Has agotado tus tickets gratuitos. Al abrir este ticket aceptas un cargo adicional de <strong>$15 USD</strong> en tu próxima factura. 
                      Para soporte ilimitado, mejora tu plan a Premium.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-xl mb-4 text-emerald-400 text-xs flex gap-2 items-center">
                  <CheckCircle2 className="w-4 h-4" />
                  Este ticket no generará cobros extra según tu plan actual.
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1 flex">Asunto del problema</label>
                  <textarea
                    value={nuevoAsunto}
                    onChange={(e) => setNuevoAsunto(e.target.value)}
                    placeholder="Ej. La impresora de la barra no está recibiendo comandas."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-sm text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none min-h-[100px]"
                  />
                </div>
              </div>
            </div>
            
            <div className="bg-slate-950 p-4 border-t border-slate-800 flex gap-3">
              <button 
                onClick={() => setMostrarModalSoporte(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-semibold text-sm hover:bg-slate-700 transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={handleCrearTicket}
                disabled={!nuevoAsunto.trim()}
                className="flex-1 py-2.5 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {requiresPayment ? 'Aceptar Cargo y Crear' : 'Crear Ticket'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
