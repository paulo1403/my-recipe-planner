// Middleware de validación para asegurar que todos los endpoints tienen validación

import { Elysia } from 'elysia';
import { t } from 'elysia';
import { BadRequestError } from './error-handler';

// Crea validadores genéricos para tipos comunes de datos
export const validators = {
  // Validadores de UUID
  uuid: t.String({ pattern: '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$', 
                    error: 'El formato del ID no es válido (debe ser un UUID)' }),
  
  // Validadores de paginación
  pagination: t.Object({
    page: t.Optional(t.Number({ minimum: 1, default: 1 })),
    limit: t.Optional(t.Number({ minimum: 1, maximum: 100, default: 20 }))
  }),
  
  // Validadores de fechas
  dateString: t.String({ format: 'date', error: 'El formato de fecha debe ser YYYY-MM-DD' }),
  
  // Validadores de email
  email: t.String({ format: 'email', error: 'El formato del email no es válido' }),
  
  // Validadores de contraseñas
  password: t.String({ 
    minLength: 8, 
    pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{8,}$',
    error: 'La contraseña debe tener al menos 8 caracteres, incluir una minúscula, una mayúscula y un número'
  }),
  
  // Validadores de URL
  url: t.String({
    format: 'uri',
    error: 'La URL no tiene un formato válido'
  }),
  
  // Validador de número positivo
  positiveNumber: t.Number({
    minimum: 0,
    error: 'El número debe ser positivo'
  }),
  
  // Validador de nombre (sin caracteres especiales)
  name: t.String({
    pattern: '^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\\s]{2,50}$',
    error: 'El nombre debe contener solo letras y espacios (2-50 caracteres)'
  }),
  
  // Validador de texto seguro (prevenir XSS)
  safeText: t.String({
    transform: ['trim'],
    error: 'El texto contiene caracteres no permitidos'
  })
};

export const validateId = (id: string): string => {
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidPattern.test(id)) {
    throw new BadRequestError('El formato del ID no es válido');
  }
  return id;
};

export const validateMealType = (mealType: string): string => {
  const validMealTypes = ['BREAKFAST', 'LUNCH', 'DINNER', 'SNACK', 'OTHER'];
  if (!validMealTypes.includes(mealType)) {
    throw new BadRequestError(`Tipo de comida inválido. Debe ser uno de: ${validMealTypes.join(', ')}`);
  }
  return mealType;
};

export const validateDayOfWeek = (day: number): number => {
  if (day < 1 || day > 7) {
    throw new BadRequestError('El día de la semana debe estar entre 1 (Lunes) y 7 (Domingo)');
  }
  return day;
};

// Middleware que aplica las validaciones
export const validationMiddleware = new Elysia({ name: 'validation-middleware' })
  .derive({ as: 'global' }, ({ params, query, body }) => {
    // Aquí podríamos añadir validaciones globales adicionales si fuera necesario
    
    return {
      // Utilidades de validación que estarán disponibles en todas las rutas
      validateParams: {
        id: () => {
          if (params && params.id) {
            return validateId(params.id);
          }
          throw new BadRequestError('ID no proporcionado');
        },
        mealPlanId: () => {
          if (params && params.mealPlanId) {
            return validateId(params.mealPlanId);
          }
          throw new BadRequestError('ID del plan de comidas no proporcionado');
        },
        entryId: () => {
          if (params && params.entryId) {
            return validateId(params.entryId);
          }
          throw new BadRequestError('ID de la entrada no proporcionado');
        }
      }
    };
  });
