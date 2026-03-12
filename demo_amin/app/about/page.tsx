'use client'

import Image from 'next/image'
import { Satellite, Brain, Database, Map, Users, Target, TrendingUp, Shield } from 'lucide-react'

export default function AboutPage() {
  const technologies = [
    {
      icon: <Satellite className="w-8 h-8" />,
      name: 'Google Earth Engine',
      description: 'Cloud-based platform processing petabyte-scale satellite imagery from Sentinel-2, Sentinel-1 SAR, and Landsat 8/9',
    },
    {
      icon: <Brain className="w-8 h-8" />,
      name: 'TensorFlow & Scikit-learn',
      description: 'Machine learning frameworks powering Random Forest classification and CNN-based water segmentation',
    },
    {
      icon: <Database className="w-8 h-8" />,
      name: 'PostGIS',
      description: 'Geospatial database for storing historical river boundaries, factory locations, and temporal analysis',
    },
    {
      icon: <Map className="w-8 h-8" />,
      name: 'OpenStreetMap API',
      description: 'Industry geolocation data for Bayesian probability modeling and factory attribution',
    },
  ]

  const impacts = [
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Dual Enforcement',
      description: 'Simultaneously detect polluters and land grabbers using a unified platform',
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: 'Historical Evidence',
      description: '10-year satellite comparison provides legal-grade proof for environmental courts',
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: 'Predictive Alerts',
      description: 'Probability scoring helps authorities inspect high-risk factories first',
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Erosion Early Warning',
      description: 'Protect ~1 million displaced people annually with real-time erosion intelligence',
    },
  ]

  const beneficiaries = [
    {
      name: 'Department of Environment (DoE)',
      role: 'Primary Beneficiary',
      description: 'Uses pollution heatmaps and factory attribution for targeted inspections and legal enforcement',
    },
    {
      name: 'National River Conservation Commission (NRCC)',
      role: 'Primary Beneficiary',
      description: 'Leverages encroachment evidence and historical data for riverbank restoration projects',
    },
    {
      name: 'Bangladesh Water Development Board (BWDB)',
      role: 'Primary Beneficiary',
      description: 'Utilizes erosion risk maps for flood prevention and infrastructure planning',
    },
    {
      name: 'Environmental Courts',
      role: 'Legal Partner',
      description: 'Receives admissible time-series satellite evidence for prosecution of polluters and land grabbers',
    },
    {
      name: 'Banks & Financial Institutions',
      role: 'Secondary Beneficiary',
      description: 'Automates Green Banking due diligence by checking loan applicants against pollution database',
    },
    {
      name: 'DDM & UNDP Bangladesh',
      role: 'Disaster Management',
      description: 'Uses erosion risk maps for preemptive evacuation and resettlement planning',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="mb-16 text-center">
          <h1 className="text-5xl font-bold text-white mb-6">About NodiWatch</h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            An AI-powered satellite surveillance system addressing Bangladesh&apos;s river ecosystem crisis 
            through advanced remote sensing and machine learning
          </p>
        </div>

        {/* Problem Statement */}
        <section className="mb-16">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-8">
            <h2 className="text-3xl font-bold text-white mb-6">The Triple-Blind Crisis</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-red-400 mb-3">1. Accountability Gap</h3>
                <p className="text-slate-300">
                  While pollution is visible, the specific source is often untraceable among clustered 
                  factories, preventing legal action. 60% of industrial pollution goes unprosecuted due 
                  to lack of definitive evidence.
                </p>
              </div>
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-yellow-400 mb-3">2. Silent Encroachment</h3>
                <p className="text-slate-300">
                  Illegal land filling (&quot;Nodi Dokhol&quot;) is slow and incremental, often undetected until 
                  river flow is permanently altered. Current manual inspections are reactive, dangerous, 
                  and lack temporal data for court evidence.
                </p>
              </div>
              <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-orange-400 mb-3">3. Vanishing Banks</h3>
                <p className="text-slate-300">
                  Riverbank erosion (&quot;Nodi Vangon&quot;) silently swallows ~10,000 hectares of land every year, 
                  displacing over 1 million people annually across ~94 upazilas. Climate change is 
                  accelerating erosion by 13% through 2050.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Solution */}
        <section className="mb-16">
          <div className="bg-gradient-to-r from-primary-500/20 to-blue-500/20 rounded-xl border border-primary-500/30 p-8">
            <h2 className="text-3xl font-bold text-white mb-6">Our Solution</h2>
            <p className="text-lg text-slate-200 mb-6">
              NodiWatch is an AI-powered satellite surveillance system that combines pollution fingerprinting, 
              river encroachment detection, and riverbank erosion monitoring. Using 10 years of Sentinel-2, 
              Sentinel-1 SAR, and Landsat imagery processed in Google Earth Engine, we provide:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <div className="bg-primary-500 rounded p-2 mt-1">
                  <div className="w-2 h-2 bg-white rounded-full" />
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-1">Pollution Hotspot Detection</h4>
                  <p className="text-sm text-slate-300">
                    Color-coded risk zones with AI classification of polluter type (textile, tannery, thermal)
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-primary-500 rounded p-2 mt-1">
                  <div className="w-2 h-2 bg-white rounded-full" />
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-1">Encroachment Detection</h4>
                  <p className="text-sm text-slate-300">
                    Historical water boundary comparison showing illegal land filling over 10 years
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-primary-500 rounded p-2 mt-1">
                  <div className="w-2 h-2 bg-white rounded-full" />
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-1">Erosion Prediction</h4>
                  <p className="text-sm text-slate-300">
                    SAR imagery and AI segmentation detect and predict riverbank erosion hotspots
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-primary-500 rounded p-2 mt-1">
                  <div className="w-2 h-2 bg-white rounded-full" />
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-1">Factory Attribution</h4>
                  <p className="text-sm text-slate-300">
                    Bayesian probability model assigns likelihood scores to nearby industries
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Technology Stack */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Technology Stack</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {technologies.map((tech, index) => (
              <div
                key={index}
                className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:border-primary-500 transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="bg-primary-500/20 p-3 rounded-lg text-primary-500">
                    {tech.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">{tech.name}</h3>
                    <p className="text-slate-400">{tech.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* AI Architecture */}
        <section className="mb-16">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-8">
            <h2 className="text-3xl font-bold text-white mb-6">AI Architecture</h2>
            <p className="text-slate-300 mb-8">
              NodiWatch deploys a three-layer AI approach to transform raw satellite data into actionable 
              environmental intelligence:
            </p>
            <div className="space-y-6">
              <div className="bg-slate-700/50 rounded-lg p-6 border-l-4 border-primary-500">
                <h3 className="text-xl font-semibold text-white mb-3">Layer 1: Image Segmentation CNN</h3>
                <p className="text-slate-300 mb-3">
                  Fine-tuned Segment Anything Model (SAM) identifies water pixels and tracks river boundary 
                  changes over time for both encroachment and erosion detection.
                </p>
                <div className="bg-slate-800 rounded p-3 text-sm">
                  <p className="text-slate-400">
                    <strong className="text-primary-400">Training:</strong> 10+ years of annotated Google Earth 
                    imagery (2003–2025) with labeled erosion events
                  </p>
                  <p className="text-slate-400 mt-1">
                    <strong className="text-primary-400">Accuracy:</strong> ~86% mean IoU on Bangladesh river systems
                  </p>
                </div>
              </div>

              <div className="bg-slate-700/50 rounded-lg p-6 border-l-4 border-yellow-500">
                <h3 className="text-xl font-semibold text-white mb-3">Layer 2: Random Forest Classifier</h3>
                <p className="text-slate-300 mb-3">
                  Learns spectral signatures from labeled samples where textile effluent shows high Red/Blue ratios, 
                  tanneries show high turbidity + organic signals, and thermal pollution shows temperature spikes.
                </p>
                <div className="bg-slate-800 rounded p-3 text-sm">
                  <p className="text-slate-400">
                    <strong className="text-yellow-400">Features:</strong> NDTI, CDOM, Red/Blue ratio, thermal bands (Landsat)
                  </p>
                  <p className="text-slate-400 mt-1">
                    <strong className="text-yellow-400">Accuracy:</strong> 92% overall classification accuracy
                  </p>
                </div>
              </div>

              <div className="bg-slate-700/50 rounded-lg p-6 border-l-4 border-orange-500">
                <h3 className="text-xl font-semibold text-white mb-3">Layer 3: Bayesian Attribution Model</h3>
                <p className="text-slate-300 mb-3">
                  Weighs distance + pollution pattern to rank nearby factories by likelihood of being the source. 
                  Queries OpenStreetMap for industries within 500m radius and assigns probability scores.
                </p>
                <div className="bg-slate-800 rounded p-3 text-sm">
                  <p className="text-slate-400">
                    <strong className="text-orange-400">Method:</strong> Distance-weighted Bayesian inference with industry priors
                  </p>
                  <p className="text-slate-400 mt-1">
                    <strong className="text-orange-400">Output:</strong> Ranked factory list with % probability (e.g., &quot;Textile Mill A: 78%&quot;)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Expected Impact */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Expected Impact</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {impacts.map((impact, index) => (
              <div
                key={index}
                className="bg-slate-800 border border-slate-700 rounded-xl p-6 text-center hover:border-primary-500 transition-all"
              >
                <div className="bg-primary-500/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-primary-500">
                  {impact.icon}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{impact.title}</h3>
                <p className="text-sm text-slate-400">{impact.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Beneficiaries */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Target Beneficiaries</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {beneficiaries.map((beneficiary, index) => (
              <div
                key={index}
                className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:border-primary-500 transition-all"
              >
                <div className="mb-3">
                  <span className="inline-block px-3 py-1 bg-primary-500/20 text-primary-400 text-xs font-semibold rounded-full mb-2">
                    {beneficiary.role}
                  </span>
                  <h3 className="text-lg font-semibold text-white">{beneficiary.name}</h3>
                </div>
                <p className="text-sm text-slate-400">{beneficiary.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Team */}
        <section className="mb-16">
          <div className="bg-gradient-to-r from-primary-500 to-primary-700 rounded-xl p-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Team Alpha Verse</h2>
            <p className="text-lg text-white/90 mb-6">
              Built for <strong>Eco-Tech Hackathon 2026</strong> by Environment Watch: BUET
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-white/80">
              <span className="px-4 py-2 bg-white/20 rounded-lg">Computer Science</span>
              <span className="px-4 py-2 bg-white/20 rounded-lg">Data Analytics</span>
              <span className="px-4 py-2 bg-white/20 rounded-lg">Environmental Engineering</span>
              <span className="px-4 py-2 bg-white/20 rounded-lg">Geospatial Analysis</span>
            </div>
            <p className="text-sm text-white/70 mt-6">
              Innovate for Green 🌊 🇧🇩
            </p>
          </div>
        </section>

        {/* Dashboard Preview */}
        <section>
          <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
            <div className="p-6 bg-slate-900 border-b border-slate-700">
              <h2 className="text-2xl font-bold text-white">Platform Preview</h2>
            </div>
            <div className="p-8">
              <Image
                src="/dashboard_mockup.png"
                alt="NodiWatch dashboard mockup"
                width={1200}
                height={675}
                className="rounded-lg border border-slate-600 shadow-2xl"
              />
              <p className="text-center text-slate-400 mt-4">
                NodiWatch Dashboard - Real-time river surveillance and analysis platform
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
