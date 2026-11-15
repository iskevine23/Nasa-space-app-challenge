"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
const LeafletMap = dynamic(()=> import("@/components/LeafletMap"), { ssr: false });

export default function MapPage() {
  const [date, setDate] = useState(new Date().toISOString().slice(0,10));
  const [fires, setFires] = useState<any[]>([]);
  const [fields, setFields] = useState<any[]>([]);
  const [eonet, setEonet] = useState<any[]>([]);

  useEffect(()=>{
    fetch("/api/fields").then(r=>r.json()).then(j=> {
      const list = (j.fields||[]).map((f:any)=> ({ id:f.id, name:f.name, polygon: f.polygon || [[-1.97,30.04],[-1.97,30.08],[-1.92,30.08],[-1.92,30.04]] as any }));
      if (list.length) setFields(list);
    });
    fetch("/api/eonet?category=wildfires&days=7&limit=20").then(r=>r.json()).then(j=> setEonet(j.events||[])).catch(()=>{});
    // FIRMS proxy — will be empty without key
    fetch("/api/ingest/firms").then(r=>r.json()).then(j=> {
      if (j.count===0) return;
    }).catch(()=>{});
  }, []);

  // sample fire points for demo around Kigali when FIRMS key missing
  const demoFires = [
    { lat: -1.88, lon: 30.12, date, frp: 12 },
    { lat: -2.05, lon: 30.30, date, frp: 8 },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <h1 className="text-xl font-black">Live Map — NASA GIBS + Fields</h1>
        <div className="flex gap-2 items-center text-sm">
          <label>Date
            <input type="date" value={date} onChange={e=>setDate(e.target.value)} className="ml-2 border rounded-xl px-3 py-1.5" />
          </label>
          <a href={`https://worldview.earthdata.nasa.gov/?l=VIIRS_SNPP_CorrectedReflectance_TrueColor,GPM_IMERG_Precipitation_Rate&v=28,-3.2,31.5,-1&t=${date}`} target="_blank" className="btn-ghost">Open in NASA Worldview →</a>
        </div>
      </div>
      <div className="card p-0 overflow-hidden">
        <LeafletMap date={date} fires={demoFires} fields={fields} />
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="card">
          <h2 className="font-bold">Layers</h2>
          <ul className="text-sm mt-2 space-y-1 text-slate-700 list-disc ml-4">
            <li><b>True Color (VIIRS)</b> — direct optical, daily. Best for cloud & haze check.</li>
            <li><b>IMERG Rain Rate</b> — derived, 0.1°, 30-min. Good for flood watch, not gauge truth.</li>
            <li><b>MODIS NDVI 8-day</b> — derived vegetation greenness. Use with time series.</li>
            <li>Add your SmallSat STAC: set <code>NEXT_PUBLIC_SMALLSAT_TILES</code> to a <code>{"{z}/{x}/{y}"}</code> URL.</li>
          </ul>
        </div>
        <div className="card">
          <h2 className="font-bold">Recent EONET events</h2>
          <ul className="text-xs mt-2 space-y-2">
            {eonet.slice(0,6).map((ev:any)=>
              <li key={ev.id} className="p-2 bg-slate-50 rounded-xl">
                <div className="font-semibold">{ev.title}</div>
                <div className="text-slate-500">{ev.categories?.[0]?.title} — {ev.geometry?.[0]?.date?.slice(0,10)}</div>
                {ev.sources?.[0]?.url && <a href={ev.sources[0].url} target="_blank" className="underline">source</a>}
              </li>
            )}
            {!eonet.length && <li className="text-slate-500">No wildfires in last 7 days for this feed — try Floods: <a href="/api/eonet?category=floods" className="underline">/api/eonet?category=floods</a></li>}
          </ul>
        </div>
      </div>
      <div className="card bg-amber-50 border-amber-200 text-sm">
        <b>Limitations:</b> GIBS tiles are visualizations — do math on the source NetCDF/HDF, not the JPEG. Cloud masks matter; optical NDVI is useless under cloud. Always show acquisition date and latency on exports.
      </div>
    </div>
  );
}
