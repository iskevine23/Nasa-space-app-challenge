import Link from "next/link";
import { fetchPowerDaily } from "@/lib/nasa/power";
import { assessDrought, floodRisk, ndviMockFromPower } from "@/lib/analysis/drought";
import { toFarmerStatus, simpleRainStory, soilStory } from "@/lib/analysis/farmerAdvice";
import { fetchEonet } from "@/lib/nasa/eonet";

export const revalidate = 3600;

async function getPower(lat:number, lon:number) {
  const end = new Date().toISOString().slice(0,10);
  const start = new Date(Date.now()-30*864e5).toISOString().slice(0,10);
  try {
    let s: any;
    try { s = await fetchPowerDaily({ lat, lon, start, end }); } catch { const { mockPowerSeries } = await import("@/lib/nasa/power"); s = mockPowerSeries(lat, lon, 30); }
    return { series: s, drought: assessDrought(s), flood: floodRisk(s), ndvi: ndviMockFromPower(s) };
  } catch (e:any) { return { error: String(e.message) } as any; }
}

function FarmerCard({ title, subtitle, v }: { title: string; subtitle: string; v:any }) {
  if (v.error) return (
    <div className="card">
      <div className="text-sm font-bold">{title}</div>
      <div className="text-xs text-stone-500">{subtitle}</div>
      <div className="mt-3 p-3 bg-red-50 rounded-2xl text-sm text-red-700">{v.error}</div>
    </div>
  );
  const farmer = toFarmerStatus(v.drought, v.flood);
  const p7 = v.series.slice(-7).reduce((a:number,r:any)=>a+(r.PRECTOTCORR||0),0);
  const p30 = v.series.slice(-30).reduce((a:number,r:any)=>a+(r.PRECTOTCORR||0),0);
  const story = simpleRainStory(v.flood.p3, p7, p30);
  const wet = v.series.at(-1)?.GWETTOP;
  const soil = soilStory(wet);
  const tAvg = (v.series.slice(-7).reduce((a:number,r:any)=>a+(r.T2M||0),0)/7).toFixed(0);

  return (
    <div className="card hover:shadow-md transition">
      <div className="flex justify-between items-start gap-3">
        <div>
          <div className="font-black text-[#166534]">{title}</div>
          <div className="text-xs text-stone-500">{subtitle}</div>
        </div>
        <div className={`pill border ${farmer.color}`}>{farmer.emoji} {farmer.level === "good" ? "Good" : farmer.level === "watch" ? "Watch" : "Alert"}</div>
      </div>

      <div className={`mt-4 p-4 rounded-2xl border ${farmer.color}`}>
        <div className="text-lg font-black">{farmer.emoji} {farmer.kiny}</div>
        <div className="text-sm opacity-80">{farmer.en}</div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        <div className="bg-sky-50 border border-sky-100 rounded-2xl p-3 text-center">
          <div className="text-lg">{story.icon}</div>
          <div className="text-xs text-sky-700 font-bold">{p7.toFixed(0)}mm</div>
          <div className="text-[11px] text-stone-500">this week<br/>{soil.en.split("(")[0]}</div>
        </div>
        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-3 text-center">
          <div className="text-lg">🌡️</div>
          <div className="text-xs font-bold text-amber-800">{tAvg}°C</div>
          <div className="text-[11px] text-stone-500">avg temp<br/>last 7 days</div>
        </div>
        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-3 text-center">
          <div className="text-lg">🌱</div>
          <div className="text-xs font-bold text-emerald-800">{soil.en}</div>
          <div className="text-[11px] text-stone-500">soil<br/>moisture</div>
        </div>
      </div>

      <div className="mt-4 bg-amber-50 border border-amber-100 rounded-2xl p-3">
        <div className="text-xs font-black text-amber-900">👉 What to do:</div>
        <div className="text-sm text-amber-900 mt-1">{farmer.adviceEn}</div>
        <div className="text-xs text-amber-800/70 mt-1 italic">{farmer.adviceKiny}</div>
      </div>

      <details className="mt-3">
        <summary className="text-xs text-stone-500 cursor-pointer hover:text-stone-700">🔍 Expert details (for advisors)</summary>
        <ul className="mt-2 text-xs text-stone-600 list-disc ml-4 space-y-1 bg-stone-50 p-3 rounded-xl">
          {v.drought.reasons.map((r:string,i:number)=><li key={i}>{r}</li>)}
          <li>Flood: {v.flood.level} — {v.flood.note} (3d {v.flood.p3.toFixed(1)} mm)</li>
        </ul>
      </details>
    </div>
  );
}

