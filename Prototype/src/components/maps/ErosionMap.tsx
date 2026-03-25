"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import {
  Mountain,
  AlertTriangle,
  TrendingDown,
  Eye,
  EyeOff,
  Layers,
  Users,
  Home,
} from "lucide-react";

const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false },
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false },
);
const Polygon = dynamic(
  () => import("react-leaflet").then((mod) => mod.Polygon),
  { ssr: false },
);
const Polyline = dynamic(
  () => import("react-leaflet").then((mod) => mod.Polyline),
  { ssr: false },
);
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});
const CircleMarker = dynamic(
  () => import("react-leaflet").then((mod) => mod.CircleMarker),
  { ssr: false },
);

import erosionData from "@/data/erosion-corridors.json";
import riversData from "@/data/rivers.json";

interface ErosionMapProps {
  className?: string;
  onCorridorSelect?: (corridor: any) => void;
  selectedCorridor?: string | null;
}

const getRiskColor = (level: string) => {
  switch (level) {
    case "high":
      return "#ef476f";
    case "medium":
      return "#ffd166";
    case "low":
      return "#06d6a0";
    default:
      return "#118ab2";
  }
};

export default function ErosionMap({
  className = "",
  onCorridorSelect,
  selectedCorridor,
}: ErosionMapProps) {
  const [mounted, setMounted] = useState(false);
  const [showCorridors, setShowCorridors] = useState(true);
  const [showBufferZones, setShowBufferZones] = useState(true);
  const [showRivers, setShowRivers] = useState(true);
  const [selectedData, setSelectedData] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className={`bg-slate-900/50 rounded-xl flex items-center justify-center ${className}`}
      >
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-teal border-t-transparent rounded-full mx-auto mb-2"></div>
          <p className="text-gray-400">Loading map...</p>
        </div>
      </div>
    );
  }

  const center: [number, number] = [23.75, 90.42];

  return (
    <div className={`relative ${className}`}>
      {/* Layer Controls */}
      <div className="absolute top-4 right-4 z-[1000] glass-card p-3 space-y-2">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
          <Layers size={16} />
          <span>Layers</span>
        </div>

        <button
          onClick={() => setShowCorridors(!showCorridors)}
          className={`flex items-center gap-2 w-full px-2 py-1.5 rounded text-sm transition-colors ${
            showCorridors
              ? "bg-red-500/20 text-red-400"
              : "bg-slate-700/50 text-gray-400"
          }`}
        >
          {showCorridors ? <Eye size={14} /> : <EyeOff size={14} />}
          Erosion Corridors
        </button>

        <button
          onClick={() => setShowBufferZones(!showBufferZones)}
          className={`flex items-center gap-2 w-full px-2 py-1.5 rounded text-sm transition-colors ${
            showBufferZones
              ? "bg-yellow-500/20 text-yellow-400"
              : "bg-slate-700/50 text-gray-400"
          }`}
        >
          {showBufferZones ? <Eye size={14} /> : <EyeOff size={14} />}
          Buffer Zones
        </button>

        <button
          onClick={() => setShowRivers(!showRivers)}
          className={`flex items-center gap-2 w-full px-2 py-1.5 rounded text-sm transition-colors ${
            showRivers
              ? "bg-blue-500/20 text-blue-400"
              : "bg-slate-700/50 text-gray-400"
          }`}
        >
          {showRivers ? <Eye size={14} /> : <EyeOff size={14} />}
          Rivers
        </button>
      </div>

      {/* Selected Corridor Panel */}
      {selectedData && (
        <div className="absolute top-4 left-4 z-[1000] glass-card p-4 w-80">
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-2">
              <Mountain size={18} className="text-orange-400" />
              <h3 className="font-semibold text-white">{selectedData.name}</h3>
            </div>
            <button
              onClick={() => setSelectedData(null)}
              className="text-gray-400 hover:text-white"
            >
              ×
            </button>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">River:</span>
              <span className="text-white">{selectedData.river}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-400">Risk Level:</span>
              <span
                className={`badge-${selectedData.risk_level === "high" ? "red" : selectedData.risk_level === "medium" ? "yellow" : "green"}`}
              >
                {selectedData.risk_level}
              </span>
            </div>

            {/* Retreat Rate */}
            <div className="pt-2 border-t border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown size={14} className="text-red-400" />
                <span className="text-xs text-gray-400">Bank Retreat Rate</span>
              </div>
              <div className="text-2xl font-bold text-red-400">
                {selectedData.retreat_rate_m_year}{" "}
                <span className="text-sm font-normal">m/year</span>
              </div>
              <div className="text-xs text-gray-400 mt-1">
                Total retreat: {selectedData.total_retreat_m}m over 10 years
              </div>
            </div>

            {/* SAR Analysis */}
            <div className="pt-2 border-t border-white/10">
              <div className="text-xs text-gray-400 mb-2">
                SAR Coherence Analysis
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-700/50 rounded p-2">
                  <div className="text-gray-400">Coherence</div>
                  <div className="text-white font-semibold">
                    {selectedData.analysis.sar_coherence}
                  </div>
                </div>
                <div className="bg-slate-700/50 rounded p-2">
                  <div className="text-gray-400">NDVI Change</div>
                  <div className="text-red-400 font-semibold">
                    {selectedData.analysis.ndvi_change}
                  </div>
                </div>
                <div className="bg-slate-700/50 rounded p-2">
                  <div className="text-gray-400">Slope</div>
                  <div className="text-white font-semibold">
                    {selectedData.analysis.slope_degrees}°
                  </div>
                </div>
                <div className="bg-slate-700/50 rounded p-2">
                  <div className="text-gray-400">Soil Moisture</div>
                  <div className="text-blue-400 font-semibold">
                    {selectedData.analysis.soil_moisture}%
                  </div>
                </div>
              </div>
            </div>

            {/* Impact */}
            <div className="pt-2 border-t border-white/10 grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2">
                <Users size={14} className="text-yellow-400" />
                <div>
                  <div className="text-white font-semibold">
                    {selectedData.population_at_risk.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-400">At Risk</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Home size={14} className="text-orange-400" />
                <div>
                  <div className="text-white font-semibold">
                    {selectedData.structures_at_risk}
                  </div>
                  <div className="text-xs text-gray-400">Structures</div>
                </div>
              </div>
            </div>

            {/* Trend */}
            <div className="flex items-center justify-between pt-2 border-t border-white/10">
              <span className="text-gray-400">Trend:</span>
              <span
                className={`px-2 py-0.5 rounded text-xs ${
                  selectedData.trend === "accelerating"
                    ? "bg-red-500/20 text-red-400"
                    : "bg-green-500/20 text-green-400"
                }`}
              >
                {selectedData.trend}
              </span>
            </div>
          </div>
        </div>
      )}

      <MapContainer
        center={center}
        zoom={12}
        className="w-full h-full rounded-xl"
        style={{ background: "#0a0f1a" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {/* Rivers */}
        {showRivers &&
          riversData.features.map((river: any) => (
            <Polyline
              key={river.properties.id}
              positions={river.geometry.coordinates.map((c: number[]) => [
                c[1],
                c[0],
              ])}
              pathOptions={{
                color: "#118ab2",
                weight: 4,
                opacity: 0.7,
              }}
            >
              <Popup>
                <div className="text-center">
                  <strong>{river.properties.name}</strong>
                  <br />
                  <span className="text-xs">{river.properties.nameBn}</span>
                </div>
              </Popup>
            </Polyline>
          ))}

        {/* Erosion Corridors */}
        {showCorridors &&
          erosionData.corridors.map((corridor: any) => (
            <div key={corridor.id}>
              {/* Corridor Polyline */}
              <Polyline
                positions={corridor.coordinates.map((c: number[]) => [
                  c[1],
                  c[0],
                ])}
                pathOptions={{
                  color: getRiskColor(corridor.risk_level),
                  weight: 5,
                  opacity: selectedCorridor === corridor.id ? 1 : 0.7,
                }}
                eventHandlers={{
                  click: () => {
                    setSelectedData(corridor);
                    onCorridorSelect?.(corridor);
                  },
                }}
              >
                <Popup>
                  <div className="text-center min-w-[150px]">
                    <strong>{corridor.name}</strong>
                    <br />
                    <span className="text-xs">River: {corridor.river}</span>
                    <br />
                    <span
                      className={`text-xs ${
                        corridor.risk_level === "high"
                          ? "text-red-600"
                          : corridor.risk_level === "medium"
                            ? "text-yellow-600"
                            : "text-green-600"
                      }`}
                    >
                      Retreat: {corridor.retreat_rate_m_year}m/year
                    </span>
                  </div>
                </Popup>
              </Polyline>

              {/* Warning Buffer Zone */}
              {showBufferZones && (
                <>
                  {/* Critical zone - inner */}
                  <Polyline
                    positions={corridor.coordinates.map((c: number[]) => [
                      c[1] + 0.0003,
                      c[0] + 0.0003,
                    ])}
                    pathOptions={{
                      color: "#ef476f",
                      weight: 8,
                      opacity: 0.2,
                      dashArray: "10, 5",
                    }}
                  />
                  {/* Warning zone - outer */}
                  <Polyline
                    positions={corridor.coordinates.map((c: number[]) => [
                      c[1] + 0.0006,
                      c[0] + 0.0006,
                    ])}
                    pathOptions={{
                      color: "#ffd166",
                      weight: 12,
                      opacity: 0.15,
                      dashArray: "15, 10",
                    }}
                  />
                </>
              )}

              {/* Point marker */}
              <CircleMarker
                center={[
                  corridor.coordinates[0][1],
                  corridor.coordinates[0][0],
                ]}
                radius={8}
                pathOptions={{
                  color: getRiskColor(corridor.risk_level),
                  fillColor: getRiskColor(corridor.risk_level),
                  fillOpacity: 0.8,
                  weight: 2,
                  className:
                    corridor.trend === "accelerating" ? "pulse-marker" : "",
                }}
              />
            </div>
          ))}
      </MapContainer>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-[1000] glass-card p-3">
        <div className="text-xs font-medium text-gray-300 mb-2">
          Risk Levels
        </div>
        <div className="space-y-1.5 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-8 h-1 bg-red-500 rounded"></div>
            <span>High Risk (&gt;10m/year)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-1 bg-yellow-500 rounded"></div>
            <span>Medium Risk (5-10m/year)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-1 bg-green-500 rounded"></div>
            <span>Low Risk (&lt;5m/year)</span>
          </div>
        </div>
        {showBufferZones && (
          <div className="mt-2 pt-2 border-t border-white/10">
            <div className="text-xs text-gray-400 mb-1">Buffer Zones</div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 border-2 border-red-500/50 rounded"></div>
              <span>
                Critical ({erosionData.corridors[0]?.buffer_zone?.critical_m}m)
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs mt-1">
              <div className="w-3 h-3 border-2 border-yellow-500/50 rounded"></div>
              <span>
                Warning ({erosionData.corridors[0]?.buffer_zone?.warning_m}m)
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Stats Summary */}
      <div className="absolute bottom-4 right-4 z-[1000] glass-card p-3">
        <div className="text-xs font-medium text-gray-300 mb-2">
          Monitoring Summary
        </div>
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <div className="text-red-400 font-bold text-lg">
              {erosionData.statistics.high_risk}
            </div>
            <div className="text-gray-400">High Risk</div>
          </div>
          <div>
            <div className="text-yellow-400 font-bold text-lg">
              {erosionData.statistics.total_population_at_risk.toLocaleString()}
            </div>
            <div className="text-gray-400">People at Risk</div>
          </div>
          <div>
            <div className="text-orange-400 font-bold text-lg">
              {erosionData.statistics.max_retreat_rate}
            </div>
            <div className="text-gray-400">Max m/year</div>
          </div>
          <div>
            <div className="text-purple-400 font-bold text-lg">
              {erosionData.statistics.total_structures_at_risk}
            </div>
            <div className="text-gray-400">Structures</div>
          </div>
        </div>
      </div>
    </div>
  );
}
