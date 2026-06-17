-- Workspace clinic setup: owner email, location, multi-role support

ALTER TABLE public.clinics
  ADD COLUMN IF NOT EXISTS owner_email text,
  ADD COLUMN IF NOT EXISTS location text;

CREATE UNIQUE INDEX IF NOT EXISTS clinics_owner_email_unique
  ON public.clinics (owner_email)
  WHERE owner_email IS NOT NULL;

ALTER TABLE public.users
  ALTER COLUMN clinic_id DROP NOT NULL;

CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  clinic_id uuid NOT NULL REFERENCES public.clinics(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('receptionist', 'doctor')),
  created_at timestamp without time zone DEFAULT now(),
  UNIQUE (user_id, clinic_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS clinic_scoped_insert ON public.clinics;
DROP POLICY IF EXISTS clinic_scoped_update ON public.clinics;
CREATE POLICY clinic_scoped_insert ON public.clinics
  FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY clinic_scoped_update ON public.clinics
  FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS user_roles_select ON public.user_roles;
DROP POLICY IF EXISTS user_roles_insert ON public.user_roles;
DROP POLICY IF EXISTS user_roles_update ON public.user_roles;
CREATE POLICY user_roles_select ON public.user_roles
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY user_roles_insert ON public.user_roles
  FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY user_roles_update ON public.user_roles
  FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
