import { ShieldCheck } from 'lucide-react';
import './SecureBadge.css';

interface SecureBadgeProps {
  className?: string;
}

export function SecureBadge({ className = '' }: SecureBadgeProps) {
  return (
    <div className={`secure-badge ${className}`.trim()} aria-label="Secure and encrypted">
      <ShieldCheck size={16} aria-hidden="true" />
      <span>Secure &amp; Encrypted</span>
    </div>
  );
}
