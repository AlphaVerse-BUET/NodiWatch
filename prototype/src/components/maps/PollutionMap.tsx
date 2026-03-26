"use client";

import { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";
import {
  AlertCircle,
  Factory,
  Droplets,
  ThermometerSun,
  Eye,
  EyeOff,
  Layers,
  Satellite,
} from "lucide-react";

// Dynamic imports to prevent SSR issues with Leaflet
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false },
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false },
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false },
);
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});
const CircleMarker = dynamic(
  () => import("react-leaflet").then((mod) => mod.CircleMarker),
  { ssr: false },
);
const Polyline = dynamic(
  () => import("react-leaflet").then((mod) => mod.Polyline),
  { ssr: false },
);

import factoriesData from "@/data/factories.json";
import pollutionData from "@/data/pollution-hotspots.json";
import riversData from "@/data/rivers.json";

interface PollutionMapProps {
  className?: string;
  onHotspotSelect?: (hotspot: any) => void;
  selectedHotspot?: string | null;
}

// Factory marker icons based on type
const getFactoryIcon = (type: string) => {
  const colors: Record<string, string> = {
    textile: "#7b2ff7",
    tannery: "#ef476f",
    industrial: "#ffd166",
    garment: "#06d6a0",
    chemical: "#ff6b6b",
    food: "#4ecdc4",
  };
  return colors[type] || "#118ab2";
};

const getSeverityColor = (severity: number) => {
  if (severity >= 85) return "#ef476f";
  if (severity >= 70) return "#ff8c00";
  if (severity >= 50) return "#ffd166";
  return "#06d6a0";
};

