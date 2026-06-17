import { Check, ImageIcon, X } from 'lucide-react';
import type { PhotoType } from '../../types/addLead';
import { PHOTO_TYPE_OPTIONS } from '../../constants/addLead';
import { FormSectionCard } from './FormSectionCard';

interface PhotosAvailableSectionProps {
  photosAvailable: boolean | null;
  photoTypes: PhotoType[];
  onPhotosAvailableChange: (value: boolean) => void;
  onPhotoTypesChange: (value: PhotoType[]) => void;
}

export function PhotosAvailableSection({
  photosAvailable,
  photoTypes,
  onPhotosAvailableChange,
  onPhotoTypesChange,
}: PhotosAvailableSectionProps) {
  const togglePhotoType = (type: PhotoType) => {
    if (photoTypes.includes(type)) {
      onPhotoTypesChange(photoTypes.filter((item) => item !== type));
      return;
    }

    onPhotoTypesChange([...photoTypes, type]);
  };

  return (
    <FormSectionCard title="3. Photos Available?" icon={ImageIcon} optional>
      <p className="mb-4 text-sm text-slate-600">Do we have photos from the patient?</p>

      <div className="grid grid-cols-2 gap-3 sm:max-w-md">
        <button
          type="button"
          onClick={() => onPhotosAvailableChange(true)}
          className={`inline-flex items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
            photosAvailable === true
              ? 'border-green-500 bg-green-50 text-green-700'
              : 'border-slate-200 bg-white text-slate-600 hover:border-green-200'
          }`}
        >
          <Check size={16} />
          Yes
        </button>

        <button
          type="button"
          onClick={() => {
            onPhotosAvailableChange(false);
            onPhotoTypesChange([]);
          }}
          className={`inline-flex items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
            photosAvailable === false
              ? 'border-red-400 bg-red-50 text-red-600'
              : 'border-slate-200 bg-white text-slate-600 hover:border-red-200'
          }`}
        >
          <X size={16} />
          No
        </button>
      </div>

      {photosAvailable ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {PHOTO_TYPE_OPTIONS.map((option) => {
            const isSelected = photoTypes.includes(option.value);

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => togglePhotoType(option.value)}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition ${
                  isSelected
                    ? 'border-green-300 bg-green-50 text-green-700'
                    : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'
                }`}
              >
                {isSelected ? <Check size={14} /> : <X size={14} className="text-slate-300" />}
                {option.label}
              </button>
            );
          })}
        </div>
      ) : null}
    </FormSectionCard>
  );
}
