import { useState } from 'react';
import { Pencil } from 'lucide-react';
import type { PatientInformation } from '../../types/leadDetail';
import { formatDisplayDate } from '../../hooks/useDashboard';
import { LeadDetailCard } from './LeadDetailCard';

interface PatientInformationCardProps {
  patientInfo: PatientInformation;
  onSave: (info: PatientInformation) => void;
}

const FIELDS: { key: keyof PatientInformation; label: string; type?: string }[] = [
  { key: 'age', label: 'Age', type: 'number' },
  { key: 'city', label: 'City' },
  { key: 'hairLossDuration', label: 'Hair Loss Duration' },
  { key: 'affectedArea', label: 'Affected Area' },
  { key: 'hairType', label: 'Hair Type' },
  { key: 'previousTreatment', label: 'Previous Treatment' },
  { key: 'goal', label: 'Goal' },
];

export function PatientInformationCard({
  patientInfo,
  onSave,
}: PatientInformationCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(patientInfo);

  const startEdit = () => {
    setDraft(patientInfo);
    setIsEditing(true);
  };

  const handleSave = () => {
    onSave({
      ...draft,
      age: Number(draft.age) || patientInfo.age,
    });
    setIsEditing(false);
  };

  return (
    <LeadDetailCard
      title="Patient Information"
      action={
        isEditing ? (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="text-xs font-medium text-slate-500 hover:text-slate-700"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="text-xs font-semibold text-purple-600 hover:text-purple-700"
            >
              Save
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={startEdit}
            className="inline-flex items-center gap-1 text-xs font-semibold text-purple-600 hover:text-purple-700"
          >
            <Pencil size={12} />
            Edit
          </button>
        )
      }
    >
      <dl className="grid gap-3 sm:grid-cols-2">
        {FIELDS.map((field) => (
          <div key={field.key}>
            <dt className="text-xs font-medium text-slate-500">{field.label}</dt>
            {isEditing ? (
              <input
                type={field.type ?? 'text'}
                value={draft[field.key]}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    [field.key]:
                      field.type === 'number'
                        ? Number(event.target.value)
                        : event.target.value,
                  }))
                }
                className="mt-1 w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-sm text-navy focus:border-purple-400 focus:outline-none"
              />
            ) : (
              <dd className="mt-0.5 text-sm font-medium text-navy">
                {patientInfo[field.key]}
              </dd>
            )}
          </div>
        ))}

        <div>
          <dt className="text-xs font-medium text-slate-500">Created On</dt>
          <dd className="mt-0.5 text-sm font-medium text-navy">
            {formatDisplayDate(patientInfo.createdOn)}
          </dd>
        </div>
      </dl>
    </LeadDetailCard>
  );
}
