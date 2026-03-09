"use client";

import Image from "next/image";
import {
  Users,
  Target,
  Award,
  Github,
  Mail,
  ExternalLink,
  Satellite,
  Brain,
  Globe,
  Building2,
  Scale,
  Shield,
  Wallet,
  AlertCircle,
  Leaf,
} from "lucide-react";

// Stakeholder data from context
const stakeholders = [
  {
    category: "Government Agencies",
    icon: Building2,
    color: "teal",
    orgs: [
      { name: "DoE", desc: "Automated pollution tracking & industrial cluster profiling" },
      { name: "NRCC", desc: "Monitor 1,400+ rivers for encroachment" },
      { name: "BWDB", desc: "Erosion early warning & embankment planning" },
      { name: "DDM", desc: "Evacuation & disaster response coordination" },
    ]
  },
  {
    category: "Financial & Legal",
    icon: Scale,
    color: "blue",
    orgs: [
      { name: "Banks", desc: "Automated 'Green Banking' due diligence per Bangladesh Bank mandate" },
      { name: "Environmental Courts", desc: "Time-series satellite intelligence for targeted prosecution" },
    ]
  },
  {
    category: "International Partners",
    icon: Globe,
    color: "purple",
    orgs: [
      { name: "World Bank", desc: "ESG compliance data for funded projects" },
      { name: "UNDP Bangladesh", desc: "Erosion risk maps for resettlement planning" },
      { name: "ADB", desc: "Environmental infrastructure monitoring" },
      { name: "Global RMG Buyers", desc: "Supply chain environmental due diligence" },
    ]
  },
];

