import React from 'react';
import { clsx } from 'clsx';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'glass';
}

export const ProInput: React.FC<InputProps> = ({
  label,
  error,
  icon,
  variant = 'default',
  className,
  ...props
}) => {
  const baseClasses = 'w-full px-4 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent';
  
  const variants = {
    default: 'border-gray-300 bg-white',
    glass: 'border-white/20 bg-white/10 backdrop-blur-sm text-white placeholder-white/70',
  };

  const inputClasses = clsx(
    baseClasses,
    variants[variant],
    icon && 'pl-10',
    error && 'border-red-500 focus:ring-red-500',
    className
  );

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium mb-1 text-gray-700">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        <input
          className={inputClasses}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};
