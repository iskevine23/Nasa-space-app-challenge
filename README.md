# Ubuhinzi Sentinel — NASA SmallSat Agriculture & Disaster Hub

**Live MVP:** `https://<your-vercel>.vercel.app` • Stack: Next.js 15 + Supabase Postgres + Vercel Cron  
**Focus:** Rwanda & East Africa (Kigali, Bugesera, Nyagatare pilot) — crop health, drought, flood & wildfire watches using NASA Earthdata + SmallSat-ready tiles.

> Satellite indicators are **advisory only**. Confirm with field scouting and official warnings (Rwanda Meteorology Agency, MINEMA, Rwanda Water Board).

---

## 1) Project Scope — Focused, Achievable MVP

**High-value use cases (prioritized):**

1. **Crop health monitoring** — NDVI anomaly vs 5-year baseline (MVP: POWER-derived proxy, Prod: HLS 30 m)
2. **Drought assessment** — 7/30-day precip + top-soil wetness heuristic (POWER + SMAP path)
3. **Flood watch** — 3-day heavy rain + SRTM terrain hand (GPM IMERG in prod)
4. **Wildfire detection** — FIRMS VIIRS 375 m active fires + EONET curated events
5. **Disaster impact mapping** — GIBS true-color + IMERG rain + field polygons

**MVP delivers (2 weeks):**
- Per-field time series (POWER daily) + heuristic drought/flood level
- Leaflet map with NASA GIBS tiles (no key), demo fire points, field polygons
- Supabase `sentinel_fields / observations / alerts` + Vercel Cron ingestion
- `/api/health`, `/api/power`, `/api/eonet`, `/api/fields` working end-to-end
- Docs with lineage, limits, and next-phase plan

**Acceptance:** 3 demo fields render 30-day chart <2 s; map <3 s on 3G; cron writes ≥1 obs/field/day; all advisories show source, resolution, and disclaimer.

---

## 2) NASA Datasets — What They Measure & How They Help

| Dataset | Measures (sensor) | Coverage / Update | Resolution | Access & Cost | SmallSat Fit | Practical Limitations |
|---|---|---|---|---|---|---|
| **NASA POWER (AG)** | T2M, PRECTOTCORR (bias-corrected precip), RH2M, WS2M, solar, GWETTOP/ROOT (soil wetness profile) — **MERRA-2 reanalysis assimilation + obs blend** | Global, 1981→~T-1 day, daily | Meteorology 0.5°×0.625° (~55 km) | `https://power.larc.nasa.gov/api/` — **free, no key**, JSON/CSV | Regional context only; pair with HLS for field truth | Model-assimilated, not a sensor; too coarse for micro-climate; -999 fill values |
| **GPM IMERG Early/Late/Final (V07)** | Multi-sat precip rate (mm/hr) — **blended microwave + IR + gauge cal**, quasi-Lagrangian morphing | Global 90°N–90°S, 1998→present, 30-min/1-day; latency 4 h / 12 h / 3.5 mo | 0.1° (~10 km) | GES DISC + PPS (Earthdata login, free); GIBS viz **no key** | Calibrates SmallSat optical rain proxies | Underestimates orographic precip; Early is extrapolation, Final adds gauges — Final is research-grade |
| **SMAP L3 (SPL3SMP) / L4 (SPL4SMGP)** | **L-band radiometer** brightness T → surface soil moisture (top 5 cm); L4 assimilates into land model → root zone | Global 86.4°N/S, 2015→present, 2–3-day revisit, ~12–24 h | 36 km L3 / 9 km L4 (EASE-Grid) | NSIDC DAAC (Earthdata login, free), HDF5 | Downscale with optical+terrain; cue irrigation | Fails in dense veg, frozen, RFI; bias in forests; use with in-situ cal |
| **FIRMS NRT (VIIRS SNPP/NOAA-20/21 + MODIS)** | **Thermal anomalies**: brightness temp, FRP (fire radiative power), confidence | Global, <3 h via LANCE; US/Canada <1–30 min via SSEC | VIIRS 375 m (I-bands), MODIS 1 km | `firms.modaps.eosdis.nasa.gov/api/area/csv/<MAP_KEY>` — **free key** | CubeSat IR can task hotspots within hours | False positives (hot roofs, flares); “low” confidence noisy; needs FRP/confidence filter |
| **HLS (HLSL30 + HLSS30 v2.0)** | Harmonized **30 m surface reflectance** (OLI + MSI) — direct optical → NDVI=(NIR-Red)/(NIR+Red), NDWI, burn scar | Global where Landsat+Sentinel overlap, 2013/2015→present, 2–3-day combined, 2–4-day latency | 30 m, sinusoidal/UTM, COG on AWS | LP DAAC AWS S3 (Earthdata login, free, requester-pays egress) + STAC `cmr.earthdata.nasa.gov/stac/LPCLOUD` | Ideal cross-cal for 3 m Planet Doves (Rwanda Icyerekezo) | Cloud in rainy season; needs Fmask QA; S3 egress cost if compute outside `us-west-2` |
| **MODIS Vegetation (MOD13Q1/MYD13)** | NDVI/EVI 16-day composite — continuity from AVHRR | Global, 2000→present, 16-day | 250 m SIN Grid | LP DAAC; GIBS viz **no key** | Regional anomaly when HLS gaps | 16-day composite lags crop stress; cloud contamination |
| **NASA GIBS / Worldview** | Tiled visualizations (True Color, IMERG rain, NDVI) — **visual only** | Global, daily | 250 m–1 km JPEG | `gibs.earthdata.nasa.gov` — **no key** | Quicklook before tasking SmallSat | Tiles are **not for analysis** — use source NetCDF/HDF for math |
| **NASA EONET** | Curated natural events (floods, wildfires, storms, volcanoes) — human + sensor | Global, near-real-time | Event points/polygons | `eonet.gsfc.nasa.gov/api/v3/events` — **no key** | Disaster inbox, trigger SmallSat tasking | Curated, not exhaustive; latency hours–days |

