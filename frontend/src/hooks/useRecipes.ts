import { 
  useQuery,
  useMutation,
  useQueryClient
} from '@tanstack/react-query';
import type {
  UseQueryResult,
  UseMutationResult
} from '@tanstack/react-query';
import { recipeApi } from '../api';
import type { Recipe, RecipesResponse } from '../types';
import type { RecipeSearchParams } from '../api/recipes';

export function useRecipes(page = 1, limit = 10): UseQueryResult<RecipesResponse> {
  return useQuery({
    queryKey: ['recipes', page, limit],
    queryFn: () => recipeApi.getMyRecipes(page, limit),
  });
}

export function useRecipe(id: string): UseQueryResult<Recipe> {
  return useQuery({
    queryKey: ['recipe', id],
    queryFn: async () => {
      const response = await recipeApi.getRecipeById(id);
      return response.recipe;
    },
    enabled: !!id,
  });
}

export function useSearchRecipes(params: RecipeSearchParams | null): UseQueryResult<RecipesResponse> {
  return useQuery({
    queryKey: ['recipeSearch', params],
    queryFn: () => recipeApi.searchExternalRecipes(params!),
    enabled: !!params && !!params.q,
  });
}

export function useCreateRecipe(): UseMutationResult<
  { success: boolean; recipe: Recipe },
  unknown,
  Partial<Recipe>
> {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (recipe: Partial<Recipe>) => recipeApi.createRecipe(recipe),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
    },
  });
}

export function useUpdateRecipe(id: string): UseMutationResult<
  { success: boolean; recipe: Recipe },
  unknown,
  Partial<Recipe>
> {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (recipeData: Partial<Recipe>) => recipeApi.updateRecipe(id, recipeData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
      queryClient.invalidateQueries({ queryKey: ['recipe', id] });
    },
  });
}

export function useDeleteRecipe(): UseMutationResult<
  { success: boolean; message: string },
  unknown,
  string
> {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => recipeApi.deleteRecipe(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
    },
  });
}
