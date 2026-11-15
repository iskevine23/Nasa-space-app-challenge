// Standalone ingest — run with: npm run ingest:power  (needs env)
// Demonstrates authenticated Supabase write + NASA POWER
import { fetchPowerDaily } from "../lib/nasa/power.js";

const lat = Number(process.env.LAT ?? "-1.94");
const lon = Number(process.env.LON ?? "30.06");
const days = 30;
const end = new Date().toISOString().slice(0,10);
const start = new Date(Date.now()-days*864e5).toISOString().slice(0,10);

const series = await fetchPowerDaily({ lat, lon, start, end });
console.log(`POWER ${lat},${lon} ${start}→${end}: ${series.length} days`);
console.table(series.slice(-5).map(r=> ({ date:r.date, precip:r.PRECTOTCORR, t2m:r.T2M, wet:r.GWETTOP })));
