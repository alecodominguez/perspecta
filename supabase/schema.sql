-- ============================================================================
-- Perspecta Human Insight — Supabase schema
-- Fellow submission & Board review workflow, with RBAC enforced by
-- Postgres Row Level Security (RLS) — not just client-side checks.
--
-- HOW TO USE:
--   1. Create a free project at https://supabase.com.
--   2. Open the SQL Editor in your Supabase dashboard.
--   3. Paste this entire file and run it once, top to bottom.
--   4. Copy your Project URL and anon public key into
--      assets/js/supabase-config.js (see that file's comments).
--
-- This file is idempotent-ish (uses IF NOT EXISTS / OR REPLACE where
-- possible) so it's safe to re-run, but it is NOT a migration tool —
-- for a production nonprofit deployment, consider the Supabase CLI
-- and versioned migrations once this model is proven out.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. Extensions
-- ---------------------------------------------------------------------------
create extension if not exists "pgcrypto"; -- for gen_random_uuid()

-- ---------------------------------------------------------------------------
-- 2. Enums
-- ---------------------------------------------------------------------------
do $$ begin
  create type public.user_role as enum ('VIEWER', 'FELLOW', 'BOARD');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.article_status as enum (
    'DRAFT', 'PENDING_REVIEW', 'PUBLISHED', 'REVISION_REQUESTED', 'REJECTED'
  );
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.insight_type as enum ('500', '1000', 'SOLUTIONS');
exception when duplicate_object then null;
end $$;

-- ---------------------------------------------------------------------------
-- 3. Users / Profiles
--    Supabase Auth already manages auth.users (email, password hash,
--    session tokens). We extend it with a public.profiles row that
--    carries the fields this app actually needs, including `role`.
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  name        text not null default '',
  email       text not null,
  role        public.user_role not null default 'VIEWER',
  bio         text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

comment on table public.profiles is
  'One row per registered user. role controls dashboard access and is '
  'intentionally NOT self-editable — see RLS policies below. New sign-ups '
  'default to VIEWER; a Board Member (or you, via the Supabase table '
  'editor) promotes someone to FELLOW or BOARD by hand. This mirrors the '
  'founding overview''s guidance that fellowship/board membership should '
  'go through deliberate review, not a public self-serve toggle.';

-- Auto-create a profile row whenever someone signs up via Supabase Auth.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, name, email, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1)),
    new.email,
    'VIEWER'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- 4. Articles
-- ---------------------------------------------------------------------------
create table if not exists public.articles (
  id              uuid primary key default gen_random_uuid(),
  title           text not null,
  subtitle        text,
  slug            text unique,
  content         text not null default '',
  author_id       uuid not null references public.profiles(id) on delete cascade,
  status          public.article_status not null default 'DRAFT',
  perspectives    text[] not null default '{}',
  insight_type    public.insight_type,
  reviewer_id     uuid references public.profiles(id),
  reviewer_note   text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  published_at    timestamptz
);

comment on table public.articles is
  'Fellow submissions moving through the editorial workflow: '
  'DRAFT -> PENDING_REVIEW -> PUBLISHED | REVISION_REQUESTED | REJECTED. '
  'A REVISION_REQUESTED article can be edited and resubmitted by its '
  'author; see docs/WORKFLOW_AND_PUBLISHING.md for the full lifecycle.';

-- Keep updated_at current on every change.
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists articles_set_updated_at on public.articles;
create trigger articles_set_updated_at
  before update on public.articles
  for each row execute function public.set_updated_at();

-- Generate a URL slug from the title if one wasn't supplied.
create or replace function public.slugify(input text)
returns text language sql immutable as $$
  select trim(both '-' from regexp_replace(lower(coalesce(input, '')), '[^a-z0-9]+', '-', 'g'));
$$;

create or replace function public.articles_autoslug()
returns trigger language plpgsql as $$
begin
  if new.slug is null or new.slug = '' then
    new.slug := public.slugify(new.title) || '-' || substr(new.id::text, 1, 8);
  end if;
  return new;
end;
$$;

drop trigger if exists articles_autoslug_trigger on public.articles;
create trigger articles_autoslug_trigger
  before insert on public.articles
  for each row execute function public.articles_autoslug();

