-- Run this in Supabase SQL editor

create table if not exists workout_logs (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  date date not null,
  week_number int not null,
  day_name text not null,
  session_type text not null, -- swim, bike, run, gym, brick, rest
  planned text,
  completed boolean default false,
  duration_min int,
  distance_km float,
  avg_hr int,
  max_hr int,
  avg_watts int,
  calories int,
  rpe int, -- 1-10 rate of perceived exertion
  mood int, -- 1-5
  notes text,
  source text default 'manual' -- manual, healthkit, garmin
);

create table if not exists nutrition_logs (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  date date not null,
  calories int,
  protein_g int,
  carbs_g int,
  fat_g int,
  water_ml int,
  notes text
);

create table if not exists inbody_logs (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  date date not null,
  weight_kg float,
  muscle_mass_kg float,
  body_fat_kg float,
  body_fat_pct float,
  bmi float,
  score int
);

-- Enable Row Level Security (open for now, add auth later)
alter table workout_logs enable row level security;
alter table nutrition_logs enable row level security;
alter table inbody_logs enable row level security;

create policy "Allow all" on workout_logs for all using (true);
create policy "Allow all" on nutrition_logs for all using (true);
create policy "Allow all" on inbody_logs for all using (true);
