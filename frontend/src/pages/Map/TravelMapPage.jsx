import { MapContainer, TileLayer, CircleMarker, Polyline, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { motion } from "framer-motion";

const pins = [
  { id: 1, lat: 27.9881, lng: 86.925, label: "Everest region trek" },
  { id: 2, lat: 64.1466, lng: -21.9426, label: "Reykjavik winter" },
  { id: 3, lat: -13.1631, lng: -72.545, label: "Sacred valley" },
];

const route = pins.map((p) => [p.lat, p.lng]);

export default function TravelMapPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold tracking-tight">Interactive travel map</h1>
        <p className="mt-2 max-w-2xl text-sm text-[var(--vv-muted)]">
          Leaflet + OpenStreetMap tiles (swap to Mapbox for 3D / custom styling). Pins, routes, and replay hooks are ready to wire to Firestore.
        </p>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel overflow-hidden rounded-3xl p-2"
      >
        <div className="h-[420px] w-full sm:h-[520px]">
          <MapContainer center={[20, 10]} zoom={2} className="h-full w-full" scrollWheelZoom>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap" />
            <Polyline positions={route} pathOptions={{ color: "#38bdf8", weight: 3, opacity: 0.9 }} />
            {pins.map((p) => (
              <CircleMarker key={p.id} center={[p.lat, p.lng]} radius={8} pathOptions={{ color: "#a78bfa", fillColor: "#38bdf8", fillOpacity: 0.9 }}>
                <Popup>{p.label}</Popup>
              </CircleMarker>
            ))}
          </MapContainer>
        </div>
      </motion.div>
      <div className="grid gap-4 md:grid-cols-3">
        {[
          { label: "Countries", value: "28" },
          { label: "Routes saved", value: "14" },
          { label: "Replay minutes", value: "126" },
        ].map((s) => (
          <div key={s.label} className="glass-panel rounded-2xl p-4">
            <div className="text-xs text-[var(--vv-muted)]">{s.label}</div>
            <div className="mt-2 font-display text-2xl font-semibold">{s.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
