import { clientesCRM } from '@/data/menu';
import { Users, Mail, Phone, Heart, Calendar, ShoppingBag, Search, UserPlus, ArrowUpRight, Star, TrendingUp } from 'lucide-react';
import { useState } from 'react';

export function CRMView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  
  const filteredClients = clientesCRM.filter(c =>
    c.Nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.Email.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="min-h-screen bg-slate-950 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Users className="w-7 h-7 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white">CRM de Fidelización</h2>
            <p className="text-xs text-slate-400">Gestión de clientes y preferencias</p>
          </div>
        </div>
        <button className="flex items-center gap-1.5 bg-pink-500 hover:bg-pink-400 text-white text-xs font-bold px-3 py-2 rounded-lg transition-colors">
          <UserPlus className="w-3.5 h-3.5" />
          Nuevo
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-gradient-to-br from-pink-500/10 to-pink-600/5 border border-pink-500/20 rounded-2xl p-4 text-center">
          <div className="text-2xl font-black text-white">{clientesCRM.length}</div>
          <div className="text-xs text-pink-400 font-medium">Clientes</div>
        </div>
        <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-2xl p-4 text-center">
          <div className="text-2xl font-black text-white flex items-center justify-center gap-1">
            4.8 <Star className="w-4 h-4 text-primary fill-primary" />
          </div>
          <div className="text-xs text-primary font-medium">Satisfacción</div>
        </div>
        <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-500/20 rounded-2xl p-4 text-center">
          <div className="text-2xl font-black text-white flex items-center justify-center gap-1">
            68% <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xs text-emerald-400 font-medium">Retención</div>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          type="text"
          placeholder="Buscar clientes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-slate-800/80 text-white text-sm rounded-xl pl-10 pr-4 py-2.5 outline-none border border-slate-700/50 focus:border-pink-500/50 focus:ring-1 focus:ring-pink-500/20 transition-all placeholder:text-slate-500"
        />
      </div>

      {/* Client Cards */}
      <div className="space-y-3">
        {filteredClients.map(client => {
          const isExpanded = selectedClient === client.ID_Cliente;
          const historyItems = client.Historial_Pedidos.split(', ');
          
          return (
            <div
              key={client.ID_Cliente}
              className={`bg-slate-800/40 border rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer ${
                isExpanded ? 'border-pink-500/30 bg-slate-800/60' : 'border-slate-700/30 hover:border-slate-600/50'
              }`}
              onClick={() => setSelectedClient(isExpanded ? null : client.ID_Cliente)}
            >
              <div className="p-4">
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-500/20 to-rose-500/20 rounded-xl flex items-center justify-center border border-pink-500/20 shrink-0">
                    <span className="text-xl font-black text-pink-400">{client.Nombre.charAt(0)}</span>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-white font-bold text-sm truncate">{client.Nombre}</h4>
                      <span className="text-[10px] font-mono text-slate-500">{client.ID_Cliente}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                      <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {client.Email}</span>
                    </div>
                  </div>
                  
                  <div className="text-right shrink-0">
                    <div className="text-primary text-xs font-bold">{historyItems.length} pedidos</div>
                    <div className="flex items-center gap-0.5 justify-end">
                      {[1,2,3,4,5].map(s => (
                        <Star key={s} className={`w-2.5 h-2.5 ${s <= 4 ? 'text-primary fill-primary' : 'text-slate-600'}`} />
                      ))}
                    </div>
                  </div>
                </div>
                
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-slate-700/30 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center gap-2 text-sm text-slate-300">
                        <Phone className="w-4 h-4 text-pink-400" />
                        {client.Telefono}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-300">
                        <Calendar className="w-4 h-4 text-blue-400" />
                        {new Date(client.Fecha_Registro).toLocaleDateString('es-MX')}
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <Heart className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                      <div className="flex flex-wrap gap-1">
                        {client.Preferencias.split(', ').map((pref, i) => (
                          <span key={i} className="text-[10px] bg-pink-500/15 text-pink-400 px-2 py-0.5 rounded-full border border-pink-500/20">
                            {pref}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <ShoppingBag className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <div className="flex flex-wrap gap-1">
                        {historyItems.map((item, i) => (
                          <span key={i} className="text-[10px] bg-primary/15 text-primary px-2 py-0.5 rounded-full border border-primary/20 font-mono">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex gap-2 pt-2">
                      <button className="flex-1 bg-pink-500/10 hover:bg-pink-500/20 text-pink-400 text-xs font-semibold py-2 rounded-lg transition-colors border border-pink-500/20 flex items-center justify-center gap-1">
                        <Mail className="w-3.5 h-3.5" />
                        Enviar Promoción
                      </button>
                      <button className="flex-1 bg-slate-700/50 hover:bg-slate-700 text-slate-300 text-xs font-semibold py-2 rounded-lg transition-colors border border-slate-600/30 flex items-center justify-center gap-1">
                        <ArrowUpRight className="w-3.5 h-3.5" />
                        Ver Perfil
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
