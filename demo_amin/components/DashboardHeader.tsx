import { Waves } from 'lucide-react'

export default function DashboardHeader() {
  return (
    <header className="bg-slate-900 border-b border-slate-700 shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary-500 p-2 rounded-lg">
              <Waves className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">NodiWatch</h1>
              <p className="text-sm text-slate-400">AI-Powered River Surveillance System</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs text-slate-400">Last Updated</p>
              <p className="text-sm font-semibold text-white">March 9, 2026</p>
            </div>
            <div className="h-10 w-10 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold">
              AV
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
