import { useState } from 'react';
import { useStore } from '@/stores/useStore';
import { Network, Save, Server, CheckCircle2 } from 'lucide-react';

export function OnboardingView() {
  const { estaciones, updateEstacion } = useStore();
  const [saved, setSaved] = useState(false);
  const [localEstaciones, setLocalEstaciones] = useState(estaciones);

  const handleIpChange = (id: string, ip: string) => {
    setLocalEstaciones(prev => prev.map(e => e.ID_Estacion === id ? { ...e, Direccion_IP: ip } : e));
    setSaved(false);
  };

  const handleSave = () => {
    localEstaciones.forEach(est => updateEstacion(est));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-black text-slate-100 flex items-center gap-2">
          <Network className="w-6 h-6 text-primary" />
          Setup Inicial (Onboarding)
        </h2>
        <p className="text-slate-400 text-sm mt-1">Configura las impresoras térmicas y las estaciones de preparación en la red local (LAN).</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-5 border-b border-slate-800 bg-slate-800/50 flex justify-between items-center">
          <h3 className="font-bold text-white flex items-center gap-2">
            <Server className="w-5 h-5 text-blue-400" />
            Enrutamiento de Comandas
          </h3>
          <button 
            onClick={handleSave}
            className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
          >
            <Save className="w-4 h-4" />
            Guardar Configuración
          </button>
        </div>
        
        <div className="p-5 space-y-6">
          {saved && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-3 rounded-lg flex items-center gap-2 text-sm">
              <CheckCircle2 className="w-4 h-4" />
              Configuración de red guardada correctamente. Las comandas ahora se enrutarán a las nuevas IPs.
            </div>
          )}

          <div className="grid gap-4">
            {localEstaciones.map((est) => (
              <div key={est.ID_Estacion} className="bg-slate-800/50 border border-slate-700/50 p-4 rounded-xl flex items-center justify-between">
                <div className="space-y-1">
                  <div className="font-bold text-slate-200">{est.Nombre}</div>
                  <div className="text-xs text-slate-400">
                    Imprime: <span className="text-primary font-medium">{est.Categorias.join(', ')}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <label className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Dirección IP / MAC Bluetooth</label>
                  <input
                    type="text"
                    value={est.Direccion_IP}
                    onChange={(e) => handleIpChange(est.ID_Estacion, e.target.value)}
                    className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none font-mono"
                    placeholder="Ej. 192.168.1.100"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 mt-6">
            <h4 className="text-blue-400 font-bold text-sm mb-2">Diagrama de Red Recomendado</h4>
            <div className="text-xs text-slate-400 space-y-2">
              <p>1. Conecte todas las tablets y las impresoras térmicas al mismo Router WiFi (misma subred).</p>
              <p>2. Asigne direcciones IP estáticas a cada impresora térmica para evitar desconfiguraciones si el router se reinicia.</p>
              <p>3. Ingrese las IPs asignadas en los campos de arriba.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
