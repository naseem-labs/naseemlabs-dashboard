import { memo } from 'react';
import { ArrowRight } from 'lucide-react';
import './DoctorReviewContinue.css';

interface DoctorReviewContinueProps {
  isSubmitting: boolean;
  onContinue: () => void;
}

function DoctorReviewContinueComponent({ isSubmitting, onContinue }: DoctorReviewContinueProps) {
  return (
    <div className="doctor-review-continue">
      <button
        type="button"
        className="doctor-review-continue__button"
        disabled={isSubmitting}
        onClick={onContinue}
      >
        <span>Continue as Doctor Review</span>
        <ArrowRight size={18} aria-hidden="true" />
      </button>
    </div>
  );
}

export const DoctorReviewContinue = memo(DoctorReviewContinueComponent);
