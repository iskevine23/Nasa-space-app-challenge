import { NextResponse } from "next/server";
import { fetchPowerDaily } from "@/lib/nasa/power";
import { getSupabaseAdmin } from "@/lib/supabase";
import { assessDrought } from "@/lib/analysis/drought";

// GET /api/ingest/power?lat=-1.94&lon=30.06&field_id=xxx
// Designed for Vercel Cron: vercel.json -> { "crons": [{ "path": "/api/ingest/power", "schedule": "0 6 * * *"}] }
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const lat = Number(searchParams.get("lat") ?? "-1.94");
  const lon = Number(searchParams.get("lon") ?? "30.06");
  const field_id = searchParams.get("field_id") || null;
  const days = 14;
  const end = new Date().toISOString().slice(0,10);
  const start = new Date(Date.now()-days*864e5).toISOString().slice(0,10);
  try {
    const series = await fetchPowerDaily({ lat, lon, start, end });
    const drought = assessDrought(series);
    const sb = getSupabaseAdmin();
    if (sb) {
      await sb.from("sentinel_observations").insert({
        field_id, lat, lon, observed_at: end, source: "NASA POWER",
        payload: { series, drought }, created_at: new Date().toISOString()
      });
      if (drought.level !== "normal") {
        await sb.from("sentinel_alerts").insert({
          type: "drought", level: drought.level, message: drought.reasons.join(" • "),
          lat, lon, field_id, created_at: new Date().toISOString()
        });
      }
    }
    return NextResponse.json({ ok: true, ingested: series.length, drought });
  } catch (e:any) {
    return NextResponse.json({ ok: false, error: String(e.message) }, { status: 500 });
  }
}
