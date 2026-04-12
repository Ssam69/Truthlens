import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Eye, ArrowLeft, Lock, Mail, Shield, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';
import { PageType } from '../App';

interface AdminLoginPageProps {
  navigateTo: (page: PageType) => void;
  onAdminLogin: (email: string, password: string) => Promise<boolean>;
}

export default function AdminLoginPage({ navigateTo, onAdminLogin }: AdminLoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const success = await onAdminLogin(email, password);
      if (!success) {
        setError('Invalid admin credentials. Please try again.');
        setIsLoading(false);
      }
      // If success, App.tsx handles navigate to admin-dashboard
    } catch (err) {
      setError('Connection failed. Please ensure backend is running.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-transparent to-[var(--neon-purple)]/10"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[var(--neon-purple)]/5 rounded-full blur-3xl"></div>

      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => navigateTo('landing')}
        className="absolute top-8 left-8 text-gray-400 hover:text-white"
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        Back to Home
      </Button>

      <div className="w-full max-w-md relative z-10 slide-in">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Shield className="h-10 w-10 text-red-400 glow-effect" />
            <span className="neon-text text-2xl" style={{ color: '#ef4444' }}>Admin Portal</span>
          </div>
          <h1 className="text-white mb-2">Administrator Access</h1>
          <p className="text-gray-400">Sign in with your admin credentials to access the dashboard</p>
        </div>

        <Card className="bg-gray-900/50 border-red-400/30 backdrop-blur-md">
          <CardHeader className="text-center">
            <CardTitle className="text-white flex items-center justify-center space-x-2">
              <Shield className="h-5 w-5 text-red-400" />
              <span>Admin Sign In</span>
            </CardTitle>
            <CardDescription className="text-gray-400">
              Restricted access for authorized personnel only
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="admin-email" className="text-gray-300">Admin Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="admin-email"
                    type="email"
                    placeholder="admin@truthlens.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-red-400 focus:ring-red-400"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="admin-password" className="text-gray-300">Admin Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="admin-password"
                    type="password"
                    placeholder="Enter admin password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-red-400 focus:ring-red-400"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-red-600 to-red-500 hover:opacity-90 transition-opacity"
                disabled={isLoading}
              >
                {isLoading ? 'Authenticating...' : 'Sign In as Admin'}
              </Button>
            </form>

            <div className="mt-6 p-4 bg-yellow-900/20 border border-yellow-400/30 rounded-lg">
              <div className="flex items-start space-x-2">
                <AlertCircle className="h-5 w-5 text-yellow-400 mt-0.5" />
                <div>
                  <h4 className="text-yellow-400 text-sm mb-1">Demo Credentials</h4>
                  <p className="text-gray-300 text-xs">
                    Email: admin@truthlens.com<br />
                    Password: admin123
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm">
            Not an admin?{' '}
            <button
              onClick={() => navigateTo('login')}
              className="text-[var(--neon-blue)] hover:text-[var(--neon-purple)] transition-colors"
            >
              User login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}