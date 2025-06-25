// Middleware centralizado para manejo de errores en la aplicación

import { Elysia } from 'elysia';

// Clase base para errores de la aplicación
export class AppError extends Error {
  statusCode: number;
  
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Errores específicos que podemos lanzar en nuestra aplicación
export class BadRequestError extends AppError {
  constructor(message: string) {
    super(message, 400);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string) {
    super(message, 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string) {
    super(message, 403);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string) {
    super(message, 404);
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 409);
  }
}

export class InternalServerError extends AppError {
  constructor(message: string = 'Error interno del servidor') {
    super(message, 500);
  }
}

export class TooManyRequestsError extends AppError {
  constructor(message: string = 'Demasiadas solicitudes. Por favor, inténtelo más tarde.') {
    super(message, 429);
  }
}

// Middleware de manejo de errores para Elysia
export const errorHandler = new Elysia({ name: 'error-handler' })
  .onError(({ code, error, set, request }) => {
    // Log del error para diagnóstico en el servidor
    console.error(`Error [${code}]:`, error);
    const isDev = process.env.NODE_ENV !== 'production';
    
    // Si es un error personalizado de nuestra aplicación
    if (error instanceof AppError) {
      set.status = error.statusCode;
      return {
        success: false,
        error: error.name,
        message: error.message,
        path: isDev ? request.url : undefined,
        timestamp: new Date().toISOString()
      };
    }
    
    // Manejar errores de validación de Elysia/TypeBox con más detalle
    if (code === 'VALIDATION') {
      set.status = 400;
      
      // Intentar extraer más información sobre el error de validación
      let validationDetails;
      if (typeof error === 'object' && error !== null) {
        const anyError = error as any;
        if (anyError.validator && anyError.path) {
          validationDetails = {
            field: anyError.path,
            validator: anyError.validator,
            expected: anyError.expected
          };
        }
      }
      
      return {
        success: false,
        error: 'ValidationError',
        message: 'Error de validación',
        details: isDev ? (error instanceof Error ? error.message : 'Datos de entrada inválidos') : undefined,
        validationInfo: isDev ? validationDetails : undefined,
        path: isDev ? request.url : undefined,
        timestamp: new Date().toISOString()
      };
    }
    
    // Manejar errores de Prisma con más detalle
    if ((error as any).name === 'PrismaClientKnownRequestError' || 
        (error as any).name === 'PrismaClientValidationError') {
      set.status = 400;
      
      // Extraer código de error de Prisma si existe
      let prismaErrorCode;
      if ((error as any).code) {
        prismaErrorCode = (error as any).code;
      }
      
      return {
        success: false,
        error: 'DatabaseError',
        message: 'Error en los datos enviados a la base de datos',
        details: isDev 
          ? (error instanceof Error ? error.message : String(error))
          : undefined,
        code: isDev ? prismaErrorCode : undefined,
        path: isDev ? request.url : undefined,
        timestamp: new Date().toISOString()
      };
    }
    
    // Para cualquier otro tipo de error, devolver error 500
    set.status = 500;
    return {
      success: false,
      error: 'InternalServerError',
      message: isDev 
        ? (error instanceof Error ? error.message : String(error)) || 'Error interno del servidor'
        : 'Error interno del servidor',
      path: isDev ? request.url : undefined,
      timestamp: new Date().toISOString(),
      // Solo para desarrollo, incluir stack trace
      stack: isDev && error instanceof Error ? error.stack : undefined
    };
  });
