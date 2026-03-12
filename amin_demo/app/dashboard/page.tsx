'use client'

import { useState } from 'react'
import { AlertTriangle, Droplet, TrendingDown, Map, BarChart3 } from 'lucide-react'
import StatsCard from '@/components/StatsCard'
import RiverMap from '@/components/RiverMap'
import PollutionChart from '@/components/PollutionChart'
import AlertsPanel from '@/components/AlertsPanel'
import FactoryAttribution from '@/components/FactoryAttribution'
import TimelineComparison from '@/components/TimelineComparison'
import LayerControl from '@/components/LayerControl'

export default function DashboardPage() {
  const [activeLayer, setActiveLayer] = useState<'pollution' | 'encroachment' | 'erosion' | 'all'>('all')
  const [selectedRiver, setSelectedRiver] = useState<string>('buriganga')

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">River Surveillance Dashboard</h1>
          <p className="text-slate-400">Real-time monitoring of Bangladesh&apos;s river ecosystems</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatsCard
            icon={<AlertTriangle className="w-6 h-6" />}
            title="Pollution Hotspots"
            value="127"
            change="+12%"
            color="red"
          />
          <StatsCard
            icon={<Map className="w-6 h-6" />}
            title="Encroachment Zones"
            value="43"
            change="+8%"
            color="yellow"
          />
          <StatsCard
            icon={<TrendingDown className="w-6 h-6" />}
            title="Erosion Risk Areas"
            value="89"
            change="+15%"
            color="orange"
          />
          <StatsCard
            icon={<Droplet className="w-6 h-6" />}
            title="Water Quality Index"
            value="34/100"
            change="-5%"
            color="blue"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map Section - Takes 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-800 rounded-xl shadow-2xl overflow-hidden border border-slate-700">
              <div className="p-4 bg-slate-900 border-b border-slate-700 flex items-center justify-between">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Map className="w-5 h-5 text-primary-500" />
                  Tri-Layer Surveillance Map
                </h2>
                <LayerControl activeLayer={activeLayer} onChange={setActiveLayer} />
              </div>
              <div className="h-[500px]">
                <RiverMap activeLayer={activeLayer} selectedRiver={selectedRiver} />
              </div>
            </div>

            {/* Timeline Comparison */}
            <TimelineComparison river={selectedRiver} />

            {/* Pollution Trends Chart */}
            <div className="bg-slate-800 rounded-xl shadow-2xl p-6 border border-slate-700">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary-500" />
                Pollution Trends (2016-2026)
              </h2>
              <PollutionChart />
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Alerts Panel */}
            <AlertsPanel />

            {/* Factory Attribution */}
            <FactoryAttribution />
          </div>
        </div>
      </div>
    </div>
  )
}
