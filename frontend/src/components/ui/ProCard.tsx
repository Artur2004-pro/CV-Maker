import React from 'react';
import { clsx } from 'clsx';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'elevated' | 'minimal' | 'gradient';
  hover?: boolean;
  children: React.ReactNode;
}

export const ProCard: React.FC<CardProps> = ({
  variant = 'default',
  hover = false,
  children,
  className,
  ...props
}) => {
  const baseClasses = 'rounded-2xl transition-all duration-200 ease-out';
  
  const variants = {
    default: 'bg-surface border border-border shadow-soft',
    glass: 'bg-white/80 backdrop-blur-xl border border-white/50 shadow-soft-lg',
    elevated: 'bg-surface border border-border shadow-premium',
    minimal: 'bg-transparent border-0 shadow-none',
    gradient: 'bg-gradient-to-br from-surface to-surface-hover border border-border shadow-soft'
  };

  const hoverClasses = hover ? 'card-hover cursor-pointer' : '';

  const classes = clsx(
    baseClasses,
    variants[variant],
    hoverClasses,
    className
  );

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};