**Complementary (non-NASA):** CHIRPS 5 km daily precip (free, 1981→), Open-Meteo Forecast (free, GFS/ECMWF blend, hourly), SRTM 30 m DEM (terrain/hand), Rwanda Land Cover (RCMRD), Sentinel-1 SAR flood extent (Microsoft Planetary Computer), ground geotagged photos.

**Observed vs derived vs forecast — must tell users:**
- **Directly observed:** optical reflectance, thermal brightness, L-band microwave (HLS, MODIS, VIIRS, SMAP L1) — errors = calibration, cloud, RFI.
- **Derived/assimilated:** POWER GWETTOP, GPM precipCal, SMAP L4, NDVI — model + bias-corrected blends; need ground truth.
- **Forecast:** Open-Meteo/GFS (not satellite-observed); uncertainty grows with lead time.

---

## 3) Implementation Plan

### 3.1 Architecture & Stack

```
[Browser] Next.js 15 App Router + Tailwind + Recharts + Leaflet + react-leaflet
  ├─ /api/power  → NASA POWER (or mock fallback) → drought.ts heuristics
  ├─ /api/eonet  → EONET curations
  ├─ /api/fields → Supabase (or mock)
  └─ /map        → GIBS WMTS tiles + Leaflet LayersControl
[Vercel Functions + Cron]  crons: /api/ingest/power (daily 06:00 UTC), /api/ingest/firms (6-hourly)
[Supabase Postgres]  sentinel_fields, sentinel_observations, sentinel_alerts (+ PostGIS, RLS, pg_cron optional)
[External] POWER (free), FIRMS (MAP_KEY), EONET (free), GIBS (free)
[Next] HLS STAC on AWS (with EDL_TOKEN), SMAP/GPM NetCDF (worker with GDAL)
```

**Alternatives:** Supabase → Firebase/Neon; Vercel → Fly.io/Render; Leaflet → MapLibre; Recharts → visx. All APIs stay identical.

### 3.2 Data Flow

