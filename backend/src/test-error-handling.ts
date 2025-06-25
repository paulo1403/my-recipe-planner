/**
 * Script para probar el manejo de errores del sistema
 * 
 * Este script demuestra cómo se comportan los diferentes tipos de errores
 * Ejecutar con: bun run src/test-error-handling.ts
 */

import { Elysia, t } from 'elysia';
import { 
  AppError, 
  BadRequestError, 
  ConflictError, 
  ForbiddenError, 
  InternalServerError,
  NotFoundError, 
  TooManyRequestsError,
  UnauthorizedError, 
  errorHandler
} from './middlewares/error-handler';
import { validationMiddleware } from './middlewares/validation';
import { rateLimiterMiddleware } from './middlewares/rate-limiter';

// Crea una aplicación Elysia con nuestros middlewares
const app = new Elysia()
  .use(errorHandler)         // Manejador de errores
  .use(validationMiddleware)  // Middleware de validación
  .use(rateLimiterMiddleware) // Limitador de tasa
  .derive({ as: 'global' }, ({}) => {
    // Simulación simplificada de autenticación para probar errores
    return {
      simulatedAuth: () => {
        return Math.random() > 0.5; // 50% de probabilidad de éxito
      }
    };
  })
  .model({
    // Definir un modelo de validación para probar errores
    testValidation: t.Object({
      email: t.String({ format: 'email', error: 'Email inválido' }),
      age: t.Number({ minimum: 18, error: 'Debes ser mayor de 18 años' })
    })
  });

// Rutas para probar diferentes tipos de errores
app
  // 1. Probar error de validación
  .post('/test/validation', 
    ({ body }) => {
      // Si llegamos aquí, la validación ha pasado
      return {
        success: true,
        message: 'Validación exitosa',
        data: body
      };
    },
    {
      body: 'testValidation' // Usa el esquema definido arriba
    }
  )
  
  // 2. Probar errores personalizados
  .get('/test/error/:type', ({ params }) => {
    const { type } = params;
    
    switch(type) {
      case 'badRequest':
        throw new BadRequestError('Ejemplo de error de solicitud incorrecta');
      case 'unauthorized':
        throw new UnauthorizedError('Ejemplo de error de autenticación');
      case 'forbidden':
        throw new ForbiddenError('Ejemplo de error de permisos');
      case 'notFound':
        throw new NotFoundError('Ejemplo de recurso no encontrado');
      case 'conflict':
        throw new ConflictError('Ejemplo de conflicto de datos');
      case 'tooManyRequests':
        throw new TooManyRequestsError('Ejemplo de límite de tasa excedido');
      case 'internalServer':
        throw new InternalServerError('Ejemplo de error interno del servidor');
      default:
        throw new AppError('Ejemplo de error personalizado', 418); // I'm a teapot
    }
  })
  
  // 3. Probar error de autenticación
  .get('/test/protected', async ({ simulatedAuth }) => {
    const isAuthenticated = simulatedAuth();
    
    if (!isAuthenticated) {
      throw new UnauthorizedError('No estás autenticado');
    }
    
    return {
      success: true,
      message: 'Acceso concedido'
    };
  })
  
  // 4. Probar limitación de tasa
  .get('/test/rate-limit', ({ rateLimit }) => {
    // Limita a 3 solicitudes por minuto
    rateLimit({ limit: 3, window: 60 });
    
    return {
      success: true,
      message: 'Solicitud aceptada'
    };
  })
  
  // 5. Probar error no controlado
  .get('/test/uncaught', () => {
    // Lanzar un error que no deriva de AppError
    throw new Error('Este es un error no controlado');
  })
  
  // 6. Error de base de datos simulado
  .get('/test/database', () => {
    // Crear un objeto que simula un error de Prisma
    const prismaError = new Error('Error de conexión a la base de datos');
    (prismaError as any).name = 'PrismaClientKnownRequestError';
    (prismaError as any).code = 'P2002';
    
    throw prismaError;
  })
  
  // Ruta principal
  .get('/', () => {
    return {
      message: 'API de prueba de manejo de errores',
      endpoints: [
        { method: 'POST', path: '/test/validation', description: 'Probar errores de validación' },
        { method: 'GET', path: '/test/error/:type', description: 'Probar errores personalizados' },
        { method: 'GET', path: '/test/protected', description: 'Probar error de autenticación' },
        { method: 'GET', path: '/test/rate-limit', description: 'Probar limitación de tasa' },
        { method: 'GET', path: '/test/uncaught', description: 'Probar error no controlado' },
        { method: 'GET', path: '/test/database', description: 'Probar error de base de datos' }
      ]
    };
  });

console.log('🧪 Iniciando servidor de prueba de manejo de errores...');
app.listen(3001, () => {
  console.log(`✅ Servidor de prueba ejecutándose en http://localhost:3001`);
  console.log('🔍 Ejemplos de comandos para probar:');
  console.log('  curl http://localhost:3001/test/error/badRequest');
  console.log('  curl -X POST -H "Content-Type: application/json" -d \'{"email": "invalid", "age": 16}\' http://localhost:3001/test/validation');
  console.log('  curl http://localhost:3001/test/rate-limit (ejecutar varias veces)');
});
