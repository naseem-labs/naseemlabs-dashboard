import { Building2, Check, CloudUpload, MapPin, MessageCircle, RotateCcw, Shield, UserRound } from 'lucide-react';
import { LANGUAGE_OPTIONS, TIMEZONE_OPTIONS } from '../../constants/profile';
import { AppField, AppGlassCard, AppSectionHeader } from '../ui';
import type { SettingsFormState } from '../../hooks/useSettingsPage';

interface ClinicInformationSectionProps {
  form: Pick<SettingsFormState, 'clinicName' | 'clinicWhatsappNumber' | 'clinicLocation'>;
  onChange: <K extends keyof SettingsFormState>(field: K, value: SettingsFormState[K]) => void;
}

export function ClinicInformationSection({ form, onChange }: ClinicInformationSectionProps) {
  return (
    <AppGlassCard solid>
      <AppSectionHeader title="Clinic Information" icon={Building2} />

      <div className="grid gap-4">
        <AppField label="Clinic Name" htmlFor="settings-clinic-name" icon={<Building2 size={18} />}>
          <input
            id="settings-clinic-name"
            className="app-input"
            value={form.clinicName}
            onChange={(event) => onChange('clinicName', event.target.value)}
            placeholder="Naseem Labs Hair Transplant Clinic"
          />
        </AppField>

        <AppField
          label="Clinic WhatsApp Number"
          htmlFor="settings-clinic-whatsapp"
          icon={<MessageCircle size={18} />}
        >
          <input
            id="settings-clinic-whatsapp"
            className="app-input"
            type="tel"
            value={form.clinicWhatsappNumber}
            onChange={(event) => onChange('clinicWhatsappNumber', event.target.value)}
            placeholder="+91 98765 43210"
          />
        </AppField>

        <AppField label="Location" htmlFor="settings-clinic-location" icon={<MapPin size={18} />}>
          <input
            id="settings-clinic-location"
            className="app-input"
            value={form.clinicLocation}
            onChange={(event) => onChange('clinicLocation', event.target.value)}
            placeholder="Model Town, Ludhiana, Punjab"
          />
        </AppField>

        <div className="app-field">
          <span className="app-field__label">Clinic Logo</span>
          <div className="app-upload-zone">
            <CloudUpload size={22} className="text-purple-600" aria-hidden="true" />
            <p>Drag and drop your clinic logo here, or click to browse</p>
            <p className="text-xs">PNG or JPG, max 2MB</p>
          </div>
        </div>
      </div>
    </AppGlassCard>
  );
}

interface ProfileInformationSectionProps {
  form: Pick<
    SettingsFormState,
    'firstName' | 'lastName' | 'email' | 'phone' | 'timezone' | 'language'
  >;
  onChange: <K extends keyof SettingsFormState>(field: K, value: SettingsFormState[K]) => void;
}

export function ProfileInformationSection({ form, onChange }: ProfileInformationSectionProps) {
  return (
    <AppGlassCard solid>
      <AppSectionHeader title="Profile Information" icon={UserRound} />

      <div className="grid gap-4 sm:grid-cols-2">
        <AppField label="First Name" htmlFor="settings-first-name" icon={<UserRound size={18} />}>
          <input
            id="settings-first-name"
            className="app-input"
            value={form.firstName}
            onChange={(event) => onChange('firstName', event.target.value)}
          />
        </AppField>

        <AppField label="Last Name" htmlFor="settings-last-name" icon={<UserRound size={18} />}>
          <input
            id="settings-last-name"
            className="app-input"
            value={form.lastName}
            onChange={(event) => onChange('lastName', event.target.value)}
          />
        </AppField>

        <AppField label="Email" htmlFor="settings-email" icon={<UserRound size={18} />}>
          <input
            id="settings-email"
            className="app-input"
            type="email"
            value={form.email}
            onChange={(event) => onChange('email', event.target.value)}
          />
        </AppField>

        <AppField label="Phone" htmlFor="settings-phone" icon={<MessageCircle size={18} />}>
          <input
            id="settings-phone"
            className="app-input"
            type="tel"
            value={form.phone}
            onChange={(event) => onChange('phone', event.target.value)}
          />
        </AppField>

        <AppField label="Timezone" htmlFor="settings-timezone" icon={<UserRound size={18} />}>
          <select
            id="settings-timezone"
            className="app-select"
            value={form.timezone}
            onChange={(event) => onChange('timezone', event.target.value)}
          >
            {TIMEZONE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </AppField>

        <AppField label="Language" htmlFor="settings-language" icon={<UserRound size={18} />}>
          <select
            id="settings-language"
            className="app-select"
            value={form.language}
            onChange={(event) => onChange('language', event.target.value)}
          >
            {LANGUAGE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </AppField>
      </div>
    </AppGlassCard>
  );
}

export function SettingsSecurityBanner() {
  return (
    <div className="app-alert">
      <Shield size={18} className="shrink-0" aria-hidden="true" />
      <p>
        Your clinic data is encrypted and stored securely. Only authorized team members can access
        patient information.
      </p>
    </div>
  );
}

interface SettingsActionsProps {
  isSaving: boolean;
  onSave: () => void;
  onReset: () => void;
}

export function SettingsActions({ isSaving, onSave, onReset }: SettingsActionsProps) {
  return (
    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center">
      <button type="button" className="app-btn app-btn--secondary" onClick={onReset} disabled={isSaving}>
        <RotateCcw size={16} aria-hidden="true" />
        Reset to Default
      </button>
      <button type="button" className="app-btn app-btn--primary" onClick={onSave} disabled={isSaving}>
        {isSaving ? 'Saving...' : 'Save Changes'}
        <Check size={16} aria-hidden="true" />
      </button>
    </div>
  );
}

interface ClinicPreviewCardProps {
  name: string;
  whatsapp: string;
  location: string;
  initials: string;
}

export function ClinicPreviewCard({ name, whatsapp, location, initials }: ClinicPreviewCardProps) {
  return (
    <AppGlassCard solid>
      <AppSectionHeader title="Clinic Preview" icon={Building2} />
      <div className="flex flex-col items-center text-center">
        <span className="mb-4 inline-flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-purple-500 text-2xl font-bold text-white shadow-lg shadow-purple-500/25">
          {initials}
        </span>
        <p className="text-base font-semibold text-navy">{name}</p>
        <p className="mt-1 text-sm text-slate-500">{whatsapp}</p>
        <p className="mt-1 text-sm text-slate-500">{location}</p>
      </div>
    </AppGlassCard>
  );
}

export function AboutSettingsCard() {
  const items = [
    'Clinic details appear across your dashboard',
    'WhatsApp number is used for patient communication',
    'Location helps organize leads by region',
    'Profile settings personalize your workspace',
  ];

  return (
    <AppGlassCard solid>
      <AppSectionHeader title="About Settings" icon={Shield} />
      <ul className="app-checklist">
        {items.map((item) => (
          <li key={item} className="app-checklist__item">
            <Check size={16} className="app-checklist__icon" aria-hidden="true" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </AppGlassCard>
  );
}
