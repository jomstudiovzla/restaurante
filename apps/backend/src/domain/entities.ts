export interface InventoryIngredient {
  id: string;
  name: string;
  stockUnit: 'g' | 'mg' | 'ml' | 'unit';
  currentStock: number;
}

export interface RecipeIngredient {
  ingredientId: string;
  quantityRequired: number; // The exact amount required (e.g., 15.5)
}

export interface OrderItem {
  dishId: string;
  quantity: number;
  recipe: RecipeIngredient[];
}

export interface Order {
  id: string;
  items: OrderItem[];
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface IInventoryRepository {
  /**
   * Deducts the given ingredients from the inventory precisely.
   * This MUST be handled in a transaction to avoid race conditions.
   */
  deductIngredients(ingredientsToDeduct: { ingredientId: string; amount: number }[]): Promise<void>;
}
