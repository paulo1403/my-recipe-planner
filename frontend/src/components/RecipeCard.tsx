import React from 'react';

const RecipeCard: React.FC = () => {
  return (
    <div className="card max-w-sm mx-auto my-8 overflow-hidden">
      <div className="md:flex">
        <div className="md:shrink-0">
          <div className="h-48 w-full bg-primary-500 flex items-center justify-center text-white">
            <span className="text-xl font-bold">Recipe Image</span>
          </div>
        </div>
        <div className="p-8">
          <div className="uppercase tracking-wide text-sm text-primary-600 font-semibold">Recipe</div>
          <a href="#" className="block mt-1 text-lg leading-tight font-medium hover:underline">
            Delicious Pasta Carbonara
          </a>
          <p className="mt-2">
            A classic Italian pasta dish with eggs, cheese, pancetta, and pepper.
          </p>
          <div className="mt-4 flex items-center">
            <span className="text-sm mr-2" style={{ color: 'var(--color-gray-400)' }}>Time:</span>
            <span className="text-sm">30 min</span>
            <span className="mx-2" style={{ color: 'var(--color-gray-300)' }}>•</span>
            <span className="text-sm mr-2" style={{ color: 'var(--color-gray-400)' }}>Difficulty:</span>
            <span className="text-sm">Easy</span>
          </div>
          <button className="btn btn-primary mt-4">
            View Recipe
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
