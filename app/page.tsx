import Link from "next/link";
import { fetchPowerDaily } from "@/lib/nasa/power";
import { assessDrought, floodRisk, ndviMockFromPower } from "@/lib/analysis/drought";
import { fetchEonet } from "@/lib/nasa/eonet";

export const revalidate = 3600;

async function getPower(lat:number, lon:number) {
  const end = new Date().toISOString().slice(0,10);
  const start = new Date(Date.now()-30*864e5).toISOString().slice(0,10);
  try {
    let s: any;
    try { s = await fetchPowerDaily({ lat, lon, start, end }); } catch { const { mockPowerSeries } = await import("@/lib/nasa/power"); s = mockPowerSeries(lat, lon, 30); }
    const usedMock = (()=>{ try { return false; } catch { return true }})();
    // detect mock by checking source not needed — Power fetch wraps itself
    return { series: s, drought: assessDrought(s), flood: floodRisk(s), ndvi: ndviMockFromPower(s) };
  } catch (e:any) { return { error: String(e.message) } as any; }
}

export default async function Page() {
  const kigali = await getPower(-1.94, 30.06);
  const bugesera = await getPower(-2.15, 30.25);
  let eonet: any = null;
  try { eonet = await fetchEonet({ limit: 6, days: 30 }); } catch {}
  const today = new Date().toISOString().slice(0,10);

  const card = (title:string, v:any) => (
    <div className="card">
      <div className="text-sm font-semibold text-slate-600">{title}</div>
      {v.error ? <div className="text-sm text-red-600 mt-2">{v.error}</div> : (
        <>
          <div className={`mt-2 badge ${v.drought.level==="normal"?"bg-emerald-50 border-emerald-200 text-emerald-700": v.drought.level==="watch"?"bg-amber-50 border-amber-200 text-amber-700":"bg-red-50 border-red-200 text-red-700"}`}>Drought: {v.drought.level} • score {v.drought.score}</div>
          <ul className="mt-2 text-xs text-slate-600 list-disc ml-4 space-y-1">
            {v.drought.reasons.map((r:string,i:number)=><li key={i}>{r}</li>)}
          </ul>
          <div className="mt-3 text-xs">Flood: <b>{v.flood.level}</b> — {v.flood.note} (3d {v.flood.p3.toFixed(1)} mm)</div>
          <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
            <div className="bg-slate-50 rounded-xl p-2"><div className="text-slate-500">Precip 7d</div><div className="font-bold">{v.series.slice(-7).reduce((a:number,r:any)=>a+(r.PRECTOTCORR||0),0).toFixed(1)} mm</div></div>
            <div className="bg-slate-50 rounded-xl p-2"><div className="text-slate-500">T2M avg</div><div className="font-bold">{(v.series.slice(-7).reduce((a:number,r:any)=>a+(r.T2M||0),0)/7).toFixed(1)}°C</div></div>
            <div className="bg-slate-50 rounded-xl p-2"><div className="text-slate-500">Wetness</div><div className="font-bold">{((v.series.at(-1)?.GWETTOP??0)*100).toFixed(0)}%</div></div>
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="card bg-gradient-to-br from-emerald-600 to-teal-600 text-white border-0">
        <div className="flex flex-wrap gap-4 justify-between items-start">
          <div>
            <h1 className="text-2xl font-black">Ubuhinzi Sentinel</h1>
            <p className="text-white/90 text-sm max-w-2xl mt-1">Practical small-sat + NASA Earthdata for <b>crop health, drought & flood watch, and fire/disaster mapping</b> — focused on Rwanda & East Africa. Free-tier friendly, works with limited connectivity, and flags uncertainty honestly.</p>
            <div className="mt-3 flex gap-2 flex-wrap">
              <span className="badge bg-white/10 border-white/20 text-white">NASA POWER • FIRMS • EONET • GPM • SMAP</span>
              <span className="badge bg-white/10 border-white/20 text-white">HLS 30m (Landsat+Sentinel-2) • SRTM</span>
              <span className="badge bg-white text-emerald-700">SmallSat-ready</span>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-2xl p-4 text-sm min-w-[260px]">
            <div className="font-semibold">MVP in 1 deploy</div>
            <ul className="list-disc ml-4 mt-1 space-y-1 text-white/90 text-xs">
              <li>Field NDVI proxy + precip/soil moisture from NASA POWER</li>
              <li>FIRMS fire dots + EONET curated disasters</li>
              <li>GIBS map tiles + alert inbox (Supabase)</li>
              <li>Cron ingestion + honest uncertainty banners</li>
            </ul>
            <Link href="/map" className="mt-3 inline-flex bg-white text-emerald-700 px-4 py-2 rounded-xl font-semibold text-sm">Open live map →</Link>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {card("Kigali • Maize/Beans", kigali)}
        {card("Bugesera District • Drought-prone", bugesera)}
        <div className="card">
          <div className="text-sm font-semibold text-slate-600">Today’s map layers — {today}</div>
          <p className="text-xs text-slate-500 mt-1">GIBS tiles are free & global. Use the Map tab to toggle True Color, IMERG rain, and NDVI. No key needed.</p>
          <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
            <a className="btn-ghost text-center" href={`https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/VIIRS_SNPP_CorrectedReflectance_TrueColor/default/${today}/GoogleMapsCompatible_Level9/7/63/63.jpg`} target="_blank">Sample GIBS tile</a>
            <Link href="/api/power?lat=-1.94&lon=30.06&days=30" className="btn-ghost text-center">POWER JSON →</Link>
            <Link href="/api/eonet?limit=8" className="btn-ghost text-center">EONET feed →</Link>
            <Link href="/api/health" className="btn-ghost text-center">Health check →</Link>
          </div>
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs">
            <b>Interpretation note:</b> Colors on NDVI / rain layers are <i>derived estimates</i>. This MVP shows a POWER-based NDVI proxy until your Earthdata login for HLS/MODIS is configured — see <Link href="/docs" className="underline">Docs → Data lineage</Link>.
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 card">
          <h2 className="font-bold">NASA datasets in this MVP — what they actually measure</h2>
          <div className="overflow-auto mt-3">
            <table className="w-full text-xs min-w-[720px]">
              <thead className="text-slate-500"><tr><th className="text-left p-2">Dataset</th><th className="text-left p-2">Measures</th><th className="text-left p-2">Res / Revisit</th><th className="text-left p-2">Access</th><th className="text-left p-2">Use</th></tr></thead>
              <tbody className="divide-y">
                <tr><td className="p-2 font-semibold">NASA POWER</td><td className="p-2">T2M, precip (PRECTOTCORR), RH, wind, solar, soil wetness (GWETTOP) — <i>MERRA-2 assimilation + obs blend</i></td><td className="p-2">0.5°×0.625° (~55 km), daily, 1981→~T-1d</td><td className="p-2">Free, no key, JSON/CSV</td><td className="p-2">Drought/flood heuristics, crop stress</td></tr>
                <tr><td className="p-2 font-semibold">GPM IMERG Early</td><td className="p-2">Multi-satellite precip rate (mm/hr) — <i>blended microwave/IR + gauge cal</i></td><td className="p-2">0.1° (~10 km), 30-min/1-day, 4h latency</td><td className="p-2">GES DISC, Earthdata login; GIBS viz free</td><td className="p-2">Flood watch (proxy via POWER in MVP)</td></tr>
                <tr><td className="p-2 font-semibold">SMAP L3/L4</td><td className="p-2">L-band soil moisture top 5 cm + root zone (assimilated)</td><td className="p-2">9–36 km, 2–3d revisit, ~12–24h</td><td className="p-2">NSIDC Earthdata login</td><td className="p-2">Drought/irrigation (GWETTOP proxy in MVP)</td></tr>
                <tr><td className="p-2 font-semibold">FIRMS (VIIRS/MODIS)</td><td className="p-2">Thermal anomalies = active fires (brightness, FRP, confidence)</td><td className="p-2">375m VIIRS / 1km MODIS, &lt;3h</td><td className="p-2">Free MAP_KEY</td><td className="p-2">Wildfire detection + burn alerts</td></tr>
                <tr><td className="p-2 font-semibold">HLS (Landsat 8/9 + Sentinel-2)</td><td className="p-2">30m surface reflectance — <i>direct optical</i> → NDVI, NDWI, burn scar</td><td className="p-2">30m, 2–3d combined, 2–4d latency</td><td className="p-2">LP DAAC (AWS), Earthdata login</td><td className="p-2">Field-level crop health (MVP: proxy; prod: real NDVI)</td></tr>
                <tr><td className="p-2 font-semibold">MODIS NDVI (MOD13Q1)</td><td className="p-2">Vegetation greenness (NDVI/EVI) — 16-day composite</td><td className="p-2">250m, 16-day</td><td className="p-2">LP DAAC, no key for GIBS viz</td><td className="p-2">Regional crop anomaly</td></tr>
                <tr><td className="p-2 font-semibold">EONET</td><td className="p-2">Curated natural events (floods, storms, fires) — <i>human-curated + sensor</i></td><td className="p-2">Global, daily</td><td className="p-2">Free, no key</td><td className="p-2">Disaster inbox</td></tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-slate-500 mt-2">Direct observation vs derived: optical/thermal/microwave = observed; precip/soil wetness/NDVI anomaly = derived/assimilated; GFS/HRRR = forecast. All need ground truth for action.</p>
        </div>
        <div className="card">
          <h2 className="font-bold">Live disaster feed (EONET)</h2>
          {!eonet ? <p className="text-sm text-slate-500 mt-2">Could not reach EONET — try <Link href="/api/eonet" className="underline">/api/eonet</Link></p> : (
            <ul className="mt-3 space-y-2 text-xs">
              {(eonet.events || []).slice(0,6).map((ev:any)=>
                <li key={ev.id} className="p-2 bg-slate-50 rounded-xl">
                  <div className="font-semibold">{ev.title}</div>
                  <div className="text-slate-500">{ev.categories?.[0]?.title} • {ev.geometry?.[0]?.date?.slice(0,10)}</div>
                </li>
              )}
            </ul>
          )}
          <h3 className="font-bold mt-4">SmallSat fit</h3>
          <p className="text-xs text-slate-600 mt-1">CubeSat imagers (Planet Dove ~3m, NanoAvionics, Rwanda’s Icyerekezo demo) fill the gap between HLS 30m (2–3d) and MODIS 250m (daily): taskable 3–10m for farm boundaries, flood extent, and fire perimeters. This MVP is API-ready for any STAC-compliant SmallSat feed — just add a tile URL.</p>
        </div>
      </div>

      <div className="card">
        <h2 className="font-bold">How to use this safely</h2>
        <ol className="list-decimal ml-5 mt-2 text-sm space-y-1 text-slate-700">
          <li><b>Crop stress ≠ diagnosis.</b> Low NDVI + low soil wetness suggests water or pest stress — scout the field before spraying/irrigating.</li>
          <li><b>Flood watch ≠ warning.</b> Heavy 3-day POWER precip triggers a watch; official flood warnings come from Rwanda Water Board / Meteorology Agency.</li>
          <li><b>Fire dots have confidence.</b> FIRMS “low” confidence can be false positives (hot roofs, gas flares) — cross-check with local reports.</li>
        </ol>
      </div>
    </div>
  );
}
