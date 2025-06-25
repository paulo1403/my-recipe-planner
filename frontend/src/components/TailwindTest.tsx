import React from 'react';

const TailwindTest: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 max-w-sm mx-auto my-8 flex items-center space-x-4">
      <div className="shrink-0">
        <div className="h-12 w-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">RP</div>
      </div>
      <div>
        <div className="text-xl font-medium text-gray-900">Recipe Planner</div>
        <p className="text-gray-600">Your meal planning made easy!</p>
      </div>
    </div>
  );
};

export default TailwindTest;
