-- Enable dashboard access for AI summary requests and WhatsApp chat history.
-- Matches existing clinic-scoped policies (app filters by clinic_id / phone).

DROP POLICY IF EXISTS clinic_scoped_select ON public.ai_summary_requests;
DROP POLICY IF EXISTS clinic_scoped_insert ON public.ai_summary_requests;
CREATE POLICY clinic_scoped_select ON public.ai_summary_requests
  FOR SELECT TO anon, authenticated
  USING (clinic_id IS NOT NULL);
CREATE POLICY clinic_scoped_insert ON public.ai_summary_requests
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    clinic_id IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM public.leads l
      WHERE l.id = ai_summary_requests.lead_id
        AND l.clinic_id = ai_summary_requests.clinic_id
    )
  );

DROP POLICY IF EXISTS clinic_scoped_select ON public.preet_n8n_chat_histories;
CREATE POLICY clinic_scoped_select ON public.preet_n8n_chat_histories
  FOR SELECT TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.leads l
      WHERE l.phone = preet_n8n_chat_histories.session_id
         OR regexp_replace(l.phone, '\D', '', 'g') = preet_n8n_chat_histories.session_id
    )
  );
