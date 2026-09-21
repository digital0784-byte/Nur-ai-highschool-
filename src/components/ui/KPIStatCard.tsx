import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

interface KPIStatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  iconBgColor?: string;
  change?: {
    value: string;
    type: 'positive' | 'negative' | 'neutral';
  };
  onClick?: () => void;
  className?: string;
}

export const KPIStatCard: React.FC<KPIStatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  iconBgColor = 'bg-emerald-50 text-emerald-700',
  change,
  onClick,
  className = '',
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl p-4 sm:p-5 border border-stone-200/80 shadow-xs transition-all ${
        onClick ? 'cursor-pointer hover:border-emerald-300 hover:shadow-sm' : ''
      } ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-stone-500 truncate mb-1">
            {title}
          </p>
          <div className="flex items-baseline gap-2">
            <h4 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight font-mono">
              {value}
            </h4>
            {change && (
              <span
                className={`inline-flex items-center text-xs font-bold px-1.5 py-0.5 rounded-md ${
                  change.type === 'positive'
                    ? 'bg-emerald-50 text-emerald-700'
                    : change.type === 'negative'
                    ? 'bg-rose-50 text-rose-700'
                    : 'bg-stone-100 text-stone-600'
                }`}
              >
                {change.type === 'positive' && <ArrowUpRight className="w-3 h-3 mr-0.5" />}
                {change.type === 'negative' && <ArrowDownRight className="w-3 h-3 mr-0.5" />}
                {change.type === 'neutral' && <Minus className="w-3 h-3 mr-0.5" />}
                {change.value}
              </span>
            )}
          </div>
          {subtitle && <p className="text-xs text-stone-400 mt-1 truncate">{subtitle}</p>}
        </div>

        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${iconBgColor}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};
