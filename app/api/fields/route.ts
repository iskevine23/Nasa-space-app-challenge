import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function GET() {
  const sb = getSupabaseAdmin();
  if (!sb) return NextResponse.json({ fields: mockFields, source: "mock (no DB)" });
  try {
    const { data, error } = await sb.from("sentinel_fields").select("*").order("created_at", { ascending: false }).limit(50);
    if (error) throw error;
    return NextResponse.json({ fields: data });
  } catch (e:any) {
    return NextResponse.json({ fields: mockFields, source: "mock (DB fetch failed — works on Vercel)", error: String(e.message||e) });
  }
}

export async function POST(req: Request) {
  const body = await req.json();
  const sb = getSupabaseAdmin();
  if (!sb) return NextResponse.json({ ok: true, id: "mock-"+Date.now(), note: "DB not configured — using mock" });
  const { data, error } = await sb.from("sentinel_fields").insert({
    name: body.name,
    crop: body.crop,
    lon: body.lon, lat: body.lat,
    polygon: body.polygon,
    area_ha: body.area_ha
  }).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

const mockFields = [
  { id:"rw-kigali-1", name:"Kigali Demo — Maize", crop:"maize", lat:-1.94, lon:30.06, area_ha: 1.2, created_at: new Date().toISOString() },
  { id:"rw-bugesera-1", name:"Bugesera — Beans", crop:"beans", lat:-2.15, lon:30.25, area_ha: 0.8, created_at: new Date().toISOString() },
];
