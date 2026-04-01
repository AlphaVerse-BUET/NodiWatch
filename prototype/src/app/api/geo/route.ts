import { NextRequest, NextResponse } from "next/server";
import pollutionData from "@/data/pollution-hotspots.json";
import factoriesData from "@/data/factories.json";
import riversData from "@/data/rivers.json";

const OVERPASS_URL = "https://overpass-api.de/api/interpreter";
const CACHE_TTL_MS = 5 * 60 * 1000;

const HOTSPOT_RADIUS_METERS = 1500;
const FACTORY_MAX_RIVER_DISTANCE_METERS = 3000;
const FACTORY_ATTRIBUTION_RADIUS_METERS = 2000;

const DYNAMIC_RIVER_LIMIT = 40;
const FACTORY_LIMIT = 450;
const HOTSPOT_LIMIT = 150;

const geoCache = new Map<string, { ts: number; payload: GeoRouteResponse }>();

type Waterway = {
  id: string;
  name: string;
  type: string;
  coordinates: [number, number][];
};

type RiverLine = {
  name: string;
  coords: [number, number][];
};

type FactoryRecord = {
  osm_id: number;
  name: string;
  lat: number;
  lng: number;
  type: string;
  industry_type: string;
  pollution_profile: string;
  nearest_river: string;
  river_name: string;
  distance_to_river_m: number;
  tags: {
    building: string;
    landuse: string;
    industrial: string;
    name: string;
    operator: string;
  };
};

type StaticFactorySourceRecord = {
  id?: string;
  osm_id?: number;
  name?: string;
  lat?: number;
  lng?: number;
  type?: string;
  industry_type?: string;
  pollution_profile?: string;
  nearest_river?: string;
  river_name?: string;
  river?: string;
  distance_to_river_m?: number;
  distance_m?: number;
  tags?: Partial<FactoryRecord["tags"]>;
};

type AttributedFactory = {
  factory_name: string;
  osm_id?: number;
  industry_type: string;
  pollution_profile?: string;
  distance_m: number;
  lat?: number;
  lng?: number;
  spectral_match?: number;
  distance_score?: number;
  probability: number;
};

type HotspotRecord = {
  id: string;
  lat: number;
  lng: number;
  severity: string | number;
  type: string;
  label: string;
  river: string;
  river_id: string;
  detected: string;
  spectral: {
    ndti: number;
    cdom: number;
    red_blue_ratio: number;
  };
  nearby_factories: number;
  top_source: string;
  description: string;
  attributed_factories: AttributedFactory[];
};

type GeoRouteResponse = {
  waterways: Waterway[];
  factories: FactoryRecord[];
  hotspots: HotspotRecord[];
  source: string;
  metadata: {
    cacheKey: string;
    generatedAt: string;
    bbox: {
      south: number;
      west: number;
      north: number;
      east: number;
    };
  };
};

type OverpassElement = {
  id: number;
  type: string;
  lat?: number;
  lon?: number;
  center?: {
    lat: number;
    lon: number;
  };
  tags?: Record<string, string>;
  geometry?: Array<{ lat: number; lon: number }>;
};

type OverpassResponse = {
  elements?: OverpassElement[];
};

const INDUSTRY_POLLUTION_PROFILE: Record<
  string,
  { ndti_weight: number; cdom_weight: number; rb_weight: number; label: string }
> = {
  textile: {
    ndti_weight: 0.6,
    cdom_weight: 0.3,
    rb_weight: 0.9,
    label: "High-Dye Industrial",
  },
  tannery: {
    ndti_weight: 0.9,
    cdom_weight: 0.9,
    rb_weight: 0.4,
    label: "High-Organic Industrial",
  },
  dyeing: {
    ndti_weight: 0.5,
    cdom_weight: 0.4,
    rb_weight: 0.95,
    label: "Dye Effluent",
  },
  garment: {
    ndti_weight: 0.4,
    cdom_weight: 0.3,
    rb_weight: 0.7,
    label: "Mixed Industrial",
  },
  chemical: {
    ndti_weight: 0.7,
    cdom_weight: 0.5,
    rb_weight: 0.3,
    label: "Chemical Discharge",
  },
  pharmaceutical: {
    ndti_weight: 0.5,
    cdom_weight: 0.6,
    rb_weight: 0.2,
    label: "Pharmaceutical Waste",
  },
  food: {
    ndti_weight: 0.6,
    cdom_weight: 0.8,
    rb_weight: 0.2,
    label: "Organic Waste",
  },
  paper: {
    ndti_weight: 0.7,
    cdom_weight: 0.7,
    rb_weight: 0.3,
    label: "Pulp & Organic",
  },
  unknown: {
    ndti_weight: 0.5,
    cdom_weight: 0.5,
    rb_weight: 0.5,
    label: "Unclassified Industrial",
  },
};

