import { Layers } from 'lucide-react'

interface LayerControlProps {
  activeLayer: 'pollution' | 'encroachment' | 'erosion' | 'all'
  onChange: (layer: 'pollution' | 'encroachment' | 'erosion' | 'all') => void
}

export default function LayerControl({ activeLayer, onChange }: LayerControlProps) {
  const layers = [
    { id: 'all', label: 'All Layers', color: 'bg-primary-500' },
    { id: 'pollution', label: 'Pollution', color: 'bg-red-500' },
    { id: 'encroachment', label: 'Encroachment', color: 'bg-yellow-500' },
    { id: 'erosion', label: 'Erosion', color: 'bg-orange-500' },
  ] as const

  return (
    <div className="flex items-center gap-2">
      <Layers className="w-4 h-4 text-slate-400" />
      <div className="flex gap-1 bg-slate-700 rounded-lg p-1">
        {layers.map((layer) => (
          <button
            key={layer.id}
            onClick={() => onChange(layer.id)}
            className={`px-3 py-1 text-xs font-medium rounded transition-all ${
              activeLayer === layer.id
                ? `${layer.color} text-white shadow-lg`
                : 'text-slate-300 hover:bg-slate-600'
            }`}
          >
            {layer.label}
          </button>
        ))}
      </div>
    </div>
  )
}
