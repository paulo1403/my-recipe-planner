import { z, ZodSchema } from 'zod';

/**
 * Generic form validation function using Zod
 * @param schema Zod schema for validation
 * @param data Form data to validate
 * @returns Validation result with data and/or errors
 */
export function validateForm<T>(
  schema: ZodSchema<T>,
  data: unknown
): { success: boolean; data?: T; errors?: Record<string, string> } {
  try {
    const validData = schema.parse(data);
    return { success: true, data: validData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const formattedErrors: Record<string, string> = {};
      
      error.errors.forEach((err) => {
        if (err.path.length > 0) {
          const path = err.path.join('.');
          formattedErrors[path] = err.message;
        }
      });
      
      return { success: false, errors: formattedErrors };
    }
    
    return { 
      success: false, 
      errors: { _form: 'Error de validación desconocido' } 
    };
  }
}

/**
 * Validates an email address
 * @param email Email to validate
 * @returns Whether the email is valid
 */
export function isValidEmail(email: string): boolean {
  return z.string().email().safeParse(email).success;
}

/**
 * Validates a password string
 * @param password Password to validate
 * @returns Whether the password is valid (min 8 chars)
 */
export function isValidPassword(password: string): boolean {
  return z.string().min(8).safeParse(password).success;
}

/**
 * Checks if a string is a valid UUID
 * @param id String to check
 * @returns Whether the string is a valid UUID
 */
export function isValidUUID(id: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
}
