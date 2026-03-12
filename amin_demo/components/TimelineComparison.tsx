import { Calendar, TrendingDown, ArrowRight } from 'lucide-react'

interface TimelineComparisonProps {
  river: string
}

const comparisonData = {
  buriganga: {
    width2016: '420m',
    width2026: '340m',
    areaLost: '8.2 hectares',
    encroachmentRate: '8m/year',
    pollutionIncrease: '+89%',
  },
}

export default function TimelineComparison({ river }: TimelineComparisonProps) {
  const data = comparisonData.buriganga

  return (
    <div className="bg-slate-800 rounded-xl shadow-2xl border border-slate-700">
      <div className="p-4 bg-slate-900 border-b border-slate-700">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary-500" />
          10-Year Temporal Analysis (2016 vs 2026)
        </h2>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-3 gap-4 mb-6">
          {/* 2016 Data */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <p className="text-xs text-blue-400 mb-2">2016 Baseline</p>
            <div className="space-y-2">
              <div>
                <p className="text-xs text-slate-400">River Width</p>
                <p className="text-2xl font-bold text-white">{data.width2016}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Water Quality</p>
                <p className="text-sm font-semibold text-green-400">Fair</p>
              </div>
            </div>
          </div>

          {/* Arrow */}
          <div className="flex items-center justify-center">
            <ArrowRight className="w-12 h-12 text-slate-600" />
          </div>

          {/* 2026 Data */}
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
            <p className="text-xs text-red-400 mb-2">2026 Current</p>
            <div className="space-y-2">
              <div>
                <p className="text-xs text-slate-400">River Width</p>
                <p className="text-2xl font-bold text-white">{data.width2026}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Water Quality</p>
                <p className="text-sm font-semibold text-red-400">Poor</p>
              </div>
            </div>
          </div>
        </div>

        {/* Impact Metrics */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-slate-700/30 rounded-lg p-3 border border-slate-600">
            <p className="text-xs text-slate-400 mb-1">Area Lost</p>
            <p className="text-xl font-bold text-yellow-400">{data.areaLost}</p>
          </div>
          <div className="bg-slate-700/30 rounded-lg p-3 border border-slate-600">
            <p className="text-xs text-slate-400 mb-1">Encroachment Rate</p>
            <p className="text-xl font-bold text-orange-400">{data.encroachmentRate}</p>
          </div>
          <div className="bg-slate-700/30 rounded-lg p-3 border border-slate-600">
            <p className="text-xs text-slate-400 mb-1">Pollution Increase</p>
            <p className="text-xl font-bold text-red-400">{data.pollutionIncrease}</p>
          </div>
        </div>

        {/* Satellite Imagery Comparison (Placeholder) */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
            <p className="text-xs text-slate-400 mb-2">Sentinel-2 (2016)</p>
            <div className="aspect-video bg-gradient-to-br from-blue-900 to-blue-700 rounded flex items-center justify-center">
              <p className="text-xs text-white/60">Historical Imagery</p>
            </div>
          </div>
          <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
            <p className="text-xs text-slate-400 mb-2">Sentinel-2 (2026)</p>
            <div className="aspect-video bg-gradient-to-br from-red-900 to-orange-700 rounded flex items-center justify-center">
              <p className="text-xs text-white/60">Current Imagery</p>
            </div>
          </div>
        </div>

        {/* Evidence Report */}
        <div className="mt-4 bg-primary-500/10 border border-primary-500/30 rounded-lg p-3">
          <p className="text-xs text-primary-300">
            <strong>Court-Ready Evidence:</strong> Temporal analysis shows {data.areaLost} of illegal encroachment 
            between 2016-2026. MNDWI water extraction confirms river narrowing. Evidence exported for 
            National River Conservation Commission (NRCC).
          </p>
        </div>
      </div>
    </div>
  )
}
