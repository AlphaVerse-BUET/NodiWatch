'use client'

import Image from 'next/image'
import { TrendingDown, MapPin, AlertTriangle, Calendar, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function AnalysisPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Comprehensive River Analysis</h1>
          <p className="text-slate-400">Detailed satellite-based analysis and temporal comparisons</p>
        </div>

        {/* Temporal Analysis Section */}
        <section className="mb-12">
          <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
            <div className="p-6 bg-slate-900 border-b border-slate-700">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Calendar className="w-6 h-6 text-primary-500" />
                10-Year Temporal Analysis (2016-2026)
              </h2>
            </div>
            <div className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">Encroachment Detection</h3>
                  <Image
                    src="/encroachment_comparison.png"
                    alt="River encroachment comparison 2016 vs 2026"
                    width={600}
                    height={400}
                    className="rounded-lg border border-slate-600 shadow-xl mb-4"
                  />
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                    <h4 className="font-semibold text-yellow-400 mb-2">Key Findings</h4>
                    <ul className="text-sm text-slate-300 space-y-2">
                      <li>• 8.2 hectares of river area lost to illegal filling</li>
                      <li>• Average encroachment rate: 8m per year</li>
                      <li>• 43 active encroachment zones identified</li>
                      <li>• River width reduced from 420m to 340m</li>
                    </ul>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">Erosion Monitoring</h3>
                  <Image
                    src="/erosion_comparison.png"
                    alt="Riverbank erosion comparison using SAR imagery"
                    width={600}
                    height={400}
                    className="rounded-lg border border-slate-600 shadow-xl mb-4"
                  />
                  <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
                    <h4 className="font-semibold text-orange-400 mb-2">Key Findings</h4>
                    <ul className="text-sm text-slate-300 space-y-2">
                      <li>• 89 high-risk erosion zones detected</li>
                      <li>• Average erosion rate: 12-18m per year</li>
                      <li>• 1M+ people at displacement risk annually</li>
                      <li>• $500M economic loss from erosion</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-slate-700/30 rounded-lg p-6 border border-slate-600">
                <h4 className="font-semibold text-white mb-3">Technical Methodology</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-300">
                  <div>
                    <p className="font-semibold text-primary-400 mb-2">Water Segmentation</p>
                    <p>Modified Normalized Difference Water Index (MNDWI) applied to Sentinel-2 imagery with 10m spatial resolution</p>
                  </div>
                  <div>
                    <p className="font-semibold text-primary-400 mb-2">Cloud Filtering</p>
                    <p>QA60 quality band filtering excludes images with &gt;20% cloud cover for pristine optical data</p>
                  </div>
                  <div>
                    <p className="font-semibold text-primary-400 mb-2">Temporal Differencing</p>
                    <p>Binary water masks from 2016 and 2026 are subtracted to quantify spatial changes</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pollution Analysis */}
        <section className="mb-12">
          <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
            <div className="p-6 bg-slate-900 border-b border-slate-700">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <AlertTriangle className="w-6 h-6 text-red-500" />
                Pollution Fingerprinting Analysis
              </h2>
            </div>
            <div className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">Spectral Signature Detection</h3>
                  <div className="space-y-4">
                    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                      <h4 className="font-semibold text-red-400 mb-2">Textile Dye Detection</h4>
                      <p className="text-sm text-slate-300 mb-3">
                        High Red/Blue ratio (&gt;2.0) indicates synthetic textile dyes. 78 hotspots identified near Hazaribagh industrial zone.
                      </p>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-slate-800 p-2 rounded">
                          <p className="text-slate-400">Red/Blue Ratio</p>
                          <p className="text-white font-semibold">2.34</p>
                        </div>
                        <div className="bg-slate-800 p-2 rounded">
                          <p className="text-slate-400">Confidence</p>
                          <p className="text-white font-semibold">92%</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                      <h4 className="font-semibold text-yellow-400 mb-2">Tannery Waste Detection</h4>
                      <p className="text-sm text-slate-300 mb-3">
                        NDTI (turbidity) &gt;0.7 + high CDOM index indicates organic tannery waste. 34 hotspots detected.
                      </p>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-slate-800 p-2 rounded">
                          <p className="text-slate-400">NDTI Index</p>
                          <p className="text-white font-semibold">0.72</p>
                        </div>
                        <div className="bg-slate-800 p-2 rounded">
                          <p className="text-slate-400">CDOM Index</p>
                          <p className="text-white font-semibold">0.85</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                      <h4 className="font-semibold text-purple-400 mb-2">Thermal Discharge</h4>
                      <p className="text-sm text-slate-300 mb-3">
                        Landsat TIRS bands detect +3-5°C temperature anomalies near power plants. 15 hotspots identified.
                      </p>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-slate-800 p-2 rounded">
                          <p className="text-slate-400">Thermal Anomaly</p>
                          <p className="text-white font-semibold">+3.2°C</p>
                        </div>
                        <div className="bg-slate-800 p-2 rounded">
                          <p className="text-slate-400">Confidence</p>
                          <p className="text-white font-semibold">86%</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">AI Model Performance</h3>
                  <div className="bg-slate-700/30 rounded-lg p-6 border border-slate-600 mb-4">
                    <h4 className="font-semibold text-white mb-4">Random Forest Classifier</h4>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-slate-400">Overall Accuracy</span>
                          <span className="text-primary-400 font-semibold">92%</span>
                        </div>
                        <div className="w-full bg-slate-600 rounded-full h-2">
                          <div className="bg-primary-500 h-2 rounded-full" style={{ width: '92%' }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-slate-400">Textile Detection</span>
                          <span className="text-red-400 font-semibold">94%</span>
                        </div>
                        <div className="w-full bg-slate-600 rounded-full h-2">
                          <div className="bg-red-500 h-2 rounded-full" style={{ width: '94%' }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-slate-400">Tannery Detection</span>
                          <span className="text-yellow-400 font-semibold">89%</span>
                        </div>
                        <div className="w-full bg-slate-600 rounded-full h-2">
                          <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '89%' }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-slate-400">Thermal Detection</span>
                          <span className="text-purple-400 font-semibold">86%</span>
                        </div>
                        <div className="w-full bg-slate-600 rounded-full h-2">
                          <div className="bg-purple-500 h-2 rounded-full" style={{ width: '86%' }} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-700/30 rounded-lg p-6 border border-slate-600">
                    <h4 className="font-semibold text-white mb-4">CNN Water Segmentation</h4>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-slate-400">Mean IoU Accuracy</span>
                          <span className="text-primary-400 font-semibold">86%</span>
                        </div>
                        <div className="w-full bg-slate-600 rounded-full h-2">
                          <div className="bg-primary-500 h-2 rounded-full" style={{ width: '86%' }} />
                        </div>
                      </div>
                      <p className="text-xs text-slate-400 mt-3">
                        Trained on 10+ years of annotated Google Earth imagery covering Bangladesh river systems
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Citizen Validation */}
        <section className="mb-12">
          <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
            <div className="p-6 bg-slate-900 border-b border-slate-700">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <MapPin className="w-6 h-6 text-blue-500" />
                Ground Truth Validation
              </h2>
            </div>
            <div className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div>
                  <Image
                    src="/citizen_ground_truth.png"
                    alt="Citizen photo validation for ground truth"
                    width={600}
                    height={400}
                    className="rounded-lg border border-slate-600 shadow-xl"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">Citizen Science Integration</h3>
                  <p className="text-slate-300 mb-4">
                    NodiWatch incorporates a citizen photo validation system to verify satellite 
                    detections with ground-level evidence, improving model accuracy and providing 
                    additional legal documentation.
                  </p>
                  <div className="space-y-3">
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-400 mb-2">How It Works</h4>
                      <ul className="text-sm text-slate-300 space-y-2">
                        <li>• Citizens upload geotagged photos of pollution or encroachment</li>
                        <li>• AI matches photos to satellite-detected hotspots</li>
                        <li>• Validated evidence is added to enforcement reports</li>
                        <li>• Contributors build credibility score for court testimony</li>
                      </ul>
                    </div>
                    <div className="grid grid-cols-3 gap-3 text-center text-sm">
                      <div className="bg-slate-700/50 p-3 rounded">
                        <p className="text-2xl font-bold text-primary-500">1,247</p>
                        <p className="text-slate-400">Photos Submitted</p>
                      </div>
                      <div className="bg-slate-700/50 p-3 rounded">
                        <p className="text-2xl font-bold text-green-500">892</p>
                        <p className="text-slate-400">Validated</p>
                      </div>
                      <div className="bg-slate-700/50 p-3 rounded">
                        <p className="text-2xl font-bold text-blue-500">324</p>
                        <p className="text-slate-400">Contributors</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="bg-gradient-to-r from-primary-500 to-primary-700 rounded-xl p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">
            View Real-Time Analysis on the Dashboard
          </h3>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-slate-100 transition-all"
          >
            Go to Dashboard
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  )
}
