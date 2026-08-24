import { memo, useMemo } from 'react';
import {
  ArrowRight,
  Calendar,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  Phone,
  Upload,
  UserCheck,
} from 'lucide-react';
import type { Lead, LastActivity } from '../../types/dashboard';
import { TABLE_LAYOUT } from '../../constants/table';
import { STAGE_CONFIG } from '../../constants/stages';
import { PatientAvatar } from './PatientAvatar';

interface PatientActivityTableProps {
  leads: Lead[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  fixedRowCount?: number;
  isDesktopLayout?: boolean;
  onPageChange: (page: number) => void;
  onViewLead: (leadId: string) => void;
  onNextAction: (lead: Lead) => void;
}

const activityIcons = {
  message: MessageCircle,
  phone: Phone,
  upload: Upload,
  calendar: Calendar,
  review: UserCheck,
};

const actionVariantClasses = {
  orange: 'text-orange-600 hover:text-orange-700',
  purple: 'text-purple-600 hover:text-purple-700',
  blue: 'text-blue-600 hover:text-blue-700',
  green: 'text-green-600 hover:text-green-700',
  navy: 'text-navy hover:text-purple-700',
};

function LastActivityCell({ activity }: { activity: LastActivity }) {
  const Icon = activityIcons[activity.icon];

  return (
    <div className="flex items-start gap-2">
      <Icon size={14} className="mt-0.5 shrink-0 text-slate-400" aria-hidden="true" />
      <div className="min-w-0">
        <p className="text-sm font-medium text-navy">{activity.label}</p>
        <p
          className="max-w-[280px] truncate text-xs text-slate-500"
          title={activity.description}
        >
          {activity.description}
        </p>
      </div>
    </div>
  );
}

interface TableRowsProps {
  leads: Lead[];
  fixedRowCount?: number;
  onViewLead: (leadId: string) => void;
  onNextAction: (lead: Lead) => void;
}

const TableRows = memo(function TableRows({
  leads,
  fixedRowCount,
  onViewLead,
  onNextAction,
}: TableRowsProps) {
  const placeholderCount = useMemo(() => {
    if (!fixedRowCount) {
      return 0;
    }

    return Math.max(0, fixedRowCount - leads.length);
  }, [fixedRowCount, leads.length]);

  if (leads.length === 0) {
    return (
      <tr>
        <td
          colSpan={6}
          className="h-[400px] px-5 py-6 text-center text-sm text-slate-500 align-middle"
        >
          No patients match your current filters.
        </td>
      </tr>
    );
  }

  return (
    <>
      {leads.map((lead) => {
        const stageConfig = STAGE_CONFIG[lead.stage] ?? {
          label: 'Unknown',
          bgClass: 'bg-slate-100',
          textClass: 'text-slate-600',
        };

        return (
          <tr
            key={lead.id}
            className="h-[72px] transition hover:bg-slate-50"
            style={{ height: TABLE_LAYOUT.ROW_HEIGHT }}
          >
            <td className="px-5 py-4">
              <div className="flex items-center gap-3">
                <PatientAvatar initials={lead.avatar_initials} size="sm" />
                <span className="text-sm font-semibold text-navy">
                  {lead.first_name} {lead.last_name}
                </span>
              </div>
            </td>
            <td className="px-5 py-4">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Phone size={14} className="text-green-500" aria-hidden="true" />
                {lead.phone}
              </div>
            </td>
            <td className="px-5 py-4">
              <span
                className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${stageConfig.bgClass} ${stageConfig.textClass}`}
              >
                {stageConfig.label}
              </span>
            </td>
            <td className="px-5 py-4">
              <LastActivityCell activity={lead.last_activity} />
            </td>
            <td className="px-5 py-4">
              <button
                type="button"
                onClick={() => onNextAction(lead)}
                className={`text-sm font-semibold underline-offset-2 transition hover:underline ${actionVariantClasses[lead.next_action.variant]}`}
              >
                {lead.next_action.label}
              </button>
            </td>
            <td className="px-5 py-4">
              <button
                type="button"
                onClick={() => onViewLead(lead.id)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:scale-[1.02] hover:shadow-lg focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-purple-100"
              >
                View Patient
                <ArrowRight size={14} aria-hidden="true" />
              </button>
            </td>
          </tr>
        );
      })}

      {Array.from({ length: placeholderCount }, (_, index) => (
        <tr
          key={`placeholder-${index}`}
          className="pointer-events-none"
          style={{ height: TABLE_LAYOUT.ROW_HEIGHT }}
          aria-hidden="true"
        >
          <td colSpan={6} className="px-5 py-4">
            <span className="sr-only">Empty row</span>
          </td>
        </tr>
      ))}
    </>
  );
});

interface TablePaginationProps {
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const TablePagination = memo(function TablePagination({
  page,
  pageSize: _pageSize,
  totalCount: _totalCount,
  totalPages,
  onPageChange,
}: TablePaginationProps) {

  return (
    <div
      className="flex shrink-0 flex-col gap-3 px-3 py-3 sm:px-5"
      style={{ minHeight: TABLE_LAYOUT.PAGINATION_HEIGHT }}
    >
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-navy transition hover:border-slate-300 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Previous page"
        >
          <ChevronLeft size={16} />
        </button>

        <div className="flex items-center gap-1 rounded-lg bg-slate-50 px-2 py-1">
          {Array.from({ length: totalPages }, (_, index) => index + 1)
            .slice(Math.max(0, page - 2), Math.max(0, page - 2) + 3)
            .map((pageNumber) => (
              <button
                key={pageNumber}
                type="button"
                onClick={() => onPageChange(pageNumber)}
                className={`inline-flex h-8 min-w-8 items-center justify-center rounded-lg px-2 text-sm font-medium transition ${
                  pageNumber === page
                    ? 'bg-purple-600 text-white'
                    : 'border border-slate-200 bg-white text-navy hover:border-slate-300'
                }`}
                aria-label={`Page ${pageNumber}`}
                aria-current={pageNumber === page ? 'page' : undefined}
              >
                {pageNumber}
              </button>
            ))}
          {totalPages > 3 && (
            <span className="px-1 text-slate-400">...</span>
          )}
        </div>

        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-navy transition hover:border-slate-300 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Next page"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
});

function PatientActivityTableComponent({
  leads,
  page,
  pageSize,
  totalCount,
  totalPages,
  fixedRowCount = 5,
  isDesktopLayout = false,
  onPageChange,
  onViewLead,
  onNextAction,
}: PatientActivityTableProps) {
  const bodyHeight =
    leads.length > 0 && fixedRowCount
      ? fixedRowCount * TABLE_LAYOUT.ROW_HEIGHT
      : undefined;

  return (
    <section
      className={`w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm ${
        isDesktopLayout ? 'flex min-h-[540px] flex-col' : ''
      }`}
      aria-label="Patient activity table"
    >
      <div className={`hidden w-full lg:block ${isDesktopLayout ? 'min-h-0 flex-1 overflow-auto' : 'overflow-x-auto min-h-[540px]'}`}>
        <table className="w-full min-w-full table-fixed divide-y divide-slate-100">
          <thead
            className="sticky top-0 bg-slate-50"
            style={{ height: TABLE_LAYOUT.HEADER_HEIGHT }}
          >
            <tr>
              {['Patient', 'Phone', 'Stage', 'Last Activity', 'Next Action', 'Action'].map(
                (heading) => (
                  <th
                    key={heading}
                    scope="col"
                    className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"
                  >
                    {heading}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody
            className="divide-y divide-slate-100"
            style={bodyHeight ? { height: bodyHeight } : undefined}
          >
            <TableRows
              leads={leads}
              fixedRowCount={fixedRowCount}
              onViewLead={onViewLead}
              onNextAction={onNextAction}
            />
          </tbody>
        </table>
      </div>

      <div className="min-h-[540px] space-y-3 p-3 lg:hidden">
        {leads.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-12 text-center text-base text-slate-500">
            No patients match your current filters.
          </div>
        ) : (
          leads.map((lead) => (
            <LeadMobileCard
              key={lead.id}
              lead={lead}
              onViewLead={onViewLead}
              onNextAction={onNextAction}
            />
          ))
        )}
      </div>

      <div className="hidden shrink-0 lg:block">
        <TablePagination
          page={page}
          pageSize={pageSize}
          totalCount={totalCount}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      </div>

      <div className="border-t border-slate-100 p-3 lg:hidden">
        <TablePagination
          page={page}
          pageSize={pageSize}
          totalCount={totalCount}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      </div>
    </section>
  );
}

interface LeadMobileCardProps {
  lead: Lead;
  onViewLead: (leadId: string) => void;
  onNextAction: (lead: Lead) => void;
}

const LeadMobileCard = memo(function LeadMobileCard({
  lead,
  onViewLead,
  onNextAction,
}: LeadMobileCardProps) {
  const stageConfig = STAGE_CONFIG[lead.stage] ?? {
    label: 'Unknown',
    bgClass: 'bg-slate-100',
    textClass: 'text-slate-600',
  };

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
      <div className="mb-2 flex items-center gap-3">
        <PatientAvatar initials={lead.avatar_initials} size="sm" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-navy">
            {lead.first_name} {lead.last_name}
          </p>
          <p className="text-xs text-slate-500">{lead.phone}</p>
        </div>
        <span
          className={`shrink-0 rounded-full px-2 py-1 text-[11px] font-semibold ${stageConfig.bgClass} ${stageConfig.textClass}`}
        >
          {stageConfig.label}
        </span>
      </div>

      <button
        type="button"
        onClick={() => onNextAction(lead)}
        className={`mb-2 text-left text-sm font-semibold ${actionVariantClasses[lead.next_action.variant]}`}
      >
        {lead.next_action.label}
      </button>

      <button
        type="button"
        onClick={() => onViewLead(lead.id)}
        className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl border-2 border-purple-600 bg-white px-4 py-2.5 text-sm font-semibold text-purple-600 transition hover:bg-purple-50"
      >
        View Patient
        <ArrowRight size={14} aria-hidden="true" />
      </button>
    </article>
  );
});

export const PatientActivityTable = memo(PatientActivityTableComponent);
