import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import PublicLayout from './components/PublicLayout';
import Dashboard from './pages/Dashboard';
import RecipesPage from './pages/RecipesPage';

// Temporary placeholder components for routes not yet implemented
const MealPlansPage = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <h1 className="text-3xl font-bold text-gray-900">Meal Plans</h1>
    <p className="text-gray-600 mt-2">Coming soon...</p>
  </div>
);

const ShoppingListPage = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <h1 className="text-3xl font-bold text-gray-900">Shopping List</h1>
    <p className="text-gray-600 mt-2">Coming soon...</p>
  </div>
);

const RecipeDetail = () => <div>Recipe Detail Page</div>;
const CreateRecipe = () => <div>Create Recipe Page</div>;
const EditRecipe = () => <div>Edit Recipe Page</div>;
const MealPlanDetail = () => <div>Meal Plan Detail Page</div>;
const CreateMealPlan = () => <div>Create Meal Plan Page</div>;
const EditMealPlan = () => <div>Edit Meal Plan Page</div>;
const Profile = () => <div>User Profile Page</div>;

// Public login/register pages with layout
const LoginPage = () => (
  <PublicLayout>
    <LoginForm />
  </PublicLayout>
);

const RegisterPage = () => (
  <PublicLayout>
    <RegisterForm />
  </PublicLayout>
);

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      retry: 1,
    },
  },
});

// Create router with protected and public routes
const router = createBrowserRouter([
  // Public routes
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  // Protected routes
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: 'recipes',
        element: <RecipesPage />,
      },
      {
        path: 'recipes/new',
        element: <CreateRecipe />,
      },
      {
        path: 'recipes/:id',
        element: <RecipeDetail />,
      },
      {
        path: 'recipes/:id/edit',
        element: <EditRecipe />,
      },
      {
        path: 'meal-plans',
        element: <MealPlansPage />,
      },
      {
        path: 'meal-plans/new',
        element: <CreateMealPlan />,
      },
      {
        path: 'meal-plans/:id',
        element: <MealPlanDetail />,
      },
      {
        path: 'meal-plans/:id/edit',
        element: <EditMealPlan />,
      },
      {
        path: 'shopping-list',
        element: <ShoppingListPage />,
      },
      {
        path: 'profile',
        element: <Profile />,
      },
    ],
  },
]);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;
