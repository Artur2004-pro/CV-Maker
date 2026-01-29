import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Mail, 
  ArrowLeft, 
  CheckCircle, 
  Clock,
  Loader2,
  Shield,
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import { ProButton } from '../../components/ui/ProButton';
import { ProInput } from '../../components/ui/ProInput';
import { ProCard } from '../../components/ui/ProCard';
import { apiClient } from '../../services/apiClient';
import toast from 'react-hot-toast';

interface ForgotPasswordFormData {
  email: string;
}

interface ForgotPasswordErrors {
  email?: string;
  general?: string;
}

export const ForgotPasswordPage: React.FC = () => {
  const [formData, setFormData] = useState<ForgotPasswordFormData>({
    email: '',
  });
  const [errors, setErrors] = useState<ForgotPasswordErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [countdown, setCountdown] = useState(0);
  
  const navigate = useNavigate();

  // Countdown timer for resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name as keyof ForgotPasswordErrors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: ForgotPasswordErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (countdown > 0) {
      toast.error(`Please wait ${countdown} seconds before requesting another reset.`);
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const response = await apiClient.post('/auth/forgot-password', {
        email: formData.email.trim(),
      });

      if (response.success) {
        setIsSubmitted(true);
        setCountdown(60); // 60 second cooldown
        toast.success('Password reset instructions have been sent to your email.');
      } else {
        throw new Error(response.error || 'Failed to send reset instructions');
      }
    } catch (error: any) {
      console.error('Forgot password error:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Failed to send reset instructions';
      setErrors({ general: errorMessage });
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0) return;
    
    // Reset submitted state to allow resend
    setIsSubmitted(false);
    await handleSubmit(new Event('submit') as any);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%234F46E5' fill-opacity='0.03'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`
          }} />
        </div>

        <div className="relative z-10 w-full max-w-md">
          <ProCard variant="elevated" className="p-8 shadow-2xl border-0 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Check Your Email</h2>
            <p className="text-gray-600 mb-6">
              We've sent password reset instructions to<br />
              <span className="font-semibold text-gray-900">{formData.email}</span>
            </p>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <Clock className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                <div className="text-left">
                  <p className="text-blue-800 text-sm font-medium">What happens next?</p>
                  <ul className="text-blue-700 text-xs mt-1 space-y-1">
                    <li>• Check your inbox for the reset email</li>
                    <li>• Click the reset link in the email</li>
                    <li>• Create a new password</li>
                    <li>• Link expires in 30 minutes</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <ProButton
                onClick={handleResend}
                disabled={countdown > 0}
                variant="outline"
                className="w-full"
              >
                {countdown > 0 ? `Resend in ${countdown}s` : 'Resend Email'}
              </ProButton>
              
              <ProButton
                onClick={() => navigate('/login')}
                variant="ghost"
                className="w-full"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Login
              </ProButton>
            </div>

            <div className="mt-6 text-xs text-gray-500">
              Didn't receive the email? Check your spam folder or contact support.
            </div>
          </ProCard>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%234F46E5' fill-opacity='0.03'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`
        }} />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl mb-4 shadow-lg">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Forgot Password?</h1>
          <p className="text-gray-600">No worries, we'll help you reset it</p>
        </div>

        <ProCard variant="elevated" className="p-8 shadow-2xl border-0">
          {/* Back to Login */}
          <Link 
            to="/login"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to login
          </Link>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* General Error */}
            {errors.general && (
              <div className="flex items-center p-4 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-600 mr-3 flex-shrink-0" />
                <p className="text-red-700 text-sm">{errors.general}</p>
              </div>
            )}

            {/* Email Field */}
            <div>
              <ProInput
                name="email"
                type="email"
                label="Email Address"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                icon={<Mail className="w-5 h-5" />}
                placeholder="Enter your registered email"
                variant="default"
                disabled={isLoading}
                helperText="We'll send reset instructions to this email"
              />
            </div>

            {/* Submit Button */}
            <ProButton
              type="submit"
              loading={isLoading}
              variant="primary"
              size="lg"
              className="w-full py-3 shadow-lg hover:shadow-xl"
            >
              {isLoading ? 'Sending...' : 'Send Reset Instructions'}
              {!isLoading && <ArrowRight className="w-4 h-4 ml-2" />}
            </ProButton>
          </form>

          {/* Help Text */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Remember your password?{' '}
              <Link 
                to="/login" 
                className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>

          {/* Security Info */}
          <div className="mt-6 flex items-center justify-center text-xs text-gray-500">
            <Shield className="w-3 h-3 mr-1" />
            <span>Your information is secure and encrypted</span>
          </div>
        </ProCard>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
