import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { DashboardLayout } from '../../components/dashboard';
import { DataLoadErrorScreen } from '../../components/common';
import {
  ActionSystemCard,
  AddNoteModal,
  ChatHistoryModal,
  GuideTheAgentCard,
  InternalNotesCard,
  LeadDetailHeader,
  LeadMetricsBar,
  MarkLostLeadModal,
  PatientInformationCard,
  PatientSnapshotCard,
  PhotosCard,
  TimelineSection,
} from '../../components/leadDetail';
import { ROUTES } from '../../constants/routes';
import { useDashboard } from '../../hooks/useDashboard';
import { useLeadDetail } from '../../hooks/useLeadDetail';
import { useNotifications } from '../../hooks/useNotifications';


export function LeadDetailPage() {
  const { leadId } = useParams<{ leadId: string }>();
  const { data, isLoading: isDashboardLoading, error: dashboardError } = useDashboard();
  const { unreadCount } = useNotifications();

  const {
    detail,
    isLoading,
    error,
    isActionLoading,
    showLostModal,
    showAddNote,
    setShowLostModal,
    setShowAddNote,
    startFollowUp,
    pauseFollowUp,
    requestPhotos,
    sendToDoctorReview,
    sendConsultationInvite,
    markConsultationReady,
    markLostLead,
    addNote,
    updateNote,
    deleteNote,
    updatePatientInfo,
    isGeneratingSummary,
    isSummaryPending,
    summaryError,
    showChat,
    chatMessages,
    isChatLoading,
    chatError,
    generateAiSummary,
    openChat,
    closeChat,
  } = useLeadDetail(leadId, data?.clinic.id, data?.user);

  if (isDashboardLoading || isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-surface text-sm text-slate-500">
        Loading lead...
      </div>
    );
  }

  if (dashboardError || !data) {
    return (
      <DataLoadErrorScreen
        error={dashboardError}
        fallbackMessage="Unable to load lead."
      />
    );
  }

  if (!detail) {
    return (
      <DashboardLayout
        clinic={data.clinic}
        user={data.user}
        unreadNotificationCount={unreadCount}
      >
        <div className="app-glass-card app-glass-card--solid mx-auto max-w-3xl p-8 text-center">
          <h1 className="text-xl font-semibold text-navy">Lead not found</h1>
          <Link
            to={ROUTES.LEADS}
            className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-purple-600"
          >
            <ArrowLeft size={16} />
            Back to leads
          </Link>
        </div>
      </DashboardLayout>
    );
  }


  return (
    <DashboardLayout
      clinic={data.clinic}
      user={data.user}
      unreadNotificationCount={unreadCount}
      hideFooter
      scrollableMain
    >
      <div className="app-page flex w-full flex-col gap-4 lg:min-h-0">
        <LeadDetailHeader
          detail={detail}
          isActionLoading={isActionLoading}
          onAddNote={() => setShowAddNote(true)}
          onSendConsultationInvite={sendConsultationInvite}
          onStartFollowUp={startFollowUp}
          onPauseFollowUp={pauseFollowUp}
          onRequestPhotos={requestPhotos}
          onSendToDoctorReview={sendToDoctorReview}
          onMarkConsultationReady={markConsultationReady}
          onMarkLostLead={() => setShowLostModal(true)}
        />

        <LeadMetricsBar metrics={detail.metrics} />

        <div className="grid flex-1 gap-4 lg:grid-cols-2 lg:min-h-0 lg:overflow-y-auto lg:pb-1">
          <div className="flex flex-col gap-4">
            <PatientInformationCard
              patientInfo={detail.patientInfo}
              onSave={updatePatientInfo}
            />
            <InternalNotesCard
              notes={detail.notes}
              onUpdate={updateNote}
              onDelete={deleteNote}
            />
            <TimelineSection events={detail.timeline} />
          </div>

          <div className="flex flex-col gap-4">
            <PatientSnapshotCard
              profile={detail.leadProfile}
              isGenerating={isGeneratingSummary}
              isSummaryPending={isSummaryPending}
              summaryError={summaryError}
              onGenerateSummary={generateAiSummary}
              onViewChat={openChat}
            />
            <GuideTheAgentCard
              leadContext={detail.leadProfile.leadContext ?? ''}
              followupType={detail.followUp?.followupType ?? '-'}
              followupReason={detail.followUp?.followupReason ?? '-'}
              scheduledFor={detail.followUp?.scheduledFor ?? '-'}
              scheduledOn={detail.followUp?.createdAt ?? '-'}
            />
            <PhotosCard photos={detail.photos} />
            <ActionSystemCard
              detail={detail}
              isLoading={isActionLoading}
              onSendConsultationInvite={sendConsultationInvite}
              onStartFollowUp={startFollowUp}
              onPauseFollowUp={pauseFollowUp}
              onRequestPhotos={requestPhotos}
              onSendToDoctorReview={sendToDoctorReview}
              onMarkConsultationReady={markConsultationReady}
              onMarkLostLead={() => setShowLostModal(true)}
            />
          </div>
        </div>
      </div>

      <MarkLostLeadModal
        isOpen={showLostModal}
        isLoading={isActionLoading}
        onClose={() => setShowLostModal(false)}
        onConfirm={markLostLead}
      />

      <AddNoteModal
        isOpen={showAddNote}
        isLoading={isActionLoading}
        onClose={() => setShowAddNote(false)}
        onSave={addNote}
      />

      <ChatHistoryModal
        isOpen={showChat}
        isLoading={isChatLoading}
        error={chatError}
        patientName={`${detail.patient.firstName} ${detail.patient.lastName}`.trim()}
        patientPhone={detail.patient.phone}
        messages={chatMessages}
        onClose={closeChat}
      />

      {error ? (
        <p className="fixed bottom-20 right-4 rounded-lg bg-red-600 px-4 py-2 text-sm text-white shadow-lg">
          {error}
        </p>
      ) : null}
    </DashboardLayout>
  );
}
