/**
 * HLS NDVI — production replacement for ndviMockFromPower
 * Requires Earthdata login token (EDL_TOKEN) and access to LPCLOUD STAC:
 *   https://cmr.earthdata.nasa.gov/stac/LPCLOUD
 *
 * Pseudocode (install @aws-sdk/client-s3, stac-geoparquet if needed):
 *
 *  1. Search STAC for HLSL30/S30 intersecting polygon & date range
 *     POST https://cmr.earthdata.nasa.gov/stac/LPCLOUD/search
 *     { collections:["HLSS30_2.0","HLSL30_2.0"], bbox:[lon_min,lat_min,lon_max,lat_max], datetime:"2024-01-01/2024-01-31", limit:20 }
 *
 *  2. For each item, read COG assets B04 (red) and B08 (nir) via /vsis3/ or HTTPS with EDL bearer
 *     GDAL calc: NDVI = (B08 - B04) / (B08 + B04)  (scale 0.0001)
 *     Mask with Fmask QA band: keep only QA=0 (clear)
 *
 *  3. Zonal median via rasterstats or @geomatico
 *     median_ndvi = zonalStats(ndviRaster, polygon, { percentile:50, maskCloud: true })
 *
 *  4. Store in sentinel_observations { source:"HLS NDVI", payload:{ ndvi, qa_pct, item_ids } }
 *
 *  5. Anomaly: z = (ndvi - baselineMean) / baselineStd  (baseline = same DOY ±15d across 5yr)
 *     if z < -1.5 → ndvi_drop warning
 *
 * See LP DAAC HLS guide: https://lpdaac.usgs.gov/products/hlss30v002/
 * Cost: S3 requester-pays egress ~$0.09/GB; keep in us-west-2 to avoid egress, or use on-demand via Vercel + GDAL WASM
 */

export async function fetchHLSNDVIStub() {
  throw new Error("Wire EDL_TOKEN and run this on a worker with GDAL — see comments above. MVP uses POWER proxy.");
}
