import { Elysia, t } from 'elysia';

export const mealPlanRoutes = new Elysia({ name: 'meal-plan-routes' })
  .model({
    createMealPlan: t.Object({
      name: t.String(),
      startDate: t.String(), // ISO date string, we'll convert to Date
      endDate: t.String(), // ISO date string, we'll convert to Date
    }),
    updateMealPlan: t.Object({
      name: t.Optional(t.String()),
      startDate: t.Optional(t.String()), // ISO date string
      endDate: t.Optional(t.String()), // ISO date string
    }),
    mealPlanEntry: t.Object({
      recipeId: t.String(),
      dayOfWeek: t.Number({ minimum: 1, maximum: 7 }), // 1 (Monday) to 7 (Sunday)
      mealType: t.Enum({ BREAKFAST: 'BREAKFAST', LUNCH: 'LUNCH', DINNER: 'DINNER', SNACK: 'SNACK', OTHER: 'OTHER' })
    }),
    generateShoppingList: t.Object({
      mealPlanId: t.String()
    })
  })
  .group('/meal-plans', (app: any) => app
    // 1. Create a new meal plan
    .post('/',
      async ({ body, set, store: { db }, auth }: any) => {
        try {
          const authResult = await auth();
          
          if (!authResult.isAuthorized) {
            set.status = 401;
            return authResult;
          }
          
          const { name, startDate, endDate } = body;
          
          // Create the meal plan
          const newMealPlan = await db.mealPlan.create({
            data: {
              name,
              startDate: new Date(startDate),
              endDate: new Date(endDate),
              userId: authResult.user.userId,
            }
          });
          
          set.status = 201;
          return {
            success: true,
            message: 'Plan de comidas creado exitosamente',
            mealPlan: newMealPlan
          };
        } catch (error) {
          console.error('Error creating meal plan:', error);
          set.status = 500;
          return {
            success: false,
            message: 'Error al crear el plan de comidas'
          };
        }
      },
      {
        body: 'createMealPlan',
        detail: {
          summary: 'Crear un nuevo plan de comidas',
          tags: ['Meal Plans']
        }
      }
    )
    
    // 2. Get all meal plans for the user
    .get('/',
      async ({ set, store: { db }, auth }: any) => {
        try {
          const authResult = await auth();
          
          if (!authResult.isAuthorized) {
            set.status = 401;
            return authResult;
          }
          
          // Get the meal plans
          const mealPlans = await db.mealPlan.findMany({
            where: {
              userId: authResult.user.userId
            },
            orderBy: {
              startDate: 'asc'
            }
          });
          
          return {
            success: true,
            mealPlans
          };
        } catch (error) {
          console.error('Error getting meal plans:', error);
          set.status = 500;
          return {
            success: false,
            message: 'Error al obtener los planes de comidas'
          };
        }
      },
      {
        detail: {
          summary: 'Obtener todos los planes de comidas del usuario',
          tags: ['Meal Plans']
        }
      }
    )
    
    // 3. Get a specific meal plan by ID
    .get('/:id',
      async ({ params, set, store: { db }, auth }: any) => {
        try {
          const authResult = await auth();
          
          if (!authResult.isAuthorized) {
            set.status = 401;
            return authResult;
          }
          
          const { id } = params;
          
          // Get the meal plan
          const mealPlan = await db.mealPlan.findUnique({
            where: {
              id,
              userId: authResult.user.userId
            },
            include: {
              entries: {
                include: {
                  recipe: {
                    include: {
                      ingredients: true
                    }
                  }
                }
              }
            }
          });
          
          if (!mealPlan) {
            set.status = 404;
            return {
              success: false,
              message: 'Plan de comidas no encontrado'
            };
          }
          
          return {
            success: true,
            mealPlan
          };
        } catch (error) {
          console.error('Error getting meal plan:', error);
          set.status = 500;
          return {
            success: false,
            message: 'Error al obtener el plan de comidas'
          };
        }
      },
      {
        detail: {
          summary: 'Obtener detalles de un plan de comidas',
          tags: ['Meal Plans']
        }
      }
    )
    
    // 4. Update a meal plan
    .put('/:id',
      async ({ params, body, set, store: { db }, auth }: any) => {
        try {
          const authResult = await auth();
          
          if (!authResult.isAuthorized) {
            set.status = 401;
            return authResult;
          }
          
          const { id } = params;
          const { name, startDate, endDate } = body;
          
          // Check if the meal plan exists and belongs to the user
          const existingMealPlan = await db.mealPlan.findUnique({
            where: {
              id,
              userId: authResult.user.userId
            }
          });
          
          if (!existingMealPlan) {
            set.status = 404;
            return {
              success: false,
              message: 'Plan de comidas no encontrado'
            };
          }
          
          // Update the meal plan
          const updateData: any = {};
          
          if (name !== undefined) updateData.name = name;
          if (startDate !== undefined) updateData.startDate = new Date(startDate);
          if (endDate !== undefined) updateData.endDate = new Date(endDate);
          
          const updatedMealPlan = await db.mealPlan.update({
            where: {
              id
            },
            data: updateData
          });
          
          return {
            success: true,
            message: 'Plan de comidas actualizado exitosamente',
            mealPlan: updatedMealPlan
          };
        } catch (error) {
          console.error('Error updating meal plan:', error);
          set.status = 500;
          return {
            success: false,
            message: 'Error al actualizar el plan de comidas'
          };
        }
      },
      {
        body: 'updateMealPlan',
        detail: {
          summary: 'Actualizar un plan de comidas',
          tags: ['Meal Plans']
        }
      }
    )
    
    // 5. Delete a meal plan
    .delete('/:id',
      async ({ params, set, store: { db }, auth }: any) => {
        try {
          const authResult = await auth();
          
          if (!authResult.isAuthorized) {
            set.status = 401;
            return authResult;
          }
          
          const { id } = params;
          
          // Check if the meal plan exists and belongs to the user
          const existingMealPlan = await db.mealPlan.findUnique({
            where: {
              id,
              userId: authResult.user.userId
            }
          });
          
          if (!existingMealPlan) {
            set.status = 404;
            return {
              success: false,
              message: 'Plan de comidas no encontrado'
            };
          }
          
          // Delete meal plan entries first (due to foreign key constraint)
          await db.mealPlanEntry.deleteMany({
            where: {
              mealPlanId: id
            }
          });
          
          // Delete the meal plan
          await db.mealPlan.delete({
            where: {
              id
            }
          });
          
          return {
            success: true,
            message: 'Plan de comidas eliminado exitosamente'
          };
        } catch (error) {
          console.error('Error deleting meal plan:', error);
          set.status = 500;
          return {
            success: false,
            message: 'Error al eliminar el plan de comidas'
          };
        }
      },
      {
        detail: {
          summary: 'Eliminar un plan de comidas',
          tags: ['Meal Plans']
        }
      }
    )
    
    // 6. Add a recipe to a meal plan
    .post('/:id/entries',
      async ({ params, body, set, store: { db }, auth }: any) => {
        try {
          const authResult = await auth();
          
          if (!authResult.isAuthorized) {
            set.status = 401;
            return authResult;
          }
          
          const { id } = params;
          const { recipeId, dayOfWeek, mealType } = body;
          
          // Check if the meal plan exists and belongs to the user
          const existingMealPlan = await db.mealPlan.findUnique({
            where: {
              id,
              userId: authResult.user.userId
            }
          });
          
          if (!existingMealPlan) {
            set.status = 404;
            return {
              success: false,
              message: 'Plan de comidas no encontrado'
            };
          }
          
          // Check if the recipe exists and belongs to the user
          const existingRecipe = await db.recipe.findUnique({
            where: {
              id: recipeId,
              userId: authResult.user.userId
            }
          });
          
          if (!existingRecipe) {
            set.status = 404;
            return {
              success: false,
              message: 'Receta no encontrada'
            };
          }
          
          // Check if there's already an entry for this day and meal type
          const existingEntry = await db.mealPlanEntry.findFirst({
            where: {
              mealPlanId: id,
              dayOfWeek,
              mealType
            }
          });
          
          if (existingEntry) {
            // Update the existing entry
            const updatedEntry = await db.mealPlanEntry.update({
              where: {
                id: existingEntry.id
              },
              data: {
                recipeId
              }
            });
            
            return {
              success: true,
              message: 'Entrada del plan de comidas actualizada exitosamente',
              entry: updatedEntry
            };
          }
          
          // Create a new entry
          const newEntry = await db.mealPlanEntry.create({
            data: {
              mealPlanId: id,
              recipeId,
              dayOfWeek,
              mealType
            }
          });
          
          set.status = 201;
          return {
            success: true,
            message: 'Receta agregada al plan de comidas exitosamente',
            entry: newEntry
          };
        } catch (error) {
          console.error('Error adding recipe to meal plan:', error);
          set.status = 500;
          return {
            success: false,
            message: 'Error al agregar la receta al plan de comidas'
          };
        }
      },
      {
        body: 'mealPlanEntry',
        detail: {
          summary: 'Agregar una receta a un plan de comidas',
          tags: ['Meal Plans']
        }
      }
    )
    
    // 7. Remove a recipe from a meal plan
    .delete('/:id/entries/:entryId',
      async ({ params, set, store: { db }, auth }: any) => {
        try {
          const authResult = await auth();
          
          if (!authResult.isAuthorized) {
            set.status = 401;
            return authResult;
          }
          
          const { id, entryId } = params;
          
          // Check if the meal plan exists and belongs to the user
          const existingMealPlan = await db.mealPlan.findUnique({
            where: {
              id,
              userId: authResult.user.userId
            }
          });
          
          if (!existingMealPlan) {
            set.status = 404;
            return {
              success: false,
              message: 'Plan de comidas no encontrado'
            };
          }
          
          // Check if the entry exists and belongs to this meal plan
          const existingEntry = await db.mealPlanEntry.findFirst({
            where: {
              id: entryId,
              mealPlanId: id
            }
          });
          
          if (!existingEntry) {
            set.status = 404;
            return {
              success: false,
              message: 'Entrada del plan de comidas no encontrada'
            };
          }
          
          // Delete the entry
          await db.mealPlanEntry.delete({
            where: {
              id: entryId
            }
          });
          
          return {
            success: true,
            message: 'Receta eliminada del plan de comidas exitosamente'
          };
        } catch (error) {
          console.error('Error removing recipe from meal plan:', error);
          set.status = 500;
          return {
            success: false,
            message: 'Error al eliminar la receta del plan de comidas'
          };
        }
      },
      {
        detail: {
          summary: 'Eliminar una receta de un plan de comidas',
          tags: ['Meal Plans']
        }
      }
    )
    
    // 8. Generate shopping list for a meal plan
    .post('/shopping-list',
      async ({ body, set, store: { db }, auth }: any) => {
        try {
          const authResult = await auth();
          
          if (!authResult.isAuthorized) {
            set.status = 401;
            return authResult;
          }
          
          const { mealPlanId } = body;
          
          // Check if the meal plan exists and belongs to the user
          const existingMealPlan = await db.mealPlan.findUnique({
            where: {
              id: mealPlanId,
              userId: authResult.user.userId
            },
            include: {
              entries: {
                include: {
                  recipe: {
                    include: {
                      ingredients: true
                    }
                  }
                }
              }
            }
          });
          
          if (!existingMealPlan) {
            set.status = 404;
            return {
              success: false,
              message: 'Plan de comidas no encontrado'
            };
          }
          
          // Consolidate ingredients
          const ingredientsMap = new Map();
          
          existingMealPlan.entries.forEach((entry: any) => {
            entry.recipe.ingredients.forEach((ingredient: any) => {
              const key = `${ingredient.name}|${ingredient.unit}`;
              
              if (ingredientsMap.has(key)) {
                ingredientsMap.set(key, {
                  ...ingredientsMap.get(key),
                  quantity: ingredientsMap.get(key).quantity + ingredient.quantity
                });
              } else {
                ingredientsMap.set(key, {
                  name: ingredient.name,
                  quantity: ingredient.quantity,
                  unit: ingredient.unit,
                  notes: ingredient.notes
                });
              }
            });
          });
          
          // Convert map to array
          const shoppingList = Array.from(ingredientsMap.values());
          
          return {
            success: true,
            mealPlan: existingMealPlan.name,
            startDate: existingMealPlan.startDate,
            endDate: existingMealPlan.endDate,
            shoppingList
          };
        } catch (error) {
          console.error('Error generating shopping list:', error);
          set.status = 500;
          return {
            success: false,
            message: 'Error al generar la lista de compras'
          };
        }
      },
      {
        body: 'generateShoppingList',
        detail: {
          summary: 'Generar lista de compras para un plan de comidas',
          tags: ['Meal Plans']
        }
      }
    )
  );
