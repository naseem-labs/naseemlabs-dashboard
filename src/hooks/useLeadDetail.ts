import { useCallback, useEffect, useMemo, useState } from 'react';
import type { DashboardUser } from '../types/dashboard';
import type {
  LeadChatMessage,
  LeadDetailData,
  LostLeadReason,
  PatientInformation,
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
    async (action: (current: LeadDetailData) => Promise<LeadDetailData>) => {
      if (!detail) {
        return;
      }

      setIsActionLoading(true);
      try {
        const updated = await action(detail);
        setDetail(updated);
      } catch {
        setError('Action failed. Please try again.');
      } finally {
        setIsActionLoading(false);
      }
    },
    [detail],
  );

  const startFollowUp = useCallback(() => {
    void runAction((current) => leadDetailService.startFollowUp(current, actorName, userId));
  }, [actorName, runAction, userId]);

  const pauseFollowUp = useCallback(() => {
    void runAction((current) => leadDetailService.pauseFollowUp(current, actorName, userId));
  }, [actorName, runAction, userId]);

  const requestPhotos = useCallback(() => {
    void runAction((current) => leadDetailService.requestPhotos(current, actorName, userId));
  }, [actorName, runAction, userId]);

  const sendToDoctorReview = useCallback(() => {
    void runAction((current) => leadDetailService.sendToDoctorReview(current, actorName, userId));
  }, [actorName, runAction, userId]);

  const markConsultationReady = useCallback(() => {
    void runAction((current) => leadDetailService.markConsultationReady(current, actorName, userId));
  }, [actorName, runAction, userId]);

  const markLostLead = useCallback(
    (reason: LostLeadReason) => {
      void runAction((current) =>
        leadDetailService.markLostLead(current, actorName, userId, reason),
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
    markConsultationReady,
    markLostLead,
    addNote,
    updateNote,
    deleteNote,
    updatePatientInfo,
    generateAiSummary,
    openChat,
    closeChat,
    reload: loadDetail,
  };
}
