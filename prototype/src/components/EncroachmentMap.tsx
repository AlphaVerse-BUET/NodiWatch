"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Polygon, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import encroachmentData from "@/data/encroachment.json";

interface EncroachmentMapProps {
  year: 2016 | 2024;
  showComparison: boolean;
}

function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 14);
  }, [map, center]);
  return null;
}

export default function EncroachmentMap({
  year,
  showComparison,
}: EncroachmentMapProps) {
  const boundary2016 = encroachmentData.boundary_2016.coordinates as [
    number,
    number,
  ][];
  const boundary2024 = encroachmentData.boundary_2024.coordinates as [
    number,
    number,
  ][];

  const center: [number, number] = [
    (boundary2016[0][0] + boundary2016[boundary2016.length - 1][0]) / 2,
    (boundary2016[0][1] + boundary2016[boundary2016.length - 1][1]) / 2,
  ];

  return (
    <div className="glass-card overflow-hidden" style={{ height: "550px" }}>
      {/* Legend */}
      <div className="absolute top-4 left-4 z-[1000] glass-card p-3">
        <p className="font-bold text-sm mb-2">Legend</p>
        <div className="space-y-2 text-xs">
          {(showComparison || year === 2016) && (
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 bg-blue-500/50 border border-blue-400 rounded" />
              <span>2016 Boundary</span>
            </div>
          )}
          {(showComparison || year === 2024) && (
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 bg-red-500/50 border border-red-400 rounded" />
              <span>2024 Boundary</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 bg-yellow-500/50 border border-yellow-400 rounded" />
            <span>Encroachment Zone</span>
          </div>
        </div>
      </div>

      <MapContainer
        center={center}
        zoom={14}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        <MapUpdater center={center} />

        {/* 2016 Boundary */}
        {(showComparison || year === 2016) && (
          <Polygon
            positions={boundary2016 as [number, number][]}
            pathOptions={{
              color: "#3b82f6",
              weight: 3,
              fillColor: "#3b82f6",
              fillOpacity: 0.2,
            }}
          >
            <Popup>
              <div>
                <p className="font-bold text-blue-500">2016 River Boundary</p>
                <p className="text-sm">Turag River baseline extent</p>
                <p className="text-xs text-gray-400 mt-1">
                  Source: Sentinel-2, Dec 2016
                </p>
              </div>
            </Popup>
          </Polygon>
        )}

        {/* 2024 Boundary */}
        {(showComparison || year === 2024) && (
          <Polygon
            positions={boundary2024 as [number, number][]}
            pathOptions={{
              color: "#ef4444",
              weight: 3,
              fillColor: "#ef4444",
              fillOpacity: 0.25,
              dashArray: showComparison ? "10, 5" : undefined,
            }}
          >
            <Popup>
              <div>
                <p className="font-bold text-red-500">2024 River Boundary</p>
                <p className="text-sm">Current extent (reduced)</p>
                <p className="text-xs text-gray-400 mt-1">
                  Source: Sentinel-2, Mar 2024
                </p>
              </div>
            </Popup>
          </Polygon>
        )}
      </MapContainer>
    </div>
  );
}
