import { Elysia, t } from 'elysia';
import { verify, hash } from 'argon2';
import { 
  BadRequestError, 
  ConflictError, 
  InternalServerError, 
  UnauthorizedError 
} from '../middlewares/error-handler';
import { validators } from '../middlewares/validation';

export const authRoutes = new Elysia({ name: 'auth-routes' })
  .model({
    signUp: t.Object({
      email: validators.email,
      password: validators.password,
      username: t.Optional(t.String({ 
        minLength: 3,
        maxLength: 50,
        error: 'El nombre de usuario debe tener entre 3 y 50 caracteres'
      })),
    }),
    signIn: t.Object({
      email: validators.email,
      password: t.String({ error: 'La contraseña es requerida' }),
    }),
  })
  .derive({ as: 'global' }, ({}) => {
    return {} as unknown as Record<string, unknown>;
  })
  .group('/auth', (app: any) => app
    .post('/register', 
      async ({ body, set, store: { jwt, db } }: any) => {
        const { email, password, username } = body;
        
        try {
          // Validar email
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            throw new BadRequestError('El formato del email no es válido');
          }
          
          // Validar contraseña
          if (password.length < 8) {
            throw new BadRequestError('La contraseña debe tener al menos 8 caracteres');
          }
          
          // Verificar si el usuario ya existe
          const existingUser = await db.user.findUnique({
            where: { email }
          });
          
          if (existingUser) {
            throw new ConflictError('El usuario con este correo electrónico ya existe');
          }
          
          // Hash de la contraseña
          const hashedPassword = await hash(password);
          
          // Crear usuario
          const newUser = await db.user.create({
            data: {
              email,
              password: hashedPassword,
              username,
            },
            select: {
              id: true,
              email: true,
              username: true,
            }
          });
          
          // Generar JWT
          const token = await jwt.sign({
            userId: newUser.id,
            email: newUser.email,
            exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60
          });
          
          set.status = 201;
          return {
            success: true,
            message: 'Registro exitoso',
            user: newUser,
            token
          };
        } catch (error) {
          // El middleware de manejo de errores se encargará de esto
          console.error('Error registering user:', error);
          throw error instanceof Error ? error : new InternalServerError('Error al registrar usuario');
        }
      },
      {
        body: 'signUp',
        detail: {
          summary: 'Registrar un nuevo usuario',
          tags: ['Auth']
        }
      }
    )
    
    .post('/login',
      async ({ body, set, store: { jwt, db } }: any) => {
        const { email, password } = body;
        
        try {
          // Validar datos de entrada
          if (!email || !password) {
            throw new BadRequestError('Email y contraseña son obligatorios');
          }
          
          // Buscar usuario
          const user = await db.user.findUnique({
            where: { email }
          });
          
          // No revelar si el usuario existe o no por seguridad
          // Solo decir "credenciales inválidas" en ambos casos
          if (!user) {
            throw new UnauthorizedError('Credenciales inválidas');
          }
          
          // Verificar contraseña
          const isPasswordValid = await verify(user.password, password);
          
          if (!isPasswordValid) {
            throw new UnauthorizedError('Credenciales inválidas');
          }
          
          // Generar JWT
          const token = await jwt.sign({
            userId: user.id,
            email: user.email,
            exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60
          });
          
          return {
            success: true,
            message: 'Inicio de sesión exitoso',
            user: {
              id: user.id,
              email: user.email,
              username: user.username
            },
            token
          };
        } catch (error) {
          // El middleware de manejo de errores se encargará de esto
          console.error('Error logging in:', error);
          throw error instanceof Error ? error : new InternalServerError('Error al iniciar sesión');
        }
      },
      {
        body: 'signIn',
        detail: {
          summary: 'Iniciar sesión de usuario',
          tags: ['Auth']
        }
      }
    )
    .get('/me',
      async ({ auth, set }: any) => {
        const authResult = await auth();
        
        if (!authResult.isAuthorized) {
          set.status = 401;
          return authResult;
        }
        
        return {
          success: true,
          message: 'Perfil de usuario autenticado',
          user: authResult.user
        };
      },
      {
        detail: {
          summary: 'Obtener perfil del usuario autenticado',
          tags: ['Auth']
        }
      }
    )
  );
