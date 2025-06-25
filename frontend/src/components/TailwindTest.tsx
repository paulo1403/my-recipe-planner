import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const TailwindTest: React.FC = () => {
  return (
    <Card className="max-w-sm mx-auto my-8">
      <CardContent className="flex items-center space-x-4 p-6">
        <div className="shrink-0">
          <div className="h-12 w-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">RP</div>
        </div>
        <div>
          <div className="text-xl font-medium text-gray-900">Recipe Planner</div>
          <p className="text-gray-600">Your meal planning made easy!</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TailwindTest;
