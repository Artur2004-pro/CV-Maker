import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Mail, 
  Lock, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  Shield, 
  CheckCircle,
  AlertCircle,
  Loader2,
  User,
  Chrome,
  Github,
  Twitter
} from 'lucide-react';
import { ProButton } from '../../components/ui/ProButton';
import { ProInput } from '../../components/ui/ProInput';
import { ProCard } from '../../components/ui/ProCard';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';

interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface LoginErrors {
  email?: string;
  password?: string;
  general?: string;
}

export const ProfessionalLoginPage: React.FC = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [errors, setErrors] = useState<LoginErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockTimeLeft, setBlockTimeLeft] = useState(0);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get redirect path from location state
  const from = (location.state as any)?.from?.pathname || '/dashboard';

  // Check for blocked status and countdown
  useEffect(() => {
    if (isBlocked && blockTimeLeft > 0) {
      const timer = setTimeout(() => {
        setBlockTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (isBlocked && blockTimeLeft === 0) {
      setIsBlocked(false);
      setLoginAttempts(0);
    }
  }, [isBlocked, blockTimeLeft]);

  // Load saved email if remember me was checked
  useEffect(() => {
    const savedEmail = localStorage.getItem('remembered_email');
    if (savedEmail) {
      setFormData(prev => ({ ...prev, email: savedEmail, rememberMe: true }));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name as keyof LoginErrors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: LoginErrors = {};

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if user is blocked
    if (isBlocked) {
      toast.error(`Too many failed attempts. Please try again in ${blockTimeLeft} seconds.`);
      return;
    }

    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      await login({
        email: formData.email.trim(),
        password: formData.password,
      });

      // Save email if remember me is checked
      if (formData.rememberMe) {
        localStorage.setItem('remembered_email', formData.email);
      } else {
        localStorage.removeItem('remembered_email');
      }

      // Reset login attempts on successful login
      setLoginAttempts(0);
      setIsBlocked(false);

      toast.success('Welcome back! Login successful.');
      navigate(from, { replace: true });
      
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Increment login attempts
      const newAttempts = loginAttempts + 1;
      setLoginAttempts(newAttempts);
      
      // Block user after 5 failed attempts
      if (newAttempts >= 5) {
        setIsBlocked(true);
        setBlockTimeLeft(300); // 5 minutes block
        toast.error('Too many failed login attempts. Please try again in 5 minutes.');
      } else {
        // Show specific error message
        const errorMessage = error.response?.data?.error || error.message || 'Login failed. Please try again.';
        setErrors({ general: errorMessage });
        toast.error(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    toast(`${provider} login coming soon!`);
    // TODO: Implement social login
  };

  const handleForgotPassword = () => {
    navigate('/forgot-password');
  };

  const formatBlockTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%234F46E5' fill-opacity='0.03'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`
        }} />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl mb-4 shadow-lg">
            <User className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to your CV Maker account</p>
        </div>

        <ProCard variant="elevated" className="p-8 shadow-2xl border-0">
          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            {/* General Error */}
            {errors.general && (
              <div className="flex items-center p-4 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-600 mr-3 flex-shrink-0" />
                <p className="text-red-700 text-sm">{errors.general}</p>
              </div>
            )}

            {/* Block Warning */}
            {isBlocked && (
              <div className="flex items-center p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <Shield className="w-5 h-5 text-orange-600 mr-3 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-orange-700 text-sm font-medium">Account Temporarily Locked</p>
                  <p className="text-orange-600 text-xs mt-1">
                    Try again in {formatBlockTime(blockTimeLeft)}
                  </p>
                </div>
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
                placeholder="Enter your email"
                variant="default"
                disabled={isLoading || isBlocked}
                helperText="We'll never share your email with anyone else"
              />
            </div>

            {/* Password Field */}
            <div>
              <div className="relative">
                <ProInput
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  label="Password"
                  value={formData.password}
                  onChange={handleChange}
                  error={errors.password}
                  icon={<Lock className="w-5 h-5" />}
                  placeholder="Enter your password"
                  variant="default"
                  disabled={isLoading || isBlocked}
                  helperText="Must be at least 6 characters with uppercase, lowercase, and number"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 transition-colors"
                  disabled={isLoading || isBlocked}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  disabled={isLoading || isBlocked}
                />
                <span className="ml-2 text-sm text-gray-700">Remember me</span>
              </label>
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                disabled={isLoading || isBlocked}
              >
                Forgot password?
              </button>
            </div>

            {/* Login Button */}
            <ProButton
              type="submit"
              loading={isLoading}
              disabled={isBlocked}
              variant="primary"
              size="lg"
              className="w-full py-3 shadow-lg hover:shadow-xl"
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
              {!isLoading && <ArrowRight className="w-4 h-4 ml-2" />}
            </ProButton>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          {/* Social Login */}
          <div className="grid grid-cols-3 gap-3">
            <ProButton
              type="button"
              onClick={() => handleSocialLogin('Google')}
              variant="outline"
              className="flex items-center justify-center py-2 border-gray-300 hover:border-gray-400"
              disabled={isLoading || isBlocked}
            >
              <Chrome className="w-4 h-4" />
            </ProButton>
            <ProButton
              type="button"
              onClick={() => handleSocialLogin('GitHub')}
              variant="outline"
              className="flex items-center justify-center py-2 border-gray-300 hover:border-gray-400"
              disabled={isLoading || isBlocked}
            >
              <Github className="w-4 h-4" />
            </ProButton>
            <ProButton
              type="button"
              onClick={() => handleSocialLogin('Twitter')}
              variant="outline"
              className="flex items-center justify-center py-2 border-gray-300 hover:border-gray-400"
              disabled={isLoading || isBlocked}
            >
              <Twitter className="w-4 h-4" />
            </ProButton>
          </div>

          {/* Sign Up Link */}
          <div className="text-center mt-6">
            <p className="text-gray-600 text-sm">
              Don't have an account?{' '}
              <Link 
                to="/register" 
                className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                Sign up for free
              </Link>
            </p>
          </div>

          {/* Security Badge */}
          <div className="flex items-center justify-center mt-6 text-xs text-gray-500">
            <Shield className="w-3 h-3 mr-1" />
            <span>Secured with 256-bit SSL encryption</span>
          </div>
        </ProCard>

        {/* Login Attempts Warning */}
        {loginAttempts > 0 && loginAttempts < 5 && (
          <div className="mt-4 text-center">
            <p className="text-sm text-orange-600">
              {5 - loginAttempts} attempts remaining
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfessionalLoginPage;
