import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Star, TrendingUp, Zap } from 'lucide-react';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive:
          'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
        outline: 'text-foreground',
        success: 'border-transparent bg-green-100 text-green-800',
        warning: 'border-transparent bg-yellow-100 text-yellow-800',
        info: 'border-transparent bg-blue-100 text-blue-800',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  difficulty?: 'easy' | 'medium' | 'hard';
  showIcon?: boolean;
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, difficulty, showIcon = false, children, ...props }, ref) => {
    const getDifficultyVariant = () => {
      switch (difficulty) {
        case 'easy':
          return 'success';
        case 'medium':
          return 'warning';
        case 'hard':
          return 'destructive';
        default:
          return variant;
      }
    };

    const getDifficultyIcon = () => {
      if (!showIcon || !difficulty) return null;
      
      switch (difficulty) {
        case 'easy':
          return <Star className="w-3 h-3 mr-1" />;
        case 'medium':
          return <TrendingUp className="w-3 h-3 mr-1" />;
        case 'hard':
          return <Zap className="w-3 h-3 mr-1" />;
        default:
          return null;
      }
    };

    const finalVariant = difficulty ? getDifficultyVariant() : variant;

    return (
      <div
        className={cn(badgeVariants({ variant: finalVariant }), className)}
        ref={ref}
        {...props}
      >
        {getDifficultyIcon()}
        {children || (difficulty && difficulty.charAt(0).toUpperCase() + difficulty.slice(1))}
      </div>
    );
  }
);

Badge.displayName = 'Badge';

export { Badge, badgeVariants };
