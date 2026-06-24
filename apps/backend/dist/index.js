"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.devHardReset = exports.createUserEndpoint = exports.onOrderCreated = void 0;
const admin = __importStar(require("firebase-admin"));
const functions = __importStar(require("firebase-functions"));
const processOrder_1 = require("./use-cases/processOrder");
const FirestoreInventoryRepository_1 = require("./infrastructure/FirestoreInventoryRepository");
const createUser_1 = require("./use-cases/createUser");
const authMiddleware_1 = require("./infrastructure/middlewares/authMiddleware");
const hardReset_1 = require("./use-cases/hardReset");
admin.initializeApp();
const db = admin.firestore();
const inventoryRepo = new FirestoreInventoryRepository_1.FirestoreInventoryRepository(db);
/**
 * Cloud Function triggered when a new order is created or its status changes.
 * This function processes the order to deduct ingredients precisely (milligrams/grams)
 * using a Firestore transaction to prevent race conditions.
 */
exports.onOrderCreated = functions.firestore
    .document('orders/{orderId}')
    .onCreate(async (snap, context) => {
    const orderData = snap.data();
    const orderId = context.params.orderId;
    try {
        await (0, processOrder_1.processOrderUseCase)(orderId, orderData, inventoryRepo);
        console.log(`Order ${orderId} processed successfully. Inventory updated.`);
    }
    catch (error) {
        console.error(`Error processing order ${orderId}:`, error);
        // Depending on business rules, we might mark the order as 'failed' here.
    }
});
/**
 * Cloud Function (Callable): Create User with RBAC
 * Requires Admin privileges.
 */
exports.createUserEndpoint = functions.https.onCall(async (data, context) => {
    // 1. RBAC Guard: Verify the caller is authenticated and is an Admin
    (0, authMiddleware_1.requireAdmin)(context);
    // 2. Execute the Core Use Case
    try {
        const result = await (0, createUser_1.createUserUseCase)(data);
        return { success: true, data: result, message: 'Usuario creado y rol asignado correctamente.' };
    }
    catch (error) {
        console.error('Create User Error:', error);
        throw new functions.https.HttpsError('invalid-argument', error.message || 'Error al crear el usuario.');
    }
});
/**
 * Cloud Function (HTTP): DEV ONLY Hard Reset
 * WARNING: Destructive operation
 */
exports.devHardReset = functions.https.onRequest(async (req, res) => {
    const secretToken = req.query.token;
    try {
        const result = await (0, hardReset_1.hardResetSystemUseCase)(secretToken);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(403).json({ error: error.message });
    }
});
//# sourceMappingURL=index.js.map