import { NextResponse } from "next/server";
import { powerHealth } from "@/lib/nasa/power";

export async function GET() {
  const power = await powerHealth();
  return NextResponse.json({
    ok: true,
    time: new Date().toISOString(),
    services: {
      power,
      gibs: { ok: true, note: "GIBS WMTS tiles — no key, check https://gibs.earthdata.nasa.gov" },
      firms: { configured: !!process.env.FIRMS_MAP_KEY, note: "Set FIRMS_MAP_KEY to enable" },
      eonet: { ok: true, url: "https://eonet.gsfc.nasa.gov/api/v3/events" },
      supabase: { configured: !!process.env.NEXT_PUBLIC_SUPABASE_URL }
    },
    disclaimers: "Satellite-derived indicators are advisory; confirm with field & official sources."
  });
}
