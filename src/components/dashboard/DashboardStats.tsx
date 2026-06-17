import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowUp, ArrowDown } from 'lucide-react';
import type { KpiStat } from '../../types/dashboard';
import { leadsWithStagePath } from '../../constants/routes';

interface DashboardStatsProps {
  stats: KpiStat[];
}

const accentStyles = {
  purple: {
    icon: 'bg-purple-100 text-purple-600',
    button: 'bg-purple-600 hover:bg-purple-700',
    ring: 'hover:ring-purple-100',
  },
  orange: {
    icon: 'bg-orange-100 text-orange-600',
    button: 'bg-orange-500 hover:bg-orange-600',
    ring: 'hover:ring-orange-100',
  },
  green: {
    icon: 'bg-green-100 text-green-600',
    button: 'bg-green-500 hover:bg-green-600',
    ring: 'hover:ring-green-100',
  },
  blue: {
    icon: 'bg-blue-100 text-blue-600',
    button: 'bg-blue-500 hover:bg-blue-600',
    ring: 'hover:ring-blue-100',
  },
};

function DashboardStatsComponent({ stats }: DashboardStatsProps) {
  const navigate = useNavigate();

  const handleClick = (stat: KpiStat) => {
    navigate(leadsWithStagePath(stat.filter_stage));
  };

  return (
    <section
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
      aria-label="Dashboard statistics"
    >
      {stats.map((stat) => {
        const styles = accentStyles[stat.accent];
        const TrendIcon = stat.trend.direction === 'down' ? ArrowDown : ArrowUp;
        const trendColor =
          stat.trend.direction === 'down' ? 'text-red-500' : 'text-green-600';

        return (
          <button
            key={stat.id}
            type="button"
            onClick={() => handleClick(stat)}
            className={`group app-glass-card app-glass-card--solid flex items-start justify-between p-5 text-left transition-all duration-250 hover:-translate-y-0.5 hover:ring-4 ${styles.ring}`}
            aria-label={`${stat.label}: ${stat.count}. Click to filter leads.`}
          >
            <div className="space-y-3">
              <div
                className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${styles.icon}`}
                aria-hidden="true"
              >
                <span className="text-lg font-bold">{stat.count}</span>
              </div>

              <div>
                <p className="text-sm font-semibold text-navy">{stat.label}</p>
                <p className="mt-0.5 text-xs text-slate-500">{stat.subtitle}</p>
              </div>

              <div className={`inline-flex items-center gap-1 text-xs font-medium ${trendColor}`}>
                <TrendIcon size={12} aria-hidden="true" />
                <span>
                  {stat.trend.value}% {stat.trend.label}
                </span>
              </div>
            </div>

            <span
              className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white transition group-hover:scale-105 ${styles.button}`}
              aria-hidden="true"
            >
              <ArrowRight size={14} />
            </span>
          </button>
        );
      })}
    </section>
  );
}

export const DashboardStats = memo(DashboardStatsComponent);