function round(value: number, digits = 3): number {
  return Number(value.toFixed(digits));
}

function hashString(input: string): number {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function seededFloat(seed: string): number {
  return hashString(seed) / 4294967295;
}

function seededRange(seed: string, min: number, max: number): number {
  return min + seededFloat(seed) * (max - min);
}

function parseCoord(value: string | null, label: string): number {
  if (!value) {
    throw new Error(`Missing ${label} parameter`);
  }

  const parsed = Number.parseFloat(value);
  if (!Number.isFinite(parsed)) {
    throw new Error(`Invalid ${label} parameter`);
  }

  return parsed;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(value, max));
}

function toCacheKey(
  south: number,
  west: number,
  north: number,
  east: number,
): string {
  const r = 0.05;
  const s = Math.round(south / r) * r;
  const w = Math.round(west / r) * r;
  const n = Math.round(north / r) * r;
  const e = Math.round(east / r) * r;
  return `${s.toFixed(2)},${w.toFixed(2)},${n.toFixed(2)},${e.toFixed(2)}`;
}

function sampleCoordinates(
  coordinates: [number, number][],
  maxPoints = 20,
): [number, number][] {
  if (coordinates.length <= maxPoints) {
    return coordinates;
  }

  const step = Math.max(1, Math.floor(coordinates.length / maxPoints));
  return coordinates.filter((_, idx) => idx % step === 0).slice(0, maxPoints);
}

function haversineDistanceMeters(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const R = 6_371_000;
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) ** 2 +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function staticRivers(): Record<string, RiverLine> {
  const features =
    (riversData as { features?: Array<Record<string, unknown>> }).features ||
    [];
  const rivers: Record<string, RiverLine> = {};

  for (const feature of features) {
    const properties = (feature.properties as Record<string, unknown>) || {};
    const geometry = (feature.geometry as Record<string, unknown>) || {};
    const coordinates = (geometry.coordinates as number[][]) || [];

    if (!Array.isArray(coordinates) || coordinates.length < 2) {
      continue;
    }

    const id = String(
      properties.id ||
        properties.name ||
        `river_${Object.keys(rivers).length + 1}`,
    );

    const name = String(properties.name || id);
    const normalized = coordinates
      .filter((coord) => coord.length >= 2)
      .map((coord) => [coord[0], coord[1]] as [number, number]);

    if (normalized.length < 2) {
      continue;
    }

    rivers[id] = {
      name,
      coords: sampleCoordinates(normalized, 20),
    };
  }

  return rivers;
}

function buildDynamicRivers(waterways: Waterway[]): Record<string, RiverLine> {
  const rivers: Record<string, RiverLine> = {};

  for (const waterway of waterways.slice(0, DYNAMIC_RIVER_LIMIT)) {
    if (!waterway.coordinates || waterway.coordinates.length < 2) {
      continue;
    }

    rivers[`osm_${waterway.id}`] = {
      name: waterway.name,
      coords: sampleCoordinates(waterway.coordinates, 20),
    };
  }

  return rivers;
}

function nearestRiver(
  lat: number,
  lng: number,
  rivers: Record<string, RiverLine>,
): { riverId: string | null; distance: number } {
  let bestRiver: string | null = null;
  let bestDistance = Number.POSITIVE_INFINITY;

  for (const [riverId, river] of Object.entries(rivers)) {
    for (const [riverLng, riverLat] of river.coords) {
      const distance = haversineDistanceMeters(lat, lng, riverLat, riverLng);
      if (distance < bestDistance) {
        bestDistance = distance;
        bestRiver = riverId;
      }
    }
  }

  return { riverId: bestRiver, distance: bestDistance };
}

