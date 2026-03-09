"use client";

import { useEffect, useState, useCallback } from "react";
import {
  MapContainer,
  TileLayer,
  Polygon,
  CircleMarker,
  Popup,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Import data
import pollutionData from "@/data/pollution-points.json";
import factoriesData from "@/data/factories.json";

// Fix for default marker icons - use CDN URLs for compatibility
const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

// Heatmap layer component
function HeatmapLayer() {
  const map = useMap();

  useEffect(() => {
    // Dynamically import leaflet.heat
    import("leaflet.heat").then(() => {
      const points = pollutionData.points.map((p) => [
        p.lat,
        p.lng,
        p.intensity,
      ]);

      // @ts-expect-error - leaflet.heat adds this to L
      const heat = L.heatLayer(points, {
        radius: 28,
        blur: 20,
        maxZoom: 15,
        max: 1.0,
        minOpacity: 0.4,
        gradient: {
          0.1: "#2196f3",
          0.3: "#06d6a0",
          0.5: "#ffd166",
          0.7: "#ff8c00",
          0.9: "#ef476f",
          1.0: "#d90429",
        },
      });

      heat.addTo(map);

      return () => {
        map.removeLayer(heat);
      };
    });
  }, [map]);

  return null;
}

interface Factory {
  id: string;
  name: string;
  lat: number;
  lng: number;
  type: string;
  probability: number;
  distance: number;
  ndti_outfall: number;
  effluent: string;
}

interface Zone {
  id: string;
  name: string;
  coords: [number, number][];
  ndti: number;
  cdom: number;
  type: string;
  factories: string[];
}

interface PollutionMapProps {
  showAlert: boolean;
  onCloseAlert: () => void;
}

export default function PollutionMap({
  showAlert,
  onCloseAlert,
}: PollutionMapProps) {
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);
  const [showFactories, setShowFactories] = useState(false);

  const getZoneFactories = useCallback((zoneId: string): Factory[] => {
    const zone = factoriesData.zones.find((z) => z.id === zoneId);
    if (!zone) return [];
    return factoriesData.factories.filter((f) =>
      zone.factories.includes(f.id),
    ) as Factory[];
  }, []);

  const typeColors: Record<string, string> = {
    tannery: "#ef476f",
    textile: "#118ab2",
    chemical: "#7b2ff7",
  };

  return (
    <div className="relative">
      {/* Alert Toast */}
      <div
        className={`absolute top-4 right-4 z-[1000] w-96 glass-card p-4 border-red-500/50 transition-all duration-500 ${
          showAlert
            ? "translate-y-0 opacity-100"
            : "-translate-y-24 opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex items-start gap-3">
          <span className="text-xl animate-pulse">🚨</span>
          <div className="flex-1">
            <p className="font-bold text-red-500">CRITICAL POLLUTION SPIKE</p>
            <p className="text-sm text-[var(--muted)] mt-1">
              <strong className="text-[var(--foreground)]">
                Hazaribagh Zone A
              </strong>{" "}
              — Buriganga River
            </p>
            <p className="text-sm text-[var(--muted)]">
              NDTI: <strong className="text-red-500">0.82</strong> (threshold:
              0.45)
            </p>
            <div className="flex gap-2 mt-2">
              <span className="badge badge-red">Tannery: 81%</span>
              <span className="badge badge-blue">Textile: 19%</span>
            </div>
          </div>
          <button
            onClick={onCloseAlert}
            className="text-[var(--muted)] hover:text-[var(--foreground)]"
          >
            ✕
          </button>
        </div>
      </div>

      <div className="flex gap-4">
        {/* Map */}
        <div
          className="flex-1 glass-card overflow-hidden"
          style={{ height: "600px" }}
        >
          <MapContainer
            center={[23.75, 90.38]}
            zoom={12}
            style={{ height: "100%", width: "100%" }}
            scrollWheelZoom={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://carto.com/">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />

            <HeatmapLayer />

            {/* Zone polygons */}
            {factoriesData.zones.map((zone) => (
              <Polygon
                key={zone.id}
                positions={zone.coords as [number, number][]}
                pathOptions={{
                  color: "#ef476f",
                  weight: 2,
                  fillColor: "#ef476f",
                  fillOpacity: 0.15,
                  dashArray: "5,5",
                }}
                eventHandlers={{
                  click: () => setSelectedZone(zone as Zone),
                }}
              >
                <Popup>
                  <div className="min-w-[200px]">
                    <p className="font-bold text-red-500">{zone.name}</p>
                    <p className="text-sm mt-1">
                      NDTI: <strong>{zone.ndti}</strong> | CDOM: {zone.cdom}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">{zone.type}</p>
                  </div>
                </Popup>
              </Polygon>
            ))}

            {/* Factory markers */}
            {showFactories &&
              factoriesData.factories.map((factory) => (
                <CircleMarker
                  key={factory.id}
                  center={[factory.lat, factory.lng]}
                  radius={7}
                  pathOptions={{
                    color: typeColors[factory.type] || "#7b2ff7",
                    fillColor: typeColors[factory.type] || "#7b2ff7",
                    fillOpacity: 0.8,
                    weight: 2,
                  }}
                >
                  <Popup>
                    <div className="min-w-[160px]">
                      <p
                        className="font-bold"
                        style={{ color: typeColors[factory.type] }}
                      >
                        {factory.name}
                      </p>
                      <p className="text-sm mt-1">Type: {factory.type}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {factory.lat.toFixed(4)}°N, {factory.lng.toFixed(4)}°E
                      </p>
                    </div>
                  </Popup>
                </CircleMarker>
              ))}
          </MapContainer>
        </div>

        {/* Attribution Panel */}
        <div
          className="w-80 glass-card p-4 overflow-y-auto"
          style={{ height: "600px" }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold">Factory Attribution</h3>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={showFactories}
                onChange={(e) => setShowFactories(e.target.checked)}
                className="rounded border-gray-600 bg-gray-800"
              />
              Show markers
            </label>
          </div>

          {selectedZone ? (
            <div>
              <p className="text-red-500 font-bold">{selectedZone.name}</p>
              <p className="text-sm text-[var(--muted)] mb-4">
                NDTI:{" "}
                <strong className="text-[var(--foreground)]">
                  {selectedZone.ndti}
                </strong>{" "}
                | CDOM:{" "}
                <strong className="text-[var(--foreground)]">
                  {selectedZone.cdom}
                </strong>{" "}
                | {selectedZone.type}
              </p>

              <div className="space-y-3">
                {getZoneFactories(selectedZone.id).map((factory) => (
                  <div
                    key={factory.id}
                    className="p-3 bg-white/5 border border-[var(--border)] rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-sm">{factory.name}</p>
                      <span
                        className="badge text-xs"
                        style={{
                          backgroundColor: `${typeColors[factory.type]}20`,
                          borderColor: `${typeColors[factory.type]}40`,
                          color: typeColors[factory.type],
                        }}
                      >
                        {factory.type}
                      </span>
                    </div>
                    <p className="text-sm font-bold text-[var(--foreground)]">
                      {factory.probability}% probability
                    </p>
                    <div className="h-1.5 bg-white/10 rounded-full mt-2 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${factory.probability}%`,
                          backgroundColor: typeColors[factory.type],
                        }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-[var(--muted)] mt-2">
                      <span>Distance: {factory.distance}m</span>
                      <span>NDTI: {factory.ndti_outfall}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center text-[var(--muted)] py-8">
              <p className="text-4xl mb-4">🏭</p>
              <p>
                Click a pollution zone on the map to see factory attribution
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
