import { NextRequest, NextResponse } from "next/server";
import pollutionData from "@/data/pollution-hotspots.json";

const BACKEND_URL = (
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000"
).replace(/\/$/, "");

/** Bbox-filter static hotspots so zooming to any region returns relevant data */
function staticHotspotsInBbox(S: number, W: number, N: number, E: number) {
  const buf = 0.08; // ~9 km buffer so markers near edge still appear
  return (pollutionData.hotspots as any[]).filter(
    (h: any) =>
      h.lat >= S - buf && h.lat <= N + buf &&
      h.lng >= W - buf && h.lng <= E + buf
  );
}

/** Query Overpass directly for river/canal ways with inline geometry */
async function fetchOverpassWaterways(S: number, W: number, N: number, E: number) {
  // Skip for very large bboxes — would cause Overpass timeout
  if ((N - S) * (E - W) > 4) return [];

  const query =
    `[out:json][timeout:15];` +
    `(way["waterway"="river"](${S},${W},${N},${E});` +
    `way["waterway"="canal"](${S},${W},${N},${E}););` +
    `out geom;`;

  const res = await fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    body: query,
    headers: { "Content-Type": "text/plain" },
    signal: AbortSignal.timeout(12000),
  });

  if (!res.ok) throw new Error(`Overpass ${res.status}`);
  const data = await res.json();

  return (data.elements as any[])
    .filter((el) => el.type === "way" && el.geometry?.length > 1)
    .map((el) => ({
      id: `osm-${el.id}`,
      name: el.tags?.name || el.tags?.["name:en"] || "Unnamed waterway",
      type: el.tags?.waterway || "river",
      coordinates: (el.geometry as { lon: number; lat: number }[]).map((pt) => [pt.lon, pt.lat]),
    }))
    .slice(0, 200); // cap payload size
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const south = searchParams.get("south");
  const west  = searchParams.get("west");
  const north = searchParams.get("north");
  const east  = searchParams.get("east");

  if (!south || !west || !north || !east) {
    return NextResponse.json(
      { error: "Missing bbox parameters (south, west, north, east required)" },
      { status: 400 }
    );
  }

  const S = parseFloat(south), W = parseFloat(west);
  const N = parseFloat(north), E = parseFloat(east);
  const staticHotspots = staticHotspotsInBbox(S, W, N, E);

  // 1. Try Render backend with short timeout
  try {
    const url = `${BACKEND_URL}/api/dynamic?south=${south}&west=${west}&north=${north}&east=${east}`;
    const res = await fetch(url, {
      signal: AbortSignal.timeout(8000),
      headers: { Accept: "application/json" },
    });

    if (res.ok) {
      const data = await res.json();
      // Merge static hotspots in bbox into backend response (avoid duplicates)
      const liveIds = new Set((data.hotspots || []).map((h: any) => h.id));
      const merged = [
        ...(data.hotspots || []),
        ...staticHotspots.filter((h: any) => !liveIds.has(h.id)),
      ];
      return NextResponse.json({ ...data, hotspots: merged, source: "backend" });
    }
  } catch {
    // Backend unavailable or slow — fall through to Overpass
  }

  // 2. Query Overpass directly for real waterways
  try {
    const waterways = await fetchOverpassWaterways(S, W, N, E);
    return NextResponse.json({
      waterways,
      factories: [],
      hotspots: staticHotspots,
      source: "overpass_fallback",
    });
  } catch {
    // 3. Both failed — return static-only with 200 so UI shows local data
    return NextResponse.json({
      waterways: [],
      factories: [],
      hotspots: staticHotspots,
      source: "static_only",
    });
  }
}
