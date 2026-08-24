-- Allow dashboard users to generate signed URLs for private patient photos.
-- Object path format: {clinic_id}/{lead_id}/{filename}
--
-- IMPORTANT: qualify storage.objects.name explicitly. Unqualified "name" inside
-- the leads subquery resolves to leads.name, not the storage object path.

DROP POLICY IF EXISTS clinic_scoped_select_patient_photos ON storage.objects;

CREATE POLICY clinic_scoped_select_patient_photos
ON storage.objects
FOR SELECT
TO anon, authenticated
USING (
  bucket_id = 'patient-photos'
  AND EXISTS (
    SELECT 1
    FROM public.leads l
    WHERE l.clinic_id::text = split_part(storage.objects.name, '/', 1)
      AND l.id::text = split_part(storage.objects.name, '/', 2)
  )
);
