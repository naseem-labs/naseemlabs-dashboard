import { MessageCircle, UserRound } from 'lucide-react';
import type { AddLeadFormErrors, AddLeadFormState } from '../../types/addLead';
import { DEFAULT_COUNTRY_CODE, LEAD_SOURCE_OPTIONS } from '../../constants/addLead';
import { FormSectionCard } from './FormSectionCard';

interface BasicInformationSectionProps {
  form: AddLeadFormState;
  errors: AddLeadFormErrors;
  onChange: <K extends keyof AddLeadFormState>(key: K, value: AddLeadFormState[K]) => void;
}

const fieldClassName =
  'w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-navy shadow-sm transition focus:border-purple-400 focus:outline-none focus:ring-4 focus:ring-purple-100';

const labelClassName = 'mb-1.5 block text-sm font-medium text-navy';

export function BasicInformationSection({
  form,
  errors,
  onChange,
}: BasicInformationSectionProps) {
  return (
    <FormSectionCard title="1. Basic Information" icon={UserRound}>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2 lg:col-span-1">
          <label className={labelClassName} htmlFor="patient-name">
            Patient Name <span className="text-red-500">*</span>
          </label>
          <input
            id="patient-name"
            type="text"
            value={form.patientName}
            onChange={(event) => onChange('patientName', event.target.value)}
            placeholder="Enter full name"
            className={`${fieldClassName} ${errors.patientName ? 'border-red-300 focus:border-red-400 focus:ring-red-100' : ''}`}
          />
          {errors.patientName ? (
            <p className="mt-1 text-xs text-red-600">{errors.patientName}</p>
          ) : null}
        </div>

        <div className="sm:col-span-2 lg:col-span-1">
          <label className={labelClassName} htmlFor="patient-phone">
            Phone / WhatsApp <span className="text-red-500">*</span>
          </label>
          <div className="flex overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm focus-within:border-purple-400 focus-within:ring-4 focus-within:ring-purple-100">
            <span className="inline-flex items-center border-r border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-600">
              {DEFAULT_COUNTRY_CODE}
            </span>
            <input
              id="patient-phone"
              type="tel"
              value={form.phone}
              onChange={(event) => onChange('phone', event.target.value)}
              placeholder="Enter phone number"
              className="min-w-0 flex-1 px-3.5 py-2.5 text-sm text-navy focus:outline-none"
            />
            <span className="inline-flex items-center px-3 text-green-500" aria-hidden="true">
              <MessageCircle size={18} />
            </span>
          </div>
          {errors.phone ? <p className="mt-1 text-xs text-red-600">{errors.phone}</p> : null}
        </div>

        <div>
          <label className={labelClassName} htmlFor="patient-city">
            City
          </label>
          <input
            id="patient-city"
            type="text"
            value={form.city}
            onChange={(event) => onChange('city', event.target.value)}
            placeholder="Enter city"
            className={fieldClassName}
          />
        </div>

        <div>
          <label className={labelClassName} htmlFor="lead-source">
            Lead Source <span className="text-red-500">*</span>
          </label>
          <select
            id="lead-source"
            value={form.leadSource}
            onChange={(event) => onChange('leadSource', event.target.value as AddLeadFormState['leadSource'])}
            className={`${fieldClassName} ${errors.leadSource ? 'border-red-300' : ''}`}
          >
            <option value="">Select lead source</option>
            {LEAD_SOURCE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.leadSource ? (
            <p className="mt-1 text-xs text-red-600">{errors.leadSource}</p>
          ) : null}
        </div>
      </div>
    </FormSectionCard>
  );
}
