import type { PowerPoint } from "@/lib/nasa/power";

// Simple advisory drought & crop stress heuristics — NOT a replacement for field verification.
// Combines: 7/30-day precip sum, temperature anomaly, soil wetness.

export type DroughtSignal = {
  level: "normal" | "watch" | "warning" | "emergency";
  score: number; // 0-100, higher = more stress
  reasons: string[];
};

export function assessDrought(series: PowerPoint[], baseline?: { p30median?: number }): DroughtSignal {
  if (series.length < 7) return { level: "normal", score: 0, reasons: ["Need ≥7 days of POWER data"] };
  const last7 = series.slice(-7);
  const last30 = series.slice(-30);
  const sum = (arr: (number|null)[]) => arr.filter(v=>v!=null).reduce((a,b)=>a+(b as number),0);
  const avg = (arr: (number|null)[]) => { const f=arr.filter(v=>v!=null) as number[]; return f.length? f.reduce((a,b)=>a+b,0)/f.length : null; };
  const p7 = sum(last7.map(r=>r.PRECTOTCORR));
  const p30 = sum(last30.map(r=>r.PRECTOTCORR));
  const tAvg = avg(last7.map(r=>r.T2M));
  const wet = avg(last7.map(r=>r.GWETTOP));

  let score = 0; const reasons:string[]=[];
  if (p7 < 5) { score += 30; reasons.push(`Very low 7-day rainfall: ${p7.toFixed(1)} mm`); }
  else if (p7 < 15) { score += 15; reasons.push(`Low 7-day rainfall: ${p7.toFixed(1)} mm`); }

  if (p30 < 20) { score += 30; reasons.push(`30-day rainfall only ${p30.toFixed(1)} mm — drought watch`); }
  else if (p30 < 50) { score += 12; reasons.push(`Below-average 30-day rainfall: ${p30.toFixed(1)} mm`); }

  if (wet != null && wet < 0.3) { score += 20; reasons.push(`Topsoil wetness low (GWETTOP ${(wet*100).toFixed(0)}%)`); }
  else if (wet == null) { reasons.push(`Soil moisture data missing — advice based on rain & temp only`); }
  if (tAvg != null && tAvg > 27) { score += 10; reasons.push(`High mean temp ${tAvg.toFixed(1)}°C — evapotranspiration stress`); }
  else if (tAvg == null) { reasons.push(`Temperature data missing for some days`); }

  if (score < 20) return { level: "normal", score, reasons: reasons.length?reasons:["Conditions near normal"] };
  if (score < 40) return { level: "watch", score, reasons };
  if (score < 65) return { level: "warning", score, reasons };
  return { level: "emergency", score, reasons };
}

export function ndviMockFromPower(series: PowerPoint[]) {
  // Generate a plausible NDVI proxy from precip & wetness for demo when HLS unavailable.
  // Real deployment should replace with HLS/MODIS NDVI via AppEEARS or STAC.
  // Formula: NDVI ~ 0.55 + 0.15*wetness + 0.02*log1p(p30/10) -0.01*tempAnomaly, clamped 0.1-0.9
  return series.map(r=>{
    const p = r.PRECTOTCORR ?? 0;
    const w = r.GWETTOP ?? 0.5;
    const t = r.T2M ?? 22;
    let v = 0.55 + 0.15*(w-0.5) + 0.02*Math.log1p(Math.max(0,p)) - 0.008*Math.max(0,t-24);
    v = Math.max(0.12, Math.min(0.88, v + (Math.random()-0.5)*0.04));
    return { date: r.date, ndvi: Number(v.toFixed(3)), precip: p, wetness: w };
  });
}

export function floodRisk(series: PowerPoint[]) {
  const last3 = series.slice(-3);
  const p3 = last3.reduce((a,r)=>a+(r.PRECTOTCORR||0),0);
  const p1 = series.at(-1)?.PRECTOTCORR || 0;
  if (p1 > 50 || p3 > 80) return { level: "high" as const, p3, p1, note: "Heavy recent rain — flood watch; check river gauges & local alerts" };
  if (p1 > 25 || p3 > 45) return { level: "elevated" as const, p3, p1, note: "Elevated 3-day rainfall" };
  return { level: "low" as const, p3, p1, note: "No heavy rain signal in POWER" };
}
