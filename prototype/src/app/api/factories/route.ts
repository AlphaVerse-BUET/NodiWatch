import { NextRequest, NextResponse } from "next/server";
import cachedFactoriesData from "@/data/real_factories.json";

type LegacyFactory = {
  osm_id: number;
  osm_type?: string;
  name: string;
  lat: number;
  lng: number;
  industry_type: string;
  pollution_profile: string;
  nearest_river: string;
  river_name: string;
  distance_to_river_m: number;
  tags?: {
    building?: string;
    landuse?: string;
    industrial?: string;
    name?: string;
    operator?: string;
  };
};

type CachedFactoryResponse = {
  factories?: LegacyFactory[];
};

const DEFAULT_BBOX = {
  south: "23.65",
  west: "90.30",
  north: "23.90",
  east: "90.55",
};

function normalizeKey(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function normalizeFactoryFromGeo(
  factory: Record<string, unknown>,
  index: number,
): LegacyFactory {
  const tagsValue = factory.tags;
  const tagsRecord =
    typeof tagsValue === "object" && tagsValue !== null
      ? (tagsValue as Record<string, unknown>)
      : {};

  const riverName = String(
    factory.river_name || factory.river || "Unknown river",
  );
  const nearestRiver = String(
    factory.nearest_river || normalizeKey(riverName) || "unknown",
  );

  return {
    osm_id: Number(factory.osm_id || index + 1),
    osm_type: String(factory.osm_type || "node"),
    name: String(factory.name || `Industrial Site #${index + 1}`),
    lat: Number(factory.lat || 0),
    lng: Number(factory.lng || 0),
    industry_type: String(factory.industry_type || factory.type || "unknown"),
    pollution_profile: String(
      factory.pollution_profile || "Unclassified Industrial",
    ),
    nearest_river: nearestRiver,
    river_name: riverName,
    distance_to_river_m: Math.round(
      Number(factory.distance_to_river_m ?? factory.distance_m ?? 0),
    ),
    tags: {
      building: String(tagsRecord.building || ""),
      landuse: String(tagsRecord.landuse || ""),
      industrial: String(tagsRecord.industrial || ""),
      name: String(tagsRecord.name || factory.name || ""),
      operator: String(tagsRecord.operator || ""),
    },
  };
}

function bboxFilter(
  factories: LegacyFactory[],
  south: number,
  west: number,
  north: number,
  east: number,
): LegacyFactory[] {
  return factories.filter(
    (factory) =>
      factory.lat >= south &&
      factory.lat <= north &&
      factory.lng >= west &&
      factory.lng <= east,
  );
}

function applyFilters(
  factories: LegacyFactory[],
  river: string | null,
  industry: string | null,
  maxDistance: number,
): LegacyFactory[] {
  let filtered = factories;

  if (river) {
    const riverKey = normalizeKey(river);
    filtered = filtered.filter(
      (factory) =>
        normalizeKey(factory.nearest_river || "") === riverKey ||
        normalizeKey(factory.river_name || "") === riverKey,
    );
  }

  if (industry) {
    const industryKey = industry.toLowerCase();
    filtered = filtered.filter(
      (factory) => (factory.industry_type || "").toLowerCase() === industryKey,
    );
  }

  filtered = filtered.filter(
    (factory) => Number(factory.distance_to_river_m || 0) <= maxDistance,
  );

  return filtered;
}

async function fetchFromGeo(
  request: NextRequest,
  south: string,
  west: string,
  north: string,
  east: string,
): Promise<LegacyFactory[]> {
  const params = new URLSearchParams({ south, west, north, east });
  const targetUrl = `${request.nextUrl.origin}/api/geo?${params.toString()}`;

  const response = await fetch(targetUrl, {
    headers: { Accept: "application/json" },
    cache: "no-store",
    signal: AbortSignal.timeout(20000),
  });

  if (!response.ok) {
    throw new Error(`Geo endpoint failed with ${response.status}`);
  }

  const payload = (await response.json()) as {
    factories?: Array<Record<string, unknown>>;
  };

  const factories = payload.factories || [];
  return factories.map((factory, index) =>
    normalizeFactoryFromGeo(factory, index),
  );
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const south = searchParams.get("south");
  const west = searchParams.get("west");
  const north = searchParams.get("north");
  const east = searchParams.get("east");

  const river = searchParams.get("river");
  const industry = searchParams.get("industry");
  const maxDistance = Number(searchParams.get("max_distance") || "3000");
  const refresh = searchParams.get("refresh") === "true";

  const providedBboxCount = [south, west, north, east].filter(
    (value) => value !== null,
  ).length;

  if (providedBboxCount > 0 && providedBboxCount < 4) {
    return NextResponse.json(
      { error: "Provide all bbox parameters: south, west, north, east" },
      { status: 400 },
    );
  }

  const cachedFactories =
    (cachedFactoriesData as CachedFactoryResponse).factories || [];

  try {
    if (providedBboxCount === 4) {
      const liveFactories = await fetchFromGeo(
        request,
        south!,
        west!,
        north!,
        east!,
      );

      const filtered = applyFilters(
        liveFactories,
        river,
        industry,
        maxDistance,
      );
      return NextResponse.json({
        factories: filtered,
        total: filtered.length,
        source: "live_osm",
      });
    }

    if (refresh) {
      const liveFactories = await fetchFromGeo(
        request,
        DEFAULT_BBOX.south,
        DEFAULT_BBOX.west,
        DEFAULT_BBOX.north,
        DEFAULT_BBOX.east,
      );

      const filtered = applyFilters(
        liveFactories,
        river,
        industry,
        maxDistance,
      );
      return NextResponse.json({
        factories: filtered,
        total: filtered.length,
        source: "live_osm",
      });
    }
  } catch {
    // If live fetch fails, continue with cached data.
  }

  let fallbackFactories = cachedFactories;

  if (providedBboxCount === 4) {
    const bboxSouth = Number(south);
    const bboxWest = Number(west);
    const bboxNorth = Number(north);
    const bboxEast = Number(east);

    if (
      Number.isFinite(bboxSouth) &&
      Number.isFinite(bboxWest) &&
      Number.isFinite(bboxNorth) &&
      Number.isFinite(bboxEast)
    ) {
      fallbackFactories = bboxFilter(
        fallbackFactories,
        bboxSouth,
        bboxWest,
        bboxNorth,
        bboxEast,
      );
    }
  }

  const filtered = applyFilters(
    fallbackFactories,
    river,
    industry,
    maxDistance,
  );

  return NextResponse.json({
    factories: filtered,
    total: filtered.length,
    source: "cached",
  });
}
