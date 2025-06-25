import { 
  useQuery,
  useMutation,
  useQueryClient
} from '@tanstack/react-query';
import type {
  UseQueryResult,
  UseMutationResult
} from '@tanstack/react-query';
import { mealPlanApi } from '../api';
import type { MealPlan, MealPlanEntry, MealPlansResponse, ShoppingListResponse } from '../types';
import type { MealPlanEntryData } from '../api/meal-plans';

export function useMealPlans(page = 1, limit = 10): UseQueryResult<MealPlansResponse> {
  return useQuery({
    queryKey: ['mealPlans', page, limit],
    queryFn: () => mealPlanApi.getMealPlans(page, limit),
  });
}

export function useMealPlan(id: string): UseQueryResult<MealPlan> {
  return useQuery({
    queryKey: ['mealPlan', id],
    queryFn: async () => {
      const response = await mealPlanApi.getMealPlanById(id);
      return response.mealPlan;
    },
    enabled: !!id,
  });
}

export function useCreateMealPlan(): UseMutationResult<
  { success: boolean; mealPlan: MealPlan },
  unknown,
  Partial<MealPlan>
> {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (mealPlan: Partial<MealPlan>) => mealPlanApi.createMealPlan(mealPlan),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mealPlans'] });
    },
  });
}

export function useUpdateMealPlan(id: string): UseMutationResult<
  { success: boolean; mealPlan: MealPlan },
  unknown,
  Partial<MealPlan>
> {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (mealPlanData: Partial<MealPlan>) => mealPlanApi.updateMealPlan(id, mealPlanData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mealPlans'] });
      queryClient.invalidateQueries({ queryKey: ['mealPlan', id] });
    },
  });
}

export function useDeleteMealPlan(): UseMutationResult<
  { success: boolean; message: string },
  unknown,
  string
> {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => mealPlanApi.deleteMealPlan(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mealPlans'] });
    },
  });
}

export function useAddRecipeToMealPlan(mealPlanId: string): UseMutationResult<
  { success: boolean; entry: MealPlanEntry },
  unknown,
  MealPlanEntryData
> {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (entryData: MealPlanEntryData) => mealPlanApi.addRecipeToMealPlan(mealPlanId, entryData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mealPlan', mealPlanId] });
    },
  });
}

export function useRemoveRecipeFromMealPlan(mealPlanId: string): UseMutationResult<
  { success: boolean; message: string },
  unknown,
  string
> {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (entryId: string) => mealPlanApi.removeRecipeFromMealPlan(mealPlanId, entryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mealPlan', mealPlanId] });
    },
  });
}

export function useShoppingList(mealPlanId: string): UseQueryResult<ShoppingListResponse> {
  return useQuery({
    queryKey: ['shoppingList', mealPlanId],
    queryFn: () => mealPlanApi.getShoppingList(mealPlanId),
    enabled: !!mealPlanId,
  });
}
