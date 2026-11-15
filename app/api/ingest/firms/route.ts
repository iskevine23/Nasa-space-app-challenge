import { NextResponse } from "next/server";
import { fetchFirmsArea, RWANDA_BBOX } from "@/lib/nasa/firms";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const bbox = searchParams.get("bbox") || RWANDA_BBOX;
  const res = await fetchFirmsArea({ bbox, dayRange: 2 });
  const sb = getSupabaseAdmin();
  if (sb && res.points.length) {
    const rows = res.points.slice(0,200).map(p=> ({
      type:"fire", level: "watch", message:`FIRMS ${p.satellite} detection ${p.acq_date} ${p.acq_time} FRP ${p.frp}`,
      lat: p.latitude, lon: p.longitude, created_at: new Date().toISOString(), payload: p
    }));
    await sb.from("sentinel_alerts").insert(rows);
  }
  return NextResponse.json({ ok: true, configured: res.configured, count: res.points.length, message: (res as any).message || undefined, bbox });
}
