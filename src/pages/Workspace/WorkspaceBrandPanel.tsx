import { memo } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Shield, Zap } from 'lucide-react';
import './WorkspaceBrandPanel.css';

const FEATURES = [
  {
    icon: Shield,
    title: 'Secure & Private',
    description: 'Your data is encrypted and always protected.',
  },
  {
    icon: MessageCircle,
    title: 'Built for Clinics',
    description: 'Designed specifically for hair transplant clinics.',
  },
  {
    icon: Zap,
    title: 'Get Started Fast',
    description: "One-time setup and you're ready to go.",
  },
] as const;

function WorkspaceBrandPanelComponent() {
  return (
    <motion.div
      className="workspace-brand"
      initial={{ opacity: 0, x: -24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="workspace-brand__logo">
        <span className="workspace-brand__logo-mark" aria-hidden="true">
          N
        </span>
        <div className="workspace-brand__logo-text">
          <span className="workspace-brand__logo-name">NaseemLabs</span>
          <span className="workspace-brand__logo-tag">Patient Inquiry System</span>
        </div>
      </div>

      <div className="workspace-brand__intro">
        <h2 className="workspace-brand__heading">Let&apos;s get your clinic ready</h2>
        <p className="workspace-brand__description">
          Enter your clinic details and select your role to start managing patient inquiries
          efficiently.
        </p>
      </div>

      <ul className="workspace-brand__features">
        {FEATURES.map(({ icon: Icon, title, description }) => (
          <li key={title} className="workspace-brand__feature">
            <span className="workspace-brand__feature-icon" aria-hidden="true">
              <Icon size={20} strokeWidth={2} />
            </span>
            <span className="workspace-brand__feature-content">
              <span className="workspace-brand__feature-title">{title}</span>
              <span className="workspace-brand__feature-description">{description}</span>
            </span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

export const WorkspaceBrandPanel = memo(WorkspaceBrandPanelComponent);
