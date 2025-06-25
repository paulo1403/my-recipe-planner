import { apiClient, apiRequest } from './client';
import { authApi } from './auth';
import { recipeApi } from './recipes';
import { mealPlanApi } from './meal-plans';
import { shoppingListApi } from './shopping-list';

export {
  apiClient,
  apiRequest,
  authApi,
  recipeApi,
  mealPlanApi,
  shoppingListApi,
};

export default {
  auth: authApi,
  recipes: recipeApi,
  mealPlans: mealPlanApi,
  shoppingList: shoppingListApi,
};
