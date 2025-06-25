import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Clock, Users, ChefHat, Search, Filter } from 'lucide-react';

const RecipesPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
            <ChefHat className="w-8 h-8 text-blue-600" />
            <span>My Recipes</span>
          </h1>
          <p className="text-gray-600 mt-2">Manage and discover new recipes</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Search className="w-4 h-4 mr-2" />
            Search
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add New Recipe
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Sample Recipe Cards */}
        {[1, 2, 3, 4, 5, 6].map((id) => (
          <Card key={id} className="overflow-hidden">
            <div className="h-48 bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500">Recipe Image</span>
            </div>
            <CardHeader>
              <CardTitle className="text-lg">Sample Recipe {id}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                A delicious recipe that you'll love to make and share with family.
              </p>
              <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                <span className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>30 min</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span>4 servings</span>
                </span>
                <Badge difficulty="easy" showIcon />
              </div>
              <Button variant="outline" className="w-full">
                View Recipe
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RecipesPage;
