import React, { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Eye, ArrowLeft, Key, Mail, RefreshCw } from 'lucide-react';
import { PageType } from '../App';

interface OTPVerificationPageProps {
  email: string;
  onVerify: (otp: string) => Promise<boolean>;
  onResend: () => void;
  navigateTo: (page: PageType) => void;
}

export default function OTPVerificationPage({ email, onVerify, onResend, navigateTo }: OTPVerificationPageProps) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(60);
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => setTimer(prev => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) {
      // Handle paste
      const pastedData = value.substring(0, 6).split('');
      const newOtp = [...otp];
      pastedData.forEach((char, i) => {
        if (index + i < 6) newOtp[index + i] = char;
      });
      setOtp(newOtp);
      // Focus last filled or next
      const nextIndex = Math.min(index + pastedData.length, 5);
      inputRefs[nextIndex].current?.focus();
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input
    if (value && index < 5) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpValue = otp.join('');
    if (otpValue.length < 6) {
      setError('Please enter the full 6-digit code');
      return;
    }

    setIsLoading(true);
    setError('');
    try {
      const success = await onVerify(otpValue);
      if (!success) {
        setError('Invalid or expired verification code');
      }
    } catch (err: any) {
      setError(err.message || 'Verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = () => {
    if (timer === 0) {
      onResend();
      setTimer(60);
      setError('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--neon-purple)]/10 via-transparent to-[var(--neon-blue)]/10"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--neon-purple)]/5 rounded-full blur-3xl"></div>

      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => navigateTo('signup')}
        className="absolute top-8 left-8 text-gray-400 hover:text-white"
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        Back to Signup
      </Button>

      <div className="w-full max-w-md relative z-10 slide-in">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Key className="h-10 w-10 text-[var(--neon-purple)] glow-effect" />
            <span className="neon-text text-2xl" style={{ color: 'var(--neon-purple)' }}>Verification</span>
          </div>
          <h1 className="text-white mb-2">Check Your Email</h1>
          <p className="text-gray-400 text-sm">
            We've sent a 6-digit verification code to<br />
            <span className="text-[var(--neon-blue)] font-medium">{email}</span>
          </p>
        </div>

        <Card className="bg-gray-900/50 border-[var(--neon-purple)]/30 backdrop-blur-md">
          <CardHeader className="text-center">
            <CardTitle className="text-white">Enter OTP Code</CardTitle>
            <CardDescription className="text-gray-400">
              Enter the code sent to your email to activate your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-6 p-3 bg-red-900/30 border border-red-500/50 rounded text-red-400 text-sm text-center animate-shake">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="flex justify-between gap-2">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={inputRefs[index]}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-14 text-center text-xl font-bold bg-gray-800/50 border-2 border-gray-600 rounded-lg text-white focus:border-[var(--neon-purple)] focus:ring-[var(--neon-purple)] focus:outline-none transition-all"
                    required
                  />
                ))}
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-[var(--cyber-purple)] to-[var(--neon-purple)] hover:opacity-90 transition-opacity"
                disabled={isLoading}
              >
                {isLoading ? 'Verifying...' : 'Verify & Continue'}
              </Button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-gray-400 text-sm">
                Didn't receive the code?{' '}
                <button
                  onClick={handleResend}
                  disabled={timer > 0}
                  className={`inline-flex items-center transition-colors ${
                    timer > 0 ? 'text-gray-600 cursor-not-allowed' : 'text-[var(--neon-purple)] hover:text-[var(--neon-blue)]'
                  }`}
                >
                  {timer > 0 ? `Resend in ${timer}s` : (
                    <>
                      <RefreshCw className="h-3 w-3 mr-1" />
                      Resend Code
                    </>
                  )}
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
