"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import {
  Droplets,
  Building2,
  Mountain,
  AlertTriangle,
  TrendingUp,
  Satellite,
  ChevronRight,
  Activity,
  Users,
  FileText,
  Database,
  Camera,
  Sparkles,
  Shield,
  Globe,
  Zap,
  Target,
  Brain,
  Layers,
  ArrowRight,
  Play,
  CheckCircle2,
} from "lucide-react";
import StatsCard from "@/components/StatsCard";
import AlertsPanel from "@/components/AlertsPanel";
import ComparisonSlider from "@/components/ComparisonSlider";
import { aggregatedStats } from "@/data/trends";
import { alerts } from "@/data/datasets";

// Dynamic import for map to prevent SSR issues
const DashboardMap = dynamic(() => import("@/components/maps/DashboardMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-slate-900/50 rounded-xl flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin w-8 h-8 border-2 border-teal border-t-transparent rounded-full mx-auto mb-2"></div>
        <p className="text-gray-400">Loading map...</p>
      </div>
    </div>
  ),
});

export default function HomePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const monitoringModules = [
    {
      title: "নদী দূষণ (Pollution)",
      titleBn: "Nodi Dushon",
      description:
        "AI-powered detection of industrial discharge using spectral fingerprinting. Identifies textile, tannery, and chemical pollution sources.",
      icon: Droplets,
      color: "red",
      href: "/pollution",
      stats: {
        value: aggregatedStats.criticalHotspots,
        label: "Active Hotspots",
      },
      features: [
        "NDTI Index Analysis",
        "Factory Attribution",
        "Automated Alerts",
      ],
    },
    {
      title: "নদী দখল (Encroachment)",
      titleBn: "Nodi Dokhol",
      description:
        "Track illegal land filling and river boundary violations with decade-long historical comparison.",
      icon: Building2,
      color: "yellow",
      href: "/encroachment",
      stats: {
        value: `${aggregatedStats.totalEncroachmentArea}km²`,
        label: "Area Lost",
      },
      features: [
        "MNDWI Boundary Detection",
        "10-Year Comparison",
        "Legal Evidence",
      ],
    },
    {
      title: "নদী ভাঙন (Erosion)",
      titleBn: "Nodi Vangon",
      description:
        "SAR-based riverbank stability analysis with early warning system for at-risk communities.",
      icon: Mountain,
      color: "orange",
      href: "/erosion",
      stats: {
        value: `${aggregatedStats.averageErosionRate}m/yr`,
        label: "Avg Retreat",
      },
      features: [
        "SAR Coherence Analysis",
        "Risk Forecasting",
        "Displacement Alerts",
      ],
    },
  ];

  const aiFeatures = [
    {
      icon: Brain,
      title: "MNDWI Water Classification",
      description:
        "Modified Normalized Difference Water Index tracks river boundaries — validated at 82-96% accuracy in Bangladesh rivers",
    },
    {
      icon: Target,
      title: "Spectral Fingerprinting",
      description:
        "NDTI, CDOM, and Red/Blue ratio indices classify pollution cluster types: high-dye, high-organic, mixed industrial",
    },
    {
      icon: Layers,
      title: "Bayesian Attribution",
      description:
        "Spatial probability ranking of nearby industrial clusters using OSM data, distance decay, and spectral match",
    },
    {
      icon: Zap,
      title: "SAR Erosion Tracking",
      description:
        "Cloud-penetrating Sentinel-1 radar detects historical bank retreat through monsoon season (per Freihardt & Frey, 2023)",
    },
  ];

  if (!mounted) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-3 border-teal border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-400">Loading NodiWatch...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen animate-fadeIn">
      {/* Hero Section */}
      <section className="relative py-16 lg:py-24 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-transparent to-purple-900/20" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-teal/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto text-center mb-16">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-teal/10 to-purple-500/10 border border-teal/30 mb-8">
              <Sparkles size={16} className="text-purple-400" />
              <span className="text-teal text-sm font-medium">
                Eco-Tech Hackathon 2026 • Team AlphaVerse
              </span>
            </div>

            <h1 className="text-5xl lg:text-7xl font-bold mb-8">
              <span className="gradient-text">NodiWatch</span>
              <br />
              <span className="text-white text-4xl lg:text-5xl">
                AI-Powered River Surveillance
              </span>
            </h1>

            <p className="text-xl lg:text-2xl text-gray-300 mb-6 max-w-3xl mx-auto leading-relaxed">
              One Platform. <span className="text-red-400">Pollution</span>.{" "}
              <span className="text-yellow-400">Encroachment</span>.{" "}
              <span className="text-orange-400">Erosion</span>.
              <br />
              <span className="text-gray-400">
                Periodic Automated Monitoring for Bangladesh's Rivers.
              </span>
            </p>

            <p className="text-lg text-gray-400 mb-10 max-w-2xl mx-auto">
              Combining Sentinel satellite imagery with machine learning to
              monitor 1,400+ rivers, tracking environmental threats that cause{" "}
              <span className="text-red-400 font-semibold">
                $500M annual economic loss
              </span>
              .
            </p>

            <div className="flex flex-wrap gap-4 justify-center mb-12">
              <Link
                href="/pollution"
                className="px-8 py-4 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-xl font-semibold hover:from-teal-500 hover:to-blue-500 transition-all flex items-center gap-2 shadow-lg shadow-teal/20"
              >
                <Activity size={20} />
                Explore Dashboard
              </Link>
              <Link
                href="/evidence"
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-500 hover:to-pink-500 transition-all flex items-center gap-2 shadow-lg shadow-purple-500/20"
              >
                <Camera size={20} />
                Submit Evidence
              </Link>
              <a
                href="https://drive.google.com/file/d/1FekDyQo9CfUwBJZYpZ8ViK-2s9mdhuF-/view?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-white/10 text-white rounded-xl font-semibold hover:bg-white/20 transition-colors flex items-center gap-2 border border-white/10"
              >
                <Play size={20} />
                Watch Demo
              </a>
            </div>

            {/* Crisis Stats */}
            <div className="grid grid-cols-3 gap-6 max-w-3xl mx-auto">
              <div className="text-center p-4 rounded-xl bg-red-500/5 border border-red-500/20">
                <div className="text-3xl lg:text-4xl font-bold text-red-400 mb-1">
                  60%
                </div>
                <div className="text-sm text-gray-400">Rivers Polluted</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-yellow-500/5 border border-yellow-500/20">
                <div className="text-3xl lg:text-4xl font-bold text-yellow-400 mb-1">
                  40%
                </div>
                <div className="text-sm text-gray-400">Banks Encroached</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-orange-500/5 border border-orange-500/20">
                <div className="text-3xl lg:text-4xl font-bold text-orange-400 mb-1">
                  10K ha
                </div>
                <div className="text-sm text-gray-400">Lost Annually</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Satellite Intelligence Preview */}
      <section className="py-16 bg-slate-900/50">
        <div className="container mx-auto px-4">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800/80 to-red-950/20 border border-slate-700/50">
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-red-500/5 rounded-full blur-3xl" />

            <div className="relative z-10 grid lg:grid-cols-2 gap-8 p-8 lg:p-12 items-center">
              {/* Left: Text Content */}
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/15 border border-red-500/30 mb-5">
                  <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
                  <span className="text-red-400 text-xs font-mono font-semibold tracking-widest">
                    SENTINEL-2 ANALYSIS
                  </span>
                </div>

                <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight">
                  Industrial Discharge <br />
                  <span className="text-red-400">
                    Detected. Traced. Reported.
                  </span>
                </h2>

                <p className="text-gray-300 mb-6 leading-relaxed">
                  This Sentinel-2 capture shows red-brown effluent plumes —
                  visible from space — pouring from industrial zones into the
                  Buriganga river. Tannery chromium, textile dyes, and chemical
                  discharge threaten water supply for{" "}
                  <span className="text-white font-semibold">
                    12 million Dhaka residents
                  </span>
                  .
                </p>

                {/* Detection Indicators */}
                <div className="space-y-3 mb-8">
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-red-500/5 border border-red-500/20">
                    <div className="w-2 h-2 rounded-full bg-red-400 mt-1.5 flex-shrink-0" />
                    <div>
                      <span className="text-red-400 text-sm font-semibold">
                        NDTI Index +0.47
                      </span>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Severe turbidity spike — tannery effluent confirmed via
                        spectral fingerprint
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-orange-500/5 border border-orange-500/20">
                    <div className="w-2 h-2 rounded-full bg-orange-400 mt-1.5 flex-shrink-0" />
                    <div>
                      <span className="text-orange-400 text-sm font-semibold">
                        3 Factories Attributed
                      </span>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Bayesian proximity model matched chromium &amp; sulfide
                        signatures to upstream sources
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-yellow-500/5 border border-yellow-500/20">
                    <div className="w-2 h-2 rounded-full bg-yellow-400 mt-1.5 flex-shrink-0" />
                    <div>
                      <span className="text-yellow-400 text-sm font-semibold">
                        Enforcement Report Generated
                      </span>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Geo-tagged violation report auto-generated for DoE/NRCC
                        inspection team — coordinates, timestamps, spectral evidence
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/pollution"
                    className="px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-xl font-semibold hover:from-red-500 hover:to-orange-500 transition-all flex items-center gap-2 shadow-lg shadow-red-900/30"
                  >
                    <Activity size={16} />
                    Open Pollution Monitor
                  </Link>
                  <Link
                    href="/datasets"
                    className="px-6 py-3 bg-white/8 text-white rounded-xl font-medium hover:bg-white/15 transition-colors flex items-center gap-2 border border-white/10"
                  >
                    <Database size={16} />
                    Explore Data
                  </Link>
                </div>
              </div>

              {/* Right: Satellite Image */}
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-br from-red-500/25 to-orange-500/15 rounded-2xl blur-xl" />
                <div className="relative rounded-xl overflow-hidden border border-red-500/30 shadow-2xl shadow-red-950/40">
                  {/* Satellite HUD Header */}
                  <div className="absolute top-0 left-0 right-0 z-10 bg-black/75 backdrop-blur-sm px-3 py-2 flex items-center justify-between border-b border-red-500/20">
                    <div className="flex items-center gap-2">
                      <Satellite size={12} className="text-red-400" />
                      <span className="text-red-400 text-xs font-mono font-bold tracking-wider">
                        SENTINEL-2 · 10m/5-day
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-slate-400 text-xs font-mono">
                        BAND RGB-NRI
                      </span>
                      <span className="text-slate-400 text-xs font-mono">
                        10m/px
                      </span>
                    </div>
                  </div>

                  <img
                    src="/assets/polluted_river.png"
                    alt="Satellite view of industrial pollution in Buriganga river, Bangladesh"
                    className="w-full object-cover"
                  />

                  {/* Satellite HUD Footer */}
                  <div className="absolute bottom-0 left-0 right-0 bg-black/75 backdrop-blur-sm px-3 py-2 flex items-center justify-between border-t border-red-500/20">
                    <span className="text-slate-300 text-xs font-mono">
                      Buriganga Basin · Dhaka, BD
                    </span>
                    <span className="text-red-400 text-xs font-mono font-semibold">
                      ⚠ POLLUTION CONFIRMED
                    </span>
                  </div>
                </div>

                {/* Floating NDTI Badge */}
                <div className="absolute -bottom-4 -left-4 bg-slate-900/95 border border-red-500/40 rounded-xl px-4 py-3 shadow-xl backdrop-blur-sm">
                  <div className="text-xs text-gray-500 font-mono mb-0.5">
                    NDTI INDEX
                  </div>
                  <div className="text-2xl font-bold text-red-400 font-mono">
                    +0.47
                  </div>
                  <div className="text-xs text-red-400/60 font-mono">
                    HIGH TURBIDITY
                  </div>
                </div>

                {/* Floating CDOM Badge */}
                <div className="absolute -top-4 -right-4 bg-slate-900/95 border border-orange-500/40 rounded-xl px-4 py-3 shadow-xl backdrop-blur-sm">
                  <div className="text-xs text-gray-500 font-mono mb-0.5">
                    CDOM INDEX
                  </div>
                  <div className="text-2xl font-bold text-orange-400 font-mono">
                    3.7
                  </div>
                  <div className="text-xs text-orange-400/60 font-mono">
                    HIGH ORGANIC LOAD
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Row */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard
              title="Rivers Monitored"
              value={aggregatedStats.totalRivers}
              icon={Droplets}
              color="blue"
            />
            <StatsCard
              title="Factories Tracked"
              value={aggregatedStats.totalFactories}
              icon={Building2}
              color="purple"
              change={{ value: 12, isPositive: false }}
            />
            <StatsCard
              title="Violations Detected"
              value={aggregatedStats.totalViolations}
              icon={AlertTriangle}
              color="red"
              change={{ value: 8, isPositive: false }}
            />
            <StatsCard
              title="Population at Risk"
              value={`${(aggregatedStats.populationAtRisk / 1000).toFixed(0)}K`}
              icon={Users}
              color="yellow"
            />
          </div>
        </div>
      </section>

      {/* Map + Alerts Section */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Map */}
            <div className="lg:col-span-2 h-[500px]">
              <DashboardMap className="w-full h-full" />
            </div>

            {/* Alerts Panel */}
            <div className="h-[500px]">
              <AlertsPanel
                alerts={alerts.slice(0, 5).map((a) => ({
                  ...a,
                  type: a.type as "critical" | "warning" | "info" | "success",
                  time: new Date(a.timestamp).toLocaleString(),
                }))}
                maxHeight="460px"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Satellite Comparison Section */}
      <section className="py-16 bg-gradient-to-b from-slate-900/50 to-transparent">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/30 mb-4">
              <Satellite size={16} className="text-orange-400" />
              <span className="text-orange-400 text-sm font-medium">
                Satellite Evidence
              </span>
            </div>
            <h2 className="text-3xl font-bold text-white mb-3">
              See The Change: 2016 vs 2026
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Drag the slider to compare satellite imagery and witness the scale
              of environmental degradation
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            <ComparisonSlider
              beforeImage="/assets/pollution_comparison.png"
              afterImage="/assets/pollution_comparison.png"
              beforeLabel="River Before"
              afterLabel="Polluted"
              beforeYear="2016"
              afterYear="2026"
              title="Industrial Pollution"
              description="Visible industrial effluent discharge causing severe water discoloration"
            />
            <ComparisonSlider
              beforeImage="/assets/encroachment_comparison.png"
              afterImage="/assets/encroachment_comparison.png"
              beforeLabel="Natural Bank"
              afterLabel="Encroached"
              beforeYear="2016"
              afterYear="2026"
              title="Land Encroachment"
              description="River width reduced by 60% due to illegal land filling and construction"
            />
            <ComparisonSlider
              beforeImage="/assets/erosion_comparison.png"
              afterImage="/assets/erosion_comparison.png"
              beforeLabel="Stable Bank"
              afterLabel="Eroded"
              beforeYear="2020"
              afterYear="2026"
              title="Riverbank Erosion"
              description="Massive erosion displacing communities and destroying agricultural land"
            />
          </div>
        </div>
      </section>

      {/* Monitoring Modules */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-3">
              Triple-Threat Monitoring
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Three specialized AI modules working together for comprehensive
              river ecosystem protection
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {monitoringModules.map((module) => (
              <Link key={module.title} href={module.href}>
                <div className="glass-card p-6 h-full hover:border-teal/50 transition-all group cursor-pointer relative overflow-hidden">
                  {/* Background gradient */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br from-${module.color}-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity`}
                  />

                  <div className="relative z-10">
                    <div
                      className={`w-14 h-14 rounded-xl bg-${module.color}-500/20 flex items-center justify-center mb-4`}
                    >
                      <module.icon
                        size={28}
                        className={`text-${module.color}-400`}
                      />
                    </div>

                    <h3 className="text-xl font-semibold text-white mb-1 group-hover:text-teal transition-colors">
                      {module.title}
                    </h3>
                    <p className="text-xs text-gray-500 mb-3">
                      {module.titleBn}
                    </p>

                    <p className="text-gray-400 mb-4 text-sm leading-relaxed">
                      {module.description}
                    </p>

                    {/* Features */}
                    <div className="space-y-2 mb-6">
                      {module.features.map((feature, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 text-xs text-gray-500"
                        >
                          <CheckCircle2
                            size={12}
                            className={`text-${module.color}-400`}
                          />
                          {feature}
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                      <div>
                        <div
                          className={`text-2xl font-bold text-${module.color}-400`}
                        >
                          {module.stats.value}
                        </div>
                        <div className="text-xs text-gray-500">
                          {module.stats.label}
                        </div>
                      </div>

                      <div
                        className={`p-2 rounded-full bg-${module.color}-500/10 group-hover:bg-${module.color}-500/20 transition-colors`}
                      >
                        <ArrowRight
                          size={20}
                          className={`text-${module.color}-400`}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* AI Technology Section */}
      <section className="py-16 bg-gradient-to-b from-purple-900/10 to-transparent">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/30 mb-4">
              <Brain size={16} className="text-purple-400" />
              <span className="text-purple-400 text-sm font-medium">
                AI Technology Stack
              </span>
            </div>
            <h2 className="text-3xl font-bold text-white mb-3">
              Machine Learning at Work
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Four layers of AI working in harmony to transform satellite pixels
              into actionable environmental intelligence
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {aiFeatures.map((feature, idx) => (
              <div
                key={idx}
                className="bg-slate-800/30 rounded-2xl p-6 border border-slate-700/50 hover:border-purple-500/30 transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-4">
                  <feature.icon size={24} className="text-purple-400" />
                </div>
                <h3 className="font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Evidence CTA */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-900/50 via-slate-800 to-blue-900/50 border border-slate-700/50">
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
            <div className="relative z-10 grid lg:grid-cols-2 gap-8 p-8 lg:p-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/20 border border-purple-500/30 mb-4">
                  <Camera size={14} className="text-purple-400" />
                  <span className="text-purple-400 text-xs font-medium">
                    Citizen Ground-Truth
                  </span>
                </div>
                <h2 className="text-3xl font-bold text-white mb-4">
                  Be Part of the Solution
                </h2>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  Your observations matter. Upload photos of environmental
                  damage from your community — our AI analyzes them instantly to
                  create actionable evidence for enforcement agencies.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link
                    href="/evidence"
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-500 hover:to-pink-500 transition-all flex items-center gap-2"
                  >
                    <Camera size={18} />
                    Submit Evidence
                  </Link>
                  <Link
                    href="/about"
                    className="px-6 py-3 bg-white/10 text-white rounded-xl font-medium hover:bg-white/20 transition-colors"
                  >
                    Learn More
                  </Link>
                </div>
              </div>
              <div className="relative">
                <img
                  src="/assets/citizen_ground_truth.png"
                  alt="Citizen Ground Truth App"
                  className="rounded-xl shadow-2xl border border-slate-700/50"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-12 bg-gradient-to-t from-slate-900/50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              href="/datasets"
              className="glass-card p-4 hover:bg-white/5 transition-colors flex items-center gap-3"
            >
              <Database size={24} className="text-blue-400" />
              <div>
                <div className="font-medium text-white">Datasets</div>
                <div className="text-xs text-gray-400">
                  Explore satellite sources
                </div>
              </div>
            </Link>

            <Link
              href="/analysis"
              className="glass-card p-4 hover:bg-white/5 transition-colors flex items-center gap-3"
            >
              <TrendingUp size={24} className="text-green-400" />
              <div>
                <div className="font-medium text-white">Trend Analysis</div>
                <div className="text-xs text-gray-400">
                  10-year historical data
                </div>
              </div>
            </Link>

            <Link
              href="/evidence"
              className="glass-card p-4 hover:bg-white/5 transition-colors flex items-center gap-3"
            >
              <Camera size={24} className="text-purple-400" />
              <div>
                <div className="font-medium text-white">Evidence Reports</div>
                <div className="text-xs text-gray-400">
                  AI-powered submissions
                </div>
              </div>
            </Link>

            <Link
              href="/about"
              className="glass-card p-4 hover:bg-white/5 transition-colors flex items-center gap-3"
            >
              <Users size={24} className="text-yellow-400" />
              <div>
                <div className="font-medium text-white">About NodiWatch</div>
                <div className="text-xs text-gray-400">Team & methodology</div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Technology Badges */}
      <section className="py-8 border-t border-slate-800/50">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500">
            <span className="flex items-center gap-2">
              <Satellite size={16} className="text-blue-400" />
              Sentinel-2 • Sentinel-1 SAR
            </span>
            <span className="flex items-center gap-2">
              <Globe size={16} className="text-teal" />
              Google Earth Engine
            </span>
            <span className="flex items-center gap-2">
              <Brain size={16} className="text-purple-400" />
              TensorFlow • Gemini AI
            </span>
            <span className="flex items-center gap-2">
              <Shield size={16} className="text-green-400" />
              Near-Real-Time Monitoring
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
