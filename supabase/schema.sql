-- =====================================================================
--  SAKINA STUDIO · Schéma de la base de données (Supabase / PostgreSQL)
--  À exécuter UNE FOIS dans Supabase : SQL Editor > New query > Run.
--  Puis exécuter supabase/seed.sql pour charger le contenu initial.
--  Ce fichier peut être relancé sans danger (il ne supprime rien).
-- =====================================================================

-- ---------------------------------------------------------------------
-- 0. ADMINISTRATEURS AUTORISÉS  (A MODIFIER AVANT D'EXÉCUTER)
--    Remplacez l'adresse ci-dessous par l'e-mail du compte administrateur.
--    Tout compte créé avec cet e-mail devient automatiquement administrateur.
-- ---------------------------------------------------------------------
create table if not exists public.admin_emails (email text primary key);
alter table public.admin_emails enable row level security;           -- aucune règle = inaccessible depuis le site
insert into public.admin_emails (email) values ('Sakinadigicom831@gmail.com') on conflict do nothing;

-- ---------------------------------------------------------------------
-- 1. PROFILS (un par compte) et rôles
-- ---------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  email text,
  full_name text default '',
  phone text,
  role text not null default 'client' check (role in ('admin', 'client')),
  created_at timestamptz not null default now()
);

create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (new.id, new.email, coalesce(new.raw_user_meta_data ->> 'full_name', ''),
          case when exists (select 1 from public.admin_emails a where lower(a.email) = lower(new.email)) then 'admin' else 'client' end)
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

-- comptes déjà existants avant l'exécution de ce script
insert into public.profiles (id, email, full_name, role)
select u.id, u.email, coalesce(u.raw_user_meta_data ->> 'full_name', ''),
       case when exists (select 1 from public.admin_emails a where lower(a.email) = lower(u.email)) then 'admin' else 'client' end
from auth.users u on conflict (id) do nothing;
update public.profiles p set role = 'admin' where exists (select 1 from public.admin_emails a where lower(a.email) = lower(p.email));

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

-- empêche un client de se donner le rôle administrateur
create or replace function public.protect_role() returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.role is distinct from old.role and not public.is_admin() then new.role := old.role; end if;
  return new;
end $$;
drop trigger if exists protect_role_trg on public.profiles;
create trigger protect_role_trg before update on public.profiles for each row execute function public.protect_role();

alter table public.profiles enable row level security;
drop policy if exists "profil : lecture" on public.profiles;
create policy "profil : lecture" on public.profiles for select using (id = auth.uid() or public.is_admin());
drop policy if exists "profil : modification" on public.profiles;
create policy "profil : modification" on public.profiles for update using (id = auth.uid() or public.is_admin());

-- ---------------------------------------------------------------------
-- 2. CONTENU DU SITE
-- ---------------------------------------------------------------------
create table if not exists public.site_settings (key text primary key, value jsonb not null default '{}'::jsonb, updated_at timestamptz not null default now());

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(), slug text unique not null, name text not null,
  position int not null default 0, published boolean not null default true);

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(), slug text unique not null, icon text not null default 'branding',
  title text not null, short_title text, summary text, description text, deliverables text[] not null default '{}',
  position int not null default 0, published boolean not null default true);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(), slug text unique not null, title text not null, category text,
  client text, year text, services_label text, summary text, context text, solution text, result text,
  cover_url text, gallery text[] not null default '{}', featured boolean not null default false,
  position int not null default 0, published boolean not null default true, created_at timestamptz not null default now());

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(), name text not null, company text, role text, quote text not null,
  avatar_url text, position int not null default 0, published boolean not null default true);

create table if not exists public.team_members (
  id uuid primary key default gen_random_uuid(), name text not null, role text, photo_url text,
  position int not null default 0, published boolean not null default true);

create table if not exists public.process_steps (
  id uuid primary key default gen_random_uuid(), title text not null, description text,
  position int not null default 0, published boolean not null default true);

create table if not exists public.site_values (
  id uuid primary key default gen_random_uuid(), title text not null, description text, icon text default 'branding',
  position int not null default 0, published boolean not null default true);

-- Sécurité : lecture publique du contenu publié, écriture réservée à l'administrateur
alter table public.site_settings enable row level security;
drop policy if exists "reglages : lecture" on public.site_settings;
create policy "reglages : lecture" on public.site_settings for select using (true);
drop policy if exists "reglages : admin" on public.site_settings;
create policy "reglages : admin" on public.site_settings for all using (public.is_admin()) with check (public.is_admin());

do $$
declare t text;
begin
  foreach t in array array['categories', 'services', 'projects', 'testimonials', 'team_members', 'process_steps', 'site_values'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('drop policy if exists "lecture publique" on public.%I', t);
    execute format('create policy "lecture publique" on public.%I for select using (published or public.is_admin())', t);
    execute format('drop policy if exists "admin : tout" on public.%I', t);
    execute format('create policy "admin : tout" on public.%I for all using (public.is_admin()) with check (public.is_admin())', t);
  end loop;
end $$;

-- ---------------------------------------------------------------------
-- 3. DEMANDES DE DEVIS (formulaire de contact)
-- ---------------------------------------------------------------------
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 200),
  phone text check (char_length(phone) <= 60),
  email text check (char_length(email) <= 200),
  service text check (char_length(service) <= 200),
  budget text check (char_length(budget) <= 200),
  message text check (char_length(message) <= 5000),
  attachment_path text,
  status text not null default 'nouvelle' check (status in ('nouvelle', 'en_cours', 'traitee', 'archivee')),
  created_at timestamptz not null default now());
