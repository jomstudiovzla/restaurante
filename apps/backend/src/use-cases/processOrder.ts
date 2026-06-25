import { IInventoryRepository, OrderItem } from '../domain/entities';

/**
 * Use case to process an order, handle states, and deduct ingredients accurately.
 */
export async function processOrderUseCase(
  orderId: string,
  orderData: any, // In a real app, validate and parse this into an Order entity
  inventoryRepo: IInventoryRepository
): Promise<{ success: boolean; status: string; message: string }> {
  // Validate idempotency: check if order is already processed
  if (orderData.status !== 'PENDIENTE') {
    return { success: false, status: orderData.status, message: 'La orden ya está en proceso o terminada.' };
  }

  const items: OrderItem[] = orderData.items || [];
  if (items.length === 0) {
    return { success: false, status: 'RECHAZADO', message: 'Orden sin items.' };
  }

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

  try {
    if (deductionList.length > 0) {
      // Execute atomic deduction via the infrastructure repository
      // This should ideally be within a transaction
      await inventoryRepo.deductIngredients(deductionList);
    }
    
    // Return the new valid state to be saved in DB
    return { success: true, status: 'EN_PREPARACION', message: 'Orden enviada a cocina exitosamente.' };
  } catch (error: any) {
    // If inventory deduction fails (e.g., out of stock in strict mode), trigger rollback/rejection
    return { success: false, status: 'RECHAZADO', message: error.message || 'Error procesando el inventario.' };
  }
}
