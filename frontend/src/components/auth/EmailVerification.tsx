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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%234F46E5' fill-opacity='0.05'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`
        }} />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <ProCard variant="elevated" className="p-8 shadow-2xl border-0">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl mb-4 shadow-lg">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Verify Your Email</h1>
            <p className="text-gray-600">
              We've sent a 6-digit code to<br />
              <span className="font-semibold text-gray-900">{email}</span>
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
                variant="default"
                maxLength={6}
                required
                className="text-center text-2xl tracking-widest font-mono"
                helperText="Enter the 6-digit code from your email"
              />
            </div>

            {/* Resend Code */}
            <div className="text-center">
              <button
                type="button"
                onClick={handleResend}
                disabled={isResending}
                className="text-gray-600 hover:text-blue-600 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
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
                variant="primary"
                className="py-3 shadow-lg hover:shadow-xl"
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
                className="py-3 border-gray-300 text-gray-700 hover:border-gray-400 hover:text-gray-900"
              >
                Back to Register
              </ProButton>
            </div>
          </form>

          {/* Help Text */}
          <div className="mt-6 text-center">
            <p className="text-gray-500 text-sm">
              Check your spam folder if you don't see the email
            </p>
          </div>
        </ProCard>
      </div>
    </div>
  );
};

export default EmailVerification;
