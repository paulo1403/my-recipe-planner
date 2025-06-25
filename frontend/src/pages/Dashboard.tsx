import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '../stores/authStore';
import { 
  ChefHat, 
  Calendar, 
  ShoppingCart, 
  Plus, 
  TrendingUp, 
  Clock, 
  Star,
  Users
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuthStore();

  // Mock data - in a real app, this would come from your API
  const stats = {
    totalRecipes: 12,
    activeMealPlans: 3,
    shoppingItems: 8,
    favoriteRecipes: 5,
  };

  const recentActivity = [
    { id: 1, action: 'Added "Pasta Carbonara" to favorites', time: '2 hours ago', type: 'favorite' },
    { id: 2, action: 'Created meal plan for next week', time: '1 day ago', type: 'meal-plan' },
    { id: 3, action: 'Added 5 items to shopping list', time: '2 days ago', type: 'shopping' },
    { id: 4, action: 'Shared "Chocolate Cake" recipe', time: '3 days ago', type: 'share' },
  ];

  const popularRecipes = [
    { id: 1, name: 'Spaghetti Carbonara', time: '25 min', difficulty: 'Easy', rating: 4.8 },
    { id: 2, name: 'Chicken Teriyaki', time: '30 min', difficulty: 'Medium', rating: 4.6 },
    { id: 3, name: 'Vegetable Stir Fry', time: '15 min', difficulty: 'Easy', rating: 4.5 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.name}! 👋
        </h1>
        <p className="text-gray-600 mt-2">
          Here's what's happening with your recipe planning today
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Button asChild className="h-auto p-4 justify-start">
          <Link to="/recipes/new" className="flex items-center space-x-3">
            <Plus className="w-5 h-5" />
            <div className="text-left">
              <div className="font-medium">Add New Recipe</div>
              <div className="text-sm opacity-90">Create your favorite dish</div>
            </div>
          </Link>
        </Button>
        
        <Button asChild variant="outline" className="h-auto p-4 justify-start">
          <Link to="/meal-plans/new" className="flex items-center space-x-3">
            <Calendar className="w-5 h-5" />
            <div className="text-left">
              <div className="font-medium">Plan Meals</div>
              <div className="text-sm text-gray-600">Organize your week</div>
            </div>
          </Link>
        </Button>
        
        <Button asChild variant="outline" className="h-auto p-4 justify-start">
          <Link to="/shopping-list" className="flex items-center space-x-3">
            <ShoppingCart className="w-5 h-5" />
            <div className="text-left">
              <div className="font-medium">Shopping List</div>
              <div className="text-sm text-gray-600">View your list</div>
            </div>
          </Link>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Recipes</CardTitle>
            <ChefHat className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.totalRecipes}</div>
            <p className="text-xs text-gray-600 mt-1">+2 from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Meal Plans</CardTitle>
            <Calendar className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.activeMealPlans}</div>
            <p className="text-xs text-gray-600 mt-1">For this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Shopping Items</CardTitle>
            <ShoppingCart className="w-4 h-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.shoppingItems}</div>
            <p className="text-xs text-gray-600 mt-1">Items to buy</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Favorite Recipes</CardTitle>
            <Star className="w-4 h-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.favoriteRecipes}</div>
            <p className="text-xs text-gray-600 mt-1">Your top picks</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5" />
              <span>Recent Activity</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className={`h-2 w-2 rounded-full mt-2 ${
                    activity.type === 'favorite' ? 'bg-yellow-500' :
                    activity.type === 'meal-plan' ? 'bg-green-500' :
                    activity.type === 'shopping' ? 'bg-purple-500' :
                    'bg-blue-500'
                  }`}></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              View All Activity
            </Button>
          </CardContent>
        </Card>

        {/* Popular Recipes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Star className="w-5 h-5" />
              <span>Popular Recipes</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {popularRecipes.map((recipe) => (
                <div key={recipe.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{recipe.name}</h4>
                    <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                      <span className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{recipe.time}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Users className="w-3 h-3" />
                        <span>{recipe.difficulty}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Star className="w-3 h-3 text-yellow-500" />
                        <span>{recipe.rating}</span>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4" asChild>
              <Link to="/recipes">Browse All Recipes</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
