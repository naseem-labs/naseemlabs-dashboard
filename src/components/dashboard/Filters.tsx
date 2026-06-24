import { memo } from 'react';
import { Filter, Search, X } from 'lucide-react';
import type { LeadStage } from '../../types/dashboard';
import { STAGE_FILTER_OPTIONS } from '../../constants/stages';

interface FiltersProps {
  search: string;
  stage: LeadStage | 'all';
  onSearchChange: (value: string) => void;
  onStageChange: (value: LeadStage | 'all') => void;
  onClearFilters: () => void;
  onFilterClick?: () => void;
}

function FiltersComponent({
  search,
  stage,
  onSearchChange,
  onStageChange,
  onClearFilters,
  onFilterClick,
}: FiltersProps) {
  const hasActiveFilters = search.length > 0 || stage !== 'all';

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <h2 className="text-base sm:text-lg font-semibold text-navy">All Active Patient</h2>
        <p className="text-xs sm:text-sm text-slate-500">
          Track patient inquiries and take the next best action.
        </p>
      </div>

      <div className="flex w-full flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center lg:w-auto">
        <label className="relative w-full min-w-0 flex-1 sm:min-w-[14rem] sm:flex-none sm:w-56">
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            aria-hidden="true"
          />
          <input
            type="search"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search by name..."
            className="w-full rounded-lg border border-slate-200/80 bg-white/90 py-2.5 pl-9 pr-3 text-sm text-navy shadow-sm outline-none transition placeholder:text-slate-400 focus:border-purple-300 focus:ring-4 focus:ring-purple-100"
            aria-label="Search leads by name"
          />
        </label>

        <select
          value={stage}
          onChange={(event) => onStageChange(event.target.value as LeadStage | 'all')}
          className="w-full sm:w-auto rounded-lg border border-slate-200/80 bg-white/90 px-3 py-2.5 text-sm font-medium text-navy shadow-sm outline-none transition focus:border-purple-300 focus:ring-4 focus:ring-purple-100"
          aria-label="Filter by stage"
        >
          {STAGE_FILTER_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={onFilterClick}
          className="inline-flex h-11 w-full sm:w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-navy shadow-sm transition hover:border-slate-300"
          aria-label="Open advanced filters"
        >
          <Filter size={16} aria-hidden="true" />
        </button>

        {hasActiveFilters ? (
          <button
            type="button"
            onClick={onClearFilters}
            className="inline-flex w-full sm:w-auto items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-600 shadow-sm transition hover:border-slate-300 hover:text-navy"
          >
            <X size={14} aria-hidden="true" />
            Clear Filters
          </button>
        ) : null}
      </div>
    </div>
  );
}

export const Filters = memo(FiltersComponent);
