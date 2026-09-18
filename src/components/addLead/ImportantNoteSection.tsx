import { FileText } from 'lucide-react';
import { NOTE_MAX_LENGTH } from '../../constants/addLead';
import { FormSectionCard } from './FormSectionCard';

interface ImportantNoteSectionProps {
  value: string;
  onChange: (value: string) => void;
}

export function ImportantNoteSection({ value, onChange }: ImportantNoteSectionProps) {
  return (
    <FormSectionCard title="4. Staff Note" icon={FileText} optional>
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5">
        <p className="mb-2 text-xs text-slate-500">
          Add fees, visit dates, preferences, or other front-desk details.
        </p>
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value.slice(0, NOTE_MAX_LENGTH))}
          rows={3}
          placeholder="Add an internal staff note..."
          className="w-full resize-y rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
        />
        <div className="mt-2 text-right text-xs text-slate-400">
          {value.length} / {NOTE_MAX_LENGTH}
        </div>
      </div>
    </FormSectionCard>
  );
}
