"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
const DrawFieldMap = dynamic(() => import("@/components/DrawFieldMap"), { ssr: false });

export default function MapPage() {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [eonet, setEonet] = useState<any[]>([]);
  const [fields, setFields] = useState<any[]>([]);
  const [showHelp, setShowHelp] = useState(true);
  const [saveName, setSaveName] = useState("");
  const [saveCrop, setSaveCrop] = useState("maize");

  const loadFields = () => {
    fetch("/api/fields").then(r=>r.json()).then(j=> {
      const list = (j.fields||[]).map((f:any)=> ({ id:f.id, name:f.name, crop:f.crop, area_ha:f.area_ha, polygon: f.polygon || [[-1.97,30.04],[-1.97,30.08],[-1.92,30.08],[-1.92,30.04]] as any }));
      if (list.length) setFields(list);
    });
  };
  useEffect(()=>{ loadFields(); fetch("/api/eonet?category=wildfires&days=7&limit=20").then(r=>r.json()).then(j=> setEonet(j.events||[])).catch(()=>{}); }, []);

  const handleDrawSave = async (poly: [number, number][]) => {
    const name = saveName || `My Field — ${new Date().toISOString().slice(0,10)}`;
    const lats = poly.map(p=>p[0]); const lons = poly.map(p=>p[1]);
    const lat = lats.reduce((a,b)=>a+b,0)/lats.length;
    const lon = lons.reduce((a,b)=>a+b,0)/lons.length;
    // rough area ha via shoelace in degrees → approx
    const area = Math.abs(poly.reduce((acc, p, i)=> acc + (poly[i][1]*poly[(i+1)%poly.length][0] - poly[(i+1)%poly.length][1]*poly[i][0]),0))*111*111/2;
    const area_ha = Math.max(0.1, Number(area.toFixed(2)));
    await fetch("/api/fields", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ name, crop: saveCrop, lat, lon, area_ha, polygon: poly })});
    setSaveName("");
    loadFields();
    alert(`✅ Saved ${name} — ${area_ha} ha • Go to My Fields to see its rain & advice!`);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[#166534]">🗺️ Map — draw your land</h1>
          <p className="text-xs text-stone-500">Draw your border • Green = your field • 🔥 = fire • Layers top-right • Icyerekezo 3m preview</p>
        </div>
        <div className="flex gap-2 items-center text-sm flex-wrap">
          <label className="text-xs font-bold">Date
            <input type="date" value={date} onChange={e=>setDate(e.target.value)} className="ml-2 border border-stone-200 rounded-full px-3 py-2" />
          </label>
          <a href={`https://worldview.earthdata.nasa.gov/?l=VIIRS_SNPP_CorrectedReflectance_TrueColor,GPM_IMERG_Precipitation_Rate&v=28,-3.2,31.5,-1&t=${date}`} target="_blank" className="hidden sm:inline-flex btn-ghost">NASA Worldview →</a>
        </div>
      </div>

      {showHelp && (
        <div className="card bg-amber-50 border-amber-200 flex gap-3">
          <span className="text-xl">💡</span>
          <div className="flex-1">
            <div className="font-bold text-sm text-amber-900">How to draw — 10 seconds:</div>
            <div className="text-xs text-amber-800 mt-1 grid sm:grid-cols-3 gap-2">
              <span><b>1. Name it</b> below → 2. Tap “Draw” → 3. Tap corners on map clockwise → Save</span>
              <span><b>🟩 Green border</b> = your field — we watch rain & NDVI inside it</span>
              <span><b>🗺️ Layers</b> = True Color (photo), Rain, Green plants — try Rain before planting!</span>
            </div>
          </div>
          <button onClick={()=>setShowHelp(false)} className="text-stone-400 hover:text-stone-600">✕</button>
        </div>
      )}

      <div className="card">
        <div className="flex flex-wrap gap-2 items-end">
          <label className="text-xs font-bold">Field name<input value={saveName} onChange={e=>setSaveName(e.target.value)} placeholder="e.g. Musanze Plot 5" className="ml-2 border border-stone-200 rounded-full px-3 py-2 text-sm w-48" /></label>
          <label className="text-xs font-bold">Crop<select value={saveCrop} onChange={e=>setSaveCrop(e.target.value)} className="ml-2 border border-stone-200 rounded-full px-3 py-2 text-sm"><option>maize</option><option>beans</option><option>rice</option><option>potato</option><option>cassava</option></select></label>
          <span className="text-xs text-stone-500">— then use “Draw my field” on map</span>
        </div>
      </div>

      <div className="card p-2 overflow-hidden">
        <DrawFieldMap date={date} fields={fields} onSave={handleDrawSave} />
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="card">
          <h2 className="font-black text-[#166534]">🎨 Layers — simple</h2>
          <ul className="text-sm mt-3 space-y-2">
            <li className="flex gap-2"><span>📸</span><div><b>True Color photo</b><div className="text-xs text-stone-500">Real photo from space — see clouds & land.</div></div></li>
            <li className="flex gap-2"><span>🌧️</span><div><b>Rain</b><div className="text-xs text-stone-500">Blue = heavy rain. Good to check before planting.</div></div></li>
            <li className="flex gap-2"><span>🌿</span><div><b>Green-ness</b><div className="text-xs text-stone-500">Green = healthy plants. Brown = dry/stressed.</div></div></li>
          </ul>
          <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs"><b>🔬 Creative:</b> Drawn polygon → with Icyerekezo 3 m we’ll clip NDVI <i>inside</i> your border & compare to neighbor — not just center point.</div>
        </div>
        <div className="card md:col-span-2">
          <h2 className="font-black">🚨 Fires near you (last 7 days)</h2>
          <p className="text-xs text-stone-500">From NASA FIRMS (375m) + EONET. Red = check with neighbors!</p>
          <ul className="text-sm mt-3 grid sm:grid-cols-2 gap-2">
            {eonet.slice(0,6).map((ev:any)=>
              <li key={ev.id} className="p-3 bg-red-50 border border-red-100 rounded-2xl">
                <div className="font-bold flex gap-2">🔥 {ev.title}</div>
                <div className="text-xs text-stone-500">{ev.categories?.[0]?.title} — {ev.geometry?.[0]?.date?.slice(0,10)}</div>
                {ev.sources?.[0]?.url && <a href={ev.sources[0].url} target="_blank" className="text-xs underline text-red-700">see source →</a>}
              </li>
            )}
            {!eonet.length && <li className="sm:col-span-2 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-sm">✅ No big fires last 7 days — good news!</li>}
          </ul>
          <div className="mt-3 text-xs text-stone-500 flex flex-wrap gap-2"><span className="pill bg-stone-100">{fields.length} fields drawn</span><span className="pill bg-emerald-50 border-emerald-200">Draw more — we watch each daily via cron</span></div>
        </div>
      </div>

      <div className="card bg-stone-900 text-stone-200 border-stone-800 text-xs">
        <b className="text-white">⚠️ Remember:</b> Map photos are to <b className="text-amber-300">look</b>, not to measure. For numbers, open <a href="/fields" className="underline text-white">My Fields</a>. Cloud = no good photo that day — we say “— no data” honestly.
      </div>
    </div>
  );
}
