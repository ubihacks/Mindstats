-- ============================================================
-- Mindstat � Full Database Setup (single file, safe to re-run)
-- Supabase Dashboard ? SQL Editor ? paste all ? Run
-- ============================================================


-- --- STEP 1: Drop everything (clean slate) -------------------
drop trigger  if exists on_auth_user_created        on auth.users;
drop function if exists public.handle_new_user()    cascade;
drop table    if exists public.reports               cascade;
drop table    if exists public.assessment_responses  cascade;
drop table    if exists public.candidates            cascade;
drop table    if exists public.hiring_roles          cascade;
drop table    if exists public.profiles              cascade;
drop table    if exists public.companies             cascade;


-- --- STEP 2: Companies ---------------------------------------
create table public.companies (
  id            uuid        primary key default gen_random_uuid(),
  name          text        not null,
  website       text        not null default '',
  domain        text        not null unique,
  current_plan  text,
  payment_cycle text        not null default 'MONTHLY',
  credits       int         not null default 0,
  used_credits  int         not null default 0,
  created_at    timestamptz not null default now()
);


-- --- STEP 3: Profiles ----------------------------------------
create table public.profiles (
  id                   uuid        primary key,
  email                text        not null unique,
  company_name         text        not null,
  company_website      text        not null default '',
  company_domain       text        not null
                         references public.companies (domain) on delete cascade,
  role                 text        not null default 'HR',
  is_first_domain_user boolean     not null default false,
  created_at           timestamptz not null default now()
);


-- --- STEP 4: Hiring Roles ------------------------------------
create table public.hiring_roles (
  id                    uuid        primary key default gen_random_uuid(),
  title                 text        not null,
  job_level             text        not null,
  function              text        not null,
  unique_code           text        not null unique,
  company_id            uuid        not null
                          references public.companies (id) on delete cascade,
  hiring_manager_id     uuid,
  hiring_manager_email  text,
  hiring_manager_name   text,
  hiring_manager_status text        not null default 'IDLE',
  behavioural_demand    jsonb,
  created_at            timestamptz not null default now()
);


-- --- STEP 5: Candidates --------------------------------------
create table public.candidates (
  id                           uuid        primary key default gen_random_uuid(),
  role_id                      uuid        not null
                                 references public.hiring_roles (id) on delete cascade,
  name                         text        not null,
  email                        text        not null,
  invite_token                 text        not null unique,
  invite_status                text        not null default 'PENDING',
  invited_at                   timestamptz not null default now(),
  expires_at                   timestamptz not null,
  share_report_with_candidate  boolean     not null default true,
  report_url                   text,
  credit_refunded              boolean     not null default false
);


-- --- STEP 6: Assessment Responses ----------------------------
create table public.assessment_responses (
  id              uuid        primary key default gen_random_uuid(),
  role_id         uuid        not null
                    references public.hiring_roles (id) on delete cascade,
  respondent_id   uuid        not null,
  assessment_type text        not null,
  answers         jsonb       not null,
  submitted_at    timestamptz not null default now()
);


-- --- STEP 7: Reports -----------------------------------------
create table public.reports (
  id           uuid        primary key default gen_random_uuid(),
  role_id      uuid        not null
                 references public.hiring_roles (id) on delete cascade,
  candidate_id uuid
                 references public.candidates (id),
  company_id   uuid        not null
                 references public.companies (id) on delete cascade,
  file_url     text        not null,
  file_type    text        not null,
  uploaded_by  text        not null,
  uploaded_at  timestamptz not null default now()
);


-- --- STEP 8: Enable Row Level Security -----------------------
alter table public.companies            enable row level security;
alter table public.profiles             enable row level security;
alter table public.hiring_roles         enable row level security;
alter table public.candidates           enable row level security;
alter table public.assessment_responses enable row level security;
alter table public.reports              enable row level security;


-- --- STEP 9: Helper function (breaks RLS recursion) ----------
-- Runs as table owner (security definer), so it bypasses RLS
-- when policies need to look up the current user's domain.
create or replace function public.my_company_domain()
returns text
language sql
security definer
stable
as $$
  select company_domain from public.profiles where id = auth.uid()
$$;


-- --- STEP 10: RLS Policies -----------------------------------

-- profiles: own row only (no cross-profile subquery = no recursion)
create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles_insert_own"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id);

-- companies
create policy "companies_select_own"
  on public.companies for select
  using (domain = public.my_company_domain());

create policy "companies_update_own"
  on public.companies for update
  using (domain = public.my_company_domain());

-- hiring_roles
create policy "hiring_roles_all"
  on public.hiring_roles for all
  using (
    company_id in (
      select id from public.companies where domain = public.my_company_domain()
    )
  );

-- candidates: authenticated users manage rows in their company
create policy "candidates_all"
  on public.candidates for all
  using (
    role_id in (
      select hr.id from public.hiring_roles hr
      join public.companies c on c.id = hr.company_id
      where c.domain = public.my_company_domain()
    )
  );

-- candidates: allow anonymous read by invite_token (required for /invite/:token page)
-- invite_token is a UUID secret — possessing it is the auth mechanism
create policy "candidates_public_read_by_invite_token"
  on public.candidates for select
  to anon
  using (true);

-- assessment_responses: authenticated insert only
create policy "assessment_responses_insert"
  on public.assessment_responses for insert
  with check (true);

-- assessment_responses: anon can also insert (candidate assessments)
create policy "assessment_responses_anon_insert"
  on public.assessment_responses for insert
  to anon
  with check (true);

create policy "assessment_responses_select"
  on public.assessment_responses for select
  using (
    role_id in (
      select hr.id from public.hiring_roles hr
      join public.companies c on c.id = hr.company_id
      where c.domain = public.my_company_domain()
    )
  );

-- reports
create policy "reports_all"
  on public.reports for all
  using (
    company_id in (
      select id from public.companies where domain = public.my_company_domain()
    )
  );


-- --- STEP 11: Auto-create profile + company on signup --------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  v_domain     text;
  v_company_id uuid;
  v_is_first   boolean;
begin
  v_domain := new.raw_user_meta_data->>'company_domain';

  select id into v_company_id
  from public.companies
  where domain = v_domain
  limit 1;

  if v_company_id is null then
    -- First user for this domain ? create company + 10 free credits
    v_is_first := true;
    insert into public.companies (name, website, domain, credits)
    values (
      coalesce(new.raw_user_meta_data->>'company_name', ''),
      coalesce(new.raw_user_meta_data->>'company_website', ''),
      v_domain,
      10
    )
    returning id into v_company_id;
  else
    -- Subsequent user on same domain ? no free credits
    v_is_first := false;
  end if;

  insert into public.profiles (
    id, email, company_name, company_website,
    company_domain, role, is_first_domain_user
  )
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'company_name', ''),
    coalesce(new.raw_user_meta_data->>'company_website', ''),
    v_domain,
    case when v_is_first then 'ADMIN' else 'HR' end,
    v_is_first
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- Done. Register a new user via the app — the trigger will handle everything automatically.
