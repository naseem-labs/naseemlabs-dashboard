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
      <div>
        <p className="text-sm font-medium text-navy">{activity.label}</p>
        <p className="text-xs text-slate-500">{activity.description}</p>
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
        <td colSpan={6} className="px-5 py-12 text-center text-sm text-slate-500">
          No leads match your current filters.
        </td>
      </tr>
    );
  }

  return (
    <>
      {leads.map((lead) => {
        const stageConfig = STAGE_CONFIG[lead.stage];

        return (
          <tr
            key={lead.id}
            className="h-[72px] transition hover:bg-slate-50/60"
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
                className="inline-flex items-center gap-1.5 rounded-xl border-2 border-purple-600 bg-white px-4 py-2 text-sm font-semibold text-purple-600 shadow-sm transition hover:bg-purple-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-purple-100"
              >
                View Lead
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
  pageSize,
  totalCount,
  totalPages,
  onPageChange,
}: TablePaginationProps) {
  const start = totalCount === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalCount);

  return (
    <div
      className="flex shrink-0 flex-col gap-3 border-t border-slate-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5"
      style={{ minHeight: TABLE_LAYOUT.PAGINATION_HEIGHT }}
    >
      <p className="text-sm text-slate-500">
        Showing {start} to {end} of {totalCount} leads
      </p>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-navy transition hover:border-slate-300 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Previous page"
        >
          <ChevronLeft size={16} />
        </button>

        <div className="flex items-center gap-1">
          {Array.from({ length: totalPages }, (_, index) => index + 1)
            .slice(0, 5)
            .map((pageNumber) => (
              <button
                key={pageNumber}
                type="button"
                onClick={() => onPageChange(pageNumber)}
                className={`inline-flex h-9 min-w-9 items-center justify-center rounded-lg px-2 text-sm font-medium transition ${
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
        </div>

        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-navy transition hover:border-slate-300 disabled:cursor-not-allowed disabled:opacity-40"
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
  fixedRowCount,
  isDesktopLayout = false,
  onPageChange,
  onViewLead,
  onNextAction,
}: PatientActivityTableProps) {
  const bodyHeight = fixedRowCount
    ? fixedRowCount * TABLE_LAYOUT.ROW_HEIGHT
    : undefined;

  return (
    <section
      className={`app-glass-card app-glass-card--solid overflow-hidden ${
        isDesktopLayout ? 'flex h-full flex-col' : ''
      }`}
      aria-label="Patient activity table"
    >
      <div className={`hidden lg:block ${isDesktopLayout ? 'min-h-0 flex-1 overflow-hidden' : 'overflow-x-auto'}`}>
        <table className="min-w-full divide-y divide-slate-100">
          <thead
            className="bg-slate-50/80"
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

      <div className="space-y-3 p-4 lg:hidden">
        {leads.length === 0 ? (
          <div className="py-12 text-center text-sm text-slate-500">
            No leads match your current filters.
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

      <TablePagination
        page={page}
        pageSize={pageSize}
        totalCount={totalCount}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
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
  const stageConfig = STAGE_CONFIG[lead.stage];

  return (
    <article className="rounded-xl border border-slate-200 bg-slate-50/40 p-4">
      <div className="mb-3 flex items-center gap-3">
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
        className={`mb-3 text-left text-sm font-semibold ${actionVariantClasses[lead.next_action.variant]}`}
      >
        {lead.next_action.label}
      </button>

      <button
        type="button"
        onClick={() => onViewLead(lead.id)}
        className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl border-2 border-purple-600 bg-white px-4 py-2.5 text-sm font-semibold text-purple-600 transition hover:bg-purple-50"
      >
        View Lead
        <ArrowRight size={14} aria-hidden="true" />
      </button>
    </article>
  );
});

export const PatientActivityTable = memo(PatientActivityTableComponent);
