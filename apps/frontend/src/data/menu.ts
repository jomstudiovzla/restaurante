// Restaurant_DB - Menu Sheet (Simulated)
export interface MenuItem {
  ID_Plato: string;
  Nombre_Plato: string;
  Precio: number;
  Categoria: 'Entradas' | 'Platos Fuertes' | 'Bebidas' | 'Postres';
  Activo: boolean;
  Foto_URL: string;
  Descripcion: string;
  Tiempo_Preparacion: string;
  Alergenos?: string[];
}

export interface Ingrediente {
  ID_Ingrediente: string;
  Nombre_Ingrediente: string;
  Stock_Gramos: number;
  Stock_Minimo: number;
  Costo_Gramo: number;
  Proveedor: string;
}

export interface Receta {
  ID_Receta: string;
  ID_Plato: string;
  ID_Ingrediente: string;
  Cantidad_Gramos: number;
  Unidad: string;
  Merma_Porcentaje: number;
  Tipo_Control: 'Porcion' | 'Lote';
}

export interface StockCocina {
  ID_Cocina: string;
  ID_Ingrediente: string;
  Nombre: string;
  Tipo: 'Porcion' | 'Lote';
  Cantidad: number; // Número de porciones (Categoría A) o Mililitros/Gramos producidos (Categoría B)
  Unidad: string;
  Fecha_Preparacion: string;
  Foto_URL?: string; // Evidencia visual
}

export interface RegistroMerma {
  ID_Merma: string;
  ID_Ingrediente_O_Cocina: string;
  Nombre: string;
  Cantidad: number;
  Unidad: string;
  Motivo: string;
  Fecha_Hora: string;
  Usuario: string;
}

export interface MovimientoInventario {
  ID_Movimiento: string;
  Tipo: 'INGRESO_ALMACEN' | 'SALIDA_ALMACEN' | 'PORCIONADO_PROTEINA' | 'PRODUCCION_LOTE' | 'MERMA' | 'VENTA';
  ID_Item: string;
  Nombre_Item: string;
  Cantidad: number;
  Unidad: string;
  Fecha_Hora: string;
  Usuario: string;
  Foto_URL?: string;
  Notas?: string;
}

export interface VentaLog {
  Fecha_Hora: string;
  Mesa: number;
  ID_Plato: string;
  Cantidad: number;
  Total: number;
  Estatus: string;
  Movimiento_Tipo: string;
  Usuario: string;
  Stock_Resultante: number;
}

export interface ClienteCRM {
  ID_Cliente: string;
  Nombre: string;
  Email: string;
  Telefono: string;
  Preferencias: string;
  Historial_Pedidos: string;
  Fecha_Registro: string;
}

export interface EstacionPrinter {
  ID_Estacion: string;
  Nombre: string; // Ej. Barra, Cocina Principal, Horno
  Direccion_IP: string; // IP o MAC Bluetooth
  Categorias: string[]; // Categorías que se imprimen en esta estación
}

export interface SuscripcionSaaS {
  Plan: 'Base' | 'Premium';
  PrecioMensual: number;
  Estado: 'Activo' | 'Suspendido';
  Tickets_Gratis_Restantes: number;
}

export interface TicketSoporte {
  ID_Ticket: string;
  Fecha: string;
  Asunto: string;
  Estado: 'Abierto' | 'En Progreso' | 'Resuelto';
  Costo: number;
  Facturado: boolean;
}

