import { NextResponse } from "next/server";
import factoriesData from "@/data/real_factories.json";
import hotspotsData from "@/data/real_pollution_hotspots.json";
import { LEGACY_RIVERS } from "@/lib/legacy-rivers";

type FactoryRecord = {
  industry_type?: string;
  nearest_river?: string;
};

type HotspotRecord = {
  severity?: string | number;
};

type FactoryEnvelope = {
  factories?: FactoryRecord[];
};

type HotspotEnvelope = {
  hotspots?: HotspotRecord[];
};

function toSeverityBand(severity: string | number | undefined): string {
  if (typeof severity === "number") {
    if (severity >= 85) return "critical";
    if (severity >= 70) return "high";
    if (severity >= 50) return "moderate";
    return "low";
  }

  const text = String(severity || "").toLowerCase();
  if (["critical", "high", "moderate", "low"].includes(text)) {
    return text;
  }

  return "unknown";
}

function incrementCounter(counter: Record<string, number>, key: string) {
  counter[key] = (counter[key] || 0) + 1;
}

export async function GET() {
  const factories = (factoriesData as FactoryEnvelope).factories || [];
  const hotspots = (hotspotsData as HotspotEnvelope).hotspots || [];

  const industryCounts: Record<string, number> = {};
  const severityCounts: Record<string, number> = {};
  const riverCounts: Record<string, number> = {};

  for (const factory of factories) {
    incrementCounter(industryCounts, factory.industry_type || "unknown");
    incrementCounter(riverCounts, factory.nearest_river || "unknown");
  }

  for (const hotspot of hotspots) {
    incrementCounter(severityCounts, toSeverityBand(hotspot.severity));
  }

  const factoriesByRiver: Record<string, number> = {};
  for (const [riverId, count] of Object.entries(riverCounts)) {
    if (riverId in LEGACY_RIVERS) {
      factoriesByRiver[LEGACY_RIVERS[riverId].name] = count;
    }
  }

  return NextResponse.json({
    total_factories: factories.length,
    total_hotspots: hotspots.length,
    total_rivers_monitored: Object.keys(LEGACY_RIVERS).length,
    critical_hotspots: severityCounts.critical || 0,
    high_hotspots: severityCounts.high || 0,
    factories_by_type: industryCounts,
    factories_by_river: factoriesByRiver,
  });
}
