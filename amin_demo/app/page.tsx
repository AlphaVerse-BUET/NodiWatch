'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Satellite, Brain, TrendingUp, Shield, MapPin, AlertTriangle } from 'lucide-react'

export default function Home() {
  const features = [
    {
      icon: <Satellite className="w-8 h-8" />,
      title: 'Satellite Surveillance',
      description: '10 years of Sentinel-2, Sentinel-1 SAR, and Landsat imagery processed in the cloud',
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: 'AI-Powered Analysis',
      description: 'Random Forest classification and CNN segmentation for precise pollution detection',
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: 'Temporal Analysis',
      description: 'Compare 10-year historical data to detect river encroachment and erosion trends',
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Court-Ready Evidence',
      description: 'Generate legal-grade proof with time-series satellite evidence for environmental courts',
    },
    {
      icon: <MapPin className="w-8 h-8" />,
      title: 'Factory Attribution',
      description: 'Bayesian probability model assigns likelihood scores to nearby industrial polluters',
    },
    {
      icon: <AlertTriangle className="w-8 h-8" />,
      title: 'Real-Time Alerts',
      description: 'Automated notifications for pollution spikes, encroachment, and erosion risks',
    },
  ]

  const stats = [
    { value: '127', label: 'Pollution Hotspots Detected' },
    { value: '8.2', label: 'Hectares of River Lost' },
    { value: '89', label: 'Erosion Risk Areas' },
    { value: '1M+', label: 'People Protected Annually' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-blue-500/20 opacity-30" />
        <div className="container mx-auto px-4 py-20 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Protect Bangladesh&apos;s Rivers with
                <span className="text-primary-500"> AI-Powered</span> Surveillance
              </h1>
              <p className="text-xl text-slate-300 mb-8">
                NodiWatch combines satellite imagery, machine learning, and real-time monitoring 
                to detect pollution, illegal encroachment, and riverbank erosion across Bangladesh.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-8 py-4 rounded-lg font-semibold transition-all shadow-lg hover:shadow-primary-500/50"
                >
                  View Dashboard
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-8 py-4 rounded-lg font-semibold transition-all"
                >
                  Learn More
                </Link>
              </div>
            </div>
            <div className="relative">
              <Image
                src="/polluted_river.png"
                alt="Polluted river in Bangladesh"
                width={600}
                height={400}
                className="rounded-xl shadow-2xl border border-slate-700"
              />
              <div className="absolute -bottom-6 -left-6 bg-red-500 text-white px-6 py-3 rounded-lg shadow-xl">
                <p className="text-sm font-semibold">60% of rivers polluted by industrial waste</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-slate-800/50 backdrop-blur-sm py-12 border-y border-slate-700">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-4xl font-bold text-primary-500 mb-2">{stat.value}</p>
                <p className="text-sm text-slate-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">The Triple-Blind Crisis</h2>
            <p className="text-xl text-slate-300">
              Bangladesh&apos;s river ecosystem faces three interconnected threats that traditional 
              monitoring cannot adequately address.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-800 border border-red-500/30 rounded-xl p-6 hover:border-red-500 transition-all">
              <div className="bg-red-500/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <AlertTriangle className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Accountability Gap</h3>
              <p className="text-slate-400">
                While pollution is visible, the specific source is untraceable among clustered 
                factories, preventing legal action.
              </p>
            </div>
            <div className="bg-slate-800 border border-yellow-500/30 rounded-xl p-6 hover:border-yellow-500 transition-all">
              <div className="bg-yellow-500/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6 text-yellow-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Silent Encroachment</h3>
              <p className="text-slate-400">
                Illegal land filling is slow and incremental, often undetected until river 
                flow is permanently altered.
              </p>
            </div>
            <div className="bg-slate-800 border border-orange-500/30 rounded-xl p-6 hover:border-orange-500 transition-all">
              <div className="bg-orange-500/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Vanishing Banks</h3>
              <p className="text-slate-400">
                Riverbank erosion swallows ~10,000 hectares annually, displacing over 1 million 
                people across 94 upazilas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-slate-800/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">How NodiWatch Works</h2>
            <p className="text-xl text-slate-300">
              Combining cutting-edge AI with satellite surveillance to protect river ecosystems
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:border-primary-500 transition-all group"
              >
                <div className="bg-primary-500/20 w-16 h-16 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary-500/30 transition-all text-primary-500">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-slate-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-primary-500 to-primary-700 rounded-2xl p-12 text-center">
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Explore the Platform?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Access real-time river monitoring, pollution detection, and comprehensive 
              analysis tools to protect Bangladesh&apos;s water resources.
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold hover:bg-slate-100 transition-all shadow-xl"
            >
              Launch Dashboard
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