export default function PollutionMap({
  className = "",
  onHotspotSelect,
  selectedHotspot,
}: PollutionMapProps) {
  const [mounted, setMounted] = useState(false);
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [showFactories, setShowFactories] = useState(true);
  const [showHotspots, setShowHotspots] = useState(true);
  const [showRivers, setShowRivers] = useState(true);
  const [selectedFactory, setSelectedFactory] = useState<any>(null);
  const [basemap, setBasemap] = useState<"dark" | "satellite">("satellite");

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

  const center: [number, number] = [23.75, 90.4];

  return (
    <div className={`relative ${className}`}>
      {/* Layer Controls */}
      <div className="absolute top-4 right-4 z-[1000] glass-card p-3 space-y-2">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
          <Layers size={16} />
          <span>Layers</span>
        </div>

        <button
          onClick={() => setShowHeatmap(!showHeatmap)}
          className={`flex items-center gap-2 w-full px-2 py-1.5 rounded text-sm transition-colors ${
            showHeatmap
              ? "bg-red-500/20 text-red-400"
              : "bg-slate-700/50 text-gray-400"
          }`}
        >
          {showHeatmap ? <Eye size={14} /> : <EyeOff size={14} />}
          Pollution Heatmap
        </button>

        <button
          onClick={() => setShowHotspots(!showHotspots)}
          className={`flex items-center gap-2 w-full px-2 py-1.5 rounded text-sm transition-colors ${
            showHotspots
              ? "bg-orange-500/20 text-orange-400"
              : "bg-slate-700/50 text-gray-400"
          }`}
        >
          {showHotspots ? <Eye size={14} /> : <EyeOff size={14} />}
          Hotspots
        </button>

        <button
          onClick={() => setShowFactories(!showFactories)}
          className={`flex items-center gap-2 w-full px-2 py-1.5 rounded text-sm transition-colors ${
            showFactories
              ? "bg-purple-500/20 text-purple-400"
              : "bg-slate-700/50 text-gray-400"
          }`}
        >
          {showFactories ? <Eye size={14} /> : <EyeOff size={14} />}
          Factories
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

        <div className="border-t border-white/10 pt-2 mt-1">
          <button
            onClick={() => setBasemap(basemap === "dark" ? "satellite" : "dark")}
            className={`flex items-center gap-2 w-full px-2 py-1.5 rounded text-sm transition-colors ${
              basemap === "satellite"
                ? "bg-blue-500/20 text-blue-400"
                : "bg-slate-700/50 text-gray-400"
            }`}
          >
            <Satellite size={14} />
            {basemap === "satellite" ? "Satellite" : "Dark Map"}
          </button>
        </div>
      </div>

      {/* Selected Factory Panel */}
      {selectedFactory && (
        <div className="absolute top-4 left-4 z-[1000] glass-card p-4 w-72">
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-2">
              <Factory size={18} className="text-purple-400" />
              <h3 className="font-semibold text-white">
                {selectedFactory.name}
              </h3>
            </div>
            <button
              onClick={() => setSelectedFactory(null)}
              className="text-gray-400 hover:text-white"
            >
              ×
            </button>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Type:</span>
              <span
                className={`badge-${selectedFactory.type === "textile" ? "purple" : selectedFactory.type === "tannery" ? "red" : "yellow"}`}
              >
                {selectedFactory.type}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Distance to river:</span>
              <span className="text-white">{selectedFactory.distance_m}m</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Attribution:</span>
              <span className="text-white font-semibold">
                {selectedFactory.attribution}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Violations:</span>
              <span
                className={
                  selectedFactory.violations > 3 ? "text-red-400" : "text-white"
                }
              >
                {selectedFactory.violations}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Status:</span>
              <span
                className={
                  selectedFactory.status === "flagged"
                    ? "text-red-400"
                    : "text-green-400"
                }
              >
                {selectedFactory.status}
              </span>
            </div>
          </div>

          {/* Attribution Bar */}
          <div className="mt-3 pt-3 border-t border-white/10">
            <div className="text-xs text-gray-400 mb-1">
              Pollution Attribution
            </div>
            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-yellow-500 to-red-500 transition-all duration-500"
                style={{ width: `${selectedFactory.attribution}%` }}
              />
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
        {basemap === "satellite" ? (
          <TileLayer
            attribution='&copy; Esri, Maxar, Earthstar Geographics'
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          />
        ) : (
          <TileLayer
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />
        )}

        {/* Heatmap Layer rendered as circle markers for simplicity */}
        {showHeatmap &&
          pollutionData.heatmapData.map((point: any, idx: number) => (
            <CircleMarker
              key={`heat-${idx}`}
              center={[point.lat, point.lng]}
              radius={point.intensity * 15}
              pathOptions={{
                fillColor: getSeverityColor(point.intensity * 100),
                fillOpacity: 0.4,
                stroke: false,
              }}
            />
          ))}

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
                color:
                  river.properties.status === "critical"
                    ? "#ef476f"
                    : river.properties.status === "severe"
                      ? "#ff8c00"
                      : "#118ab2",
                weight: 4,
                opacity: 0.7,
              }}
            >
              <Popup>
                <div className="text-center">
                  <strong>{river.properties.name}</strong>
                  <br />
                  <span className="text-xs">{river.properties.nameBn}</span>
                  <br />
                  <span
                    className={`text-xs ${
                      river.properties.status === "critical"
                        ? "text-red-600"
                        : river.properties.status === "severe"
                          ? "text-orange-600"
                          : "text-blue-600"
                    }`}
                  >
                    Status: {river.properties.status}
                  </span>
                </div>
              </Popup>
            </Polyline>
          ))}

        {/* Pollution Hotspots */}
        {showHotspots &&
          pollutionData.hotspots.map((hotspot: any) => (
            <CircleMarker
              key={hotspot.id}
              center={[hotspot.lat, hotspot.lng]}
              radius={hotspot.severity / 5}
              pathOptions={{
                color: getSeverityColor(hotspot.severity),
                fillColor: getSeverityColor(hotspot.severity),
                fillOpacity: 0.6,
                weight: 2,
                className: selectedHotspot === hotspot.id ? "pulse-marker" : "",
              }}
              eventHandlers={{
                click: () => onHotspotSelect?.(hotspot),
              }}
            >
              <Popup>
                <div className="text-center min-w-[180px]">
                  <div className="flex items-center gap-1 justify-center mb-1">
                    <AlertCircle size={14} className="text-red-500" />
                    <strong>{hotspot.label}</strong>
                  </div>
                  <div className="text-xs text-gray-600">
                    <p>River: {hotspot.river}</p>
                    <p>Type: {hotspot.type}</p>
                    <p>
                      Severity:{" "}
                      <span className="font-bold">{hotspot.severity}/100</span>
                    </p>
                  </div>
                  <div className="mt-2 text-xs bg-gray-100 p-2 rounded">
                    <p>
                      <strong>Spectral Signatures:</strong>
                    </p>
                    <p>NDTI: {hotspot.spectral.ndti}</p>
                    <p>Red/Blue: {hotspot.spectral.redBlueRatio}</p>
                    <p>CDOM: {hotspot.spectral.cdom || "—"}</p>
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          ))}

        {/* Factories */}
        {showFactories &&
          factoriesData.factories.map((factory: any) => (
            <CircleMarker
              key={factory.id}
              center={[factory.lat, factory.lng]}
              radius={8}
              pathOptions={{
                color: getFactoryIcon(factory.type),
                fillColor: getFactoryIcon(factory.type),
                fillOpacity: 0.8,
                weight: 2,
              }}
              eventHandlers={{
                click: () => setSelectedFactory(factory),
              }}
            >
              <Popup>
                <div className="text-center">
                  <strong>{factory.name}</strong>
                  <br />
                  <span className="text-xs">
                    Type: {factory.type} | Attribution: {factory.attribution}%
                  </span>
                </div>
              </Popup>
            </CircleMarker>
          ))}
      </MapContainer>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-[1000] glass-card p-3">
        <div className="text-xs font-medium text-gray-300 mb-2">
          Pollution Severity
        </div>
        <div className="flex gap-3 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span>Critical (85+)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
            <span>High (70-84)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span>Medium (50-69)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-teal-500"></div>
            <span>Low (&lt;50)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
