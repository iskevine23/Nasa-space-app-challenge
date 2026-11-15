"use client";
import { useEffect, useState } from "react";
import { PowerChart } from "@/components/TimeSeries";
import { useLang, dict } from "@/lib/i18n";
import { localizedStatus } from "@/lib/analysis/farmerAdvice";
import { toFarmerStatus } from "@/lib/analysis/farmerAdvice";

export default function FieldsPage() {
  const { lang } = useLang();
  const t = (k: string) => (dict.fields as any)[k]?.[lang] ?? k;
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
    try {
      const r = await fetch(`/api/power?lat=${f.lat}&lon=${f.lon}&days=30`);
      const j = await r.json();
      if (j.error) {
        setMeta({ drought: { level: "normal", score: 0, reasons: [lang==="rw"?"Amakuru aracyaza…": lang==="fr"?"Chargement…":"Data loading…"] }, flood: { level: "low", p3: 0, note: "—" }, lineage: j.error });
        setRows([]);
      } else {
        setMeta({ drought: j.drought || { level: "normal", score: 0, reasons: ["…"] }, flood: j.flood || { level: "low", p3: 0, note: "…" }, lineage: j.lineage });
        setRows(j.series || []);
      }
    } catch {
      setMeta({ drought: { level: "normal", score: 0, reasons: [lang==="rw"?"Nta murongo — koresha amakuru aheruka": lang==="fr"?"Hors ligne — dernières données":"Offline — using last data"] }, flood: { level: "low", p3: 0, note: "…" }, lineage: "" });
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
    if (!meta || !meta.drought) return <div className="p-4 rounded-[20px] border-2 bg-stone-50 border-stone-200"><div className="text-sm text-stone-500">{lang==="rw"?"Gutegereza inama…": lang==="fr"?"Chargement conseil…":"Loading advice…"}</div></div>;
    const level = meta.drought?.level || "normal";
    const isGood = level === "normal"; const isWatch = level === "watch";
    const farmer = toFarmerStatus(meta.drought, meta.flood);
    const loc = localizedStatus(farmer, lang);
    const adviceLabel = lang==="rw"?"Icyo wakora": lang==="fr"?"Conseil":"What to do";
    return (
      <div className={`p-4 rounded-[20px] border-2 ${isGood ? "bg-emerald-50 border-emerald-200" : isWatch ? "bg-amber-50 border-amber-300" : "bg-red-50 border-red-300"}`}>
        <div className="flex items-center gap-2">
          <span className="text-2xl">{isGood ? "🌱" : isWatch ? "🌤️" : "🥀"}</span>
          <div>
            <div className="font-black">{isGood ? (lang==="rw"?"Meze neza!": lang==="fr"?"Bonne pousse !":"Growing well!") : isWatch ? (lang==="rw"?"Witondere": lang==="fr"?"Attention":"Watch out") : (lang==="rw"?"Hagira icyo ukora!": lang==="fr"?"Agissez !":"Act now!")}</div>
            <div className="text-xs text-stone-600">{loc.title}</div>
            <div className="text-xs text-stone-500 italic">{meta.drought?.reasons?.[0] || ""}</div>
          </div>
        </div>
        {(() => {
          const p7 = rows.slice(-7).reduce((a:any,r:any)=>a+(r.PRECTOTCORR??0),0);
          const lastWet = (rows as any).at(-1)?.GWETTOP;
          const soilDisplay = lastWet == null ? "—" : Math.round(lastWet*100)+"%";
          const soilSub = lastWet == null ? (lang==="rw"?"nta makuru": lang==="fr"?"pas de données":"no data") : (lang==="rw"?"gitose": lang==="fr"?"humide":"moist");
          const tVals = rows.slice(-7).map((r:any)=>r.T2M).filter((v:any)=>v!=null);
          const tAvg = tVals.length ? (tVals.reduce((a:number,b:number)=>a+b,0)/tVals.length) : null;
          const tempDisplay = tAvg == null ? "—" : tAvg.toFixed(0)+"°C";
          const missingSoil = lastWet == null; const missingTemp = tAvg == null;
          return (
            <>
              <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                <div className="bg-white rounded-2xl p-2"><div className="text-xs text-stone-500">🌧️ {t("rain")}</div><div className="font-bold text-sm">{p7.toFixed(0)}mm</div><div className="text-[11px] text-stone-500">7 days</div></div>
                <div className={`bg-white rounded-2xl p-2 ${missingSoil ? "opacity-60 border border-dashed border-amber-300" : ""}`}><div className="text-xs text-stone-500">💧 {t("soil")}</div><div className="font-bold text-sm">{soilDisplay}</div><div className="text-[11px] text-stone-500">{soilSub}</div></div>
                <div className={`bg-white rounded-2xl p-2 ${missingTemp ? "opacity-60" : ""}`}><div className="text-xs text-stone-500">🌡️ Temp</div><div className="font-bold text-sm">{tempDisplay}</div><div className="text-[11px] text-stone-500">avg</div></div>
              </div>
              {(missingSoil || missingTemp) && <div className="mt-2 text-[11px] text-amber-700 bg-amber-50 border border-amber-200 rounded-xl p-2 text-center">{lang==="rw"?"⚠️ Nta makuru y’ubutaka uyu munsi — inama ishingiye ku mvura gusa. Sura umurima.": lang==="fr"?"⚠️ Capteur sol manquant — conseil basé sur pluie seule. Vérifiez le champ.":"⚠️ Soil sensor missing today — advice uses rain only. Check field visually."}</div>}
            </>
          );
        })()}
        <div className="mt-3 bg-white rounded-2xl p-3 border border-stone-100">
          <div className="text-xs font-black">👉 {adviceLabel}</div>
          <div className="text-sm mt-1">{loc.advice}</div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between gap-3 items-center">
        <h1 className="text-2xl font-black text-[#166534]">🌾 {t("title")} <span className="text-sm font-normal text-stone-500">— {t("subtitle")}</span></h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="card">
          <h2 className="font-black text-[#166534]">📍 {t("title")}</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {fields.map(f=>
              <li key={f.id} onClick={()=>pick(f)} className={`p-4 rounded-2xl border-2 cursor-pointer transition ${sel?.id===f.id?"bg-emerald-50 border-emerald-300 shadow-sm":"bg-white border-stone-100 hover:border-stone-200"}`}>
                <div className="font-bold flex justify-between">{f.name} <span>{f.crop==="maize"?"🌽":f.crop==="beans"?"🫘":f.crop==="rice"?"🍚":"🌿"}</span></div>
                <div className="text-xs text-stone-500">{f.area_ha ?? "?"} ha • {f.lat?.toFixed(2)}, {f.lon?.toFixed(2)}</div>
              </li>
            )}
            {!fields.length && <li className="text-stone-500 text-sm p-4 bg-stone-50 rounded-2xl">{t("noFields")}<br/>{t("pickHint")}</li>}
          </ul>
          <form onSubmit={create} className="mt-5 p-4 bg-stone-50 rounded-2xl space-y-3 text-sm border border-stone-100">
            <div className="font-black">➕ {t("add")}</div>
            <input placeholder={t("name") + " e.g. Bugesera plot 2"} value={form.name} onChange={e=>setForm({...form, name:e.target.value})} className="w-full border border-stone-200 rounded-full px-4 py-3" required />
            <div className="flex flex-wrap gap-1">
              <button type="button" onClick={()=>setForm({...form, lat:"-1.498", lon:"29.636"})} className="text-[11px] px-3 py-1 rounded-full border bg-emerald-50 border-emerald-200">📍 Musanze (-1.498, 29.636)</button>
              <button type="button" onClick={()=>setForm({...form, lat:"-1.94", lon:"30.06"})} className="text-[11px] px-3 py-1 rounded-full border bg-stone-50">Kigali</button>
              <button type="button" onClick={()=>setForm({...form, lat:"-2.15", lon:"30.25"})} className="text-[11px] px-3 py-1 rounded-full border bg-stone-50">Bugesera</button>
              <button type="button" onClick={()=>setForm({...form, lat:"-1.30", lon:"30.32"})} className="text-[11px] px-3 py-1 rounded-full border bg-stone-50">Nyagatare</button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <select value={form.crop} onChange={e=>setForm({...form, crop:e.target.value})} className="border border-stone-200 rounded-full px-3 py-3"><option>maize</option><option>beans</option><option>rice</option><option>cassava</option></select>
              <input value={form.area_ha} onChange={e=>setForm({...form, area_ha:e.target.value})} className="border border-stone-200 rounded-full px-3 py-3" placeholder="ha" />
              <input value={form.lat} onChange={e=>setForm({...form, lat:e.target.value})} className="border border-stone-200 rounded-full px-3 py-3" placeholder="lat" />
              <input value={form.lon} onChange={e=>setForm({...form, lon:e.target.value})} className="border border-stone-200 rounded-full px-3 py-3" placeholder="lon" />
            </div>
            <button className="btn w-full">{t("save")}</button>
            <p className="text-xs text-stone-500 text-center">{lang==="rw"?"Dukora agasanduku ka 2km ko kwerekana — nyuma ushobora gushushanya imbibi nyawe ku ikarita.": lang==="fr"?"On fait un carré 2km pour démo — ensuite dessinez votre limite sur la carte.":"We make a 2km box for demo — later you can draw your real border on map."}</p>
          </form>
        </div>

        <div className="lg:col-span-2 space-y-4">
          {!sel ? <div className="card text-center py-12"><div className="text-3xl">👈</div><div className="font-bold mt-2">{t("pickHint")}</div><div className="text-xs text-stone-500">{lang==="rw"?"Hitamo umurima ibumoso": lang==="fr"?"Choisissez un champ à gauche":t("pickHint")}</div></div> : (
            <>
              <div className="card">
                <div className="flex justify-between items-center">
                  <h2 className="font-black text-[#166534]">{sel.name} — {t("last30")}</h2>
                  <span className="pill bg-stone-100">{sel.crop} • {sel.area_ha}ha</span>
                </div>
                {loading ? <div className="mt-4 p-8 text-center"><div className="animate-spin w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full mx-auto"></div><div className="text-sm text-stone-500 mt-2">{t("loading")}</div></div> : rows.length ? (
                  <>
                    <div className="mt-4">{farmerCard()}</div>
                    <div className="mt-4"><PowerChart rows={rows} /></div>
                    <div className="mt-2 text-xs text-stone-400 text-center">{lang==="rw"?"Umurongo w’icyatsi = ubwiza • Uturongo tw’ubururu = imvura • Umutuku = ubushyuhe": lang==="fr"?"Ligne verte = verdure • Barres bleues = pluie • Rouge = température":"Green line = plant green-ness • Blue bars = rain • Red = temperature"}</div>
                  </>
                ) : <p className="text-sm text-stone-500">{t("noData")}</p>}
                {meta && (
                  <details className="mt-4">
                    <summary className="text-xs font-bold text-stone-600 cursor-pointer">🔍 {t("expert")} — drought: {meta?.drought?.level || "?"} • flood: {meta?.flood?.level || "?"} — <span className="font-normal text-stone-500">score {meta?.drought?.score ?? "—"}/100</span></summary>
                    <div className="mt-2 p-3 bg-stone-50 rounded-2xl text-xs space-y-1">
                      <div><b>Drought:</b> {meta?.drought?.level || "—"} — {meta?.drought?.reasons?.join(" • ") || "…"}</div>
                      <div><b>Flood:</b> {meta?.flood?.level || "—"} — {meta?.flood?.note || "…"} (3d {(meta as any)?.flood?.p3?.toFixed?.(1) || "—"}mm)</div>
                      <div className="text-stone-400">{meta?.lineage?.slice(0,140)}…</div>
                      <div className="mt-2 p-2 bg-white border rounded-xl"><b className="text-stone-700">Confidence:</b> <span className="text-stone-600">{meta?.lineage?.includes("MOCK") || meta?.lineage==="mock" ? (lang==="rw"?"Mock — POWER nyayo kuri Vercel": lang==="fr"?"Mock — vrai POWER sur Vercel":"Mock fallback — real POWER on Vercel") : (lang==="rw"?"NASA POWER MERRA-2 55km — reba akarere, si umurima. Kuri umurima hakenewe HLS 30m/Icyerekezo 3m.": lang==="fr"?"NASA POWER MERRA-2 55km — veille régionale, pas champ. Pour champ : HLS 30m/Icyerekezo 3m.":"NASA POWER MERRA-2 55km daily — regional watch, not field truth. For field, need HLS 30m/Icyerekezo 3m.")}</span> • <a href={`/api/power?lat=${sel.lat}&lon=${sel.lon}&days=30`} target="_blank" className="underline">Raw JSON</a></div>
                    </div>
                  </details>
                )}
              </div>
              <div className="card bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
                <h3 className="font-black">🌱 {t("whatToDo")} — next steps</h3>
                <ul className="list-disc ml-4 mt-2 text-sm space-y-1 text-stone-700">
                  <li><b>watch (yellow)</b> → {t("nextWatch")}</li>
                  <li><b>warning/red</b> → {t("nextWarn")}</li>
                  <li>{t("share")} <a href={`/api/power?lat=${sel.lat}&lon=${sel.lon}&days=30`} target="_blank" className="underline">{t("rawJson")}</a> {t("whatsapp")}</li>
                </ul>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
