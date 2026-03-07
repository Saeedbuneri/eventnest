import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function StatsCard({ title, value, icon: Icon, change, changeLabel, color = 'brand' }) {
  const colors = {
    brand:  { bg: 'bg-brand-500/10',  icon: 'text-brand-400',  iconBg: 'bg-brand-500/15'  },
    green:  { bg: 'bg-green-500/10',  icon: 'text-green-400',  iconBg: 'bg-green-500/15'  },
    orange: { bg: 'bg-orange-500/10', icon: 'text-orange-400', iconBg: 'bg-orange-500/15' },
    blue:   { bg: 'bg-blue-500/10',   icon: 'text-blue-400',   iconBg: 'bg-blue-500/15'   },
    purple: { bg: 'bg-purple-500/10', icon: 'text-purple-400', iconBg: 'bg-purple-500/15' },
  };
  const c = colors[color] || colors.brand;

  const isPositive = change > 0;
  const isNeutral  = change === 0 || change === undefined || change === null;

  return (
    <div className="dashboard-stat-card flex items-center gap-4">
      <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center shrink-0', c.iconBg)}>
        <Icon className={cn('w-6 h-6', c.icon)} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm text-gray-400 truncate">{title}</p>
        <p className="text-2xl font-extrabold text-white leading-tight">{value}</p>
        {change !== undefined && (
          <div className="flex items-center gap-1 mt-0.5">
            {isNeutral ? (
              <Minus className="w-3.5 h-3.5 text-gray-400" />
            ) : isPositive ? (
              <TrendingUp className="w-3.5 h-3.5 text-green-500" />
            ) : (
              <TrendingDown className="w-3.5 h-3.5 text-red-500" />
            )}
            <span
              className={cn(
                'text-xs font-medium',
                isNeutral ? 'text-gray-400' : isPositive ? 'text-green-600' : 'text-red-500'
              )}
            >
              {isNeutral ? 'No change' : `${isPositive ? '+' : ''}${change}%`}
            </span>
            {changeLabel && (
              <span className="text-xs text-gray-400">{changeLabel}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