alter table public.leads enable row level security;
drop policy if exists "devis : envoi public" on public.leads;
create policy "devis : envoi public" on public.leads for insert to anon, authenticated with check (true);
drop policy if exists "devis : admin" on public.leads;
create policy "devis : admin" on public.leads for all using (public.is_admin()) with check (public.is_admin());

-- ---------------------------------------------------------------------
-- 4. ESPACE CLIENT (projets, fichiers, messages)
-- ---------------------------------------------------------------------
create table if not exists public.client_projects (
  id uuid primary key default gen_random_uuid(), client_id uuid not null references public.profiles on delete cascade,
  title text not null, description text, status text not null default 'En cours',
  progress int not null default 0 check (progress between 0 and 100), due_date date,
  position int not null default 0, created_at timestamptz not null default now());
create table if not exists public.client_files (
  id uuid primary key default gen_random_uuid(), project_id uuid not null references public.client_projects on delete cascade,
  name text not null, storage_path text not null, created_at timestamptz not null default now());
create table if not exists public.client_messages (
  id uuid primary key default gen_random_uuid(), project_id uuid not null references public.client_projects on delete cascade,
  sender text not null check (sender in ('client', 'agence')), author_id uuid default auth.uid(),
  body text not null check (char_length(body) between 1 and 4000), created_at timestamptz not null default now());

alter table public.client_projects enable row level security;
alter table public.client_files enable row level security;
alter table public.client_messages enable row level security;

drop policy if exists "projets client : lecture" on public.client_projects;
create policy "projets client : lecture" on public.client_projects for select using (client_id = auth.uid() or public.is_admin());
drop policy if exists "projets client : admin" on public.client_projects;
create policy "projets client : admin" on public.client_projects for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "fichiers client : lecture" on public.client_files;
create policy "fichiers client : lecture" on public.client_files for select
  using (public.is_admin() or exists (select 1 from public.client_projects p where p.id = project_id and p.client_id = auth.uid()));
drop policy if exists "fichiers client : admin" on public.client_files;
create policy "fichiers client : admin" on public.client_files for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "messages : lecture" on public.client_messages;
create policy "messages : lecture" on public.client_messages for select
  using (public.is_admin() or exists (select 1 from public.client_projects p where p.id = project_id and p.client_id = auth.uid()));
drop policy if exists "messages : envoi client" on public.client_messages;
create policy "messages : envoi client" on public.client_messages for insert
  with check (sender = 'client' and author_id = auth.uid() and exists (select 1 from public.client_projects p where p.id = project_id and p.client_id = auth.uid()));
drop policy if exists "messages : admin" on public.client_messages;
create policy "messages : admin" on public.client_messages for all using (public.is_admin()) with check (public.is_admin());

-- ---------------------------------------------------------------------
-- 5. STOCKAGE DES FICHIERS
--    media        : images du site (lecture publique, envoi réservé à l'administrateur)
--    attachments  : pièces jointes des demandes de devis (privé)
--    client-files : fichiers livrables des clients (privé)
-- ---------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types) values
  ('media', 'media', true, 10485760, array['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml', 'image/gif']),
  ('attachments', 'attachments', false, 10485760, array['application/pdf', 'image/png', 'image/jpeg', 'image/webp', 'application/zip', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']),
  ('client-files', 'client-files', false, 52428800, null)
on conflict (id) do nothing;

drop policy if exists "media : lecture" on storage.objects;
create policy "media : lecture" on storage.objects for select using (bucket_id = 'media');
drop policy if exists "media : admin" on storage.objects;
create policy "media : admin" on storage.objects for all using (bucket_id = 'media' and public.is_admin()) with check (bucket_id = 'media' and public.is_admin());

drop policy if exists "pieces jointes : envoi" on storage.objects;
create policy "pieces jointes : envoi" on storage.objects for insert to anon, authenticated with check (bucket_id = 'attachments');
drop policy if exists "pieces jointes : lecture admin" on storage.objects;
create policy "pieces jointes : lecture admin" on storage.objects for select using (bucket_id = 'attachments' and public.is_admin());
drop policy if exists "pieces jointes : suppression admin" on storage.objects;
create policy "pieces jointes : suppression admin" on storage.objects for delete using (bucket_id = 'attachments' and public.is_admin());

drop policy if exists "fichiers client : lecture storage" on storage.objects;
create policy "fichiers client : lecture storage" on storage.objects for select
  using (bucket_id = 'client-files' and (public.is_admin() or (storage.foldername(name))[1] = auth.uid()::text));
drop policy if exists "fichiers client : admin storage" on storage.objects;
create policy "fichiers client : admin storage" on storage.objects for all using (bucket_id = 'client-files' and public.is_admin()) with check (bucket_id = 'client-files' and public.is_admin());
