import Link from "next/link";
import Image from "next/image";
import {
  Factory,
  LandPlot,
  Mountain,
  TrendingUp,
  AlertTriangle,
  MapPin,
  ArrowRight,
  Building2,
  Scale,
  Globe,
  Users,
  Satellite,
  Cpu,
  Database,
  MonitorPlay,
} from "lucide-react";

// Real stats from context - based on actual Bangladesh environmental research
const stats = [
  {
    label: "Rivers to Monitor",
    value: "1,400+",
    change: "Nationwide coverage",
    icon: MapPin,
    color: "teal",
  },
  {
    label: "Industrial Pollution",
    value: "60%",
    change: "Of Dhaka river pollution (IWM)",
    icon: Factory,
    color: "red",
  },
  {
    label: "Riverbanks Seized",
    value: "40%",
    change: "Of Dhaka riverbanks (land grabbers)",
    icon: LandPlot,
    color: "yellow",
  },
  {
    label: "Land Lost to Erosion",
    value: "10K ha",
    change: "$500M annual loss",
    icon: Mountain,
    color: "blue",
  },
];

const stakeholders = [
  { name: "DoE", desc: "Automated pollution tracking", icon: Building2 },
  { name: "NRCC", desc: "1,400+ river monitoring", icon: Globe },
  { name: "BWDB", desc: "Erosion early warning", icon: Mountain },
  { name: "Banks", desc: "Green Banking compliance", icon: Scale },
  { name: "Courts", desc: "Time-series evidence", icon: Scale },
  { name: "Public", desc: "9M+ citizens at risk", icon: Users },
];

const techStack = [
  { name: "Sentinel-2", desc: "10m optical, 5-day", icon: Satellite },
  { name: "Sentinel-1 SAR", desc: "Radar, cloud-penetrating", icon: Satellite },
  { name: "Google Earth Engine", desc: "Cloud processing", icon: Cpu },
  { name: "AI Models", desc: "CNN + Random Forest", icon: Cpu },
  { name: "PostGIS", desc: "Geospatial database", icon: Database },
  { name: "React/Next.js", desc: "Web dashboard", icon: MonitorPlay },
];

const features = [
  {
    title: "Pollution Fingerprinting",
    bengali: "নদী দূষণ",
    description:
      "Multispectral indices (NDTI, CDOM, SWIR) profile effluent type — textile dye (Red/Blue ratio), tannery (high turbidity), chemical discharge. Each cluster gets a probability profile.",
    href: "/pollution",
    color: "red",
    icon: Factory,
    image: "/pollution_comparison.png",
  },
  {
    title: "Encroachment Detection",
    bengali: "নদী দখল",
    description:
      "MNDWI-based water segmentation compares 2016 vs 2026 river boundaries from Sentinel-2 imagery (10m resolution). Automatic detection of river width shrinkage over time.",
    href: "/encroachment",
    color: "yellow",
    icon: LandPlot,
    image: "/encroachment_comparison.png",
  },
  {
    title: "Erosion Risk Forecasting",
    bengali: "নদী ভাঙন",
    description:
      "Sentinel-1 SAR radar (works through monsoon clouds, 12-day revisit) + AI tracks shoreline regression. Forecasts probabilistic erosion risk corridors for BWDB and DDM.",
    href: "/erosion",
    color: "blue",
    icon: Mountain,
    image: "/erosion_comparison.png",
  },
];

