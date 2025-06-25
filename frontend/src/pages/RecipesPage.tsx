import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const RecipesPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Recipes</h1>
          <p className="text-gray-600 mt-2">Manage and discover new recipes</p>
        </div>
        <Button>Add New Recipe</Button>
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
                <span>⏱️ 30 min</span>
                <span>👥 4 servings</span>
                <span>⭐ Easy</span>
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
