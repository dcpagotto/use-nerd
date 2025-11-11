import React from 'react';
import { cn } from '@/lib/utils';

/**
 * LoadingSpinner Component
 *
 * A cyberpunk-themed loading spinner with neon glow effects.
 * Supports multiple sizes and color variants.
 *
 * @example
 * <LoadingSpinner size="medium" variant="purple" />
 */

export type SpinnerSize = 'small' | 'medium' | 'large';
export type SpinnerVariant = 'purple' | 'blue' | 'pink' | 'green';

interface LoadingSpinnerProps {
  size?: SpinnerSize;
  variant?: SpinnerVariant;
  className?: string;
  label?: string;
}

const sizeClasses: Record<SpinnerSize, string> = {
  small: 'h-4 w-4 border-2',
  medium: 'h-8 w-8 border-3',
  large: 'h-12 w-12 border-4',
};

const variantClasses: Record<SpinnerVariant, string> = {
  purple: 'border-neon-purple border-t-transparent shadow-neon-purple-sm',
  blue: 'border-neon-blue border-t-transparent shadow-neon-blue-sm',
  pink: 'border-neon-pink border-t-transparent shadow-neon-pink',
  green: 'border-neon-green border-t-transparent shadow-neon-green',
};

const glowClasses: Record<SpinnerVariant, string> = {
  purple: 'text-glow-purple',
  blue: 'text-glow-blue',
  pink: 'text-glow-pink',
  green: 'text-glow-green',
};

export default function LoadingSpinner({
  size = 'medium',
  variant = 'purple',
  className,
  label,
}: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3" role="status" aria-live="polite">
      <div
        className={cn(
          'animate-spin rounded-full',
          sizeClasses[size],
          variantClasses[variant],
          className
        )}
        aria-hidden="true"
      />
      {label && (
        <p className={cn('text-sm font-medium', glowClasses[variant])}>
          {label}
        </p>
      )}
      <span className="sr-only">Carregando...</span>
    </div>
  );
}

/**
 * FullPageSpinner - Loading spinner that covers the entire viewport
 */
export function FullPageSpinner({ variant = 'purple' }: { variant?: SpinnerVariant }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-cyber-dark/90 backdrop-blur-sm">
      <LoadingSpinner size="large" variant={variant} label="Carregando..." />
    </div>
  );
}

/**
 * InlineSpinner - Small spinner for inline use (buttons, etc.)
 */
export function InlineSpinner({ variant = 'purple', className }: { variant?: SpinnerVariant; className?: string }) {
  return (
    <div className={cn('inline-flex', className)}>
      <LoadingSpinner size="small" variant={variant} />
    </div>
  );
}
