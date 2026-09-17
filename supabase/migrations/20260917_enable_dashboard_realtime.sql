-- Enable realtime so the dashboard can listen for live row changes.
ALTER TABLE public.leads REPLICA IDENTITY FULL;
ALTER TABLE public.lead_profile REPLICA IDENTITY FULL;
ALTER TABLE public.lead_actions REPLICA IDENTITY FULL;
ALTER TABLE public.lead_photos REPLICA IDENTITY FULL;
ALTER TABLE public.followup_queue REPLICA IDENTITY FULL;
ALTER TABLE public.notifications REPLICA IDENTITY FULL;
ALTER TABLE public.ai_summary_requests REPLICA IDENTITY FULL;
ALTER TABLE public.preet_n8n_chat_histories REPLICA IDENTITY FULL;
ALTER TABLE public.clinics REPLICA IDENTITY FULL;
ALTER TABLE public.users REPLICA IDENTITY FULL;

DO $$
DECLARE
  t text;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'leads',
    'lead_profile',
    'lead_actions',
    'lead_photos',
    'followup_queue',
    'notifications',
    'ai_summary_requests',
    'preet_n8n_chat_histories',
    'clinics',
    'users'
  ]
  LOOP
    BEGIN
      EXECUTE format('ALTER PUBLICATION supabase_realtime ADD TABLE public.%I', t);
    EXCEPTION
      WHEN duplicate_object THEN NULL;
    END;
  END LOOP;
END $$;
