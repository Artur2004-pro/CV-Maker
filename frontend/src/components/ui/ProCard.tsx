import React from 'react';
import { clsx } from 'clsx';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'elevated' | 'minimal' | 'gradient';
  children: React.ReactNode;
}

export const ProCard: React.FC<CardProps> = ({
  variant = 'default',
  children,
  className,
  ...props
}) => {
  const baseClasses = 'rounded-2xl transition-all duration-300 ease-out';
  
  const variants = {
    default: 'bg-white border border-gray-100 shadow-sm hover:shadow-md',
    glass: 'bg-white/80 backdrop-blur-xl border border-white/20 shadow-xl hover:shadow-2xl',
    elevated: 'bg-white border border-gray-100 shadow-lg hover:shadow-xl',
    minimal: 'bg-white border-0 shadow-none',
    gradient: 'bg-gradient-to-br from-white to-gray-50 border border-gray-100 shadow-sm hover:shadow-md'
  };

  const classes = clsx(
    baseClasses,
    variants[variant],
    className
  );

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};
