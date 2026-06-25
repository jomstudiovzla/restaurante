import { create } from 'zustand';
import { MenuItem, Ingrediente, almacen as initialAlmacen, recetas, ventasLog as initialVentasLog, VentaLog, StockCocina, RegistroMerma, MovimientoInventario, inventarioCocinaMock, registroMermasMock, movimientosLogMock, EstacionPrinter, SuscripcionSaaS, TicketSoporte, estacionesMock, suscripcionMock, ticketsSoporteMock } from '@/data/menu';

export type OrderStatus = 'PENDIENTE' | 'EN_PREPARACION' | 'LISTO' | 'ENTREGADO' | 'CANCELADO';

export interface CartItem {
  dish: MenuItem;
  quantity: number;
  notes?: string;
}

export interface Transaction {
  id: string;
  amount: number;
  method: 'EFECTIVO' | 'TARJETA' | 'APPLE_PAY' | 'GOOGLE_PAY' | 'MIXTO';
  tip?: number;
  timestamp: string;
}

export interface Order {
  id: string;
  mesa: number;
  items: CartItem[];
  status: OrderStatus;
  paymentStatus: 'PENDIENTE' | 'PAGADO' | 'PAGADO_PARCIAL';
  transactions: Transaction[];
  balanceDue: number;
  tip?: number;
  timestamp: string;
  total: number;
  customerName?: string;
}

export type AppView = 'menu' | 'kitchen' | 'pos' | 'inventory' | 'crm' | 'admin' | 'auth' | 'miseenplace' | 'saas' | 'onboarding';
export type UserRole = 'cliente' | 'cocinero' | 'cajero' | 'admin';

interface AppState {
  // Navigation
  currentView: AppView;
  setView: (view: AppView) => void;
  
  // Role
  currentRole: UserRole;
  setRole: (role: UserRole) => void;
  
  // Mesa
  currentMesa: number;
  setMesa: (mesa: number) => void;
  
