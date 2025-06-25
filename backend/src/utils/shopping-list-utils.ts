import { consolidateIngredients, formatIngredient } from './ingredient-normalization';
import { groupIngredientsByCategory } from './ingredient-categories';

/**
 * Extracts and processes ingredients from a meal plan for a shopping list
 * @param mealPlan Meal plan with entries and recipes
 * @returns Processed shopping list data
 */
export async function processShoppingList(mealPlan: any) {
  // Extract all ingredients
  const allIngredients: Array<{
    name: string;
    quantity: number;
    unit: string;
    notes?: string;
  }> = [];
  
  // Process each entry in the meal plan
  mealPlan.entries?.forEach((entry: any) => {
    entry.recipe.ingredients?.forEach((ingredient: any) => {
      allIngredients.push({
        name: ingredient.name,
        quantity: ingredient.quantity,
        unit: ingredient.unit,
        notes: ingredient.notes
      });
    });
  });
  
  // Consolidate and normalize ingredients
  const normalizedIngredients = consolidateIngredients(allIngredients);
  
  // Format ingredients for display and add checked status
  const formattedIngredients = normalizedIngredients.map(ing => ({
    ...formatIngredient(ing),
    isChecked: false,
    // Preserve the standard units for possible future use in UI
    standardQuantity: ing.standardQuantity,
    standardUnit: ing.standardUnit
  }));
  
  // Group ingredients by category
  const categorizedIngredients = groupIngredientsByCategory(formattedIngredients);
  
  return {
    items: formattedIngredients,
    categorized: categorizedIngredients
  };
}

/**
 * Extracts and processes ingredients from multiple meal plans for a consolidated shopping list
 * @param mealPlans Array of meal plans with entries and recipes
 * @returns Processed shopping list data
 */
export async function processConsolidatedShoppingList(mealPlans: any[]) {
  // Extract all ingredients
  const allIngredients: Array<{
    name: string;
    quantity: number;
    unit: string;
    notes?: string;
  }> = [];
  
  // Process each meal plan
  mealPlans.forEach((mealPlan: any) => {
    mealPlan.entries?.forEach((entry: any) => {
      entry.recipe.ingredients?.forEach((ingredient: any) => {
        allIngredients.push({
          name: ingredient.name,
          quantity: ingredient.quantity,
          unit: ingredient.unit,
          notes: ingredient.notes
        });
      });
    });
  });
  
  // Consolidate and normalize ingredients
  const normalizedIngredients = consolidateIngredients(allIngredients);
  
  // Format ingredients for display and add checked status
  const formattedIngredients = normalizedIngredients.map(ing => ({
    ...formatIngredient(ing),
    isChecked: false,
    // Preserve the standard units for possible future use in UI
    standardQuantity: ing.standardQuantity,
    standardUnit: ing.standardUnit
  }));
  
  // Group ingredients by category
  const categorizedIngredients = groupIngredientsByCategory(formattedIngredients);
  
  return {
    items: formattedIngredients,
    categorized: categorizedIngredients
  };
}
