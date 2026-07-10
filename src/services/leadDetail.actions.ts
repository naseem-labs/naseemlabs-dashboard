import type { LeadStage } from '../types/dashboard';
import type { LeadDetailData, LeadDetailStage } from '../types/leadDetail';
import { LEAD_DETAIL_STAGE_CONFIG } from '../constants/leadDetail';
import { leads, kpiStatsMutable } from '../data/mockDashboardData';

const DETAIL_TO_DASHBOARD_STAGE: Record<LeadDetailStage, LeadStage> = {
  new_lead: 'new_lead',
  follow_up_active: 'follow_up',
  waiting_for_photos: 'information_collected',
  doctor_review_requested: 'doctor_review',
  consultation_ready: 'consultation_ready',
  lost_lead: 'new_lead',
};

const STAGE_KPI_FILTER: Record<LeadStage, string | null> = {
  new_lead: 'kpi-new-leads',
  follow_up: 'kpi-follow-up',
  information_collected: 'kpi-follow-up',
  photos_received: 'kpi-follow-up',
  consultation_ready: 'kpi-consultation',
  doctor_review: 'kpi-doctor-review',
};

function formatShortDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function createTimelineId(): string {
  return `timeline-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function prependTimeline(
  detail: LeadDetailData,
  title: string,
  options?: { description?: string; actorName?: string },
): LeadDetailData {
  const event = {
    id: createTimelineId(),
    title,
    description: options?.description,
    actorName: options?.actorName,
    createdAt: new Date().toISOString(),
  };

  return {
    ...detail,
    timeline: [event, ...detail.timeline],
  };
}

function applyStage(
  detail: LeadDetailData,
  stage: LeadDetailStage,
  metricsPatch?: Partial<LeadDetailData['metrics']>,
): LeadDetailData {
  const config = LEAD_DETAIL_STAGE_CONFIG[stage];

  return {
    ...detail,
    stage,
    stageLabel: config.label,
    metrics: {
      ...detail.metrics,
      currentStage: {
        label: 'Current Stage',
        value: config.label,
        subValue: `Since ${formatShortDate(new Date().toISOString())}`,
        variant:
          stage === 'lost_lead'
            ? 'red'
            : stage === 'follow_up_active'
              ? 'orange'
              : stage === 'consultation_ready'
                ? 'green'
                : stage === 'doctor_review_requested'
                  ? 'blue'
                  : 'purple',
      },
      ...metricsPatch,
    },
  };
}

export function syncDashboardFromLeadDetail(
  leadId: string,
  previousStage: LeadDetailStage,
  nextStage: LeadDetailStage,
): void {
  const lead = leads.find((item) => item.id === leadId);
  if (!lead) {
    return;
  }

  const previousDashboardStage = DETAIL_TO_DASHBOARD_STAGE[previousStage];
  const nextDashboardStage = DETAIL_TO_DASHBOARD_STAGE[nextStage];

  if (previousDashboardStage !== nextDashboardStage) {
    const previousKpi = STAGE_KPI_FILTER[previousDashboardStage];
    const nextKpi = STAGE_KPI_FILTER[nextDashboardStage];

    if (previousKpi) {
      const stat = kpiStatsMutable.find((item) => item.id === previousKpi);
      if (stat && stat.count > 0) {
        stat.count -= 1;
      }
    }

    if (nextKpi) {
      const stat = kpiStatsMutable.find((item) => item.id === nextKpi);
      if (stat) {
        stat.count += 1;
      }
    }

    lead.stage = nextDashboardStage;
    lead.updated_at = new Date().toISOString();
  }
}

export const leadDetailActions = {
  startFollowUp(detail: LeadDetailData, actorName: string): LeadDetailData {
    const previousStage = detail.stage;
    let updated = applyStage(detail, 'follow_up_active', {
      nextAction: {
        label: 'Next Follow Up',
        value: 'Tomorrow, 11:00 AM',
        subValue: 'Auto Reminder',
        variant: 'orange',
      },
    });

    updated = {
      ...updated,
      followUpActive: true,
    };

    updated = prependTimeline(updated, 'Follow Up Started', {
      actorName,
      description: `By ${actorName}`,
    });

    syncDashboardFromLeadDetail(detail.id, previousStage, 'follow_up_active');
    return updated;
  },

  pauseFollowUp(detail: LeadDetailData, actorName: string): LeadDetailData {
    const previousStage = detail.stage;
    let updated = applyStage(detail, 'new_lead', {
      nextAction: {
        label: 'Next Action',
        value: 'Start Follow Up',
        variant: 'orange',
      },
    });

    updated = {
      ...updated,
      followUpActive: false,
    };

    updated = prependTimeline(updated, 'Follow Up Paused', { actorName });

    syncDashboardFromLeadDetail(detail.id, previousStage, 'new_lead');
    return updated;
  },

  requestPhotos(detail: LeadDetailData, actorName: string): LeadDetailData {
    const previousStage = detail.stage;
    let updated = applyStage(detail, 'waiting_for_photos', {
      nextAction: {
        label: 'Next Follow Up',
        value: 'In 2 Days',
        subValue: 'Photo reminder scheduled',
        variant: 'orange',
      },
    });

    updated = {
      ...updated,
      photos: updated.photos.map((photo) =>
        photo.status === 'missing' ? { ...photo, status: 'requested' as const } : photo,
      ),
      guideItems: [
        { id: 'guide-rp-1', text: 'Confirm patient received photo request' },
        { id: 'guide-rp-2', text: 'Prioritize donor area and crown view photos' },
        { id: 'guide-rp-3', text: 'Send gentle reminder if no response in 48 hours' },
        { id: 'guide-rp-4', text: 'Best follow-up time: After 6 PM' },
      ],
    };

    updated = prependTimeline(updated, 'Photos Requested', { actorName });
    syncDashboardFromLeadDetail(detail.id, previousStage, 'waiting_for_photos');
    return updated;
  },

  sendToDoctorReview(detail: LeadDetailData, actorName: string): LeadDetailData {
    const previousStage = detail.stage;
    let updated = applyStage(detail, 'doctor_review_requested', {
      doctorReview: {
        label: 'Doctor Review',
        value: 'Requested',
        variant: 'blue',
      },
      nextAction: {
        label: 'Next Action',
        value: 'Doctor will review',
        variant: 'blue',
      },
    });

    updated = {
      ...updated,
      doctorReviewStatus: 'Requested',
      guideItems: [
        { id: 'guide-dr-1', text: 'Inform patient that doctor is reviewing their case' },
        { id: 'guide-dr-2', text: 'Do not share pricing until doctor review is complete' },
        { id: 'guide-dr-3', text: 'Expected review time: 24-48 hours' },
      ],
    };

    updated = prependTimeline(updated, 'Sent For Doctor Review', { actorName });
    syncDashboardFromLeadDetail(detail.id, previousStage, 'doctor_review_requested');
    return updated;
  },

  markConsultationReady(detail: LeadDetailData, actorName: string): LeadDetailData {
    const previousStage = detail.stage;
    let updated = applyStage(detail, 'consultation_ready', {
      nextAction: {
        label: 'Next Action',
        value: 'Schedule Consultation',
        variant: 'green',
      },
    });

    updated = {
      ...updated,
      guideItems: [
        { id: 'guide-cr-1', text: 'Offer consultation slots within next 3 days' },
        { id: 'guide-cr-2', text: 'Confirm patient availability for video or in-clinic visit' },
        { id: 'guide-cr-3', text: 'Share pre-consultation checklist' },
      ],
    };

    updated = prependTimeline(updated, 'Consultation Ready Marked', { actorName });
    syncDashboardFromLeadDetail(detail.id, previousStage, 'consultation_ready');
    return updated;
  },

  markLostLead(
    detail: LeadDetailData,
    actorName: string,
    reasonLabel: string,
  ): LeadDetailData {
    const previousStage = detail.stage;
    let updated = applyStage(detail, 'lost_lead', {
      nextAction: {
        label: 'Next Action',
        value: 'Closed',
        variant: 'red',
      },
    });

    updated = {
      ...updated,
      followUpActive: false,
      guideItems: [{ id: 'guide-lost-1', text: 'Lead closed — no further follow-up required' }],
    };

    updated = prependTimeline(updated, 'Lead Marked Lost', {
      actorName,
      description: `Reason: ${reasonLabel}`,
    });

    syncDashboardFromLeadDetail(detail.id, previousStage, 'lost_lead');
    return updated;
  },
};