1. **Ingest:** Vercel Cron hits `/api/ingest/power?lat&lon` (free POWER) and `/api/ingest/firms` (if key). Uses `fetch` with 1-h revalidate.
2. **Store:** Writes raw JSON to `sentinel_observations.payload`, derived `drought.level/score` alongside. 2-year retention, then archive to Supabase Storage.
3. **Preprocess:** Fill `-999`, ISO dates, 7/30-day sums, flag cloud via HLS QA (future).
4. **Analysis:** Heuristic thresholds in `lib/analysis/drought.ts` (watch/warning/emergency) + `floodRisk()`. NDVI proxy until HLS token — swap one function.
5. **Viz:** Recharts composed chart (precip bars + T2M + NDVI lines); Leaflet with GIBS WMTS (`VIIRS_SNPP_CorrectedReflectance_TrueColor`, `GPM_IMERG_Precipitation_Rate`, `MODIS_Terra_NDVI_8Day`).
6. **Alerting:** `drought.level !== normal` → insert `sentinel_alerts`; next phase → Resend email + Twilio WhatsApp (or Rwanda SMS gateway).

### 3.3 Validation, Uncertainty, Scalability, Security, Cost

- **Validation:** Every chart shows *source, resolution, latency, confidence badge*. Require geotagged ground photo before closing alert; cross-check POWER precip with ≥1 local gauge (CHIRPS or station).
- **Uncertainty communication:** POWER is 55 km — label “regional context, not field soil moisture.” FIRMS FRP + confidence shown as colored badges. NDVI shows `proxy until HLS` banner when mock.
- **Scalability:** Stateless Vercel functions, Supabase connection pooling; add `idx_obs_field_date` & partition by month after 10 k fields; move HLS compute to background worker (EKS/Modal/GDAL WASM) to avoid function timeouts.
- **Security:** Supabase RLS (owner_id = auth.uid()); service_role only in server routes; no secrets in client; rate-limit `/api/*` (Upstash Redis); validate polygons with Zod.
- **Accessibility:** Color-blind safe palette, Kinyarwanda/English/French toggle, CSV export, print advisories, works without JS after initial paint.
- **Cost control (MVP):** Vercel Hobby $0, Supabase Free $0. At 100 fields × 1 obs/day = 3 k rows/mo → <10 MB/mo. Scale to Pro only when >500 MB DB or >2 Crons needed (~$20–$25/mo total, plus $0.09/GB HLS egress).

### 3.4 Phased Roadmap

| Phase | Weeks | Deliverable | Acceptance Criteria |
|---|---|---|---|
| **0 — MVP** | 1–2 | This repo — POWER+EONET+GIBS+FIRMS stub+CRUD | 3 demo fields, chart+map <3 s, cron writes, `/api/health` ok |
| **1 — Real NDVI** | 3–4 | HLS via STAC, QA-filtered median NDVI, 5-yr z-score | Polygon returns median NDVI <6 h, QA-filtered, anomaly flagged at z<-1.5 |
| **2 — Alerts & i18n** | 5–6 | Email/WhatsApp, Kinyarwanda, roles (farmer/advisor/admin) | Warning creates message <2 min, RLS passes, a11y audit |
| **3 — Flood terrain** | 7–8 | SRTM hand index + Sentinel-1 SAR flood masks | Flood-prone fields flagged by HAND <10 m, SAR extent overlays |
| **4 — SmallSat tasking** | 9–12 | Planet/SkyFi STAC ingest, cross-cal to HLS, 3 m overlay | Tasked image visible <24 h, co-registered within 1 pixel |

### 3.5 Runnable Code — Key Parts

```bash
git clone https://github.com/iskevine23/Nasa-space-app-challenge.git
cd Nasa-space-app-challenge
cp .env.example .env.local  # fill Supabase URL/keys (see /supabase/schema.sql)
npm install --legacy-peer-deps
npm run dev  # http://localhost:3000 — mock data auto-used if NASA endpoints blocked
```

