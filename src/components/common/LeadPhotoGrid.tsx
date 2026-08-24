import { ImageIcon } from 'lucide-react';
import { useState } from 'react';
import type { LeadPhoto } from '../../types/leadDetail';

interface LeadPhotoGridProps {
  photos: LeadPhoto[];
  compact?: boolean;
}

export function LeadPhotoGrid({ photos, compact = false }: LeadPhotoGridProps) {
  const displayPhotos = photos.filter((photo) => photo.storageUrl);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (displayPhotos.length === 0) {
    return compact ? null : (
      <p className="text-sm text-slate-500">No photos received yet.</p>
    );
  }

  if (compact) {
    return (
      <>
        <div className="flex gap-1.5 overflow-x-auto pb-0.5">
          {displayPhotos.map((photo) => (
            <button
              key={photo.id}
              type="button"
              onClick={() => setSelectedImage(photo.storageUrl!)}
              className="h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-100"
            >
              <img
                src={photo.storageUrl!}
                alt="Patient photo"
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
        {selectedImage ? (
          <PhotoLightbox imageUrl={selectedImage} onClose={() => setSelectedImage(null)} />
        ) : null}
      </>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {displayPhotos.map((photo) => (
          <div
            key={photo.id}
            className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50"
          >
            <div className="flex aspect-[16/10] min-h-[160px] items-center justify-center bg-slate-100 sm:aspect-[4/3] sm:min-h-0">
              {photo.storageUrl ? (
                <img
                  src={photo.storageUrl}
                  alt="Patient photo"
                  onClick={() => setSelectedImage(photo.storageUrl!)}
                  className="h-full w-full cursor-pointer object-cover transition-opacity hover:opacity-90"
                />
              ) : (
                <ImageIcon size={28} className="text-slate-400" />
              )}
            </div>
            {photo.uploadedAt ? (
              <div className="p-2.5">
                <p className="text-xs text-slate-500">
                  Received{' '}
                  {new Intl.DateTimeFormat('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true,
                  })
                    .format(new Date(photo.uploadedAt))
                    .replace(',', ' at')}
                </p>
              </div>
            ) : null}
          </div>
        ))}
      </div>
      {selectedImage ? (
        <PhotoLightbox imageUrl={selectedImage} onClose={() => setSelectedImage(null)} />
      ) : null}
    </>
  );
}

function PhotoLightbox({
  imageUrl,
  onClose,
}: {
  imageUrl: string;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      onClick={onClose}
    >
      <img
        src={imageUrl}
        alt="Patient photo"
        className="max-h-[90vh] max-w-[90vw] rounded-xl object-contain"
        onClick={(event) => event.stopPropagation()}
      />
    </div>
  );
}
