import { memo } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Building2, Lock, Stethoscope, UserRound } from 'lucide-react';
import { GlassPageShell } from '../../components/common';
import { ClinicSetupForm } from './ClinicSetupForm';
import { RoleOptionCard } from './RoleOptionCard';
import { WorkspaceBrandPanel } from './WorkspaceBrandPanel';
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
      <div className="workspace-page__wrapper">
        <div className="workspace-page__layout">
          <WorkspaceBrandPanel />

          <motion.section
            className="workspace-page__card glass-card"
            initial={{ opacity: 0, y: 28, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, ease: CARD_EASE }}
            aria-labelledby="workspace-title"
          >
            <div className="workspace-page__icon" aria-hidden="true">
              <Building2 size={30} strokeWidth={2} />
            </div>

            <header className="workspace-page__header">
              <h1 id="workspace-title" className="workspace-page__title">
                Clinic Setup
              </h1>
              <p className="workspace-page__subtitle">
                Enter your clinic information to continue
              </p>
            </header>

            <div className="workspace-page__divider" role="presentation" />

            {isLoading ? (
              <p className="workspace-page__loading">Loading your clinic workspace...</p>
            ) : (
              <div className="workspace-page__form">
                {error ? (
                  <div className="workspace-page__error" role="alert">
                    {error}
                  </div>
                ) : null}

                <ClinicSetupForm
                  form={form}
                  fieldErrors={fieldErrors}
                  isReadOnly={isReadOnly}
                  onFieldChange={updateField}
                />

                <div className="workspace-page__roles">
                  <span className="workspace-page__roles-label">Your Role</span>
                  <div
                    className="workspace-page__roles-grid"
                    role="list"
                    aria-label="Workspace roles"
                  >
                    <div role="listitem">
                      <RoleOptionCard
                        title="Receptionist"
                        description="Manage inquiries, follow-ups and patient communication"
                        icon={UserRound}
                        accent="purple"
                        isSelected={selectedWorkspace === 'reception'}
                        onSelect={() => setSelectedWorkspace('reception')}
                      />
                    </div>
                    <div role="listitem">
                      <RoleOptionCard
                        title="Doctor"
                        description="Review inquiries, provide recommendations and notes"
                        icon={Stethoscope}
                        accent="green"
                        isSelected={selectedWorkspace === 'doctor'}
                        onSelect={() => setSelectedWorkspace('doctor')}
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  className="workspace-page__continue"
                  disabled={isSubmitting}
                  onClick={() => void continueToWorkspace(selectedWorkspace)}
                >
                  <span>{isSubmitting ? 'Please wait...' : 'Continue'}</span>
                  <ArrowRight size={18} aria-hidden="true" />
                </button>
              </div>
            )}
          </motion.section>
        </div>

        <footer className="workspace-page__footer">
          <Lock size={15} aria-hidden="true" />
          <span>Your data is secure and protected</span>
        </footer>
      </div>
    </GlassPageShell>
  );
}

export const WorkspacePage = memo(WorkspacePageComponent);