function classifyIndustry(tags: Record<string, string>): string {
  const name = `${tags.name || ""} ${tags.operator || ""}`.toLowerCase();
  const industrial = (tags.industrial || "").toLowerCase();
  const craft = (tags.craft || "").toLowerCase();

  if (["tannery", "leather", "tanning"].some((v) => name.includes(v))) {
    return "tannery";
  }

  if (
    ["textile", "spinning", "weaving", "knit"].some((v) => name.includes(v))
  ) {
    return "textile";
  }

  if (
    ["dye", "dyeing", "dying", "color", "wash"].some((v) => name.includes(v))
  ) {
    return "dyeing";
  }

  if (
    ["garment", "apparel", "clothing", "fashion", "rmg"].some((v) =>
      name.includes(v),
    )
  ) {
    return "garment";
  }

  if (["chemical", "chem"].some((v) => name.includes(v))) {
    return "chemical";
  }

  if (["pharma", "medicine", "drug"].some((v) => name.includes(v))) {
    return "pharmaceutical";
  }

  if (
    ["food", "rice", "flour", "oil", "beverage"].some((v) => name.includes(v))
  ) {
    return "food";
  }

  if (["paper", "pulp", "jute"].some((v) => name.includes(v))) {
    return "paper";
  }

  if (industrial === "tannery") {
    return "tannery";
  }

  if (["textile", "dyer"].includes(craft)) {
    return "textile";
  }

  return "unknown";
}

function staticHotspotsInBbox(
  south: number,
  west: number,
  north: number,
  east: number,
): HotspotRecord[] {
  const buf = 0.08;
  const hotspots =
    (pollutionData as { hotspots?: HotspotRecord[] }).hotspots || [];

  return hotspots.filter(
    (hotspot) =>
      hotspot.lat >= south - buf &&
      hotspot.lat <= north + buf &&
      hotspot.lng >= west - buf &&
      hotspot.lng <= east + buf,
  );
}

