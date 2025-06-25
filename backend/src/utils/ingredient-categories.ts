// This is a helper file for categorizing ingredients in shopping lists
// In a future update, this could be expanded to use machine learning or an external API

// Define ingredient categories for shopping organization
export const ingredientCategories = {
  PRODUCE: 'Produce', // Fruits and vegetables
  MEAT_SEAFOOD: 'Meat & Seafood',
  DAIRY: 'Dairy & Eggs',
  BAKERY: 'Bakery',
  PANTRY: 'Pantry', // Canned goods, grains, pastas, etc.
  FROZEN: 'Frozen Foods',
  CONDIMENTS: 'Condiments & Spices',
  BEVERAGES: 'Beverages',
  SNACKS: 'Snacks',
  OTHER: 'Other'
};

// Keywords for categorizing ingredients
const categoryKeywords: Record<string, string[]> = {
  PRODUCE: [
    'apple', 'banana', 'orange', 'grape', 'lemon', 'lime', 'strawberry',
    'blueberry', 'raspberry', 'blackberry', 'kiwi', 'pineapple', 'mango',
    'avocado', 'tomato', 'potato', 'onion', 'garlic', 'carrot', 'broccoli',
    'spinach', 'kale', 'lettuce', 'cabbage', 'pepper', 'cucumber', 'zucchini',
    'eggplant', 'mushroom', 'squash', 'pumpkin', 'celery', 'cilantro', 'basil',
    'parsley', 'mint', 'thyme', 'rosemary', 'dill', 'chive', 'sage', 'oregano',
    'cebolla', 'ajo', 'tomate', 'patata', 'zanahoria', 'lechuga', 'espinaca', 'pimiento'
  ],
  MEAT_SEAFOOD: [
    'beef', 'chicken', 'pork', 'turkey', 'lamb', 'veal', 'fish', 'salmon',
    'tuna', 'shrimp', 'prawn', 'crab', 'lobster', 'clam', 'mussel', 'oyster',
    'bacon', 'ham', 'sausage', 'ground', 'steak', 'chop', 'roast', 'fillet',
    'meat', 'carne', 'pollo', 'cerdo', 'pescado', 'camarón', 'marisco'
  ],
  DAIRY: [
    'milk', 'cheese', 'yogurt', 'butter', 'cream', 'sour cream', 'ice cream',
    'egg', 'margarine', 'cottage cheese', 'mozzarella', 'cheddar', 'parmesan',
    'ricotta', 'cream cheese', 'queso', 'leche', 'huevo', 'mantequilla', 'nata', 'yogur'
  ],
  BAKERY: [
    'bread', 'roll', 'bun', 'bagel', 'muffin', 'croissant', 'pastry', 'donut',
    'cake', 'cookie', 'biscuit', 'pie', 'tart', 'pancake', 'waffle', 'tortilla',
    'brioche', 'baguette', 'pan', 'pasta', 'galleta', 'pastel', 'bizcocho', 'cruasán'
  ],
  PANTRY: [
    'flour', 'sugar', 'rice', 'pasta', 'noodle', 'cereal', 'bean', 'lentil',
    'chickpea', 'pea', 'corn', 'oat', 'quinoa', 'couscous', 'soup', 'sauce',
    'broth', 'stock', 'oil', 'vinegar', 'salt', 'pepper', 'canned', 'jar',
    'salsa', 'guacamole', 'marmalade', 'jam', 'jelly', 'peanut butter', 'honey',
    'syrup', 'molasses', 'chocolate', 'cocoa', 'coffee', 'tea', 'harina',
    'azúcar', 'arroz', 'frijol', 'lenteja', 'sal', 'pimienta', 'aceite'
  ],
  FROZEN: [
    'frozen', 'ice', 'pizza', 'fries', 'waffle', 'vegetable', 'fruit',
    'juice concentrate', 'congelado', 'helado'
  ],
  CONDIMENTS: [
    'ketchup', 'mustard', 'mayonnaise', 'relish', 'hot sauce', 'bbq sauce',
    'soy sauce', 'worcestershire sauce', 'horseradish', 'sriracha', 'aioli',
    'hummus', 'dip', 'dressing', 'vinaigrette', 'marinade', 'spice', 'herb',
    'seasoning', 'extract', 'condiment', 'salsa', 'especias'
  ],
  BEVERAGES: [
    'water', 'soda', 'pop', 'juice', 'milk', 'coffee', 'tea', 'beer', 'wine',
    'liquor', 'spirit', 'cocktail', 'smoothie', 'shake', 'drink', 'beverage',
    'agua', 'jugo', 'zumo', 'café', 'té', 'cerveza', 'vino', 'bebida'
  ],
  SNACKS: [
    'chip', 'crisp', 'pretzel', 'popcorn', 'cracker', 'nut', 'candy', 'chocolate',
    'snack', 'trail mix', 'granola', 'energy bar', 'protein bar', 'cookie', 'cake',
    'muffin', 'pastry', 'brownie', 'aperitivo', 'botana', 'patatas fritas', 'chocolate'
  ]
};

/**
 * Determines the category for an ingredient based on its name
 * @param ingredientName The name of the ingredient
 * @returns The category of the ingredient
 */
export function categorizeIngredient(ingredientName: string): string {
  const lowercaseName = ingredientName.toLowerCase();
  
  for (const category in categoryKeywords) {
    const categoryKey = category as keyof typeof categoryKeywords;
    const keywords = categoryKeywords[categoryKey];
    
    if (keywords) {
      for (const keyword of keywords) {
        if (lowercaseName.includes(keyword.toLowerCase())) {
          return ingredientCategories[categoryKey as keyof typeof ingredientCategories];
        }
      }
    }
  }
  
  return ingredientCategories.OTHER;
}

/**
 * Groups ingredients by category
 * @param ingredients The list of ingredients to group
 * @returns Object with ingredients grouped by category
 */
export function groupIngredientsByCategory(ingredients: any[]): Record<string, any[]> {
  const groupedIngredients: Record<string, any[]> = {};
  
  // Initialize categories
  Object.values(ingredientCategories).forEach(category => {
    groupedIngredients[category] = [];
  });
  
  // Group ingredients by category
  ingredients.forEach(ingredient => {
    const category = categorizeIngredient(ingredient.name);
    if (groupedIngredients[category]) {
      groupedIngredients[category].push(ingredient);
    } else {
      groupedIngredients[category] = [ingredient];
    }
  });
  
  // Remove empty categories
  for (const category in groupedIngredients) {
    const ingredients = groupedIngredients[category];
    if (ingredients && ingredients.length === 0) {
      delete groupedIngredients[category];
    }
  }
  
  return groupedIngredients;
}
