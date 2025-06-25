import { Elysia, t } from 'elysia';
import { cors } from '@elysiajs/cors';
import { jwt } from '@elysiajs/jwt';
import { staticPlugin } from '@elysiajs/static';
import { swagger } from '@elysiajs/swagger';

import { PrismaClient } from '@prisma/client';

// Importar los middlewares de gestión de errores y validación
import { errorHandler, UnauthorizedError } from './middlewares/error-handler';
import { validationMiddleware } from './middlewares/validation';
import { rateLimiterMiddleware } from './middlewares/rate-limiter';

export const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key';

const app = new Elysia()
  .use(errorHandler)           // Aplicar el manejador de errores globalmente
  .use(validationMiddleware)   // Aplicar el middleware de validación
  .use(rateLimiterMiddleware)  // Aplicar el limitador de tasa
  .use(swagger({
    documentation: {
      info: {
        title: 'API de Recipe Planner',
        version: '1.0.0',
        description: 'API para la aplicación de planificación de recetas y comidas'
      },
      tags: [
        { name: 'Auth', description: 'Endpoints de autenticación' },
        { name: 'Recipes', description: 'Endpoints de recetas' },
        { name: 'Meal Plans', description: 'Endpoints de planes de comida' },
        { name: 'Shopping List', description: 'Endpoints de lista de compras' }
      ]
    }
  }))
  .use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  }))
  .use(
    jwt({
      name: 'jwt',
      secret: JWT_SECRET,
    })
  )
  .decorate('db', prisma)
  .derive({ as: 'global' }, ({ request, jwt, set }) => {
    return {
      auth: async () => {
        try {
          const authorization = request.headers.get('authorization');
          if (!authorization) {
            throw new UnauthorizedError('Token no proporcionado');
          }

          const token = authorization.split(' ')[1] || authorization;
          const decoded = await jwt.verify(token);

          if (!decoded) {
            throw new UnauthorizedError('Token inválido');
          }

          // Validar que el token contiene los datos necesarios
          if (!decoded.userId || !decoded.email) {
            throw new UnauthorizedError('Token inválido: datos de usuario incompletos');
          }

          return { isAuthorized: true, user: decoded };
        } catch (error) {
          // Usar nuestro propio error personalizado
          if (error instanceof UnauthorizedError) {
            throw error;
          }
          throw new UnauthorizedError('Fallo en la autenticación');
        }
      }
    };
  });

// Import our routes
import { authRoutes } from './routes/auth';
import { recipeRoutes } from './routes/recipes';
import { mealPlanRoutes } from './routes/meal-plans';
import { shoppingListRoutes } from './routes/shopping-list';

// Apply the routes to our app
app.use(authRoutes)
   .use(recipeRoutes)
   .use(mealPlanRoutes)
   .use(shoppingListRoutes);

// Basic welcome route
app.get('/', () => 'Hola desde el backend de Recipe Planner!');

// Example protected route
app.get('/protegido', async ({ auth }) => {
  const authResult = await auth();

  if (!authResult.isAuthorized) {
    return authResult;
  }

  return {
    message: "¡Acceso permitido a ruta protegida!",
    user: authResult.user
  };
});

export const server = app;

if (process.env.NODE_ENV !== 'test') {
  app.listen(3000, () => {
    console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
    console.log('🔗 API Documentation (Swagger): http://localhost:3000/swagger');
  });
}