  // Cart
  cart: CartItem[];
  addToCart: (dish: MenuItem) => void;
  removeFromCart: (dishId: string) => void;
  updateQuantity: (dishId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  
  // Orders
  orders: Order[];
  addOrder: (order: Omit<Order, 'id' | 'timestamp' | 'transactions' | 'balanceDue'>) => string;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  addTransaction: (orderId: string, amount: number, method: Transaction['method'], tip?: number) => void;
  
  // Inventory (simulated real-time)
  almacen: Ingrediente[];
  deductInventory: (platoId: string, cantidad: number) => void;
  updateStock: (ingredienteId: string, newStock: number) => void;
  
  // Advanced Inventory
  stockCocina: StockCocina[];
  registroMermas: RegistroMerma[];
  movimientosLog: MovimientoInventario[];
  
  ingresarMercancia: (ingredienteId: string, cantidadGramos: number, usuario: string, fotoUrl?: string) => void;
  extraerAlmacen: (ingredienteId: string, cantidadGramos: number, usuario: string) => void;
  registrarPorcionado: (ingredienteId: string, porciones: number, pesoPorcion: number, usuario: string, fotoUrl?: string) => void;
  registrarLote: (ingredienteId: string, cantidadProducida: number, unidad: string, usuario: string, fotoUrl?: string) => void;
  registrarMerma: (idReferencia: string, cantidad: number, unidad: string, motivo: string, usuario: string) => void;

  // Sales Log
  ventasLog: VentaLog[];
  
  // Legal consent
  consentAccepted: boolean;
  acceptConsent: () => void;
  
  // UI state
  showCart: boolean;
  toggleCart: () => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;

  // Enrutamiento / Estaciones
  estaciones: EstacionPrinter[];
  updateEstacion: (estacion: EstacionPrinter) => void;

  // SaaS y Soporte
  suscripcionSaaS: SuscripcionSaaS;
  ticketsSoporte: TicketSoporte[];
  crearTicketSoporte: (asunto: string) => void;
  actualizarSuscripcion: (plan: 'Base' | 'Premium') => void;
}

export const useStore = create<AppState>((set, get) => ({
  currentView: 'menu',
  setView: (view) => set({ currentView: view }),
  
  currentRole: 'cliente',
  setRole: (role) => set({ currentRole: role }),
  
  currentMesa: 3,
  setMesa: (mesa) => set({ currentMesa: mesa }),
  
  cart: [],
  addToCart: (dish) => set((state) => {
    const existing = state.cart.find(item => item.dish.ID_Plato === dish.ID_Plato);
    if (existing) {
      return {
        cart: state.cart.map(item =>
          item.dish.ID_Plato === dish.ID_Plato
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ),
      };
    }
    return { cart: [...state.cart, { dish, quantity: 1 }] };
  }),
  removeFromCart: (dishId) => set((state) => ({
    cart: state.cart.filter(item => item.dish.ID_Plato !== dishId),
  })),
  updateQuantity: (dishId, quantity) => set((state) => ({
    cart: quantity <= 0
      ? state.cart.filter(item => item.dish.ID_Plato !== dishId)
      : state.cart.map(item =>
          item.dish.ID_Plato === dishId ? { ...item, quantity } : item
        ),
  })),
  clearCart: () => set({ cart: [] }),
  getCartTotal: () => {
    const state = get();
    return state.cart.reduce((sum, item) => sum + item.dish.Precio * item.quantity, 0);
  },
  
  orders: [
    {
      id: 'ORD-001',
      mesa: 7,
      items: [{ dish: { ID_Plato: 'P003', Nombre_Plato: 'Filete Angus a la Parrilla', Precio: 28.50, Categoria: 'Platos Fuertes', Activo: true, Foto_URL: '', Descripcion: '', Tiempo_Preparacion: '25 min' }, quantity: 2 }],
      status: 'EN_PREPARACION',
      paymentStatus: 'PENDIENTE',
      transactions: [],
      balanceDue: 57.00,
      timestamp: new Date(Date.now() - 600000).toISOString(),
      total: 57.00,
    },
    {
      id: 'ORD-002',
      mesa: 1,
      items: [
        { dish: { ID_Plato: 'P001', Nombre_Plato: 'Ensalada Fit Premium', Precio: 12.00, Categoria: 'Entradas', Activo: true, Foto_URL: '', Descripcion: '', Tiempo_Preparacion: '10 min' }, quantity: 1 },
        { dish: { ID_Plato: 'P007', Nombre_Plato: 'Limonada de la Casa', Precio: 4.00, Categoria: 'Bebidas', Activo: true, Foto_URL: '', Descripcion: '', Tiempo_Preparacion: '5 min' }, quantity: 2 },
      ],
      status: 'PENDIENTE',
      paymentStatus: 'PENDIENTE',
      transactions: [],
      balanceDue: 20.00,
      timestamp: new Date(Date.now() - 120000).toISOString(),
      total: 20.00,
    },
    {
      id: 'ORD-003',
      mesa: 5,
      items: [{ dish: { ID_Plato: 'P009', Nombre_Plato: 'Risotto de Hongos Silvestres', Precio: 18.50, Categoria: 'Platos Fuertes', Activo: true, Foto_URL: '', Descripcion: '', Tiempo_Preparacion: '22 min' }, quantity: 1 }],
      status: 'LISTO',
      paymentStatus: 'PENDIENTE',
      transactions: [],
      balanceDue: 18.50,
      timestamp: new Date(Date.now() - 900000).toISOString(),
      total: 18.50,
    },
  ],
  addOrder: (order) => {
    let newId = '';
    set((state) => {
      newId = `ORD-${String(state.orders.length + 1).padStart(3, '0')}`;
      const newOrder: Order = {
        ...order,
        id: newId,
        paymentStatus: order.paymentStatus || 'PENDIENTE',
        transactions: [],
        balanceDue: order.total,
        timestamp: new Date().toISOString(),
      };
      return { orders: [...state.orders, newOrder] };
    });
    return newId;
  },
  updateOrderStatus: (orderId, status) => set((state) => ({
    orders: state.orders.map(order =>
      order.id === orderId ? { ...order, status } : order
    ),
  })),
  addTransaction: (orderId, amount, method, tip) => set((state) => {
    const order = state.orders.find(o => o.id === orderId);
    if (!order) return state;

    const newBalance = Math.max(0, order.balanceDue - amount);
    const newPaymentStatus = newBalance <= 0 ? 'PAGADO' : 'PAGADO_PARCIAL';

    const transaction: Transaction = {
      id: `TXN-${Date.now()}`,
      amount,
      method,
      tip,
      timestamp: new Date().toISOString(),
    };

    return {
      orders: state.orders.map(o => 
        o.id === orderId 
          ? { 
              ...o, 
              balanceDue: newBalance, 
              paymentStatus: newPaymentStatus,
              transactions: [...o.transactions, transaction] 
            } 
          : o
      )
    };
  }),
  
  almacen: initialAlmacen,
  deductInventory: (platoId, cantidad) => set((state) => {
    const ingredientesPlato = recetas.filter(r => r.ID_Plato === platoId);
    let newAlmacen = [...state.almacen];
    let newStockCocina = [...state.stockCocina];
    
    for (const receta of ingredientesPlato) {
      if (receta.Tipo_Control === 'Porcion') {
        const idx = newStockCocina.findIndex(i => i.ID_Ingrediente === receta.ID_Ingrediente && i.Tipo === 'Porcion');
        if (idx !== -1) {
          newStockCocina[idx] = {
            ...newStockCocina[idx],
            Cantidad: Math.max(0, newStockCocina[idx].Cantidad - cantidad), // 1 plato = 1 porción
          };
        }
      } else if (receta.Tipo_Control === 'Lote') {
        // Los lotes no se descuentan automáticamente en el POS por cada plato.
      } else {
        // Fallback for ingredients not explicitly marked or generic ones (not strictly tracked)
        const idx = newAlmacen.findIndex(i => i.ID_Ingrediente === receta.ID_Ingrediente);
        if (idx !== -1) {
          const gramosDescontar = receta.Cantidad_Gramos * cantidad;
          newAlmacen[idx] = {
            ...newAlmacen[idx],
            Stock_Gramos: Math.max(0, newAlmacen[idx].Stock_Gramos - gramosDescontar),
          };
        }
      }
    }
    
    return { almacen: newAlmacen, stockCocina: newStockCocina };
  }),
  updateStock: (ingredienteId, newStock) => set((state) => ({
    almacen: state.almacen.map(i =>
      i.ID_Ingrediente === ingredienteId ? { ...i, Stock_Gramos: newStock } : i
    ),
  })),

  stockCocina: inventarioCocinaMock,
  registroMermas: registroMermasMock,
  movimientosLog: movimientosLogMock,

  ingresarMercancia: (id, cantidad, usuario, fotoUrl) => set(state => {
    const ing = state.almacen.find(i => i.ID_Ingrediente === id);
    if (!ing) return state;
    
    const newAlmacen = state.almacen.map(i => i.ID_Ingrediente === id ? { ...i, Stock_Gramos: i.Stock_Gramos + cantidad } : i);
    const mov: MovimientoInventario = {
      ID_Movimiento: `MOV-${Date.now()}`,
      Tipo: 'INGRESO_ALMACEN',
      ID_Item: id,
      Nombre_Item: ing.Nombre_Ingrediente,
      Cantidad: cantidad,
      Unidad: 'g',
      Fecha_Hora: new Date().toISOString(),
      Usuario: usuario,
      Foto_URL: fotoUrl
    };
    return { almacen: newAlmacen, movimientosLog: [mov, ...state.movimientosLog] };
  }),

  extraerAlmacen: (id, cantidad, usuario) => set(state => {
    const ing = state.almacen.find(i => i.ID_Ingrediente === id);
    if (!ing) return state;
    
    const newAlmacen = state.almacen.map(i => i.ID_Ingrediente === id ? { ...i, Stock_Gramos: Math.max(0, i.Stock_Gramos - cantidad) } : i);
    const mov: MovimientoInventario = {
      ID_Movimiento: `MOV-${Date.now()}`,
      Tipo: 'SALIDA_ALMACEN',
      ID_Item: id,
      Nombre_Item: ing.Nombre_Ingrediente,
      Cantidad: cantidad,
      Unidad: 'g',
      Fecha_Hora: new Date().toISOString(),
      Usuario: usuario
    };
    return { almacen: newAlmacen, movimientosLog: [mov, ...state.movimientosLog] };
  }),

  registrarPorcionado: (id, porciones, pesoPorcion, usuario, fotoUrl) => set(state => {
    const ing = state.almacen.find(i => i.ID_Ingrediente === id);
    const newIdCocina = `C-${Date.now()}`;
    const nuevoStock: StockCocina = {
      ID_Cocina: newIdCocina,
      ID_Ingrediente: id,
      Nombre: `${ing?.Nombre_Ingrediente || 'Proteína'} (${pesoPorcion}g)`,
      Tipo: 'Porcion',
      Cantidad: porciones,
      Unidad: 'porciones',
      Fecha_Preparacion: new Date().toISOString(),
      Foto_URL: fotoUrl
    };

    const mov: MovimientoInventario = {
      ID_Movimiento: `MOV-${Date.now()}`,
      Tipo: 'PORCIONADO_PROTEINA',
      ID_Item: id,
      Nombre_Item: nuevoStock.Nombre,
      Cantidad: porciones,
      Unidad: 'porciones',
      Fecha_Hora: new Date().toISOString(),
      Usuario: usuario,
      Foto_URL: fotoUrl
    };

    return { 
      stockCocina: [nuevoStock, ...state.stockCocina],
      movimientosLog: [mov, ...state.movimientosLog]
    };
  }),

  registrarLote: (id, cantidad, unidad, usuario, fotoUrl) => set(state => {
    const ing = state.almacen.find(i => i.ID_Ingrediente === id) || { Nombre_Ingrediente: 'Preparación' };
    const nuevoStock: StockCocina = {
      ID_Cocina: `L-${Date.now()}`,
      ID_Ingrediente: id,
      Nombre: `Lote ${ing.Nombre_Ingrediente}`,
      Tipo: 'Lote',
      Cantidad: cantidad,
      Unidad: unidad,
      Fecha_Preparacion: new Date().toISOString(),
      Foto_URL: fotoUrl
    };

    const mov: MovimientoInventario = {
      ID_Movimiento: `MOV-${Date.now()}`,
      Tipo: 'PRODUCCION_LOTE',
      ID_Item: id,
      Nombre_Item: nuevoStock.Nombre,
      Cantidad: cantidad,
      Unidad: unidad,
      Fecha_Hora: new Date().toISOString(),
      Usuario: usuario,
      Foto_URL: fotoUrl
    };

    return { 
      stockCocina: [nuevoStock, ...state.stockCocina],
      movimientosLog: [mov, ...state.movimientosLog]
    };
  }),

  registrarMerma: (id, cantidad, unidad, motivo, usuario) => set(state => {
    const merma: RegistroMerma = {
      ID_Merma: `M-${Date.now()}`,
      ID_Ingrediente_O_Cocina: id,
      Nombre: `Ref: ${id}`,
      Cantidad: cantidad,
      Unidad: unidad,
      Motivo: motivo,
      Fecha_Hora: new Date().toISOString(),
      Usuario: usuario
    };

    const mov: MovimientoInventario = {
      ID_Movimiento: `MOV-${Date.now()}`,
      Tipo: 'MERMA',
      ID_Item: id,
      Nombre_Item: `Merma de ${id}`,
      Cantidad: cantidad,
      Unidad: unidad,
      Fecha_Hora: new Date().toISOString(),
      Usuario: usuario,
      Notas: motivo
    };

    return {
      registroMermas: [merma, ...state.registroMermas],
      movimientosLog: [mov, ...state.movimientosLog]
    };
  }),
  
  ventasLog: initialVentasLog,
  
  consentAccepted: false,
  acceptConsent: () => set({ consentAccepted: true }),
  
  showCart: false,
  toggleCart: () => set((state) => ({ showCart: !state.showCart })),
  selectedCategory: 'Todas',
  setSelectedCategory: (cat) => set({ selectedCategory: cat }),

  estaciones: estacionesMock,
  updateEstacion: (updatedEstacion) => set(state => ({
    estaciones: state.estaciones.map(est => est.ID_Estacion === updatedEstacion.ID_Estacion ? updatedEstacion : est)
  })),

  suscripcionSaaS: suscripcionMock,
  ticketsSoporte: ticketsSoporteMock,
  
  crearTicketSoporte: (asunto) => set(state => {
    let costo = 0;
    if (state.suscripcionSaaS.Plan === 'Base' && state.suscripcionSaaS.Tickets_Gratis_Restantes <= 0) {
      costo = 15; // Costo por evento
    }
    
    const nuevoTicket: TicketSoporte = {
      ID_Ticket: `TK-${Date.now()}`,
      Fecha: new Date().toISOString().split('T')[0],
      Asunto,
      Estado: 'Abierto',
      Costo: costo,
      Facturado: false
    };

    return {
      ticketsSoporte: [nuevoTicket, ...state.ticketsSoporte],
      suscripcionSaaS: {
        ...state.suscripcionSaaS,
        Tickets_Gratis_Restantes: Math.max(0, state.suscripcionSaaS.Tickets_Gratis_Restantes - 1)
      }
    };
  }),

  actualizarSuscripcion: (plan) => set(state => ({
    suscripcionSaaS: {
      ...state.suscripcionSaaS,
      Plan: plan,
      PrecioMensual: plan === 'Premium' ? 49.99 : 29.99
    }
  })),
}));
