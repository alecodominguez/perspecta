/* ==========================================================================
   Perspecta — script.js
   Mobile nav toggle, report category filtering, search bar, smooth scroll,
   newsletter form handling.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Mobile Navigation Toggle ---------- */
  const hamburger = document.getElementById('hamburger');
  const mainNav = document.getElementById('mainNav');

  function closeNav() {
    hamburger.classList.remove('is-active');
    mainNav.classList.remove('is-open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  function toggleNav() {
    const isOpen = mainNav.classList.toggle('is-open');
    hamburger.classList.toggle('is-active', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  if (hamburger && mainNav) {
    hamburger.addEventListener('click', toggleNav);

    // Close menu when a nav link is clicked (mobile)
    mainNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeNav);
    });

    // Close menu on resize back to desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth > 860) closeNav();
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeNav();
    });
  }

  /* ---------- Search Bar Toggle ---------- */
  const searchToggle = document.getElementById('searchToggle');
  const searchClose = document.getElementById('searchClose');
  const searchBar = document.getElementById('searchBar');

  function openSearch() {
    searchBar.classList.add('is-open');
    searchToggle.setAttribute('aria-expanded', 'true');
    const input = searchBar.querySelector('input');
    if (input) setTimeout(() => input.focus(), 150);
  }

  function closeSearch() {
    searchBar.classList.remove('is-open');
    searchToggle.setAttribute('aria-expanded', 'false');
  }

  if (searchToggle && searchBar) {
    searchToggle.addEventListener('click', () => {
      searchBar.classList.contains('is-open') ? closeSearch() : openSearch();
    });
  }
  if (searchClose) {
    searchClose.addEventListener('click', closeSearch);
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && searchBar && searchBar.classList.contains('is-open')) {
      closeSearch();
    }
  });

  /* ---------- Reports Category Filter ---------- */
  const filterTabs = document.querySelectorAll('.filter-tab');
  const reportCards = document.querySelectorAll('.report-card');
  const noResults = document.getElementById('noResults');

  function applyFilter(filter) {
    let visibleCount = 0;

    reportCards.forEach(card => {
      const matches = filter === 'all' || card.dataset.category === filter;
      card.classList.toggle('is-hidden', !matches);
      if (matches) visibleCount++;
    });

    if (noResults) {
      noResults.hidden = visibleCount !== 0;
    }
  }

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => {
        t.classList.remove('is-active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('is-active');
      tab.setAttribute('aria-selected', 'true');
      applyFilter(tab.dataset.filter);
    });
  });

  /* ---------- Smooth Scroll for In-Page Anchors ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId.length <= 1) return; // guards against bare "#"
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  /* ---------- Sticky Header Shadow on Scroll ---------- */
  const header = document.getElementById('siteHeader');
  function updateHeaderShadow() {
    if (!header) return;
    header.style.boxShadow = window.scrollY > 8
      ? '0 4px 16px rgba(20, 18, 15, 0.06)'
      : 'none';
  }
  window.addEventListener('scroll', updateHeaderShadow, { passive: true });
  updateHeaderShadow();

  /* ---------- Newsletter Form (front-end only placeholder) ---------- */
  const newsletterForm = document.getElementById('newsletterForm');
  const formStatus = document.getElementById('formStatus');

  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = document.getElementById('newsletterEmail');
      const email = emailInput ? emailInput.value.trim() : '';

      if (!email) return;

      // Placeholder success state — wire up to a real email service
      // (Mailchimp, Buttondown, ConvertKit, etc.) for production use.
      formStatus.textContent = `Thanks — a confirmation is on its way to ${email}.`;
      newsletterForm.reset();
    });
  }

});
