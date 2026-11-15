import Link from "next/link";
import { rwandaImpact, smallSatStory, partners } from "@/lib/data/rwanda";

export const metadata = { title: "Pitch — Ubuhinzi Sentinel | NASA Space Apps" };

export default function Pitch() {
  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Cover */}
      <div className="card bg-gradient-to-br from-[#0f2e1a] via-[#166534] to-[#16a34a] text-white border-0 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -mr-24 -mt-24" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-300/10 rounded-full blur-3xl -ml-12 -mb-12" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 px-4 py-1.5 rounded-full text-xs">NASA Space Apps Challenge 2025 • Kigali • SmallSats for Agriculture & Disaster</div>
          <h1 className="text-4xl md:text-[44px] font-black leading-tight mt-4"><span className="text-emerald-200">Ubuhinzi</span> Sentinel<br/>Your Farm from Space</h1>
          <p className="text-white/85 text-[15px] mt-3 max-w-[620px] leading-relaxed">Rwandan farmers farm on 0.6 ha — one late rain = hunger. NASA data is free but never reaches them. We translate <b className="text-white">POWER + GPM + FIRMS + EONET</b> into <b className="text-white">plain Kinyarwanda in 10 seconds</b> — today at 55 km, tomorrow at 3 m with Rwanda’s <b className="text-white">Icyerekezo-1</b> SmallSat.</p>
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="bg-white text-[#14532d] px-4 py-2 rounded-full text-xs font-black">🟢 Live: ubuhinzi-sentinel.vercel.app</span>
            <span className="bg-white/15 border border-white/20 px-4 py-2 rounded-full text-xs">🌿 Muraho! • Hello Farmer • Bonjour</span>
            <span className="bg-white/15 border border-white/20 px-4 py-2 rounded-full text-xs">🗣️ Kinyarwanda • English • Français</span>
          </div>
          <div className="mt-6 grid grid-cols-3 gap-3 max-w-[640px]">
            {rwandaImpact.problem.stats.map(s => (
              <div key={s.label} className="bg-white/10 backdrop-blur border border-white/15 rounded-2xl p-3 text-center">
                <div className="text-xl">{s.icon}</div><div className="font-black text-white">{s.value}</div><div className="text-xs text-white/70 leading-tight">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* The 30-sec story */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="card border-l-4 border-l-sky-500">
          <div className="text-xs font-black text-sky-700">01 — THE PROBLEM</div>
          <h2 className="font-black text-lg mt-1">Farmers farm blind</h2>
          <p className="text-sm text-stone-600 mt-2">70% of Rwandans farm; 32% face seasonal hunger. Drought in <b>Bugesera</b> (1 in 3 seasons), flood in <b>Musanze</b>, heat in <b>Nyagatare</b>. Meteo Rwanda warns by radio — but not per-hill, not per-field, not in Kinyarwanda the farmer can act on.</p>
          <div className="mt-3 text-xs p-3 bg-sky-50 border border-sky-200 rounded-2xl">💡 <b>Insight:</b> NASA SmallSats data is <b>free</b> — POWER, GPM, FIRMS, HLS — but it lives in English PDFs at 55 km resolution. Farmers need it at 3 m, in 1 sentence.</div>
        </div>
        <div className="card border-l-4 border-l-emerald-500">
          <div className="text-xs font-black text-emerald-700">02 — OUR SOLUTION</div>
          <h2 className="font-black text-lg mt-1">Translator, not dashboard</h2>
          <p className="text-sm text-stone-600 mt-2">We don’t show charts first — we show a <b>traffic light</b>:</p>
          <div className="mt-2 space-y-1.5 text-xs">
            <div className="flex gap-2 items-center bg-emerald-50 border border-emerald-200 rounded-xl p-2"><span className="dot-good"/> <b>🟢 Good</b> — Komeza, afata foto gusa</div>
            <div className="flex gap-2 items-center bg-amber-50 border border-amber-200 rounded-xl p-2"><span className="dot-watch"/> <b>🟡 Watch</b> — Humbika, vomeera mu gitondo</div>
            <div className="flex gap-2 items-center bg-red-50 border border-red-200 rounded-xl p-2"><span className="dot-bad"/> <b>🔴 Alert</b> — Vugana n’umujyanama, ntahingire</div>
          </div>
          <div className="mt-3 text-xs text-stone-500">Built in Next.js 15 • Works on $30 phone • Offline mock → *162# USSD next.</div>
        </div>
        <div className="card border-l-4 border-l-amber-500">
          <div className="text-xs font-black text-amber-700">03 — WHY NOW / SMALLSAT</div>
          <h2 className="font-black text-lg mt-1">55 km today → 3 m tomorrow</h2>
          <p className="text-sm text-stone-600 mt-2">Today: NASA POWER 55 km = district blur — good enough to know <b>Bugesera is drier than last year</b>. Tomorrow: <b>Icyerekezo-1</b> (Vision) 3U CubeSat — Rwandan-built, 3 m daily, sees which <b>row</b> needs water.</p>
          <div className="mt-3 text-xs bg-amber-50 border border-amber-200 rounded-2xl p-3"><b>Icyerekezo-1:</b> 3U CubeSat, 3 m RGB + 10 m NIR, 400 km SSO, rideshare ~$300k. Rwanda already built RwaSat-1 (2019) — we’re the 2nd generation.</div>
        </div>
      </div>

      {/* How NASA data is used - validity core */}
      <div className="card">
        <h2 className="font-black text-xl text-[#166534]">🛰️ How we use NASA — honestly (no black box)</h2>
        <p className="text-xs text-stone-500">Every card shows <b>Source</b> • <b>Resolution</b> • <b>Confidence</b> • <b>Advisory only</b>. Full table in <Link href="/docs" className="underline">Docs</Link>.</p>
        <div className="mt-4 grid md:grid-cols-4 gap-3 text-sm">
          {[
            { icon: "🌧️", name: "NASA POWER", what: "Rain & soil (MERRA-2 blend)", res: "55 km, daily", trust: "Regional — we flag when soil null → —", color: "bg-sky-50 border-sky-200" },
            { icon: "🔥", name: "FIRMS VIIRS", what: "Thermal anomaly + FRP", res: "375 m, <3 h", trust: "Confidence: low/mid/high — we show it", color: "bg-orange-50 border-orange-200" },
            { icon: "🗺️", name: "GIBS / Worldview", what: "True Color + IMERG rain + NDVI tiles", res: "250 m, visual", trust: "Photo only — not for counting", color: "bg-emerald-50 border-emerald-200" },
            { icon: "🌱", name: "HLS (30 m)", what: "NDVI = (NIR-Red)/(NIR+Red) from Landsat+Sentinel", res: "30 m, 2-3 d, 2 d lag", trust: "QA mask, cloud → we say ‘check field’", color: "bg-amber-50 border-amber-200" },
          ].map(d => (
            <div key={d.name} className={`p-4 rounded-2xl border ${d.color}`}>
              <div className="text-xl">{d.icon}</div><div className="font-black text-sm mt-1">{d.name}</div>
              <div className="text-xs text-stone-700 mt-1">{d.what}</div>
              <div className="text-xs mt-2"><b>{d.res}</b></div>
              <div className="text-xs text-stone-600 mt-1 italic">{d.trust}</div>
            </div>
          ))}
        </div>
        <div className="mt-4 grid md:grid-cols-3 gap-3">
          {smallSatStory.dataFlow.map(s => (
            <div key={s.step} className={`p-4 rounded-2xl border-2 ${s.color}`}>
              <div className="text-xs font-black">STEP {s.step}</div><div className="font-bold text-sm">{s.title}</div><div className="text-xs text-stone-600 mt-1">{s.desc}</div>
            </div>
          ))}
        </div>
        <div className="mt-4 p-4 bg-stone-900 text-stone-100 rounded-2xl text-xs">
          <b className="text-amber-300">⚠️ Honest line we show under every chart:</b> “This is <b>advice only</b> — NASA POWER is a 55 km model blend, not your hill. For floods/storms follow <b>Rwanda Meteorology Agency</b> & MINEMA. Ground photo needed to close alert.”
        </div>
      </div>

      {/* Impact economics */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="card bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200">
          <h2 className="font-black text-[#166534]">💰 Impact that matters — in RWF, not papers</h2>
          <div className="mt-3 text-sm space-y-2">
            <div className="flex justify-between bg-white rounded-2xl p-3 border"><span>🇷🇼 Farmers</span><b>{rwandaImpact.agriculture.smallholders} • avg {rwandaImpact.agriculture.avgPlot} ha</b></div>
            <div className="flex justify-between bg-white rounded-2xl p-3 border"><span>🌽 Maize yield</span><b>{rwandaImpact.economics.maizeYield} t/ha @ {rwandaImpact.economics.pricePerKg} RWF/kg</b></div>
            <div className="flex justify-between bg-white rounded-2xl p-3 border"><span>🌧️ Drought loss</span><b className="text-red-600">-{rwandaImpact.economics.lossDrought}% if 2-week delay</b></div>
            <div className="bg-[#166534] text-white rounded-2xl p-4 text-center"><div className="text-lg font-black">Save 10% → {rwandaImpact.economics.valueSavedPerHa} USD / ha</div><div className="text-xs opacity-90 mt-1">{rwandaImpact.economics.example}</div></div>
          </div>
          <div className="mt-3 text-xs text-stone-600">If 100,000 ha use it (6% of Rwanda cropland) → <b>$9M saved / season</b> — pays for 18 Icyerekezo CubeSats.</div>
        </div>
        <div className="card">
          <h2 className="font-black">📍 Built for Rwanda’s hills — not California</h2>
          <div className="mt-3 space-y-2">
            {rwandaImpact.districts.map(d => (
              <div key={d.id} className="flex gap-3 p-3 bg-stone-50 border border-stone-100 rounded-2xl">
                <div className="text-xl">📍</div>
                <div className="flex-1"><div className="font-bold text-sm">{d.name} • {d.alt} m</div><div className="text-xs text-stone-600">{d.focus} • Risk: {d.risk}</div></div>
                <div className="text-xs bg-white border px-2 py-1 rounded-full h-fit">{d.pop}</div>
              </div>
            ))}
          </div>
          <div className="mt-3 flex gap-2 text-xs">
            <span className="pill bg-stone-100">Season A Sep-Jan</span><span className="pill bg-stone-100">Season B Feb-Jun</span><span className="pill bg-amber-100 border-amber-200">Season C marshlands</span>
          </div>
        </div>
      </div>

      {/* Demo flow */}
      <div className="card">
        <h2 className="font-black text-xl">🎬 Demo in 60 seconds — try it live</h2>
        <div className="mt-3 grid sm:grid-cols-3 gap-3 text-sm">
          <div className="p-4 bg-stone-50 rounded-2xl border text-center"><div className="text-2xl">1️⃣</div><div className="font-bold mt-1">Pick your hill</div><div className="text-xs text-stone-600 mt-1">Tap <Link href="/map" className="underline">Map → draw field</Link> or presets (Musanze/Kigali/Bugesera/Nyagatare). No English needed.</div><Link href="/map" className="btn mt-3 w-full">🗺️ Open Map</Link></div>
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-center"><div className="text-2xl">2️⃣</div><div className="font-bold mt-1">Get traffic light</div><div className="text-xs text-stone-600 mt-1"><Link href="/fields" className="underline">My Fields</Link> shows 🟢🟡🔴 + “Vomeera mu gitondo” in Kinyarwanda — in 10 sec.</div><Link href="/fields" className="btn mt-3 w-full">🌾 My Fields</Link></div>
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-center"><div className="text-2xl">3️⃣</div><div className="font-bold mt-1">Act & verify</div><div className="text-xs text-stone-600 mt-1">Check field, take photo, share chart via WhatsApp. On dumb phone: mock <b>*162#</b> SMS coming.</div><Link href="/docs" className="btn-ghost mt-3 w-full">📚 How it works</Link></div>
        </div>
        <div className="mt-4 grid md:grid-cols-2 gap-3">
          <div className="p-4 bg-stone-900 text-stone-100 rounded-2xl">
            <div className="font-bold">📲 SMS for no-smartphone farmers (Phase 2)</div>
            <div className="mt-2 bg-white text-stone-900 rounded-2xl p-3 text-xs font-mono leading-relaxed">*162# → Ubuhinzi: Musanze Plot 4<br/>🌧️ Imvura: 12mm (7d) — bike<br/>💧 Ubutaka: — (sensor missing)<br/>🌱 Amabwiriza: Vomeera ejo mu gitondo (6-8am).<br/>1. Vomeera  2. Vuga n'umujyanama</div>
            <div className="text-xs text-stone-400 mt-2">via MTN + Irembo — farmer already knows *162# for IremboGov.</div>
          </div>
          <div className="p-4 bg-sky-50 border border-sky-200 rounded-2xl">
            <div className="font-bold">🔬 Validation — how we know we’re not lying</div>
            <ul className="text-xs text-stone-700 mt-2 space-y-1 list-disc ml-4">
              <li>POWER 55 km vs CHIRPS 5 km vs 1 local gauge — we show all 3, highlight mismatch</li>
              <li>NDVI proxy vs soon-to-come HLS 30 m — banner: “proxy, replace token” until HLS live</li>
              <li>Farmer photo closes alert — satellite + eyes = truth. No photo → alert stays 🔴</li>
              <li>Confidence badge: “modeled estimate” vs “observed thermal” vs “forecast (GFS)”</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Tech & cost */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="card">
          <h2 className="font-black">⚙️ Tech — cheap, scalable, Rwandan-owned</h2>
          <div className="mt-3 text-xs">
            <div className="grid grid-cols-2 gap-2">
              <div className="p-3 bg-stone-50 rounded-2xl"><b>Frontend</b><br/>Next.js 15 • Tailwind • Leaflet • Recharts<br/>Kinyarwanda/EN/FR • PWA ready</div>
              <div className="p-3 bg-stone-50 rounded-2xl"><b>Backend</b><br/>Vercel Functions + Cron • Supabase Postgres + PostGIS<br/>HLS via AWS STAC • GDAL WASM future</div>
              <div className="p-3 bg-stone-50 rounded-2xl"><b>Cost today</b><br/>NASA free • Vercel $0 • Supabase $0<br/>100 fields × 1 obs/day = $0</div>
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl"><b>Cost at 100k fields</b><br/>~$45/mo (Supabase Pro + Vercel) • Still &lt; $0.001 / field</div>
            </div>
            <div className="mt-3 p-3 bg-stone-900 text-stone-100 rounded-2xl">Vercel env: NEXT_PUBLIC_SUPABASE_URL, ANON_KEY, SERVICE_ROLE_KEY, FIRMS_MAP_KEY (optional). Cron: 0 6 * * *.</div>
          </div>
        </div>
        <div className="card">
          <h2 className="font-black">🤝 Partners — we amplify, we don’t replace</h2>
          <div className="mt-3 space-y-2">
            {partners.map(p => (
              <div key={p.name} className="flex gap-3 p-3 bg-stone-50 border border-stone-100 rounded-2xl">
                <span className="text-xl">{p.logo}</span><div><div className="font-bold text-sm">{p.name}</div><div className="text-xs text-stone-600">{p.role}</div></div>
              </div>
            ))}
          </div>
          <div className="mt-3 text-xs p-3 bg-amber-50 border border-amber-200 rounded-2xl"><b>⚠️ We never send flood evacuation —</b> we link to <b>Rwanda Meteorology & MINEMA</b> alerts. We are advice, they are authority.</div>
        </div>
      </div>

      {/* Roadmap */}
      <div className="card">
        <h2 className="font-black text-xl">🗓️ Roadmap — 2 weeks → 2 years</h2>
        <div className="mt-4 grid md:grid-cols-4 gap-3 text-xs">
          <div className="p-4 bg-emerald-50 border-2 border-emerald-300 rounded-2xl"><div className="font-black text-emerald-800">✅ Now (MVP)</div><div className="mt-1 text-stone-700">POWER heuristic + GIBS map + 50 fields • Kinyarwanda • Vercel cron • Docs</div><div className="mt-2 badge bg-emerald-600 text-white border-emerald-700">DONE</div></div>
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl"><div className="font-black">🔜 3 months</div><div className="mt-1 text-stone-700">HLS 30 m NDVI via EDL token • TWIGA photo verify • *162# SMS via Africa’s Talking • 1k fields</div><div className="mt-2 badge bg-white">NEXT</div></div>
          <div className="p-4 bg-sky-50 border border-sky-200 rounded-2xl"><div className="font-black">🛰️ 12 months</div><div className="mt-1 text-stone-700">SMAP 9 km downscale • GPM 10 km flood hand + SRTM • Icyerekezo ground station Kigali • CubeSat CDR</div><div className="mt-2 badge bg-sky-600 text-white">SMALLSAT</div></div>
          <div className="p-4 bg-stone-900 text-stone-100 rounded-2xl"><div className="font-black text-white">🌍 24 months</div><div className="mt-1 text-stone-300">2× Icyerekezo 3 m daily • SAR flood (Sentinel-1) • 100k farmers • $9M/season saved</div><div className="mt-2 badge bg-amber-400 text-stone-900 border-amber-500">VISION</div></div>
        </div>
      </div>

      <div className="card bg-stone-900 text-stone-300 border-stone-800 text-center">
        <div className="text-white font-black text-lg">Team • Ubuhinzi Sentinel — NASA Space Apps Kigali 2025</div>
        <div className="text-xs mt-1">Built with ❤️ for Rwandan farmers • NASA data is free — our job is to make it understood • <Link href="/" className="text-emerald-300 underline">Home</Link> • <Link href="/fields" className="text-emerald-300 underline">Fields</Link> • <Link href="/map" className="text-emerald-300 underline">Map</Link> • <Link href="/docs" className="text-emerald-300 underline">Docs</Link></div>
        <div className="mt-4 inline-flex gap-2"><Link href="/" className="bg-white text-stone-900 px-6 py-3 rounded-full font-black text-sm">🌾 Try live demo →</Link><a href="https://github.com/iskevine23/Nasa-space-app-challenge" target="_blank" className="bg-white/10 border border-white/20 px-6 py-3 rounded-full text-sm">GitHub</a></div>
      </div>
    </div>
  );
}
