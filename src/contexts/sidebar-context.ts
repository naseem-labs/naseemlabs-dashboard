import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useLocation } from 'react-router-dom';
import {
  isLeadDetailPath,
  readSidebarCollapsedPreference,
  SIDEBAR_DESKTOP_BREAKPOINT,
  writeSidebarCollapsedPreference,
} from '../constants/sidebar';

export interface SidebarContextValue {
  isCollapsed: boolean;
  isMobileOpen: boolean;
  isMobile: boolean;
  isLeadDetailPage: boolean;
  toggleCollapse: () => void;
  closeMobile: () => void;
  expand: () => void;
  collapse: () => void;
}

export const SidebarContext = createContext<SidebarContextValue | null>(null);

export function useSidebarState(): SidebarContextValue {
  const location = useLocation();
  const isLeadDetailPage = useMemo(
    () => isLeadDetailPath(location.pathname),
    [location.pathname],
  );

  const [manualCollapsed, setManualCollapsed] = useState<boolean | null>(null);
  const [manualPath, setManualPath] = useState(location.pathname);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined') {
      return false;
    }

    return window.innerWidth < SIDEBAR_DESKTOP_BREAKPOINT;
  });

  const isCollapsed = useMemo(() => {
    if (isMobile) {
      return true;
    }

    if (manualCollapsed !== null && manualPath === location.pathname) {
      return manualCollapsed;
    }

    if (isLeadDetailPage) {
      return true;
    }

    return readSidebarCollapsedPreference();
  }, [isLeadDetailPage, isMobile, location.pathname, manualCollapsed, manualPath]);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < SIDEBAR_DESKTOP_BREAKPOINT;
      setIsMobile(mobile);

      if (mobile) {
        setIsMobileOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const setCollapsed = useCallback(
    (collapsed: boolean, persist: boolean) => {
      setManualPath(location.pathname);
      setManualCollapsed(collapsed);

      if (persist && !isMobile && !isLeadDetailPage) {
        writeSidebarCollapsedPreference(collapsed);
      }
    },
    [isLeadDetailPage, isMobile, location.pathname],
  );

  const toggleCollapse = useCallback(() => {
    if (isMobile) {
      setIsMobileOpen((open) => !open);
      return;
    }

    setCollapsed(!isCollapsed, !isLeadDetailPage);
  }, [isCollapsed, isLeadDetailPage, isMobile, setCollapsed]);

  const closeMobile = useCallback(() => {
    setIsMobileOpen(false);
  }, []);

  const expand = useCallback(() => {
    if (isMobile) {
      setIsMobileOpen(true);
      return;
    }

    setCollapsed(false, !isLeadDetailPage);
  }, [isLeadDetailPage, isMobile, setCollapsed]);

  const collapse = useCallback(() => {
    if (isMobile) {
      setIsMobileOpen(false);
      return;
    }

    setCollapsed(true, !isLeadDetailPage);
  }, [isLeadDetailPage, isMobile, setCollapsed]);

  return {
    isCollapsed,
    isMobileOpen,
    isMobile,
    isLeadDetailPage,
    toggleCollapse,
    closeMobile,
    expand,
    collapse,
  };
}

export function useSidebarContext(): SidebarContextValue {
  const context = useContext(SidebarContext);

  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }

  return context;
}