-- ---------------------------------------------------------------------------
-- 5. Workflow guardrails (who can move an article from state to state)
--    This is the "business logic" layer: RLS (section 6) decides which
--    ROWS a user can touch; this trigger decides which STATE TRANSITIONS
--    and COLUMN changes are legal once they're allowed to touch a row.
-- ---------------------------------------------------------------------------
create or replace function public.enforce_article_workflow()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  acting_role public.user_role;
begin
  select role into acting_role from public.profiles where id = auth.uid();

  -- Fellows (and anyone else) may never set these reviewer-only fields.
  if acting_role is distinct from 'BOARD' then
    new.reviewer_id := old.reviewer_id;
    new.reviewer_note := old.reviewer_note;
  end if;

  -- Status transition rules.
  if new.status is distinct from old.status then
    if acting_role = 'BOARD' then
      -- Board may only act on a submission that is pending review.
      if old.status <> 'PENDING_REVIEW' then
        raise exception 'Board can only approve/reject articles that are PENDING_REVIEW (current status: %)', old.status;
      end if;
      if new.status not in ('PUBLISHED', 'REVISION_REQUESTED', 'REJECTED') then
        raise exception 'Board may only move a pending article to PUBLISHED, REVISION_REQUESTED, or REJECTED';
      end if;
      new.reviewer_id := auth.uid();
      if new.status = 'PUBLISHED' then
        new.published_at := now();
      end if;

    elsif acting_role = 'FELLOW' then
      -- A Fellow may only move their own DRAFT/REVISION_REQUESTED piece to PENDING_REVIEW,
      -- or keep editing it as a DRAFT. They can never self-publish or self-reject.
      if new.author_id <> auth.uid() then
        raise exception 'Fellows may only modify their own articles';
      end if;
      if old.status not in ('DRAFT', 'REVISION_REQUESTED') then
        raise exception 'This article is already % and can no longer be edited by its author', old.status;
      end if;
      if new.status not in ('DRAFT', 'PENDING_REVIEW') then
        raise exception 'Fellows may only save a DRAFT or submit it as PENDING_REVIEW';
      end if;

    else
      raise exception 'Only Fellows and Board Members may change article status';
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists articles_enforce_workflow on public.articles;
create trigger articles_enforce_workflow
  before update on public.articles
  for each row execute function public.enforce_article_workflow();

-- ---------------------------------------------------------------------------
-- 6. Row Level Security
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.articles enable row level security;

-- Small helper so policies read cleanly: the caller's own role.
create or replace function public.current_role()
returns public.user_role
language sql stable security definer set search_path = public
as $$
  select role from public.profiles where id = auth.uid();
$$;

-- ---- profiles policies -----------------------------------------------------

drop policy if exists "profiles are self-readable" on public.profiles;
create policy "profiles are self-readable"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "board can read all profiles" on public.profiles;
create policy "board can read all profiles"
  on public.profiles for select
  using (public.current_role() = 'BOARD');

drop policy if exists "anyone can read published-author profiles" on public.profiles;
create policy "anyone can read published-author profiles"
  on public.profiles for select
  using (
    exists (
      select 1 from public.articles
      where public.articles.author_id = public.profiles.id
        and public.articles.status = 'PUBLISHED'
    )
  );

drop policy if exists "users can update their own name and bio" on public.profiles;
create policy "users can update their own name and bio"
  on public.profiles for update
  using (auth.uid() = id)
  with check (
    auth.uid() = id
    -- role is intentionally excluded from what this policy allows the
    -- trigger below to silently discard any client-attempted role change.
  );

create or replace function public.prevent_self_role_change()
returns trigger language plpgsql as $$
begin
  if new.role is distinct from old.role and public.current_role() <> 'BOARD' then
    new.role := old.role;
  end if;
  return new;
end;
$$;

drop trigger if exists profiles_prevent_self_role_change on public.profiles;
create trigger profiles_prevent_self_role_change
  before update on public.profiles
  for each row execute function public.prevent_self_role_change();

-- ---- articles policies ------------------------------------------------------

-- Public (anonymous + logged-in) can read published articles only.
drop policy if exists "published articles are public" on public.articles;
create policy "published articles are public"
  on public.articles for select
  using (status = 'PUBLISHED');

-- Fellows can read their own articles in any status.
drop policy if exists "fellows read their own articles" on public.articles;
create policy "fellows read their own articles"
  on public.articles for select
  using (auth.uid() = author_id);

-- Board can read every article (needed for the review queue).
drop policy if exists "board reads all articles" on public.articles;
create policy "board reads all articles"
  on public.articles for select
  using (public.current_role() = 'BOARD');

-- Fellows (and Board, who are also allowed to draft pieces) can create
-- articles, but only as themselves and only starting in DRAFT.
drop policy if exists "fellows create their own drafts" on public.articles;
create policy "fellows create their own drafts"
  on public.articles for insert
  with check (
    auth.uid() = author_id
    and public.current_role() in ('FELLOW', 'BOARD')
    and status = 'DRAFT'
  );

-- Authors can update their own article; Board can update any article.
-- (The enforce_article_workflow trigger above restricts *which* fields
-- and *which* status transitions are actually legal.)
drop policy if exists "authors update their own articles" on public.articles;
create policy "authors update their own articles"
  on public.articles for update
  using (auth.uid() = author_id or public.current_role() = 'BOARD')
  with check (auth.uid() = author_id or public.current_role() = 'BOARD');

-- Only the author may delete, and only while still a DRAFT.
drop policy if exists "authors delete their own drafts" on public.articles;
create policy "authors delete their own drafts"
  on public.articles for delete
  using (auth.uid() = author_id and status = 'DRAFT');

-- ---------------------------------------------------------------------------
-- 7. Convenience view for the public site (optional)
--    The static homepage can eventually query this instead of its
--    current hard-coded sample cards.
-- ---------------------------------------------------------------------------
create or replace view public.published_articles as
  select
    a.id, a.title, a.subtitle, a.slug, a.content, a.perspectives,
    a.insight_type, a.published_at, p.name as author_name
  from public.articles a
  join public.profiles p on p.id = a.author_id
  where a.status = 'PUBLISHED'
  order by a.published_at desc;

-- ============================================================================
-- End of schema. See docs/WORKFLOW_AND_PUBLISHING.md for the full
-- role/lifecycle walkthrough and how to promote a user to FELLOW or BOARD.
-- ============================================================================
