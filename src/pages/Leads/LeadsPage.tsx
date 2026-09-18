import { useCallback, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  DashboardLayout,
  Filters,
  PatientActivityTable,
} from '../../components/dashboard';
import { DataLoadErrorScreen } from '../../components/common';
import { resolveStageFromQuery } from '../../constants/stages';
import { useDashboard, useLeadFilters } from '../../hooks/useDashboard';
import { useLeadWorkflow } from '../../hooks/useLeadWorkflow';
import { useNotifications } from '../../hooks/useNotifications';
import { useTablePageSize } from '../../hooks/useTablePageSize';
import type { Lead } from '../../types/dashboard';

export function LeadsPage() {
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const { pageSize, isDesktop } = useTablePageSize(tableContainerRef);
  const [searchParams] = useSearchParams();
  const stageParam = searchParams.get('stage');
  const initialStage = resolveStageFromQuery(stageParam);

  const { data, isLoading, error } = useDashboard();
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
  } = useLeadFilters(data?.leads, initialStage, pageSize);

  useEffect(() => {
    setStage(initialStage);
  }, [initialStage, setStage]);

  const handleNextActionClick = useCallback(async (lead: Lead) => {
    await handleNextAction(lead);
  }, [handleNextAction]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-surface text-sm text-slate-500">
        Loading leads...
      </div>
    );
  }

  if (error || !data) {
    return (
      <DataLoadErrorScreen
        error={error}
        fallbackMessage="Unable to load leads."
      />
    );
  }

  return (
    <DashboardLayout
      clinic={data.clinic}
      user={data.user}
      unreadNotificationCount={unreadCount}
    >
      <div className={`app-page flex flex-col gap-4 ${isDesktop ? 'h-full overflow-hidden' : ''}`}>
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
          ref={tableContainerRef}
          className={isDesktop ? 'min-h-0 flex-1 overflow-hidden' : ''}
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
    </DashboardLayout>
  );
}
