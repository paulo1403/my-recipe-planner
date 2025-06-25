import { z } from 'zod';

// User schema
export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  username: z.string().nullable(),
});

export type User = z.infer<typeof UserSchema>;

// Recipe Origin Type
export const RecipeOriginTypeEnum = z.enum(['CUSTOM', 'EXTERNAL']);
export type RecipeOriginType = z.infer<typeof RecipeOriginTypeEnum>;

// Ingredient schema
export const IngredientSchema = z.object({
  id: z.string().uuid().optional(), // Optional for new ingredients
  name: z.string().min(1, 'El nombre es requerido'),
  quantity: z.number().positive('La cantidad debe ser positiva'),
  unit: z.string().min(1, 'La unidad es requerida'),
  notes: z.string().nullable().optional(),
});

export type Ingredient = z.infer<typeof IngredientSchema>;

// Recipe schema
export const RecipeSchema = z.object({
  id: z.string().uuid().optional(), // Optional for new recipes
  userId: z.string().uuid().optional(), // Set by the server
  title: z.string().min(1, 'El título es requerido'),
  description: z.string().nullable().optional(),
  instructions: z.string().min(1, 'Las instrucciones son requeridas'),
  imageUrl: z.string().url().nullable().optional(),
  originType: RecipeOriginTypeEnum,
  externalId: z.string().nullable().optional(),
  ingredients: z.array(IngredientSchema),
  createdAt: z.string().datetime().optional(), // These are set by the server
  updatedAt: z.string().datetime().optional(),
});

export type Recipe = z.infer<typeof RecipeSchema>;

// Meal Type
export const MealTypeEnum = z.enum(['BREAKFAST', 'LUNCH', 'DINNER', 'SNACK', 'OTHER']);
export type MealType = z.infer<typeof MealTypeEnum>;

// Meal Plan Entry schema
export const MealPlanEntrySchema = z.object({
  id: z.string().uuid().optional(), // Optional for new entries
  mealPlanId: z.string().uuid().optional(), // Set when adding to a meal plan
  recipeId: z.string().uuid(),
  dayOfWeek: z.number().int().min(1).max(7), // 1 = Monday, 7 = Sunday
  mealType: MealTypeEnum,
  recipe: RecipeSchema.optional(), // Included when fetching entries
});

export type MealPlanEntry = z.infer<typeof MealPlanEntrySchema>;

// Meal Plan schema
export const MealPlanSchema = z.object({
  id: z.string().uuid().optional(), // Optional for new meal plans
  userId: z.string().uuid().optional(), // Set by the server
  name: z.string().min(1, 'El nombre es requerido'),
  startDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'La fecha de inicio debe ser una fecha válida',
  }),
  endDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'La fecha de fin debe ser una fecha válida',
  }),
  entries: z.array(MealPlanEntrySchema).optional(),
});

export type MealPlan = z.infer<typeof MealPlanSchema>;

// Shopping List Item schema
export const ShoppingListItemSchema = z.object({
  name: z.string(),
  quantity: z.string(), // Formatted quantity (e.g., "1 1/2")
  unit: z.string(),
  notes: z.string().nullable().optional(),
  category: z.string().optional(), // For categorized items
});

export type ShoppingListItem = z.infer<typeof ShoppingListItemSchema>;

// API Response schemas
export const ApiResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
});

export const AuthResponseSchema = ApiResponseSchema.extend({
  user: UserSchema,
  token: z.string(),
});

export type AuthResponse = z.infer<typeof AuthResponseSchema>;

export const RecipesResponseSchema = ApiResponseSchema.extend({
  recipes: z.array(RecipeSchema),
  total: z.number().optional(),
  page: z.number().optional(),
  limit: z.number().optional(),
});

export type RecipesResponse = z.infer<typeof RecipesResponseSchema>;

export const MealPlansResponseSchema = ApiResponseSchema.extend({
  mealPlans: z.array(MealPlanSchema),
  total: z.number().optional(),
  page: z.number().optional(),
  limit: z.number().optional(),
});

export type MealPlansResponse = z.infer<typeof MealPlansResponseSchema>;

export const ShoppingListResponseSchema = ApiResponseSchema.extend({
  items: z.array(ShoppingListItemSchema),
  categorized: z.record(z.string(), z.array(ShoppingListItemSchema)).optional(),
});

export type ShoppingListResponse = z.infer<typeof ShoppingListResponseSchema>;

// Error type
export const ApiErrorSchema = z.object({
  success: z.literal(false),
  error: z.string(),
  message: z.string(),
  details: z.string().optional(),
});

export type ApiError = z.infer<typeof ApiErrorSchema>;
