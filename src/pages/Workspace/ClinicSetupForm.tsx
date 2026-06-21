import { memo } from 'react';
import { Building2, MapPin, MessageCircle } from 'lucide-react';
import type { ClinicSetupForm as ClinicSetupFormValues } from '../../types/workspace';
import './ClinicSetupForm.css';

interface ClinicSetupFormProps {
  form: ClinicSetupFormValues;
  fieldErrors: Partial<Record<keyof ClinicSetupFormValues, string>>;
  isReadOnly: boolean;
  onFieldChange: (field: keyof ClinicSetupFormValues, value: string) => void;
}

function ClinicSetupFormComponent({
  form,
  fieldErrors,
  isReadOnly,
  onFieldChange,
}: ClinicSetupFormProps) {
  return (
    <div className="clinic-setup-form">
      <div className="clinic-setup-form__field">
        <label className="clinic-setup-form__label" htmlFor="clinic-name">
          Clinic Name
        </label>
        <div className="clinic-setup-form__input-wrap">
          <Building2 size={18} className="clinic-setup-form__input-icon" aria-hidden="true" />
          <input
            id="clinic-name"
            type="text"
            value={form.clinicName}
            readOnly={isReadOnly}
            onChange={(event) => onFieldChange('clinicName', event.target.value)}
            placeholder="Enter your clinic name"
            className={`clinic-setup-form__input ${
              fieldErrors.clinicName ? 'clinic-setup-form__input--error' : ''
            }`}
          />
        </div>
        {fieldErrors.clinicName ? (
          <p className="clinic-setup-form__error">{fieldErrors.clinicName}</p>
        ) : null}
      </div>

      <div className="clinic-setup-form__field">
        <label className="clinic-setup-form__label" htmlFor="clinic-whatsapp">
          Clinic WhatsApp Number
        </label>
        <div className="clinic-setup-form__input-wrap">
          <MessageCircle
            size={18}
            className="clinic-setup-form__input-icon clinic-setup-form__input-icon--whatsapp"
            aria-hidden="true"
          />
          <input
            id="clinic-whatsapp"
            type="tel"
            value={form.clinicWhatsappNumber}
            readOnly={isReadOnly}
            onChange={(event) => onFieldChange('clinicWhatsappNumber', event.target.value)}
            placeholder="Enter clinic WhatsApp number"
            className={`clinic-setup-form__input ${
              fieldErrors.clinicWhatsappNumber ? 'clinic-setup-form__input--error' : ''
            }`}
          />
        </div>
        {fieldErrors.clinicWhatsappNumber ? (
          <p className="clinic-setup-form__error">{fieldErrors.clinicWhatsappNumber}</p>
        ) : null}
      </div>

      <div className="clinic-setup-form__field">
        <label className="clinic-setup-form__label" htmlFor="clinic-location">
          Clinic Location
        </label>
        <div className="clinic-setup-form__input-wrap">
          <MapPin size={18} className="clinic-setup-form__input-icon" aria-hidden="true" />
          <input
            id="clinic-location"
            type="text"
            value={form.clinicLocation}
            readOnly={isReadOnly}
            onChange={(event) => onFieldChange('clinicLocation', event.target.value)}
            placeholder="Enter your clinic location"
            className={`clinic-setup-form__input ${
              fieldErrors.clinicLocation ? 'clinic-setup-form__input--error' : ''
            }`}
          />
        </div>
        {fieldErrors.clinicLocation ? (
          <p className="clinic-setup-form__error">{fieldErrors.clinicLocation}</p>
        ) : null}
      </div>
    </div>
  );
}

export const ClinicSetupForm = memo(ClinicSetupFormComponent);
