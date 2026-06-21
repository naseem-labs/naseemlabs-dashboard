import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
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
      className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:gap-4 xl:grid-cols-4"
      aria-label="Dashboard statistics"
    >
      {stats.map((stat) => {
        const styles = accentStyles[stat.accent];

        return (
          <button
            key={stat.id}
            type="button"
            onClick={() => handleClick(stat)}
            className={`group flex w-full min-h-[105px] items-start justify-between rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 text-left shadow-sm transition-all duration-250 hover:-translate-y-1 hover:shadow-lg hover:ring-4 ${styles.ring}`}
            aria-label={`${stat.label}: ${stat.count}. Click to filter leads.`}
          >
            <div className="flex h-full flex-1 flex-col justify-between">
              <div
                className={`inline-flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-2xl ${styles.icon}`}
                aria-hidden="true"
              >
                <span className="text-lg sm:text-xl font-bold">{stat.count}</span>
              </div>

              <div>
                <p className="text-base font-semibold text-slate-900">{stat.label}</p>
                <p className="mt-1 text-xs text-slate-500">{stat.subtitle}</p>
              </div>
            </div>

            <span
              className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white transition group-hover:scale-110 ${styles.button}`}
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
