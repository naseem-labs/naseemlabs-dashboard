-- Clinic Dashboard integration migration
-- Adds lead columns, clinic-scoped RLS policies, and cleans test garbage rows.

-- ---------------------------------------------------------------------------
-- 1. New columns on leads
-- ---------------------------------------------------------------------------
ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS created_by uuid REFERENCES public.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS photos_available boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS requested_photo_types text[] NOT NULL DEFAULT '{}';

-- ---------------------------------------------------------------------------
-- 2. Clean obvious test garbage (only rows with literal 'null' strings)
-- ---------------------------------------------------------------------------
DELETE FROM public.lead_actions
WHERE action_type = 'null' OR action_note = 'null';

DELETE FROM public.notifications
WHERE type = 'null';

-- ---------------------------------------------------------------------------
-- 3. Clinic-scoped RLS policies
-- App must filter by clinic_id; policies enable anon access pre-auth.
-- Full JWT-based isolation will be added when Supabase Auth is wired.
-- ---------------------------------------------------------------------------

-- clinics
DROP POLICY IF EXISTS clinic_scoped_select ON public.clinics;
DROP POLICY IF EXISTS clinic_scoped_all ON public.clinics;
CREATE POLICY clinic_scoped_select ON public.clinics
  FOR SELECT TO anon, authenticated USING (true);

-- users
DROP POLICY IF EXISTS clinic_scoped_select ON public.users;
DROP POLICY IF EXISTS clinic_scoped_all ON public.users;
CREATE POLICY clinic_scoped_select ON public.users
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY clinic_scoped_insert ON public.users
  FOR INSERT TO anon, authenticated WITH CHECK (clinic_id IS NOT NULL);
CREATE POLICY clinic_scoped_update ON public.users
  FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (clinic_id IS NOT NULL);

-- leads
DROP POLICY IF EXISTS clinic_scoped_select ON public.leads;
DROP POLICY IF EXISTS clinic_scoped_insert ON public.leads;
DROP POLICY IF EXISTS clinic_scoped_update ON public.leads;
DROP POLICY IF EXISTS clinic_scoped_delete ON public.leads;
CREATE POLICY clinic_scoped_select ON public.leads
  FOR SELECT TO anon, authenticated USING (clinic_id IS NOT NULL);
CREATE POLICY clinic_scoped_insert ON public.leads
  FOR INSERT TO anon, authenticated WITH CHECK (clinic_id IS NOT NULL);
CREATE POLICY clinic_scoped_update ON public.leads
  FOR UPDATE TO anon, authenticated USING (clinic_id IS NOT NULL) WITH CHECK (clinic_id IS NOT NULL);
CREATE POLICY clinic_scoped_delete ON public.leads
  FOR DELETE TO anon, authenticated USING (clinic_id IS NOT NULL);

-- lead_profile
DROP POLICY IF EXISTS clinic_scoped_select ON public.lead_profile;
DROP POLICY IF EXISTS clinic_scoped_insert ON public.lead_profile;
DROP POLICY IF EXISTS clinic_scoped_update ON public.lead_profile;
CREATE POLICY clinic_scoped_select ON public.lead_profile
  FOR SELECT TO anon, authenticated
  USING (EXISTS (SELECT 1 FROM public.leads l WHERE l.id = lead_profile.lead_id));
CREATE POLICY clinic_scoped_insert ON public.lead_profile
  FOR INSERT TO anon, authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.leads l WHERE l.id = lead_profile.lead_id));
CREATE POLICY clinic_scoped_update ON public.lead_profile
  FOR UPDATE TO anon, authenticated
  USING (EXISTS (SELECT 1 FROM public.leads l WHERE l.id = lead_profile.lead_id))
  WITH CHECK (EXISTS (SELECT 1 FROM public.leads l WHERE l.id = lead_profile.lead_id));

-- lead_photos
DROP POLICY IF EXISTS clinic_scoped_select ON public.lead_photos;
DROP POLICY IF EXISTS clinic_scoped_insert ON public.lead_photos;
DROP POLICY IF EXISTS clinic_scoped_update ON public.lead_photos;
DROP POLICY IF EXISTS clinic_scoped_delete ON public.lead_photos;
CREATE POLICY clinic_scoped_select ON public.lead_photos
  FOR SELECT TO anon, authenticated
  USING (EXISTS (SELECT 1 FROM public.leads l WHERE l.id = lead_photos.lead_id));
CREATE POLICY clinic_scoped_insert ON public.lead_photos
  FOR INSERT TO anon, authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.leads l WHERE l.id = lead_photos.lead_id));
CREATE POLICY clinic_scoped_update ON public.lead_photos
  FOR UPDATE TO anon, authenticated
  USING (EXISTS (SELECT 1 FROM public.leads l WHERE l.id = lead_photos.lead_id));