export const menuItems: MenuItem[] = [
  {
    ID_Plato: 'P001',
    Nombre_Plato: 'Ensalada Fit Premium',
    Precio: 12.00,
    Categoria: 'Entradas',
    Activo: true,
    Foto_URL: 'https://images.pexels.com/photos/36904791/pexels-photo-36904791.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    Descripcion: 'Lechuga orgánica, tomate cherry, quinoa, aguacate y aderezo balsámico artesanal.',
    Tiempo_Preparacion: '10 min',
    Alergenos: ['Frutos secos'],
  },
  {
    ID_Plato: 'P002',
    Nombre_Plato: 'Té Helado Natural',
    Precio: 3.50,
    Categoria: 'Bebidas',
    Activo: true,
    Foto_URL: 'https://images.pexels.com/photos/37515893/pexels-photo-37515893.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    Descripcion: 'Té negro con limón natural, menta fresca y endulzado con miel orgánica.',
    Tiempo_Preparacion: '3 min',
  },
  {
    ID_Plato: 'P003',
    Nombre_Plato: 'Filete Angus a la Parrilla',
    Precio: 28.50,
    Categoria: 'Platos Fuertes',
    Activo: true,
    Foto_URL: 'https://images.pexels.com/photos/20051271/pexels-photo-20051271.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    Descripcion: 'Corte premium de res Angus (300g), cocinado al carbón con reducción de vino tinto y guarnición de vegetales.',
    Tiempo_Preparacion: '25 min',
    Alergenos: ['Sulfitos'],
  },
  {
    ID_Plato: 'P004',
    Nombre_Plato: 'Bowl Mediterráneo',
    Precio: 15.00,
    Categoria: 'Entradas',
    Activo: true,
    Foto_URL: 'https://images.pexels.com/photos/8697517/pexels-photo-8697517.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    Descripcion: 'Arroz integral, falafel casero, hummus, pepino, tomate y salsa tahini.',
    Tiempo_Preparacion: '12 min',
    Alergenos: ['Sésamo', 'Gluten'],
  },
  {
    ID_Plato: 'P005',
    Nombre_Plato: 'Volcán de Chocolate',
    Precio: 9.50,
    Categoria: 'Postres',
    Activo: true,
    Foto_URL: 'https://images.pexels.com/photos/9271569/pexels-photo-9271569.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    Descripcion: 'Pastel de chocolate fundido con centro líquido, acompañado de helado de vainilla y frutos rojos.',
    Tiempo_Preparacion: '15 min',
    Alergenos: ['Lácteos', 'Huevo', 'Gluten'],
  },
  {
    ID_Plato: 'P006',
    Nombre_Plato: 'Salmón Teriyaki',
    Precio: 24.00,
    Categoria: 'Platos Fuertes',
    Activo: true,
    Foto_URL: 'https://images.pexels.com/photos/1327393/pexels-photo-1327393.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
    Descripcion: 'Filete de salmón atlántico glaseado en salsa teriyaki sobre cama de arroz jazmín con edamames.',
    Tiempo_Preparacion: '20 min',
    Alergenos: ['Soya', 'Pescado'],
  },
  {
    ID_Plato: 'P007',
    Nombre_Plato: 'Limonada de la Casa',
    Precio: 4.00,
    Categoria: 'Bebidas',
    Activo: true,
    Foto_URL: 'https://images.pexels.com/photos/37515884/pexels-photo-37515884.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    Descripcion: 'Limones frescos, hierbabuena, jengibre y un toque de chía. Refrescante y natural.',
    Tiempo_Preparacion: '5 min',
  },
  {
    ID_Plato: 'P008',
    Nombre_Plato: 'Tiramisú Clásico',
    Precio: 8.00,
    Categoria: 'Postres',
    Activo: true,
    Foto_URL: 'https://images.pexels.com/photos/15823267/pexels-photo-15823267.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    Descripcion: 'Capas de mascarpone cremoso, bizcocho empapado en espresso y cacao amargo importado.',
    Tiempo_Preparacion: '8 min',
    Alergenos: ['Lácteos', 'Huevo', 'Gluten', 'Cafeína'],
  },
  {
    ID_Plato: 'P009',
    Nombre_Plato: 'Risotto de Hongos Silvestres',
    Precio: 18.50,
    Categoria: 'Platos Fuertes',
    Activo: true,
    Foto_URL: 'https://images.pexels.com/photos/6327536/pexels-photo-6327536.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
    Descripcion: 'Arroz arbóreo cremoso con mezcla de hongos porcini, shiitake y trufa negra rallada.',
    Tiempo_Preparacion: '22 min',
    Alergenos: ['Lácteos'],
  },
  {
    ID_Plato: 'P010',
    Nombre_Plato: 'Power Bowl de Camarones',
    Precio: 16.50,
    Categoria: 'Entradas',
    Activo: true,
    Foto_URL: 'https://images.pexels.com/photos/5514819/pexels-photo-5514819.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    Descripcion: 'Camarones salteados, edamame, mango, aguacate, col morada y aderezo de sésamo.',
    Tiempo_Preparacion: '14 min',
    Alergenos: ['Mariscos', 'Sésamo'],
  },
];

