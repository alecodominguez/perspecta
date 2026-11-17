/* ==========================================================================
   Perspecta — board-dashboard.js
   Board ("Reviewer / Publisher") interface: pending queue, full preview,
   and Approve & Publish / Request Changes / Reject actions.
   Relies on assets/js/auth.js for the Supabase client + role gate, and
   on the RLS policies / trigger in supabase/schema.sql for real
   enforcement (this file's checks are UX, not security).
   ========================================================================== */

(function () {
  let supabase, profile;
  let queue = [];
  let activeId = null;
  let currentFilter = 'PENDING_REVIEW';

  const els = {};

  function cacheEls() {
    ['whoami', 'queueList', 'queueEmpty', 'previewPane'].forEach((id) => {
      els[id] = document.getElementById(id);
    });
  }

  const STATUS_LABELS = {
    DRAFT: 'Draft',
    PENDING_REVIEW: 'Pending Review',
    PUBLISHED: 'Published',
    REVISION_REQUESTED: 'Revision Requested',
    REJECTED: 'Rejected'
  };

  function statusClass(status) {
    return 'status-badge status-badge--' + status.toLowerCase().replace(/_/g, '-');
  }

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, (c) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
  }

  // ---------------------------------------------------------------- init --

  async function init() {
    cacheEls();
    profile = await window.PerspectaAuth.requireRole(['BOARD']);
    if (!profile) return;

    window.PerspectaAuth.wireSignOutButtons();
    els.whoami.hidden = false;
    els.whoami.textContent = `${profile.name || profile.email} · ${profile.role}`;
    supabase = window.PerspectaAuth.client;

    document.querySelectorAll('.filter-tab').forEach((tab) => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.filter-tab').forEach((t) => {
          t.classList.remove('is-active'); t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('is-active');
        tab.setAttribute('aria-selected', 'true');
        currentFilter = tab.dataset.status;
        loadQueue();
      });
    });

    await loadQueue();
  }

  // --------------------------------------------------------- data layer --

  async function loadQueue() {
    let query = supabase
      .from('articles')
      .select('*, author:profiles!articles_author_id_fkey(name, email)')
      .order('updated_at', { ascending: false });

    if (currentFilter !== 'ALL') {
      query = query.eq('status', currentFilter);
    }

    const { data, error } = await query;

    if (error) {
      showToast('Could not load submissions.', 'error');
      console.error(error);
      return;
    }

    queue = data || [];
    renderQueue();
  }

  function renderQueue() {
    els.queueList.innerHTML = '';
    if (!queue.length) {
      els.queueList.innerHTML = '<li class="dash-empty">Nothing here right now.</li>';
      return;
    }
    queue.forEach((article) => {
      const authorName = article.author ? (article.author.name || article.author.email) : 'Unknown author';
      const li = document.createElement('li');
      li.className = 'dash-article-item' + (article.id === activeId ? ' is-active' : '');
      li.innerHTML = `
        <button type="button" class="dash-article-btn" data-id="${article.id}">
          <span class="${statusClass(article.status)}">${STATUS_LABELS[article.status]}</span>
          <span class="dash-article-title">${escapeHtml(article.title || 'Untitled')}</span>
          <span class="dash-article-meta">${escapeHtml(authorName)} · ${new Date(article.updated_at).toLocaleDateString()}</span>
        </button>`;
      els.queueList.appendChild(li);
    });

    els.queueList.querySelectorAll('.dash-article-btn').forEach((btn) => {
      btn.addEventListener('click', () => renderPreview(btn.dataset.id));
    });
  }

  // -------------------------------------------------------------- preview --

  function renderPreview(id) {
    activeId = id;
    renderQueue();
    const article = queue.find((a) => a.id === id);
    if (!article) return;

    const authorName = article.author ? (article.author.name || article.author.email) : 'Unknown author';
    const authorEmail = article.author ? article.author.email : '';
    const insightLabels = { '500': 'Perspecta Human Insight 500', '1000': 'Perspecta Human Insight 1000', SOLUTIONS: 'Perspecta Human Insight Solutions' };
    const canAct = article.status === 'PENDING_REVIEW';

    els.previewPane.innerHTML = `
      <div class="preview-head">
        <span class="${statusClass(article.status)}">${STATUS_LABELS[article.status]}</span>
        <h2 class="preview-title">${escapeHtml(article.title || 'Untitled')}</h2>
        ${article.subtitle ? `<p class="preview-subtitle">${escapeHtml(article.subtitle)}</p>` : ''}
        <p class="dash-article-meta">By ${escapeHtml(authorName)}${authorEmail ? ` (${escapeHtml(authorEmail)})` : ''} · Submitted ${new Date(article.updated_at).toLocaleString()}</p>
        <div class="preview-tags">
          ${(article.perspectives || []).map((p) => `<span class="tag">${escapeHtml(p)}</span>`).join('')}
          ${article.insight_type ? `<span class="tag tag-insight">${insightLabels[article.insight_type] || article.insight_type}</span>` : ''}
        </div>
      </div>
      <div class="preview-body">${escapeHtml(article.content || '').replace(/\n/g, '<br>')}</div>
      ${article.reviewer_note ? `<p class="dash-feedback-note">Previous board note: ${escapeHtml(article.reviewer_note)}</p>` : ''}

      ${canAct ? `
        <div class="review-actions">
          <label class="auth-label" for="reviewNote">Feedback note <span class="auth-hint-inline">(optional, shared with the Fellow)</span></label>
          <textarea class="auth-input" id="reviewNote" rows="3" placeholder="Why you're requesting changes or rejecting, or notes on publishing…"></textarea>
          <div class="dash-actions">
            <button type="button" class="btn btn-primary" id="approveBtn">Approve &amp; Publish</button>
            <button type="button" class="btn btn-outline" id="requestChangesBtn">Request Changes</button>
            <button type="button" class="btn btn-outline btn-danger" id="rejectBtn">Reject</button>
          </div>
        </div>
      ` : '<p class="auth-hint">This submission has already been reviewed and can no longer be actioned here.</p>'}
    `;

    if (canAct) {
      document.getElementById('approveBtn').addEventListener('click', () => actOn(article.id, 'PUBLISHED'));
      document.getElementById('requestChangesBtn').addEventListener('click', () => actOn(article.id, 'REVISION_REQUESTED'));
      document.getElementById('rejectBtn').addEventListener('click', () => actOn(article.id, 'REJECTED'));
    }
  }

  // ------------------------------------------------------------ actions --

  async function actOn(id, newStatus) {
    const noteField = document.getElementById('reviewNote');
    const note = noteField ? noteField.value.trim() : '';

    const confirmMsg = {
      PUBLISHED: 'Publish this article to the live site?',
      REVISION_REQUESTED: 'Send this back to the Fellow for revisions?',
      REJECTED: 'Reject this submission?'
    }[newStatus];
    if (!window.confirm(confirmMsg)) return;

    const { error } = await supabase
      .from('articles')
      .update({ status: newStatus, reviewer_note: note || null })
      .eq('id', id);

    if (error) {
      showToast(error.message || 'Could not update this article.', 'error');
      console.error(error);
      return;
    }

    const toastMsg = {
      PUBLISHED: 'Published.',
      REVISION_REQUESTED: 'Sent back for revision.',
      REJECTED: 'Rejected.'
    }[newStatus];
    showToast(toastMsg, 'success');

    await loadQueue();
    els.previewPane.innerHTML = '<p class="dash-empty">Select a submission from the list to review it.</p>';
  }

  document.addEventListener('DOMContentLoaded', init);
})();
