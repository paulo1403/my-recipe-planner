import { Elysia } from 'elysia';
import { TooManyRequestsError } from './error-handler';

// Simple in-memory rate limiter
// In production, you'd use Redis or another distributed solution
const ipRequestMap = new Map<string, { count: number; timestamp: number }>();

// Add a TooManyRequestsError class to the error-handler.ts file
export const rateLimiterMiddleware = new Elysia({ name: 'rate-limiter' })
  .derive({ as: 'global' }, ({ request }) => {
    return {
      rateLimit: (
        options: { 
          limit: number; 
          window: number; // in seconds
          errorMessage?: string;
        }
      ) => {
        const ip = request.headers.get('x-forwarded-for') || 'unknown';
        const now = Date.now();
        const windowMs = options.window * 1000;
        
        if (!ipRequestMap.has(ip)) {
          ipRequestMap.set(ip, { count: 1, timestamp: now });
          return;
        }
        
        const record = ipRequestMap.get(ip)!;
        
        // Reset count if window has passed
        if (now - record.timestamp > windowMs) {
          record.count = 1;
          record.timestamp = now;
          return;
        }
        
        // Increment and check
        record.count++;
        if (record.count > options.limit) {
          throw new TooManyRequestsError(
            options.errorMessage || `Demasiadas solicitudes. Por favor, inténtelo de nuevo en ${Math.ceil(windowMs / 1000)} segundos.`
          );
        }
      }
    };
  });

// Cleanup old entries every 5 minutes
if (process.env.NODE_ENV !== 'test') {
  setInterval(() => {
    const now = Date.now();
    for (const [ip, data] of ipRequestMap.entries()) {
      if (now - data.timestamp > 15 * 60 * 1000) { // 15 minutes
        ipRequestMap.delete(ip);
      }
    }
  }, 5 * 60 * 1000);
}
