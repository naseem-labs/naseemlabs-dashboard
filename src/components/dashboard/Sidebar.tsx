import { memo } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  Headphones,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import type { Clinic, DashboardUser } from '../../types/dashboard';
import { ROUTES } from '../../constants/routes';
import { SIDEBAR_NAV_ITEMS } from '../../constants/navigation';
import { authService } from '../../services/auth.service';
import { ClinicLogo } from './ClinicLogo';
import { PatientAvatar } from './PatientAvatar';

interface SidebarProps {
  clinic: Clinic;
  user: DashboardUser;
  isCollapsed: boolean;
  isMobile: boolean;
  isMobileOpen: boolean;
  onToggleCollapse: () => void;
  onCloseMobile: () => void;
}

function SidebarComponent({
  clinic,
  user,
  isCollapsed,
  isMobile,
  isMobileOpen,
  onToggleCollapse,
  onCloseMobile,
}: SidebarProps) {
  const navigate = useNavigate();
  const collapsed = isCollapsed && !isMobile;

  const handleLogout = () => {
    authService.logout();
    navigate(ROUTES.LOGIN, { replace: true });
  };

  return (
    <>
      {isMobile && isMobileOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-navy/30 backdrop-blur-sm transition-opacity duration-300 lg:hidden"
          onClick={onCloseMobile}
          aria-label="Close navigation menu"
        />
      ) : null}

      <aside
        className={`app-sidebar fixed inset-y-0 left-0 z-50 flex flex-col transition-all duration-300 ease-in-out ${
          isMobile
            ? `w-72 shadow-2xl ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}`
            : collapsed
              ? 'w-20 translate-x-0'
              : 'w-64 translate-x-0'
        }`}
        aria-label="Main navigation"
        aria-hidden={isMobile && !isMobileOpen}
      >
        <div
          className={`border-b border-white/60 ${
            collapsed && !isMobile
              ? 'flex flex-col items-center gap-2 px-2 py-4'
              : 'flex items-center justify-between px-4 py-5'
          }`}
        >
          <ClinicLogo
            clinic={clinic}
            collapsed={collapsed && !isMobile}
            showName={!collapsed || isMobile}
            variant="light"
          />

          <button
            type="button"
            onClick={isMobile ? onCloseMobile : onToggleCollapse}
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-500 transition hover:bg-white/60 hover:text-navy"
            aria-label={isMobile ? 'Close menu' : collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isMobile ? <X size={18} /> : collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4" aria-label="Dashboard navigation">
          {SIDEBAR_NAV_ITEMS.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.id}
                to={item.route}
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  `app-sidebar__nav-link ${isActive ? 'app-sidebar__nav-link--active' : ''} ${
                    collapsed && !isMobile ? 'justify-center' : ''
                  }`
                }
                title={collapsed && !isMobile ? item.label : undefined}
              >
                <Icon size={18} className="shrink-0" aria-hidden="true" />
                {!collapsed || isMobile ? <span>{item.label}</span> : null}
              </NavLink>
            );
          })}
        </nav>

        {!collapsed || isMobile ? (
          <div className="app-sidebar__help">
            <div className="flex items-start gap-2.5">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 text-purple-600">
                <Headphones size={16} aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-semibold text-navy">Need Help?</p>
                <p className="mt-0.5 text-xs text-slate-500">Contact support anytime</p>
              </div>
            </div>
          </div>
        ) : null}

        <div className="border-t border-white/60 p-3">
          <div
            className={`mb-3 flex items-center gap-3 rounded-xl bg-white/45 px-3 py-3 ${
              collapsed && !isMobile ? 'justify-center' : ''
            }`}
          >
            <PatientAvatar initials={user.avatarInitials} size="sm" />
            {!collapsed || isMobile ? (
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-navy">
                  {user.firstName} {user.lastName}
                </p>
                <p className="truncate text-xs capitalize text-slate-500">{user.role}</p>
              </div>
            ) : null}
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className={`app-sidebar__nav-link w-full ${
              collapsed && !isMobile ? 'justify-center' : ''
            }`}
            title={collapsed && !isMobile ? 'Logout' : undefined}
          >
            <LogOut size={18} aria-hidden="true" />
            {!collapsed || isMobile ? <span>Logout</span> : null}
          </button>
        </div>
      </aside>
    </>
  );
}

export const Sidebar = memo(SidebarComponent);

export function MobileMenuButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200/80 bg-white/80 text-navy shadow-sm backdrop-blur-md lg:hidden"
      aria-label="Open navigation menu"
    >
      <Menu size={18} />
    </button>
  );
}
