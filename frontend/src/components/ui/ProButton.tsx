import React from 'react';
import { Loader2 } from 'lucide-react';
import { clsx } from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost' | 'white' | 'gradient';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const ProButton: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  children,
  className,
  disabled,
  ...props
}) => {
  const baseClasses = 'btn-base relative overflow-hidden group';
  
  const variants = {
    primary: 'bg-accent hover:bg-accent-hover text-white shadow-soft hover:shadow-soft-lg focus:ring-accent/50 active:scale-[0.98]',
    secondary: 'bg-surface border border-border hover:border-gray-300 text-text-primary shadow-soft hover:shadow-soft-lg focus:ring-gray-300 active:scale-[0.98]',
    accent: 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-soft-lg hover:shadow-soft-xl focus:ring-purple-500/50 active:scale-[0.98]',
    outline: 'border-2 border-border bg-transparent hover:bg-surface-hover text-text-primary focus:ring-gray-300 active:scale-[0.98]',
    ghost: 'hover:bg-surface-hover text-text-secondary hover:text-text-primary focus:ring-gray-300',
    white: 'bg-white hover:bg-surface-hover text-text-primary border border-border shadow-soft hover:shadow-soft-lg focus:ring-gray-300 active:scale-[0.98]',
    gradient: 'bg-gradient-to-r from-accent via-blue-600 to-purple-600 hover:from-accent-hover hover:via-blue-700 hover:to-purple-700 text-white shadow-premium-lg hover:shadow-premium-lg focus:ring-accent/50 active:scale-[0.98]'
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-5 py-2.5 text-base',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg'
  };

  const classes = clsx(
    baseClasses,
    variants[variant],
    sizes[size],
    fullWidth && 'w-full',
    (disabled || loading) && 'opacity-50 cursor-not-allowed !transform-none',
    className
  );

  return (
    <button
      className={classes}
      disabled={disabled || loading}
      {...props}
    >
      {/* Subtle shine effect on hover */}
      {variant === 'primary' && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500 ease-out" />
      )}
      
      <span className="relative z-10 flex items-center justify-center gap-2">
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        {children}
      </span>
    </button>
  );
};
