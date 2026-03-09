"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import {
  Factory,
  AlertTriangle,
  Info,
  ExternalLink,
  Zap,
  Target,
  FlaskConical,
} from "lucide-react";
import { useState } from "react";

// Dynamic import for map (requires window)
const PollutionMap = dynamic(() => import("@/components/PollutionMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] glass-card flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-[var(--muted)]">Loading map...</p>
      </div>
    </div>
  ),
});

// Spectral signatures for pollution classification
const pollutionTypes = [
  {
    type: "Textile Dye",
    signature: "High Red/Blue ratio",
    color: "bg-purple-500",
    pct: "45%",
  },
  {
    type: "Tannery Effluent",
    signature: "High NDTI + organic load",
    color: "bg-amber-600",
    pct: "30%",
  },
  {
    type: "Chemical Discharge",
    signature: "SWIR anomalies",
    color: "bg-red-500",
    pct: "15%",
  },
  {
    type: "Thermal Pollution",
    signature: "Temperature spikes",
    color: "bg-orange-500",
    pct: "10%",
  },
];

export default function PollutionPage() {
  const [showAlert, setShowAlert] = useState(false);

  const triggerAlert = () => {
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 8000);
  };

  return (
    <div className="pt-20 pb-12 px-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-red-500/10 rounded-lg">
                <Factory className="w-6 h-6 text-red-500" />
              </div>
              <h1 className="text-3xl font-bold">
                Pollution Fingerprinting{" "}
                <span className="text-[var(--muted)] font-normal">
                  নদী দূষণ
                </span>
              </h1>
            </div>
            <p className="text-[var(--muted)] max-w-2xl">
              60% of Dhaka&apos;s river pollution is industrial, yet among
              2,500+ factories, pinpointing the source is impossible without
              spectral evidence. NodiWatch profiles effluent type and assigns
              probability scores to nearby industries.
            </p>
          </div>
          <button
            onClick={triggerAlert}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/30 rounded-lg text-red-500 font-medium hover:bg-red-500/20 transition-colors"
          >
            <AlertTriangle className="w-4 h-4" />
            Simulate Alert
          </button>
        </div>

        {/* Info cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass-card p-4 border-red-500/20">
            <p className="text-sm text-[var(--muted)]">Industrial Pollution</p>
            <p className="text-2xl font-bold text-red-500">60%</p>
            <p className="text-xs text-[var(--muted)]">
              of Dhaka river pollution (IWM)
            </p>
          </div>
          <div className="glass-card p-4">
            <p className="text-sm text-[var(--muted)]">Factories Tracked</p>
            <p className="text-2xl font-bold">2,500+</p>
            <p className="text-xs text-[var(--muted)]">Via OpenStreetMap API</p>
          </div>
          <div className="glass-card p-4">
            <p className="text-sm text-[var(--muted)]">Attribution Accuracy</p>
            <p className="text-2xl font-bold text-teal-500">78%</p>
            <p className="text-xs text-[var(--muted)]">
              Bayesian probability model
            </p>
          </div>
          <div className="glass-card p-4">
            <p className="text-sm text-[var(--muted)]">Spectral Indices</p>
            <p className="text-2xl font-bold">NDTI, CDOM</p>
            <p className="text-xs text-[var(--muted)]">Multi-band analysis</p>
          </div>
        </div>

        {/* Map */}
        <PollutionMap
          showAlert={showAlert}
          onCloseAlert={() => setShowAlert(false)}
        />

        {/* Satellite Comparison Images */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-card overflow-hidden">
            <div className="p-4 border-b border-[var(--border)]">
              <h3 className="font-bold flex items-center gap-2">
                <Zap className="w-4 h-4 text-red-500" />
                River Pollution: Satellite View
              </h3>
              <p className="text-sm text-[var(--muted)]">
                Industrial effluent visible from space — 2016 vs 2026
              </p>
            </div>
            <div className="relative aspect-video">
              <Image
                src="/pollution_comparison.png"
                alt="River Pollution Satellite Comparison"
                fill
                className="object-cover"
              />
            </div>
          </div>
          <div className="glass-card overflow-hidden">
            <div className="p-4 border-b border-[var(--border)]">
              <h3 className="font-bold flex items-center gap-2">
                <Target className="w-4 h-4 text-purple-500" />
                Polluted River Assessment
              </h3>
              <p className="text-sm text-[var(--muted)]">
                Real satellite monitoring: Industrial discharge patterns
              </p>
            </div>
            <div className="relative aspect-video">
              <Image
                src="/polluted_river.png"
                alt="Polluted River Satellite Monitoring"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>

        {/* Spectral Fingerprinting */}
        <div className="glass-card p-6">
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <FlaskConical className="w-4 h-4 text-purple-500" />
            Spectral Fingerprinting Module
          </h3>
          <p className="text-sm text-[var(--muted)] mb-4">
            Random Forest classifier learns unique spectral signatures to
            classify pollution types. Each polluted zone gets classified by
            effluent type, then a Bayesian proximity model ranks nearby
            factories.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {pollutionTypes.map((p) => (
              <div
                key={p.type}
                className="p-4 bg-white/5 rounded-lg border border-[var(--border)]"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-3 h-3 rounded-full ${p.color}`} />
                  <span className="font-medium text-sm">{p.type}</span>
                </div>
                <p className="text-xs text-[var(--muted)]">{p.signature}</p>
                <p className="text-lg font-bold mt-2">{p.pct}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Legend & Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-card p-6">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <Info className="w-4 h-4 text-teal-500" />
              Heatmap Legend
            </h3>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div
                  className="w-6 h-3 rounded"
                  style={{
                    background:
                      "linear-gradient(to right, #2196f3, #06d6a0, #ffd166, #ff8c00, #ef476f)",
                  }}
                />
                <span className="text-sm text-[var(--muted)]">
                  NDTI: Low (0.1) → Critical (0.9)
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 border-2 border-red-500 border-dashed" />
                <span className="text-sm text-[var(--muted)]">
                  Pollution zone (clickable)
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-purple-500" />
                <span className="text-sm text-[var(--muted)]">
                  Industrial facility marker
                </span>
              </div>
            </div>
          </div>

          <div className="glass-card p-6">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <Factory className="w-4 h-4 text-red-500" />
              Data Sources
            </h3>
            <div className="space-y-3">
              <a
                href="https://developers.google.com/earth-engine/datasets/catalog/COPERNICUS_S2_SR_HARMONIZED"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
              >
                <div>
                  <p className="text-sm font-medium">Sentinel-2 MSI SR</p>
                  <p className="text-xs text-teal-500 font-mono">
                    10m resolution • 5-day revisit
                  </p>
                </div>
                <ExternalLink className="w-4 h-4 text-[var(--muted)]" />
              </a>
              <a
                href="https://overpass-api.de/api/interpreter"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
              >
                <div>
                  <p className="text-sm font-medium">OpenStreetMap Factories</p>
                  <p className="text-xs text-teal-500 font-mono">
                    Industry geolocation data
                  </p>
                </div>
                <ExternalLink className="w-4 h-4 text-[var(--muted)]" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
