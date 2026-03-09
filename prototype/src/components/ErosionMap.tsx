"use client";

import {
  MapContainer,
  TileLayer,
  Polyline,
  Polygon,
  CircleMarker,
  Popup,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

import erosionData from "@/data/erosion-corridors.json";

const riskColors: Record<string, string> = {
  critical: "#ef4444",
  high: "#f97316",
  moderate: "#eab308",
  low: "#22c55e",
};

export default function ErosionMap() {
  return (
    <div className="glass-card overflow-hidden" style={{ height: "550px" }}>
      {/* Legend */}
      <div className="absolute top-4 left-4 z-[1000] glass-card p-3">
        <p className="font-bold text-sm mb-2">Risk Level</p>
        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-4 h-1 bg-red-500 rounded" />
            <span>Critical (&gt;30m/year)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-1 bg-orange-500 rounded" />
            <span>High (20-30m/year)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-1 bg-yellow-500 rounded" />
            <span>Moderate (10-20m/year)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-1 bg-green-500 rounded" />
            <span>Low (&lt;10m/year)</span>
          </div>
        </div>
      </div>

      {/* Stats overlay */}
      <div className="absolute top-4 right-4 z-[1000] glass-card p-3 w-48">
        <p className="font-bold text-sm mb-2">Jamuna River Basin</p>
        <div className="space-y-1 text-xs">
          <div className="flex justify-between">
            <span className="text-[var(--muted)]">Monitored</span>
            <span>187 km</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--muted)]">Critical</span>
            <span className="text-red-500">23 km</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--muted)]">Historical</span>
            <span>1984–2024</span>
          </div>
        </div>
      </div>

      <MapContainer
        center={[24.45, 89.75]}
        zoom={10}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {/* Erosion corridors */}
        {erosionData.corridors.map((corridor) => (
          <Polyline
            key={corridor.id}
            positions={corridor.coordinates as [number, number][]}
            pathOptions={{
              color: riskColors[corridor.risk_level] || "#ef4444",
              weight: 6,
              opacity: 0.9,
            }}
          >
            <Popup>
              <div className="min-w-[200px]">
                <p
                  className="font-bold"
                  style={{ color: riskColors[corridor.risk_level] }}
                >
                  {corridor.name}
                </p>
                <div className="mt-2 space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Erosion Rate</span>
                    <span className="font-bold">
                      {corridor.retreat_rate_m_year} m/yr
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Population at Risk</span>
                    <span>{corridor.population_at_risk.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Area at Risk</span>
                    <span>{corridor.affected_area_ha} ha</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">SAR Coherence</span>
                    <span>{corridor.analysis.sar_coherence}</span>
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  Risk Level: {corridor.risk_level.toUpperCase()}
                </p>
              </div>
            </Popup>
          </Polyline>
        ))}

        {/* Buffer zones around critical corridors */}
        {erosionData.corridors
          .filter((c) => c.risk_level === "critical")
          .map((corridor) => {
            // Create a simplified buffer polygon
            const bufferCoords = corridor.coordinates.flatMap((coord) => [
              [coord[0] + 0.008, coord[1] - 0.005],
              [coord[0] + 0.008, coord[1] + 0.005],
            ]);
            const reverseCoords = [...corridor.coordinates]
              .reverse()
              .flatMap((coord) => [
                [coord[0] - 0.003, coord[1] + 0.005],
                [coord[0] - 0.003, coord[1] - 0.005],
              ]);
            const fullBuffer = [...bufferCoords, ...reverseCoords];

            return (
              <Polygon
                key={`buffer-${corridor.id}`}
                positions={fullBuffer as [number, number][]}
                pathOptions={{
                  color: "#ef4444",
                  weight: 1,
                  fillColor: "#ef4444",
                  fillOpacity: 0.1,
                  dashArray: "5, 5",
                }}
              />
            );
          })}

        {/* Village markers */}
        {erosionData.corridors.map((corridor) =>
          corridor.coordinates.slice(0, 2).map((coord, i) => (
            <CircleMarker
              key={`village-${corridor.id}-${i}`}
              center={[coord[0] + 0.01, coord[1]]}
              radius={5}
              pathOptions={{
                color: "#fff",
                weight: 1,
                fillColor: riskColors[corridor.risk_level],
                fillOpacity: 0.8,
              }}
            >
              <Popup>
                <div>
                  <p className="font-bold">Settlement Area</p>
                  <p className="text-sm text-gray-400">Near {corridor.name}</p>
                  <p className="text-xs mt-1">Distance to bank: ~200m</p>
                </div>
              </Popup>
            </CircleMarker>
          )),
        )}
      </MapContainer>
    </div>
  );
}
