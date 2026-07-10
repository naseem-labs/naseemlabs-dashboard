import { Camera, ImageIcon } from 'lucide-react';
import { useState } from 'react';
import type { LeadPhoto } from '../../types/leadDetail';
import { PHOTO_STATUS_CONFIG } from '../../constants/leadDetail';
import { LeadDetailCard } from './LeadDetailCard';

interface PhotosCardProps {
  photos: LeadPhoto[];
}

export function PhotosCard({ photos }: PhotosCardProps) {
  const receivedCount = photos.filter((photo) => photo.status === 'received').length;
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <LeadDetailCard
        title="Photos"
        action={
          <button
            type="button"
            onClick={() => setIsOpen((v) => !v)}
            className="inline-flex items-center text-xs font-medium text-slate-500"
          >
            {isOpen ? (
              'Hide Photos'
            ) : (
              <>
                <span>{receivedCount}/{photos.length} received</span>
                <span className="mx-2 text-slate-300">•</span>
                <span className="font-semibold text-purple-600 hover:text-purple-700 underline underline-offset-2">
                  View Photos
                </span>
              </>
            )}
          </button>
        }
      >
        {isOpen ? (
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {photos.map((photo) => {
              const statusConfig = PHOTO_STATUS_CONFIG[photo.status];

              return (
                <div
                  key={photo.id}
                  className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50"
                >
                  <div className="flex aspect-[16/10] min-h-[160px] items-center justify-center bg-slate-100 sm:aspect-[4/3] sm:min-h-0">
                    {photo.storageUrl ? (
                      <img
                        src={photo.storageUrl}
                        alt={photo.label}
                        onClick={() => setSelectedImage(photo.storageUrl!)}
                        className="h-full w-full cursor-pointer object-cover transition-opacity hover:opacity-90"
                      />
                    ) : photo.status === 'received' ? (
                      <ImageIcon size={28} className="text-slate-400" />
                    ) : (
                      <Camera size={24} className="text-slate-300" />
                    )}
                  </div>
                  <div className="p-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-navy">{photo.label}</p>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${statusConfig.className}`}
                      >
                        {statusConfig.label}
                      </span>
                    </div>
                    {photo.uploadedAt ? (
                      <p className="mt-1 text-xs text-slate-500">
                        Received {new Intl.DateTimeFormat('en-GB', {
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
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        ) : null}
      </LeadDetailCard>
      {selectedImage ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            alt="Patient photo"
            className="max-h-[90vh] max-w-[90vw] rounded-xl object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      ) : null}
    </>
  );
}
