import * as admin from 'firebase-admin';

export async function hardResetSystemUseCase(secretToken: string) {
  if (secretToken !== 'DESTROY_AND_REBUILD_2026') {
    throw new Error('Invalid Secret Token');
  }

  const auth = admin.auth();
  const db = admin.firestore();

  // 1. Delete all Auth Users
  console.log('Borrando usuarios de Auth...');
  let nextPageToken;
  do {
    const listUsersResult = await auth.listUsers(1000, nextPageToken);
    const uids = listUsersResult.users.map((userRecord) => userRecord.uid);
    if (uids.length > 0) {
      await auth.deleteUsers(uids);
    }
    nextPageToken = listUsersResult.pageToken;
  } while (nextPageToken);

  // 2. Delete known Firestore Collections
  console.log('Borrando documentos de Firestore...');
  const collections = ['orders', 'inventory', 'menu', 'tables', 'ventasLog', 'users'];
  for (const collectionName of collections) {
    const snapshot = await db.collection(collectionName).get();
    const batch = db.batch();
    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    // Commit in chunks of 500 if necessary, but assuming <500 for test DB
    if (snapshot.docs.length > 0) {
      await batch.commit();
    }
  }

  // 3. Reseed Auth: Super Admin
  console.log('Creando Super Admin...');
  const adminUser = await auth.createUser({
    email: 'admin@restaurante.com',
    password: 'Admin123!',
    displayName: 'Super Administrador',
  });
  await auth.setCustomUserClaims(adminUser.uid, { role: 'admin' });

  // 4. Reseed Firestore: Basic Menu
  console.log('Sembrando Menú...');
  const menuRef = db.collection('menu');
  await menuRef.doc('P001').set({
    ID_Plato: 'P001',
    Nombre_Plato: 'Tacos al Pastor (Orden)',
    Precio: 15.00,
    Categoria: 'Platos Fuertes',
    Tiempo_Preparacion: '15 min',
    Activo: true
  });
  await menuRef.doc('P002').set({
    ID_Plato: 'P002',
    Nombre_Plato: 'Cerveza Artesanal',
    Precio: 6.00,
    Categoria: 'Bebidas',
    Tiempo_Preparacion: '5 min',
    Activo: true
  });
  
  // 5. Reseed Firestore: Basic Inventory
  console.log('Sembrando Inventario...');
  const invRef = db.collection('almacen');
  await invRef.doc('ING001').set({
    ID_Ingrediente: 'ING001',
    Nombre: 'Carne al Pastor',
    Stock_Gramos: 5000,
    Costo_Por_Gramo: 0.02
  });
  await invRef.doc('ING002').set({
    ID_Ingrediente: 'ING002',
    Nombre: 'Barril de Cerveza',
    Stock_Gramos: 30000,
    Costo_Por_Gramo: 0.005
  });

  console.log('¡Reseed Completo!');
  return { 
    message: 'Hard Reset y Reseed Completado Exitosamente',
    adminCreated: 'admin@restaurante.com / Admin123!'
  };
}
