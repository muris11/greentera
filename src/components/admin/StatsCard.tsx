import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'emerald' | 'blue' | 'amber' | 'purple' | 'rose';
}

const colorClasses = {
  emerald: 'from-emerald-100 to-teal-100 border-emerald-300 text-emerald-600',
  blue: 'from-blue-100 to-cyan-100 border-blue-300 text-blue-600',
  amber: 'from-amber-100 to-orange-100 border-amber-300 text-amber-600',
  purple: 'from-purple-100 to-pink-100 border-purple-300 text-purple-600',
  rose: 'from-rose-100 to-red-100 border-rose-300 text-rose-600',
};

export function StatsCard({ title, value, icon: Icon, trend, color = 'emerald' }: StatsCardProps) {
  return (
    <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${colorClasses[color]} border backdrop-blur-xl p-6`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-foreground/60 mb-1">{title}</p>
          <p className="text-3xl font-bold text-foreground">{value.toLocaleString()}</p>
          {trend && (
            <p className={`text-sm mt-2 ${trend.isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
              {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}% from last week
            </p>
          )}
        </div>
        <div className={`p-3 rounded-xl bg-white/50`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}
