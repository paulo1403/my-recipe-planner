# Recipe Planner Frontend

Una aplicación frontend para la planificación de recetas y comidas construida con React, TypeScript, Tailwind CSS y Vite.

## Características

- Autenticación de usuarios con JWT
- Gestión de recetas (crear, leer, actualizar, eliminar)
- Búsqueda de recetas externas
- Planificación de comidas con recetas personalizadas
- Generación de lista de compras

## Stack Tecnológico

- **Framework**: [React](https://reactjs.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Router**: [React Router](https://reactrouter.com/)
- **Estado Global**: [React Query](https://tanstack.com/query)
- **Estilos**: [Tailwind CSS](https://tailwindcss.com/)
- **Validación**: [Zod](https://zod.dev/)
- **HTTP Client**: [Axios](https://axios-http.com/)

## Instalación y Configuración

### Requisitos Previos

- [Node.js](https://nodejs.org/) 16+
- [Bun](https://bun.sh/) (recomendado)

### Variables de Entorno

Crear un archivo `.env` en la raíz del proyecto:

```
VITE_API_URL=http://localhost:3000
```

### Instalación

```bash
# Instalar dependencias
bun install

# Iniciar servidor de desarrollo
bun run dev
```

## Estructura del Proyecto

```
src/
├── api/            # Cliente API y endpoints
├── assets/         # Archivos estáticos (imágenes, etc.)
├── components/     # Componentes reutilizables
├── context/        # Contextos de React (Auth, etc.)
├── hooks/          # Custom hooks
├── pages/          # Componentes de página
├── types/          # TypeScript interfaces y tipos
├── utils/          # Utilidades y funciones helper
├── App.tsx         # Componente principal de la app
└── main.tsx        # Punto de entrada
```

## Scripts Disponibles

- `bun run dev` - Inicia el servidor de desarrollo
- `bun run build` - Construye la aplicación para producción
- `bun run lint` - Ejecuta ESLint para verificar el código
- `bun run preview` - Inicia un servidor para previsualizar la build

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
