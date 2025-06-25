import { Elysia, t } from 'elysia';

export const recipeRoutes = new Elysia({ name: 'recipe-routes' })
  .model({
    createRecipe: t.Object({
      title: t.String(),
      description: t.Optional(t.String()),
      instructions: t.String(),
      imageUrl: t.Optional(t.String()),
      originType: t.Enum({ CUSTOM: 'CUSTOM', EXTERNAL: 'EXTERNAL' }),
      externalId: t.Optional(t.String()),
      ingredients: t.Array(t.Object({
        name: t.String(),
        quantity: t.Number(),
        unit: t.String(),
        notes: t.Optional(t.String())
      }))
    }),
    updateRecipe: t.Object({
      title: t.Optional(t.String()),
      description: t.Optional(t.String()),
      instructions: t.Optional(t.String()),
      imageUrl: t.Optional(t.String()),
      ingredients: t.Optional(t.Array(t.Object({
        id: t.Optional(t.String()),
        name: t.String(),
        quantity: t.Number(),
        unit: t.String(),
        notes: t.Optional(t.String())
      })))
    })
  })
  .derive({ as: 'global' }, ({}) => {
    return {} as unknown as Record<string, unknown>;
  })
  .group('/recipes', (app: any) => app
    // 3.1 Buscar recetas en API externa
    .get('/search', 
      async ({ query, set, store: { db } }: any) => {
        const { q } = query;
        
        if (!q) {
          set.status = 400;
          return {
            success: false,
            message: 'El parámetro de búsqueda es requerido'
          };
        }
        
        try {
          // Aquí iría la llamada a la API externa (Spoonacular/Edamam)
          // Por ahora simularemos la respuesta
          const searchResults = {
            results: [
              {
                id: '123456',
                title: 'Pasta con Salsa de Tomate',
                imageUrl: 'https://example.com/pasta.jpg',
                description: 'Una deliciosa pasta con salsa de tomate casera'
              },
              {
                id: '789012',
                title: 'Ensalada Mediterránea',
                imageUrl: 'https://example.com/salad.jpg',
                description: 'Ensalada fresca con ingredientes mediterráneos'
              }
            ]
          };
          
          return {
            success: true,
            ...searchResults
          };
        } catch (error) {
          console.error('Error buscando recetas:', error);
          set.status = 500;
          return {
            success: false,
            message: 'Error al buscar recetas'
          };
        }
      },
      {
        detail: {
          summary: 'Buscar recetas en API externa',
          tags: ['Recipes']
        }
      }
    )
    
    // 3.2 Guardar receta
    .post('/',
      async ({ body, set, store: { jwt, db }, request }: any) => {
        try {
          // Verificar autenticación
          const authorization = request.headers.get('authorization');
          if (!authorization) {
            set.status = 401;
            return { 
              success: false, 
              message: 'Autenticación requerida'
            };
          }
          
          const token = authorization.split(' ')[1] || authorization;
          const decoded = await jwt.verify(token);
          
          if (!decoded || !decoded.userId) {
            set.status = 401;
            return {
              success: false,
              message: 'Token inválido o expirado'
            };
          }
          
          const { title, description, instructions, imageUrl, originType, externalId, ingredients } = body;
          
          // Crear la receta
          const newRecipe = await db.recipe.create({
            data: {
              title,
              description,
              instructions,
              imageUrl,
              originType,
              externalId,
              userId: decoded.userId,
              ingredients: {
                create: ingredients.map((ingredient: any) => ({
                  name: ingredient.name,
                  quantity: ingredient.quantity,
                  unit: ingredient.unit,
                  notes: ingredient.notes
                }))
              }
            },
            include: {
              ingredients: true
            }
          });
          
          set.status = 201;
          return {
            success: true,
            message: 'Receta guardada exitosamente',
            recipe: newRecipe
          };
        } catch (error) {
          console.error('Error guardando receta:', error);
          set.status = 500;
          return {
            success: false,
            message: 'Error al guardar la receta'
          };
        }
      },
      {
        body: 'createRecipe',
        detail: {
          summary: 'Guardar una receta',
          tags: ['Recipes']
        }
      }
    )
    
    // 3.3 Listar recetas del usuario
    .get('/mine',
      async ({ set, store: { jwt, db }, request }: any) => {
        try {
          // Verificar autenticación
          const authorization = request.headers.get('authorization');
          if (!authorization) {
            set.status = 401;
            return { 
              success: false, 
              message: 'Autenticación requerida'
            };
          }
          
          const token = authorization.split(' ')[1] || authorization;
          const decoded = await jwt.verify(token);
          
          if (!decoded || !decoded.userId) {
            set.status = 401;
            return {
              success: false,
              message: 'Token inválido o expirado'
            };
          }
          
          // Obtener las recetas del usuario
          const recipes = await db.recipe.findMany({
            where: {
              userId: decoded.userId
            },
            include: {
              ingredients: true
            }
          });
          
          return {
            success: true,
            recipes
          };
        } catch (error) {
          console.error('Error obteniendo recetas:', error);
          set.status = 500;
          return {
            success: false,
            message: 'Error al obtener las recetas'
          };
        }
      },
      {
        detail: {
          summary: 'Obtener las recetas del usuario',
          tags: ['Recipes']
        }
      }
    )
    
    // 3.4 Obtener detalles de una receta
    .get('/:id',
      async ({ params, set, store: { jwt, db }, request }: any) => {
        try {
          // Verificar autenticación
          const authorization = request.headers.get('authorization');
          if (!authorization) {
            set.status = 401;
            return { 
              success: false, 
              message: 'Autenticación requerida'
            };
          }
          
          const token = authorization.split(' ')[1] || authorization;
          const decoded = await jwt.verify(token);
          
          if (!decoded || !decoded.userId) {
            set.status = 401;
            return {
              success: false,
              message: 'Token inválido o expirado'
            };
          }
          
          const { id } = params;
          
          // Obtener la receta
          const recipe = await db.recipe.findUnique({
            where: {
              id,
              userId: decoded.userId
            },
            include: {
              ingredients: true
            }
          });
          
          if (!recipe) {
            set.status = 404;
            return {
              success: false,
              message: 'Receta no encontrada'
            };
          }
          
          return {
            success: true,
            recipe
          };
        } catch (error) {
          console.error('Error obteniendo receta:', error);
          set.status = 500;
          return {
            success: false,
            message: 'Error al obtener la receta'
          };
        }
      },
      {
        detail: {
          summary: 'Obtener detalles de una receta',
          tags: ['Recipes']
        }
      }
    )
    
    // 3.5 Actualizar una receta
    .put('/:id',
      async ({ params, body, set, store: { jwt, db }, request }: any) => {
        try {
          // Verificar autenticación
          const authorization = request.headers.get('authorization');
          if (!authorization) {
            set.status = 401;
            return { 
              success: false, 
              message: 'Autenticación requerida'
            };
          }
          
          const token = authorization.split(' ')[1] || authorization;
          const decoded = await jwt.verify(token);
          
          if (!decoded || !decoded.userId) {
            set.status = 401;
            return {
              success: false,
              message: 'Token inválido o expirado'
            };
          }
          
          const { id } = params;
          const { title, description, instructions, imageUrl, ingredients } = body;
          
          // Verificar que la receta exista y pertenezca al usuario
          const existingRecipe = await db.recipe.findUnique({
            where: {
              id,
              userId: decoded.userId
            }
          });
          
          if (!existingRecipe) {
            set.status = 404;
            return {
              success: false,
              message: 'Receta no encontrada'
            };
          }
          
          // Verificar que la receta sea de tipo CUSTOM
          if (existingRecipe.originType !== 'CUSTOM') {
            set.status = 403;
            return {
              success: false,
              message: 'Solo se pueden modificar recetas personalizadas'
            };
          }
          
          // Actualizar la receta
          const updateData: any = {};
          
          if (title !== undefined) updateData.title = title;
          if (description !== undefined) updateData.description = description;
          if (instructions !== undefined) updateData.instructions = instructions;
          if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
          
          // Actualizar la receta
          const updatedRecipe = await db.recipe.update({
            where: {
              id
            },
            data: updateData,
            include: {
              ingredients: true
            }
          });
          
          // Si hay ingredientes, actualizar
          if (ingredients && ingredients.length > 0) {
            // Eliminar ingredientes actuales
            await db.ingredient.deleteMany({
              where: {
                recipeId: id
              }
            });
            
            // Crear nuevos ingredientes
            await db.ingredient.createMany({
              data: ingredients.map((ingredient: any) => ({
                recipeId: id,
                name: ingredient.name,
                quantity: ingredient.quantity,
                unit: ingredient.unit,
                notes: ingredient.notes || null
              }))
            });
            
            // Obtener la receta actualizada con ingredientes
            const recipeWithIngredients = await db.recipe.findUnique({
              where: {
                id
              },
              include: {
                ingredients: true
              }
            });
            
            return {
              success: true,
              message: 'Receta actualizada exitosamente',
              recipe: recipeWithIngredients
            };
          }
          
          return {
            success: true,
            message: 'Receta actualizada exitosamente',
            recipe: updatedRecipe
          };
        } catch (error) {
          console.error('Error actualizando receta:', error);
          set.status = 500;
          return {
            success: false,
            message: 'Error al actualizar la receta'
          };
        }
      },
      {
        body: 'updateRecipe',
        detail: {
          summary: 'Actualizar una receta',
          tags: ['Recipes']
        }
      }
    )
    
    // 3.6 Eliminar una receta
    .delete('/:id',
      async ({ params, set, store: { jwt, db }, request }: any) => {
        try {
          // Verificar autenticación
          const authorization = request.headers.get('authorization');
          if (!authorization) {
            set.status = 401;
            return { 
              success: false, 
              message: 'Autenticación requerida'
            };
          }
          
          const token = authorization.split(' ')[1] || authorization;
          const decoded = await jwt.verify(token);
          
          if (!decoded || !decoded.userId) {
            set.status = 401;
            return {
              success: false,
              message: 'Token inválido o expirado'
            };
          }
          
          const { id } = params;
          
          // Verificar que la receta exista y pertenezca al usuario
          const existingRecipe = await db.recipe.findUnique({
            where: {
              id,
              userId: decoded.userId
            }
          });
          
          if (!existingRecipe) {
            set.status = 404;
            return {
              success: false,
              message: 'Receta no encontrada'
            };
          }
          
          // Eliminar ingredientes primero (debido a la restricción de clave foránea)
          await db.ingredient.deleteMany({
            where: {
              recipeId: id
            }
          });
          
          // Eliminar entradas de planes de comidas que usen esta receta
          await db.mealPlanEntry.deleteMany({
            where: {
              recipeId: id
            }
          });
          
          // Eliminar la receta
          await db.recipe.delete({
            where: {
              id
            }
          });
          
          return {
            success: true,
            message: 'Receta eliminada exitosamente'
          };
        } catch (error) {
          console.error('Error eliminando receta:', error);
          set.status = 500;
          return {
            success: false,
            message: 'Error al eliminar la receta'
          };
        }
      },
      {
        detail: {
          summary: 'Eliminar una receta',
          tags: ['Recipes']
        }
      }
    )
  );
