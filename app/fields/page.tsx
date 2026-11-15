"use client";
import { useEffect, useState } from "react";
import { PowerChart } from "@/components/TimeSeries";

export default function FieldsPage() {
  const [fields, setFields] = useState<any[]>([]);
  const [sel, setSel] = useState<any>(null);
  const [rows, setRows] = useState<any[]>([]);
  const [meta, setMeta] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name:"", crop:"maize", lat:"-1.94", lon:"30.06", area_ha:"1.0" });

  const load = async () => {
    const r = await fetch("/api/fields"); const j = await r.json(); setFields(j.fields||[]);
    if ((j.fields||[])[0]) pick(j.fields[0]);
  };
  useEffect(()=>{ load(); }, []);

  const pick = async (f:any) => {
    setSel(f); setLoading(true);
    const r = await fetch(`/api/power?lat=${f.lat}&lon=${f.lon}&days=30`);
    const j = await r.json();
    setMeta({ drought: j.drought, flood: j.flood, lineage: j.lineage });
    setRows(j.series || []);
    setLoading(false);
  };

  const create = async (e:any) => {
    e.preventDefault();
    const body = { name: form.name, crop: form.crop, lat: Number(form.lat), lon: Number(form.lon), area_ha: Number(form.area_ha), polygon: [[Number(form.lat)-0.02, Number(form.lon)-0.02],[Number(form.lat)-0.02, Number(form.lon)+0.02],[Number(form.lat)+0.02, Number(form.lon)+0.02],[Number(form.lat)+0.02, Number(form.lon)-0.02]] };
    await fetch("/api/fields", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify(body) });
    setForm({ ...form, name:"" }); load();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-black">Fields — per-farm time series</h1>
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="card">
          <h2 className="font-bold">Your fields</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {fields.map(f=>
              <li key={f.id} onClick={()=>pick(f)} className={`p-3 rounded-xl border cursor-pointer hover:bg-slate-50 ${sel?.id===f.id?"bg-emerald-50 border-emerald-200":"bg-white"}`}>
                <div className="font-semibold">{f.name}</div>
                <div className="text-xs text-slate-500">{f.crop} • {f.area_ha ?? "?"} ha • {f.lat?.toFixed(2)}, {f.lon?.toFixed(2)}</div>
              </li>
            )}
            {!fields.length && <li className="text-slate-500 text-sm">No fields yet — create one →</li>}
          </ul>
          <form onSubmit={create} className="mt-4 space-y-2 text-sm">
            <div className="font-semibold">Add field (demo)</div>
            <input placeholder="Name e.g. Bugesera plot 2" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} className="w-full border rounded-xl px-3 py-2" required />
            <div className="grid grid-cols-2 gap-2">
              <select value={form.crop} onChange={e=>setForm({...form, crop:e.target.value})} className="border rounded-xl px-3 py-2"><option>maize</option><option>beans</option><option>rice</option><option>cassava</option></select>
              <input value={form.area_ha} onChange={e=>setForm({...form, area_ha:e.target.value})} className="border rounded-xl px-3 py-2" placeholder="ha" />
              <input value={form.lat} onChange={e=>setForm({...form, lat:e.target.value})} className="border rounded-xl px-3 py-2" placeholder="lat" />
              <input value={form.lon} onChange={e=>setForm({...form, lon:e.target.value})} className="border rounded-xl px-3 py-2" placeholder="lon" />
            </div>
            <button className="btn w-full">Save field</button>
            <p className="text-xs text-slate-500">Polygon auto-created as 2km box — replace with drawn polygon when you wire Mapbox Draw or Leaflet.draw.</p>
          </form>
        </div>

        <div className="lg:col-span-2 space-y-4">
          {!sel ? <div className="card text-sm text-slate-500">Select a field to see NASA POWER time series</div> : (
            <>
              <div className="card">
                <div className="flex justify-between items-start">
                  <h2 className="font-bold">{sel.name} — last 30 days</h2>
                  <a href={`/api/power?lat=${sel.lat}&lon=${sel.lon}&days=30`} target="_blank" className="btn-ghost text-xs">Raw JSON</a>
                </div>
                {loading ? <p className="text-sm text-slate-500 mt-2">Loading NASA POWER…</p> : rows.length ? <div className="mt-3"><PowerChart rows={rows} /></div> : <p className="text-sm text-slate-500">No data</p>}
                {meta && (
                  <div className="mt-3 grid md:grid-cols-3 gap-2 text-xs">
                    <div className={`p-3 rounded-xl border ${meta.drought.level==="normal"?"bg-emerald-50 border-emerald-200":"bg-amber-50 border-amber-200"}`}><b>Drought:</b> {meta.drought.level} — {meta.drought.reasons.join(" • ")}</div>
                    <div className={`p-3 rounded-xl border ${meta.flood.level==="low"?"bg-slate-50":"bg-blue-50 border-blue-200"}`}><b>Flood:</b> {meta.flood.level} — {meta.flood.note}</div>
                    <div className="p-3 rounded-xl border bg-white"><b>Source:</b> {meta.lineage?.slice(0,90)}…</div>
                  </div>
                )}
                <p className="text-xs text-slate-500 mt-3">NDVI shown is a <b>POWER-derived proxy</b> for demo. In production, swap <code>ndvi</code> for HLS NDVI (see Docs → Code → “Replace mock NDVI”).</p>
              </div>
              <div className="card text-xs leading-relaxed">
                <h3 className="font-bold">What to do next — agronomy tie-in</h3>
                <ul className="list-disc ml-4 mt-1 space-y-1 text-slate-700">
                  <li><b>watch</b> → advise mulching, early planting, check seed stock; schedule extension visit.</li>
                  <li><b>warning/emergency</b> → coordinate with MINAGRI & district agronomist; prioritize water harvesting; document with geotagged photos for ground truth.</li>
                  <li>Export this chart as PNG/CSV via the Raw JSON link → attach to farmer SMS/WhatsApp advisory (see Docs → Alerting).</li>
                </ul>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
