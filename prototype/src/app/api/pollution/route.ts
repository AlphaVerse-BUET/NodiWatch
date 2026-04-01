import { NextRequest, NextResponse } from "next/server";
import realHotspotsData from "@/data/real_pollution_hotspots.json";
import fallbackHotspotsData from "@/data/pollution-hotspots.json";

type LegacyHotspot = {
  id: string;
  river?: string;
  river_id?: string;
  severity?: string | number;
  [key: string]: unknown;
};

type HotspotEnvelope = {
  hotspots?: LegacyHotspot[];
};

function normalizeKey(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

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

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const river = searchParams.get("river");
  const severity = searchParams.get("severity");

  const realHotspots = (realHotspotsData as HotspotEnvelope).hotspots || [];
  const fallbackHotspots =
    (fallbackHotspotsData as HotspotEnvelope).hotspots || [];

  const sourceHotspots =
    realHotspots.length > 0 ? realHotspots : fallbackHotspots;

  let filtered = sourceHotspots;

  if (river) {
    const riverKey = normalizeKey(river);
    filtered = filtered.filter((hotspot) => {
      const byRiverId = normalizeKey(String(hotspot.river_id || ""));
      const byRiverName = normalizeKey(String(hotspot.river || ""));
      return byRiverId === riverKey || byRiverName === riverKey;
    });
  }

  if (severity) {
    const severityAsNumber = Number(severity);
    if (Number.isFinite(severityAsNumber)) {
      filtered = filtered.filter(
        (hotspot) => Number(hotspot.severity) === severityAsNumber,
      );
    } else {
      const severityKey = severity.toLowerCase();
      filtered = filtered.filter(
        (hotspot) => toSeverityBand(hotspot.severity) === severityKey,
      );
    }
  }

  return NextResponse.json({
    hotspots: filtered,
    total: filtered.length,
  });
}
