// NASA FIRMS — Fire Information for Resource Management System
// VIIRS 375m (Suomi-NPP/NOAA-20/21) + MODIS 1km. Latency <3h globally via LANCE NRT.
// Access requires MAP_KEY: https://firms.modaps.eosdis.nasa.gov/api/area/csv/<MAP_KEY>/VIIRS_SNPP_NRT/<bbox>/<day>
// Docs: https://www.earthdata.nasa.gov/data/tools/firms
// For MVP without a key we return empty and surface setup instructions.

export type FirmsPoint = {
  latitude: number; longitude: number; acq_date: string; acq_time: string;
  confidence: string; bright_ti4?: number; frp?: number; satellite: string;
};

export async function fetchFirmsArea(opts: { bbox: string; dayRange?: number; source?: string }) {
  const key = process.env.FIRMS_MAP_KEY;
  if (!key) return { configured: false, points: [] as FirmsPoint[], message: "FIRMS_MAP_KEY not set — add it in Vercel env to enable live fire data." };
  const source = opts.source || "VIIRS_SNPP_NRT"; // or VIIRS_NOAA20_NRT, MODIS_NRT
  const url = `https://firms.modaps.eosdis.nasa.gov/api/area/csv/${key}/${source}/${opts.bbox}/${opts.dayRange ?? 2}`;
  const r = await fetch(url);
  if (!r.ok) return { configured: true, points: [], message: `FIRMS ${r.status}` };
  const text = await r.text();
  const lines = text.trim().split("\n");
  if (lines.length < 2) return { configured: true, points: [], message: "FIRMS: no fires in window" };
  const header = lines[0].split(",");
  const idx = (k: string) => header.indexOf(k);
  const points: FirmsPoint[] = lines.slice(1).map(l => {
    const c = l.split(",");
    return {
      latitude: Number(c[idx("latitude")]),
      longitude: Number(c[idx("longitude")]),
      acq_date: c[idx("acq_date")],
      acq_time: c[idx("acq_time")],
      confidence: c[idx("confidence")] || c[idx("confidence")] || "n",
      bright_ti4: Number(c[idx("bright_ti4")] || c[idx("bright_ti5")] || 0),
      frp: Number(c[idx("frp")] || 0),
      satellite: c[idx("satellite")] || source
    };
  });
  return { configured: true, points };
}

// Rwanda bbox approx: 28.8,-2.9,31.2,-1.0  (lon_min,lat_min,lon_max,lat_max) but FIRMS expects lon_min,lat_min,lon_max,lat_max ?
// Actually FIRMS area API: .../<area>/ e.g. world or coordinates: "lat,lon" confusing. We use bbox form: "<west>,<south>,<east>,<north>"
export const RWANDA_BBOX = "28.8,-2.95,31.2,-1.0";
