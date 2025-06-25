import { Elysia, t } from 'elysia';
import { verify, hash } from 'argon2';

export const authRoutes = new Elysia({ name: 'auth-routes' })
  .model({
    signUp: t.Object({
      email: t.String({ format: 'email' }),
      password: t.String({ minLength: 8 }),
      username: t.Optional(t.String()),
    }),
    signIn: t.Object({
      email: t.String({ format: 'email' }),
      password: t.String(),
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
          const existingUser = await db.user.findUnique({
            where: { email }
          });
          
          if (existingUser) {
            set.status = 409;
            return { 
              success: false, 
              message: 'El usuario con este correo electrónico ya existe.' 
            };
          }
          
          const hashedPassword = await hash(password);
          
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
          console.error('Error registering user:', error);
          set.status = 500;
          return {
            success: false,
            message: 'Error al registrar usuario'
          };
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
          const user = await db.user.findUnique({
            where: { email }
          });
          
          if (!user) {
            set.status = 401;
            return {
              success: false,
              message: 'Credenciales inválidas'
            };
          }
          
          const isPasswordValid = await verify(user.password, password);
          
          if (!isPasswordValid) {
            set.status = 401;
            return {
              success: false,
              message: 'Credenciales inválidas'
            };
          }
          
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
          console.error('Error logging in:', error);
          set.status = 500;
          return {
            success: false,
            message: 'Error al iniciar sesión'
          };
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
