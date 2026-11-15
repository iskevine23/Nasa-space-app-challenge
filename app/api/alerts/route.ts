import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function GET() {
  const sb = getSupabaseAdmin();
  if (!sb) return NextResponse.json({ alerts: mockAlerts });
  try {
    const { data, error } = await sb.from("sentinel_alerts").select("*").order("created_at",{ascending:false}).limit(50);
    if (error) throw error;
    return NextResponse.json({ alerts: data ?? mockAlerts });
  } catch (e:any) {
    return NextResponse.json({ alerts: mockAlerts, mock:true, error: String(e.message||e) });
  }
}

const mockAlerts = [
  { id:"1", type:"drought_watch", level:"warning", message:"Low 7-day rainfall near Bugesera — consider mulching & water scheduling", created_at: new Date().toISOString(), lat:-2.15, lon:30.25 },
  { id:"2", type:"fire", level:"watch", message:"FIRMS: 3 VIIRS detections within 20km of Kigali in last 48h — verify with field reports", created_at: new Date().toISOString(), lat:-1.94, lon:30.06 },
];
