-- Ubuhinzi Sentinel — Supabase schema
-- Run in Supabase SQL editor for project poltendofpsexclyqizg
-- Safe to re-run (IF NOT EXISTS)

-- Enable PostGIS for future geospatial
create extension if not exists postgis;

-- Fields (farm polygons)
create table if not exists sentinel_fields (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  crop text not null default 'maize',
  lat double precision not null,
  lon double precision not null,
  area_ha double precision,
  polygon jsonb, -- GeoJSON-like [[lat,lon],...] simple for MVP; migrate to geography(Polygon) later
  owner_id uuid,
  created_at timestamptz not null default now()
);
alter table sentinel_fields enable row level security;
drop policy if exists "public read fields" on sentinel_fields;
create policy "public read fields" on sentinel_fields for select using (true);
drop policy if exists "public insert fields" on sentinel_fields;
create policy "public insert fields" on sentinel_fields for insert with check (true);

-- Observations (POWER, HLS, SMAP, etc.)
create table if not exists sentinel_observations (
  id uuid primary key default gen_random_uuid(),
  field_id uuid references sentinel_fields(id) on delete set null,
  lat double precision not null,
  lon double precision not null,
  observed_at date not null,
  source text not null, -- e.g. "NASA POWER", "HLS NDVI"
  payload jsonb not null,
  created_at timestamptz not null default now()
);
create index if not exists idx_obs_field_date on sentinel_observations(field_id, observed_at desc);
alter table sentinel_observations enable row level security;
drop policy if exists "public read obs" on sentinel_observations;
create policy "public read obs" on sentinel_observations for select using (true);
drop policy if exists "public insert obs" on sentinel_observations;
create policy "public insert obs" on sentinel_observations for insert with check (true);

-- Alerts
create table if not exists sentinel_alerts (
  id uuid primary key default gen_random_uuid(),
  type text not null, -- drought, flood, fire, ndvi_drop
  level text not null, -- normal, watch, warning, emergency
  message text not null,
  lat double precision,
  lon double precision,
  field_id uuid references sentinel_fields(id) on delete set null,
  payload jsonb,
  acknowledged boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists idx_alerts_level_date on sentinel_alerts(level, created_at desc);
alter table sentinel_alerts enable row level security;
drop policy if exists "public read alerts" on sentinel_alerts;
create policy "public read alerts" on sentinel_alerts for select using (true);
drop policy if exists "public insert alerts" on sentinel_alerts;
create policy "public insert alerts" on sentinel_alerts for insert with check (true);

-- Seed demo fields (idempotent via name unique check)
insert into sentinel_fields (name, crop, lat, lon, area_ha, polygon)
select * from (values
  ('Kigali Demo — Maize','maize',-1.94,30.06,1.2,'[[-1.96,30.04],[-1.96,30.08],[-1.92,30.08],[-1.92,30.04]]'::jsonb),
  ('Bugesera — Beans','beans',-2.15,30.25,0.8,'[[-2.17,30.23],[-2.17,30.27],[-2.13,30.27],[-2.13,30.23]]'::jsonb),
  ('Nyagatare — Rice','rice',-1.30,30.32,2.0,'[[-1.32,30.30],[-1.32,30.34],[-1.28,30.34],[-1.28,30.30]]'::jsonb)
) as v(name,crop,lat,lon,area_ha,polygon)
where not exists (select 1 from sentinel_fields where sentinel_fields.name = v.name);
