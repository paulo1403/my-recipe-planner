import { apiRequest } from './client';
import type { ShoppingListResponse } from '../types';

export type CustomShoppingListItem = {
  name: string;
  quantity: number;
  unit: string;
  notes?: string;
};

export const shoppingListApi = {
  async getConsolidatedShoppingList(): Promise<ShoppingListResponse> {
    return await apiRequest<ShoppingListResponse>({
      method: 'GET',
      url: '/shopping-list',
    });
  },
  
  async getMealPlanShoppingList(mealPlanId: string): Promise<ShoppingListResponse> {
    return await apiRequest<ShoppingListResponse>({
      method: 'GET',
      url: `/shopping-list/${mealPlanId}`,
    });
  },
  
  async addCustomItem(item: CustomShoppingListItem): Promise<{ success: boolean; message: string }> {
    return await apiRequest<{ success: boolean; message: string }>({
      method: 'POST',
      url: '/shopping-list/items',
      data: item,
    });
  }
};