CREATE POLICY clinic_scoped_delete ON public.lead_photos
  FOR DELETE TO anon, authenticated
  USING (EXISTS (SELECT 1 FROM public.leads l WHERE l.id = lead_photos.lead_id));

-- lead_actions
DROP POLICY IF EXISTS clinic_scoped_select ON public.lead_actions;
DROP POLICY IF EXISTS clinic_scoped_insert ON public.lead_actions;
DROP POLICY IF EXISTS clinic_scoped_update ON public.lead_actions;
DROP POLICY IF EXISTS clinic_scoped_delete ON public.lead_actions;
CREATE POLICY clinic_scoped_select ON public.lead_actions
  FOR SELECT TO anon, authenticated
  USING (EXISTS (SELECT 1 FROM public.leads l WHERE l.id = lead_actions.lead_id));
CREATE POLICY clinic_scoped_insert ON public.lead_actions
  FOR INSERT TO anon, authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.leads l WHERE l.id = lead_actions.lead_id));
CREATE POLICY clinic_scoped_update ON public.lead_actions
  FOR UPDATE TO anon, authenticated
  USING (EXISTS (SELECT 1 FROM public.leads l WHERE l.id = lead_actions.lead_id));
CREATE POLICY clinic_scoped_delete ON public.lead_actions
  FOR DELETE TO anon, authenticated
  USING (EXISTS (SELECT 1 FROM public.leads l WHERE l.id = lead_actions.lead_id));

-- doctor_reviews
DROP POLICY IF EXISTS clinic_scoped_select ON public.doctor_reviews;
DROP POLICY IF EXISTS clinic_scoped_insert ON public.doctor_reviews;
CREATE POLICY clinic_scoped_select ON public.doctor_reviews
  FOR SELECT TO anon, authenticated
  USING (EXISTS (SELECT 1 FROM public.leads l WHERE l.id = doctor_reviews.lead_id));
CREATE POLICY clinic_scoped_insert ON public.doctor_reviews
  FOR INSERT TO anon, authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.leads l WHERE l.id = doctor_reviews.lead_id));

-- notifications
DROP POLICY IF EXISTS clinic_scoped_select ON public.notifications;
DROP POLICY IF EXISTS clinic_scoped_insert ON public.notifications;
DROP POLICY IF EXISTS clinic_scoped_update ON public.notifications;
CREATE POLICY clinic_scoped_select ON public.notifications
  FOR SELECT TO anon, authenticated USING (clinic_id IS NOT NULL);
CREATE POLICY clinic_scoped_insert ON public.notifications
  FOR INSERT TO anon, authenticated WITH CHECK (clinic_id IS NOT NULL);
CREATE POLICY clinic_scoped_update ON public.notifications
  FOR UPDATE TO anon, authenticated USING (clinic_id IS NOT NULL);

-- clinic_settings
DROP POLICY IF EXISTS clinic_scoped_select ON public.clinic_settings;
DROP POLICY IF EXISTS clinic_scoped_all ON public.clinic_settings;
DROP POLICY IF EXISTS clinic_scoped_insert ON public.clinic_settings;
DROP POLICY IF EXISTS clinic_scoped_update ON public.clinic_settings;
CREATE POLICY clinic_scoped_select ON public.clinic_settings
  FOR SELECT TO anon, authenticated USING (clinic_id IS NOT NULL);
CREATE POLICY clinic_scoped_insert ON public.clinic_settings
  FOR INSERT TO anon, authenticated WITH CHECK (clinic_id IS NOT NULL);
CREATE POLICY clinic_scoped_update ON public.clinic_settings
  FOR UPDATE TO anon, authenticated USING (clinic_id IS NOT NULL) WITH CHECK (clinic_id IS NOT NULL);

-- dashboard_sync
DROP POLICY IF EXISTS clinic_scoped_select ON public.dashboard_sync;
DROP POLICY IF EXISTS clinic_scoped_all ON public.dashboard_sync;
CREATE POLICY clinic_scoped_select ON public.dashboard_sync
  FOR SELECT TO anon, authenticated
  USING (EXISTS (SELECT 1 FROM public.leads l WHERE l.id = dashboard_sync.lead_id));

-- followup_queue
DROP POLICY IF EXISTS clinic_scoped_select ON public.followup_queue;
DROP POLICY IF EXISTS clinic_scoped_insert ON public.followup_queue;
CREATE POLICY clinic_scoped_select ON public.followup_queue
  FOR SELECT TO anon, authenticated USING (clinic_id IS NOT NULL);
CREATE POLICY clinic_scoped_insert ON public.followup_queue
  FOR INSERT TO anon, authenticated WITH CHECK (clinic_id IS NOT NULL);
