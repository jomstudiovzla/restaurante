import { IInventoryRepository, OrderItem } from '../domain/entities';

/**
 * Use case to process an order and deduct ingredients accurately.
 */
export async function processOrderUseCase(
  orderId: string,
  orderData: any, // In a real app, validate and parse this into an Order entity
  inventoryRepo: IInventoryRepository
): Promise<void> {
  // Only process if status is pending or specifically triggers kitchen logic
  // For this exercise, assume orderData has items and recipes populated
  const items: OrderItem[] = orderData.items || [];
  
  if (items.length === 0) return;

  const totalIngredientsToDeduct: Record<string, number> = {};

  // Aggregate total ingredients required for this order
  for (const item of items) {
    if (!item.recipe) continue;
    
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
