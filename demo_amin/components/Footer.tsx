import { Github, Linkedin, Mail } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-700 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-lg font-semibold text-white mb-3">NodiWatch</h3>
            <p className="text-sm text-slate-400 mb-4">
              AI-powered satellite surveillance system for Bangladesh rivers, 
              detecting pollution, encroachment, and erosion using advanced 
              machine learning and satellite imagery.
            </p>
            <div className="flex gap-3">
              <a href="#" className="text-slate-400 hover:text-primary-500 transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-primary-500 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-primary-500 transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-3">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/dashboard" className="text-sm text-slate-400 hover:text-primary-500">Dashboard</a></li>
              <li><a href="/analysis" className="text-sm text-slate-400 hover:text-primary-500">Analysis</a></li>
              <li><a href="/reports" className="text-sm text-slate-400 hover:text-primary-500">Reports</a></li>
              <li><a href="/about" className="text-sm text-slate-400 hover:text-primary-500">About</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-3">Beneficiaries</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>Dept. of Environment (DoE)</li>
              <li>NRCC</li>
              <li>BWDB</li>
              <li>Environmental Courts</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-700 mt-8 pt-6 text-center">
          <p className="text-sm text-slate-400">
            © 2026 NodiWatch by Team Alpha Verse. Built for Eco-Tech Hackathon 2026 - Environment Watch: BUET
          </p>
          <p className="text-xs text-slate-500 mt-2">
            Innovate for Green 🌊 🇧🇩
          </p>
        </div>
      </div>
    </footer>
  )
}
