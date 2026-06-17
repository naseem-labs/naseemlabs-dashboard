import { Camera, ImageIcon } from 'lucide-react';
import type { LeadPhoto } from '../../types/leadDetail';
import { PHOTO_STATUS_CONFIG } from '../../constants/leadDetail';
import { LeadDetailCard } from './LeadDetailCard';

interface PhotosCardProps {
  photos: LeadPhoto[];
}

export function PhotosCard({ photos }: PhotosCardProps) {
  const receivedCount = photos.filter((photo) => photo.status === 'received').length;

  return (
    <LeadDetailCard
      title="Photos"
      action={
        <span className="text-xs font-medium text-slate-500">
          {receivedCount}/{photos.length} received
        </span>
      }
    >
      <div className="grid grid-cols-2 gap-3">
        {photos.map((photo) => {
          const statusConfig = PHOTO_STATUS_CONFIG[photo.status];

          return (
            <div
              key={photo.id}
              className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50"
            >
              <div className="flex aspect-[4/3] items-center justify-center bg-slate-100">
                {photo.storageUrl ? (
                  <img
                    src={photo.storageUrl}
                    alt={photo.label}
                    className="h-full w-full object-cover"
                  />
                ) : photo.status === 'received' ? (
                  <ImageIcon size={28} className="text-slate-400" />
                ) : (
                  <Camera size={24} className="text-slate-300" />
                )}
              </div>
              <div className="flex items-center justify-between gap-2 p-2.5">
                <p className="text-xs font-semibold text-navy">{photo.label}</p>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${statusConfig.className}`}
                >
                  {statusConfig.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </LeadDetailCard>
  );
}
