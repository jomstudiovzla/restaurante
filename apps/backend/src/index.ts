import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { processOrderUseCase } from './use-cases/processOrder';
import { FirestoreInventoryRepository } from './infrastructure/FirestoreInventoryRepository';
import { createUserUseCase, CreateUserDTO } from './use-cases/createUser';
import { requireAdmin } from './infrastructure/middlewares/authMiddleware';
import { hardResetSystemUseCase } from './use-cases/hardReset';

admin.initializeApp();

const db = admin.firestore();
const inventoryRepo = new FirestoreInventoryRepository(db);

/**
 * Cloud Function triggered when a new order is created or its status changes.
 * This function processes the order to deduct ingredients precisely (milligrams/grams)
 * using a Firestore transaction to prevent race conditions.
 */
export const onOrderCreated = functions.firestore
  .document('orders/{orderId}')
  .onCreate(async (snap, context) => {
    const orderData = snap.data();
    const orderId = context.params.orderId;
    
    try {
      await processOrderUseCase(orderId, orderData, inventoryRepo);
      console.log(`Order ${orderId} processed successfully. Inventory updated.`);
    } catch (error) {
      console.error(`Error processing order ${orderId}:`, error);
      // Depending on business rules, we might mark the order as 'failed' here.
    }
  });

/**
 * Cloud Function (Callable): Create User with RBAC
 * Requires Admin privileges.
 */
export const createUserEndpoint = functions.https.onCall(async (data: CreateUserDTO, context) => {
  // 1. RBAC Guard: Verify the caller is authenticated and is an Admin
  requireAdmin(context);

  // 2. Execute the Core Use Case
  try {
    const result = await createUserUseCase(data);
    return { success: true, data: result, message: 'Usuario creado y rol asignado correctamente.' };
  } catch (error: any) {
    console.error('Create User Error:', error);
    throw new functions.https.HttpsError('invalid-argument', error.message || 'Error al crear el usuario.');
  }
});

/**
 * Cloud Function (HTTP): DEV ONLY Hard Reset
 * WARNING: Destructive operation
 */
export const devHardReset = functions.https.onRequest(async (req, res) => {
  const secretToken = req.query.token as string;
  try {
    const result = await hardResetSystemUseCase(secretToken);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(403).json({ error: error.message });
  }
});
