"use client";
import Link from "next/link";
import { useLang, dict } from "@/lib/i18n";
import { toFarmerStatus, simpleRainStory, soilStory } from "@/lib/analysis/farmerAdvice";
import { localizedStatus } from "@/lib/analysis/farmerAdvice";

function FarmerCard({ title, subtitle, v, lang }: { title: string; subtitle: string; v: any; lang: "rw"|"en"|"fr" }) {
  if (!v || v.error) return (
    <div className="card">
      <div className="text-sm font-bold">{title}</div>
      <div className="text-xs text-stone-500">{subtitle}</div>
      <div className="mt-3 p-3 bg-stone-50 rounded-2xl text-sm text-stone-600">{v?.error || "..."}</div>
    </div>
  );
  if (!v.drought || !v.flood || !v.series) return (
    <div className="card"><div className="text-sm font-bold">{title}</div><div className="text-xs text-stone-500">{subtitle}</div><div className="mt-3 p-3 bg-amber-50 rounded-2xl text-sm text-amber-800">{lang==="rw"?"Amakuru ntabwo araza":lang==="fr"?"Données pas prêtes":"Data not ready"}</div></div>
  );
  const farmer = toFarmerStatus(v.drought, v.flood);
  const loc = localizedStatus(farmer, lang);
  const p7 = (v.series || []).slice(-7).reduce((a:number,r:any)=>a+(r.PRECTOTCORR??0),0);
  const story = simpleRainStory(v.flood?.p3 || 0, p7, (v.series||[]).slice(-30).reduce((a:number,r:any)=>a+(r.PRECTOTCORR??0),0));
  const wet = v.series?.at(-1)?.GWETTOP;
  const soil = lang==="rw"? (wet==null?"Nta makuru": wet<0.3?"Humutse":"Gitose") : lang==="fr" ? soilStory(wet).en.replace("Soil","Sol") : soilStory(wet).en;
  // use proper soil string per lang via soilStory only has en/kiny; build fr simple
  const soilDisplay = lang==="fr" ? (wet==null?"—": wet<0.3?"Sec": wet<0.6?"Ok":"Humide") : lang==="rw" ? (wet==null?"—": wet<0.3?"Humutse":"Gitose / Ok") : soilStory(wet).en;
  const tVals = (v.series || []).slice(-7).map((r:any)=>r.T2M).filter((v:any)=>v!=null);
  const tAvgNum = tVals.length ? tVals.reduce((a:number,b:number)=>a+b,0)/tVals.length : null;
  const tAvg = tAvgNum == null ? "—" : tAvgNum.toFixed(0);
  const badge = lang==="rw" ? (farmer.level==="good"?"Byiza":farmer.level==="watch"?"Witondere":"Gihutireho") : lang==="fr" ? (farmer.level==="good"?"Bien":farmer.level==="watch"?"Attention":"Alerte") : (farmer.level==="good"?"Good":farmer.level==="watch"?"Watch":"Alert");
  const whatLabel = lang==="rw"?"Ese nakora iki?": lang==="fr"?"Que faire ?":"What to do:";
  return (
    <div className="card hover:shadow-md transition">
      <div className="flex justify-between items-start gap-3">
        <div><div className="font-black text-[#166534]">{title}</div><div className="text-xs text-stone-500">{subtitle}</div></div>
        <div className={`pill border ${farmer.color}`}>{farmer.emoji} {badge}</div>
      </div>
      <div className={`mt-4 p-4 rounded-2xl border ${farmer.color}`}>
        <div className="text-lg font-black">{farmer.emoji} {loc.title}</div>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2">
        <div className="bg-sky-50 border border-sky-100 rounded-2xl p-3 text-center"><div className="text-lg">{story.icon}</div><div className="text-xs text-sky-700 font-bold">{p7.toFixed(0)}mm</div><div className="text-[11px] text-stone-500">{lang==="rw"?"iki cyumweru":lang==="fr"?"cette sem.":"this week"}<br/>{soilDisplay.split("(")[0]}</div></div>
        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-3 text-center"><div className="text-lg">🌡️</div><div className="text-xs font-bold text-amber-800">{tAvg}°C</div><div className="text-[11px] text-stone-500">{lang==="rw"?"impuzandengo":"avg temp"}<br/>{lang==="rw"?"iminsi 7":"last 7 days"}</div></div>
        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-3 text-center"><div className="text-lg">🌱</div><div className="text-xs font-bold text-emerald-800">{soilDisplay}</div><div className="text-[11px] text-stone-500">{lang==="rw"?"ubutaka":"soil"}<br/>{lang==="fr"?"humidité":"moisture"}</div></div>
      </div>
      <div className="mt-4 bg-amber-50 border border-amber-100 rounded-2xl p-3">
        <div className="text-xs font-black text-amber-900">👉 {whatLabel}</div>
        <div className="text-sm text-amber-900 mt-1">{loc.advice}</div>
      </div>
      <details className="mt-3"><summary className="text-xs text-stone-500 cursor-pointer hover:text-stone-700">{lang==="rw"?"🔍 Ibisobanuro byinzobere":lang==="fr"?"🔍 Détails expert":"🔍 Expert details (for advisors)"}</summary>
        <ul className="mt-2 text-xs text-stone-600 list-disc ml-4 space-y-1 bg-stone-50 p-3 rounded-xl">
          {(v.drought?.reasons || []).map((r:string,i:number)=><li key={i}>{r}</li>)}
          <li>Flood: {v.flood?.level || "?"} — {v.flood?.note || "…"} (3d {(v.flood?.p3 || 0).toFixed(1)} mm)</li>
        </ul>
      </details>
    </div>
  );
}

