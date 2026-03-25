import Link from "next/link";
import { Waves, Github, Linkedin, Globe } from "lucide-react";

const stakeholders = [
  "Dept. of Environment (DoE)",
  "National River Conservation Commission (NRCC)",
  "Bangladesh Water Development Board (BWDB)",
  "Environmental Courts",
  "Bangladesh Bank (Green Banking)",
];

export default function Footer() {
  return (
    <footer className="glass-card border-t border-white/5 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <Waves className="w-6 h-6 text-teal" />
              <span className="text-lg font-bold">
                <span className="gradient-text">Nodi</span>
                <span className="text-white">Watch</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400">
              AI-Powered Satellite Surveillance for Bangladesh River Ecosystems
            </p>
            <p className="text-xs text-slate-500">
              © 2026 Team AlphaVerse. Eco-Tech Hackathon.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-semibold text-white mb-4">Platform</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link
                  href="/pollution"
                  className="hover:text-teal transition-colors"
                >
                  Pollution Monitoring
                </Link>
              </li>
              <li>
                <Link
                  href="/encroachment"
                  className="hover:text-teal transition-colors"
                >
                  Encroachment Detection
                </Link>
              </li>
              <li>
                <Link
                  href="/erosion"
                  className="hover:text-teal transition-colors"
                >
                  Erosion Forecasting
                </Link>
              </li>
              <li>
                <Link
                  href="/reports"
                  className="hover:text-teal transition-colors"
                >
                  Evidence Reports
                </Link>
              </li>
            </ul>
          </div>

          {/* Beneficiaries */}
          <div>
            <h3 className="font-semibold text-white mb-4">Beneficiaries</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              {stakeholders.map((stakeholder) => (
                <li key={stakeholder}>{stakeholder}</li>
              ))}
            </ul>
          </div>

          {/* Team */}
          <div>
            <h3 className="font-semibold text-white mb-4">Team AlphaVerse</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <a
                  href="https://www.linkedin.com/in/an-swapnil/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-teal transition-colors flex items-center gap-2"
                >
                  <Linkedin className="w-4 h-4" />
                  Ahmmad Nur Swapnil
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/in/tamim-hasan-saad/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-teal transition-colors flex items-center gap-2"
                >
                  <Linkedin className="w-4 h-4" />
                  Tamim Hasan Saad
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/in/ekramul-haque-amin22/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-teal transition-colors flex items-center gap-2"
                >
                  <Linkedin className="w-4 h-4" />
                  Ekramul Haque Amin
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/in/habiba-rafique/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-teal transition-colors flex items-center gap-2"
                >
                  <Linkedin className="w-4 h-4" />
                  Habiba Rafique
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/in/most-sonia-khatun-b92717363/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-teal transition-colors flex items-center gap-2"
                >
                  <Linkedin className="w-4 h-4" />
                  Sonia Khatun
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-500">
            Built for Eco-Tech Hackathon 2026 — Environment Watch: BUET
          </p>
          <div className="flex items-center gap-4">
            <span className="badge badge-teal">Phase 2 Finalist</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
