import { useCallback, useEffect, useMemo, useState } from 'react';
import type { DashboardUser } from '../types/dashboard';
import type {
  LeadChatMessage,
  LeadDetailData,
  LostLeadReason,
  PatientInformation,
  TimelineEvent,
} from '../types/leadDetail';
import { leadDetailService } from '../services/leadDetail.service';
import { getErrorMessage } from '../lib/supabaseErrors';
import { useSupabaseRealtime } from './useSupabaseRealtime';

export function useLeadDetail(leadId: string | undefined, clinicId: string | undefined, user: DashboardUser | undefined) {
  const [detail, setDetail] = useState<LeadDetailData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [showLostModal, setShowLostModal] = useState(false);
  const [showAddNote, setShowAddNote] = useState(false);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [isSummaryPending, setIsSummaryPending] = useState(false);
  const [summaryError, setSummaryError] = useState<string | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<LeadChatMessage[]>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);

  const actorName = user ? `${user.firstName} ${user.lastName}` : 'Receptionist';
  const userId = user?.id ?? 'local-session-user';

  const loadDetail = useCallback(async () => {
    if (!leadId || !clinicId) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await leadDetailService.getLeadDetail(leadId, clinicId);
      setDetail(data);
    } catch (loadError) {
      setError(getErrorMessage(loadError, 'Unable to load lead details.'));
    } finally {
      setIsLoading(false);
    }
  }, [clinicId, leadId]);

  const syncPendingSummaryRequest = useCallback(async () => {
    if (!leadId) {
      return;
    }

    try {
      const pending = await leadDetailService.hasPendingAiSummaryRequest(leadId);
      setIsSummaryPending(pending);
    } catch {
      // Ignore background pending-check failures.
    }
  }, [leadId]);

  const refreshDetail = useCallback(async () => {
    if (!leadId || !clinicId) {
      return;
    }

    try {
      const data = await leadDetailService.getLeadDetail(leadId, clinicId);
      setDetail(data);
      await syncPendingSummaryRequest();
    } catch {
      // Ignore background refresh failures.
    }
  }, [clinicId, leadId, syncPendingSummaryRequest]);

  useEffect(() => {
    if (!leadId || !clinicId) {
      return;
    }

    let isMounted = true;

    const load = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await leadDetailService.getLeadDetail(leadId, clinicId);
        if (isMounted) {
          setDetail(data);
          void leadDetailService.hasPendingAiSummaryRequest(leadId).then((pending) => {
            if (isMounted) {
              setIsSummaryPending(pending);
            }
          });
        }
      } catch (loadError) {
        if (isMounted) {
          setError(getErrorMessage(loadError, 'Unable to load lead details.'));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void load();

    return () => {
      isMounted = false;
    };
  }, [clinicId, leadId]);

  const detailRealtimeTables = useMemo(
    () =>
      leadId
        ? [
            { table: 'leads', filter: `id=eq.${leadId}` },
            { table: 'lead_profile', filter: `lead_id=eq.${leadId}` },
            { table: 'lead_actions', filter: `lead_id=eq.${leadId}` },
            { table: 'lead_photos', filter: `lead_id=eq.${leadId}` },
            { table: 'followup_queue', filter: `lead_id=eq.${leadId}` },
            { table: 'ai_summary_requests', filter: `lead_id=eq.${leadId}` },
          ]
        : [],
    [leadId],
  );

  useSupabaseRealtime(
    leadId && clinicId ? `lead-detail-${leadId}` : null,
    detailRealtimeTables,
    () => {
      void refreshDetail();
    },
    Boolean(leadId && clinicId),
  );

  const runAction = useCallback(
    async (
      action: (current: LeadDetailData) => Promise<LeadDetailData>,
      timelineEntry?: Pick<TimelineEvent, 'title' | 'description' | 'actorName'>,
    ) => {
      if (!detail) {
        return;
      }

      const optimisticEvent = timelineEntry
        ? {
            ...timelineEntry,
            id: `local-${Date.now()}-${Math.random().toString(36).slice(2)}`,
            createdAt: new Date().toISOString(),
          }
        : null;

      setIsActionLoading(true);
      if (optimisticEvent) {
        setDetail((current) =>
          current
            ? { ...current, timeline: [optimisticEvent, ...current.timeline] }
            : current,
        );
      }

      try {
        const updated = await action(detail);
        setDetail(updated);
      } catch {
        if (optimisticEvent) {
          setDetail((current) =>
            current
              ? {
                  ...current,
                  timeline: current.timeline.filter((event) => event.id !== optimisticEvent.id),
                }
              : current,
          );
        }
        setError('Action failed. Please try again.');
      } finally {
        setIsActionLoading(false);
      }
    },
    [detail],
  );

  const startFollowUp = useCallback(() => {
    void runAction(
      (current) => leadDetailService.startFollowUp(current, actorName, userId),
      { title: 'Follow Up Started', actorName, description: 'Follow-up started.' },
    );
  }, [actorName, runAction, userId]);

  const pauseFollowUp = useCallback(() => {
    void runAction(
      (current) => leadDetailService.pauseFollowUp(current, actorName, userId),
      { title: 'Follow Up Paused', actorName, description: 'Follow-up paused.' },
    );
  }, [actorName, runAction, userId]);

  const requestPhotos = useCallback(() => {
    void runAction(
      (current) => leadDetailService.requestPhotos(current, actorName, userId),
      { title: 'Photos Requested', actorName, description: 'Patient photos requested.' },
    );
  }, [actorName, runAction, userId]);

  const sendToDoctorReview = useCallback(() => {
    void runAction(
      (current) => leadDetailService.sendToDoctorReview(current, actorName, userId),
      { title: 'Sent For Doctor Review', actorName, description: 'Lead sent for doctor review.' },
    );
  }, [actorName, runAction, userId]);

  const sendConsultationInvite = useCallback(() => {
    void runAction(
      (current) => leadDetailService.sendConsultationInvite(current, userId),
      {
        title: 'Consultation Invite Sent',
        actorName,
        description: 'WhatsApp priority consultation invitation dispatched via system.',
      },
    );
  }, [actorName, runAction, userId]);

  const markConsultationReady = useCallback(() => {
    void runAction(
      (current) => leadDetailService.markConsultationReady(current, actorName, userId),
      {
        title: 'Consultation Ready Marked',
        actorName,
        description: 'Lead marked ready for consultation.',
      },
    );
  }, [actorName, runAction, userId]);

  const markLostLead = useCallback(
    (reason: LostLeadReason) => {
      void runAction((current) =>
        leadDetailService.markLostLead(current, actorName, userId, reason),
        { title: 'Lead Marked Lost', actorName, description: 'Lead marked as lost.' },
      ).then(() => setShowLostModal(false));
    },
    [actorName, runAction, userId],
  );

  const addNote = useCallback(
    (content: string) => {
      void runAction((current) =>
        leadDetailService.addNote(current, { content, authorName: actorName }, userId),
      ).then(() => setShowAddNote(false));
    },
    [actorName, runAction, userId],
  );

  const addStaffNote = useCallback(
    async (content: string) => {
      if (!detail || !content.trim()) {
        return;
      }

      setIsActionLoading(true);
      setError(null);
      try {
        const updated = await leadDetailService.addStaffNote(detail, content, userId);
        setDetail(updated);
      } catch (saveError) {
        setError(getErrorMessage(saveError, 'Unable to save staff note.'));
      } finally {
        setIsActionLoading(false);
      }
    },
    [detail, userId],
  );

  const updateAiContext = useCallback(
    async (content: string) => {
      if (!detail) {
        return;
      }

      setIsActionLoading(true);
      setError(null);
      try {
        const updated = await leadDetailService.updateAiContext(detail, content);
        setDetail(updated);
      } catch (saveError) {
        setError(getErrorMessage(saveError, 'Unable to update AI context.'));
      } finally {
        setIsActionLoading(false);
      }
    },
    [detail],
  );

  const updateNote = useCallback(
    (noteId: string, content: string) => {
      void runAction((current) =>
        leadDetailService.updateNote(current, { noteId, content }),
      );
    },
    [runAction],
  );

  const deleteNote = useCallback(
    (noteId: string) => {
      void runAction((current) => leadDetailService.deleteNote(current, noteId));
    },
    [runAction],
  );

  const updatePatientInfo = useCallback(
    (patientInfo: PatientInformation) => {
      void runAction((current) =>
        leadDetailService.updatePatientInfo(current, patientInfo),
      );
    },
    [runAction],
  );

  const generateAiSummary = useCallback(async () => {
    if (!detail) {
      return;
    }

    setIsGeneratingSummary(true);
    setSummaryError(null);

    try {
      await leadDetailService.requestAiSummary(detail);
      setIsSummaryPending(true);
    } catch (requestError) {
      setSummaryError(getErrorMessage(requestError, 'Could not request AI summary.'));
    } finally {
      setIsGeneratingSummary(false);
    }
  }, [detail]);

  const refreshChat = useCallback(async () => {
    if (!detail) {
      return;
    }

    try {
      const messages = await leadDetailService.fetchChatHistory(
        detail.clinicId,
        detail.patient.phone,
      );
      setChatMessages(messages);
    } catch (loadError) {
      setChatError(getErrorMessage(loadError, 'Could not load chat history.'));
    }
  }, [detail]);

  const openChat = useCallback(async () => {
    if (!detail) {
      return;
    }

    setShowChat(true);
    setIsChatLoading(true);
    setChatError(null);
    setChatMessages([]);

    try {
      const messages = await leadDetailService.fetchChatHistory(
        detail.clinicId,
        detail.patient.phone,
      );
      setChatMessages(messages);
    } catch (loadError) {
      setChatError(getErrorMessage(loadError, 'Could not load chat history.'));
    } finally {
      setIsChatLoading(false);
    }
  }, [detail]);

  const closeChat = useCallback(() => {
    setShowChat(false);
  }, []);

  useSupabaseRealtime(
    showChat && detail ? `lead-chat-${detail.id}` : null,
    [{ table: 'preet_n8n_chat_histories' }],
    () => {
      void refreshChat();
    },
    Boolean(showChat && detail),
  );

  return {
    detail,
    isLoading,
    error,
    isActionLoading,
    showLostModal,
    showAddNote,
    isGeneratingSummary,
    isSummaryPending,
    summaryError,
    showChat,
    chatMessages,
    isChatLoading,
    chatError,
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
    addStaffNote,
    updateAiContext,
    updateNote,
    deleteNote,
    updatePatientInfo,
    generateAiSummary,
    openChat,
    closeChat,
    reload: loadDetail,
  };
}
