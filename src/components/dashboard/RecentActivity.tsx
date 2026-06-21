const demoActivities = [
  {
    id: '1',
    title: 'New lead received',
    description: 'Patient submitted a new consultation inquiry.',
    time: '2 min ago',
  },
  {
    id: '2',
    title: 'Follow-up scheduled',
    description: 'Follow-up reminder created for an existing lead.',
    time: '15 min ago',
  },
  {
    id: '3',
    title: 'Consultation ready',
    description: 'Lead moved to consultation-ready stage.',
    time: '1 hour ago',
  },
  {
    id: '4',
    title: 'Doctor review requested',
    description: 'Case forwarded for doctor review.',
    time: '3 hours ago',
  },
];

export function RecentActivity() {
  return (
    <section className="flex h-full min-h-[540px] w-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:h-[540px]">
      <div className="shrink-0 border-b border-slate-200 px-4 py-3 sm:px-5 sm:py-4">
        <h3 className="text-base font-semibold text-slate-900">
          Recent Activity
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto p-3 sm:p-4 scrollbar-thin">
        <div className="space-y-3">
          {demoActivities.map((activity) => (
            <article
              key={activity.id}
              className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <h4 className="text-sm font-semibold text-slate-900">
                    {activity.title}
                  </h4>

                  <span className="shrink-0 text-xs text-slate-500">
                    {activity.time}
                  </span>
                </div>

                <p className="text-sm leading-5 text-slate-600 sm:leading-6">
                  {activity.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default RecentActivity;