**Replace mock NDVI:**
```ts
// lib/analysis/drought.ts — swap this:
import { fetchHLSNDVI } from "@/lib/nasa/hls"; // new module
const ndvi = await fetchHLSNDVI(polygon, start, end, edlToken); // real 30 m median
// See scripts/hls-ndvi.ts for the STAC+Fmask recipe and LP DAAC link
```

**Add a field:**
```bash
curl -X POST http://localhost:3000/api/fields \
  -H "Content-Type: application/json" \
  -d '{"name":"Bugesera plot 2","crop":"beans","lat":-2.15,"lon":30.25,"area_ha":0.8,"polygon":[[-2.17,30.23],[-2.17,30.27],[-2.13,30.27],[-2.13,30.23]]}'
curl "http://localhost:3000/api/power?lat=-2.15&lon=30.25&days=30" | jq .drought
```

### 3.6 Deployment — Vercel + Supabase (this repo)

**Supabase:**
```sql
-- Run supabase/schema.sql in SQL Editor for project poltendofpsexclyqizg
-- Creates sentinel_fields/observations/alerts + RLS + indexes + 3 demo fields
```

**Vercel env (all env, no prefix):**
```
NEXT_PUBLIC_SUPABASE_URL=https://poltendofpsexclyqizg.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ... (anon)
SUPABASE_SERVICE_ROLE_KEY=eyJ... (service_role)  # server only
FIRMS_MAP_KEY=xxxxx  # optional — from https://firms.modaps.eosdis.nasa.gov/api/area/
```

**Deploy:**
```bash
git push origin arena/62d0d06e-nasa-space-app-challenge
# Vercel → import https://github.com/iskevine23/Nasa-space-app-challenge (framework: Next.js, build: next build)
# Add env above, deploy. Crons in vercel.json run auto; test with:
curl https://<your>.vercel.app/api/health
curl "https://<your>.vercel.app/api/power?lat=-1.94&lon=30.06&days=7"
# Monitor: Vercel Logs + Supabase Table Editor; Backup: Supabase PITR (Pro) or weekly pg_dump (Free)
```

**Operating cost (est.):** MVP $0–$5/mo; with HLS compute + email ~$25/mo; SmallSat tasking extra (Planet $$, SkyFi pay-per-scene). See Docs → Deployment for full checklist including monitoring, backup, and cost table.

---

## 4) Local Dev Notes

- Sandbox outbound is restricted — NASA fetches auto-fall back to **mock time series** locally. Real NASA data appears on Vercel where outbound is open. Look for `"mock": true` in `/api/power` JSON.
- Same for Supabase writes — local falls back to mock fields/alerts; Vercel writes real rows.
- GIBS tiles are plain `<img>` — they load even in sandbox.

## 5) Ethics & Assumptions

- Pilot area Kigali/Bugesera/Nyagatare; language Kinyarwanda/English/French; smartphone + intermittent 3G.
- Farmer polygon + phone stored with explicit consent; retention 2 years; no yield predictions in MVP.
- All advisories defer to Rwanda Meteorology Agency & MINEMA for warnings; this app is a **decision-support** layer.

## 6) References

- POWER API: https://power.larc.nasa.gov/docs/services/api/
- GPM IMERG: https://gpm.nasa.gov/data/directory & https://disc.gsfc.nasa.gov/datasets/GPM_3IMERGDE_07/summary
- FIRMS: https://www.earthdata.nasa.gov/data/tools/firms + https://firms.modaps.eosdis.nasa.gov/api/area/
- SMAP: https://nsidc.org/data/spl3smp* & https://nsidc.org/data/spl4smgp
- HLS: https://lpdaac.usgs.gov/products/hlss30v002/ & STAC https://cmr.earthdata.nasa.gov/stac/LPCLOUD
- GIBS: https://gibs.earthdata.nasa.gov + Worldview https://worldview.earthdata.nasa.gov
- EONET: https://eonet.gsfc.nasa.gov/api/v3/docs

---

*Built for NASA Space Apps Challenge — Kigali, 2026-11-15.*
