"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Eye, Layers, Droplets, Factory } from "lucide-react";

const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false },
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false },
);
const Polyline = dynamic(
  () => import("react-leaflet").then((mod) => mod.Polyline),
  { ssr: false },
);
const CircleMarker = dynamic(
  () => import("react-leaflet").then((mod) => mod.CircleMarker),
  { ssr: false },
);
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});

import riversData from "@/data/rivers.json";
import pollutionData from "@/data/pollution-hotspots.json";
import encroachmentData from "@/data/encroachment.json";
import erosionData from "@/data/erosion-corridors.json";

interface DashboardMapProps {
  className?: string;
}

export default function DashboardMap({ className = "" }: DashboardMapProps) {
  const [mounted, setMounted] = useState(false);
  const [activeLayer, setActiveLayer] = useState<
    "all" | "pollution" | "encroachment" | "erosion"
  >("all");

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

  const getSeverityColor = (severity: number | string) => {
    if (typeof severity === "string") {
      return severity === "critical" ? "#ef476f" : "#ffd166";
    }
    if (severity >= 85) return "#ef476f";
    if (severity >= 70) return "#ff8c00";
    return "#ffd166";
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "high":
        return "#ef476f";
      case "medium":
        return "#ffd166";
      default:
        return "#06d6a0";
    }
  };

  return (
    <div className={`relative rounded-xl overflow-hidden ${className}`}>
      {/* Layer Toggle */}
      <div className="absolute top-4 left-4 z-[1000] glass-card p-2 flex gap-1">
        {(["all", "pollution", "encroachment", "erosion"] as const).map(
          (layer) => (
            <button
              key={layer}
              onClick={() => setActiveLayer(layer)}
              className={`px-3 py-1.5 rounded text-xs font-medium capitalize transition-colors ${
                activeLayer === layer
                  ? "bg-teal text-slate-900"
                  : "bg-slate-700/50 text-gray-300 hover:text-white"
              }`}
            >
              {layer}
            </button>
          ),
        )}
      </div>

      <MapContainer
        center={center}
        zoom={11}
        className="w-full h-full"
        style={{ background: "#0a0f1a" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {/* Rivers */}
        {riversData.features.map((river: any) => (
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
              weight: 3,
              opacity: 0.7,
            }}
          >
            <Popup>
              <strong>{river.properties.name}</strong>
              <br />
              <span className="text-xs">Status: {river.properties.status}</span>
            </Popup>
          </Polyline>
        ))}

        {/* Pollution Hotspots */}
        {(activeLayer === "all" || activeLayer === "pollution") &&
          pollutionData.hotspots.slice(0, 6).map((spot: any) => (
            <CircleMarker
              key={spot.id}
              center={[spot.lat, spot.lng]}
              radius={spot.severity / 8}
              pathOptions={{
                color: getSeverityColor(spot.severity),
                fillColor: getSeverityColor(spot.severity),
                fillOpacity: 0.6,
                weight: 2,
              }}
            >
              <Popup>
                <div className="text-center">
                  <strong>{spot.label}</strong>
                  <br />
                  <span className="text-xs">Severity: {spot.severity}/100</span>
                </div>
              </Popup>
            </CircleMarker>
          ))}

        {/* Encroachment Sites */}
        {(activeLayer === "all" || activeLayer === "encroachment") &&
          encroachmentData.segments.slice(0, 3).map((seg: any) => (
            <CircleMarker
              key={seg.id}
              center={[seg.lat, seg.lng]}
              radius={10}
              pathOptions={{
                color: getSeverityColor(seg.severity),
                fillColor: getSeverityColor(seg.severity),
                fillOpacity: 0.6,
                weight: 2,
              }}
            >
              <Popup>
                <div className="text-center">
                  <strong>{seg.location}</strong>
                  <br />
                  <span className="text-xs">
                    Shrinkage: {seg.shrinkage_pct}%
                  </span>
                </div>
              </Popup>
            </CircleMarker>
          ))}

        {/* Erosion Corridors */}
        {(activeLayer === "all" || activeLayer === "erosion") &&
          erosionData.corridors.slice(0, 3).map((corridor: any) => (
            <Polyline
              key={corridor.id}
              positions={corridor.coordinates.map((c: number[]) => [
                c[1],
                c[0],
              ])}
              pathOptions={{
                color: getRiskColor(corridor.risk_level),
                weight: 4,
                opacity: 0.8,
              }}
            >
              <Popup>
                <div className="text-center">
                  <strong>{corridor.name}</strong>
                  <br />
                  <span className="text-xs">Risk: {corridor.risk_level}</span>
                </div>
              </Popup>
            </Polyline>
          ))}
      </MapContainer>

      {/* Legend */}
      <div className="absolute bottom-4 right-4 z-[1000] glass-card p-3">
        <div className="text-xs space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span>Critical</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
            <span>High</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span>Moderate</span>
          </div>
        </div>
      </div>
    </div>
  );
}
