import React from 'react';

const TailwindTest: React.FC = () => {
  return (
    <div className="card p-6 max-w-sm mx-auto my-8 flex items-center space-x-4">
      <div className="shrink-0">
        <div className="h-12 w-12 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold">RP</div>
      </div>
      <div>
        <div className="text-xl font-medium text-primary-900">Recipe Planner</div>
        <p>Your meal planning made easy!</p>
      </div>
    </div>
  );
};

export default TailwindTest;
