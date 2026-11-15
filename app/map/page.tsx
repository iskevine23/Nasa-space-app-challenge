"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
const LeafletMap = dynamic(()=> import("@/components/LeafletMap"), { ssr: false });

export default function MapPage() {
  const [date, setDate] = useState(new Date().toISOString().slice(0,10));
  const [eonet, setEonet] = useState<any[]>([]);
  const [fields, setFields] = useState<any[]>([]);
  const [showHelp, setShowHelp] = useState(true);

  useEffect(()=>{
    fetch("/api/fields").then(r=>r.json()).then(j=> {
      const list = (j.fields||[]).map((f:any)=> ({ id:f.id, name:f.name, polygon: f.polygon || [[-1.97,30.04],[-1.97,30.08],[-1.92,30.08],[-1.92,30.04]] as any }));
      if (list.length) setFields(list);
    });
    fetch("/api/eonet?category=wildfires&days=7&limit=20").then(r=>r.json()).then(j=> setEonet(j.events||[])).catch(()=>{});
  }, []);

  const demoFires = [
    { lat: -1.88, lon: 30.12, date, frp: 12 },
    { lat: -2.05, lon: 30.30, date, frp: 8 },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[#166534]">🗺️ Map — see your land</h1>
          <p className="text-xs text-stone-500">Green border = your field • 🔥 = fire seen by satellite • Tap layers top-right</p>
        </div>
        <div className="flex gap-2 items-center text-sm">
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
            <div className="font-bold text-sm text-amber-900">How to read the map — 10 seconds:</div>
            <div className="text-xs text-amber-800 mt-1 grid sm:grid-cols-3 gap-2">
              <span><b>🟩 Green border</b> = your field — we watch rain here</span>
              <span><b>🔥 Red dot</b> = satellite saw heat (maybe fire)</span>
              <span><b>🗺️ Layers</b> = top-right button: True Color (photo), Rain, Green plants</span>
            </div>
          </div>
          <button onClick={()=>setShowHelp(false)} className="text-stone-400 hover:text-stone-600">✕</button>
        </div>
      )}

      <div className="card p-0 overflow-hidden">
        <LeafletMap date={date} fires={demoFires} fields={fields} />
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="card">
          <h2 className="font-black text-[#166534]">🎨 Layers — simple</h2>
          <ul className="text-sm mt-3 space-y-2">
            <li className="flex gap-2"><span>📸</span><div><b>True Color photo</b><div className="text-xs text-stone-500">Real photo from space — see clouds & land.</div></div></li>
            <li className="flex gap-2"><span>🌧️</span><div><b>Rain</b><div className="text-xs text-stone-500">Blue = heavy rain. Good to check before planting.</div></div></li>
            <li className="flex gap-2"><span>🌿</span><div><b>Green-ness</b><div className="text-xs text-stone-500">Green = healthy plants. Brown = dry/stressed.</div></div></li>
          </ul>
          <div className="mt-3 p-3 bg-stone-50 rounded-2xl text-xs text-stone-500">💡 Tip: Change date above to see yesterday. For your SmallSat 3m photos, add tile URL in settings.</div>
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
            {!eonet.length && <li className="sm:col-span-2 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-sm">✅ No big fires last 7 days — good news! Map still shows 🔥 demo dots where we test.</li>}
          </ul>
        </div>
      </div>

      <div className="card bg-stone-900 text-stone-200 border-stone-800 text-xs">
        <b className="text-white">⚠️ Remember:</b> Map photos are to <b className="text-amber-300">look</b>, not to measure. For real flood/rain numbers, check your field's chart. Cloud = no good photo that day.
      </div>
    </div>
  );
}
