import type { ReactNode } from 'react';
import type { DashboardUser } from '../../types/dashboard';
import { SidebarProvider, useSidebar } from '../../hooks/useSidebar';
import { Sidebar } from './Sidebar';
import { TopHeader } from './TopHeader';

export type DashboardHeaderVariant = 'dashboard' | 'minimal';

export interface DashboardDateFilterControls {
  selectedDate: Date | null;
  setSelectedDate: (date: Date | null) => void;
  clearDateFilter: () => void;
}

export interface DashboardHeaderProps {
  user: DashboardUser;
  unreadNotificationCount: number;
  onOpenMobileMenu: () => void;
}

export interface DashboardLayoutProps {
  clinic: import('../../types/dashboard').Clinic;
  user: import('../../types/dashboard').DashboardUser;
  unreadNotificationCount?: number;
  children: ReactNode;
  renderHeader?: (props: DashboardHeaderProps) => ReactNode;
  dateFilter?: DashboardDateFilterControls;
  hideFooter?: boolean;
  scrollableMain?: boolean;
  headerVariant?: DashboardHeaderVariant;
}

function DashboardLayoutContent({
  clinic,
  user,
  unreadNotificationCount = 0,
  children,
  renderHeader,
  dateFilter,
  scrollableMain = false,
  headerVariant = 'dashboard',
}: DashboardLayoutProps) {
  const {
    isCollapsed,
    isMobileOpen,
    isMobile,
    toggleCollapse,
    closeMobile,
  } = useSidebar();

  const sidebarOffset = isMobile
    ? 'ml-0'
    : isCollapsed
      ? 'lg:ml-20'
      : 'lg:ml-64';

  return (
    <div
      className={`app-shell bg-slate-50 ${
        isMobile ? 'min-h-screen' : 'h-screen overflow-hidden'
      }`}
    >
      <div className={`app-shell__content ${isMobile ? 'min-h-screen' : 'h-screen'}`}>
        <Sidebar
          clinic={clinic}
          user={user}
          isCollapsed={isCollapsed}
          isMobile={isMobile}
          isMobileOpen={isMobileOpen}
          onToggleCollapse={toggleCollapse}
          onCloseMobile={closeMobile}
        />

        <div
          className={`flex flex-col bg-slate-50 transition-[margin] duration-300 ease-in-out ${sidebarOffset} ${
            isMobile ? 'min-h-screen' : 'h-screen overflow-hidden'
          }`}
        >
          {renderHeader ? (
            renderHeader({
              user,
              unreadNotificationCount,
              onOpenMobileMenu: toggleCollapse,
            })
          ) : (
            <TopHeader
              user={user}
              unreadNotificationCount={unreadNotificationCount}
              onOpenMobileMenu={toggleCollapse}
              variant={headerVariant}
              dateFilter={dateFilter}
            />
          )}

          <main
            className={`flex flex-1 flex-col bg-slate-50 px-3 py-3 sm:px-3 lg:px-4 xl:px-4 ${
              isMobile || scrollableMain
                ? 'overflow-y-auto'
                : 'min-h-0 overflow-hidden'
            }`}
          >
            <div
              className="flex w-full max-w-none flex-1 flex-col"
            >
              {children}
            </div>
          </main>

          {null}
        </div>
      </div>
    </div>
  );
}

export function DashboardLayout(props: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <DashboardLayoutContent {...props} />
    </SidebarProvider>
  );
}
