import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import TailwindTest from './components/TailwindTest';
import RecipeCard from './components/RecipeCard';
import LoginForm from './components/LoginForm';

// Temporary placeholder components - we'll create these files soon
const Home = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <h1 className="text-center my-8 text-3xl font-bold text-gray-900">Recipe Planner</h1>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <TailwindTest />
      <RecipeCard />
      <TailwindTest />
    </div>
  </div>
);
const Login = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <h1 className="text-center mb-8 text-3xl font-bold text-gray-900">Welcome Back</h1>
    <LoginForm />
  </div>
);
const Register = () => <div>Register Page</div>;
const Recipes = () => <div>Recipes Page</div>;
const RecipeDetail = () => <div>Recipe Detail Page</div>;
const CreateRecipe = () => <div>Create Recipe Page</div>;
const EditRecipe = () => <div>Edit Recipe Page</div>;
const MealPlans = () => <div>Meal Plans Page</div>;
const MealPlanDetail = () => <div>Meal Plan Detail Page</div>;
const CreateMealPlan = () => <div>Create Meal Plan Page</div>;
const EditMealPlan = () => <div>Edit Meal Plan Page</div>;
const ShoppingList = () => <div>Shopping List Page</div>;
const Profile = () => <div>User Profile Page</div>;

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      retry: 1,
    },
  },
});

// Create router 
const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/recipes',
    element: <Recipes />,
  },
  {
    path: '/recipes/new',
    element: <CreateRecipe />,
  },
  {
    path: '/recipes/:id',
    element: <RecipeDetail />,
  },
  {
    path: '/recipes/:id/edit',
    element: <EditRecipe />,
  },
  {
    path: '/meal-plans',
    element: <MealPlans />,
  },
  {
    path: '/meal-plans/new',
    element: <CreateMealPlan />,
  },
  {
    path: '/meal-plans/:id',
    element: <MealPlanDetail />,
  },
  {
    path: '/meal-plans/:id/edit',
    element: <EditMealPlan />,
  },
  {
    path: '/shopping-list',
    element: <ShoppingList />,
  },
  {
    path: '/profile',
    element: <Profile />,
  },
]);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