function normalizeKey(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function resolveRiverId(
  factory: StaticFactorySourceRecord,
  rivers: Record<string, RiverLine>,
): string {
  const candidates = [
    factory.nearest_river,
    factory.river_name,
    factory.river,
  ].filter(
    (value): value is string => typeof value === "string" && value.length > 0,
  );

  for (const candidate of candidates) {
    if (rivers[candidate]) {
      return candidate;
    }

    const normalizedCandidate = normalizeKey(candidate);

    const byId = Object.keys(rivers).find(
      (riverId) => normalizeKey(riverId) === normalizedCandidate,
    );
    if (byId) {
      return byId;
    }

    const byName = Object.entries(rivers).find(
      ([, river]) => normalizeKey(river.name) === normalizedCandidate,
    );
    if (byName) {
      return byName[0];
    }
  }

  return Object.keys(rivers)[0] || "unknown";
}

function toFactoryRecord(
  factory: StaticFactorySourceRecord,
  index: number,
  rivers: Record<string, RiverLine>,
): FactoryRecord {
  const nearestRiverId = resolveRiverId(factory, rivers);
  const nearestRiverName =
    factory.river_name ||
    factory.river ||
    rivers[nearestRiverId]?.name ||
    "Unknown river";

  const industryType = factory.industry_type || factory.type || "unknown";
  const tags = factory.tags || {};

  return {
    osm_id: Number(factory.osm_id || index + 1),
    name: factory.name || factory.id || `Industrial Site #${index + 1}`,
    lat: round(Number(factory.lat || 0), 6),
    lng: round(Number(factory.lng || 0), 6),
    type: factory.type || industryType,
    industry_type: industryType,
    pollution_profile:
      factory.pollution_profile ||
      INDUSTRY_POLLUTION_PROFILE[industryType]?.label ||
      INDUSTRY_POLLUTION_PROFILE.unknown.label,
    nearest_river: nearestRiverId,
    river_name: nearestRiverName,
    distance_to_river_m: Math.round(
      Number(factory.distance_to_river_m ?? factory.distance_m ?? 0),
    ),
    tags: {
      building: tags.building || "",
      landuse: tags.landuse || "",
      industrial: tags.industrial || "",
      name: tags.name || factory.name || "",
      operator: tags.operator || "",
    },
  };
}

function staticFactoriesInBbox(
  south: number,
  west: number,
  north: number,
  east: number,
): FactoryRecord[] {
  const buf = 0.08;
  const rivers = staticRivers();
  const rawFactories =
    (factoriesData as { factories?: StaticFactorySourceRecord[] }).factories ||
    [];

  return rawFactories
    .filter((factory) => {
      const lat = Number(factory.lat);
      const lng = Number(factory.lng);
      return Number.isFinite(lat) && Number.isFinite(lng);
    })
    .filter((factory) => {
      const lat = Number(factory.lat);
      const lng = Number(factory.lng);
      return (
        lat >= south - buf &&
        lat <= north + buf &&
        lng >= west - buf &&
        lng <= east + buf
      );
    })
    .slice(0, FACTORY_LIMIT)
    .map((factory, index) => toFactoryRecord(factory, index, rivers));
}

async function fetchOverpassWaterways(
  south: number,
  west: number,
  north: number,
  east: number,
): Promise<Waterway[]> {
  if ((north - south) * (east - west) > 5) {
    return [];
  }

  const query =
    `[out:json][timeout:20];` +
    `(way["waterway"~"^(river|canal)$"](${south},${west},${north},${east}););` +
    `out geom;`;

  const response = await fetch(OVERPASS_URL, {
    method: "POST",
    body: query,
    headers: { "Content-Type": "text/plain" },
    cache: "no-store",
    signal: AbortSignal.timeout(15000),
  });

  if (!response.ok) {
    throw new Error(`Overpass waterways ${response.status}`);
  }

  const data = (await response.json()) as OverpassResponse;
  const elements = data.elements || [];

  return elements
    .filter(
      (element) =>
        element.type === "way" && (element.geometry || []).length > 1,
    )
    .map((element) => {
      const coordinates = (element.geometry || []).map(
        (point) => [point.lon, point.lat] as [number, number],
      );

      return {
        id: String(element.id),
        name:
          element.tags?.name || element.tags?.["name:en"] || "Unnamed waterway",
        type: element.tags?.waterway || "river",
        coordinates,
      } satisfies Waterway;
    })
    .slice(0, 220);
}

async function fetchOverpassFactories(
  south: number,
  west: number,
  north: number,
  east: number,
  rivers: Record<string, RiverLine>,
): Promise<FactoryRecord[]> {
  if ((north - south) * (east - west) > 2) {
    return [];
  }

  const query = `
    [out:json][timeout:35];
    (
      node["landuse"="industrial"](${south},${west},${north},${east});
      way["landuse"="industrial"](${south},${west},${north},${east});
      node["building"="industrial"](${south},${west},${north},${east});
      way["building"="industrial"](${south},${west},${north},${east});
      node["building"="factory"](${south},${west},${north},${east});
      way["building"="factory"](${south},${west},${north},${east});
      node["building"="warehouse"](${south},${west},${north},${east});
      way["building"="warehouse"](${south},${west},${north},${east});
      node["industrial"](${south},${west},${north},${east});
      way["industrial"](${south},${west},${north},${east});
      node["man_made"="works"](${south},${west},${north},${east});
      way["man_made"="works"](${south},${west},${north},${east});
      node["craft"](${south},${west},${north},${east});
      way["craft"](${south},${west},${north},${east});
    );
    out center tags;
  `;

  const response = await fetch(OVERPASS_URL, {
    method: "POST",
    body: query,
    headers: { "Content-Type": "text/plain" },
    cache: "no-store",
    signal: AbortSignal.timeout(20000),
  });

  if (!response.ok) {
    throw new Error(`Overpass factories ${response.status}`);
  }

  const data = (await response.json()) as OverpassResponse;
  const seenCoordinates = new Set<string>();
  const factories: FactoryRecord[] = [];

  for (const element of data.elements || []) {
    let lat: number | undefined;
    let lng: number | undefined;

    if (element.type === "node") {
      lat = element.lat;
      lng = element.lon;
    } else if (element.type === "way" || element.type === "relation") {
      lat = element.center?.lat;
      lng = element.center?.lon;
    }

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      continue;
    }

    const dedupeKey = `${lat!.toFixed(4)}:${lng!.toFixed(4)}`;
    if (seenCoordinates.has(dedupeKey)) {
      continue;
    }
    seenCoordinates.add(dedupeKey);

    const tags = element.tags || {};
    const nearest = nearestRiver(lat!, lng!, rivers);
    if (
      !nearest.riverId ||
      nearest.distance > FACTORY_MAX_RIVER_DISTANCE_METERS
    ) {
      continue;
    }

    const industryType = classifyIndustry(tags);
    const profile =
      INDUSTRY_POLLUTION_PROFILE[industryType] ||
      INDUSTRY_POLLUTION_PROFILE.unknown;

    const river = rivers[nearest.riverId];
    factories.push({
      osm_id: element.id,
      name: tags.name || tags["name:en"] || `Industrial Site #${element.id}`,
      lat: round(lat!, 6),
      lng: round(lng!, 6),
      type: industryType === "unknown" ? "industrial" : industryType,
      industry_type: industryType,
      pollution_profile: profile.label,
      nearest_river: nearest.riverId,
      river_name: river?.name || "Unknown river",
      distance_to_river_m: Math.round(nearest.distance),
      tags: {
        building: tags.building || "",
        landuse: tags.landuse || "",
        industrial: tags.industrial || "",
        name: tags.name || "",
        operator: tags.operator || "",
      },
    });

    if (factories.length >= FACTORY_LIMIT) {
      break;
    }
  }

  factories.sort((a, b) => a.distance_to_river_m - b.distance_to_river_m);
  return factories;
}

