import { useCallback, useEffect, useMemo, useState } from 'react';
import type { DashboardData, DashboardUser, LeadFilters, LeadStage } from '../types/dashboard';
import type { DashboardDataSource } from '../services/dashboard.service';
import { dashboardService } from '../services/dashboard.service';
import { getErrorMessage } from '../lib/supabaseErrors';

export function useDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [dataSource, setDataSource] = useState<DashboardDataSource>('unconfigured');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const [dashboardData, source] = await Promise.all([
          dashboardService.getDashboardData(),
          dashboardService.getDataSource(),
        ]);

        if (isMounted) {
          setData(dashboardData);
          setDataSource(source);
        }
      } catch (loadError) {
        if (isMounted) {
          setError(getErrorMessage(loadError, 'Unable to load dashboard data.'));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void load();

    return () => {
      isMounted = false;
    };
  }, []);

  const reload = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const dashboardData = await dashboardService.getDashboardData();
      setData(dashboardData);
    } catch (loadError) {
      setError(getErrorMessage(loadError, 'Unable to load dashboard data.'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    data,
    dataSource,
    isLoading,
    error,
    reload,
  };
}

export function useLeadFilters(
  leads: DashboardData['leads'] | undefined,
  initialStage: LeadStage | 'all' = 'all',
  pageSize: number = 5,
) {
  const [filters, setFilters] = useState<LeadFilters>({
    search: '',
    stage: initialStage,
  });
  const [page, setPage] = useState(1);

  const filteredLeads = useMemo(() => {
    if (!leads) {
      return [];
    }

    const query = filters.search.trim().toLowerCase();

    return leads.filter((lead) => {
      const matchesStage = (() => {
        if (filters.stage === 'all') {
          return true;
        }

        if (filters.stage === 'follow_up') {
          return [
            'follow_up',
            'waiting_for_photos',
            'photos_received',
            'doctor_review',
          ].includes(lead.stage);
        }

        return lead.stage === filters.stage;
      })();

      const fullName = `${lead.first_name} ${lead.last_name}`.toLowerCase();
      const matchesSearch =
        !query ||
        fullName.includes(query) ||
        lead.phone.replace(/\s/g, '').includes(query.replace(/\s/g, ''));

      return matchesStage && matchesSearch;
    });
  }, [filters.search, filters.stage, leads]);

  const totalPages = Math.max(1, Math.ceil(filteredLeads.length / pageSize));
  const safePage = Math.min(page, totalPages);

  const paginatedLeads = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return filteredLeads.slice(start, start + pageSize);
  }, [filteredLeads, safePage, pageSize]);

  const setSearch = useCallback((search: string) => {
    setPage(1);
    setFilters((current) => ({ ...current, search }));
  }, []);

  const setStage = useCallback((stage: LeadStage | 'all') => {
    setPage(1);
    setFilters((current) => ({ ...current, stage }));
  }, []);

  const clearFilters = useCallback(() => {
    setPage(1);
    setFilters({ search: '', stage: 'all' });
  }, []);

  const goToPage = useCallback(
    (nextPage: number) => {
      setPage(Math.min(Math.max(1, nextPage), totalPages));
    },
    [totalPages],
  );

  return {
    filters,
    filteredLeads,
    paginatedLeads,
    page: safePage,
    pageSize,
    totalPages,
    totalCount: filteredLeads.length,
    setSearch,
    setStage,
    clearFilters,
    goToPage,
    setPage,
  };
}

export function getGreeting(date: Date = new Date()): string {
  const hour = date.getHours();

  if (hour >= 5 && hour < 12) {
    return 'Good Morning';
  }

  if (hour >= 12 && hour < 17) {
    return 'Good Afternoon';
  }

  if (hour >= 17 && hour < 22) {
    return 'Good Evening';
  }

  return 'Good Night';
}

export function getGreetingName(user: DashboardUser): string {
  if (user.role === 'doctor') {
    return 'Doctor';
  }

  return user.firstName;
}

export function getCurrentDate(date: Date = new Date()): string {
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatDisplayDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}