export const almacen: Ingrediente[] = [
  { ID_Ingrediente: 'I001', Nombre_Ingrediente: 'Lechuga Orgánica', Stock_Gramos: 5000, Stock_Minimo: 500, Costo_Gramo: 0.02, Proveedor: 'Distribuidora Central' },
  { ID_Ingrediente: 'I002', Nombre_Ingrediente: 'Hojas de Té Negro', Stock_Gramos: 2000, Stock_Minimo: 200, Costo_Gramo: 0.05, Proveedor: 'Importaciones Agrícolas' },
  { ID_Ingrediente: 'I003', Nombre_Ingrediente: 'Filete Angus', Stock_Gramos: 15000, Stock_Minimo: 3000, Costo_Gramo: 0.12, Proveedor: 'Carnes Premium MX' },
  { ID_Ingrediente: 'I004', Nombre_Ingrediente: 'Tomate Cherry', Stock_Gramos: 3000, Stock_Minimo: 500, Costo_Gramo: 0.03, Proveedor: 'Distribuidora Central' },
  { ID_Ingrediente: 'I005', Nombre_Ingrediente: 'Quinoa', Stock_Gramos: 4000, Stock_Minimo: 800, Costo_Gramo: 0.04, Proveedor: 'Granos Andinos' },
  { ID_Ingrediente: 'I006', Nombre_Ingrediente: 'Chocolate 70%', Stock_Gramos: 3500, Stock_Minimo: 500, Costo_Gramo: 0.08, Proveedor: 'Cacao Fino Export' },
  { ID_Ingrediente: 'I007', Nombre_Ingrediente: 'Salmón Atlántico', Stock_Gramos: 8000, Stock_Minimo: 2000, Costo_Gramo: 0.15, Proveedor: 'Pesquera del Pacífico' },
  { ID_Ingrediente: 'I008', Nombre_Ingrediente: 'Arroz Arbóreo', Stock_Gramos: 6000, Stock_Minimo: 1000, Costo_Gramo: 0.03, Proveedor: 'Granos Importados' },
  { ID_Ingrediente: 'I009', Nombre_Ingrediente: 'Limones', Stock_Gramos: 4000, Stock_Minimo: 800, Costo_Gramo: 0.01, Proveedor: 'Cítricos del Valle' },
  { ID_Ingrediente: 'I010', Nombre_Ingrediente: 'Mascarpone', Stock_Gramos: 2500, Stock_Minimo: 400, Costo_Gramo: 0.06, Proveedor: 'Lácteos Europeos' },
  { ID_Ingrediente: 'I011', Nombre_Ingrediente: 'Camarones', Stock_Gramos: 5000, Stock_Minimo: 1000, Costo_Gramo: 0.14, Proveedor: 'Mariscos del Golfo' },
  { ID_Ingrediente: 'I012', Nombre_Ingrediente: 'Aguacate', Stock_Gramos: 3500, Stock_Minimo: 700, Costo_Gramo: 0.04, Proveedor: 'Aguacates Michoacán' },
  { ID_Ingrediente: 'I013', Nombre_Ingrediente: 'Hongos Porcini', Stock_Gramos: 1200, Stock_Minimo: 300, Costo_Gramo: 0.25, Proveedor: 'Hongos Gourmet' },
  { ID_Ingrediente: 'I014', Nombre_Ingrediente: 'Menta Fresca', Stock_Gramos: 800, Stock_Minimo: 150, Costo_Gramo: 0.03, Proveedor: 'Hierbas Aromáticas' },
  { ID_Ingrediente: 'I015', Nombre_Ingrediente: 'Vino Tinto (Cocina)', Stock_Gramos: 3000, Stock_Minimo: 500, Costo_Gramo: 0.02, Proveedor: 'Viñedos Selectos' },
];

