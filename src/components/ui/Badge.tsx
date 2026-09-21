import React from 'react';

export type BadgeVariant = 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'erp';
export type BadgeSize = 'xs' | 'sm' | 'md';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  pulse?: boolean;
  className?: string;
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'sm',
  dot = false,
  pulse = false,
  className = '',
  icon,
}) => {
  const variantStyles: Record<BadgeVariant, { bg: string; text: string; border: string; dotColor: string }> = {
    primary: {
      bg: 'bg-emerald-50 text-emerald-800',
      text: 'text-emerald-800',
      border: 'border-emerald-200/80',
      dotColor: 'bg-emerald-500',
    },
    success: {
      bg: 'bg-emerald-50 text-emerald-800',
      text: 'text-emerald-800',
      border: 'border-emerald-200/80',
      dotColor: 'bg-emerald-500',
    },
    warning: {
      bg: 'bg-amber-50 text-amber-900',
      text: 'text-amber-900',
      border: 'border-amber-200/80',
      dotColor: 'bg-amber-500',
    },
    danger: {
      bg: 'bg-rose-50 text-rose-800',
      text: 'text-rose-800',
      border: 'border-rose-200/80',
      dotColor: 'bg-rose-500',
    },
    info: {
      bg: 'bg-blue-50 text-blue-800',
      text: 'text-blue-800',
      border: 'border-blue-200/80',
      dotColor: 'bg-blue-500',
    },
    neutral: {
      bg: 'bg-stone-100 text-stone-700',
      text: 'text-stone-700',
      border: 'border-stone-200',
      dotColor: 'bg-stone-400',
    },
    erp: {
      bg: 'bg-[#FAF6EC] text-[#38332D]',
      text: 'text-[#38332D]',
      border: 'border-[#C5B8A4]',
      dotColor: 'bg-[#38332D]',
    },
  };

  const sizeStyles: Record<BadgeSize, string> = {
    xs: 'px-1.5 py-0.5 text-[10px] font-medium tracking-tight',
    sm: 'px-2 py-0.5 text-[11px] font-medium',
    md: 'px-2.5 py-1 text-xs font-semibold',
  };

  const current = variantStyles[variant];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border ${current.bg} ${current.border} ${sizeStyles[size]} transition-colors select-none ${className}`}
    >
      {dot && (
        <span className="relative flex h-1.5 w-1.5 shrink-0">
          {pulse && (
            <span
              className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${current.dotColor}`}
            />
          )}
          <span className={`relative inline-flex h-1.5 w-1.5 rounded-full ${current.dotColor}`} />
        </span>
      )}
      {icon && <span className="shrink-0">{icon}</span>}
      <span className="truncate whitespace-nowrap">{children}</span>
    </span>
  );
};
