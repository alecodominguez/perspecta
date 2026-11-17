/* ==========================================================================
   Perspecta — toast.js
   Minimal, dependency-free toast notifications shared by the Writer and
   Board dashboards (and available anywhere else on the site).

   Usage:
     showToast('Draft saved.');
     showToast('Something went wrong.', 'error');
     showToast('Submitted for review.', 'success');
   ========================================================================== */

(function () {
  function ensureContainer() {
    let el = document.getElementById('toastContainer');
    if (!el) {
      el = document.createElement('div');
      el.id = 'toastContainer';
      el.className = 'toast-container';
      el.setAttribute('aria-live', 'polite');
      el.setAttribute('aria-atomic', 'true');
      document.body.appendChild(el);
    }
    return el;
  }

  window.showToast = function showToast(message, type) {
    const container = ensureContainer();
    const toast = document.createElement('div');
    toast.className = 'toast' + (type ? ' toast--' + type : '');
    toast.textContent = message;
    container.appendChild(toast);

    // Let the browser paint the initial state before animating in.
    requestAnimationFrame(() => toast.classList.add('is-visible'));

    setTimeout(() => {
      toast.classList.remove('is-visible');
      setTimeout(() => toast.remove(), 250);
    }, 4000);
  };
})();
