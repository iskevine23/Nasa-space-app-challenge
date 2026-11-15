// NASA EONET — Earth Observatory Natural Event Tracker
// https://eonet.gsfc.nasa.gov/api/v3/events  — free, no key, global
// Categories: wildfires, floods, storms, volcanoes, etc.  Used as curated disaster feed.

export async function fetchEonet(params: { category?: string; status?: string; limit?: number; days?: number } = {}) {
  const q = new URLSearchParams();
  if (params.category) q.set("category", params.category);
  if (params.status) q.set("status", params.status);
  if (params.limit) q.set("limit", String(params.limit));
  if (params.days) q.set("days", String(params.days));
  const url = `https://eonet.gsfc.nasa.gov/api/v3/events?${q.toString()}`;
  const r = await fetch(url, { next: { revalidate: 600 } });
  if (!r.ok) throw new Error(`EONET ${r.status}`);
  return r.json();
}

export const mockEonet = { events: [
  { id:"rw-flood-2024", title:"Flood — Nyabarongo River, Rwanda", categories:[{title:"Floods"}], geometry:[{date:"2024-04-15T00:00:00Z"}], sources:[{url:"https://eonet.gsfc.nasa.gov"}] },
  { id:"rw-fire-2024", title:"Wildfire — Akagera region", categories:[{title:"Wildfires"}], geometry:[{date:"2024-07-20T00:00:00Z"}], sources:[{url:"https://eonet.gsfc.nasa.gov"}] },
]};
