// NASA GIBS — Global Imagery Browse Services (WMTS/WMS)
// Free, no key. Used for base map overlays: MODIS true color, VIIRS, IMERG rain rate, NDVI.
// Tile URL templates for Leaflet.

export const GIBS_WMTS = "https://gibs.earthdata.nasa.gov/wmts/epsg3857/best";

// Common layers:
// - VIIRS_SNPP_CorrectedReflectance_TrueColor
// - MODIS_Terra_CorrectedReflectance_TrueColor
// - GPM_IMERG_Precipitation_Rate
// - MODIS_Terra_NDVI_8Day (when available)
// We expose tile URL builders that Leaflet can consume.

export function gibsTileUrl(layer: string, date: string) {
  // date = YYYY-MM-DD
  return `${GIBS_WMTS}/${layer}/default/${date}/GoogleMapsCompatible_Level9/{z}/{y}/{x}.jpg`;
}

export const LAYERS = {
  trueColorVIIRS: "VIIRS_SNPP_CorrectedReflectance_TrueColor",
  trueColorTerra: "MODIS_Terra_CorrectedReflectance_TrueColor",
  imerg: "GPM_IMERG_Precipitation_Rate",
  ndvi: "MODIS_Terra_NDVI_8Day",
  lstDay: "MODIS_Terra_Land_Surface_Temp_Day",
} as const;
