import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Checkbox } from './ui/checkbox';
import { Eye, ArrowLeft, User, Mail, Lock, Shield, Key } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { PageType } from '../App';

interface SignupPageProps {
  navigateTo: (page: PageType) => void;
  onSignup: (name: string, email: string, password: string) => void;
}

export default function SignupPage({ navigateTo, onSignup }: SignupPageProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState('');

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError('');
    
    if (!validateForm()) return;
    setIsLoading(true);

    try {
      await onSignup(formData.name, formData.email, formData.password);
      // Success is handled by auth state change in App.tsx
    } catch (err: any) {
      setServerError(err.message || 'Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center px-6 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--cyber-purple)]/10 via-transparent to-[var(--neon-blue)]/10"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--neon-purple)]/5 rounded-full blur-3xl"></div>

        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigateTo('landing')}
          className="absolute top-8 left-8 text-gray-400 hover:text-white z-20"
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
            <h1 className="text-white mb-2">Create Your Account</h1>
            <p className="text-gray-400">Join the fight against fake news</p>
          </div>

          <Card className="bg-gray-900/50 border-[var(--neon-purple)]/30 backdrop-blur-md">
            <CardHeader className="text-center">
              <CardTitle className="text-white">Sign Up</CardTitle>
              <CardDescription className="text-gray-400">
                Get started with your free TruthLens account
              </CardDescription>
            </CardHeader>
            <CardContent>
              {serverError && (
                <div className="mb-4 p-3 bg-red-900/30 border border-red-500/50 rounded text-red-400 text-sm text-center">
                  {serverError}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-300">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Jane Doe"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="pl-10 bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-[var(--neon-purple)] focus:ring-[var(--neon-purple)]"
                    />
                  </div>
                  {errors.name && <p className="text-red-400 text-sm">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-300">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="jane@example.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="pl-10 bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-[var(--neon-purple)] focus:ring-[var(--neon-purple)]"
                    />
                  </div>
                  {errors.email && <p className="text-red-400 text-sm">{errors.email}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-300">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className="pl-10 pr-10 bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-[var(--neon-purple)] focus:ring-[var(--neon-purple)]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showPassword ? <Eye className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-red-400 text-sm">{errors.password}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-gray-300">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      className="pl-10 bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-[var(--neon-purple)] focus:ring-[var(--neon-purple)]"
                    />
                  </div>
                  {errors.confirmPassword && <p className="text-red-400 text-sm">{errors.confirmPassword}</p>}
                </div>

                <div className="flex items-start space-x-3 pt-2">
                  <Checkbox
                    id="terms"
                    checked={formData.agreeToTerms}
                    onCheckedChange={(checked) => handleInputChange('agreeToTerms', checked)}
                    className="mt-1 border-gray-600 data-[state=checked]:bg-[var(--neon-purple)] data-[state=checked]:border-[var(--neon-purple)]"
                  />
                  <Label htmlFor="terms" className="text-sm text-gray-400 leading-relaxed">
                    I agree to the{' '}
                    <a href="#" className="text-[var(--neon-purple)] hover:text-[var(--neon-blue)] transition-colors">
                      Terms and Conditions
                    </a>
                  </Label>
                </div>
                {errors.agreeToTerms && <p className="text-red-400 text-sm">{errors.agreeToTerms}</p>}

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[var(--cyber-purple)] to-[var(--neon-purple)] hover:opacity-90 transition-opacity mt-4"
                  disabled={isLoading}
                >
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-gray-400">
                  Already have an account?{' '}
                  <button
                    onClick={() => navigateTo('login')}
                    className="text-[var(--neon-purple)] hover:text-[var(--neon-blue)] transition-colors"
                  >
                    Sign in
                  </button>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Right Side - Illustration */}
      <div className="hidden lg:flex flex-1 items-center justify-center p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-bl from-[var(--neon-purple)]/20 to-[var(--electric-blue)]/20"></div>
        <div className="relative max-w-lg">
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--neon-purple)]/30 to-[var(--neon-blue)]/30 rounded-3xl blur-3xl"></div>
          <ImageWithFallback 
            src="https://images.unsplash.com/photo-1510222755157-fc26750f1199?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjeWJlcnB1bmslMjBuZW9uJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NTk3NDEyNDF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Cyberpunk Technology"
            className="relative rounded-3xl shadow-2xl w-full h-[600px] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-3xl"></div>
          <div className="absolute bottom-8 left-8 right-8">
            <div className="flex items-center space-x-3 mb-4">
              <Shield className="h-8 w-8 text-[var(--neon-green)] glow-effect" />
              <h3 className="text-white text-xl">Secure & Private</h3>
            </div>
            <p className="text-gray-300">
              Your data is encrypted and secure. We use advanced AI to analyze content 
              without storing your personal information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}