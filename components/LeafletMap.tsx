"use client";
import { useEffect } from "react";
import { MapContainer, TileLayer, LayersControl, Marker, Popup, Polygon, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix default icon
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const gibs = (layer: string, date: string) =>
  `https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/${layer}/default/${date}/GoogleMapsCompatible_Level9/{z}/{y}/{x}.jpg`;

export default function LeafletMap({ date, fires, fields }: {
  date: string;
  fires?: { lat: number; lon: number; date: string; frp?: number }[];
  fields?: { id: string; name: string; polygon: [number, number][] }[];
}) {
  const center: [number, number] = [-1.94, 30.06]; // Kigali
  return (
    <MapContainer center={center} zoom={8} style={{ height: 520, width: "100%", borderRadius: 16 }}>
      <TileLayer attribution="&copy; OpenStreetMap" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <LayersControl position="topright">
        <LayersControl.Overlay name="NASA GIBS True Color (VIIRS)" checked>
          <TileLayer url={gibs("VIIRS_SNPP_CorrectedReflectance_TrueColor", date)} opacity={0.85} />
        </LayersControl.Overlay>
        <LayersControl.Overlay name="GPM IMERG Rain Rate">
          <TileLayer url={gibs("GPM_IMERG_Precipitation_Rate", date)} opacity={0.6} />
        </LayersControl.Overlay>
        <LayersControl.Overlay name="MODIS NDVI 8-day">
          <TileLayer url={gibs("MODIS_Terra_NDVI_8Day", date)} opacity={0.6} />
        </LayersControl.Overlay>
      </LayersControl>
      {fields?.map(f => (
        <Polygon key={f.id} positions={f.polygon} pathOptions={{ color: "#16a34a", weight: 2, fillOpacity: 0.2 }}>
          <Popup><b>{f.name}</b><br />{f.id}</Popup>
        </Polygon>
      ))}
      {fires?.map((pt, i) => (
        <Marker key={i} position={[pt.lat, pt.lon]}>
          <Popup>🔥 FIRMS fire<br />{pt.date} FRP {pt.frp ?? "—"}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
