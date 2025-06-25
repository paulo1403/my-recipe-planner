import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Utensils, ChefHat, Eye } from 'lucide-react';

const RecipeCard: React.FC = () => {
  return (
    <Card className="max-w-sm mx-auto my-8 overflow-hidden">
      <div className="md:flex">
        <div className="md:shrink-0">
          <div className="h-48 w-full bg-blue-500 flex items-center justify-center text-white">
            <ChefHat className="w-12 h-12" />
          </div>
        </div>
        <CardContent className="p-8">
          <div className="uppercase tracking-wide text-sm text-blue-600 font-semibold flex items-center space-x-1">
            <Utensils className="w-4 h-4" />
            <span>Recipe</span>
          </div>
          <a href="#" className="block mt-1 text-lg leading-tight font-medium text-gray-900 hover:underline">
            Delicious Pasta Carbonara
          </a>
          <p className="mt-2 text-gray-600">
            A classic Italian pasta dish with eggs, cheese, pancetta, and pepper.
          </p>
          <div className="mt-4 flex items-center text-sm text-gray-500">
            <Clock className="w-4 h-4 mr-1" />
            <span className="mr-2">30 min</span>
            <span className="mx-2 text-gray-300">•</span>
            <span className="mr-2">Easy</span>
          </div>
          <Button className="mt-4 flex items-center space-x-2">
            <Eye className="w-4 h-4" />
            <span>View Recipe</span>
          </Button>
        </CardContent>
      </div>
    </Card>
  );
};

export default RecipeCard;