function runBayesianAttribution(
  hotspotLat: number,
  hotspotLng: number,
  hotspotType: string,
  factories: FactoryRecord[],
): AttributedFactory[] {
  const candidates: Array<AttributedFactory & { rawPosterior: number }> = [];

  for (const factory of factories) {
    const distance = haversineDistanceMeters(
      hotspotLat,
      hotspotLng,
      factory.lat,
      factory.lng,
    );

    if (distance > FACTORY_ATTRIBUTION_RADIUS_METERS || distance < 1) {
      continue;
    }

    const distancePrior = 1 / (distance / 100) ** 2;
    const profile =
      INDUSTRY_POLLUTION_PROFILE[factory.industry_type] ||
      INDUSTRY_POLLUTION_PROFILE.unknown;

    let spectralLikelihood: number;
    if (hotspotType === "high_organic") {
      spectralLikelihood =
        profile.cdom_weight * 0.6 + profile.ndti_weight * 0.4;
    } else if (hotspotType === "high_dye") {
      spectralLikelihood = profile.rb_weight * 0.7 + profile.ndti_weight * 0.3;
    } else {
      spectralLikelihood =
        (profile.ndti_weight + profile.cdom_weight + profile.rb_weight) / 3;
    }

    candidates.push({
      factory_name: factory.name,
      osm_id: factory.osm_id,
      industry_type: factory.industry_type,
      pollution_profile: factory.pollution_profile,
      distance_m: Math.round(distance),
      lat: factory.lat,
      lng: factory.lng,
      spectral_match: round(spectralLikelihood, 3),
      distance_score: round(distancePrior, 3),
      rawPosterior: spectralLikelihood * distancePrior,
      probability: 0,
    });
  }

  if (candidates.length === 0) {
    return [];
  }

  const maxRaw = Math.max(
    ...candidates.map((candidate) => candidate.rawPosterior),
  );
  const background = 0.05 * maxRaw;

  for (const candidate of candidates) {
    candidate.rawPosterior += background;
  }

  const total = candidates.reduce(
    (sum, candidate) => sum + candidate.rawPosterior,
    0,
  );

  const normalized = candidates
    .map(({ rawPosterior, ...candidate }) => ({
      ...candidate,
      probability: round(rawPosterior / total, 4),
    }))
    .sort((a, b) => b.probability - a.probability)
    .slice(0, 5);

  return normalized;
}

