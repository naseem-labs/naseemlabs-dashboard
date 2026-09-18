import { memo, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { createPortal } from 'react-dom';
import {
  Bell,
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import type { DashboardUser } from '../../types/dashboard';
import { ROUTES } from '../../constants/routes';
import { getCurrentDate, getGreeting, getGreetingName } from '../../hooks/useDashboard';
import { PatientAvatar } from './PatientAvatar';
import { MobileMenuButton } from './Sidebar';
import type {
  DashboardDateFilterControls,
  DashboardHeaderVariant,
} from './DashboardLayout';

interface TopHeaderProps {
  user: DashboardUser;
  unreadNotificationCount: number;
  onOpenMobileMenu: () => void;
  variant?: DashboardHeaderVariant;
  dateFilter?: DashboardDateFilterControls;
}

function isSameDay(left: Date, right: Date): boolean {
  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate()
  );
}

function getCalendarDays(month: Date): Array<Date | null> {
  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  const firstDay = (new Date(year, monthIndex, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

  return [
    ...Array.from({ length: firstDay }, () => null),
    ...Array.from(
      { length: daysInMonth },
      (_, index) => new Date(year, monthIndex, index + 1),
    ),
  ];
}

function getDateFilterLabel(selectedDate: Date | null): string {
  if (!selectedDate) {
    return 'All Leads';
  }

  const today = new Date();
  if (isSameDay(selectedDate, today)) {
    return 'Today (Live)';
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  if (isSameDay(selectedDate, yesterday)) {
    return 'Yesterday';
  }

  return selectedDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function TopHeaderComponent({
  user,
  unreadNotificationCount,
  onOpenMobileMenu,
  variant = 'dashboard',
  dateFilter,
}: TopHeaderProps) {
  const greeting = getGreeting();
  const greetingName = getGreetingName(user);
  const currentDate = getCurrentDate();
  const isMinimal = variant === 'minimal';
  const [isDateFilterOpen, setIsDateFilterOpen] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(() => new Date());
  const [popoverPosition, setPopoverPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const calendarDays = getCalendarDays(calendarMonth);

  useEffect(() => {
    if (!isDateFilterOpen) {
      return undefined;
    }

    const updatePopoverPosition = () => {
      const trigger = triggerRef.current;
      if (!trigger) {
        return;
      }

      const rect = trigger.getBoundingClientRect();
      const popoverWidth = 336;
      const left = Math.max(
        12,
        Math.min(rect.right - popoverWidth, window.innerWidth - popoverWidth - 12),
      );

      setPopoverPosition({
        top: rect.bottom + 8,
        left,
      });
    };

    const handleOutsidePointerDown = (event: MouseEvent) => {
      const target = event.target;
      if (
        target instanceof Node &&
        !triggerRef.current?.contains(target) &&
        !popoverRef.current?.contains(target)
      ) {
        setIsDateFilterOpen(false);
      }
    };

    updatePopoverPosition();
    document.addEventListener('mousedown', handleOutsidePointerDown);
    window.addEventListener('resize', updatePopoverPosition);
    window.addEventListener('scroll', updatePopoverPosition, true);

    return () => {
      document.removeEventListener('mousedown', handleOutsidePointerDown);
      window.removeEventListener('resize', updatePopoverPosition);
      window.removeEventListener('scroll', updatePopoverPosition, true);
    };
  }, [isDateFilterOpen]);

  const applyDateFilter = (date: Date | null) => {
    dateFilter?.setSelectedDate(date);
    setIsDateFilterOpen(false);
  };

  const dateFilterLabel = getDateFilterLabel(dateFilter?.selectedDate ?? null);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  return (
    <header className="app-top-header shrink-0 px-3 py-3 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between gap-2 sm:gap-3">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <MobileMenuButton onClick={onOpenMobileMenu} />

          {!isMinimal ? (
            <div className="min-w-0 lg:block">
              <h1 className="truncate text-base font-bold text-navy sm:text-lg lg:text-2xl">
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
            dateFilter ? (
              <div className="relative hidden sm:block">
                <button
                  type="button"
                  ref={triggerRef}
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-200/80 bg-white/80 px-3 py-2 text-sm font-medium text-navy shadow-sm backdrop-blur-md transition hover:bg-white"
                  aria-label={`Lead date filter: ${dateFilterLabel}`}
                  aria-expanded={isDateFilterOpen}
                  aria-haspopup="menu"
                  onClick={() => {
                    if (!isDateFilterOpen) {
                      setCalendarMonth(dateFilter.selectedDate ?? new Date());
                    }
                    setIsDateFilterOpen((isOpen) => !isOpen);
                  }}
                >
                  <Calendar size={16} className="text-slate-400" aria-hidden="true" />
                  <span>{dateFilterLabel}</span>
                  <ChevronDown size={15} className="text-slate-400" aria-hidden="true" />
                </button>

                {isDateFilterOpen
                  ? createPortal(
                      <div
                        ref={popoverRef}
                        className="fixed z-[1000] w-[min(21rem,calc(100vw-1.5rem))] rounded-xl border border-slate-200 bg-white p-3 shadow-2xl"
                        style={popoverPosition}
                        role="menu"
                      >
                        <p className="px-1 pb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                          Quick Filters
                        </p>

                        <div className="grid grid-cols-3 gap-1">
                          <button
                            type="button"
                            className={`flex-1 whitespace-nowrap rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium transition ${
                              !dateFilter.selectedDate
                                ? 'border-slate-900 bg-slate-900 text-white'
                                : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                            }`}
                            onClick={() => applyDateFilter(null)}
                          >
                            All Time
                          </button>
                          <button
                            type="button"
                            className={`flex-1 whitespace-nowrap rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium transition ${
                              dateFilter.selectedDate &&
                              isSameDay(dateFilter.selectedDate, today)
                                ? 'border-slate-900 bg-slate-900 text-white'
                                : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                            }`}
                            onClick={() => applyDateFilter(new Date())}
                          >
                            Today
                          </button>
                          <button
                            type="button"
                            className={`flex-1 whitespace-nowrap rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium transition ${
                              dateFilter.selectedDate &&
                              isSameDay(dateFilter.selectedDate, yesterday)
                                ? 'border-slate-900 bg-slate-900 text-white'
                                : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                            }`}
                            onClick={() => {
                              applyDateFilter(yesterday);
                            }}
                          >
                            Yesterday
                          </button>
                        </div>

                        <div className="mt-3 border-t border-slate-100 pt-3">
                          <div className="px-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                            Select Specific Date
                          </div>

                          <div className="mt-2 flex items-center justify-between px-0.5">
                            <button
                              type="button"
                              className="rounded-md p-1 text-slate-400 transition hover:bg-slate-100 hover:text-navy"
                              aria-label="Previous month"
                              onClick={() =>
                                setCalendarMonth(
                                  (currentMonth) =>
                                    new Date(
                                      currentMonth.getFullYear(),
                                      currentMonth.getMonth() - 1,
                                      1,
                                    ),
                                )
                              }
                            >
                              <ChevronLeft size={15} aria-hidden="true" />
                            </button>
                            <span className="text-xs font-semibold text-navy">
                              {calendarMonth.toLocaleDateString('en-US', {
                                month: 'long',
                                year: 'numeric',
                              })}
                            </span>
                            <button
                              type="button"
                              className="rounded-md p-1 text-slate-400 transition hover:bg-slate-100 hover:text-navy"
                              aria-label="Next month"
                              onClick={() =>
                                setCalendarMonth(
                                  (currentMonth) =>
                                    new Date(
                                      currentMonth.getFullYear(),
                                      currentMonth.getMonth() + 1,
                                      1,
                                    ),
                                )
                              }
                            >
                              <ChevronRight size={15} aria-hidden="true" />
                            </button>
                          </div>

                          <div className="mt-2 grid grid-cols-7 text-center text-[10px] font-semibold text-slate-400">
                            {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((day) => (
                              <span key={day}>{day}</span>
                            ))}
                          </div>

                          <div
                            className="mt-1 grid grid-cols-7 gap-1"
                            role="grid"
                            aria-label="Select a specific date"
                          >
                            {calendarDays.map((day, index) =>
                              day ? (
                                <button
                                  key={day.toISOString()}
                                  type="button"
                                  role="gridcell"
                                  aria-label={day.toLocaleDateString('en-US', {
                                    month: 'long',
                                    day: 'numeric',
                                    year: 'numeric',
                                  })}
                                  className={`h-7 rounded-lg text-xs transition hover:bg-slate-100 ${
                                    dateFilter.selectedDate &&
                                    isSameDay(day, dateFilter.selectedDate)
                                      ? 'bg-slate-900 font-medium text-white'
                                      : isSameDay(day, new Date())
                                        ? 'font-bold text-slate-900 underline decoration-slate-400'
                                        : 'text-navy'
                                  }`}
                                  onClick={() => applyDateFilter(day)}
                                >
                                  {day.getDate()}
                                </button>
                              ) : (
                                <span key={`empty-${index}`} aria-hidden="true" />
                              ),
                            )}
                          </div>
                        </div>

                        <button
                          type="button"
                          className="mt-3 w-full py-1.5 text-center text-xs font-medium text-slate-500 transition hover:text-slate-800"
                          onClick={() => {
                            dateFilter.clearDateFilter();
                            setIsDateFilterOpen(false);
                          }}
                        >
                          Clear Filter
                        </button>
                      </div>,
                      document.body,
                    )
                  : null}
              </div>
            ) : (
              <div
                className="hidden items-center gap-2 rounded-lg border border-slate-200/80 bg-white/80 px-3 py-2 text-sm font-medium text-navy shadow-sm backdrop-blur-md sm:inline-flex"
                aria-label={`Current date: ${currentDate}`}
              >
                <Calendar size={16} className="text-slate-400" aria-hidden="true" />
                <span>{currentDate}</span>
              </div>
            )
          ) : null}

          <Link
            to={ROUTES.NOTIFICATIONS}
            className="relative inline-flex h-11 w-11 items-center justify-center rounded-lg border border-slate-200/80 bg-white/80 text-navy shadow-sm backdrop-blur-md transition hover:bg-white"
            aria-label={`Notifications${unreadNotificationCount ? `, ${unreadNotificationCount} unread` : ''}`}
          >
            <Bell size={18} aria-hidden="true" />
            {unreadNotificationCount > 0 ? (
              <span className="absolute -right-0.5 -top-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                {unreadNotificationCount}
              </span>
            ) : null}
          </Link>

          <Link to={ROUTES.PROFILE} className="app-user-chip min-w-0 transition hover:bg-white">
            <PatientAvatar initials={user.avatarInitials} size="sm" />
            <div className="hidden min-w-0 md:block">
              <p className="truncate text-sm font-semibold text-navy">
                {user.firstName} {user.lastName}
              </p>
              <p className="truncate text-xs capitalize text-slate-500">{user.role}</p>
            </div>
            <ChevronDown size={16} className="hidden text-slate-400 md:block" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </header>
  );
}

export const TopHeader = memo(TopHeaderComponent);