export const recetas: Receta[] = [
  { ID_Receta: 'R001', ID_Plato: 'P001', ID_Ingrediente: 'I001', Cantidad_Gramos: 120, Unidad: 'g', Merma_Porcentaje: 5, Tipo_Control: 'Lote' },
  { ID_Receta: 'R002', ID_Plato: 'P001', ID_Ingrediente: 'I004', Cantidad_Gramos: 50, Unidad: 'g', Merma_Porcentaje: 3, Tipo_Control: 'Lote' },
  { ID_Receta: 'R003', ID_Plato: 'P001', ID_Ingrediente: 'I005', Cantidad_Gramos: 40, Unidad: 'g', Merma_Porcentaje: 0, Tipo_Control: 'Lote' },
  { ID_Receta: 'R004', ID_Plato: 'P001', ID_Ingrediente: 'I012', Cantidad_Gramos: 60, Unidad: 'g', Merma_Porcentaje: 10, Tipo_Control: 'Lote' },
  { ID_Receta: 'R005', ID_Plato: 'P002', ID_Ingrediente: 'I002', Cantidad_Gramos: 15, Unidad: 'g', Merma_Porcentaje: 0, Tipo_Control: 'Lote' },
  { ID_Receta: 'R006', ID_Plato: 'P002', ID_Ingrediente: 'I009', Cantidad_Gramos: 30, Unidad: 'g', Merma_Porcentaje: 5, Tipo_Control: 'Lote' },
  { ID_Receta: 'R007', ID_Plato: 'P002', ID_Ingrediente: 'I014', Cantidad_Gramos: 5, Unidad: 'g', Merma_Porcentaje: 0, Tipo_Control: 'Lote' },
  { ID_Receta: 'R008', ID_Plato: 'P003', ID_Ingrediente: 'I003', Cantidad_Gramos: 300, Unidad: 'g', Merma_Porcentaje: 8, Tipo_Control: 'Porcion' }, // Bife (Porcionado exacto)
  { ID_Receta: 'R009', ID_Plato: 'P003', ID_Ingrediente: 'I015', Cantidad_Gramos: 50, Unidad: 'g', Merma_Porcentaje: 0, Tipo_Control: 'Lote' }, // Salsa (Control por lote)
  { ID_Receta: 'R010', ID_Plato: 'P005', ID_Ingrediente: 'I006', Cantidad_Gramos: 80, Unidad: 'g', Merma_Porcentaje: 2, Tipo_Control: 'Lote' },
  { ID_Receta: 'R011', ID_Plato: 'P006', ID_Ingrediente: 'I007', Cantidad_Gramos: 250, Unidad: 'g', Merma_Porcentaje: 5, Tipo_Control: 'Porcion' }, // Salmon (Porcionado exacto)
  { ID_Receta: 'R012', ID_Plato: 'P008', ID_Ingrediente: 'I010', Cantidad_Gramos: 100, Unidad: 'g', Merma_Porcentaje: 0, Tipo_Control: 'Lote' },
  { ID_Receta: 'R013', ID_Plato: 'P008', ID_Ingrediente: 'I006', Cantidad_Gramos: 15, Unidad: 'g', Merma_Porcentaje: 0, Tipo_Control: 'Lote' },
  { ID_Receta: 'R014', ID_Plato: 'P009', ID_Ingrediente: 'I008', Cantidad_Gramos: 150, Unidad: 'g', Merma_Porcentaje: 0, Tipo_Control: 'Lote' },
  { ID_Receta: 'R015', ID_Plato: 'P009', ID_Ingrediente: 'I013', Cantidad_Gramos: 40, Unidad: 'g', Merma_Porcentaje: 3, Tipo_Control: 'Lote' },
  { ID_Receta: 'R016', ID_Plato: 'P010', ID_Ingrediente: 'I011', Cantidad_Gramos: 120, Unidad: 'g', Merma_Porcentaje: 5, Tipo_Control: 'Lote' },
  { ID_Receta: 'R017', ID_Plato: 'P010', ID_Ingrediente: 'I012', Cantidad_Gramos: 50, Unidad: 'g', Merma_Porcentaje: 10, Tipo_Control: 'Lote' },
  { ID_Receta: 'R018', ID_Plato: 'P007', ID_Ingrediente: 'I009', Cantidad_Gramos: 60, Unidad: 'g', Merma_Porcentaje: 5, Tipo_Control: 'Lote' },
  { ID_Receta: 'R019', ID_Plato: 'P007', ID_Ingrediente: 'I014', Cantidad_Gramos: 8, Unidad: 'g', Merma_Porcentaje: 0, Tipo_Control: 'Lote' },
];

