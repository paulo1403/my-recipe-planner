import { Elysia, t } from 'elysia';
import { cors } from '@elysiajs/cors';
import { jwt } from '@elysiajs/jwt';
import { staticPlugin } from '@elysiajs/static';
import { swagger } from '@elysiajs/swagger';

import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key';

const app = new Elysia()
  .use(swagger())
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
            set.status = 401;
            return { isAuthorized: false, error: 'No token provided' };
          }

          const token = authorization.split(' ')[1] || authorization;
          const decoded = await jwt.verify(token);

          if (!decoded) {
            set.status = 401;
            return { isAuthorized: false, error: 'Invalid token' };
          }

          return { isAuthorized: true, user: decoded };
        } catch (error) {
          set.status = 401;
          return { isAuthorized: false, error: 'Authentication failed' };
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