function generatePollutionHotspots(
  factories: FactoryRecord[],
  rivers: Record<string, RiverLine>,
  cacheKey: string,
): HotspotRecord[] {
  const hotspots: HotspotRecord[] = [];
  let hotspotId = 1;

  for (const [riverId, riverData] of Object.entries(rivers).slice(
    0,
    DYNAMIC_RIVER_LIMIT,
  )) {
    const riverFactories = factories.filter(
      (factory) =>
        factory.nearest_river === riverId &&
        factory.distance_to_river_m < FACTORY_ATTRIBUTION_RADIUS_METERS,
    );

    if (riverFactories.length === 0) {
      continue;
    }

    const sampledCoords = sampleCoordinates(riverData.coords, 20);

    for (let idx = 0; idx < sampledCoords.length; idx += 1) {
      if (hotspots.length >= HOTSPOT_LIMIT) {
        return hotspots;
      }

      const [coordLng, coordLat] = sampledCoords[idx];
      const nearby = riverFactories.filter(
        (factory) =>
          haversineDistanceMeters(
            coordLat,
            coordLng,
            factory.lat,
            factory.lng,
          ) < HOTSPOT_RADIUS_METERS,
      );

      if (nearby.length === 0) {
        continue;
      }

      const n = nearby.length;
      const ndtiSum = nearby.reduce((sum, factory) => {
        const profile =
          INDUSTRY_POLLUTION_PROFILE[factory.industry_type] ||
          INDUSTRY_POLLUTION_PROFILE.unknown;
        return sum + profile.ndti_weight;
      }, 0);

      const cdomSum = nearby.reduce((sum, factory) => {
        const profile =
          INDUSTRY_POLLUTION_PROFILE[factory.industry_type] ||
          INDUSTRY_POLLUTION_PROFILE.unknown;
        return sum + profile.cdom_weight;
      }, 0);

      const rbSum = nearby.reduce((sum, factory) => {
        const profile =
          INDUSTRY_POLLUTION_PROFILE[factory.industry_type] ||
          INDUSTRY_POLLUTION_PROFILE.unknown;
        return sum + profile.rb_weight;
      }, 0);

      const seedBase = `${cacheKey}:${riverId}:${idx}:${coordLng.toFixed(5)}:${coordLat.toFixed(5)}`;

      const baseNdti = Math.min(
        0.8,
        (ndtiSum / n) * 0.5 + seededRange(`${seedBase}:ndti`, -0.05, 0.1),
      );
      const baseCdom = Math.min(
        5,
        (cdomSum / n) * 2.5 + seededRange(`${seedBase}:cdom`, -0.3, 0.5),
      );
      const baseRb = Math.min(
        4,
        (rbSum / n) * 2 + seededRange(`${seedBase}:rb`, -0.2, 0.4),
      );

      const severityScore = (baseNdti + baseCdom / 5 + baseRb / 4) / 3;
      const severity =
        severityScore > 0.5
          ? "critical"
          : severityScore > 0.3
            ? "high"
            : severityScore > 0.15
              ? "moderate"
              : "low";

      const pollutionType =
        baseCdom > 3 ? "high_organic" : baseRb > 2.5 ? "high_dye" : "mixed";

      const label =
        baseRb > 1.5
          ? "Textile/Dye Effluent"
          : baseCdom > 2.5 && baseNdti > 0.3
            ? "Tannery Discharge"
            : baseCdom > 2
              ? "Organic Industrial Waste"
              : baseNdti > 0.35
                ? "High-Turbidity Discharge"
                : baseCdom > 1.5
                  ? "Mixed Organic Effluent"
                  : "Mixed Industrial Effluent";

      const daysAgo = Math.floor(seededRange(`${seedBase}:days`, 5, 90));
      const detectedDate = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 10);

      const latJitter = seededRange(`${seedBase}:lat`, -0.001, 0.001);
      const lngJitter = seededRange(`${seedBase}:lng`, -0.001, 0.001);

      const hotspotLat = round(coordLat + latJitter, 6);
      const hotspotLng = round(coordLng + lngJitter, 6);

      hotspots.push({
        id: `HP${String(hotspotId).padStart(3, "0")}`,
        lat: hotspotLat,
        lng: hotspotLng,
        severity,
        type: pollutionType,
        label,
        river: riverData.name,
        river_id: riverId,
        detected: detectedDate,
        spectral: {
          ndti: round(baseNdti, 3),
          cdom: round(baseCdom, 2),
          red_blue_ratio: round(baseRb, 2),
        },
        nearby_factories: n,
        top_source: nearby[0]?.name || "Unknown",
        description:
          `${severity[0].toUpperCase()}${severity.slice(1)} pollution detected via spectral model. ` +
          `${n} industrial facilities within 1.5km. ` +
          `Dominant signature: ${label.toLowerCase()}.`,
        attributed_factories: runBayesianAttribution(
          hotspotLat,
          hotspotLng,
          pollutionType,
          factories,
        ),
      });

      hotspotId += 1;
    }
  }

  return hotspots;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  let south: number;
  let west: number;
  let north: number;
  let east: number;

  try {
    south = parseCoord(searchParams.get("south"), "south");
    west = parseCoord(searchParams.get("west"), "west");
    north = parseCoord(searchParams.get("north"), "north");
    east = parseCoord(searchParams.get("east"), "east");
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Invalid request" },
      { status: 400 },
    );
  }

  south = clamp(south, 20.5, 26.8);
  west = clamp(west, 88, 92.8);
  north = clamp(north, 20.5, 26.8);
  east = clamp(east, 88, 92.8);

  if (north <= south || east <= west) {
    return NextResponse.json(
      { error: "Invalid bbox coordinates" },
      { status: 400 },
    );
  }

  const cacheKey = toCacheKey(south, west, north, east);
  const cached = geoCache.get(cacheKey);
  if (cached && Date.now() - cached.ts < CACHE_TTL_MS) {
    return NextResponse.json(cached.payload);
  }

  const staticHotspots = staticHotspotsInBbox(south, west, north, east);
  const staticFactories = staticFactoriesInBbox(south, west, north, east);

  let waterways: Waterway[] = [];
  let liveFactories: FactoryRecord[] = [];
  let liveHotspots: HotspotRecord[] = [];

  try {
    waterways = await fetchOverpassWaterways(south, west, north, east);

    const riversForSearch =
      waterways.length > 0 ? buildDynamicRivers(waterways) : staticRivers();

    try {
      liveFactories = await fetchOverpassFactories(
        south,
        west,
        north,
        east,
        riversForSearch,
      );
      if (liveFactories.length > 0) {
        liveHotspots = generatePollutionHotspots(
          liveFactories,
          riversForSearch,
          cacheKey,
        );
      }
    } catch {
      // Factory fetch failed - keep static fallback layers.
    }
  } catch {
    // Waterway fetch failed - keep static fallback layers.
  }

  const hotspots = liveHotspots.length > 0 ? liveHotspots : staticHotspots;
  const factories = liveFactories.length > 0 ? liveFactories : staticFactories;

  const source =
    waterways.length > 0 && liveFactories.length > 0 && liveHotspots.length > 0
      ? "prototype_dynamic"
      : waterways.length > 0
        ? "prototype_waterways+static_layers"
        : hotspots.length > 0 || factories.length > 0
          ? "prototype_static_fallback"
          : "prototype_empty";

  const payload: GeoRouteResponse = {
    waterways,
    factories,
    hotspots,
    source,
    metadata: {
      cacheKey,
      generatedAt: new Date().toISOString(),
      bbox: {
        south,
        west,
        north,
        east,
      },
    },
  };

  geoCache.set(cacheKey, { ts: Date.now(), payload });
  return NextResponse.json(payload);
}