export default function HomeClient({ kigali, bugesera, nyagatare, eonet }: any) {
  const { lang } = useLang();
  const t = (path: string) => {
    const keys = path.split(".");
    let cur: any = dict;
    for (const k of keys) cur = cur?.[k];
    return cur?.[lang] ?? cur?.["en"] ?? path;
  };
  return (
    <div className="space-y-6">
      {/* IMPACT BAND */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="card py-4 text-center border-2 border-emerald-100"><div className="text-2xl">🌾</div><div className="font-black text-lg">1.6M</div><div className="text-xs text-stone-500">{t("home.impact_smallholders")}<br/><span className="text-emerald-700 font-bold">{t("home.impact_hunger")}</span></div></div>
        <div className="card py-4 text-center border-2 border-sky-100"><div className="text-2xl">🛰️</div><div className="font-black text-lg">55km → 3m</div><div className="text-xs text-stone-500">{t("home.impact_satellite")}<br/><span className="text-sky-700 font-bold">{t("home.impact_satellite_sub")}</span></div></div>
        <div className="card py-4 text-center border-2 border-amber-100"><div className="text-2xl">💰</div><div className="font-black text-lg">$90 / ha</div><div className="text-xs text-stone-500">{t("home.impact_saved")}<br/><span className="text-amber-700 font-bold">{t("home.impact_saved_sub")}</span></div></div>
        <div className="card py-4 text-center border-2 border-stone-200 bg-stone-900 text-white border-stone-800"><div className="text-xs bg-white/10 inline-block px-2 py-1 rounded-full">NASA Space Apps Kigali</div><div className="font-black text-sm mt-1">{t("home.impact_judge")}</div><Link href="/pitch" className="mt-2 inline-block bg-amber-400 text-stone-900 px-4 py-2 rounded-full font-black text-xs">{t("home.impact_judge_btn")}</Link></div>
      </div>

      {/* HERO */}
      <div className="card bg-gradient-to-br from-[#166534] via-[#15803d] to-[#16a34a] text-white border-0 overflow-hidden relative">
        <div className="absolute inset-0 bg-maize opacity-20"></div>
        <div className="relative flex flex-wrap gap-6 justify-between">
          <div className="max-w-[560px]">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold">{t("home.hero_badge")}</div>
            <h1 className="text-3xl md:text-[36px] font-black leading-tight mt-3">{t("home.hero_title1")}<br/>{t("home.hero_title2")}</h1>
            <p className="text-white/90 text-sm mt-3 leading-relaxed">{t("home.hero_desc")} <b className="text-white">{t("home.hero_next")}</b>.</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link href="/fields" className="bg-white text-[#166534] px-6 py-3 rounded-full font-black text-sm shadow">{t("home.hero_cta_fields")}</Link>
              <Link href="/map" className="bg-white/15 backdrop-blur border border-white/20 text-white px-5 py-3 rounded-full font-semibold text-sm">{t("home.hero_cta_map")}</Link>
              <Link href="/pitch" className="bg-amber-400 text-stone-900 px-5 py-3 rounded-full font-black text-sm">🏆 Pitch</Link>
            </div>
            <div className="mt-4 flex gap-2 text-xs flex-wrap">
              <span className="bg-white/10 border border-white/20 px-3 py-1 rounded-full">{t("home.hero_location")}</span>
              <span className="bg-white/10 border border-white/20 px-3 py-1 rounded-full">{t("home.hero_nasa")}</span>
            </div>
          </div>
          <div className="bg-white rounded-[20px] p-5 text-stone-800 min-w-[300px] max-w-[380px] w-full">
            <div className="font-black text-[#166534]">{t("home.traffic_title")}</div>
            <div className="text-xs text-stone-500">{t("home.traffic_sub")}</div>
            <div className="mt-3 space-y-2">
              <div className="flex gap-3 items-center bg-emerald-50 border border-emerald-200 rounded-2xl p-3"><span className="dot-good shrink-0"></span><div><div className="text-sm font-bold text-emerald-800">🟢 {t("home.green")}</div><div className="text-xs text-emerald-700">{t("home.green_sub")}</div></div></div>
              <div className="flex gap-3 items-center bg-amber-50 border border-amber-200 rounded-2xl p-3"><span className="dot-watch shrink-0"></span><div><div className="text-sm font-bold text-amber-800">🟡 {t("home.yellow")}</div><div className="text-xs text-amber-700">{t("home.yellow_sub")}</div></div></div>
              <div className="flex gap-3 items-center bg-red-50 border border-red-200 rounded-2xl p-3"><span className="dot-bad shrink-0"></span><div><div className="text-sm font-bold text-red-800">🔴 {t("home.red")}</div><div className="text-xs text-red-700">{t("home.red_sub")}</div></div></div>
            </div>
            <div className="mt-3 text-xs bg-amber-50 border border-amber-200 rounded-xl p-3 text-amber-900">💡 {t("home.tip")}</div>
          </div>
        </div>
      </div>

      {/* Resolution story */}
      <div className="card border-2 border-stone-900 overflow-hidden">
        <div className="flex flex-wrap justify-between gap-3 items-center">
          <h2 className="font-black text-lg">{t("home.why_title")}</h2>
          <span className="pill bg-stone-900 text-white text-xs">RwaSat-1 (2019) → Icyerekezo-1 (2027) Vision</span>
        </div>
        <p className="text-xs text-stone-500 mt-1">{t("home.why_sub")}</p>
        <div className="mt-4 grid md:grid-cols-3 gap-3">
          <div className="p-4 bg-sky-50 border-2 border-sky-200 rounded-2xl"><div className="flex justify-between"><span className="font-black text-sky-900">55 km</span><span className="badge bg-white border-sky-200">NASA POWER • Today</span></div><div className="mt-2 h-24 bg-white border border-sky-200 rounded-xl grid place-items-center text-4xl">🟦</div><div className="text-xs text-sky-900 mt-2 font-bold">{t("home.card55")}</div><div className="text-xs text-stone-600">{lang==="rw"?"Nibyiza: ‘Ese Bugesera humutse kurusha umwaka ushize?’ Nibibi: Ntibibona 0.6 ha yawe.": lang==="fr"?"Bien : « Bugesera plus sec que l’an dernier ? » Mal : ne voit pas vos 0,6 ha.":"Good: “Is Bugesera drier than last year?”. Bad: Can’t see your 0.6 ha."}</div><div className="mt-2 text-xs bg-white p-2 rounded-xl">{t("home.card55_q")} <br/><span className="text-sky-700 font-bold">{t("home.card55_a")}</span></div></div>
          <div className="p-4 bg-amber-50 border-2 border-amber-300 rounded-2xl relative"><div className="absolute -top-2 -right-2 bg-amber-400 text-stone-900 text-xs font-black px-3 py-1 rounded-full">{lang==="rw"?"URI HANO": lang==="fr"?"VOUS ÊTES ICI":"YOU ARE HERE"}</div><div className="flex justify-between"><span className="font-black text-amber-900">30 m</span><span className="badge bg-white border-amber-300">HLS • Bridge</span></div><div className="mt-2 h-24 bg-white border border-amber-200 rounded-xl grid place-items-center"><div className="grid grid-cols-6 gap-1 p-2 w-full h-full"><div className="bg-emerald-200 rounded"/><div className="bg-emerald-500 rounded"/><div className="bg-amber-300 rounded"/><div className="bg-emerald-500 rounded"/><div className="bg-emerald-200 rounded"/><div className="bg-amber-200 rounded"/><div className="bg-emerald-400 rounded"/><div className="bg-emerald-600 rounded"/><div className="bg-amber-400 rounded"/><div className="bg-emerald-400 rounded"/><div className="bg-emerald-300 rounded"/><div className="bg-stone-200 rounded"/></div></div><div className="text-xs text-amber-900 mt-2 font-bold">{t("home.card30")}</div><div className="text-xs text-stone-600">NDVI = (NIR-Red)/(NIR+Red) — greener = healthier.</div><div className="mt-2 text-xs bg-white p-2 rounded-xl">{lang==="rw"?"Ese ibigori byanjye bitoshye kurusha iby’umuturanyi?": lang==="fr"?"Mon maïs est-il plus vert que le voisin ?":"Is my maize greener than neighbor?"} <br/><span className="text-amber-700 font-bold">HLS 5.9 vs 6.2 NDVI.</span></div></div>
          <div className="p-4 bg-emerald-50 border-2 border-emerald-300 rounded-2xl"><div className="flex justify-between"><span className="font-black text-emerald-900">3 m</span><span className="badge bg-emerald-600 text-white border-emerald-700">Icyerekezo-1 • 2027</span></div><div className="mt-2 h-24 bg-stone-900 rounded-xl grid place-items-center text-white p-2"><div className="w-full h-full grid grid-cols-12 gap-[1px]"><div className="col-span-12 flex gap-[1px]">{Array.from({length:12}).map((_,i)=><div key={i} className={`flex-1 h-3 rounded-sm ${i===5?'bg-amber-400':i>7?'bg-emerald-400':'bg-emerald-600'}`}/>)}</div><div className="col-span-12 text-xs text-center text-emerald-200">🛰️ daily 3 m — see one dry row</div></div></div><div className="text-xs text-emerald-900 mt-2 font-bold">{t("home.card3")}</div><div className="text-xs text-stone-600">{lang==="rw"?"CubeSat y’u Rwanda — amakuru ku munsi, ibona mu bicu na SAR.": lang==="fr"?"CubeSat rwandais — même jour, voit à travers nuages via SAR.":"Rwandan CubeSat — same-day, sees through cloud with SAR."}</div><div className="mt-2 text-xs bg-white p-2 rounded-xl">{lang==="rw"?"Ni uwuhe murongo ukeneye amazi ejo?": lang==="fr"?"Quel rang a besoin d’eau demain ?":"Which row needs water tomorrow?"} <br/><span className="text-emerald-700 font-bold">{lang==="rw"?"Umurongo wa 6 — 3 m iti ‘ufite inyota’.": lang==="fr"?"Rang 6 — 3 m dit « soif ».":"Row 6 — 3 m says “thirsty”."}</span></div></div>
        </div>
        <div className="mt-4 p-3 bg-stone-900 text-white rounded-2xl flex flex-wrap gap-2 justify-between text-xs"><span><b className="text-amber-300">Today:</b> {t("home.honest")}</span><Link href="/docs" className="underline text-emerald-300">{t("home.honest_link")}</Link></div>
      </div>

      {/* FARMER CARDS */}
      <div className="grid md:grid-cols-3 gap-4">
        <FarmerCard title="Kigali • Gasabo" subtitle={lang==="rw"?"Ibigori & ibishyimbo • 1,540m": lang==="fr"?"Maïs & haricots • 1 540m":"Maize & beans • 1,540m"} v={kigali} lang={lang} />
        <FarmerCard title="Bugesera • Dry zone" subtitle={lang==="rw"?"Akarere kamye — ibishyimbo, imyumbati": lang==="fr"?"Zone sèche — haricots, manioc":"Drought-prone • Beans, cassava"} v={bugesera} lang={lang} />
        <FarmerCard title="Nyagatare • East" subtitle={lang==="rw"?"Inka & ibigori • hashyuha": lang==="fr"?"Bétail & maïs • chaud":"Cattle & maize • Hotter"} v={nyagatare} lang={lang} />
      </div>

      {/* WHAT TO DO TODAY */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="card md:col-span-2">
          <h2 className="font-black text-lg text-[#166534]">{t("home.do_today")}</h2>
          <p className="text-xs text-stone-500">{t("home.do_sub")}</p>
          <div className="grid sm:grid-cols-3 gap-3 mt-4">
            <div className="bg-gradient-to-br from-sky-50 to-blue-50 border border-sky-200 rounded-2xl p-4">
              <div className="text-2xl">💧</div><div className="font-bold text-sm mt-1">{t("home.water")}</div>
              <div className="text-xs text-stone-600 mt-1">{t("home.water_desc")}</div>
            </div>
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-4">
              <div className="text-2xl">🌱</div><div className="font-bold text-sm mt-1">{t("home.plant")}</div>
              <div className="text-xs text-stone-600 mt-1">{t("home.plant_desc")}</div>
            </div>
            <div className="bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200 rounded-2xl p-4">
              <div className="text-2xl">🔥🌊</div><div className="font-bold text-sm mt-1">{t("home.danger")}</div>
              <div className="text-xs text-stone-600 mt-1">{t("home.danger_desc")}</div>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link href="/fields" className="btn">{t("home.open_fields")}</Link>
            <Link href="/map" className="btn-ghost">{t("home.see_map")}</Link>
          </div>
        </div>
        <div className="card bg-warm">
          <h2 className="font-black text-[#92400e]">{t("home.in30")}</h2>
          <div className="mt-3 space-y-3 text-sm">
            <div className="flex gap-3"><span>🛰️</span><div><b>{t("home.in30_1")}</b><br/><span className="text-xs text-stone-600">{t("home.in30_1s")}</span></div></div>
            <div className="flex gap-3"><span>📱</span><div><b>{t("home.in30_2")}</b><br/><span className="text-xs text-stone-600">{t("home.in30_2s")}</span></div></div>
            <div className="flex gap-3"><span>👩‍🌾</span><div><b>{t("home.in30_3")}</b><br/><span className="text-xs text-stone-600">{t("home.in30_3s")}</span></div></div>
          </div>
          <div className="mt-4 p-3 bg-white rounded-2xl border border-amber-200 text-xs"><b>⚠️</b> {t("home.important")}</div>
        </div>
      </div>

      {/* EONET simplified */}
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 card">
          <h2 className="font-black text-[#166534]">{t("home.what_sat")}</h2>
          <p className="text-xs text-stone-500">{t("home.what_sat_sub")}</p>
          <div className="mt-4 grid sm:grid-cols-2 gap-3 text-sm">
            <div className="p-4 bg-sky-50 border border-sky-100 rounded-2xl"><div className="font-bold">{t("home.rain_space")}</div><div className="text-xs text-stone-600 mt-1">{t("home.rain_space_d")}</div></div>
            <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl"><div className="font-bold">{t("home.soil_wet")}</div><div className="text-xs text-stone-600 mt-1">{t("home.soil_wet_d")}</div></div>
            <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl"><div className="font-bold">{t("home.plant_green")}</div><div className="text-xs text-stone-600 mt-1">{t("home.plant_green_d")}</div></div>
            <div className="p-4 bg-orange-50 border border-orange-100 rounded-2xl"><div className="font-bold">{t("home.fire_dots")}</div><div className="text-xs text-stone-600 mt-1">{t("home.fire_dots_d")}</div></div>
          </div>
        </div>
        <div className="card">
          <h2 className="font-bold">{t("home.recent_events")}</h2>
          {!eonet ? <p className="text-sm text-stone-500 mt-2">{t("home.no_internet")}</p> : (
            <ul className="mt-3 space-y-2 text-sm">
              {(eonet.events || []).slice(0,5).map((ev:any)=>
                <li key={ev.id} className="p-3 bg-stone-50 rounded-2xl flex gap-2">
                  <span className="text-lg">🌍</span>
                  <div><div className="font-bold leading-tight">{ev.title}</div><div className="text-xs text-stone-500">{ev.categories?.[0]?.title} • {ev.geometry?.[0]?.date?.slice(0,10)}</div></div>
                </li>
              )}
              {!eonet.events?.length && <li className="text-xs text-stone-500">{lang==="rw"?"Nta biza bikomeye hafi — ni byiza! Reba ":"No big events nearby — that’s good! Check "}{lang==="fr"?"Pas de gros événements — tant mieux ! Voir":"No big events nearby — that’s good! Check "} <Link href="/map" className="underline">map</Link> {lang==="rw"?"ku zindi nkongi.":"for fires."}</li>}
            </ul>
          )}
          <Link href="/docs" className="mt-3 inline-block text-xs text-stone-500 underline">{t("home.want_science")}</Link>
        </div>
      </div>
    </div>
  );
}
