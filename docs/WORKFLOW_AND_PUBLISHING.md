# Perspecta Human Insight — Team Page & Editorial Workflow

This document explains two things added to the site: the dynamic **Team/About
page**, and the **Fellow submission → Board review** publishing workflow,
including the role-based access control (RBAC) and database model behind it.

---

## 1. Directory & Asset Structure

### Brand assets (existing)
```
assets/
├── logo.jpg                  Circular logo badge (header, footer, favicon)
├── brand-lockup-card.jpg     Hero visual
├── pillars-infographic.jpg   "Who We Are" infographic
├── reflection-question.jpg   Instagram reflection cards
├── reflection-quote-1.jpg
├── reflection-quote-2.jpg
└── reflection-quote-3.jpg
```

### Team headshots & bios (new)
```
assets/
├── Dominguez_Headshot.png     Original, full-resolution uploads (kept as-is)
├── Jaiyeola_Headshot.jpg
├── Metz_Headshot.jpg
├── Mickelson_Headshot.JPG
└── team/
    ├── team-data.js           The team schema — one object per person
    ├── dominguez.jpg          Web-optimized copies actually used on the page
    ├── jaiyeola.jpg           (resized to 720px wide, re-compressed —
    ├── metz.jpg                the originals above were up to 8.5MB,
    └── mickelson.jpg           too large to serve directly on a static site)
```

**How the mapping works:** `assets/team/team-data.js` defines
`window.PERSPECTA_TEAM`, an array of `{ id, name, role, bio, photo }`
objects. `script.js` reads that array on page load (`renderTeam()`) and
builds the card grid in the `#team` section of `index.html` — nothing is
hard-coded in the HTML. To add, remove, or edit a team member, **only edit
`assets/team/team-data.js`**; the page updates automatically.

If a person has no `photo` field, or their image fails to load for any
reason, the card automatically falls back to a circular initials avatar in
the site's brand colors (forest green background, cream initials) instead
of a broken-image icon. You can see this by adding an entry with no
`photo` key.

> **Status:** the four headshots currently in `assets/team/team-data.js`
> are real, uploaded photos, but the **names, roles, and bios are
> placeholders** pending confirmation from each person. Replace the
> placeholder text in that file before treating the Team section as
> final/public — it's clearly marked in the file itself.

---

## 2. User Roles & Workflow Lifecycle

### Roles

| Role | Who | Can do |
|---|---|---|
| `VIEWER` | Default for everyone, including anonymous visitors | Read published articles, filter by perspective/category, view author bios. Cannot access either dashboard. |
| `FELLOW` | Perspecta Human Insight Fellows ("Writer") | Everything a Viewer can, plus: access the **Writer Dashboard**, create/edit drafts, submit articles for review. Cannot publish directly or edit their own role. |
| `BOARD` | Board Members ("Reviewer / Publisher") | Everything a Fellow can read, plus: access the **Board Review Dashboard**, review any pending submission, approve & publish, request changes, or reject. |

Roles are **not self-assigned**. Every new account starts as `VIEWER`
(enforced by a database trigger). A person becomes a `FELLOW` after their
fellowship submission is accepted, or `BOARD` after a board invitation is
confirmed — someone already on the Board promotes them by editing their row
in the `profiles` table (Supabase Table Editor, or a short SQL statement).
This mirrors the founding overview's point that fellowship and board
membership should go through deliberate review, not a public toggle.

### Article lifecycle

```
                ┌────────────────────────────────┐
                │                                │
   DRAFT  ──submit──▶  PENDING_REVIEW  ──approve──▶  PUBLISHED
     ▲                      │
     │                      ├──request changes──▶  REVISION_REQUESTED ──┐
     │                      │                                           │
     │                      └──reject──▶  REJECTED                     │
     │                                                                   │
     └───────────────────── Fellow edits and resubmits ─────────────────┘
```

* **`DRAFT`** — only the author can see or edit it. Can be saved
  repeatedly, or submitted.
* **`PENDING_REVIEW`** — locked from further editing by the Fellow;
  now visible to the Board in the review queue.
* **`PUBLISHED`** — visible to everyone; `published_at` is stamped
  automatically. Terminal state.
* **`REVISION_REQUESTED`** — sent back to the Fellow with an optional
  note. The Fellow can edit it again and resubmit (back to
  `PENDING_REVIEW`).
