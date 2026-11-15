import { fetchPowerDaily } from "@/lib/nasa/power";
import { assessDrought, floodRisk, ndviMockFromPower } from "@/lib/analysis/drought";
import { fetchEonet } from "@/lib/nasa/eonet";
import HomeClient from "@/components/HomeClient";

export const revalidate = 3600;

async function getPower(lat:number, lon:number) {
  const end = new Date().toISOString().slice(0,10);
  const start = new Date(Date.now()-30*864e5).toISOString().slice(0,10);
  try {
    let s: any;
    try { s = await fetchPowerDaily({ lat, lon, start, end }); } catch { const { mockPowerSeries } = await import("@/lib/nasa/power"); s = mockPowerSeries(lat, lon, 30); }
    return { series: s, drought: assessDrought(s), flood: floodRisk(s), ndvi: ndviMockFromPower(s) };
  } catch (e:any) { return { error: String(e.message) } as any; }
}

export default async function Page() {
  const kigali = await getPower(-1.94, 30.06);
  const bugesera = await getPower(-2.15, 30.25);
  const nyagatare = await getPower(-1.3, 30.3);
  let eonet: any = null;
  try { eonet = await fetchEonet({ limit: 4, days: 30 }); } catch {}
  return <HomeClient kigali={kigali} bugesera={bugesera} nyagatare={nyagatare} eonet={eonet} />;
}
