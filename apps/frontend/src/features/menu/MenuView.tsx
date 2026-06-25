import { useState } from 'react';
import { useStore } from '@/stores/useStore';
import { menuItems, categories } from '@/data/menu';
import { CartDrawer } from '@/features/cart/CartDrawer';
import { ShoppingCart, Clock, AlertTriangle, Plus, Minus, Search, Flame, Star } from 'lucide-react';

export function MenuView() {
  const { cart, addToCart, updateQuantity, showCart, toggleCart, selectedCategory, setSelectedCategory } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDish, setSelectedDish] = useState<string | null>(null);
  
  const cartTotal = cart.reduce((sum, item) => sum + item.dish.Precio * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  const filteredItems = menuItems.filter(item => {
    const matchesCategory = selectedCategory === 'Todas' || item.Categoria === selectedCategory;
    const matchesSearch = item.Nombre_Plato.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         item.Descripcion.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch && item.Activo;
  });

  const getCartQuantity = (dishId: string) => {
    return cart.find(item => item.dish.ID_Plato === dishId)?.quantity || 0;
  };

  const categoryEmoji: Record<string, string> = {
    'Todas': '🍽️',
    'Entradas': '🥗',
    'Platos Fuertes': '🥩',
    'Bebidas': '🍹',
    'Postres': '🍰',
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col transition-all duration-300">
      <div className={`flex-1 transition-all duration-300 pb-40 ${showCart ? 'lg:pr-[400px]' : ''}`}>
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4 pt-6 pb-4">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-primary rounded-full blur-3xl" />
          </div>
          <div className="relative">
            <div className="flex items-center gap-2 mb-2">
              <Flame className="w-5 h-5 text-primary" />
              <span className="text-primary text-sm font-semibold tracking-wide">Menú del día</span>
            </div>
            <h2 className="text-2xl font-black text-white mb-1">Descubre Sabores Únicos</h2>
            <p className="text-slate-400 text-sm">Ingredientes frescos, preparados al momento</p>
          </div>
        </div>

        {/* Search */}
        <div className="px-4 py-3 sticky top-[52px] sm:top-[60px] z-30 bg-slate-950/95 backdrop-blur-md border-b border-slate-800/50 transition-all">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Buscar platillos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-800/80 text-white text-sm rounded-xl pl-10 pr-4 py-2.5 outline-none border border-slate-700/50 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-slate-500"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="px-4 py-3 overflow-x-auto scrollbar-hide">
          <div className="flex gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                  selectedCategory === cat
                    ? 'bg-primary text-on-primary shadow-lg shadow-primary/20'
                    : 'bg-slate-800/60 text-slate-400 hover:bg-slate-700/60 hover:text-white border border-slate-700/30'
                }`}
              >
                <span>{categoryEmoji[cat]}</span>
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Grid */}
        <div className="px-4 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 pb-4">
          {filteredItems.map((dish) => {
            const qty = getCartQuantity(dish.ID_Plato);
            const isExpanded = selectedDish === dish.ID_Plato;
            
            return (
              <div
                key={dish.ID_Plato}
                className={`bg-slate-800/50 backdrop-blur rounded-2xl overflow-hidden border transition-all duration-300 flex flex-col ${
                  qty > 0 ? 'border-primary/40 shadow-lg shadow-primary/20' : 'border-slate-700/30 hover:border-slate-600/50'
                }`}
              >
                {/* Image */}
                <div
                  className="relative h-44 overflow-hidden cursor-pointer shrink-0"
                  onClick={() => setSelectedDish(isExpanded ? null : dish.ID_Plato)}
                >
                  <img
                    src={dish.Foto_URL}
                    alt={dish.Nombre_Plato}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
                  
                  {/* Category badge */}
                  <span className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-sm text-primary text-xs font-semibold px-2.5 py-1 rounded-full border border-primary/20">
                    {categoryEmoji[dish.Categoria]} {dish.Categoria}
                  </span>
                  
                  {/* Time badge */}
                  <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-sm text-slate-300 text-xs px-2.5 py-1 rounded-full flex items-center gap-1 border border-slate-600/30">
                    <Clock className="w-3 h-3" />
                    {dish.Tiempo_Preparacion}
                  </div>
                  
                  {/* Quantity overlay */}
                  {qty > 0 && (
                    <div className="absolute bottom-3 right-3 bg-primary text-on-primary w-8 h-8 rounded-full flex items-center justify-center font-black text-sm shadow-lg">
                      {qty}
                    </div>
                  )}
                </div>
                
                {/* Info */}
                <div className="p-4 flex flex-col flex-1 justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="text-white font-bold text-base leading-tight">{dish.Nombre_Plato}</h3>
                      <span className="text-primary font-black text-lg whitespace-nowrap">
                        ${dish.Precio.toFixed(2)}
                      </span>
                    </div>
                    
                    <p className="text-slate-400 text-xs mb-3 line-clamp-2">{dish.Descripcion}</p>
                    
                    {/* Allergens */}
                    {dish.Alergenos && dish.Alergenos.length > 0 && isExpanded && (
                      <div className="flex items-center gap-1.5 mb-3 flex-wrap">
                        <AlertTriangle className="w-3 h-3 text-red-400 shrink-0" />
                        {dish.Alergenos.map((a) => (
                          <span key={a} className="text-[10px] bg-red-500/15 text-red-400 px-2 py-0.5 rounded-full border border-red-500/20">
                            {a}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {/* Add to cart controls */}
                  <div className="mt-auto pt-2">
                    {qty === 0 ? (
                      <button
                        onClick={() => addToCart(dish)}
                        className="w-full bg-primary hover:bg-primary/90 text-on-primary font-bold py-2.5 rounded-xl text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-primary/20 active:scale-95"
                      >
                        <Plus className="w-4 h-4" />
                        Agregar al Pedido
                      </button>
                    ) : (
                      <div className="flex items-center justify-between bg-slate-700/50 rounded-xl p-1">
                        <button
                          onClick={() => updateQuantity(dish.ID_Plato, qty - 1)}
                          className="w-10 h-10 rounded-lg bg-slate-600 hover:bg-red-500/80 text-white flex items-center justify-center transition-colors active:scale-90"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="text-white font-black text-lg min-w-[3rem] text-center">{qty}</span>
                        <button
                          onClick={() => addToCart(dish)}
                          className="w-10 h-10 rounded-lg bg-primary hover:bg-primary text-on-primary flex items-center justify-center transition-colors active:scale-90"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating Cart Button */}
      {cartCount > 0 && (
        <div 
          onClick={toggleCart}
          className={`fixed bottom-6 z-30 pointer-events-auto transition-all duration-300 shadow-[0_8px_30px_rgb(0,0,0,0.4)] shadow-primary/30 bg-primary hover:bg-primary/90 text-on-primary rounded-full px-6 py-4 flex items-center justify-between gap-4 cursor-pointer active:scale-95 border border-primary/50 ${
            showCart ? 'hidden' : 'left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-md lg:left-auto lg:right-8 lg:-translate-x-0 lg:w-auto lg:min-w-[300px]'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="relative shrink-0">
              <ShoppingCart className="w-6 h-6" />
              <span className="absolute -top-2 -right-2 bg-slate-900 text-primary text-xs w-5 h-5 rounded-full flex items-center justify-center font-black">
                {cartCount}
              </span>
            </div>
            <span className="font-bold text-lg whitespace-nowrap">Ver Pedido</span>
          </div>
          <span className="font-black text-xl whitespace-nowrap">${cartTotal.toFixed(2)}</span>
        </div>
      )}

      {/* Cart Drawer */}
      {showCart && <CartDrawer />}
    </div>
  );
}
