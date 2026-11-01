-- ==============================================================================
-- FocusFlow Database Migration Schema for Supabase (PostgreSQL)
-- Safe to run multiple times (Idempotent)
-- ==============================================================================

-- 1. Enable UUID Extension
create extension if not exists "uuid-ossp";

-- ------------------------------------------------------------------------------
-- Table 1: profiles
-- Linked 1-to-1 with Supabase Auth (auth.users)
-- ------------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  student_name text not null default 'Student',
  grade_level text default 'Class 10 — Board Exam Aspirant',
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.profiles enable row level security;

-- Policies for profiles (Drop first if exists, then create)
drop policy if exists "Users can view their own profile" on public.profiles;
create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "Users can insert their own profile" on public.profiles;
create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- ------------------------------------------------------------------------------
-- Table 2: study_sessions
-- Records every completed Pomodoro or focus block
-- ------------------------------------------------------------------------------
create table if not exists public.study_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  subject text not null,
  topic text,
  duration_minutes integer not null check (duration_minutes > 0),
  mode text not null default 'focus' check (mode in ('focus', 'short_break', 'long_break')),
  completed_at timestamp with time zone default timezone('utc'::text, now()) not null,
  date_key text not null, -- Format: YYYY-MM-DD for fast date-based queries & charts
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Index for speedy streak and analytics retrieval
create index if not exists idx_study_sessions_user_date on public.study_sessions (user_id, date_key);

-- Enable Row Level Security (RLS)
alter table public.study_sessions enable row level security;

-- Policies for study_sessions
drop policy if exists "Users can view their own study sessions" on public.study_sessions;
create policy "Users can view their own study sessions"
  on public.study_sessions for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert their own study sessions" on public.study_sessions;
create policy "Users can insert their own study sessions"
  on public.study_sessions for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete their own study sessions" on public.study_sessions;
create policy "Users can delete their own study sessions"
  on public.study_sessions for delete
  using (auth.uid() = user_id);

drop policy if exists "Users can update their own study sessions" on public.study_sessions;
create policy "Users can update their own study sessions"
  on public.study_sessions for update
  using (auth.uid() = user_id);

-- ------------------------------------------------------------------------------
-- Table 3: study_goals
-- Daily focus target tracking
-- ------------------------------------------------------------------------------
create table if not exists public.study_goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  target_minutes integer not null default 180 check (target_minutes > 0),
  date_key text not null, -- Format: YYYY-MM-DD
  achieved boolean not null default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint unique_user_daily_goal unique (user_id, date_key)
);

-- Enable Row Level Security (RLS)
alter table public.study_goals enable row level security;

-- Policies for study_goals
drop policy if exists "Users can view their own study goals" on public.study_goals;
create policy "Users can view their own study goals"
  on public.study_goals for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert their own study goals" on public.study_goals;
create policy "Users can insert their own study goals"
  on public.study_goals for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update their own study goals" on public.study_goals;
create policy "Users can update their own study goals"
  on public.study_goals for update
  using (auth.uid() = user_id);

-- ------------------------------------------------------------------------------
-- Table 4: user_settings
-- Timer preferences & student settings
-- ------------------------------------------------------------------------------
create table if not exists public.user_settings (
  user_id uuid primary key references auth.users(id) on delete cascade,
  daily_goal_minutes integer not null default 180 check (daily_goal_minutes > 0),
  pomodoro_focus_minutes integer not null default 25 check (pomodoro_focus_minutes > 0),
  pomodoro_short_break_minutes integer not null default 5 check (pomodoro_short_break_minutes > 0),
  pomodoro_long_break_minutes integer not null default 15 check (pomodoro_long_break_minutes > 0),
  sound_enabled boolean not null default true,
  auto_start_breaks boolean not null default false,
  theme text not null default 'forest-dark',
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.user_settings enable row level security;

-- Policies for user_settings
drop policy if exists "Users can view their own settings" on public.user_settings;
create policy "Users can view their own settings"
  on public.user_settings for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert their own settings" on public.user_settings;
create policy "Users can insert their own settings"
  on public.user_settings for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update their own settings" on public.user_settings;
create policy "Users can update their own settings"
  on public.user_settings for update
  using (auth.uid() = user_id);

-- ------------------------------------------------------------------------------
-- Automated trigger to create profile & settings when a user signs up
-- ------------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, student_name, grade_level)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', 'Student'), 'Class 10')
  on conflict (id) do nothing;

  insert into public.user_settings (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  return new;
end;
$$ language plpgsql security definer;

-- Trigger execution on auth.users insert
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
