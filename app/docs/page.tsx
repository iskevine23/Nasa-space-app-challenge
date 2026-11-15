export default function Docs() {
  return (
    <div className="prose prose-sm max-w-none">
      <div className="card not-prose">
        <h1 className="text-2xl font-black">Documentation — Ubuhinzi Sentinel</h1>
        <p className="text-sm text-slate-600">All assumptions, costs, and limitations stated up front. Satellite data alone never triggers a farmer’s irreversible action.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-4 not-prose mt-4">
        <div className="card">
          <h2 className="font-bold">1) Scope & MVP (achievable in 2–3 weeks)</h2>
          <p className="text-sm text-slate-600">Focus: Rwanda + 50km buffer. One crop season. Works offline-first on low bandwidth.</p>
          <ul className="text-sm list-disc ml-4 mt-2 space-y-1">
            <li><b>MVP must deliver:</b> per-field POWER time series + drought/flood heuristic, GIBS map, FIRMS fire dots (or demo), EONET inbox, Supabase alerts, Vercel Cron.</li>
            <li><b>Out of scope for MVP:</b> yield prediction, SAR flood mapping (Sentinel-1), field-level SAR soil moisture downscaling, SMS gateway.</li>
            <li><b>Acceptance:</b> 3 demo fields in Kigali/Bugesera/Nyagatare show correct POWER fetch & plausible advisories within 2s; map loads &lt;3s on 3G; cron writes 1 row/day/field.</li>
          </ul>
          <h3 className="font-bold mt-3">Use cases prioritized</h3>
          <ol className="list-decimal ml-4 text-sm space-y-1">
            <li><b>Crop health watch</b> (NDVI anomaly vs baseline) — highest farmer value, low risk.</li>
            <li><b>Drought assessment</b> (30-d precip + GWETTOP) — triggers advisory, not payout.</li>
            <li><b>Fire detection</b> (FIRMS 375m) — community early notice.</li>
            <li><b>Flood watch</b> (GPM proxy → real IMERG later) + terrain (SRTM) overlay.</li>
          </ol>
        </div>
        <div className="card">
          <h2 className="font-bold">2) System Architecture</h2>
          <pre className="text-xs bg-slate-900 text-slate-100 p-3 rounded-xl overflow-auto">{`[Farmer/Advisor Browser]
  Next.js 15 (App Router) + Leaflet + Recharts
  → /api/power (NASA POWER)  → /api/eonet  → /api/fields
       ↓
[Vercel Functions + Cron 0 6 * * *]
  /api/ingest/power  /api/ingest/firms
       ↓
[Supabase Postgres] sentinel_fields, sentinel_observations, sentinel_alerts
  PostGIS + RLS, nightly backup, pg_cron optional
       ↓
[External: NASA GIBS WMTS (no key), FIRMS (MAP_KEY), POWER (no key)]
[Future: HLS STAC on AWS, SMAP/GPM NetCDF via GES DISC + Earthdata token]`}</pre>
          <p className="text-xs text-slate-500 mt-2">Alternative stack: swap Supabase → Firebase; Vercel → Fly.io; Leaflet → Maplibre. All APIs remain the same.</p>
        </div>
      </div>

      <div className="card not-prose mt-4">
        <h2 className="font-bold">3) Data ingestion → storage → analysis → viz → alerting</h2>
        <div className="grid md:grid-cols-5 gap-2 text-xs mt-2">
          <div className="p-3 bg-slate-50 rounded-xl"><b>Ingest</b><br/>POWER daily (no key) every 6h; FIRMS every 1h (if key); EONET on page load. Cron uses Vercel Crons (Hobby: 2 crons max).</div>
          <div className="p-3 bg-slate-50 rounded-xl"><b>Store</b><br/>Supabase Postgres. <code>sentinel_observations</code> keeps raw JSON + derived scores. Keep 2 years, then archive to Storage.</div>
          <div className="p-3 bg-slate-50 rounded-xl"><b>Preprocess</b><br/>Fill -999, convert dates, compute 7/30d sums, flag cloud (HLS QA later). No resampling in MVP.</div>
          <div className="p-3 bg-slate-50 rounded-xl"><b>Analyze</b><br/>Heuristic drought/flood (see <code>lib/analysis/drought.ts</code>). NDVI proxy until HLS token. Show uncertainty badge.</div>
          <div className="p-3 bg-slate-50 rounded-xl"><b>Viz/Alert</b><br/>Recharts + GIBS tiles. Alert on level≥warning → Supabase row → (next) email/SMS via Resend/Twilio.</div>
        </div>
      </div>

      <div className="card not-prose mt-4">
        <h2 className="font-bold">4) Validation, uncertainty, security, cost</h2>
        <ul className="text-sm list-disc ml-4 space-y-1">
          <li><b>Validation:</b> Every advisory shows source, resolution, latency, and “confidence: modeled estimate”. Require geotagged photo ground truth before closing an alert; cross-check precip against at least one local gauge.</li>
          <li><b>Uncertainty:</b> POWER is 55km — never claim field-level soil moisture; use it as regional context only. FIRMS FRP/ confidence shown as badge.</li>
          <li><b>Security:</b> Supabase RLS by user_id; service role only in server routes; no secrets in client. Rate limit /api/* (Upstash or in-memory).</li>
          <li><b>Accessibility:</b> Color-blind safe palette, Kinyarwanda toggle (next), CSV export for low-bandwidth, print-friendly advisories.</li>
          <li><b>Costs (monthly,MVP):</b> Vercel Hobby $0 (100 GB bandwidth, 100h func), Supabase Free (500MB DB, 1GB storage), NASA APIs $0. Expected &lt;$5/mo at &lt;100 fields. See vercel.json crons.</li>
        </ul>
      </div>

      <div className="card not-prose mt-4">
        <h2 className="font-bold">5) NASA datasets — detailed reference</h2>
        <div className="overflow-auto text-xs mt-2">
          <table className="w-full min-w-[900px]">
            <thead className="text-slate-500"><tr><th className="text-left p-2">Dataset</th><th className="text-left p-2">Access & Cost</th><th className="text-left p-2">Coverage / Update</th><th className="text-left p-2">Resolution</th><th className="text-left p-2">SmallSat pairing</th><th className="text-left p-2">Limits</th></tr></thead>
            <tbody className="divide-y">
              <tr><td className="p-2 font-semibold">POWER AG</td><td className="p-2">https://power.larc.nasa.gov/api/* — no key, free</td><td className="p-2">Global 1981–present, daily, 1-day lag</td><td className="p-2">0.5°×0.625° met; solar 1°</td><td className="p-2">Good context; pair with HLS for field truth</td><td className="p-2">Model-assimilated, not a sensor; 55km useless for micro-climate</td></tr>
              <tr><td className="p-2 font-semibold">GPM IMERG Early/Late/Final</td><td className="p-2">GES DISC + PPS, Earthdata login, free; GIBS viz no key</td><td className="p-2">Global 1998–present, 30-min → 1-day, 4h/12h/3.5mo latency</td><td className="p-2">0.1° (~10km)</td><td className="p-2">Calibrate SmallSat optical rain proxies</td><td className="p-2">Underestimates orographic precip; needs gauge cal (Final best)</td></tr>
              <tr><td className="p-2 font-semibold">SMAP L3 9km / L4 9km</td><td className="p-2">NSIDC, Earthdata login, free</td><td className="p-2">Global, 2–3d revisit, 12–24h</td><td className="p-2">9–36km</td><td className="p-2">Downscale with terrain + optical</td><td className="p-2">Fails in dense veg & RFI; use GWETTOP proxy in MVP</td></tr>
              <tr><td className="p-2 font-semibold">FIRMS NRT</td><td className="p-2">firms.modaps.eosdis.nasa.gov — free MAP_KEY</td><td className="p-2">Global, &lt;3h</td><td className="p-2">375m VIIRS / 1km MODIS</td><td className="p-2">CubeSat IR can task hotspots</td><td className="p-2">False positives; needs confidence filter</td></tr>
              <tr><td className="p-2 font-semibold">HLS L30/S30 v2.0</td><td className="p-2">LP DAAC AWS S3 (free, requester-pays egress), Earthdata login</td><td className="p-2">Global where Landsat+Sentinel overlap, 2–3d, 2–4d lag</td><td className="p-2">30m</td><td className="p-2">Ideal SmallSat cross-cal (3m Planet → 30m HLS)</td><td className="p-2">Cloudy in rainy season; needs QA band</td></tr>
              <tr><td className="p-2 font-semibold">Worldview/GIBS</td><td className="p-2">gibs.earthdata.nasa.gov — no key, free</td><td className="p-2">Global, daily</td><td className="p-2">250m–1km viz</td><td className="p-2">Quicklook before tasking SmallSat</td><td className="p-2">JPEG viz only — not for analysis</td></tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 mt-2">Complementary: Open-Meteo (free forecast), CHIRPS (5km precip, free), SRTM 30m DEM (terrain), Rwanda Land Cover (RCMRD), farmer ground photos.</p>
      </div>

      <div className="card not-prose mt-4">
        <h2 className="font-bold">6) Roadmap — phases & acceptance</h2>
        <ol className="list-decimal ml-4 text-sm space-y-2">
          <li><b>Phase 0 — MVP (week 1–2, this deploy)</b> — POWER + EONET + GIBS + FIRMS stub + field CRUD. <i>Done when:</i> health ok, 30-day chart renders, cron writes, map toggles.</li>
          <li><b>Phase 1 — Real NDVI (week 3–4)</b> — add Earthdata token → HLS NDVI via STAC (e.g. <code>https://cmr.earthdata.nasa.gov/stac/LPCLOUD</code>), compute z-score vs 5-yr baseline. <i>Done when:</i> field polygon returns median NDVI &lt;6h lag, QA-filtered.</li>
          <li><b>Phase 2 — Alerts & i18n (week 5–6)</b> — Resend email + WhatsApp (Twilio), Kinyarwanda, district agronomist role. <i>Done when:</i> warning creates email in &lt;2min, RLS passes.</li>
          <li><b>Phase 3 — Flood terrain (week 7–8)</b> — SRTM hand + Sentinel-1 SAR flood extent (Microsoft Planetary Computer). <i>Done when:</i> flood-prone fields flagged by hand &lt;10m.</li>
          <li><b>Phase 4 — SmallSat tasking (month 3+)</b> — ingest Planet/SkyFi STAC, calibrate to HLS. <i>Done when:</i> 3m imagery overlays within 24h of tasking.</li>
        </ol>
      </div>

      <div className="card not-prose mt-4">
        <h2 className="font-bold">7) Runnable code — key snippets</h2>
        <pre className="text-xs bg-slate-900 text-slate-100 p-3 rounded-xl overflow-auto">{`// 1) Fetch POWER (free, no key)
GET /api/power?lat=-1.94&lon=30.06&days=30
// → { series, drought:{level,score,reasons}, flood:{level} }

// 2) Add field
POST /api/fields { name, crop, lat, lon, area_ha, polygon }

// 3) Cron (vercel.json)
{ "crons": [{ "path": "/api/ingest/power?lat=-1.94&lon=30.06", "schedule": "0 6 * * *" }] }

// 4) Replace mock NDVI (lib/analysis/drought.ts)
// Replace ndviMockFromPower() with:
//   const ndvi = await fetchHLSNDVI(polygon, start, end) // via stac.get, mask QA, median
// See scripts/hls-ndvi.ts for reference

// 5) Supabase SQL → supabase/schema.sql
`}</pre>
        <p className="text-xs text-slate-500 mt-2">Full setup instructions below.</p>
      </div>

      <div className="card not-prose mt-4">
        <h2 className="font-bold">8) Deployment — Vercel + Supabase</h2>
        <pre className="text-xs bg-slate-900 text-slate-100 p-3 rounded-xl overflow-auto whitespace-pre-wrap">{`# 1) Supabase — run supabase/schema.sql in SQL editor (project poltendofpsexclyqizg)
# 2) Vercel env:
NEXT_PUBLIC_SUPABASE_URL=https://poltendofpsexclyqizg.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon>
SUPABASE_SERVICE_ROLE_KEY=<service_role>
FIRMS_MAP_KEY=<from https://firms.modaps.eosdis.nasa.gov/api/area/>  # optional for live fires
# 3) Deploy
git push origin arena/62d0d06e-nasa-space-app-challenge  # Vercel auto-deploys armyworm-guard project
# or new project:
vercel --prod --yes
# 4) Test
curl https://<your>.vercel.app/api/health
curl "https://<your>.vercel.app/api/power?lat=-1.94&lon=30.06&days=7"
# 5) Monitor: Vercel Logs + Supabase Table Editor; Backup: Supabase daily PITR (Pro) or pg_dump weekly (Free)
# Costs: Vercel Hobby $0, Supabase Free $0; scale to Pro when >500MB DB or >2 crons.`}</pre>
      </div>

      <div className="card not-prose mt-4 bg-emerald-50 border-emerald-200">
        <h2 className="font-bold">Assumptions & ethics</h2>
        <ul className="text-sm list-disc ml-4 space-y-1">
          <li>User location Kigali; pilot in Bugesera & Nyagatare.</li>
          <li>Users have smartphone + intermittent 3G; language Kinyarwanda/English/French.</li>
          <li>No claim of prediction; advisories only. Flood/fire always defer to Rwanda Meteorology Agency & MINEMA.</li>
          <li>Farmer data consent explicit; polygon & phone stored encrypted; retention 2 years.</li>
        </ul>
      </div>
    </div>
  );
}
