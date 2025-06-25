import { Elysia, t } from 'elysia';

export const shoppingListRoutes = new Elysia({ name: 'shopping-list-routes' })
  .model({
    shoppingListItem: t.Object({
      name: t.String(),
      quantity: t.Number(),
      unit: t.String(),
      isChecked: t.Optional(t.Boolean()),
      notes: t.Optional(t.String())
    })
  })
  .group('/shopping-list', (app: any) => app
    // 1. Get current shopping list (consolidating all active meal plans)
    .get('/',
      async ({ set, store: { db }, auth }: any) => {
        try {
          const authResult = await auth();
          
          if (!authResult.isAuthorized) {
            set.status = 401;
            return authResult;
          }
          
          const today = new Date();
          
          // Find all active meal plans (where today is between startDate and endDate)
          const activeMealPlans = await db.mealPlan.findMany({
            where: {
              userId: authResult.user.userId,
              startDate: { lte: today },
              endDate: { gte: today }
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
          
          // If no active meal plans, return empty shopping list
          if (activeMealPlans.length === 0) {
            return {
              success: true,
              message: 'No hay planes de comida activos',
              activePlans: [],
              shoppingList: []
            };
          }
          
          // Consolidate ingredients from all meal plans
          const ingredientsMap = new Map();
          const activePlanNames: string[] = [];
          
          activeMealPlans.forEach((mealPlan: any) => {
            activePlanNames.push(mealPlan.name);
            
            mealPlan.entries.forEach((entry: any) => {
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
                    isChecked: false,
                    notes: ingredient.notes
                  });
                }
              });
            });
          });
          
          // Convert map to array
          const shoppingList = Array.from(ingredientsMap.values());
          
          return {
            success: true,
            activePlans: activePlanNames,
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
        detail: {
          summary: 'Obtener la lista de compras actual',
          tags: ['Shopping List']
        }
      }
    )
    
    // 2. Get shopping list for a specific meal plan
    .get('/:mealPlanId',
      async ({ params, set, store: { db }, auth }: any) => {
        try {
          const authResult = await auth();
          
          if (!authResult.isAuthorized) {
            set.status = 401;
            return authResult;
          }
          
          const { mealPlanId } = params;
          
          // Check if the meal plan exists and belongs to the user
          const mealPlan = await db.mealPlan.findUnique({
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
          
          if (!mealPlan) {
            set.status = 404;
            return {
              success: false,
              message: 'Plan de comidas no encontrado'
            };
          }
          
          // Consolidate ingredients
          const ingredientsMap = new Map();
          
          mealPlan.entries.forEach((entry: any) => {
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
                  isChecked: false,
                  notes: ingredient.notes
                });
              }
            });
          });
          
          // Convert map to array
          const shoppingList = Array.from(ingredientsMap.values());
          
          return {
            success: true,
            mealPlan: mealPlan.name,
            startDate: mealPlan.startDate,
            endDate: mealPlan.endDate,
            shoppingList
          };
        } catch (error) {
          console.error('Error generating shopping list for meal plan:', error);
          set.status = 500;
          return {
            success: false,
            message: 'Error al generar la lista de compras para el plan'
          };
        }
      },
      {
        detail: {
          summary: 'Obtener la lista de compras para un plan específico',
          tags: ['Shopping List']
        }
      }
    )
    
    // 3. Add custom item to shopping list (Future: implement a ShoppingListItem model)
    .post('/items',
      async ({ body, set, auth }: any) => {
        try {
          const authResult = await auth();
          
          if (!authResult.isAuthorized) {
            set.status = 401;
            return authResult;
          }
          
          // In a future implementation, we would save this item to a database
          // For now, we'll simulate adding an item and return it
          return {
            success: true,
            message: 'Ítem agregado a la lista de compras',
            item: {
              ...body,
              isChecked: false,
              id: `custom-${Date.now()}` // Simulated ID
            }
          };
        } catch (error) {
          console.error('Error adding item to shopping list:', error);
          set.status = 500;
          return {
            success: false,
            message: 'Error al agregar ítem a la lista de compras'
          };
        }
      },
      {
        body: 'shoppingListItem',
        detail: {
          summary: 'Agregar ítem personalizado a la lista de compras',
          tags: ['Shopping List']
        }
      }
    )
  );
