import { useState, useRef } from 'react';
import { useStore } from '@/stores/useStore';
import { ChefHat, Scissors, Beaker, Camera, CheckCircle2, AlertTriangle, Scale } from 'lucide-react';

export function MiseEnPlaceView() {
  const { almacen, stockCocina, registrarPorcionado, registrarLote, registrarMerma } = useStore();
  const [activeSection, setActiveSection] = useState<'proteinas' | 'salsas' | 'mermas'>('proteinas');
  
  // Forms State
  const [selectedItem, setSelectedItem] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [pesoPorcion, setPesoPorcion] = useState('');
  const [fotoUrl, setFotoUrl] = useState('');
  const [motivoMerma, setMotivoMerma] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setFotoUrl(url);
    }
  };

  const handlePorcionado = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem || !cantidad || !pesoPorcion || !fotoUrl) return;
    registrarPorcionado(selectedItem, parseInt(cantidad), parseInt(pesoPorcion), 'Cocinero 1', fotoUrl);
    setSelectedItem('');
    setCantidad('');
    setPesoPorcion('');
    setFotoUrl('');
    alert('Porcionado registrado con éxito');
  };

  const handleLote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem || !cantidad || !fotoUrl) return;
    registrarLote(selectedItem, parseInt(cantidad), 'ml/g', 'Cocinero 1', fotoUrl);
    setSelectedItem('');
    setCantidad('');
    setFotoUrl('');
    alert('Lote registrado con éxito');
  };

  const handleMerma = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem || !cantidad || !motivoMerma) return;
    registrarMerma(selectedItem, parseInt(cantidad), 'unidades/ml/g', motivoMerma, 'Cocinero 1');
    setSelectedItem('');
    setCantidad('');
    setMotivoMerma('');
    alert('Merma registrada en auditoría');
  };

  const proteinas = almacen.filter(i => i.Nombre_Ingrediente.toLowerCase().includes('filete') || i.Nombre_Ingrediente.toLowerCase().includes('salmón') || i.Nombre_Ingrediente.toLowerCase().includes('camaron'));
  const bases = almacen.filter(i => !proteinas.includes(i));
  const stockCocinaActual = stockCocina.filter(s => s.Cantidad > 0);

  return (
    <div className="min-h-screen bg-slate-950 p-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
          <ChefHat className="w-7 h-7 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-black text-white">Mise en Place</h2>
          <p className="text-xs text-slate-400">Preparación y Porcionado Diario</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column - Forms */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Tabs */}
          <div className="flex space-x-2 bg-slate-900/50 p-1.5 rounded-xl border border-slate-800">
            {[
              { id: 'proteinas', label: 'Categoría A (Porciones Exactas)', icon: Scissors },
              { id: 'salsas', label: 'Categoría B (Lotes Diarios)', icon: Beaker },
              { id: 'mermas', label: 'Registro de Mermas', icon: AlertTriangle }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all flex-1 justify-center
                  ${activeSection === tab.id 
                    ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>

          {activeSection === 'proteinas' && (
            <div className="bg-slate-800/40 border border-slate-700/30 rounded-2xl p-6">
              <div className="flex items-start gap-3 mb-6">
                <div className="p-2 bg-orange-500/20 rounded-lg text-orange-400 mt-1">
                  <Scale className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Porcionado de Proteínas</h3>
                  <p className="text-sm text-slate-400">Corta la materia prima y regístrala como porciones listas para el POS. Exige foto de la báscula.</p>
                </div>
              </div>
              
              <form onSubmit={handlePorcionado} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-slate-400 mb-1">Materia Prima Base (De Almacén)</label>
                    <select 
                      value={selectedItem} 
                      onChange={e => setSelectedItem(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white"
                      required
                    >
                      <option value="">Seleccionar proteína...</option>
                      {proteinas.map(i => <option key={i.ID_Ingrediente} value={i.ID_Ingrediente}>{i.Nombre_Ingrediente}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Cantidad (Porciones)</label>
                    <input 
                      type="number" 
                      value={cantidad} 
                      onChange={e => setCantidad(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white"
                      placeholder="Ej. 10"
                      required min="1"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Peso Exacto p/Porción (g)</label>
                    <input 
                      type="number" 
                      value={pesoPorcion} 
                      onChange={e => setPesoPorcion(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white"
                      placeholder="Ej. 250"
                      required min="1"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Foto de la Báscula (Obligatorio)</label>
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-32 border-2 border-dashed border-slate-600 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-orange-500/50 hover:bg-orange-500/5 transition-all overflow-hidden"
                  >
                    {fotoUrl ? (
                      <img src={fotoUrl} alt="Báscula" className="h-full w-full object-cover" />
                    ) : (
                      <>
                        <Camera className="w-8 h-8 text-slate-500 mb-2" />
                        <span className="text-sm text-slate-400">Clic para capturar peso</span>
                      </>
                    )}
                  </div>
                  <input type="file" accept="image/*" ref={fileInputRef} onChange={handlePhotoUpload} className="hidden" required />
                </div>

                <button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition-colors">
                  Generar Porciones para Servicio
                </button>
              </form>
            </div>
          )}

          {activeSection === 'salsas' && (
            <div className="bg-slate-800/40 border border-slate-700/30 rounded-2xl p-6">
              <div className="flex items-start gap-3 mb-6">
                <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-400 mt-1">
                  <Beaker className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Preparación de Lotes (Salsas/Pastas)</h3>
                  <p className="text-sm text-slate-400">Registra producciones que no se descuentan 1 a 1 por plato, sino que se preparan en masa y se controla su merma.</p>
                </div>
              </div>
              
              <form onSubmit={handleLote} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Nombre de la Preparación Base</label>
                  <select 
                      value={selectedItem} 
                      onChange={e => setSelectedItem(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white"
                      required
                    >
                      <option value="">Seleccionar base...</option>
                      {bases.map(i => <option key={i.ID_Ingrediente} value={i.ID_Ingrediente}>{i.Nombre_Ingrediente}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Cantidad Producida Total (Mililitros o Gramos)</label>
                  <input 
                    type="number" 
                    value={cantidad} 
                    onChange={e => setCantidad(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white"
                    placeholder="Ej. 5000"
                    required min="1"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Foto del Contenedor con Fecha (Obligatorio)</label>
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-32 border-2 border-dashed border-slate-600 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all overflow-hidden"
                  >
                    {fotoUrl ? (
                      <img src={fotoUrl} alt="Contenedor" className="h-full w-full object-cover" />
                    ) : (
                      <>
                        <Camera className="w-8 h-8 text-slate-500 mb-2" />
                        <span className="text-sm text-slate-400">Clic para capturar contenedor</span>
                      </>
                    )}
                  </div>
                  <input type="file" accept="image/*" ref={fileInputRef} onChange={handlePhotoUpload} className="hidden" required />
                </div>

                <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-xl transition-colors">
                  Registrar Lote de Producción
                </button>
              </form>
            </div>
          )}

          {activeSection === 'mermas' && (
            <div className="bg-slate-800/40 border border-slate-700/30 rounded-2xl p-6">
               <div className="flex items-start gap-3 mb-6">
                <div className="p-2 bg-red-500/20 rounded-lg text-red-400 mt-1">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Declarar Mermas o Desperdicios</h3>
                  <p className="text-sm text-slate-400">Usado al final del turno para declarar salsas pasadas, accidentes o sobrantes inutilizables.</p>
                </div>
              </div>

              <form onSubmit={handleMerma} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Ítem a Dar de Baja</label>
                  <select 
                    value={selectedItem} 
                    onChange={e => setSelectedItem(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white"
                    required
                  >
                    <option value="">Seleccionar del stock de cocina...</option>
                    {stockCocinaActual.map(i => <option key={i.ID_Cocina} value={i.ID_Cocina}>{i.Nombre} ({i.Cantidad} {i.Unidad})</option>)}
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Cantidad Descartada</label>
                  <input 
                    type="number" 
                    value={cantidad} 
                    onChange={e => setCantidad(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white"
                    placeholder="Ej. 5"
                    required min="1"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Motivo / Justificación</label>
                  <textarea 
                    value={motivoMerma} 
                    onChange={e => setMotivoMerma(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white resize-none h-24"
                    placeholder="Ej. Se echó a perder, accidente, etc."
                    required
                  ></textarea>
                </div>

                <button type="submit" className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-xl transition-colors">
                  Enviar a Auditoría (Merma)
                </button>
              </form>
            </div>
          )}

        </div>

        {/* Right Column - Status */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Stock Listo para Servicio</h3>
          
          <div className="bg-slate-800/40 border border-slate-700/30 rounded-2xl p-4 max-h-[600px] overflow-y-auto">
            {stockCocinaActual.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-sm">
                No hay stock preparado.<br/>Realice el Mise en Place.
              </div>
            ) : (
              <div className="space-y-3">
                {stockCocinaActual.map(item => (
                  <div key={item.ID_Cocina} className="bg-slate-900/50 p-3 rounded-xl border border-slate-700">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex gap-2">
                        {item.Tipo === 'Porcion' ? <Scissors className="w-4 h-4 text-orange-400" /> : <Beaker className="w-4 h-4 text-emerald-400" />}
                        <span className="text-white font-semibold text-sm leading-tight">{item.Nombre}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400">{new Date(item.Fecha_Preparacion).toLocaleTimeString()}</span>
                      <span className={`font-black px-2 py-1 rounded-lg ${item.Tipo === 'Porcion' ? 'bg-orange-500/20 text-orange-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                        {item.Cantidad} {item.Unidad}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
