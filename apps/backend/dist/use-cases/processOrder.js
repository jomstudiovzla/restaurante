"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processOrderUseCase = processOrderUseCase;
/**
 * Use case to process an order and deduct ingredients accurately.
 */
async function processOrderUseCase(orderId, orderData, // In a real app, validate and parse this into an Order entity
inventoryRepo) {
    // Only process if status is pending or specifically triggers kitchen logic
    // For this exercise, assume orderData has items and recipes populated
    const items = orderData.items || [];
    if (items.length === 0)
        return;
    const totalIngredientsToDeduct = {};
    // Aggregate total ingredients required for this order
    for (const item of items) {
        if (!item.recipe)
            continue;
        for (const req of item.recipe) {
            if (!totalIngredientsToDeduct[req.ingredientId]) {
                totalIngredientsToDeduct[req.ingredientId] = 0;
            }
            totalIngredientsToDeduct[req.ingredientId] += (req.quantityRequired * item.quantity);
        }
    }
    const deductionList = Object.keys(totalIngredientsToDeduct).map(id => ({
        ingredientId: id,
        amount: totalIngredientsToDeduct[id]
    }));
    if (deductionList.length > 0) {
        // Execute atomic deduction via the infrastructure repository
        await inventoryRepo.deductIngredients(deductionList);
    }
}
//# sourceMappingURL=processOrder.js.map