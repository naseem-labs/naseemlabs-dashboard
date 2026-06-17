import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { DashboardLayout } from '../../components/dashboard';
import { DataLoadErrorScreen } from '../../components/common';
import {
  AboutSettingsCard,
  ClinicInformationSection,
  ClinicPreviewCard,
  ProfileInformationSection,
  SettingsActions,
  SettingsSecurityBanner,
} from '../../components/settings/SettingsSections';
import { AppPageHeader } from '../../components/ui';
import { useDashboard } from '../../hooks/useDashboard';
import { useNotifications } from '../../hooks/useNotifications';
import { useSettingsPage } from '../../hooks/useSettingsPage';

export function SettingsPage() {
  const navigate = useNavigate();
  const { data, isLoading: dashboardLoading, error: dashboardError } = useDashboard();
  const { unreadCount } = useNotifications();
  const {
    form,
    preview,
    isLoading,
    isSaving,
    error,
    successMessage,
    updateField,
    saveSettings,
    resetToDefault,
  } = useSettingsPage();

  if (dashboardError || error) {
    return (
      <DataLoadErrorScreen
        error={dashboardError ?? error}
        fallbackMessage="Unable to load settings."
      />
    );
  }

  if (dashboardLoading || isLoading || !data) {
    return (
      <div className="flex h-screen items-center justify-center text-sm text-slate-500">
        Loading settings...
      </div>
    );
  }

  return (
    <DashboardLayout
      clinic={data.clinic}
      user={data.user}
      unreadNotificationCount={unreadCount}
      headerVariant="minimal"
      hideFooter
      scrollableMain
    >
      <div className="app-page">
        <button
          type="button"
          className="app-back-btn"
          onClick={() => navigate(-1)}
          aria-label="Go back"
        >
          <ArrowLeft size={18} />
        </button>

        <AppPageHeader
          title="Settings"
          subtitle="Manage your clinic information and preferences."
        />

        <div className="app-grid-settings">
          <div className="flex flex-col gap-[var(--app-content-gap)]">
            <ClinicInformationSection form={form} onChange={updateField} />
            <ProfileInformationSection form={form} onChange={updateField} />
            <SettingsSecurityBanner />
            <SettingsActions
              isSaving={isSaving}
              onSave={() => void saveSettings()}
              onReset={resetToDefault}
            />
            {successMessage ? (
              <p className="text-sm font-medium text-green-600">{successMessage}</p>
            ) : null}
          </div>

          <div className="flex flex-col gap-[var(--app-content-gap)]">
            <ClinicPreviewCard
              name={preview.name}
              whatsapp={preview.whatsapp}
              location={preview.location}
              initials={preview.initials}
            />
            <AboutSettingsCard />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
