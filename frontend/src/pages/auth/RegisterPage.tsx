import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';
import { ProButton } from '../../components/ui/ProButton';
import { ProInput } from '../../components/ui/ProInput';
import { ProCard } from '../../components/ui/ProCard';
import { useAuth } from '../../hooks/useAuth';
import EmailVerification from '../../components/auth/EmailVerification';
import toast from 'react-hot-toast';

export const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await register(formData);
      toast.success('Registration successful! Please check your email for verification code.');
      setRegisteredEmail(formData.email);
      setShowVerification(true);
    } catch (error: any) {
      toast.error(error.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerified = (token: string) => {
    toast.success('Email verified successfully! Welcome to CV Maker.');
    navigate('/dashboard', { replace: true });
  };

  const handleBackToRegister = () => {
    setShowVerification(false);
    setFormData({ email: '', password: '', confirmPassword: '' });
    setErrors({});
  };

  if (showVerification) {
    return (
      <EmailVerification
        email={registeredEmail}
        onVerified={handleVerified}
        onBack={handleBackToRegister}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-pattern opacity-40"></div>
      
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent-light/20 via-transparent to-transparent"></div>

      <div className="relative z-10 w-full max-w-md animate-fade-in-up">
        <ProCard variant="elevated" className="p-10 shadow-premium-lg">
          {/* Logo/Brand */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-accent rounded-2xl mb-6 shadow-soft-lg">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 1 1 0 000 2H6a2 2 0 100 4h2a2 2 0 100-4h2a1 1 0 100-2 2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2H6z" clipRule="evenodd"/>
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-text-primary mb-3 tracking-tight">Create Account</h1>
            <p className="text-text-secondary text-base">Join CV Maker and build your professional resume</p>
          </div>

          {/* Register Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <ProInput
              name="email"
              type="email"
              placeholder="name@example.com"
              label="Email Address"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              icon={<Mail className="w-5 h-5" />}
              variant="default"
              required
            />

            <ProInput
              name="password"
              type="password"
              placeholder="Create a password"
              label="Password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              icon={<Lock className="w-5 h-5" />}
              variant="default"
              helperText="Must be at least 6 characters"
              required
            />

            <ProInput
              name="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              label="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              icon={<Lock className="w-5 h-5" />}
              variant="default"
              required
            />

            {/* Terms and conditions */}
            <div className="flex items-start gap-3 pt-1">
              <input
                type="checkbox"
                className="mt-0.5 w-4 h-4 rounded border-border text-accent focus:ring-accent/20 focus:ring-2 transition-colors cursor-pointer"
                required
              />
              <span className="text-sm text-text-secondary leading-relaxed">
                I agree to the{' '}
                <Link to="/terms" className="text-accent hover:text-accent-hover font-medium transition-colors">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-accent hover:text-accent-hover font-medium transition-colors">
                  Privacy Policy
                </Link>
              </span>
            </div>

            {/* Submit Button */}
            <ProButton
              type="submit"
              loading={isLoading}
              fullWidth
              size="lg"
              variant="primary"
              className="mt-6"
            >
              {isLoading ? 'Creating account...' : 'Create Account'}
              {!isLoading && <ArrowRight className="w-4 h-4" />}
            </ProButton>
          </form>

          {/* Sign in link */}
          <div className="mt-8 text-center pt-6 border-t border-border">
            <p className="text-text-secondary text-sm">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-accent font-medium hover:text-accent-hover transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </ProCard>

        {/* Footer */}
        <div className="mt-8 text-center text-text-tertiary text-sm">
          <p>&copy; 2024 CV Maker. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
