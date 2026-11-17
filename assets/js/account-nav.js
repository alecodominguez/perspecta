/* ==========================================================================
   Perspecta — account-nav.js
   Adds role-aware navigation between index.html, writer-dashboard.html and
   board-dashboard.html. Load after auth.js on every page.

   Signed out : footer/login link stays as-is.
   FELLOW     : Home <-> Writer Dashboard
   BOARD      : Home <-> Writer Dashboard <-> Board Dashboard
   This is navigation convenience only; access is enforced by the dashboards'
   role gate and the database's RLS policies.
   ========================================================================== */

(async function () {
  if (!window.PerspectaAuth || !window.PerspectaAuth.client) return;

  const profile = await window.PerspectaAuth.getProfile();
  if (!profile) return;

  const page = location.pathname.split('/').pop() || 'index.html';
  const links = [{ href: 'index.html', label: 'Home' }];
  if (['FELLOW', 'BOARD'].includes(profile.role)) {
    links.push({ href: 'writer-dashboard.html', label: 'Writer Dashboard' });
  }
  if (profile.role === 'BOARD') {
    links.push({ href: 'board-dashboard.html', label: 'Board Dashboard' });
  }

  const actions = document.querySelector('.header-actions');
  if (actions && links.length > 1) {
    const nav = document.createElement('nav');
    nav.className = 'account-nav';
    nav.setAttribute('aria-label', 'Account');
    links.forEach((l) => {
      const a = document.createElement('a');
      a.href = l.href;
      a.textContent = l.label;
      if (l.href === page || (page === '' && l.href === 'index.html')) {
        a.className = 'is-current';
        a.setAttribute('aria-current', 'page');
      }
      nav.appendChild(a);
    });
    actions.insertBefore(nav, actions.firstChild);
  }

  // Index footer: swap "Fellow / Board Login" for dashboard links + sign out.
  const footerLogin = document.querySelector('.footer-col a[href="login.html"]');
  if (footerLogin) {
    const li = footerLogin.closest('li');
    li.innerHTML = '';
    links.slice(1).forEach((l) => {
      const item = document.createElement('li');
      item.innerHTML = `<a href="${l.href}">${l.label}</a>`;
      li.parentNode.insertBefore(item, li);
    });
    const out = document.createElement('a');
    out.href = '#';
    out.textContent = 'Sign Out';
    out.addEventListener('click', (e) => { e.preventDefault(); window.PerspectaAuth.signOut(); });
    li.appendChild(out);
  }
})();
