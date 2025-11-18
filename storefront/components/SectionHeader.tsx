import React from 'react';
import { cn } from '@/lib/utils';

/**
 * SectionHeader Component
 *
 * Cyberpunk-themed section header with neon glow effects.
 * Used for consistent section titles throughout the application.
 *
 * @example
 * <SectionHeader title="Produtos em Destaque" subtitle="Confira nossa seleção especial" />
 */

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  align?: 'left' | 'center' | 'right';
  className?: string;
}

export default function SectionHeader({
  title,
  subtitle,
  align = 'center',
  className,
}: SectionHeaderProps) {
  const alignClasses = {
    left: 'text-left items-start',
    center: 'text-center items-center',
    right: 'text-right items-end',
  };

  return (
    <div className={cn('flex flex-col gap-4 mb-12', alignClasses[align], className)}>
      <h2 className="text-4xl md:text-5xl font-display font-black uppercase tracking-wider text-gradient-neon animate-pulse-slow">
        {title}
      </h2>

      {subtitle && (
        <p className="text-lg md:text-xl text-gray-cyber-300 font-light max-w-2xl">
          {subtitle}
        </p>
      )}

      <div className="h-1 w-32 bg-gradient-cyber rounded-full shadow-neon-purple-sm" />
    </div>
  );
}

/**
 * SectionHeaderWithBorder Component
 * Alternative header with left border accent
 */
export function SectionHeaderWithBorder({
  title,
  subtitle,
  className,
}: Omit<SectionHeaderProps, 'align'>) {
  return (
    <div className={cn('mb-8', className)}>
      <h2 className="text-3xl md:text-4xl font-display font-bold neon-text-purple uppercase tracking-wider border-l-4 border-neon-purple pl-4 shadow-neon-purple-sm mb-2">
        {title}
      </h2>

      {subtitle && (
        <p className="text-base md:text-lg text-gray-cyber-300 ml-5">
          {subtitle}
        </p>
      )}
    </div>
  );
}
