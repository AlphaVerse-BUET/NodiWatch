'use client'

import { FileText, Download, Calendar, MapPin, AlertTriangle, CheckCircle } from 'lucide-react'

export default function ReportsPage() {
  const reports = [
    {
      id: 1,
      title: 'Buriganga River Pollution Assessment - Q1 2026',
      date: 'March 1, 2026',
      type: 'Pollution',
      status: 'Complete',
      hotspots: 34,
      factories: 12,
    },
    {
      id: 2,
      title: 'Turag River Encroachment Evidence Report',
      date: 'February 28, 2026',
      type: 'Encroachment',
      status: 'Complete',
      area: '3.2 hectares',
      zones: 8,
    },
    {
      id: 3,
      title: 'Dhaleshwari Erosion Risk Assessment',
      date: 'February 25, 2026',
      type: 'Erosion',
      status: 'Complete',
      risk: 'High',
      affected: '2,500 people',
    },
    {
      id: 4,
      title: 'Shitalakshya River Multi-Threat Analysis',
      date: 'February 20, 2026',
      type: 'Combined',
      status: 'In Progress',
      completion: '75%',
    },
  ]

  const evidencePackages = [
    {
      title: 'Legal Evidence Package - Hazaribagh Cluster',
      description: 'Court-ready evidence package including 10-year satellite imagery comparison, spectral analysis, and factory attribution',
      files: ['Satellite_Comparison.pdf', 'Spectral_Analysis.pdf', 'Factory_Attribution.pdf', 'Timeline_Evidence.pdf'],
      date: 'March 5, 2026',
    },
    {
      title: 'DoE Inspection Priority List - March 2026',
      description: 'Ranked list of 50 high-probability pollution sources based on Bayesian attribution model',
      files: ['Priority_Factories.xlsx', 'Heatmap_Data.geojson', 'Satellite_Images.zip'],
      date: 'March 1, 2026',
    },
    {
      title: 'NRCC Encroachment Evidence - Buriganga',
      description: 'Historical river boundary comparison showing 8.2 hectares of illegal land filling with coordinates',
      files: ['Boundary_Comparison.pdf', 'Encroachment_Areas.shp', 'Evidence_Photos.zip'],
      date: 'February 28, 2026',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Evidence Reports</h1>
          <p className="text-slate-400">Generated reports and court-ready evidence packages</p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <FileText className="w-8 h-8 text-primary-500" />
              <span className="text-2xl font-bold text-white">47</span>
            </div>
            <p className="text-sm text-slate-400">Total Reports Generated</p>
          </div>
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <AlertTriangle className="w-8 h-8 text-red-500" />
              <span className="text-2xl font-bold text-white">127</span>
            </div>
            <p className="text-sm text-slate-400">Hotspots Documented</p>
          </div>
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="w-8 h-8 text-green-500" />
              <span className="text-2xl font-bold text-white">23</span>
            </div>
            <p className="text-sm text-slate-400">Evidence Packages Sent</p>
          </div>
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <Download className="w-8 h-8 text-blue-500" />
              <span className="text-2xl font-bold text-white">156</span>
            </div>
            <p className="text-sm text-slate-400">Total Downloads</p>
          </div>
        </div>

        {/* Recent Reports */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Recent Reports</h2>
          <div className="space-y-4">
            {reports.map((report) => (
              <div
                key={report.id}
                className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:border-primary-500 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-2">{report.title}</h3>
                    <div className="flex flex-wrap gap-4 text-sm text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {report.date}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        report.type === 'Pollution' ? 'bg-red-500/20 text-red-400' :
                        report.type === 'Encroachment' ? 'bg-yellow-500/20 text-yellow-400' :
                        report.type === 'Erosion' ? 'bg-orange-500/20 text-orange-400' :
                        'bg-blue-500/20 text-blue-400'
                      }`}>
                        {report.type}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        report.status === 'Complete' ? 'bg-green-500/20 text-green-400' :
                        'bg-blue-500/20 text-blue-400'
                      }`}>
                        {report.status}
                      </span>
                    </div>
                  </div>
                  <button className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg transition-all">
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-slate-700">
                  {report.hotspots && (
                    <div>
                      <p className="text-xs text-slate-400">Hotspots</p>
                      <p className="text-lg font-semibold text-white">{report.hotspots}</p>
                    </div>
                  )}
                  {report.factories && (
                    <div>
                      <p className="text-xs text-slate-400">Factories Identified</p>
                      <p className="text-lg font-semibold text-white">{report.factories}</p>
                    </div>
                  )}
                  {report.area && (
                    <div>
                      <p className="text-xs text-slate-400">Area Lost</p>
                      <p className="text-lg font-semibold text-white">{report.area}</p>
                    </div>
                  )}
                  {report.zones && (
                    <div>
                      <p className="text-xs text-slate-400">Encroachment Zones</p>
                      <p className="text-lg font-semibold text-white">{report.zones}</p>
                    </div>
                  )}
                  {report.risk && (
                    <div>
                      <p className="text-xs text-slate-400">Risk Level</p>
                      <p className="text-lg font-semibold text-orange-400">{report.risk}</p>
                    </div>
                  )}
                  {report.affected && (
                    <div>
                      <p className="text-xs text-slate-400">People Affected</p>
                      <p className="text-lg font-semibold text-white">{report.affected}</p>
                    </div>
                  )}
                  {report.completion && (
                    <div>
                      <p className="text-xs text-slate-400">Completion</p>
                      <p className="text-lg font-semibold text-blue-400">{report.completion}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Evidence Packages */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-6">Court-Ready Evidence Packages</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {evidencePackages.map((pkg, index) => (
              <div
                key={index}
                className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:border-primary-500 transition-all"
              >
                <div className="flex items-start gap-3 mb-4">
                  <div className="bg-primary-500/20 p-3 rounded-lg">
                    <FileText className="w-6 h-6 text-primary-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white mb-2">{pkg.title}</h3>
                    <p className="text-sm text-slate-400 mb-3">{pkg.description}</p>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {pkg.date}
                    </p>
                  </div>
                </div>
                <div className="border-t border-slate-700 pt-4">
                  <p className="text-xs font-semibold text-slate-400 mb-2">Included Files ({pkg.files.length})</p>
                  <div className="space-y-1">
                    {pkg.files.map((file, idx) => (
                      <div key={idx} className="text-xs text-slate-500 flex items-center gap-2">
                        <div className="w-1 h-1 bg-primary-500 rounded-full" />
                        {file}
                      </div>
                    ))}
                  </div>
                  <button className="w-full mt-4 flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg transition-all text-sm">
                    <Download className="w-4 h-4" />
                    Download Package
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Export Options */}
        <section className="mt-12">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Generate Custom Report</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-white mb-2">Report Type</label>
                <select className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white">
                  <option>Pollution Assessment</option>
                  <option>Encroachment Evidence</option>
                  <option>Erosion Risk Analysis</option>
                  <option>Combined Multi-Threat</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-white mb-2">River System</label>
                <select className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white">
                  <option>Buriganga</option>
                  <option>Turag</option>
                  <option>Dhaleshwari</option>
                  <option>Shitalakshya</option>
                  <option>Meghna</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-white mb-2">Date Range</label>
                <select className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white">
                  <option>Last 30 Days</option>
                  <option>Last 90 Days</option>
                  <option>Last 6 Months</option>
                  <option>Last Year</option>
                  <option>2016-2026 (Full)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-white mb-2">Format</label>
                <select className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white">
                  <option>PDF Report</option>
                  <option>Excel Spreadsheet</option>
                  <option>GeoJSON Data</option>
                  <option>Complete Package (ZIP)</option>
                </select>
              </div>
            </div>
            <button className="mt-6 flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold transition-all">
              <FileText className="w-5 h-5" />
              Generate Report
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}
