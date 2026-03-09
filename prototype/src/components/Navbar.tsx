"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Waves,
  LayoutDashboard,
  Factory,
  LandPlot,
  Mountain,
  Database,
  Info,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Pollution", href: "/pollution", icon: Factory },
  { name: "Encroachment", href: "/encroachment", icon: LandPlot },
  { name: "Erosion", href: "/erosion", icon: Mountain },
  { name: "Datasets", href: "/datasets", icon: Database },
  { name: "About", href: "/about", icon: Info },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-[var(--border)] px-6 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative">
            <Waves className="w-8 h-8 text-teal-500" />
            <div className="absolute inset-0 bg-teal-500/20 blur-xl rounded-full group-hover:bg-teal-500/30 transition-all" />
          </div>
          <div>
            <h1 className="text-xl font-bold gradient-text">NodiWatch</h1>
            <p className="text-xs text-[var(--muted)] -mt-1">
              AI River Surveillance
            </p>
          </div>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? "bg-teal-500/10 text-teal-500 border border-teal-500/30"
                    : "text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-white/5"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden md:inline">{item.name}</span>
              </Link>
            );
          })}
        </div>

        {/* Status indicator */}
        <div className="hidden lg:flex items-center gap-2 text-xs text-[var(--muted)]">
          <span className="w-2 h-2 bg-teal-500 rounded-full animate-pulse" />
          <span>Demo Mode</span>
        </div>
      </div>
    </nav>
  );
}
