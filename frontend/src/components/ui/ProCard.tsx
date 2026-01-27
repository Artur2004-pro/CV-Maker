import React from 'react';
import { clsx } from 'clsx';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'elevated';
  children: React.ReactNode;
}

export const ProCard: React.FC<CardProps> = ({
  variant = 'default',
  children,
  className,
  ...props
}) => {
  const baseClasses = 'rounded-2xl transition-all duration-200';
  
  const variants = {
    default: 'bg-white border border-gray-200 shadow-sm',
    glass: 'glass-card',
    elevated: 'bg-white border border-gray-200 shadow-lg',
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
