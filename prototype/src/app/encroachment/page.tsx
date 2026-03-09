"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import {
  AlertTriangle,
  Calendar,
  ArrowRight,
  Ruler,
  Building2,
  Camera,
  Scale,
} from "lucide-react";

const EncroachmentMap = dynamic(() => import("@/components/EncroachmentMap"), {
  ssr: false,
  loading: () => (
    <div className="h-[600px] glass-card flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin w-8 h-8 border-2 border-[var(--primary)] border-t-transparent rounded-full mx-auto mb-2" />
        <span className="text-[var(--muted)]">
          Loading satellite imagery...
        </span>
      </div>
    </div>
  ),
});

export default function EncroachmentPage() {
  const [year, setYear] = useState<2016 | 2024>(2024);
  const [showComparison, setShowComparison] = useState(false);

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Building2 className="text-yellow-500" />
              River Encroachment Detection
              <span className="text-[var(--muted)] font-normal text-xl">
                নদী দখল
              </span>
            </h1>
            <p className="text-[var(--muted)] mt-2 max-w-xl">
              40% of Dhaka&apos;s riverbanks have been illegally seized through
              slow, incremental land filling. MNDWI-based water segmentation
              compares 2016 vs 2026 river boundaries.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="glass-card px-4 py-2 flex items-center gap-3">
              <Calendar className="w-4 h-4 text-[var(--muted)]" />
              <button
                onClick={() => setYear(2016)}
                className={`px-3 py-1 rounded-md transition-all ${
                  year === 2016
                    ? "bg-[var(--primary)] text-white"
                    : "hover:bg-white/10"
                }`}
              >
                2016
              </button>
              <button
                onClick={() => setYear(2024)}
                className={`px-3 py-1 rounded-md transition-all ${
                  year === 2024
                    ? "bg-[var(--primary)] text-white"
                    : "hover:bg-white/10"
                }`}
              >
                2024
              </button>
            </div>
            <button
              onClick={() => setShowComparison(!showComparison)}
              className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                showComparison
                  ? "bg-blue-500 text-white"
                  : "glass-card hover:bg-white/10"
              }`}
            >
              <ArrowRight className="w-4 h-4" />
              Compare Both
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="glass-card p-4 border-blue-500/20">
            <p className="text-sm text-[var(--muted)]">River Width (2016)</p>
            <p className="text-2xl font-bold text-blue-400">~300m</p>
            <p className="text-xs text-[var(--muted)] mt-1">
              Original baseline width
            </p>
          </div>
          <div className="glass-card p-4 border-red-500/20">
            <p className="text-sm text-[var(--muted)]">River Width (2026)</p>
            <p className="text-2xl font-bold text-red-400">~120m</p>
            <p className="text-xs text-red-400 mt-1">
              ↓ 60% reduction in places
            </p>
          </div>
          <div className="glass-card p-4 border-yellow-500/20">
            <p className="text-sm text-[var(--muted)]">Dhaka Banks Seized</p>
            <p className="text-2xl font-bold text-yellow-400">40%</p>
            <p className="text-xs text-[var(--muted)] mt-1">
              Land grabbers (নদী দখল)
            </p>
          </div>
          <div className="glass-card p-4">
            <p className="text-sm text-[var(--muted)]">Evidence Status</p>
            <p className="text-2xl font-bold text-teal-500">Court-Ready</p>
            <p className="text-xs text-[var(--muted)] mt-1">
              10-year time-series proof
            </p>
          </div>
        </div>

        {/* Alert Banner */}
        <div className="glass-card p-4 border-yellow-500/30 bg-yellow-500/5 mb-6 flex flex-wrap items-center gap-4">
          <AlertTriangle className="w-6 h-6 text-yellow-500" />
          <div className="flex-1 min-w-[200px]">
            <p className="font-bold text-yellow-500">
              Critical Encroachment: Turag Zone C
            </p>
            <p className="text-sm text-[var(--muted)]">
              22% area lost since 2019. Land filling detected via MNDWI change
              analysis. Enforcement-grade intelligence ready for NRCC.
            </p>
          </div>
          <span className="badge badge-yellow">Verified: Mar 2026</span>
        </div>

        {/* Map */}
        <EncroachmentMap year={year} showComparison={showComparison} />

        {/* Satellite Comparison Image */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <div className="glass-card overflow-hidden">
            <div className="p-4 border-b border-[var(--border)]">
              <h3 className="font-bold flex items-center gap-2">
                <Camera className="w-5 h-5 text-yellow-500" />
                Riverbank Encroachment: 2016 vs 2026
              </h3>
              <p className="text-sm text-[var(--muted)]">
                River width shrinks from 300m → 120m due to illegal land filling
              </p>
            </div>
            <div className="relative aspect-video">
              <Image
                src="/encroachment_comparison.png"
                alt="Encroachment Satellite Comparison 2016 vs 2026"
                fill
                className="object-cover"
              />
            </div>
          </div>
          <div className="glass-card p-6">
            <h3 className="font-bold flex items-center gap-2 mb-4">
              <Scale className="w-5 h-5 text-teal-500" />
              Legal Evidence Generation
            </h3>
            <p className="text-sm text-[var(--muted)] mb-4">
              Historical satellite evidence is{" "}
              <strong className="text-white">calibration-ready</strong> for
              Environmental Courts. Each zone tagged with exact area loss
              measurements and timestamps.
            </p>
            <div className="space-y-3">
              <div className="p-3 bg-white/5 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Time-Series Data</span>
                  <span className="badge badge-teal">10 Years</span>
                </div>
                <p className="text-xs text-[var(--muted)] mt-1">
                  2016–2026 continuous monitoring
                </p>
              </div>
              <div className="p-3 bg-white/5 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Satellite Source</span>
                  <span className="badge badge-blue">Sentinel-2</span>
                </div>
                <p className="text-xs text-[var(--muted)] mt-1">
                  10m resolution, 5-day revisit
                </p>
              </div>
              <div className="p-3 bg-white/5 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm">JRC Surface Water</span>
                  <span className="badge badge-purple">1984–2021</span>
                </div>
                <p className="text-xs text-[var(--muted)] mt-1">
                  30m historical water archive
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="glass-card p-6">
            <h3 className="font-bold flex items-center gap-2 mb-4">
              <Ruler className="w-5 h-5 text-[var(--primary)]" />
              Detection Method
            </h3>
            <p className="text-sm text-[var(--muted)] mb-4">
              Modified Normalized Difference Water Index (MNDWI) computed from
              Sentinel-2 imagery:
            </p>
            <div className="bg-black/30 p-3 rounded-lg font-mono text-sm text-center">
              MNDWI = (Green - SWIR) / (Green + SWIR)
            </div>
            <p className="text-xs text-[var(--muted)] mt-3">
              B3 (560nm) and B11 (1610nm) bands used for water/land
              discrimination.
            </p>
          </div>

          <div className="glass-card p-6">
            <h3 className="font-bold flex items-center gap-2 mb-4">
              📊 Temporal Analysis
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-[var(--muted)]">Baseline Year</span>
                <span>2016 (pre-monsoon)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--muted)]">Latest Analysis</span>
                <span>March 2024</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--muted)]">MNDWI Threshold</span>
                <span>≥ 0.2 (water)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--muted)]">Change Detection</span>
                <span>Δ MNDWI &lt; -0.15</span>
              </div>
            </div>
          </div>

          <div className="glass-card p-6">
            <h3 className="font-bold flex items-center gap-2 mb-4">
              🛰️ Data Source
            </h3>
            <p className="text-sm text-[var(--muted)] mb-2">
              <strong className="text-[var(--foreground)]">
                Sentinel-2 MSI, Level-2A
              </strong>
            </p>
            <p className="text-xs text-[var(--muted)] mb-3">
              Surface Reflectance with atmospheric correction
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[var(--muted)]">Resolution</span>
                <span>10m (B3), 20m (B11)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--muted)]">Revisit</span>
                <span>5 days (constellation)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--muted)]">Cloud Mask</span>
                <span>SCL band &lt; 30%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
