import { useCallback, useRef } from 'react';
import {
  DashboardLayout,
  DashboardStats,
  Filters,
  PatientActivityTable,
} from '../../components/dashboard';
import { DataLoadErrorScreen } from '../../components/common';
import { useDashboard, useLeadFilters } from '../../hooks/useDashboard';
import { useLeadWorkflow } from '../../hooks/useLeadWorkflow';
import { useNotifications } from '../../hooks/useNotifications';
import { useTablePageSize } from '../../hooks/useTablePageSize';
import type { Lead } from '../../types/dashboard';

export function DashboardPage() {
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const { isDesktop } = useTablePageSize(tableContainerRef);
  const pageSize = 5;
  const { data, isLoading, error, reload } = useDashboard();
  const { unreadCount } = useNotifications();
  const { viewLead, handleNextAction } = useLeadWorkflow();

  const {
    filters,
    paginatedLeads,
    page,
    totalCount,
    totalPages,
    setSearch,
    setStage,
    clearFilters,
    goToPage,
  } = useLeadFilters(data?.leads, 'all', pageSize);

  const handleNextActionClick = useCallback(
    async (lead: Lead) => {
      await handleNextAction(lead);
      await reload();
    },
    [handleNextAction, reload],
  );

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-surface text-sm text-slate-500">
        Loading dashboard...
      </div>
    );
  }

  if (error || !data) {
    return (
      <DataLoadErrorScreen
        error={error}
        fallbackMessage="Unable to load dashboard."
      />
    );
  }

  return (
    <DashboardLayout
      clinic={data.clinic}
      user={data.user}
      unreadNotificationCount={unreadCount}
    >
      <div
        className={`app-page flex flex-col gap-3 sm:gap-4 ${
          isDesktop ? 'h-full min-h-0 overflow-hidden' : 'pb-4'
        }`}
      >
        <div className="shrink-0">
          <DashboardStats stats={data.kpi_stats} />
        </div>

        <div
          className={`flex flex-col gap-4 ${
            isDesktop ? 'min-h-0 flex-1 overflow-hidden' : ''
          }`}
        >
          <div className="shrink-0">
            <Filters
              search={filters.search}
              stage={filters.stage}
              onSearchChange={setSearch}
              onStageChange={setStage}
              onClearFilters={clearFilters}
            />
          </div>

          <div
            className={
              isDesktop
                ? 'flex min-h-0 flex-1 w-full overflow-hidden'
                : 'flex flex-col gap-3'
            }
          >
            <div
              ref={tableContainerRef}
              className={isDesktop ? 'min-h-0 w-full overflow-hidden' : ''}
            >
              <PatientActivityTable
                leads={paginatedLeads}
                page={page}
                pageSize={pageSize}
                totalCount={totalCount}
                totalPages={totalPages}
                fixedRowCount={isDesktop ? pageSize : undefined}
                isDesktopLayout={isDesktop}
                onPageChange={goToPage}
                onViewLead={viewLead}
                onNextAction={handleNextActionClick}
              />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
