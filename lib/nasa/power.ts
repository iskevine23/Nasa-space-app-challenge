// NASA POWER — https://power.larc.nasa.gov/docs/services/api/
// Free, no key. Resolution: meteorology 0.5° x 0.625° (~55km), daily update ~1 day lag.
// Parameters used for ag/disaster:
// T2M, T2M_MAX/MIN, PRECTOTCORR (bias-corrected precip), RH2M, WS2M, ALLSKY_SFC_SW_DWN (solar), GWETTOP/GWETROOT/GWETPROF (soil wetness profile, model-assimilated MERRA-2)
// NOTE: POWER is itself a model-assimilated product (MERRA-2 + observations), not a direct satellite measurement.

export type PowerPoint = {
  date: string;
  T2M: number | null;
  T2M_MAX: number | null;
  T2M_MIN: number | null;
  PRECTOTCORR: number | null;
  RH2M: number | null;
  WS2M: number | null;
  ALLSKY_SFC_SW_DWN: number | null;
  GWETTOP: number | null;
  GWETROOT: number | null;
};

export async function fetchPowerDaily(opts: { lat: number; lon: number; start: string; end: string; }): Promise<PowerPoint[]> {
  const params = ["T2M","T2M_MAX","T2M_MIN","PRECTOTCORR","RH2M","WS2M","ALLSKY_SFC_SW_DWN","GWETTOP","GWETROOT","GWETPROF"].join(",");
  const url = `https://power.larc.nasa.gov/api/temporal/daily/point?parameters=${params}&community=AG&longitude=${opts.lon}&latitude=${opts.lat}&start=${opts.start.replace(/-/g,"")}&end=${opts.end.replace(/-/g,"")}&format=JSON`;
  let res: Response;
  try { res = await fetch(url, { next: { revalidate: 3600 } } as any); }
  catch (e:any) { throw new Error(`POWER fetch failed (sandbox network restricted — will use mock on Vercel): ${e.message}`); }
  if (!res.ok) throw new Error(`POWER ${res.status} ${await res.text()}`);
  const j = await res.json();
  const props = j?.properties?.parameter;
  if (!props) throw new Error("POWER: missing properties.parameter");
  const dates = Object.keys(props.PRECTOTCORR || props.T2M || {});
  return dates.map(d => {
    const iso = `${d.slice(0,4)}-${d.slice(4,6)}-${d.slice(6,8)}`;
    const pick = (k: string) => {
      const v = props[k]?.[d];
      return v === -999 || v == null ? null : Number(v);
    };
    return {
      date: iso,
      T2M: pick("T2M"), T2M_MAX: pick("T2M_MAX"), T2M_MIN: pick("T2M_MIN"),
      PRECTOTCORR: pick("PRECTOTCORR"), RH2M: pick("RH2M"), WS2M: pick("WS2M"),
      ALLSKY_SFC_SW_DWN: pick("ALLSKY_SFC_SW_DWN"),
      GWETTOP: pick("GWETTOP"), GWETROOT: pick("GWETROOT")
    };
  });
}

export async function powerHealth(lat=-1.94, lon=30.06) {
  try {
    const end = new Date().toISOString().slice(0,10);
    const start = new Date(Date.now()- 3*864e5).toISOString().slice(0,10);
    const rows = await fetchPowerDaily({ lat, lon, start, end });
    return { ok: true, rows: rows.length };
  } catch (e:any) { return { ok: false, error: String(e?.message||e) }; }
}

export function mockPowerSeries(lat:number, lon:number, days=30): PowerPoint[] {
  const out: PowerPoint[] = [];
  const isBugesera = Math.abs(lat+2.15)<0.2;
  for (let i=days-1;i>=0;i--) {
    const d = new Date(Date.now()-i*864e5);
    const iso = d.toISOString().slice(0,10);
    const baseRain = isBugesera ? 1.2 : 3.5;
    const rain = Math.max(0, baseRain + (Math.random()-0.5)*6 + Math.sin(i/3)*2);
    const t = 22 + Math.sin(i/5)*2 + (isBugesera?1.5:0) + (Math.random()-0.5);
    out.push({
      date: iso,
      T2M: Number(t.toFixed(1)), T2M_MAX: Number((t+4).toFixed(1)), T2M_MIN: Number((t-5).toFixed(1)),
      PRECTOTCORR: Number(rain.toFixed(1)), RH2M: 65+Math.round((Math.random()-0.5)*10),
      WS2M: 2+Math.random()*1.5, ALLSKY_SFC_SW_DWN: 5.5+Math.random(),
      GWETTOP: Number((0.45+ (Math.random()-0.5)*0.2).toFixed(2)),
      GWETROOT: Number((0.5+ (Math.random()-0.5)*0.15).toFixed(2))
    });
  }
  return out;
}