export const inventarioCocinaMock: StockCocina[] = [
  { ID_Cocina: 'C001', ID_Ingrediente: 'I003', Nombre: 'Bife de Chorizo (300g)', Tipo: 'Porcion', Cantidad: 15, Unidad: 'porciones', Fecha_Preparacion: new Date().toISOString() },
  { ID_Cocina: 'C002', ID_Ingrediente: 'I007', Nombre: 'Salmón Filete (250g)', Tipo: 'Porcion', Cantidad: 10, Unidad: 'porciones', Fecha_Preparacion: new Date().toISOString() },
  { ID_Cocina: 'C003', ID_Ingrediente: 'I015', Nombre: 'Reducción Vino Tinto', Tipo: 'Lote', Cantidad: 2000, Unidad: 'ml', Fecha_Preparacion: new Date().toISOString() }
];

export const registroMermasMock: RegistroMerma[] = [];
export const movimientosLogMock: MovimientoInventario[] = [];

export const ventasLog: VentaLog[] = [
  { Fecha_Hora: '2026-06-24 07:30:00', Mesa: 3, ID_Plato: 'P001', Cantidad: 1, Total: 12.00, Estatus: 'Confirmado', Movimiento_Tipo: 'Egreso_Venta', Usuario: 'Sistema_QR', Stock_Resultante: 4880 },
  { Fecha_Hora: '2026-06-24 07:35:00', Mesa: 3, ID_Plato: 'P002', Cantidad: 2, Total: 7.00, Estatus: 'Confirmado', Movimiento_Tipo: 'Egreso_Venta', Usuario: 'Sistema_QR', Stock_Resultante: 1970 },
  { Fecha_Hora: '2026-06-24 08:10:00', Mesa: 7, ID_Plato: 'P003', Cantidad: 1, Total: 28.50, Estatus: 'Confirmado', Movimiento_Tipo: 'Egreso_Venta', Usuario: 'Sistema_QR', Stock_Resultante: 14700 },
  { Fecha_Hora: '2026-06-24 08:45:00', Mesa: 1, ID_Plato: 'P005', Cantidad: 2, Total: 19.00, Estatus: 'Confirmado', Movimiento_Tipo: 'Egreso_Venta', Usuario: 'Sistema_QR', Stock_Resultante: 3340 },
  { Fecha_Hora: '2026-06-24 09:00:00', Mesa: 5, ID_Plato: 'P006', Cantidad: 1, Total: 24.00, Estatus: 'Confirmado', Movimiento_Tipo: 'Egreso_Venta', Usuario: 'Sistema_QR', Stock_Resultante: 7800 },
  { Fecha_Hora: '2026-06-24 09:20:00', Mesa: 2, ID_Plato: 'P009', Cantidad: 1, Total: 18.50, Estatus: 'Procesado', Movimiento_Tipo: 'Egreso_Venta', Usuario: 'Sistema_QR', Stock_Resultante: 5850 },
  { Fecha_Hora: '2026-06-24 09:45:00', Mesa: 4, ID_Plato: 'P010', Cantidad: 2, Total: 33.00, Estatus: 'Confirmado', Movimiento_Tipo: 'Egreso_Venta', Usuario: 'Sistema_QR', Stock_Resultante: 4760 },
  { Fecha_Hora: '2026-06-24 10:15:00', Mesa: 6, ID_Plato: 'P004', Cantidad: 1, Total: 15.00, Estatus: 'Confirmado', Movimiento_Tipo: 'Egreso_Venta', Usuario: 'Sistema_QR', Stock_Resultante: 3900 },
];

