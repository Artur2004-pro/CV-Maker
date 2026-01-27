import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { ProButton } from '../../components/ui/ProButton';
import { ProInput } from '../../components/ui/ProInput';
import { ProCard } from '../../components/ui/ProCard';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';

export const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await login(formData);
      toast.success('Login successful!');
    } catch (error: any) {
      toast.error(error.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

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
            <h1 className="text-4xl font-bold text-text-primary mb-3 tracking-tight">Welcome Back</h1>
            <p className="text-text-secondary text-base">Sign in to your CV Maker account</p>
          </div>

          {/* Login Form */}
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
              placeholder="Enter your password"
              label="Password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              icon={<Lock className="w-5 h-5" />}
              variant="default"
              required
            />

            {/* Remember me & Forgot password */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center text-text-secondary text-sm cursor-pointer group">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-border text-accent focus:ring-accent/20 focus:ring-2 transition-colors cursor-pointer"
                />
                <span className="ml-2 group-hover:text-text-primary transition-colors">Remember me</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-sm text-accent hover:text-accent-hover font-medium transition-colors"
              >
                Forgot password?
              </Link>
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
              {isLoading ? 'Signing in...' : 'Sign In'}
              {!isLoading && <ArrowRight className="w-4 h-4" />}
            </ProButton>
          </form>

          {/* Sign up link */}
          <div className="mt-8 text-center pt-6 border-t border-border">
            <p className="text-text-secondary text-sm">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="text-accent font-medium hover:text-accent-hover transition-colors"
              >
                Sign up for free
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

export default LoginPage;
