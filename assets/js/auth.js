/* ==========================================================================
   Perspecta — auth.js
   Shared Supabase client + role-based access helpers for the Writer
   Dashboard and Board Review Dashboard.

   Load order on any page that uses this file:
     1. https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2  (CDN, no build step)
     2. assets/js/supabase-config.js
     3. assets/js/auth.js
     4. assets/js/toast.js (optional, for showToast)

   IMPORTANT ON SECURITY: everything in this file is a convenience/UX
   layer — it hides dashboard UI from people who shouldn't see it and
   redirects them politely. The actual access control is enforced by
   the Row Level Security policies in supabase/schema.sql, which run on
   Supabase's servers no matter what this client-side code does. Treat
   this file as "nice doors with signs on them," and the database as
   the lock.
   ========================================================================== */

(function () {
  const cfg = window.PERSPECTA_SUPABASE_CONFIG || {};

  if (!window.supabase || !cfg.url || cfg.url.includes('YOUR-PROJECT-REF')) {
    console.warn(
      '[Perspecta] Supabase is not configured yet. Fill in assets/js/supabase-config.js ' +
      'with your project URL and anon key (see supabase/schema.sql for setup steps). ' +
      'Dashboards will not function until this is done.'
    );
  }

  const client = window.supabase && cfg.url
    ? window.supabase.createClient(cfg.url, cfg.anonKey)
    : null;

  window.PerspectaAuth = {
    client,

    /** Current signed-in user's profile row (id, name, email, role), or null. */
    async getProfile() {
      if (!client) return null;
      const { data: { session } } = await client.auth.getSession();
      if (!session) return null;

      const { data, error } = await client
        .from('profiles')
        .select('id, name, email, role, bio')
        .eq('id', session.user.id)
        .single();

      if (error) {
        console.error('[Perspecta] Could not load profile:', error.message);
        return null;
      }
      return data;
    },

    /**
     * Gate a page to one or more roles. Redirects to login.html (if
     * signed out) or index.html (if signed in but not permitted).
     * Returns the profile on success so the calling page can use it.
     */
    async requireRole(allowedRoles) {
      const profile = await this.getProfile();

      if (!profile) {
        const next = encodeURIComponent(location.pathname + location.search);
        location.href = `login.html?redirect=${next}`;
        return null;
      }

      if (!allowedRoles.includes(profile.role)) {
        location.href = 'index.html';
        return null;
      }

      return profile;
    },

    async signOut() {
      if (!client) return;
      await client.auth.signOut();
      location.href = 'login.html';
    },

    /** Wires up any element with [data-action="sign-out"] on the page. */
    wireSignOutButtons() {
      document.querySelectorAll('[data-action="sign-out"]').forEach((btn) => {
        btn.addEventListener('click', () => this.signOut());
      });
    }
  };
})();
