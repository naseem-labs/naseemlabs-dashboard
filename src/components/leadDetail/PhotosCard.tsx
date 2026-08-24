import { useState } from 'react';
import type { LeadPhoto } from '../../types/leadDetail';
import { LeadPhotoGrid } from '../common/LeadPhotoGrid';
import { LeadDetailCard } from './LeadDetailCard';

interface PhotosCardProps {
  photos: LeadPhoto[];
}

export function PhotosCard({ photos }: PhotosCardProps) {
  const photoCount = photos.filter((photo) => photo.storageUrl).length;
  const [isOpen, setIsOpen] = useState(true);

  return (
    <LeadDetailCard
      title="Photos"
      action={
        photoCount > 0 ? (
          <button
            type="button"
            onClick={() => setIsOpen((value) => !value)}
            className="inline-flex items-center text-xs font-medium text-slate-500"
          >
            {isOpen ? (
              'Hide Photos'
            ) : (
              <>
                <span>
                  {photoCount} photo{photoCount === 1 ? '' : 's'}
                </span>
                <span className="mx-2 text-slate-300">•</span>
                <span className="font-semibold text-purple-600 hover:text-purple-700 underline underline-offset-2">
                  View Photos
                </span>
              </>
            )}
          </button>
        ) : null
      }
    >
      {isOpen ? <LeadPhotoGrid photos={photos} /> : null}
    </LeadDetailCard>
  );
}
