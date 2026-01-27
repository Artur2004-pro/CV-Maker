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
  const baseClasses = 'w-full px-4 py-3 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0 placeholder:text-text-tertiary text-text-primary';
  
  const variants = {
    default: 'border-border bg-surface hover:border-gray-300 focus:border-accent focus:ring-accent/20',
    glass: 'border-white/30 bg-white/80 backdrop-blur-xl hover:bg-white hover:border-gray-300 focus:border-accent focus:ring-accent/20',
    minimal: 'border-0 bg-surface-hover hover:bg-surface focus:bg-surface focus:ring-accent/20',
    elevated: 'border-border bg-surface shadow-soft hover:shadow-soft-lg focus:border-accent focus:ring-accent/20'
  };

  const inputClasses = clsx(
    baseClasses,
    variants[variant],
    icon && 'pl-11',
    error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
    className
  );

  const labelClasses = clsx(
    'block text-sm font-medium mb-2 transition-colors',
    error ? 'text-red-600' : 'text-text-primary'
  );

  const iconClasses = clsx(
    'absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors pointer-events-none',
    error ? 'text-red-400' : 'text-text-tertiary group-focus-within:text-accent'
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
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600 flex items-center gap-1.5 animate-fade-in">
          <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span>{error}</span>
        </p>
      )}
      {helperText && !error && (
        <p className="mt-2 text-sm text-text-secondary">{helperText}</p>
      )}
    </div>
  );
};
