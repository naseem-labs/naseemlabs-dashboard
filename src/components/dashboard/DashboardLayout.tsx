import type { ReactNode } from 'react';
import { BACKGROUND_IMAGE_URL } from '../../constants/assets';
import type { DashboardUser } from '../../types/dashboard';
import { SidebarProvider, useSidebar } from '../../hooks/useSidebar';
import { Sidebar } from './Sidebar';
import { TopHeader } from './TopHeader';

export type DashboardHeaderVariant = 'dashboard' | 'minimal';

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
  hideFooter = false,
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
    <div className={`app-shell ${isMobile ? 'min-h-screen' : 'h-screen overflow-hidden'}`}>
      <img
        className="app-shell__background"
        src={BACKGROUND_IMAGE_URL}
        alt=""
        aria-hidden="true"
        decoding="async"
      />
      <div className="app-shell__overlay" aria-hidden="true" />

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
          className={`flex flex-col transition-[margin] duration-300 ease-in-out ${sidebarOffset} ${
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
            />
          )}

          <main
            className={`flex flex-1 flex-col px-4 py-4 sm:px-6 lg:px-8 ${
              isMobile || scrollableMain
                ? 'overflow-y-auto'
                : 'min-h-0 overflow-hidden'
            }`}
          >
            {children}
          </main>

          {!hideFooter ? (
            <footer className="shrink-0 border-t border-white/50 bg-white/35 px-4 py-3 backdrop-blur-md sm:px-6 lg:px-8">
              <p className="text-center text-xs text-slate-600">
                Your data is secure and private.
              </p>
            </footer>
          ) : null}
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
