"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirestoreInventoryRepository = void 0;
class FirestoreInventoryRepository {
    db;
    constructor(db) {
        this.db = db;
    }
    async deductIngredients(ingredientsToDeduct) {
        // Run a Firestore transaction to ensure atomic updates and prevent race conditions
        await this.db.runTransaction(async (transaction) => {
            // First, read all the current inventory states to avoid write-before-read errors in transactions
            const inventoryRefs = ingredientsToDeduct.map(req => this.db.collection('inventory').doc(req.ingredientId));
            const inventoryDocs = await transaction.getAll(...inventoryRefs);
            // Verify and calculate new stock
            const updates = [];
            for (let i = 0; i < inventoryDocs.length; i++) {
                const doc = inventoryDocs[i];
                const req = ingredientsToDeduct[i];
                if (!doc.exists) {
                    throw new Error(`Ingredient ${req.ingredientId} not found in inventory.`);
                }
                const data = doc.data();
                const currentStock = data?.currentStock || 0;
                const newStock = currentStock - req.amount;
                // In a real scenario, you might want to allow negative stock (for auditing) or throw an error.
                // For precision, we keep the exact float value.
                updates.push({ ref: doc.ref, newStock });
            }
            // Perform all updates
            for (const update of updates) {
                transaction.update(update.ref, { currentStock: update.newStock });
            }
        });
    }
}
exports.FirestoreInventoryRepository = FirestoreInventoryRepository;
//# sourceMappingURL=FirestoreInventoryRepository.js.map