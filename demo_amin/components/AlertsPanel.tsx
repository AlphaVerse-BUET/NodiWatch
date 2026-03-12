import { Bell, AlertCircle, AlertTriangle, Info } from 'lucide-react'

const alerts = [
  {
    id: 1,
    type: 'critical',
    title: 'Critical Pollution Spike',
    location: 'Buriganga River, Hazaribagh',
    time: '2 hours ago',
    description: 'NDTI index increased by 45% near textile cluster',
  },
  {
    id: 2,
    type: 'warning',
    title: 'Encroachment Detected',
    location: 'Turag River, Ashulia',
    time: '5 hours ago',
    description: '1.2 hectares of river area filled in last 3 months',
  },
  {
    id: 3,
    type: 'high',
    title: 'Erosion Risk Elevated',
    location: 'Dhaleshwari River',
    time: '1 day ago',
    description: 'Bank retreat rate: 15m/year, displacement risk: 2,000 people',
  },
  {
    id: 4,
    type: 'info',
    title: 'Water Quality Improved',
    location: 'Meghna River, Narayanganj',
    time: '2 days ago',
    description: 'CDOM index decreased by 12% in monitored segment',
  },
]

export default function AlertsPanel() {
  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical':
        return <AlertCircle className="w-5 h-5 text-red-500" />
      case 'warning':
      case 'high':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />
      default:
        return <Info className="w-5 h-5 text-blue-500" />
    }
  }

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'critical':
        return 'border-l-red-500 bg-red-500/10'
      case 'warning':
      case 'high':
        return 'border-l-yellow-500 bg-yellow-500/10'
      default:
        return 'border-l-blue-500 bg-blue-500/10'
    }
  }

  return (
    <div className="bg-slate-800 rounded-xl shadow-2xl border border-slate-700">
      <div className="p-4 bg-slate-900 border-b border-slate-700">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Bell className="w-5 h-5 text-primary-500" />
          Real-Time Alerts
        </h2>
      </div>
      <div className="p-4 space-y-3 max-h-[600px] overflow-y-auto">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`p-4 rounded-lg border-l-4 ${getAlertColor(alert.type)} backdrop-blur-sm`}
          >
            <div className="flex items-start gap-3">
              {getAlertIcon(alert.type)}
              <div className="flex-1">
                <h3 className="font-semibold text-white text-sm">{alert.title}</h3>
                <p className="text-xs text-slate-400 mt-1">{alert.location}</p>
                <p className="text-xs text-slate-300 mt-2">{alert.description}</p>
                <p className="text-xs text-slate-500 mt-2">{alert.time}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
