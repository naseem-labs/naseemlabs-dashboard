import { Focus } from 'lucide-react';
import type { ConcernArea } from '../../types/addLead';
import { CONCERN_AREA_OPTIONS } from '../../constants/addLead';
import { FormSectionCard } from './FormSectionCard';

interface CurrentSituationSectionProps {
  value: ConcernArea | null;
  onChange: (value: ConcernArea) => void;
}

export function CurrentSituationSection({ value, onChange }: CurrentSituationSectionProps) {
  return (
    <FormSectionCard title="2. Current Situation" icon={Focus} optional>
      <p className="mb-4 text-sm text-slate-600">What is the main area of concern?</p>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-5">
        {CONCERN_AREA_OPTIONS.map((option) => {
          const Icon = option.icon;
          const isSelected = value === option.value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={`flex min-h-[72px] sm:min-h-[88px] flex-col items-center justify-center gap-2 rounded-2xl border px-3 py-4 text-center text-sm font-medium transition ${
                isSelected
                  ? 'border-purple-500 bg-purple-50 text-purple-700 shadow-sm'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-purple-200 hover:bg-purple-50/40'
              }`}
            >
              <Icon size={22} className={isSelected ? 'text-purple-600' : 'text-slate-400'} />
              <span>{option.label}</span>
            </button>
          );
        })}
      </div>
    </FormSectionCard>
  );
}
