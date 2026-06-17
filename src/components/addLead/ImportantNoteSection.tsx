import { FileText } from 'lucide-react';
import { NOTE_MAX_LENGTH } from '../../constants/addLead';
import { FormSectionCard } from './FormSectionCard';

interface ImportantNoteSectionProps {
  value: string;
  onChange: (value: string) => void;
}

export function ImportantNoteSection({ value, onChange }: ImportantNoteSectionProps) {
  return (
    <FormSectionCard title="4. Important Note" icon={FileText} optional>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value.slice(0, NOTE_MAX_LENGTH))}
        rows={4}
        placeholder={'Patient asked about cost.\nComparing clinics.\nRequested callback after 6 PM.'}
        className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-navy shadow-sm transition focus:border-purple-400 focus:outline-none focus:ring-4 focus:ring-purple-100"
      />
      <div className="mt-2 text-right text-xs text-slate-400">
        {value.length} / {NOTE_MAX_LENGTH}
      </div>
    </FormSectionCard>
  );
}
