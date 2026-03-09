"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import {
  Waves,
  AlertTriangle,
  Users,
  Home,
  Satellite,
  TrendingUp,
} from "lucide-react";

const ErosionMap = dynamic(() => import("@/components/ErosionMap"), {
  ssr: false,
  loading: () => (
    <div className="h-[600px] glass-card flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin w-8 h-8 border-2 border-[var(--primary)] border-t-transparent rounded-full mx-auto mb-2" />
        <span className="text-[var(--muted)]">Loading SAR data...</span>
      </div>
    </div>
  ),
});

export default function ErosionPage() {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Waves className="text-blue-500" />
              Erosion Risk Forecasting
              <span className="text-[var(--muted)] font-normal text-xl">
                নদী ভাঙন
              </span>
            </h1>
            <p className="text-[var(--muted)] mt-2 max-w-xl">
              ~10,000 hectares vanish yearly, displacing 1 million+ people
              across 94 upazilas. Sentinel-1 SAR radar works through monsoon
              clouds for real-time erosion prediction.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span className="badge badge-blue">Sentinel-1 SAR</span>
            <span className="badge badge-purple">Pre-Monsoon Forecast</span>
          </div>
        </div>

        {/* Stats Row - Real Bangladesh Data */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="glass-card p-4 border-red-500/20">
            <p className="text-sm text-[var(--muted)]">Annual Land Lost</p>
            <p className="text-2xl font-bold text-red-500">~10K ha</p>
            <p className="text-xs text-[var(--muted)] mt-1">
              Every year in Bangladesh
            </p>
          </div>
          <div className="glass-card p-4 border-yellow-500/20">
            <p className="text-sm text-[var(--muted)]">Economic Loss</p>
            <p className="text-2xl font-bold text-yellow-400">$500M</p>
            <p className="text-xs text-[var(--muted)] mt-1">
              Annual damage from নদী ভাঙন
            </p>
          </div>
          <div className="glass-card p-4 border-orange-500/20">
            <p className="text-sm text-[var(--muted)]">People Displaced</p>
            <p className="text-2xl font-bold text-orange-400">1M+</p>
            <p className="text-xs text-[var(--muted)] mt-1">
              Annually across 94 upazilas
            </p>
          </div>
          <div className="glass-card p-4 border-purple-500/20">
            <p className="text-sm text-[var(--muted)]">Climate Projection</p>
            <p className="text-2xl font-bold text-purple-400">+13%</p>
            <p className="text-xs text-[var(--muted)] mt-1">
              Erosion increase by 2050
            </p>
          </div>
        </div>

        {/* Alert Banner */}
        <div className="glass-card p-4 border-red-500/30 bg-red-500/5 mb-6 flex flex-wrap items-center gap-4">
          <AlertTriangle className="w-6 h-6 text-red-500" />
          <div className="flex-1 min-w-[200px]">
            <p className="font-bold text-red-500">
              Extreme Erosion Alert — Jamuna Corridor N3
            </p>
            <p className="text-sm text-[var(--muted)]">
              12m/year retreat rate detected. BWDB embankment priority zone.
              Early warning issued to DDM for preemptive evacuation planning.
            </p>
          </div>
          <span className="badge badge-red">High Risk</span>
        </div>

        {/* Map */}
        <ErosionMap />

        {/* Satellite Comparison Image */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <div className="glass-card overflow-hidden">
            <div className="p-4 border-b border-[var(--border)]">
              <h3 className="font-bold flex items-center gap-2">
                <Satellite className="w-5 h-5 text-blue-500" />
                Riverbank Erosion: 2016 vs 2026
              </h3>
              <p className="text-sm text-[var(--muted)]">
                ~500m of land lost to erosion over 10 years — visible from
                satellite
              </p>
            </div>
            <div className="relative aspect-video">
              <Image
                src="/erosion_comparison.png"
                alt="Riverbank Erosion Satellite Comparison"
                fill
                className="object-cover"
              />
            </div>
          </div>
          <div className="glass-card p-6">
            <h3 className="font-bold flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-teal-500" />
              Why SAR for Erosion?
            </h3>
            <p className="text-sm text-[var(--muted)] mb-4">
              Sentinel-1 SAR radar penetrates monsoon clouds (12-day revisit
              cycle) —
              <strong className="text-white">
                critical for Bangladesh&apos;s rainy season
              </strong>
              . When optical satellites are blind, SAR continues monitoring.
            </p>
            <div className="space-y-3">
              <div className="p-3 bg-white/5 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Cloud Penetration</span>
                  <span className="badge badge-teal">100%</span>
                </div>
                <p className="text-xs text-[var(--muted)] mt-1">
                  Works through monsoon clouds
                </p>
              </div>
              <div className="p-3 bg-white/5 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Night Operation</span>
                  <span className="badge badge-blue">24/7</span>
                </div>
                <p className="text-xs text-[var(--muted)] mt-1">
                  Active radar, not dependent on sunlight
                </p>
              </div>
              <div className="p-3 bg-white/5 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm">GEE Research Paper</span>
                  <span className="badge badge-purple">
                    DOI: 10.5281/zenodo.7252970
                  </span>
                </div>
                <p className="text-xs text-[var(--muted)] mt-1">
                  Freihardt & Frey (2023) methodology
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="glass-card p-6">
            <h3 className="font-bold flex items-center gap-2 mb-4">
              🛰️ Detection Method
            </h3>
            <p className="text-sm text-[var(--muted)] mb-4">
              Multi-temporal SAR coherence change detection combined with
              optical NDWI analysis:
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[var(--muted)]">SAR Data</span>
                <span>Sentinel-1 GRD</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--muted)]">Polarization</span>
                <span>VV + VH</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--muted)]">Change Threshold</span>
                <span>σ° Δ &gt; 3 dB</span>
              </div>
            </div>
            <p className="text-xs text-[var(--muted)] mt-3">
              Based on methodology from Freihardt & Frey (2022), DOI:
              10.5281/zenodo.7252970
            </p>
          </div>

          <div className="glass-card p-6">
            <h3 className="font-bold flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-[var(--primary)]" />
              Impact Assessment
            </h3>
            <div className="space-y-3">
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Critical Zone</span>
                  <span className="text-red-500 font-bold">847</span>
                </div>
                <p className="text-xs text-[var(--muted)]">
                  Immediate relocation needed
                </p>
              </div>
              <div className="p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm">High Risk Zone</span>
                  <span className="text-orange-400 font-bold">1,124</span>
                </div>
                <p className="text-xs text-[var(--muted)]">6-month warning</p>
              </div>
              <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Watch Zone</span>
                  <span className="text-yellow-400 font-bold">369</span>
                </div>
                <p className="text-xs text-[var(--muted)]">Monitor annually</p>
              </div>
            </div>
          </div>

          <div className="glass-card p-6">
            <h3 className="font-bold flex items-center gap-2 mb-4">
              <Home className="w-5 h-5 text-[var(--primary)]" />
              Early Warning System
            </h3>
            <p className="text-sm text-[var(--muted)] mb-4">
              Monsoon-triggered predictions sent 2-4 weeks before expected
              erosion events:
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                <span>SMS alerts to village leaders</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-orange-400" />
                <span>District disaster management</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-yellow-400" />
                <span>NGO coordination network</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-400" />
                <span>Government relocation programs</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
