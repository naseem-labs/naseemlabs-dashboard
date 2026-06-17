import { memo } from 'react';
import { motion } from 'framer-motion';
import { Lock, Stethoscope, UserRound } from 'lucide-react';
import { GlassPageShell, SecureBadge } from '../../components/common';
import { DoctorReviewContinue } from './DoctorReviewContinue';
import { ReceptionDeskSetup } from './ReceptionDeskSetup';
import { WorkspaceOptionCard } from './WorkspaceOptionCard';
import { useWorkspacePage } from './useWorkspacePage';
import './WorkspacePage.css';

const CARD_EASE = [0.22, 1, 0.36, 1] as const;

function WorkspacePageComponent() {
  const {
    selectedWorkspace,
    setSelectedWorkspace,
    form,
    updateField,
    fieldErrors,
    isLoading,
    isSubmitting,
    isReadOnly,
    error,
    continueToWorkspace,
  } = useWorkspacePage();

  return (
    <GlassPageShell>
      <motion.section
        className="workspace-page__card glass-card"
        initial={{ opacity: 0, y: 28, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: CARD_EASE }}
        aria-labelledby="workspace-title"
      >
        <div className="workspace-page__badge">
          <SecureBadge />
        </div>

        <header className="workspace-page__header">
          <h1 id="workspace-title" className="workspace-page__title">
            Choose Your Workspace
          </h1>
          <p className="workspace-page__subtitle">Select how you want to continue</p>
        </header>

        {isLoading ? (
          <p className="workspace-page__loading">Loading your clinic workspace...</p>
        ) : (
          <>
            {error ? (
              <div className="workspace-page__error" role="alert">
                {error}
              </div>
            ) : null}

            <div className="workspace-page__options" role="list" aria-label="Workspace options">
              <div role="listitem">
                <WorkspaceOptionCard
                  title="Reception Desk"
                  description="Manage leads, follow ups and patient conversations"
                  icon={UserRound}
                  accent="purple"
                  isSelected={selectedWorkspace === 'reception'}
                  isExpanded={selectedWorkspace === 'reception'}
                  onSelect={() => setSelectedWorkspace('reception')}
                >
                  <ReceptionDeskSetup
                    form={form}
                    fieldErrors={fieldErrors}
                    isReadOnly={isReadOnly}
                    isSubmitting={isSubmitting}
                    onFieldChange={updateField}
                    onContinue={() => void continueToWorkspace('reception')}
                  />
                </WorkspaceOptionCard>
              </div>

              <div role="listitem">
                <WorkspaceOptionCard
                  title="Doctor Review"
                  description="Review patient summaries, information and give your opinion"
                  icon={Stethoscope}
                  accent="green"
                  isSelected={selectedWorkspace === 'doctor'}
                  isExpanded={selectedWorkspace === 'doctor'}
                  onSelect={() => setSelectedWorkspace('doctor')}
                >
                  <DoctorReviewContinue
                    isSubmitting={isSubmitting}
                    onContinue={() => void continueToWorkspace('doctor')}
                  />
                </WorkspaceOptionCard>
              </div>
            </div>
          </>
        )}

        <footer className="workspace-page__footer">
          <Lock size={15} aria-hidden="true" />
          <span>Your activity is secure and private</span>
        </footer>
      </motion.section>
    </GlassPageShell>
  );
}

export const WorkspacePage = memo(WorkspacePageComponent);
