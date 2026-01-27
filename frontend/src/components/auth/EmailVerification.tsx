import React, { useState } from 'react';
import { Mail, ArrowRight, RefreshCw } from 'lucide-react';
import { ProButton } from '../ui/ProButton';
import { ProInput } from '../ui/ProInput';
import { ProCard } from '../ui/ProCard';
import { apiClient } from '../../services/apiClient';
import type { VerifyEmailRequest, ResendVerificationRequest } from '../../types/api';
import toast from 'react-hot-toast';

interface EmailVerificationProps {
  email: string;
  onVerified: (token: string) => void;
  onBack: () => void;
}

export const EmailVerification: React.FC<EmailVerificationProps> = ({
  email,
  onVerified,
  onBack,
}) => {
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState('');

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!verificationCode || verificationCode.length !== 6) {
      setError('Please enter a 6-digit verification code');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await apiClient.post('/auth/verify-email', {
        email,
        code: verificationCode,
      } as VerifyEmailRequest);

      if (response.success && (response.data as any)?.token) {
        toast.success('Email verified successfully!');
        onVerified((response.data as any).token);
      } else {
        setError(response.error || 'Verification failed');
      }
    } catch (error: any) {
      setError(error.message || 'Invalid verification code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    
    try {
      const response = await apiClient.post('/auth/resend-verification', {
        email,
      } as ResendVerificationRequest);

      if (response.success) {
        toast.success('Verification code sent to your email');
      } else {
        toast.error(response.error || 'Failed to resend code');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to resend code');
    } finally {
      setIsResending(false);
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setVerificationCode(value);
    if (error) setError('');
  };

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <ProCard variant="glass" className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mb-4">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Verify Your Email</h1>
            <p className="text-white/80">
              We've sent a 6-digit code to<br />
              <span className="font-medium">{email}</span>
            </p>
          </div>

          {/* Verification Form */}
          <form onSubmit={handleVerify} className="space-y-6">
            <div>
              <ProInput
                name="verificationCode"
                type="text"
                placeholder="Enter 6-digit code"
                label="Verification Code"
                value={verificationCode}
                onChange={handleCodeChange}
                error={error}
                icon={<Mail className="w-5 h-5" />}
                variant="glass"
                maxLength={6}
                required
                className="text-center text-2xl tracking-widest"
              />
            </div>

            {/* Resend Code */}
            <div className="text-center">
              <button
                type="button"
                onClick={handleResend}
                disabled={isResending}
                className="text-white/80 hover:text-white text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
              >
                <RefreshCw className={`w-4 h-4 ${isResending ? 'animate-spin' : ''}`} />
                {isResending ? 'Sending...' : "Didn't receive the code? Resend"}
              </button>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <ProButton
                type="submit"
                loading={isLoading}
                fullWidth
                size="lg"
                className="py-3 bg-white/20 hover:bg-white/30 text-white border border-white/30"
              >
                {isLoading ? 'Verifying...' : 'Verify Email'}
                {!isLoading && <ArrowRight className="w-4 h-4 ml-2" />}
              </ProButton>

              <ProButton
                type="button"
                onClick={onBack}
                fullWidth
                size="lg"
                variant="outline"
                className="py-3 border-white/30 text-white/80 hover:text-white hover:bg-white/10"
              >
                Back to Register
              </ProButton>
            </div>
          </form>

          {/* Help Text */}
          <div className="mt-6 text-center">
            <p className="text-white/60 text-sm">
              Check your spam folder if you don't see the email
            </p>
          </div>
        </ProCard>
      </div>
    </div>
  );
};

export default EmailVerification;
