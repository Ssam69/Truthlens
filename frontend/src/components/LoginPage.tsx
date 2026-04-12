import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Eye, ArrowLeft, Lock, Mail, Key } from 'lucide-react';
import { PageType } from '../App';

interface LoginPageProps {
  navigateTo: (page: PageType) => void;
  onLogin: (email: string, password: string) => void;
}

export default function LoginPage({ navigateTo, onLogin }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await onLogin(email, password);
      // Success is handled by auth state change in App.tsx
    } catch (err: any) {
      setError(err.message || 'Failed to login. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--electric-blue)]/10 via-transparent to-[var(--neon-purple)]/10"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--neon-blue)]/5 rounded-full blur-3xl"></div>
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
            <Eye className="h-10 w-10 text-[var(--neon-blue)] glow-effect" />
            <span className="neon-text text-2xl" style={{ color: 'var(--neon-blue)' }}>TruthLens</span>
          </div>
          <h1 className="text-white mb-2">Welcome Back</h1>
          <p className="text-gray-400">Sign in to your account</p>
        </div>

        <Card className="bg-gray-900/50 border-[var(--neon-blue)]/30 backdrop-blur-md">
          <CardHeader className="text-center">
            <CardTitle className="text-white">Sign In</CardTitle>
            <CardDescription className="text-gray-400">
              Enter your credentials to access your dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 p-3 bg-red-900/30 border border-red-500/50 rounded text-red-400 text-sm text-center">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-[var(--neon-blue)] focus:ring-[var(--neon-blue)]"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-300">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-[var(--neon-blue)] focus:ring-[var(--neon-blue)]"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPassword ? <Eye className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-[var(--electric-blue)] to-[var(--neon-blue)] hover:opacity-90 transition-opacity"
                disabled={isLoading}
              >
                {isLoading ? 'Signing In...' : 'Login'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-400">
                Don't have an account?{' '}
                <button
                  onClick={() => navigateTo('signup')}
                  className="text-[var(--neon-blue)] hover:text-[var(--neon-purple)] transition-colors"
                >
                  Sign up
                </button>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center text-sm text-gray-400">
          <p>
            By signing in, you agree to our{' '}
            <a href="#" className="text-[var(--neon-blue)] hover:text-[var(--neon-purple)] transition-colors">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="text-[var(--neon-blue)] hover:text-[var(--neon-purple)] transition-colors">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}