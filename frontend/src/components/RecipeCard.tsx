import React from 'react';

const RecipeCard: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-md max-w-sm mx-auto my-8 overflow-hidden">
      <div className="md:flex">
        <div className="md:shrink-0">
          <div className="h-48 w-full bg-blue-500 flex items-center justify-center text-white">
            <span className="text-xl font-bold">Recipe Image</span>
          </div>
        </div>
        <div className="p-8">
          <div className="uppercase tracking-wide text-sm text-blue-600 font-semibold">Recipe</div>
          <a href="#" className="block mt-1 text-lg leading-tight font-medium text-gray-900 hover:underline">
            Delicious Pasta Carbonara
          </a>
          <p className="mt-2 text-gray-600">
            A classic Italian pasta dish with eggs, cheese, pancetta, and pepper.
          </p>
          <div className="mt-4 flex items-center text-sm text-gray-500">
            <span className="mr-2">Time:</span>
            <span>30 min</span>
            <span className="mx-2 text-gray-300">•</span>
            <span className="mr-2">Difficulty:</span>
            <span>Easy</span>
          </div>
          <button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors">
            View Recipe
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
