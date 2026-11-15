import { NextResponse } from "next/server";
import { fetchPowerDaily } from "@/lib/nasa/power";
import { assessDrought, floodRisk, ndviMockFromPower } from "@/lib/analysis/drought";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const lat = Number(searchParams.get("lat") ?? "-1.94");
  const lon = Number(searchParams.get("lon") ?? "30.06");
  const days = Number(searchParams.get("days") ?? "30");
  const end = new Date().toISOString().slice(0,10);
  const start = new Date(Date.now() - days*864e5).toISOString().slice(0,10);
  let mock = false;
  try {
    let series: any;
    try { series = await fetchPowerDaily({ lat, lon, start, end }); } catch (e:any) {
      const { mockPowerSeries } = await import("@/lib/nasa/power");
      series = mockPowerSeries(lat, lon, days);
      mock = true;
    }
    const drought = assessDrought(series);
    const flood = floodRisk(series);
    const ndvi = ndviMockFromPower(series);
    const merged = series.map((r:any,i:number)=> ({ ...r, ndvi: ndvi[i].ndvi }));
    return NextResponse.json({ lat, lon, start, end, source: mock ? "MOCK (sandbox fallback) — real NASA POWER on Vercel" : "NASA POWER (MERRA-2 assimilated, 0.5°x0.625°)", mock, series: merged, drought, flood,
      lineage: "Observed= POWER precip/temperature derived from MERRA-2 reanalysis + satellite/gauge blend; Forecast= not included here — use Open-Meteo/GFS; NDVI mock= derived estimate — replace with HLS/MODIS when Earthdata token available.",
      disclaimer: "Advisory only — not a substitute for Rwanda Meteorology Agency or field scouting." });
  } catch (e:any) {
    try { const { mockPowerSeries } = await import("@/lib/nasa/power"); const series = mockPowerSeries(lat, lon, days); const { assessDrought: ad, floodRisk: fr, ndviMockFromPower: nd } = await import("@/lib/analysis/drought"); const drought = ad(series); const flood = fr(series); const ndvi = nd(series); const merged = series.map((r:any,i:number)=> ({ ...r, ndvi: ndvi[i].ndvi })); return NextResponse.json({ lat, lon, start, end, source: "MOCK fallback", mock:true, series: merged, drought, flood, lineage: "mock" }); } catch {}
    return NextResponse.json({ error: String(e.message||e) }, { status: 500 });
  }
}
