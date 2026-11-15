import { NextResponse } from "next/server";
import { fetchEonet } from "@/lib/nasa/eonet";
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const cat = searchParams.get("category") || undefined;
  const status = searchParams.get("status") || "open";
  const limit = Number(searchParams.get("limit") || "20");
  const days = Number(searchParams.get("days") || "30");
  try {
    let j:any;
    try { j = await fetchEonet({ category: cat, status, limit, days }); } catch { const { mockEonet } = await import("@/lib/nasa/eonet"); j = mockEonet; }
    return NextResponse.json(j);
  } catch (e:any) { return NextResponse.json({ error: String(e.message) }, { status: 500 }); }
}
