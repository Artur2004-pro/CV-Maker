import React from 'react';
import { clsx } from 'clsx';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'glass' | 'minimal' | 'elevated';
  helperText?: string;
}

export const ProInput: React.FC<InputProps> = ({
  label,
  error,
  icon,
  variant = 'default',
  helperText,
  className,
  ...props
}) => {
  const baseClasses = 'w-full px-4 py-3 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-1 placeholder-gray-400';
  
  const variants = {
    default: 'border-gray-200 bg-white hover:border-gray-300 focus:border-blue-500 focus:ring-blue-500',
    glass: 'border-white/20 bg-white/80 backdrop-blur-xl text-gray-900 placeholder-gray-500 hover:bg-white hover:border-gray-300 focus:border-blue-500 focus:ring-blue-500',
    minimal: 'border-0 bg-gray-50 hover:bg-gray-100 focus:bg-white focus:border-blue-500 focus:ring-blue-500',
    elevated: 'border-gray-200 bg-white shadow-sm hover:shadow-md focus:border-blue-500 focus:ring-blue-500'
  };

  const inputClasses = clsx(
    baseClasses,
    variants[variant],
    icon && 'pl-12',
    error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
    className
  );

  const labelClasses = clsx(
    'block text-sm font-semibold mb-2 transition-colors',
    error ? 'text-red-600' : 'text-gray-700'
  );

  const iconClasses = clsx(
    'absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors',
    error ? 'text-red-400' : 'text-gray-400'
  );

  return (
    <div className="w-full">
      {label && (
        <label className={labelClasses}>
          {label}
        </label>
      )}
      <div className="relative group">
        {icon && (
          <div className={iconClasses}>
            {icon}
          </div>
        )}
        <input
          className={inputClasses}
          {...props}
        />
        {/* Input focus indicator */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 opacity-0 group-focus-within:opacity-10 transition-opacity duration-300 pointer-events-none" />
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600 flex items-center">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
      {helperText && !error && (
        <p className="mt-2 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
};
