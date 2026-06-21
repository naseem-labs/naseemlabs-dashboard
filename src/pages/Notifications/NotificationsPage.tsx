import { DashboardLayout } from '../../components/dashboard';
import { DataLoadErrorScreen } from '../../components/common';
import { NOTIFICATION_TYPE_CONFIG } from '../../constants/notifications';
import { formatDisplayDate } from '../../hooks/useDashboard';
import { useDashboard } from '../../hooks/useDashboard';
import { useNotifications } from '../../hooks/useNotifications';

export function NotificationsPage() {
  const { data, isLoading: dashboardLoading, error: dashboardError } = useDashboard();
  const { unread, read, unreadCount, isLoading, error } = useNotifications();

  if (dashboardError || error) {
    return (
      <DataLoadErrorScreen
        error={dashboardError ?? error}
        fallbackMessage="Unable to load notifications."
      />
    );
  }

  if (dashboardLoading || isLoading || !data) {
    return (
      <div className="flex h-screen items-center justify-center bg-surface text-sm text-slate-500">
        Loading notifications...
      </div>
    );
  }

  return (
    <DashboardLayout
      clinic={data.clinic}
      user={data.user}
      unreadNotificationCount={unreadCount}
    >
      <div className="h-full w-full overflow-y-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-navy">Notifications</h1>
          <p className="mt-1 text-sm text-slate-500">
            Stay updated on leads, follow-ups, and clinic activity.
          </p>
        </div>

        <NotificationSection title="Unread" items={unread} emptyMessage="No unread notifications." />
        <NotificationSection title="Read" items={read} emptyMessage="No read notifications." />
      </div>
    </DashboardLayout>
  );
}

interface NotificationSectionProps {
  title: string;
  items: ReturnType<typeof useNotifications>['unread'];
  emptyMessage: string;
}

function NotificationSection({ title, items, emptyMessage }: NotificationSectionProps) {
  return (
    <section className="mb-6 rounded-2xl border border-slate-200/80 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-5 py-4">
        <h2 className="text-base font-semibold text-navy">{title}</h2>
      </div>

      {items.length === 0 ? (
        <p className="px-5 py-8 text-center text-sm text-slate-500">{emptyMessage}</p>
      ) : (
        <ul className="divide-y divide-slate-100">
          {items.map((item) => {
            const typeConfig = NOTIFICATION_TYPE_CONFIG[item.type];

            return (
              <li key={item.id} className="px-5 py-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${typeConfig.badgeClass}`}
                      >
                        {typeConfig.label}
                      </span>
                      {!item.read ? (
                        <span className="rounded-full bg-red-50 px-2 py-0.5 text-[11px] font-semibold text-red-600">
                          Unread
                        </span>
                      ) : null}
                    </div>
                    <p className="text-sm font-semibold text-navy">{item.title}</p>
                    <p className="mt-1 text-sm text-slate-500">{item.message}</p>
                  </div>
                  <time className="shrink-0 text-xs text-slate-400">
                    {formatDisplayDate(item.createdAt)}
                  </time>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
