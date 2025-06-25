import { apiRequest } from './client';
import type { Recipe, RecipesResponse } from '../types';

export type RecipeSearchParams = {
  q: string;
  limit?: number;
  offset?: number;
};

export const recipeApi = {
  async searchExternalRecipes(params: RecipeSearchParams): Promise<RecipesResponse> {
    return await apiRequest<RecipesResponse>({
      method: 'GET',
      url: '/recipes/search',
      params,
    });
  },
  
  async getMyRecipes(page = 1, limit = 10): Promise<RecipesResponse> {
    return await apiRequest<RecipesResponse>({
      method: 'GET',
      url: '/recipes/mine',
      params: { page, limit },
    });
  },
  
  async getRecipeById(id: string): Promise<{ success: boolean; recipe: Recipe }> {
    return await apiRequest<{ success: boolean; recipe: Recipe }>({
      method: 'GET',
      url: `/recipes/${id}`,
    });
  },
  
  async createRecipe(recipe: Partial<Recipe>): Promise<{ success: boolean; recipe: Recipe }> {
    return await apiRequest<{ success: boolean; recipe: Recipe }>({
      method: 'POST',
      url: '/recipes',
      data: recipe,
    });
  },
  
  async updateRecipe(id: string, recipeData: Partial<Recipe>): Promise<{ success: boolean; recipe: Recipe }> {
    return await apiRequest<{ success: boolean; recipe: Recipe }>({
      method: 'PUT',
      url: `/recipes/${id}`,
      data: recipeData,
    });
  },
  
  async deleteRecipe(id: string): Promise<{ success: boolean; message: string }> {
    return await apiRequest<{ success: boolean; message: string }>({
      method: 'DELETE',
      url: `/recipes/${id}`,
    });
  }
};
