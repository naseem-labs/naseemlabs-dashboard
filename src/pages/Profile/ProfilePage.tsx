import { useState } from 'react';
import { DashboardLayout, PatientAvatar } from '../../components/dashboard';
import { DataLoadErrorScreen } from '../../components/common';
import { LANGUAGE_OPTIONS, TIMEZONE_OPTIONS } from '../../constants/profile';
import { useDashboard } from '../../hooks/useDashboard';
import { useNotifications } from '../../hooks/useNotifications';
import { useProfile } from '../../hooks/useProfile';
import type { UserProfile } from '../../types/profile';

export function ProfilePage() {
  const { data, isLoading: dashboardLoading, error: dashboardError } = useDashboard();
  const { unreadCount } = useNotifications();
  const { profile, isLoading, isSaving, error, saveProfile } =
    useProfile();
  const [editedProfile, setEditedProfile] = useState<UserProfile | null>(null);

  const form = editedProfile ?? profile;

  if (dashboardError || error) {
    return (
      <DataLoadErrorScreen
        error={dashboardError ?? error}
        fallbackMessage="Unable to load profile."
      />
    );
  }

  if (dashboardLoading || isLoading || !data || !form) {
    return (
      <div className="flex h-screen items-center justify-center bg-surface text-sm text-slate-500">
        Loading profile...
      </div>
    );
  }

  const handleChange = (field: keyof UserProfile, value: string) => {
    setEditedProfile((current) => {
      const base = current ?? profile;
      return base ? { ...base, [field]: value } : current;
    });
  };

  const handleSave = async () => {
    if (!form) {
      return;
    }

    await saveProfile(form);
    setEditedProfile(null);
  };


  return (
    <DashboardLayout
      clinic={data.clinic}
      user={data.user}
      unreadNotificationCount={unreadCount}
    >
      <div className="mx-auto h-full w-full max-w-5xl overflow-y-auto">
        <article className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-navy">Profile</h1>
              <p className="mt-1 text-sm text-slate-500">
                Manage your account details and preferences.
              </p>
            </div>

            <div />
          </div>

          <div className="mb-8 flex items-center gap-4">
            <PatientAvatar initials={form.avatarInitials} size="lg" />
            <div>
              <p className="text-lg font-semibold text-navy">
                {form.firstName} {form.lastName}
              </p>
              <p className="text-sm capitalize text-slate-500">{form.role}</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <ProfileField
              label="First Name"
              value={form.firstName}
              onChange={(value) => handleChange('firstName', value)}
              disabled={false}
            />
            <ProfileField
              label="Last Name"
              value={form.lastName}
              onChange={(value) => handleChange('lastName', value)}
              disabled={false}
            />
            <ProfileField
              label="Email"
              value={form.email}
              onChange={(value) => handleChange('email', value)}
              disabled={false}
              className="sm:col-span-2"
            />
            <ProfileField
              label="Phone"
              value={form.phone}
              onChange={(value) => handleChange('phone', value)}
              disabled={false}
            />
            <ProfileField
              label="Role"
              value={form.role}
              onChange={(value) => handleChange('role', value)}
              disabled={false}
            />
            <label className="block sm:col-span-2">
              <span className="mb-1.5 block text-sm font-medium text-navy">Language</span>
              <select
                value={form.language}
                onChange={(event) => handleChange('language', event.target.value)}
                disabled={false}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-navy outline-none focus:border-purple-300 focus:ring-4 focus:ring-purple-100 disabled:bg-slate-50"
              >
                {LANGUAGE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="block sm:col-span-2">
              <span className="mb-1.5 block text-sm font-medium text-navy">Timezone</span>
              <select
                value={form.timezone}
                onChange={(event) => handleChange('timezone', event.target.value)}
                disabled={false}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-navy outline-none focus:border-purple-300 focus:ring-4 focus:ring-purple-100 disabled:bg-slate-50"
              >
                {TIMEZONE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="mt-8 flex justify-end">
            <button
              type="button"
              onClick={() => void handleSave()}
              disabled={isSaving}
              className="rounded-xl bg-purple-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-purple-700 disabled:opacity-60"
            >
              {isSaving ? 'Updating...' : 'Update Profile'}
            </button>
          </div>
        </article>
      </div>
    </DashboardLayout>
  );
}

interface ProfileFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

function ProfileField({
  label,
  value,
  onChange,
  disabled = false,
  className = '',
}: ProfileFieldProps) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-sm font-medium text-navy">{label}</span>
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-navy outline-none focus:border-purple-300 focus:ring-4 focus:ring-purple-100 disabled:bg-slate-50"
      />
    </label>
  );
}
