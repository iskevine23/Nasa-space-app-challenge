"use client";
import Link from "next/link";
import { useLang } from "@/lib/i18n";
import { rwandaImpact } from "@/lib/data/rwanda";

export default function Pitch() {
  const { lang } = useLang();
  const tr = (rw: string, en: string, fr: string) => lang==="rw"?rw : lang==="fr"?fr : en;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* COVER — 20 sec */}
      <div className="card bg-gradient-to-br from-[#0f2e1a] via-[#166534] to-[#16a34a] text-white border-0 overflow-hidden relative">
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-3 py-1 rounded-full text-xs">
            {tr("NASA Space Apps 2025 • Kigali • SmallSat kubuhinzi","NASA Space Apps 2025 • Kigali • SmallSats for Agriculture","NASA Space Apps 2025 • Kigali • SmallSats pour l’Agriculture")}
          </div>
          <h1 className="text-3xl md:text-[38px] font-black leading-tight mt-3">
            {tr("Ubuhinzi Sentinel","Ubuhinzi Sentinel","Ubuhinzi Sentinel")}<br/>
            <span className="text-emerald-200">{tr("Umurima wawe uvuye mu kirere","Your Farm from Space","Votre Ferme depuis l’Espace")}</span>
          </h1>
          <p className="text-white/90 text-sm mt-2 max-w-[600px]">
            {tr(
              "Abahinzi 1.6M bahinga kuri 0.6 ha — imvura imwe itinze = inzara. Amakuru ya NASA ni ubuntu ariko ntagezeyo. Tuhindura POWER + FIRMS mu Kinyarwanda mu segonda 10 — uyu munsi kuri 55 km, ejo kuri 3 m na Icyerekezo-1.",
              "1.6M farmers farm on 0.6 ha — one late rain = hunger. NASA data is free but never reaches them. We translate POWER + FIRMS into plain Kinyarwanda in 10 seconds — today at 55 km, tomorrow at 3 m with Icyerekezo-1.",
              "1,6M agriculteurs sur 0,6 ha — une pluie tardive = faim. Les données NASA sont gratuites mais n’arrivent jamais. On traduit POWER + FIRMS en kinyarwanda clair en 10s — aujourd’hui à 55 km, demain à 3 m avec Icyerekezo-1."
            )}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="bg-white text-[#14532d] px-4 py-2 rounded-full text-xs font-black">🟢 ubuhinzi-sentinel.vercel.app</span>
            <span className="bg-white/10 border border-white/20 px-3 py-2 rounded-full text-xs">Kinyarwanda • English • Français</span>
          </div>
          <div className="mt-5 grid grid-cols-3 gap-2 max-w-[520px]">
            <div className="bg-white/10 border border-white/15 rounded-2xl p-3 text-center"><div className="text-lg">🌾</div><div className="font-black">0.6 ha</div><div className="text-xs text-white/70">{tr("umurima muto — ibihe 1 muri 3 bigwa","small farm — 1 in 3 seasons fail","petite ferme — 1 saison sur 3 échoue")}</div></div>
            <div className="bg-white/10 border border-white/15 rounded-2xl p-3 text-center"><div className="text-lg">🛰️</div><div className="font-black">55km → 3m</div><div className="text-xs text-white/70">{tr("POWER uyu munsi → Icyerekezo ejo","POWER today → Icyerekezo tomorrow","POWER aujourd’hui → Icyerekezo demain")}</div></div>
            <div className="bg-white/10 border border-white/15 rounded-2xl p-3 text-center"><div className="text-lg">💰</div><div className="font-black">$90/ha</div><div className="text-xs text-white/70">{tr("kuzamura 10% = amezi 3 y’ibiryo","10% save = 3 months food","10% sauvé = 3 mois de nourriture")}</div></div>
          </div>
          <div className="mt-6 bg-black/30 backdrop-blur border border-white/15 rounded-2xl p-3 flex gap-3 items-center">
            <div className="w-20 h-12 bg-white rounded-xl grid place-items-center text-lg">▶️</div>
            <div className="flex-1">
              <div className="font-bold text-sm text-white">{tr("Reba demo mu 60s","Watch 60-sec demo","Voir démo 60s")}</div>
              <div className="text-xs text-white/70">{tr("Shushanya umurima → reba itara → sangiza kuri WhatsApp","Draw field → see traffic light → share on WhatsApp","Dessinez champ → feu tricolore → partagez WhatsApp")}</div>
            </div>
            <Link href="#demo" className="bg-amber-400 text-stone-900 px-4 py-2 rounded-full text-xs font-black">{tr("Kinisha","Play","Lire")}</Link>
          </div>
        </div>
      </div>

      {/* PROBLEM / SOLUTION / SMALLSAT */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="card border-l-4 border-l-sky-500">
          <div className="text-xs font-black text-sky-700">01 — {tr("IKIBAZO","PROBLEM","PROBLÈME")}</div>
          <h2 className="font-black mt-1">{tr("Abahinzi bahinga bahumye","Farmers farm blind","Les agriculteurs à l’aveugle")}</h2>
          <p className="text-sm text-stone-600 mt-2">{tr("70% by’Abanyarwanda ni abahinzi; 32% inzara y’ibihe. Bugesera humye 1/3, Musanze imyuzure +12%, Nyagatare +1.2°C. Meteo ivuga kuri radio — si kuri buri gasozi mu Kinyarwanda gikoreshwa.","70% of Rwandans farm; 32% seasonal hunger. Bugesera drought 1-in-3, Musanze floods +12%, Nyagatare +1.2°C. Meteo warns by radio — not per-hill in actionable Kinyarwanda.","70% des Rwandais cultivent ; 32% faim saisonnière. Bugesera sécheresse 1/3, Musanze inondations +12%, Nyagatare +1,2°C. Météo avertit par radio — pas par colline en kinyarwanda actionnable.")}</p>
        </div>
        <div className="card border-l-4 border-l-emerald-500">
          <div className="text-xs font-black text-emerald-700">02 — {tr("IGISUBIZO","SOLUTION","SOLUTION")}</div>
          <h2 className="font-black mt-1">{tr("Umusemuzi, si dashboard","Translator, not dashboard","Traducteur, pas tableau")}</h2>
          <p className="text-sm text-stone-600 mt-2">{tr("Ntabwo tubanza kwerekana imbonerahamwe — twerekana itara:","We don’t show charts first — we show traffic light:","On ne montre pas d’abord des graphiques — feu tricolore :")}</p>
          <div className="mt-2 space-y-1 text-xs">
            <div className="flex gap-2 items-center bg-emerald-50 border border-emerald-200 rounded-xl p-2"><span className="dot-good"/> <b>🟢 {tr("Byiza — Komeza","Good — Continue","Bien — Continuez")}</b></div>
            <div className="flex gap-2 items-center bg-amber-50 border border-amber-200 rounded-xl p-2"><span className="dot-watch"/> <b>🟡 {tr("Witondere — Humbika","Watch — Mulch","Attention — Paillez")}</b></div>
            <div className="flex gap-2 items-center bg-red-50 border border-red-200 rounded-xl p-2"><span className="dot-bad"/> <b>🔴 {tr("Gihutireho — Vugana n’umujyanama","Alert — Talk to agronomist","Alerte — Parlez agronome")}</b></div>
          </div>
        </div>
        <div className="card border-l-4 border-l-amber-500">
          <div className="text-xs font-black text-amber-700">03 — {tr("KUKI SMALLSAT","WHY SMALLSAT","POURQUOI SMALLSAT")}</div>
          <h2 className="font-black mt-1">55 km → 3 m</h2>
          <p className="text-sm text-stone-600 mt-2">{tr("Uyu munsi POWER 55 km = akarere — bihagije kumenya Bugesera humutse kurusha umwaka ushize. Ejo Icyerekezo-1 3U CubeSat — 3 m buri munsi, ibona umurongo ukeneye amazi.","Today POWER 55 km = district blur — enough to know Bugesera is drier than last year. Tomorrow Icyerekezo-1 3U CubeSat — 3 m daily, sees which row needs water.","Aujourd’hui POWER 55 km = district flou — assez pour savoir Bugesera plus sec que l’an dernier. Demain Icyerekezo-1 3U CubeSat — 3 m quotidien, voit quel rang a besoin d’eau.")}</p>
          <div className="text-xs bg-amber-50 border border-amber-200 rounded-xl p-2 mt-2"><b>Icyerekezo-1:</b> 3U, 3m RGB+10m NIR, 400km SSO, ~$300k rideshare. RwaSat-1 (2019) → 2nd gen.</div>
        </div>
      </div>

      {/* DEMO + IMPACT */}
      <div id="demo" className="grid md:grid-cols-2 gap-4">
        <div className="card">
          <h2 className="font-black text-lg">🎬 {tr("Demo mu 60s — gerageza","Demo in 60s — try it","Démo en 60s — essayez")}</h2>
          <div className="mt-3 space-y-2 text-sm">
            <div className="flex gap-3 p-3 bg-stone-50 rounded-2xl border"><span className="text-lg">1️⃣</span><div><b>{tr("Hitamo agasozi","Pick your hill","Choisissez colline")}</b><div className="text-xs text-stone-600"><Link href="/map" className="underline">{tr("Ikarita → shushanya umurima","Map → draw field","Carte → dessinez")}</Link> {tr("cyangwa Musanze/Kigali/Bugesera.","or presets.","ou presets.")}</div></div></div>
            <div className="flex gap-3 p-3 bg-emerald-50 border border-emerald-200 rounded-2xl"><span className="text-lg">2️⃣</span><div><b>{tr("Bona itara","Get traffic light","Feu tricolore")}</b><div className="text-xs text-stone-600"><Link href="/fields" className="underline">{tr("Imirima yanjye","My Fields","Mes Champs")}</Link> 🟢🟡🔴 {tr("mu segonda 10.","in 10 sec.","en 10 sec.")}</div></div></div>
            <div className="flex gap-3 p-3 bg-amber-50 border border-amber-200 rounded-2xl"><span className="text-lg">3️⃣</span><div><b>{tr("Kora ugenzure","Act & verify","Agir & vérifiez")}</b><div className="text-xs text-stone-600">{tr("Sura umurima, fata ifoto, sangiza kuri WhatsApp. *162# kuri telefone nto.","Check field, photo, share WhatsApp. *162# on dumb phone.","Vérifiez champ, photo, partage WhatsApp. *162# sur téléphone simple.")}</div></div></div>
          </div>
          <div className="mt-3 flex gap-2">
            <Link href="/fields" className="btn">🌾 {tr("Fungura imirima","Open Fields","Ouvrir Champs")}</Link>
            <Link href="/map" className="btn-ghost">🗺️ {tr("Ikarita","Map","Carte")}</Link>
          </div>
        </div>
        <div className="card bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200">
          <h2 className="font-black text-[#166534]">💰 {tr("Ingaruka mu RWF","Impact in RWF","Impact en RWF")}</h2>
          <div className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between bg-white rounded-2xl p-3 border"><span>🇷🇼 {tr("Abahinzi","Farmers","Agriculteurs")}</span><b>{rwandaImpact.agriculture.smallholders} • {rwandaImpact.agriculture.avgPlot} ha</b></div>
            <div className="flex justify-between bg-white rounded-2xl p-3 border"><span>🌽 {tr("Umusaruro","Yield","Rendement")}</span><b>{rwandaImpact.economics.maizeYield} t/ha @ {rwandaImpact.economics.pricePerKg} RWF/kg</b></div>
            <div className="bg-[#166534] text-white rounded-2xl p-4 text-center"><div className="font-black">{tr("Kuzigama 10% → $90 / ha","Save 10% → $90 / ha","Sauver 10% → $90 / ha")}</div><div className="text-xs opacity-90">{rwandaImpact.economics.example}</div></div>
          </div>
          <div className="text-xs text-stone-600 mt-3">{tr("100,000 ha (6% y’ubutaka) → $9M / ibihe — ihuye na 18 CubeSats.","100,000 ha (6% cropland) → $9M / season — pays for 18 CubeSats.","100 000 ha (6% terres) → $9M / saison — paie 18 CubeSats.")}</div>
        </div>
      </div>

      {/* TEAM */}
      <div className="card">
        <h2 className="font-black text-lg">{tr("Itsinda — abantu, si logos","Team — people, not logos","Équipe — personnes, pas logos")}</h2>
        <p className="text-xs text-stone-500">{tr("Yubatswe i Kigali ku bahinzi — NASA data ni ubuntu, akazi kacu ni ukuyisobanura.","Built in Kigali for farmers — NASA data is free, our job is to make it understood.","Construit à Kigali pour agriculteurs — données NASA gratuites, notre job est de les rendre comprises.")}</p>
        <div className="mt-4 grid sm:grid-cols-3 gap-3 text-sm">
          <div className="p-4 bg-stone-50 rounded-2xl border text-center"><div className="w-12 h-12 bg-[#166534] text-white rounded-full grid place-items-center mx-auto">I</div><div className="font-black mt-2">iskevine23</div><div className="text-xs text-stone-500">Full-stack • Supabase/Vercel • Musanze fix</div></div>
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-center"><div className="w-12 h-12 bg-amber-400 rounded-full grid place-items-center">🌾</div><div className="font-black mt-2">{tr("Umuhinzi w’ikitegererezo","Farmer tester","Agriculteur testeur")}</div><div className="text-xs text-stone-600">Musanze Plot 4 — {tr("yafashe 0% ikosa","caught 0% lie","a trouvé 0% mensonge")}</div></div>
          <div className="p-4 bg-sky-50 border border-sky-200 rounded-2xl text-center"><div className="w-12 h-12 bg-sky-600 text-white rounded-full grid place-items-center">🛰️</div><div className="font-black mt-2">Icyerekezo-1</div><div className="text-xs text-stone-600">RwaSat-1 → 3m daily</div></div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2 justify-center">
          <Link href="/" className="bg-[#166534] text-white px-5 py-2 rounded-full text-sm font-black">🌾 {tr("Gerageza live","Try live","Essayer live")} →</Link>
          <a href="https://github.com/iskevine23/Nasa-space-app-challenge" target="_blank" className="bg-stone-900 text-white px-5 py-2 rounded-full text-sm">GitHub</a>
          <Link href="/science" className="btn-ghost">{tr("Reba ubushakashatsi","See Science","Voir Science")}</Link>
        </div>
      </div>
    </div>
  );
}
