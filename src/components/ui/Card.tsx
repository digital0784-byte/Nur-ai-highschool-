import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outline' | 'flat' | 'warm';
  noPadding?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  noPadding = false,
  className = '',
  ...props
}) => {
  const variantStyles = {
    default: 'bg-white border border-stone-200/80 shadow-xs',
    elevated: 'bg-white border border-stone-200 shadow-sm hover:shadow-md transition-shadow',
    outline: 'bg-transparent border border-stone-300',
    flat: 'bg-stone-50/70 border border-stone-200/60',
    warm: 'bg-[#FAF6EC] border border-[#C5B8A4] shadow-xs',
  };

  return (
    <div
      className={`rounded-2xl overflow-hidden transition-all ${variantStyles[variant]} ${
        noPadding ? '' : 'p-4 sm:p-5'
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<{
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}> = ({ title, subtitle, action, icon, className = '' }) => (
  <div className={`flex items-start justify-between gap-3 pb-3 border-b border-stone-100 ${className}`}>
    <div className="flex items-center gap-2.5 min-w-0">
      {icon && (
        <div className="w-8 h-8 rounded-xl bg-stone-100 flex items-center justify-center text-stone-700 shrink-0">
          {icon}
        </div>
      )}
      <div className="min-w-0">
        <h3 className="text-sm sm:text-base font-bold text-stone-900 truncate">{title}</h3>
        {subtitle && <p className="text-xs text-stone-500 truncate mt-0.5">{subtitle}</p>}
      </div>
    </div>
    {action && <div className="shrink-0 flex items-center gap-1.5">{action}</div>}
  </div>
);

export const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => <div className={`pt-3 ${className}`}>{children}</div>;

export const CardFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => (
  <div className={`pt-3 mt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500 ${className}`}>
    {children}
  </div>
);