export default async function Page() {
  const kigali = await getPower(-1.94, 30.06);
  const bugesera = await getPower(-2.15, 30.25);
  const nyagatare = await getPower(-1.3, 30.3);
  let eonet: any = null;
  try { eonet = await fetchEonet({ limit: 4, days: 30 }); } catch {}

  return (
    <div className="space-y-6">
      {/* HERO - farmer first */}
      <div className="card bg-gradient-to-br from-[#166534] via-[#15803d] to-[#16a34a] text-white border-0 overflow-hidden relative">
        <div className="absolute inset-0 bg-maize opacity-20"></div>
        <div className="relative flex flex-wrap gap-6 justify-between">
          <div className="max-w-[560px]">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold">🌿 Muraho! • Hello farmer • Bonjour</div>
            <h1 className="text-3xl md:text-[36px] font-black leading-tight mt-3">Your farm,<br/>explained simply.</h1>
            <p className="text-white/90 text-sm mt-3 leading-relaxed">We read NASA satellites for you — <b>rain, soil, plant health, fires & floods</b> — and tell you in plain Kinyarwanda & English what to do today. No confusing charts.</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link href="/fields" className="bg-white text-[#166534] px-6 py-3 rounded-full font-black text-sm shadow">🌾 Check my fields →</Link>
              <Link href="/map" className="bg-white/15 backdrop-blur border border-white/20 text-white px-5 py-3 rounded-full font-semibold text-sm">🗺️ See map</Link>
            </div>
            <div className="mt-4 flex gap-2 text-xs">
              <span className="bg-white/10 border border-white/20 px-3 py-1 rounded-full">📍 Kigali • Bugesera • Nyagatare</span>
              <span className="bg-white/10 border border-white/20 px-3 py-1 rounded-full">🛰️ NASA data — free, daily</span>
            </div>
          </div>
          <div className="bg-white rounded-[20px] p-5 text-stone-800 min-w-[300px] max-w-[380px] w-full">
            <div className="font-black text-[#166534]">Today • Uyu munsi</div>
            <div className="text-xs text-stone-500">We keep it simple — 3 colors like traffic lights:</div>
            <div className="mt-3 space-y-2">
              <div className="flex gap-3 items-center bg-emerald-50 border border-emerald-200 rounded-2xl p-3"><span className="dot-good shrink-0"></span><div><div className="text-sm font-bold text-emerald-800">🟢 Green = Good</div><div className="text-xs text-emerald-700">Ibintu byiza — continue</div></div></div>
              <div className="flex gap-3 items-center bg-amber-50 border border-amber-200 rounded-2xl p-3"><span className="dot-watch shrink-0"></span><div><div className="text-sm font-bold text-amber-800">🟡 Yellow = Watch</div><div className="text-xs text-amber-700">Witondere — prepare</div></div></div>
              <div className="flex gap-3 items-center bg-red-50 border border-red-200 rounded-2xl p-3"><span className="dot-bad shrink-0"></span><div><div className="text-sm font-bold text-red-800">🔴 Red = Action</div><div className="text-xs text-red-700">Gira icyo ukora — act now</div></div></div>
            </div>
            <div className="mt-3 text-xs bg-amber-50 border border-amber-200 rounded-xl p-3 text-amber-900">💡 <b>Tip:</b> Tap any field to see: “Did it rain? Is soil dry? What should I do?” — in 10 seconds.</div>
          </div>
        </div>
      </div>

      {/* FARMER CARDS */}
      <div className="grid md:grid-cols-3 gap-4">
        <FarmerCard title="Kigali • Gasabo" subtitle="Maize & beans • 1,540m" v={kigali} />
        <FarmerCard title="Bugesera • Dry zone" subtitle="Drought-prone • Needs watch" v={bugesera} />
        <FarmerCard title="Nyagatare • East" subtitle="Cattle & maize • Hotter" v={nyagatare} />
      </div>

      {/* WHAT TO DO TODAY - big, visual */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="card md:col-span-2">
          <h2 className="font-black text-lg text-[#166534]">👨‍🌾 What should I do today?</h2>
          <p className="text-xs text-stone-500">Simple advice — tap to act. Based on last 7 days of rain & soil.</p>
          <div className="grid sm:grid-cols-3 gap-3 mt-4">
            <div className="bg-gradient-to-br from-sky-50 to-blue-50 border border-sky-200 rounded-2xl p-4">
              <div className="text-2xl">💧</div><div className="font-bold text-sm mt-1">Water?</div>
              <div className="text-xs text-stone-600 mt-1">If soil dry 2 days in a row → water early morning (6-8am). Don't flood.</div>
              <div className="text-xs text-sky-700 mt-2 font-semibold italic">Kiny: Vomeera mu gitondo kare</div>
            </div>
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-4">
              <div className="text-2xl">🌱</div><div className="font-bold text-sm mt-1">Plant health?</div>
              <div className="text-xs text-stone-600 mt-1">Green = happy. Yellow for 2 weeks → ask agronomist, check pests.</div>
              <div className="text-xs text-amber-700 mt-2 font-semibold italic">Kiny: Sura imyaka buri munsi</div>
            </div>
            <div className="bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200 rounded-2xl p-4">
              <div className="text-2xl">🔥🌊</div><div className="font-bold text-sm mt-1">Danger?</div>
              <div className="text-xs text-stone-600 mt-1">Red fire/flood alert → stay safe, call local leader. Don't risk.</div>
              <div className="text-xs text-emerald-700 mt-2 font-semibold italic">Kiny: Umutekano mbere na mbere</div>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link href="/fields" className="btn">🌾 Open my fields</Link>
            <Link href="/map" className="btn-ghost">🗺️ See fires & floods on map</Link>
          </div>
        </div>
        <div className="card bg-warm">
          <h2 className="font-black text-[#92400e]">📻 In 30 seconds</h2>
          <div className="mt-3 space-y-3 text-sm">
            <div className="flex gap-3"><span>🛰️</span><div><b>Satellites watch rain & soil</b><br/><span className="text-xs text-stone-600">NASA checks your area every day, free.</span></div></div>
            <div className="flex gap-3"><span>📱</span><div><b>We translate to simple words</b><br/><span className="text-xs text-stone-600">No “GWETTOP 0.34” — just “soil dry, water today”.</span></div></div>
            <div className="flex gap-3"><span>👩‍🌾</span><div><b>You decide, we advise</b><br/><span className="text-xs text-stone-600">Advice only — your eyes in field matter most.</span></div></div>
          </div>
          <div className="mt-4 p-3 bg-white rounded-2xl border border-amber-200 text-xs"><b>⚠️ Important:</b> This app helps you decide. For big floods/storms, always listen to <b>Rwanda Meteorology Agency</b> & MINEMA.</div>
        </div>
      </div>

      {/* EONET simplified */}
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 card">
          <h2 className="font-black text-[#166534]">🛰️ What satellites see (simple)</h2>
          <p className="text-xs text-stone-500">We hide the hard words. Tap “expert” if you’re an advisor.</p>
          <div className="mt-4 grid sm:grid-cols-2 gap-3 text-sm">
            <div className="p-4 bg-sky-50 border border-sky-100 rounded-2xl"><div className="font-bold">🌧️ Rain from space</div><div className="text-xs text-stone-600 mt-1">Satellites guess rain by clouds & heat. Good for big area, not perfect for your hill.</div></div>
            <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl"><div className="font-bold">💧 Soil wetness</div><div className="text-xs text-stone-600 mt-1">How wet soil is (0–100%). Low = thirsty plants. We show as “dry / okay / moist”.</div></div>
            <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl"><div className="font-bold">🌱 Plant green-ness</div><div className="text-xs text-stone-600 mt-1">Green plants = healthy. Less green = stress (water, pests, disease) — go look!</div></div>
            <div className="p-4 bg-orange-50 border border-orange-100 rounded-2xl"><div className="font-bold">🔥 Fire dots</div><div className="text-xs text-stone-600 mt-1">Hot spots seen by NASA. Red = real fire, grey = maybe false. Check nearby.</div></div>
          </div>
        </div>
        <div className="card">
          <h2 className="font-bold">🚨 Recent big events (EONET)</h2>
          {!eonet ? <p className="text-sm text-stone-500 mt-2">No internet — try later.</p> : (
            <ul className="mt-3 space-y-2 text-sm">
              {(eonet.events || []).slice(0,5).map((ev:any)=>
                <li key={ev.id} className="p-3 bg-stone-50 rounded-2xl flex gap-2">
                  <span className="text-lg">🌍</span>
                  <div><div className="font-bold leading-tight">{ev.title}</div><div className="text-xs text-stone-500">{ev.categories?.[0]?.title} • {ev.geometry?.[0]?.date?.slice(0,10)}</div></div>
                </li>
              )}
              {!eonet.events?.length && <li className="text-xs text-stone-500">No big events nearby — that’s good! Check <Link href="/map" className="underline">map</Link> for fires.</li>}
            </ul>
          )}
          <Link href="/docs" className="mt-3 inline-block text-xs text-stone-500 underline">Want the science? → Docs (advisors)</Link>
        </div>
      </div>
    </div>
  );
}