const impacts = [
  { icon: Shield, title: "Triple Enforcement", desc: "One platform addresses pollution, encroachment AND erosion — three crises, one intelligent system." },
  { icon: Scale, title: "Legal Evidence", desc: "10-year comparison provides court-admissible proof of river narrowing and pollution sources." },
  { icon: AlertCircle, title: "Early Warning", desc: "Erosion risk maps alert authorities before ~10,000 hectares are lost annually." },
  { icon: Leaf, title: "Climate Resilience", desc: "Erosion projected to increase 13% by 2050 — NodiWatch provides real-time adaptation infrastructure." },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <p className="text-sm text-teal-500 font-medium uppercase tracking-wide mb-2">
            🛰️ Eco-Tech Hackathon 2026 • Environment Watch: BUET
          </p>
          <h1 className="text-4xl font-bold mb-4">
            <span className="gradient-text">NodiWatch</span>
          </h1>
          <p className="text-xl text-[var(--muted)] mb-6 max-w-2xl mx-auto">
            AI-Powered Satellite Surveillance for Bangladesh&apos;s River Ecosystems —
            Monitoring <span className="text-red-400">Pollution (নদী দূষণ)</span>,{" "}
            <span className="text-yellow-400">Encroachment (নদী দখল)</span>, and{" "}
            <span className="text-blue-400">Erosion (নদী ভাঙন)</span>
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <span className="badge badge-teal">Team AlphaVerse</span>
            <span className="badge badge-blue">Phase 2 Finalist</span>
            <span className="badge badge-purple">Top 30%</span>
          </div>
        </div>

        {/* Mission Section */}
        <div className="glass-card p-8 mb-8">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <Target className="w-12 h-12 text-[var(--primary)] flex-shrink-0" />
            <div>
              <h2 className="text-2xl font-bold mb-4">The Triple-Blind Crisis</h2>
              <p className="text-[var(--muted)] leading-relaxed mb-4">
                Bangladesh&apos;s rivers face three interconnected crises that current monitoring systems cannot address:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <h3 className="font-bold text-red-400 mb-2">The Accountability Gap</h3>
                  <p className="text-sm text-[var(--muted)]">
                    Among 2,500+ factories, pinpointing the exact pollution source is impossible without spectral evidence.
                  </p>
                </div>
                <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                  <h3 className="font-bold text-yellow-400 mb-2">Silent Encroachment</h3>
                  <p className="text-sm text-[var(--muted)]">
                    40% of Dhaka&apos;s riverbanks seized through slow, incremental land filling — undetected until permanent.
                  </p>
                </div>
                <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <h3 className="font-bold text-blue-400 mb-2">Vanishing Banks</h3>
                  <p className="text-sm text-[var(--muted)]">
                    ~10,000 hectares lost yearly, displacing 1M+ people, costing $500M annually — impossible to field-survey.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stakeholders Section */}
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
          <Users className="text-teal-500" />
          Who Needs This Solved?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {stakeholders.map((group) => {
            const Icon = group.icon;
            return (
              <div key={group.category} className="glass-card p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Icon className={`w-6 h-6 text-${group.color}-500`} />
                  <h3 className="font-bold">{group.category}</h3>
                </div>
                <div className="space-y-3">
                  {group.orgs.map((org) => (
                    <div key={org.name} className="p-3 bg-white/5 rounded-lg">
                      <p className="font-medium text-sm">{org.name}</p>
                      <p className="text-xs text-[var(--muted)] mt-1">{org.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Impact Section */}
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
          <Award className="text-yellow-500" />
          Environmental & Social Impact
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {impacts.map((impact) => {
            const Icon = impact.icon;
            return (
              <div key={impact.title} className="glass-card p-5 text-center">
                <Icon className="w-8 h-8 text-teal-500 mx-auto mb-3" />
                <h3 className="font-bold text-sm mb-2">{impact.title}</h3>
                <p className="text-xs text-[var(--muted)]">{impact.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Business Model */}
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
          <Wallet className="text-purple-500" />
          Business Model
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="glass-card p-6 border-teal-500/20">
            <span className="badge badge-teal mb-4">FREE TIER — Open Access</span>
            <p className="text-sm text-[var(--muted)] mb-4">Available to all — no cost, no login:</p>
            <ul className="text-sm space-y-2">
              <li>• Basic river health heatmap (public dashboard)</li>
              <li>• Monthly pollution severity snapshots per river</li>
              <li>• Citizen ground-truth photo submission</li>
              <li>• Open API for NGO researchers (rate limited)</li>
              <li>• Community alert subscription (SMS/email)</li>
            </ul>
          </div>
          <div className="glass-card p-6 border-purple-500/20">
            <span className="badge badge-purple mb-4">PAID TIER — Premium Intelligence</span>
            <p className="text-sm text-[var(--muted)] mb-4">For government, banks, international orgs:</p>
            <ul className="text-sm space-y-2">
              <li>• Real-time tri-layer heatmaps with attribution</li>
              <li>• Unlimited intelligence report generation</li>
              <li>• Erosion risk corridors & embankment advisories</li>
              <li>• Green Banking API integration (per-query)</li>
              <li>• Historical data access (full 10-year archive)</li>
            </ul>
          </div>
        </div>

        {/* Tech Stack */}
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
          <Brain className="text-purple-500" />
          Technology Stack
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="glass-card p-6 text-center">
            <Satellite className="w-10 h-10 text-blue-400 mx-auto mb-4" />
            <h3 className="font-bold mb-2">Satellite Data</h3>
            <p className="text-sm text-[var(--muted)]">
              Sentinel-2 optical (10m), Sentinel-1 SAR (10m), Landsat 8/9 (30m),
              JRC Global Surface Water (1984–2021)
            </p>
          </div>
          <div className="glass-card p-6 text-center">
            <Brain className="w-10 h-10 text-purple-400 mx-auto mb-4" />
            <h3 className="font-bold mb-2">AI/ML Models</h3>
            <p className="text-sm text-[var(--muted)]">
              CNN for water segmentation (~86% IoU), Random Forest for pollution classification,
              Bayesian attribution, SVM/ANN erosion prediction
            </p>
          </div>
          <div className="glass-card p-6 text-center">
            <Globe className="w-10 h-10 text-green-400 mx-auto mb-4" />
            <h3 className="font-bold mb-2">Platform</h3>
            <p className="text-sm text-[var(--muted)]">
              Google Earth Engine cloud processing, PostGIS database, 
              React/Next.js dashboard, REST API for integrations
            </p>
          </div>
        </div>

        {/* Architecture Preview */}
        <div className="glass-card p-6 mb-12">
          <h3 className="font-bold mb-4 text-center">System Architecture</h3>
          <div className="bg-[#0a0e1a] rounded-lg p-4">
            <Image 
              src="/architecture_diagram.svg" 
              alt="NodiWatch System Architecture"
              width={1200}
              height={600}
              className="w-full"
            />
          </div>
        </div>

        {/* Team Section */}
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
          <Users className="text-[var(--primary)]" />
          Team AlphaVerse
        </h2>
        <div className="glass-card p-6 mb-12">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {[
              { initials: "AR", name: "Arifuzzaman Rakin", role: "Team Lead", skills: "GEE & Remote Sensing" },
              { initials: "TM", name: "Team Member", role: "ML Engineer", skills: "Computer Vision" },
              { initials: "TM", name: "Team Member", role: "Backend Dev", skills: "Python & APIs" },
              { initials: "TM", name: "Team Member", role: "Frontend Dev", skills: "Next.js & UI" },
              { initials: "TM", name: "Team Member", role: "Research", skills: "Environmental Science" },
            ].map((member, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-teal-500 to-blue-500 mx-auto mb-3 flex items-center justify-center text-xl font-bold">
                  {member.initials}
                </div>
                <h3 className="font-bold text-sm">{member.name}</h3>
                <p className="text-xs text-teal-500">{member.role}</p>
                <p className="text-xs text-[var(--muted)]">{member.skills}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Links */}
        <div className="glass-card p-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="font-bold mb-1">Get Involved</h3>
            <p className="text-sm text-[var(--muted)]">
              Interested in collaboration, data access, or contributing?
            </p>
          </div>
          <div className="flex gap-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 glass-card hover:bg-white/10 transition-colors flex items-center gap-2"
            >
              <Github className="w-5 h-5" />
              GitHub
            </a>
            <a
              href="mailto:team@nodiwatch.org"
              className="px-4 py-2 glass-card hover:bg-white/10 transition-colors flex items-center gap-2"
            >
              <Mail className="w-5 h-5" />
              Contact
            </a>
            <a
              href="https://earthengine.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 glass-card hover:bg-white/10 transition-colors flex items-center gap-2"
            >
              <ExternalLink className="w-5 h-5" />
              GEE Repository
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-sm text-[var(--muted)]">
          <p>© 2024 NodiWatch • Eco-Tech Hackathon 2026 Submission</p>
          <p className="mt-1">
            Built with Next.js, React-Leaflet, and Google Earth Engine
          </p>
        </div>
      </div>
    </div>
  );
}
