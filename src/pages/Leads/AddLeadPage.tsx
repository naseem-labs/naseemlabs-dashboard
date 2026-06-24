import { DashboardLayout } from '../../components/dashboard';
import { DataLoadErrorScreen } from '../../components/common';
import {
  AddLeadFormActions,
  AddLeadPageHeader,
  BasicInformationSection,
  CurrentSituationSection,
  ImportantNoteSection,
  PhotosAvailableSection,
  SystemInformationCard,
  Toast,
} from '../../components/addLead';
import type { DashboardData } from '../../types/dashboard';
import { useAddLeadForm } from '../../hooks/useAddLeadForm';
import { useDashboard } from '../../hooks/useDashboard';
import { useNotifications } from '../../hooks/useNotifications';

export function AddLeadPage() {
  const { data, isLoading, error } = useDashboard();
  const { unreadCount } = useNotifications();

  if (isLoading || !data) {
    return (
      <div className="flex h-screen items-center justify-center bg-surface text-sm text-slate-500">
        Loading...
      </div>
    );
  }

  if (error) {
    return <DataLoadErrorScreen error={error} fallbackMessage="Unable to load add Patient page." />;
  }

  return <AddLeadPageContent data={data} unreadCount={unreadCount} />;
}

function AddLeadPageContent({
  data,
  unreadCount,
}: {
  data: DashboardData;
  unreadCount: number;
}) {
  const {
    form,
    errors,
    isSubmitting,
    submitError,
    successMessage,
    isSupabaseConfigured,
    updateField,
    handleSubmit,
    handleCancel,
    clearSuccessMessage,
    clearSubmitError,
  } = useAddLeadForm(data.user, data.clinic.id);

  return (
    <DashboardLayout
      clinic={data.clinic}
      user={data.user}
      unreadNotificationCount={unreadCount}
      renderHeader={(props) => <AddLeadPageHeader {...props} />}
      hideFooter
      scrollableMain
    >
      <div className="app-page flex w-full flex-col gap-4 pb-4">
        {!isSupabaseConfigured ? (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Supabase is not configured. Add your project URL and anon key to{' '}
            <code className="font-mono">.env</code>, then restart the app.
          </div>
        ) : null}

        <BasicInformationSection form={form} errors={errors} onChange={updateField} />

        <CurrentSituationSection
          value={form.concernArea}
          onChange={(value) => updateField('concernArea', value)}
        />

        <PhotosAvailableSection
          photosAvailable={form.photosAvailable}
          photoTypes={form.photoTypes}
          onPhotosAvailableChange={(value) => updateField('photosAvailable', value)}
          onPhotoTypesChange={(value) => updateField('photoTypes', value)}
        />

        <ImportantNoteSection
          value={form.note}
          onChange={(value) => updateField('note', value)}
        />

        <SystemInformationCard />

        <AddLeadFormActions
          isSubmitting={isSubmitting}
          onCancel={handleCancel}
          onSubmit={() => void handleSubmit()}
        />
      </div>

      {successMessage ? (
        <Toast message={successMessage} variant="success" onClose={clearSuccessMessage} />
      ) : null}

      {submitError ? (
        <Toast message={submitError} variant="error" onClose={clearSubmitError} />
      ) : null}
    </DashboardLayout>
  );
}