export const clientesCRM: ClienteCRM[] = [
  { ID_Cliente: 'C001', Nombre: 'María García', Email: 'maria.garcia@email.com', Telefono: '+52 55 1234 5678', Preferencias: 'Vegetariana, Sin gluten', Historial_Pedidos: 'P001, P002, P004', Fecha_Registro: '2026-01-15' },
  { ID_Cliente: 'C002', Nombre: 'Carlos López', Email: 'carlos.lopez@email.com', Telefono: '+52 55 8765 4321', Preferencias: 'Cortes de carne, Vinos', Historial_Pedidos: 'P003, P003, P005', Fecha_Registro: '2026-02-20' },
  { ID_Cliente: 'C003', Nombre: 'Ana Martínez', Email: 'ana.martinez@email.com', Telefono: '+52 55 2468 1357', Preferencias: 'Mariscos, Postres', Historial_Pedidos: 'P006, P008, P010', Fecha_Registro: '2026-03-10' },
  { ID_Cliente: 'C004', Nombre: 'Roberto Hernández', Email: 'roberto.h@email.com', Telefono: '+52 55 1357 2468', Preferencias: 'Comida ligera', Historial_Pedidos: 'P001, P007, P004', Fecha_Registro: '2026-04-05' },
  { ID_Cliente: 'C005', Nombre: 'Sofía Ramírez', Email: 'sofia.ram@email.com', Telefono: '+52 55 9876 5432', Preferencias: 'Todo tipo, Frecuente', Historial_Pedidos: 'P003, P005, P009, P002', Fecha_Registro: '2026-05-18' },
];

export const estacionesMock: EstacionPrinter[] = [
  { ID_Estacion: 'EST-001', Nombre: 'Barra', Direccion_IP: '192.168.1.101', Categorias: ['Bebidas'] },
  { ID_Estacion: 'EST-002', Nombre: 'Cocina Principal', Direccion_IP: '192.168.1.102', Categorias: ['Platos Fuertes', 'Entradas'] },
  { ID_Estacion: 'EST-003', Nombre: 'Reposteria', Direccion_IP: '192.168.1.103', Categorias: ['Postres'] },
];

export const suscripcionMock: SuscripcionSaaS = {
  Plan: 'Base',
  PrecioMensual: 29.99,
  Estado: 'Activo',
  Tickets_Gratis_Restantes: 3,
};

export const ticketsSoporteMock: TicketSoporte[] = [
  { ID_Ticket: 'TK-1001', Fecha: '2026-05-10', Asunto: 'Onboarding y Setup Inicial', Estado: 'Resuelto', Costo: 0, Facturado: true },
];


export const categories = ['Todas', 'Entradas', 'Platos Fuertes', 'Bebidas', 'Postres'] as const;
