"use client";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, LayersControl, Polygon, Marker, Popup, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// fix icons
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const gibs = (layer: string, date: string) =>
  `https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/${layer}/default/${date}/GoogleMapsCompatible_Level9/{z}/{y}/{x}.jpg`;

function ClickCapture({ onClick, drawing }: { onClick: (lat: number, lon: number) => void; drawing: boolean }) {
  useMapEvents({
    click(e) {
      if (drawing) onClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export default function DrawFieldMap({
  date,
  fields,
  onSave,
}: {
  date: string;
  fields: any[];
  onSave: (poly: [number, number][]) => void;
}) {
  const [drawing, setDrawing] = useState(false);
  const [points, setPoints] = useState<[number, number][]>([]);
  const center: [number, number] = [-1.94, 30.06];

  const addPt = (lat: number, lon: number) => setPoints((p) => [...p, [lat, lon]]);
  const undo = () => setPoints((p) => p.slice(0, -1));
  const clear = () => setPoints([]);
  const finish = () => {
    if (points.length >= 3) {
      onSave(points);
      setDrawing(false);
      setPoints([]);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {!drawing ? (
          <button onClick={() => { setDrawing(true); setPoints([]); }} className="btn !py-2 text-xs">
            ✏️ Draw my field — tap map
          </button>
        ) : (
          <>
            <span className="pill bg-amber-400 text-stone-900 border-amber-500 font-black">✏️ Drawing — tap to add corners • {points.length} points</span>
            <button onClick={undo} className="btn-ghost !py-1 text-xs">↩️ Undo</button>
            <button onClick={clear} className="btn-ghost !py-1 text-xs">Clear</button>
            <button onClick={finish} disabled={points.length < 3} className="btn !py-1 text-xs disabled:opacity-40">✅ Save {points.length >= 3 ? `(${points.length} pts)` : "(need 3+)"}</button>
            <button onClick={() => { setDrawing(false); setPoints([]); }} className="btn-ghost !py-1 text-xs">Cancel</button>
          </>
        )}
        <span className="text-xs text-stone-500 self-center">Tip: zoom to your hill, tap corners clockwise, then Save.</span>
      </div>

      <MapContainer center={center} zoom={10} style={{ height: 520, width: "100%", borderRadius: 16 }}>
        <TileLayer attribution="&copy; OpenStreetMap" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <LayersControl position="topright">
          <LayersControl.Overlay name="NASA True Color (VIIRS)" checked>
            <TileLayer url={gibs("VIIRS_SNPP_CorrectedReflectance_TrueColor", date)} opacity={0.85} />
          </LayersControl.Overlay>
          <LayersControl.Overlay name="GPM Rain">
            <TileLayer url={gibs("GPM_IMERG_Precipitation_Rate", date)} opacity={0.6} />
          </LayersControl.Overlay>
          <LayersControl.Overlay name="MODIS NDVI">
            <TileLayer url={gibs("MODIS_Terra_NDVI_8Day", date)} opacity={0.6} />
          </LayersControl.Overlay>
        </LayersControl>

        <ClickCapture onClick={addPt} drawing={drawing} />

        {fields?.map((f) => (
          <Polygon key={f.id} positions={f.polygon} pathOptions={{ color: "#16a34a", weight: 2, fillOpacity: 0.18 }}>
            <Popup><b>{f.name}</b><br/>{f.crop} • {f.area_ha} ha</Popup>
          </Polygon>
        ))}

        {points.length > 0 && (
          <>
            <Polygon positions={points} pathOptions={{ color: "#f59e0b", weight: 3, dashArray: "6 6", fillOpacity: 0.25 }} />
            {points.map((p, i) => (
              <Marker key={i} position={p}><Popup>Point {i+1}<br/>{p[0].toFixed(4)}, {p[1].toFixed(4)}</Popup></Marker>
            ))}
          </>
        )}
      </MapContainer>
      {drawing && <div className="text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-xl p-2">🛰️ <b>Creative:</b> Your polygon + SmallSat 3 m = row-level water advice. Today we use NASA 55 km at center; with Icyerekezo we’ll average NDVI inside your exact shape.</div>}
    </div>
  );
}
