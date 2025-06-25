import React from 'react';
import Button from './ui/Button';
import Input from './ui/Input';

const LoginForm: React.FC = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login attempt with:', { email, password });
    // Authentication logic would go here
  };
  
  return (
    <div className="max-w-md mx-auto my-10 p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-center text-primary-800 mb-6">Login to Recipe Planner</h2>
      
      <form onSubmit={handleSubmit}>
        <Input
          label="Email Address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          className="mb-4"
        />
        
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
          className="mb-6"
        />
        
        <div className="flex justify-between mb-6">
          <div className="flex items-center">
            <input
              id="remember-me"
              type="checkbox"
            />
            <label htmlFor="remember-me" className="ml-2 text-sm">
              Remember me
            </label>
          </div>
          
          <a href="#" className="text-sm">
            Forgot password?
          </a>
        </div>
        
        <Button type="submit" variant="primary" className="w-full">
          Sign in
        </Button>
      </form>
      
      <div className="mt-6 text-center">
        <p className="text-sm">
          Don't have an account?{' '}
          <a href="#" className="font-medium">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
