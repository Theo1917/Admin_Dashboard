import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const Login = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!credentials.email || !credentials.password) {
      toast.error('Please enter both email and password');
      return;
    }
    
    try {
      await login(credentials.email, credentials.password);
      toast.success('Login successful!');
      navigate('/admin');
    } catch (error: any) {
      console.error('Login error:', error);
      const errorMessage = error.message || 'Login failed. Please check your credentials.';
      toast.error(errorMessage);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Admin Login</CardTitle>
          <p className="text-sm text-gray-600 text-center">
            Enter your credentials to access the admin dashboard
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={credentials.email}
                onChange={handleInputChange}
                disabled={isLoading}
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                value={credentials.password}
                onChange={handleInputChange}
                disabled={isLoading}
                required
              />
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
          
          <div className="mt-4 p-3 bg-blue-50 rounded-md">
            <p className="text-xs text-blue-600">
              <strong>Demo Credentials:</strong><br />
              Email: admin@fitflix.com<br />
              Password: admin123
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;