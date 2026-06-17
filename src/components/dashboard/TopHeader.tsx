import { memo } from 'react';
import { Link } from 'react-router-dom';
import { Bell, Calendar, ChevronDown } from 'lucide-react';
import type { DashboardUser } from '../../types/dashboard';
import { ROUTES } from '../../constants/routes';
import { getCurrentDate, getGreeting, getGreetingName } from '../../hooks/useDashboard';
import { PatientAvatar } from './PatientAvatar';
import { MobileMenuButton } from './Sidebar';
import type { DashboardHeaderVariant } from './DashboardLayout';

interface TopHeaderProps {
  user: DashboardUser;
  unreadNotificationCount: number;
  onOpenMobileMenu: () => void;
  variant?: DashboardHeaderVariant;
}

function TopHeaderComponent({
  user,
  unreadNotificationCount,
  onOpenMobileMenu,
  variant = 'dashboard',
}: TopHeaderProps) {
  const greeting = getGreeting();
  const greetingName = getGreetingName(user);
  const currentDate = getCurrentDate();
  const isMinimal = variant === 'minimal';

  return (
    <header className="app-top-header shrink-0 px-4 py-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <MobileMenuButton onClick={onOpenMobileMenu} />

          {!isMinimal ? (
            <div className="min-w-0 lg:block">
              <h1 className="truncate text-lg font-bold text-navy lg:text-2xl">
                {greeting}, {greetingName} 👋
              </h1>
              <p className="hidden text-sm text-slate-500 sm:block">
                Here&apos;s what&apos;s happening with your patient inquiries today.
              </p>
            </div>
          ) : (
            <div className="hidden text-sm font-medium text-slate-500 sm:block">{currentDate}</div>
          )}
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {!isMinimal ? (
            <div
              className="hidden items-center gap-2 rounded-lg border border-slate-200/80 bg-white/80 px-3 py-2 text-sm font-medium text-navy shadow-sm backdrop-blur-md sm:inline-flex"
              aria-label={`Current date: ${currentDate}`}
            >
              <Calendar size={16} className="text-slate-400" aria-hidden="true" />
              <span>{currentDate}</span>
            </div>
          ) : null}

          <Link
            to={ROUTES.NOTIFICATIONS}
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200/80 bg-white/80 text-navy shadow-sm backdrop-blur-md transition hover:bg-white"
            aria-label={`Notifications${unreadNotificationCount ? `, ${unreadNotificationCount} unread` : ''}`}
          >
            <Bell size={18} aria-hidden="true" />
            {unreadNotificationCount > 0 ? (
              <span className="absolute -right-0.5 -top-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                {unreadNotificationCount}
              </span>
            ) : null}
          </Link>

          <Link to={ROUTES.PROFILE} className="app-user-chip transition hover:bg-white">
            <PatientAvatar initials={user.avatarInitials} size="sm" />
            <div className="hidden min-w-0 sm:block">
              <p className="truncate text-sm font-semibold text-navy">
                {user.firstName} {user.lastName}
              </p>
              <p className="truncate text-xs capitalize text-slate-500">{user.role}</p>
            </div>
            <ChevronDown size={16} className="hidden text-slate-400 sm:block" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </header>
  );
}

export const TopHeader = memo(TopHeaderComponent);