export default function Dashboard() {
  return (
    <div className="pt-20 pb-12 px-6">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Hero Section with Dashboard Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 py-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <p className="text-sm text-teal-500 font-medium uppercase tracking-wide">
                🛰️ Eco-Tech Hackathon 2026 • Environment Watch: BUET
              </p>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                <span className="gradient-text">NodiWatch</span>
              </h1>
              <p className="text-xl text-[var(--muted)]">
                AI-Powered Satellite Surveillance for River Ecosystems
              </p>
            </div>
            <p className="text-[var(--muted)] leading-relaxed">
              One platform addresses{" "}
              <strong className="text-red-400">pollution (নদী দূষণ)</strong>,{" "}
              <strong className="text-yellow-400">
                encroachment (নদী দখল)
              </strong>
              , and{" "}
              <strong className="text-blue-400">erosion (নদী ভাঙন)</strong> —
              three crises threatening Bangladesh&apos;s 1,400+ rivers.
              Transform 10 years of free satellite imagery into actionable
              enforcement intelligence.
            </p>
            <div className="flex flex-wrap gap-3">
              <span className="badge badge-red">নদী দূষণ • Pollution</span>
              <span className="badge badge-yellow">নদী দখল • Encroachment</span>
              <span className="badge badge-blue">নদী ভাঙন • Erosion</span>
            </div>
            <div className="pt-4">
              <Link
                href="/pollution"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-500 to-blue-500 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
              >
                Explore Dashboard <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="glass-card p-2 overflow-hidden">
              <Image
                src="/dashboard_mockup.png"
                alt="NodiWatch Tri-Layer Dashboard"
                width={700}
                height={500}
                className="rounded-lg w-full object-cover"
                priority
              />
            </div>
            <div className="absolute -bottom-4 -right-4 glass-card px-4 py-2 text-sm">
              <span className="text-teal-500 font-semibold">
                Team AlphaVerse
              </span>{" "}
              • Phase 2
            </div>
          </div>
        </div>

        {/* Problem Stats - Real Bangladesh Data */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-center">
            Bangladesh&apos;s Rivers Face a{" "}
            <span className="text-red-500">Triple Threat</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat) => {
              const Icon = stat.icon;
              const colorClasses = {
                teal: "text-teal-500 bg-teal-500/10 border-teal-500/30",
                red: "text-red-500 bg-red-500/10 border-red-500/30",
                yellow: "text-yellow-500 bg-yellow-500/10 border-yellow-500/30",
                blue: "text-blue-500 bg-blue-500/10 border-blue-500/30",
              };
              const colors =
                colorClasses[stat.color as keyof typeof colorClasses];

              return (
                <div
                  key={stat.label}
                  className={`glass-card p-6 border ${colors.split(" ")[2]}`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-[var(--muted)]">
                        {stat.label}
                      </p>
                      <p className="text-3xl font-bold mt-1">{stat.value}</p>
                      <p className="text-xs text-[var(--muted)] mt-2 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        {stat.change}
                      </p>
                    </div>
                    <div
                      className={`p-3 rounded-lg ${colors.split(" ")[0]} ${colors.split(" ")[1]}`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Smart Alert Banner */}
        <div className="glass-card p-4 border-red-500/30 bg-red-500/5 flex flex-wrap items-center gap-4">
          <div className="p-2 bg-red-500/10 rounded-lg">
            <AlertTriangle className="w-6 h-6 text-red-500 animate-pulse" />
          </div>
          <div className="flex-1 min-w-[200px]">
            <p className="font-semibold text-red-500">
              Critical Alert: Hazaribagh Zone A
            </p>
            <p className="text-sm text-[var(--muted)]">
              NDTI Index: 0.82 (threshold: 0.45) — Tannery effluent signature
              detected •
              <span className="text-red-400">
                {" "}
                78% probability: Textile cluster
              </span>
            </p>
          </div>
          <Link
            href="/pollution"
            className="px-4 py-2 bg-red-500/10 border border-red-500/30 rounded-lg text-red-500 text-sm font-medium hover:bg-red-500/20 transition-colors whitespace-nowrap"
          >
            View Details
          </Link>
        </div>

        {/* Feature Cards with Images */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-center">
            Three Crises, <span className="gradient-text">One Platform</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon;
              const colorClasses = {
                red: {
                  icon: "text-red-500 bg-red-500/10",
                  border: "hover:border-red-500/30",
                  btn: "bg-red-500/10 text-red-500 hover:bg-red-500/20",
                },
                yellow: {
                  icon: "text-yellow-500 bg-yellow-500/10",
                  border: "hover:border-yellow-500/30",
                  btn: "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20",
                },
                blue: {
                  icon: "text-blue-500 bg-blue-500/10",
                  border: "hover:border-blue-500/30",
                  btn: "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20",
                },
              };
              const colors =
                colorClasses[feature.color as keyof typeof colorClasses];

              return (
                <Link
                  key={feature.title}
                  href={feature.href}
                  className={`group glass-card overflow-hidden transition-all ${colors.border}`}
                >
                  <div className="relative h-40 overflow-hidden">
                    <Image
                      src={feature.image}
                      alt={feature.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)] to-transparent" />
                  </div>
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-lg ${colors.icon}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg">{feature.title}</h3>
                        <p className="text-sm text-[var(--muted)]">
                          {feature.bengali}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-[var(--muted)] mt-4 leading-relaxed">
                      {feature.description}
                    </p>
                    <div
                      className={`inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${colors.btn}`}
                    >
                      Explore <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Citizen Ground Truth Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-card p-6 space-y-4">
            <h3 className="text-xl font-bold">📸 Citizen Ground-Truth</h3>
            <p className="text-[var(--muted)]">
              Community members upload geotagged photos of pollution,
              encroachment, or erosion. GPS-validated against satellite data for
              enforcement-grade evidence.
            </p>
            <div className="relative h-48 rounded-lg overflow-hidden">
              <Image
                src="/citizen_ground_truth.png"
                alt="Citizen Ground Truth Platform"
                fill
                className="object-cover"
              />
            </div>
          </div>
          <div className="glass-card p-6 space-y-4">
            <h3 className="text-xl font-bold">🛰️ Satellite Evidence</h3>
            <p className="text-[var(--muted)]">
              10-year comparison reveals the truth: river width shrinks from
              300m to 120m. Auto-generates enforcement-grade intelligence
              reports for DoE, NRCC, and courts.
            </p>
            <div className="relative h-48 rounded-lg overflow-hidden">
              <Image
                src="/polluted_river.png"
                alt="River Pollution from Satellite"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>

        {/* Stakeholders */}
        <div className="glass-card p-6 space-y-6">
          <h2 className="text-xl font-bold text-center">
            Who Needs This Solved?
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {stakeholders.map((s) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.name}
                  className="text-center p-4 bg-white/5 rounded-lg border border-[var(--border)]"
                >
                  <div className="w-12 h-12 mx-auto bg-teal-500/10 rounded-full flex items-center justify-center mb-2">
                    <Icon className="w-6 h-6 text-teal-500" />
                  </div>
                  <p className="font-semibold text-sm">{s.name}</p>
                  <p className="text-xs text-[var(--muted)] mt-1">{s.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Architecture Diagram */}
        <div className="glass-card p-6 space-y-4">
          <h2 className="text-xl font-bold text-center">System Architecture</h2>
          <p className="text-center text-[var(--muted)] max-w-2xl mx-auto">
            Production-grade microservice architecture processing 6 satellite
            datasets through Google Earth Engine, AI models, and PostGIS for
            real-time intelligence.
          </p>
          <div className="relative bg-[#0a0e1a] rounded-lg p-4 overflow-auto">
            <Image
              src="/architecture_diagram.svg"
              alt="NodiWatch System Architecture"
              width={1200}
              height={600}
              className="w-full"
            />
          </div>
        </div>

        {/* Tech Stack */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-bold mb-4">Technology Stack</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {techStack.map((tech) => {
              const Icon = tech.icon;
              return (
                <div
                  key={tech.name}
                  className="p-3 bg-white/5 rounded-lg border border-[var(--border)] text-center"
                >
                  <Icon className="w-5 h-5 mx-auto text-teal-500 mb-2" />
                  <p className="font-medium text-sm">{tech.name}</p>
                  <p className="text-xs text-[var(--muted)] mt-1">
                    {tech.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Data Sources */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-bold mb-4">
            Verified GEE Dataset Catalog
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              {
                name: "Sentinel-2 MSI SR",
                id: "COPERNICUS/S2_SR_HARMONIZED",
                res: "10m",
                use: "NDTI, MNDWI",
              },
              {
                name: "Sentinel-1 SAR GRD",
                id: "COPERNICUS/S1_GRD",
                res: "10m",
                use: "Erosion (cloud-free)",
              },
              {
                name: "JRC Surface Water",
                id: "JRC/GSW1_4/GlobalSurfaceWater",
                res: "30m",
                use: "1984–2021 history",
              },
              {
                name: "Landsat 9 SR",
                id: "LANDSAT/LC09/C02/T1_L2",
                res: "30m",
                use: "Long-term baseline",
              },
              {
                name: "OpenStreetMap",
                id: "Overpass API",
                res: "Vector",
                use: "Factory geolocation",
              },
            ].map((ds) => (
              <div
                key={ds.name}
                className="p-4 bg-white/5 rounded-lg border border-[var(--border)]"
              >
                <p className="font-medium text-sm">{ds.name}</p>
                <p className="text-xs text-teal-500 font-mono mt-1">{ds.res}</p>
                <p className="text-xs text-[var(--muted)] mt-2">{ds.use}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
