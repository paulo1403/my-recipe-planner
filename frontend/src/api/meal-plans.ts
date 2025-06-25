import { apiRequest } from './client';
import type { MealPlan, MealPlanEntry, MealPlansResponse, ShoppingListResponse } from '../types';

export type MealPlanEntryData = {
  recipeId: string;
  dayOfWeek: number;
  mealType: 'BREAKFAST' | 'LUNCH' | 'DINNER' | 'SNACK' | 'OTHER';
};

export const mealPlanApi = {
  async getMealPlans(page = 1, limit = 10): Promise<MealPlansResponse> {
    return await apiRequest<MealPlansResponse>({
      method: 'GET',
      url: '/meal-plans',
      params: { page, limit },
    });
  },
  
  async getMealPlanById(id: string): Promise<{ success: boolean; mealPlan: MealPlan }> {
    return await apiRequest<{ success: boolean; mealPlan: MealPlan }>({
      method: 'GET',
      url: `/meal-plans/${id}`,
    });
  },
  
  async createMealPlan(mealPlan: Partial<MealPlan>): Promise<{ success: boolean; mealPlan: MealPlan }> {
    return await apiRequest<{ success: boolean; mealPlan: MealPlan }>({
      method: 'POST',
      url: '/meal-plans',
      data: mealPlan,
    });
  },
  
  async updateMealPlan(id: string, mealPlanData: Partial<MealPlan>): Promise<{ success: boolean; mealPlan: MealPlan }> {
    return await apiRequest<{ success: boolean; mealPlan: MealPlan }>({
      method: 'PUT',
      url: `/meal-plans/${id}`,
      data: mealPlanData,
    });
  },
  
  async deleteMealPlan(id: string): Promise<{ success: boolean; message: string }> {
    return await apiRequest<{ success: boolean; message: string }>({
      method: 'DELETE',
      url: `/meal-plans/${id}`,
    });
  },
  
  async addRecipeToMealPlan(mealPlanId: string, entryData: MealPlanEntryData): Promise<{ success: boolean; entry: MealPlanEntry }> {
    return await apiRequest<{ success: boolean; entry: MealPlanEntry }>({
      method: 'POST',
      url: `/meal-plans/${mealPlanId}/entries`,
      data: entryData,
    });
  },
  
  async removeRecipeFromMealPlan(mealPlanId: string, entryId: string): Promise<{ success: boolean; message: string }> {
    return await apiRequest<{ success: boolean; message: string }>({
      method: 'DELETE',
      url: `/meal-plans/${mealPlanId}/entries/${entryId}`,
    });
  },
  
  async getShoppingList(mealPlanId: string): Promise<ShoppingListResponse> {
    return await apiRequest<ShoppingListResponse>({
      method: 'GET',
      url: `/meal-plans/${mealPlanId}/shopping-list`,
    });
  },
};
