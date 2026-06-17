import { Check, Sparkles } from 'lucide-react';
import { SYSTEM_INFO_ITEMS } from '../../constants/addLead';

export function SystemInformationCard() {
  return (
    <section className="rounded-2xl border border-purple-100 bg-gradient-to-br from-purple-50/80 to-white p-5 shadow-sm sm:p-6">
      <div className="mb-4 flex items-center gap-2.5">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
          <Sparkles size={18} />
        </span>
        <h2 className="text-base font-semibold text-purple-700">After creating lead</h2>
      </div>

      <ul className="space-y-2.5">
        {SYSTEM_INFO_ITEMS.map((item) => (
          <li key={item} className="flex items-start gap-2.5 text-sm text-navy">
            <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-50 text-green-600">
              <Check size={12} strokeWidth={3} />
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