* **`REJECTED`** — terminal state, with an optional note.

Every transition is enforced twice: once by Row Level Security (who can
touch which *rows*), and again by a database trigger
(`enforce_article_workflow` in `supabase/schema.sql`) that checks which
*status changes* are legal for the caller's role — e.g., a Fellow can
never set their own article to `PUBLISHED`, and the Board can only act on
an article that is currently `PENDING_REVIEW`. This runs on Supabase's
servers, so it holds even if someone bypasses the dashboard UI entirely.

---

## 3. Usage Guides

### For Perspecta Human Insight Fellows (Writer Dashboard)

1. Go to **Fellow / Board Login** (linked in the site footer) and sign in.
   (New accounts start as `VIEWER` — if you don't see the Writer Dashboard,
   your Fellow access hasn't been activated yet; reach out to the team.)
2. On `writer-dashboard.html`, click **+ New Article**, or select an
   existing draft/revision from the list on the left.
3. Fill in:
   - **Title** and **Subtitle**
   - **Article Content** — plain text or Markdown (`**bold**`, `_italic_`,
     `## heading`, `[link](url)`); the small toolbar inserts the syntax
     for you.
   - **Perspective Tags** — check all that apply (Human Rights, Culture,
     Society, Tech & Humanity), or add your own custom tag.
   - **Insight Classification** — choose 500, 1000, or Solutions.
4. Click **Save Draft** any time — you can come back and keep editing.
5. When ready, click **Submit to Board for Review**. This requires a
   title, content, at least one perspective tag, and a classification.
   Once submitted, the piece is locked from further editing until the
   Board responds.
6. If the Board **requests changes**, the article reappears as editable
   (with their note shown above the form) — revise and resubmit the same
   way.
7. If **approved**, it's published automatically. If **rejected**, it's
   closed out; the Board's note (if any) explains why.

### For Board Members (Board Review Dashboard)

1. Sign in at **Fellow / Board Login**, then open `board-dashboard.html`.
2. The **Pending Review** tab lists every submission waiting on the
   Board. Switch tabs to see Published, Revision Requested, Rejected, or
   All.
3. Click a submission to open the full preview: title, subtitle, author
   name and email, perspective tags, insight classification, and the
   complete article text.
4. Optionally write a **feedback note** — it's shown to the Fellow.
5. Choose one:
   - **Approve & Publish** — the article goes live immediately and is
     stamped with a publish date.
   - **Request Changes** — sends it back to the Fellow, editable again,
     with your note attached.
   - **Reject** — closes the submission out, with your note if you left
     one.
6. Each action asks for a one-click confirmation before it's final.

---

## 4. Setting Up the Backend (Supabase)

The dashboards above need a real Supabase project to function — without
one, they'll show a console warning and the forms won't save. This is a
one-time setup:

1. Create a free project at [supabase.com](https://supabase.com).
2. In the Supabase dashboard, open **SQL Editor**, paste the entire
   contents of [`supabase/schema.sql`](../supabase/schema.sql), and run
   it. This creates the `profiles` and `articles` tables, the status enums,
   the auto-profile-on-signup trigger, the workflow-enforcement trigger,
   and every RLS policy described above.
3. Open **Project Settings → API**, copy your **Project URL** and
   **anon public key**, and paste them into
   [`assets/js/supabase-config.js`](../assets/js/supabase-config.js).
   (That key is meant to be public — see the comment in that file for why
   it's safe to commit.)
4. Create your own account via the site's **Create Account** form, then
   in Supabase's **Table Editor → profiles**, change your row's `role`
   from `VIEWER` to `BOARD` so you can promote everyone else from the
   dashboard instead of the SQL editor going forward.
5. Deploy as usual (see [`DEPLOYMENT.md`](../DEPLOYMENT.md)) — the
   dashboards are static HTML/JS pages like the rest of the site and work
   on GitHub Pages; only the data layer lives on Supabase.

**Why this approach:** the site stays free, static, and on GitHub Pages
exactly as it started. Supabase's free tier adds a real Postgres database
and real authentication without requiring a server you have to run or
pay for — the security (who can read/write what) is enforced by Postgres
Row Level Security policies on Supabase's servers, not by anything in the
browser, which is what makes this a genuine access-control system rather
than a client-side mockup.
