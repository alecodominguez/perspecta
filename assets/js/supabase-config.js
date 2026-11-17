/* ==========================================================================
   Perspecta — supabase-config.js

   Fill these in once you've created a Supabase project (see
   supabase/schema.sql and docs/WORKFLOW_AND_PUBLISHING.md).

   Project Settings -> API in your Supabase dashboard gives you both values.

   IMPORTANT: The anon/public key below is DESIGNED to be public — it is
   embedded in every browser that loads this site, the same way it's
   embedded in every Supabase app. It does NOT grant access by itself.
   All real security comes from the Row Level Security (RLS) policies in
   supabase/schema.sql, which run on Supabase's servers regardless of
   what this file or the browser's JavaScript says. Never put your
   `service_role` key (a different, genuinely secret key) in this file
   or anywhere in this repo.
   ========================================================================== */

window.PERSPECTA_SUPABASE_CONFIG = {
  url: 'https://YOUR-PROJECT-REF.supabase.co',
  anonKey: 'YOUR-ANON-PUBLIC-KEY'
};
