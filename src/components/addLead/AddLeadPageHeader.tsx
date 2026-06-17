import { Link } from 'react-router-dom';
import { ArrowLeft, Bell, Calendar } from 'lucide-react';
import type { DashboardUser } from '../../types/dashboard';
import { ROUTES } from '../../constants/routes';
import { getCurrentDate } from '../../hooks/useDashboard';
import { PatientAvatar } from '../dashboard/PatientAvatar';
import { MobileMenuButton } from '../dashboard/Sidebar';

interface AddLeadPageHeaderProps {
  user: DashboardUser;
  unreadNotificationCount: number;
  onOpenMobileMenu: () => void;
}

export function AddLeadPageHeader({
  user,
  unreadNotificationCount,
  onOpenMobileMenu,
}: AddLeadPageHeaderProps) {
  const currentDate = getCurrentDate();

  return (
    <header className="shrink-0 border-b border-slate-200/80 bg-white/80 px-4 py-4 backdrop-blur-md sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-start gap-3">
          <div className="lg:hidden">
            <MobileMenuButton onClick={onOpenMobileMenu} />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <Link
                to={ROUTES.LEADS}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-purple-600"
                aria-label="Back to leads"
              >
                <ArrowLeft size={18} />
              </Link>
              <h1 className="text-xl font-bold text-navy sm:text-2xl">Add New Lead</h1>
            </div>
            <p className="mt-1 text-sm text-slate-500">
              Create a new patient inquiry and start follow-up.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 sm:gap-3">
          <div
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-navy shadow-sm"
            aria-label={`Current date: ${currentDate}`}
          >
            <Calendar size={16} className="text-slate-400" aria-hidden="true" />
            <span className="hidden sm:inline">{currentDate}</span>
            <span className="sm:hidden">
              {new Date().toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              })}
            </span>
          </div>

          <Link
            to={ROUTES.NOTIFICATIONS}
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-navy shadow-sm transition hover:border-slate-300"
            aria-label={`Notifications${unreadNotificationCount ? `, ${unreadNotificationCount} unread` : ''}`}
          >
            <Bell size={18} aria-hidden="true" />
            {unreadNotificationCount > 0 ? (
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" aria-hidden="true" />
            ) : null}
          </Link>

          <Link
            to={ROUTES.PROFILE}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white py-1.5 pl-1.5 pr-3 shadow-sm transition hover:border-slate-300"
            aria-label={`${user.firstName} ${user.lastName} profile`}
          >
            <PatientAvatar initials={user.avatarInitials} size="sm" />
            <span className="hidden text-sm font-medium text-navy sm:inline">
              {user.firstName} {user.lastName}
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
