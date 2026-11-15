"use client";
import { useEffect, useState } from "react";
import { PowerChart } from "@/components/TimeSeries";

type Lang = "rw" | "en" | "fr";
const t = {
  rw: { myFields: "Imirima yanjye", addField: "Ongeraho umurima", name: "Izina ry'umurima", crop: "Igihingwa", area: "Ubuso (ha)", save: "Bika", pickHint: "Hitamo umurima urebe uko imeze", last30: "Iminsi 30 ishize", whatToDo: "Icyo wakora", soil: "Ubutaka", rain: "Imvura", plant: "Ubwiza bw'imyaka", normal: "Bisanzwe", watch: "Witondere", warning: "Burya", expert: "Byihariye (umujyanama)" },
  en: { myFields: "My fields", addField: "Add field", name: "Field name", crop: "Crop", area: "Area (ha)", save: "Save field", pickHint: "Pick a field to see its story", last30: "Last 30 days", whatToDo: "What to do", soil: "Soil", rain: "Rain", plant: "Plant health", normal: "Good", watch: "Watch", warning: "Alert", expert: "Expert details" },
  fr: { myFields: "Mes champs", addField: "Ajouter", name: "Nom", crop: "Culture", area: "Surface (ha)", save: "Enregistrer", pickHint: "Choisissez un champ", last30: "30 derniers jours", whatToDo: "Que faire", soil: "Sol", rain: "Pluie", plant: "Santé", normal: "Bon", watch: "Attention", warning: "Alerte", expert: "Détails" },
};

