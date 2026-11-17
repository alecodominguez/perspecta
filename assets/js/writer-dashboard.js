/* ==========================================================================
   Perspecta — writer-dashboard.js
   Fellow ("Writer") interface: list own articles, draft/edit/submit.
   Relies on assets/js/auth.js for the Supabase client + role gate, and
   on the RLS policies / trigger in supabase/schema.sql for real
   enforcement (this file's checks are UX, not security).
   ========================================================================== */

(function () {
  let supabase, profile;
  let articles = [];
  let activeArticleId = null;

  const els = {};

  function cacheEls() {
    [
      'whoami', 'newArticleBtn', 'articleList', 'articleListEmpty', 'articleForm',
      'articleId', 'fieldTitle', 'fieldSubtitle', 'fieldContent', 'wordCount',
      'perspectiveTags', 'customTagInput', 'addCustomTag', 'customTags', 'tagsError',
      'classificationError', 'currentStatusBadge', 'reviewerFeedback',
      'saveDraftBtn', 'submitReviewBtn', 'formStatusMsg'
    ].forEach((id) => { els[id] = document.getElementById(id); });
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

  // ---------------------------------------------------------------- init --

  async function init() {
    cacheEls();
    profile = await window.PerspectaAuth.requireRole(['FELLOW', 'BOARD']);
    if (!profile) return; // requireRole already redirected

    window.PerspectaAuth.wireSignOutButtons();
    els.whoami.hidden = false;
    els.whoami.textContent = `${profile.name || profile.email} · ${profile.role}`;
    supabase = window.PerspectaAuth.client;

    wireForm();
    await loadArticles();
    resetForm();
  }

  // --------------------------------------------------------- data layer --

  async function loadArticles() {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('author_id', profile.id)
      .order('updated_at', { ascending: false });

    if (error) {
      showToast('Could not load your articles.', 'error');
      console.error(error);
      return;
    }
    articles = data || [];
    renderArticleList();
  }

  function renderArticleList() {
    els.articleList.innerHTML = '';
    if (!articles.length) {
      els.articleList.innerHTML = '<li class="dash-empty">No articles yet — start your first draft.</li>';
      return;
    }
    articles.forEach((article) => {
      const li = document.createElement('li');
      li.className = 'dash-article-item' + (article.id === activeArticleId ? ' is-active' : '');
      li.innerHTML = `
        <button type="button" class="dash-article-btn" data-id="${article.id}">
          <span class="${statusClass(article.status)}">${STATUS_LABELS[article.status]}</span>
          <span class="dash-article-title">${escapeHtml(article.title || 'Untitled')}</span>
          <span class="dash-article-meta">${new Date(article.updated_at).toLocaleDateString()}</span>
        </button>`;
      els.articleList.appendChild(li);
    });

    els.articleList.querySelectorAll('.dash-article-btn').forEach((btn) => {
      btn.addEventListener('click', () => loadIntoForm(btn.dataset.id));
    });
  }

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, (c) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
  }

  // ----------------------------------------------------------- the form --

  function resetForm() {
    activeArticleId = null;
    els.articleId.value = '';
    els.articleForm.reset();
    els.currentStatusBadge.hidden = true;
    els.reviewerFeedback.hidden = true;
    els.customTags.innerHTML = '';
    clearErrors();
    updateWordCount();
    setLockedState(false);
    renderArticleList();
  }

  function loadIntoForm(id) {
    const article = articles.find((a) => a.id === id);
    if (!article) return;
    activeArticleId = id;
    els.articleId.value = id;
    els.fieldTitle.value = article.title || '';
    els.fieldSubtitle.value = article.subtitle || '';
    els.fieldContent.value = article.content || '';

    els.customTags.innerHTML = '';
    const builtIns = ['Human Rights', 'Culture', 'Society', 'Tech & Humanity'];
    els.perspectiveTags.querySelectorAll('input[type="checkbox"]').forEach((cb) => {
      cb.checked = (article.perspectives || []).includes(cb.value);
    });
    (article.perspectives || []).filter((p) => !builtIns.includes(p)).forEach(addCustomTagEl);

    const radio = els.articleForm.querySelector(`input[name="insightType"][value="${article.insight_type || ''}"]`);
    els.articleForm.querySelectorAll('input[name="insightType"]').forEach((r) => { r.checked = false; });
    if (radio) radio.checked = true;

    els.currentStatusBadge.hidden = false;
    els.currentStatusBadge.className = statusClass(article.status);
    els.currentStatusBadge.textContent = STATUS_LABELS[article.status];

    if (article.status === 'REVISION_REQUESTED' && article.reviewer_note) {
      els.reviewerFeedback.hidden = false;
      els.reviewerFeedback.textContent = `Board feedback: ${article.reviewer_note}`;
    } else {
      els.reviewerFeedback.hidden = true;
    }

    const editable = article.status === 'DRAFT' || article.status === 'REVISION_REQUESTED';
    setLockedState(!editable);

    clearErrors();
    updateWordCount();
    renderArticleList();
  }

  function setLockedState(locked) {
    const fields = [els.fieldTitle, els.fieldSubtitle, els.fieldContent, els.customTagInput, els.addCustomTag];
    fields.forEach((f) => { f.disabled = locked; });
    els.perspectiveTags.querySelectorAll('input').forEach((i) => { i.disabled = locked; });
    els.articleForm.querySelectorAll('input[name="insightType"]').forEach((i) => { i.disabled = locked; });
    els.saveDraftBtn.hidden = locked;
    els.submitReviewBtn.hidden = locked;
    if (locked) {
      els.formStatusMsg.textContent = 'This article has been submitted and can no longer be edited here.';
    } else {
      els.formStatusMsg.textContent = '';
    }
  }

  function clearErrors() {
    els.tagsError.hidden = true;
    els.classificationError.hidden = true;
  }

  function collectFormData() {
    const perspectives = [
      ...els.perspectiveTags.querySelectorAll('input:checked'),
      ...els.customTags.querySelectorAll('input:checked')
    ].map((i) => i.value);

    const insightRadio = els.articleForm.querySelector('input[name="insightType"]:checked');

    return {
      title: els.fieldTitle.value.trim(),
      subtitle: els.fieldSubtitle.value.trim(),
      content: els.fieldContent.value,
      perspectives,
      insight_type: insightRadio ? insightRadio.value : null
    };
  }

  function validate(data, { forSubmit }) {
    clearErrors();
    let valid = true;

    if (!data.title) {
      els.fieldTitle.focus();
      valid = false;
    }
    if (!data.content.trim()) {
      if (valid) els.fieldContent.focus();
      valid = false;
    }
    if (forSubmit && data.perspectives.length === 0) {
      els.tagsError.hidden = false;
      valid = false;
    }
    if (forSubmit && !data.insight_type) {
      els.classificationError.hidden = false;
      valid = false;
    }
    return valid;
  }

  // ------------------------------------------------------------ actions --

  async function saveArticle(status) {
    const data = collectFormData();
    const forSubmit = status === 'PENDING_REVIEW';

    if (!validate(data, { forSubmit })) {
      showToast(forSubmit ? 'Please complete all required fields before submitting.' : 'Title and content are required.', 'error');
      return;
    }

    const payload = { ...data, status };
    const button = forSubmit ? els.submitReviewBtn : els.saveDraftBtn;
    button.disabled = true;
    els.formStatusMsg.textContent = forSubmit ? 'Submitting…' : 'Saving…';

    let result;
    if (activeArticleId) {
      result = await supabase.from('articles').update(payload).eq('id', activeArticleId).select().single();
    } else {
      result = await supabase.from('articles').insert({ ...payload, author_id: profile.id }).select().single();
    }

    button.disabled = false;

    if (result.error) {
      els.formStatusMsg.textContent = '';
      showToast(result.error.message || 'Something went wrong.', 'error');
      console.error(result.error);
      return;
    }

    activeArticleId = result.data.id;
    els.articleId.value = activeArticleId;
    await loadArticles();
    loadIntoForm(activeArticleId);

    showToast(forSubmit ? 'Submitted to the board for review.' : 'Draft saved.', 'success');
    els.formStatusMsg.textContent = forSubmit
      ? 'Submitted — a Board Member will review it soon.'
      : 'Draft saved.';
  }

  // --------------------------------------------------------------- tags --

  function addCustomTagEl(value) {
    if (!value) return;
    const label = document.createElement('label');
    label.className = 'tag-check';
    label.innerHTML = `<input type="checkbox" value="${escapeHtml(value)}" checked> ${escapeHtml(value)}`;
    els.customTags.appendChild(label);
  }

  // ------------------------------------------------------- markdown bar --

  function wireMarkdownToolbar() {
    document.querySelectorAll('.md-toolbar [data-md]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const ta = els.fieldContent;
        const [start, end] = [ta.selectionStart, ta.selectionEnd];
        const selected = ta.value.slice(start, end) || 'text';
        let before = '', after = '';
        switch (btn.dataset.md) {
          case 'bold': before = '**'; after = '**'; break;
          case 'italic': before = '_'; after = '_'; break;
          case 'heading': before = '## '; after = ''; break;
          case 'link': before = '['; after = '](https://)'; break;
        }
        ta.value = ta.value.slice(0, start) + before + selected + after + ta.value.slice(end);
        ta.focus();
        ta.selectionStart = start + before.length;
        ta.selectionEnd = start + before.length + selected.length;
        updateWordCount();
      });
    });
  }

  function updateWordCount() {
    const words = els.fieldContent.value.trim().split(/\s+/).filter(Boolean).length;
    els.wordCount.textContent = `${words} word${words === 1 ? '' : 's'}`;
  }

  // -------------------------------------------------------------- wire --

  function wireForm() {
    els.newArticleBtn.addEventListener('click', resetForm);
    els.saveDraftBtn.addEventListener('click', () => saveArticle('DRAFT'));
    els.submitReviewBtn.addEventListener('click', () => saveArticle('PENDING_REVIEW'));
    els.fieldContent.addEventListener('input', updateWordCount);
    els.addCustomTag.addEventListener('click', () => {
      addCustomTagEl(els.customTagInput.value.trim());
      els.customTagInput.value = '';
    });
    els.articleForm.addEventListener('submit', (e) => e.preventDefault());
    wireMarkdownToolbar();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
