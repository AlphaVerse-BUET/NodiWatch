import { Factory, MapPin, TrendingUp } from 'lucide-react'

const attributions = [
  {
    id: 1,
    name: 'Apex Textile Mills Ltd.',
    type: 'Textile Dyeing',
    probability: 78,
    distance: '120m',
    coordinates: '23.7104°N, 90.4074°E',
  },
  {
    id: 2,
    name: 'Rahman Tannery Complex',
    type: 'Leather Processing',
    probability: 22,
    distance: '340m',
    coordinates: '23.7098°N, 90.4081°E',
  },
]

const spectralSignatures = [
  { name: 'NDTI (Turbidity)', value: 0.72, status: 'High' },
  { name: 'CDOM Index', value: 0.85, status: 'Critical' },
  { name: 'Red/Blue Ratio', value: 2.34, status: 'Textile Signature' },
  { name: 'Thermal Anomaly', value: '+3.2°C', status: 'Moderate' },
]

export default function FactoryAttribution() {
  return (
    <div className="bg-slate-800 rounded-xl shadow-2xl border border-slate-700">
      <div className="p-4 bg-slate-900 border-b border-slate-700">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Factory className="w-5 h-5 text-primary-500" />
          Pollution Source Attribution
        </h2>
      </div>
      <div className="p-4 space-y-4">
        {/* Selected Hotspot Info */}
        <div className="bg-slate-700/50 rounded-lg p-3 border border-slate-600">
          <p className="text-xs text-slate-400 mb-1">Selected Hotspot</p>
          <p className="text-sm font-semibold text-white">Hazaribagh Industrial Zone</p>
          <p className="text-xs text-slate-400 mt-1">Detected: March 9, 2026 10:30 AM</p>
        </div>

        {/* Spectral Signatures */}
        <div>
          <h3 className="text-sm font-semibold text-white mb-2">Spectral Analysis</h3>
          <div className="space-y-2">
            {spectralSignatures.map((sig) => (
              <div key={sig.name} className="bg-slate-700/30 rounded p-2 border border-slate-600">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-300">{sig.name}</span>
                  <span className="text-xs font-semibold text-primary-400">{sig.value}</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">{sig.status}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Factory Probabilities */}
        <div>
          <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary-500" />
            Bayesian Attribution (500m radius)
          </h3>
          <div className="space-y-3">
            {attributions.map((attr) => (
              <div key={attr.id} className="bg-slate-700/50 rounded-lg p-3 border border-slate-600">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-white">{attr.name}</h4>
                    <p className="text-xs text-slate-400">{attr.type}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-primary-400">{attr.probability}%</p>
                    <p className="text-xs text-slate-400">probability</p>
                  </div>
                </div>
                <div className="w-full bg-slate-600 rounded-full h-2 mb-2">
                  <div
                    className="bg-primary-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${attr.probability}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {attr.distance}
                  </span>
                  <span>{attr.coordinates}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Model Info */}
        <div className="bg-primary-500/10 border border-primary-500/30 rounded-lg p-3">
          <p className="text-xs text-primary-300">
            <strong>AI Classification:</strong> Random Forest Classifier detected textile dye signature 
            with 92% confidence. Bayesian model weighted by distance and spectral match.
          </p>
        </div>
      </div>
    </div>
  )
}
