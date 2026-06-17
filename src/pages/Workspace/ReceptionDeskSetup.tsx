import { memo } from 'react';
import { ArrowRight, Building2, MapPin, MessageCircle } from 'lucide-react';
import type { ClinicSetupForm } from '../../types/workspace';
import './ReceptionDeskSetup.css';

interface ReceptionDeskSetupProps {
  form: ClinicSetupForm;
  fieldErrors: Partial<Record<keyof ClinicSetupForm, string>>;
  isReadOnly: boolean;
  isSubmitting: boolean;
  onFieldChange: (field: keyof ClinicSetupForm, value: string) => void;
  onContinue: () => void;
}

function ReceptionDeskSetupComponent({
  form,
  fieldErrors,
  isReadOnly,
  isSubmitting,
  onFieldChange,
  onContinue,
}: ReceptionDeskSetupProps) {
  return (
    <div className="reception-setup">
      <div className="reception-setup__field">
        <label className="reception-setup__label" htmlFor="clinic-name">
          Clinic Name
        </label>
        <div className="reception-setup__input-wrap">
          <Building2 size={18} className="reception-setup__input-icon" aria-hidden="true" />
          <input
            id="clinic-name"
            type="text"
            value={form.clinicName}
            readOnly={isReadOnly}
            onChange={(event) => onFieldChange('clinicName', event.target.value)}
            placeholder="Naseem Labs Hair Transplant Clinic"
            className={`reception-setup__input ${fieldErrors.clinicName ? 'reception-setup__input--error' : ''}`}
          />
        </div>
        {fieldErrors.clinicName ? (
          <p className="reception-setup__error">{fieldErrors.clinicName}</p>
        ) : null}
      </div>

      <div className="reception-setup__field">
        <label className="reception-setup__label" htmlFor="clinic-whatsapp">
          Clinic WhatsApp Number
        </label>
        <div className="reception-setup__input-wrap">
          <MessageCircle size={18} className="reception-setup__input-icon" aria-hidden="true" />
          <input
            id="clinic-whatsapp"
            type="tel"
            value={form.clinicWhatsappNumber}
            readOnly={isReadOnly}
            onChange={(event) => onFieldChange('clinicWhatsappNumber', event.target.value)}
            placeholder="+91 98765 43210"
            className={`reception-setup__input ${fieldErrors.clinicWhatsappNumber ? 'reception-setup__input--error' : ''}`}
          />
        </div>
        {fieldErrors.clinicWhatsappNumber ? (
          <p className="reception-setup__error">{fieldErrors.clinicWhatsappNumber}</p>
        ) : null}
      </div>

      <div className="reception-setup__field">
        <label className="reception-setup__label" htmlFor="clinic-location">
          Location
        </label>
        <div className="reception-setup__input-wrap">
          <MapPin size={18} className="reception-setup__input-icon" aria-hidden="true" />
          <input
            id="clinic-location"
            type="text"
            value={form.clinicLocation}
            readOnly={isReadOnly}
            onChange={(event) => onFieldChange('clinicLocation', event.target.value)}
            placeholder="Model Town, Ludhiana, Punjab"
            className={`reception-setup__input ${fieldErrors.clinicLocation ? 'reception-setup__input--error' : ''}`}
          />
        </div>
        {fieldErrors.clinicLocation ? (
          <p className="reception-setup__error">{fieldErrors.clinicLocation}</p>
        ) : null}
      </div>

      <button
        type="button"
        className="reception-setup__continue"
        disabled={isSubmitting}
        onClick={onContinue}
      >
        <span>Continue as Reception Desk</span>
        <ArrowRight size={18} aria-hidden="true" />
      </button>
    </div>
  );
}

export const ReceptionDeskSetup = memo(ReceptionDeskSetupComponent);
