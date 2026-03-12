import { ReactNode } from 'react'

interface StatsCardProps {
  icon: ReactNode
  title: string
  value: string
  change: string
  color: 'red' | 'yellow' | 'orange' | 'blue'
}

const colorClasses = {
  red: 'bg-red-500/20 text-red-400 border-red-500/30',
  yellow: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  orange: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  blue: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
}

export default function StatsCard({ icon, title, value, change, color }: StatsCardProps) {
  const isPositive = change.startsWith('+')
  
  return (
    <div className={`${colorClasses[color]} border rounded-xl p-5 backdrop-blur-sm`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm opacity-80 mb-1">{title}</p>
          <p className="text-3xl font-bold mb-2">{value}</p>
          <p className={`text-xs font-semibold ${isPositive ? 'text-red-400' : 'text-green-400'}`}>
            {change} from last month
          </p>
        </div>
        <div className="opacity-80">
          {icon}
        </div>
      </div>
    </div>
  )
}