export default function FieldsPage() {
  const [lang, setLang] = useState<Lang>("rw");
  const [fields, setFields] = useState<any[]>([]);
  const [sel, setSel] = useState<any>(null);
  const [rows, setRows] = useState<any[]>([]);
  const [meta, setMeta] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name:"", crop:"maize", lat:"-1.94", lon:"30.06", area_ha:"1.0" });
  const tr = t[lang];

  const load = async () => {
    const r = await fetch("/api/fields"); const j = await r.json(); setFields(j.fields||[]);
    if ((j.fields||[])[0]) pick(j.fields[0]);
  };
  useEffect(()=>{ load(); }, []);

  const pick = async (f:any) => {
    setSel(f); setLoading(true);
    try {
      const r = await fetch(`/api/power?lat=${f.lat}&lon=${f.lon}&days=30`);
      const j = await r.json();
      if (j.error) {
        setMeta({ drought: { level: "normal", score: 0, reasons: ["Data loading…"] }, flood: { level: "low", p3: 0, note: "—" }, lineage: j.error });
        setRows([]);
      } else {
        setMeta({ drought: j.drought || { level: "normal", score: 0, reasons: ["…"] }, flood: j.flood || { level: "low", p3: 0, note: "…" }, lineage: j.lineage });
        setRows(j.series || []);
      }
    } catch (e) {
      setMeta({ drought: { level: "normal", score: 0, reasons: ["Offline — using last data"] }, flood: { level: "low", p3: 0, note: "…" }, lineage: "" });
      setRows([]);
    }
    setLoading(false);
  };

  const create = async (e:any) => {
    e.preventDefault();
    const body = { name: form.name, crop: form.crop, lat: Number(form.lat), lon: Number(form.lon), area_ha: Number(form.area_ha), polygon: [[Number(form.lat)-0.02, Number(form.lon)-0.02],[Number(form.lat)-0.02, Number(form.lon)+0.02],[Number(form.lat)+0.02, Number(form.lon)+0.02],[Number(form.lat)+0.02, Number(form.lon)-0.02]] };
    await fetch("/api/fields", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify(body) });
    setForm({ ...form, name:"" }); load();
  };

  const farmerCard = () => {
    if (!meta || !meta.drought) return (
      <div className="p-4 rounded-[20px] border-2 bg-stone-50 border-stone-200">
        <div className="text-sm text-stone-500">Loading advice… Gutegereza…</div>
      </div>
    );
    const level = meta.drought?.level || "normal";
    const isGood = level === "normal";
    const isWatch = level === "watch";
    return (
      <div className={`p-4 rounded-[20px] border-2 ${isGood ? "bg-emerald-50 border-emerald-200" : isWatch ? "bg-amber-50 border-amber-300" : "bg-red-50 border-red-300"}`}>
        <div className="flex items-center gap-2">
          <span className="text-2xl">{isGood ? "🌱" : isWatch ? "🌤️" : "🥀"}</span>
          <div>
            <div className="font-black">{isGood ? (lang==="rw"?"Meze neza!":"Growing well!") : isWatch ? (lang==="rw"?"Witondere":"Watch out") : (lang==="rw"?"Hagira icyo ukora!":"Act now!")}</div>
            <div className="text-xs text-stone-600">{meta.drought?.reasons?.[0] || "Checking conditions…"}</div>
          </div>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2 text-center">
          <div className="bg-white rounded-2xl p-2"><div className="text-xs text-stone-500">🌧️ {tr.rain}</div><div className="font-bold text-sm">{rows.slice(-7).reduce((a,r)=>a+(r.PRECTOTCORR||0),0).toFixed(0)}mm</div><div className="text-[11px] text-stone-500">7 days</div></div>
          <div className="bg-white rounded-2xl p-2"><div className="text-xs text-stone-500">💧 {tr.soil}</div><div className="font-bold text-sm">{Math.round((rows.at(-1)?.GWETTOP||0)*100)}%</div><div className="text-[11px] text-stone-500">moist</div></div>
          <div className="bg-white rounded-2xl p-2"><div className="text-xs text-stone-500">🌡️ Temp</div><div className="font-bold text-sm">{(rows.slice(-7).reduce((a,r)=>a+(r.T2M||0),0)/7).toFixed(0)}°C</div><div className="text-[11px] text-stone-500">avg</div></div>
        </div>
        <div className="mt-3 bg-white rounded-2xl p-3 border border-stone-100">
          <div className="text-xs font-black">👉 {tr.whatToDo}</div>
          <div className="text-sm mt-1">{isGood ? (lang==="rw"?"Komeza neza, fata ifoto buri cyumweru.":"Keep going, photo each week.") : isWatch ? (lang==="rw"?"Humbika ubutaka, vomeera mu gitondo.":"Mulch, water morning.") : (lang==="rw"?"Vugana n'umujyanama, ntahingire ifumbire.":"Talk to agronomist, no fertilizer.")}</div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between gap-3 items-center">
        <h1 className="text-2xl font-black text-[#166534]">🌾 {tr.myFields} <span className="text-sm font-normal text-stone-500">— per-farm story</span></h1>
        <div className="flex gap-1 bg-stone-100 p-1 rounded-full">
          <button onClick={()=>setLang("rw")} className={`px-3 py-1 rounded-full text-xs font-bold ${lang==="rw"?"bg-white shadow":""}`}>RW</button>
          <button onClick={()=>setLang("en")} className={`px-3 py-1 rounded-full text-xs font-bold ${lang==="en"?"bg-white shadow":""}`}>EN</button>
          <button onClick={()=>setLang("fr")} className={`px-3 py-1 rounded-full text-xs font-bold ${lang==="fr"?"bg-white shadow":""}`}>FR</button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="card">
          <h2 className="font-black text-[#166534]">📍 {tr.myFields}</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {fields.map(f=>
              <li key={f.id} onClick={()=>pick(f)} className={`p-4 rounded-2xl border-2 cursor-pointer transition ${sel?.id===f.id?"bg-emerald-50 border-emerald-300 shadow-sm":"bg-white border-stone-100 hover:border-stone-200"}`}>
                <div className="font-bold flex justify-between">{f.name} <span>{f.crop==="maize"?"🌽":f.crop==="beans"?"🫘":f.crop==="rice"?"🍚":"🌿"}</span></div>
                <div className="text-xs text-stone-500">{f.area_ha ?? "?"} ha • {f.lat?.toFixed(2)}, {f.lon?.toFixed(2)}</div>
              </li>
            )}
            {!fields.length && <li className="text-stone-500 text-sm p-4 bg-stone-50 rounded-2xl">Nta murima urahari — ongeraho umwe 👇<br/>No fields yet — add one below</li>}
          </ul>
          <form onSubmit={create} className="mt-5 p-4 bg-stone-50 rounded-2xl space-y-3 text-sm border border-stone-100">
            <div className="font-black">➕ {tr.addField}</div>
            <input placeholder={tr.name + " e.g. Bugesera plot 2"} value={form.name} onChange={e=>setForm({...form, name:e.target.value})} className="w-full border border-stone-200 rounded-full px-4 py-3" required />
            <div className="grid grid-cols-2 gap-2">
              <select value={form.crop} onChange={e=>setForm({...form, crop:e.target.value})} className="border border-stone-200 rounded-full px-3 py-3"><option>maize</option><option>beans</option><option>rice</option><option>cassava</option></select>
              <input value={form.area_ha} onChange={e=>setForm({...form, area_ha:e.target.value})} className="border border-stone-200 rounded-full px-3 py-3" placeholder="ha" />
              <input value={form.lat} onChange={e=>setForm({...form, lat:e.target.value})} className="border border-stone-200 rounded-full px-3 py-3" placeholder="lat" />
              <input value={form.lon} onChange={e=>setForm({...form, lon:e.target.value})} className="border border-stone-200 rounded-full px-3 py-3" placeholder="lon" />
            </div>
            <button className="btn w-full">{tr.save} • Bika</button>
            <p className="text-xs text-stone-500 text-center">We make a 2km box for demo — later you can draw your real border on map.</p>
          </form>
        </div>

        <div className="lg:col-span-2 space-y-4">
          {!sel ? <div className="card text-center py-12"><div className="text-3xl">👈</div><div className="font-bold mt-2">{tr.pickHint}</div><div className="text-xs text-stone-500">Choose a field on the left to see its rain & soil story</div></div> : (
            <>
              <div className="card">
                <div className="flex justify-between items-center">
                  <h2 className="font-black text-[#166534]">{sel.name} — {tr.last30}</h2>
                  <span className="pill bg-stone-100">{sel.crop} • {sel.area_ha}ha</span>
                </div>
                {loading ? <div className="mt-4 p-8 text-center"><div className="animate-spin w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full mx-auto"></div><div className="text-sm text-stone-500 mt-2">Reading satellite… Gusoma satelite…</div></div> : rows.length ? (
                  <>
                    <div className="mt-4">{farmerCard()}</div>
                    <div className="mt-4"><PowerChart rows={rows} /></div>
                    <div className="mt-2 text-xs text-stone-400 text-center">Green line = plant green-ness • Blue bars = rain • Red = temperature • Simple view — advisor? open details below</div>
                  </>
                ) : <p className="text-sm text-stone-500">No data</p>}
                {meta && (
                  <details className="mt-4">
                    <summary className="text-xs font-bold text-stone-600 cursor-pointer">🔍 {tr.expert} — drought: {meta?.drought?.level || "?"} • flood: {meta?.flood?.level || "?"}</summary>
                    <div className="mt-2 p-3 bg-stone-50 rounded-2xl text-xs space-y-1">
                      <div><b>Drought:</b> {meta?.drought?.level || "—"} — {meta?.drought?.reasons?.join(" • ") || "…"}</div>
                      <div><b>Flood:</b> {meta?.flood?.level || "—"} — {meta?.flood?.note || "…"}</div>
                      <div className="text-stone-400">{meta?.lineage?.slice(0,120)}…</div>
                    </div>
                  </details>
                )}
              </div>
              <div className="card bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
                <h3 className="font-black">🌱 {tr.whatToDo} — next steps</h3>
                <ul className="list-disc ml-4 mt-2 text-sm space-y-1 text-stone-700">
                  <li><b>watch (yellow)</b> → mulching, check seed stock, visit field every 2 days.</li>
                  <li><b>warning/red</b> → water harvesting, talk to MINAGRI agronomist, photo for record.</li>
                  <li>Share your chart → <a href={`/api/power?lat=${sel.lat}&lon=${sel.lon}&days=30`} target="_blank" className="underline">Raw data JSON</a> to send via WhatsApp.</li>
                </ul>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
