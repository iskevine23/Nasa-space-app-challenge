export default function Docs() {
  return (
    <div className="space-y-6">
      <div className="card bg-gradient-to-br from-[#166534] to-emerald-600 text-white border-0">
        <h1 className="text-2xl font-black">📚 Learn — simple or expert, you choose</h1>
        <p className="text-white/90 text-sm mt-1">👩‍🌾 <b>Farmer?</b> Read the green cards. 👩‍🔬 <b>Advisor?</b> Open the grey “Technical” boxes.</p>
        <div className="mt-3 flex gap-2 text-xs">
          <span className="bg-white/15 border border-white/20 px-3 py-1 rounded-full">RW • EN • FR</span>
          <span className="bg-white text-emerald-700 px-3 py-1 rounded-full font-bold">No jargon promise</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="card border-2 border-emerald-200 bg-emerald-50/50">
          <h2 className="font-black text-[#166534]">🌿 For farmers — in 1 minute</h2>
          <div className="mt-3 space-y-3 text-sm">
            <div className="flex gap-2"><span>🛰️</span><div><b>Satellites look at rain & plants</b><div className="text-xs text-stone-600">Every day NASA satellites take photos of your area. We check: did it rain? Is soil dry? Are plants green?</div></div></div>
            <div className="flex gap-2"><span>📱</span><div><b>We explain like a neighbor</b><div className="text-xs text-stone-600">Instead of “GWETTOP 0.32” we say “Soil is dry (30%) — water tomorrow morning.”</div></div></div>
            <div className="flex gap-2"><span>✅</span><div><b>You check, we help</b><div className="text-xs text-stone-600">Satellite can be wrong (clouds!). Always look at your field before acting.</div></div></div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
            <div className="bg-white rounded-2xl p-3 border"><div className="text-lg">🟢</div><div className="font-bold">Good</div><div className="text-stone-500">Gukomeza<br/>Continue</div></div>
            <div className="bg-white rounded-2xl p-3 border"><div className="text-lg">🟡</div><div className="font-bold">Watch</div><div className="text-stone-500">Witondere<br/>Prepare</div></div>
            <div className="bg-white rounded-2xl p-3 border"><div className="text-lg">🔴</div><div className="font-bold">Action</div><div className="text-stone-500">Gira icyo ukora<br/>Act now</div></div>
          </div>
        </div>
        <div className="card">
          <h2 className="font-black">👨‍🌾 Common questions</h2>
          <div className="mt-3 space-y-2 text-sm">
            <details className="bg-stone-50 p-3 rounded-2xl"><summary className="font-bold cursor-pointer">What does “NDVI” mean? 🌱</summary><div className="text-xs text-stone-600 mt-1">How green plants are (0=brown, 1=very green). We show as “Plant health: good / needs check”.</div></details>
            <details className="bg-stone-50 p-3 rounded-2xl"><summary className="font-bold cursor-pointer">Is rain data perfect? 🌧️</summary><div className="text-xs text-stone-600 mt-1">No. Satellite sees big area (55km). Your hill may be different. We say “likely” and ask you to confirm.</div></details>
            <details className="bg-stone-50 p-3 rounded-2xl"><summary className="font-bold cursor-pointer">Will you send SMS? 📲</summary><div className="text-xs text-stone-600 mt-1">Soon! Now: check app daily or share chart via WhatsApp. SMS (like *162#) coming Phase 2.</div></details>
            <details className="bg-stone-50 p-3 rounded-2xl"><summary className="font-bold cursor-pointer">Free? 💰</summary><div className="text-xs text-stone-600 mt-1">Yes for farmers. NASA data is free. App costs ~$0-5/month to run — we don’t charge you.</div></details>
          </div>
        </div>
      </div>

      <details className="card">
        <summary className="font-black cursor-pointer">🔬 For advisors & tech — tap to open full technical docs</summary>
        <div className="mt-4 prose prose-sm max-w-none">
          <h3>System Architecture</h3>
          <pre className="text-xs bg-stone-900 text-stone-100 p-3 rounded-xl overflow-auto">{`[Farmer Browser] Next.js 15 + Leaflet + Recharts
  → /api/power (NASA POWER) → /api/eonet → /api/fields
[Vercel Cron 0 6 * * *] /api/ingest/power + /api/ingest/firms
[Supabase] sentinel_fields, observations, alerts (PostGIS + RLS)
[GIBS WMTS no key, FIRMS MAP_KEY, POWER no key] → HLS STAC next`}</pre>

          <h3>NASA Datasets — what they actually measure</h3>
          <div className="overflow-auto text-xs">
            <table className="w-full min-w-[800px]"><thead><tr><th className="text-left p-2">Dataset</th><th className="text-left p-2">Measures</th><th className="text-left p-2">Resolution</th><th className="text-left p-2">Use</th></tr></thead>
            <tbody className="divide-y text-xs"><tr><td className="p-2 font-bold">POWER</td><td className="p-2">T2M, PRECTOTCORR, GWETTOP — MERRA-2 assimilation</td><td className="p-2">55km, daily</td><td className="p-2">Drought/flood heuristic</td></tr>
            <tr><td className="p-2 font-bold">GPM IMERG</td><td className="p-2">Precip rate, blended microwave/IR</td><td className="p-2">10km, 30min</td><td className="p-2">Flood watch proxy</td></tr>
            <tr><td className="p-2 font-bold">FIRMS VIIRS</td><td className="p-2">Thermal anomaly, FRP</td><td className="p-2">375m, under 3h</td><td className="p-2">Fire</td></tr>
            <tr><td className="p-2 font-bold">HLS L30/S30</td><td className="p-2">30m reflectance → NDVI</td><td className="p-2">30m, 2-3d</td><td className="p-2">Field NDVI (prod)</td></tr>
            <tr><td className="p-2 font-bold">EONET</td><td className="p-2">Curated events</td><td className="p-2">Global</td><td className="p-2">Disaster inbox</td></tr>
            </tbody></table>
          </div>
          <p className="text-xs text-stone-500 mt-2">Full lineage, costs & roadmap in GitHub README → /supabase/schema.sql etc.</p>
          <pre className="text-xs bg-stone-900 text-stone-100 p-3 rounded-xl overflow-auto">{`GET /api/power?lat=-1.94&lon=30.06&days=30
POST /api/fields { name, crop, lat, lon, area_ha, polygon }
Vercel env: NEXT_PUBLIC_SUPABASE_URL, ANON_KEY, SERVICE_ROLE_KEY, FIRMS_MAP_KEY`}</pre>
        </div>
      </details>

      <div className="card bg-amber-50 border-amber-200 text-sm">
        <b>⚠️ Trust note:</b> Satellite advice is <b>advisory only</b>. For floods/storms, follow <b>Rwanda Meteorology Agency & MINEMA</b>. We show “confidence: modeled estimate” and ask for ground photo before closing alerts.
      </div>
    </div>
  );
}
