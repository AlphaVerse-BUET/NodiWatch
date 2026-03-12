'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

// Dynamically import Leaflet components to avoid SSR issues
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
)
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
)
const Circle = dynamic(
  () => import('react-leaflet').then((mod) => mod.Circle),
  { ssr: false }
)
const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
)
const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
)
const Polyline = dynamic(
  () => import('react-leaflet').then((mod) => mod.Polyline),
  { ssr: false }
)

interface RiverMapProps {
  activeLayer: 'pollution' | 'encroachment' | 'erosion' | 'all'
  selectedRiver: string
}

// Mock data for demonstration
const pollutionHotspots = [
  { id: 1, lat: 23.7104, lng: 90.4074, severity: 'high', type: 'Textile Dye', factories: 3 },
  { id: 2, lat: 23.7250, lng: 90.4000, severity: 'critical', type: 'Tannery Waste', factories: 5 },
  { id: 3, lat: 23.6950, lng: 90.4150, severity: 'medium', type: 'Industrial Mix', factories: 2 },
  { id: 4, lat: 23.7180, lng: 90.3920, severity: 'high', type: 'Thermal Discharge', factories: 1 },
]

const encroachmentZones = [
  { id: 1, lat: 23.7080, lng: 90.4100, area: '2.3 hectares', year: '2022-2026' },
  { id: 2, lat: 23.7200, lng: 90.3950, area: '1.8 hectares', year: '2020-2026' },
]

const erosionAreas = [
  { id: 1, lat: 23.7150, lng: 90.4050, risk: 'High', rate: '12m/year' },
  { id: 2, lat: 23.7020, lng: 90.4120, risk: 'Critical', rate: '18m/year' },
]

// Buriganga River path (simplified)
const burigangaPath = [
  [23.6950, 90.3850],
  [23.7000, 90.3950],
  [23.7080, 90.4074],
  [23.7150, 90.4100],
  [23.7250, 90.4150],
  [23.7300, 90.4200],
]

export default function RiverMap({ activeLayer, selectedRiver }: RiverMapProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="w-full h-full bg-slate-700 flex items-center justify-center">
        <p className="text-white">Loading map...</p>
      </div>
    )
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return '#dc2626'
      case 'high': return '#ea580c'
      case 'medium': return '#f59e0b'
      default: return '#10b981'
    }
  }

  return (
    <MapContainer
      center={[23.7104, 90.4074]}
      zoom={13}
      style={{ height: '100%', width: '100%' }}
      zoomControl={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {/* River Path */}
      <Polyline
        positions={burigangaPath}
        pathOptions={{ color: '#3b82f6', weight: 4, opacity: 0.7 }}
      />

      {/* Pollution Hotspots */}
      {(activeLayer === 'pollution' || activeLayer === 'all') &&
        pollutionHotspots.map((spot) => (
          <Circle
            key={`pollution-${spot.id}`}
            center={[spot.lat, spot.lng]}
            radius={200}
            pathOptions={{
              fillColor: getSeverityColor(spot.severity),
              fillOpacity: 0.5,
              color: getSeverityColor(spot.severity),
              weight: 2,
            }}
          >
            <Popup>
              <div className="text-sm">
                <p className="font-bold text-red-600">Pollution Hotspot</p>
                <p><strong>Type:</strong> {spot.type}</p>
                <p><strong>Severity:</strong> {spot.severity}</p>
                <p><strong>Nearby Factories:</strong> {spot.factories}</p>
              </div>
            </Popup>
          </Circle>
        ))}

      {/* Encroachment Zones */}
      {(activeLayer === 'encroachment' || activeLayer === 'all') &&
        encroachmentZones.map((zone) => (
          <Circle
            key={`encroachment-${zone.id}`}
            center={[zone.lat, zone.lng]}
            radius={150}
            pathOptions={{
              fillColor: '#eab308',
              fillOpacity: 0.4,
              color: '#eab308',
              weight: 2,
              dashArray: '5, 5',
            }}
          >
            <Popup>
              <div className="text-sm">
                <p className="font-bold text-yellow-600">Encroachment Zone</p>
                <p><strong>Area Lost:</strong> {zone.area}</p>
                <p><strong>Period:</strong> {zone.year}</p>
              </div>
            </Popup>
          </Circle>
        ))}

      {/* Erosion Areas */}
      {(activeLayer === 'erosion' || activeLayer === 'all') &&
        erosionAreas.map((area) => (
          <Circle
            key={`erosion-${area.id}`}
            center={[area.lat, area.lng]}
            radius={180}
            pathOptions={{
              fillColor: '#f97316',
              fillOpacity: 0.4,
              color: '#f97316',
              weight: 2,
              dashArray: '10, 5',
            }}
          >
            <Popup>
              <div className="text-sm">
                <p className="font-bold text-orange-600">Erosion Risk Area</p>
                <p><strong>Risk Level:</strong> {area.risk}</p>
                <p><strong>Erosion Rate:</strong> {area.rate}</p>
              </div>
            </Popup>
          </Circle>
        ))}
    </MapContainer>
  )
}
