import { NextRequest, NextResponse } from "next/server";
import factoriesData from "@/data/real_factories.json";

type AttributionFactory = {
  osm_id: number;
  name: string;
  lat: number;
  lng: number;
  industry_type: string;
  pollution_profile: string;
};

type FactoryEnvelope = {
  factories?: AttributionFactory[];
};

const INDUSTRY_POLLUTION_PROFILE: Record<
  string,
  { ndti_weight: number; cdom_weight: number; rb_weight: number }
> = {
  textile: { ndti_weight: 0.6, cdom_weight: 0.3, rb_weight: 0.9 },
  tannery: { ndti_weight: 0.9, cdom_weight: 0.9, rb_weight: 0.4 },
  dyeing: { ndti_weight: 0.5, cdom_weight: 0.4, rb_weight: 0.95 },
  garment: { ndti_weight: 0.4, cdom_weight: 0.3, rb_weight: 0.7 },
  chemical: { ndti_weight: 0.7, cdom_weight: 0.5, rb_weight: 0.3 },
  pharmaceutical: { ndti_weight: 0.5, cdom_weight: 0.6, rb_weight: 0.2 },
  food: { ndti_weight: 0.6, cdom_weight: 0.8, rb_weight: 0.2 },
  paper: { ndti_weight: 0.7, cdom_weight: 0.7, rb_weight: 0.3 },
  unknown: { ndti_weight: 0.5, cdom_weight: 0.5, rb_weight: 0.5 },
};

function haversineDistanceMeters(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const radius = 6_371_000;
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) ** 2 +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) ** 2;

  return radius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function runBayesianAttribution(
  hotspotLat: number,
  hotspotLng: number,
  pollutionType: string,
  factories: AttributionFactory[],
  maxDistance: number,
) {
  const candidates: Array<{
    factory_name: string;
    osm_id: number;
    industry_type: string;
    pollution_profile: string;
    distance_m: number;
    lat: number;
    lng: number;
    spectral_match: number;
    distance_score: number;
    raw_posterior?: number;
    probability?: number;
  }> = [];

  for (const factory of factories) {
    const distance = haversineDistanceMeters(
      hotspotLat,
      hotspotLng,
      factory.lat,
      factory.lng,
    );

    if (distance > maxDistance || distance < 1) {
      continue;
    }

    const distancePrior = 1 / (distance / 100) ** 2;
    const profile =
      INDUSTRY_POLLUTION_PROFILE[factory.industry_type] ||
      INDUSTRY_POLLUTION_PROFILE.unknown;

    let spectralLikelihood: number;
    if (pollutionType === "high_organic") {
      spectralLikelihood =
        profile.cdom_weight * 0.6 + profile.ndti_weight * 0.4;
    } else if (pollutionType === "high_dye") {
      spectralLikelihood = profile.rb_weight * 0.7 + profile.ndti_weight * 0.3;
    } else {
      spectralLikelihood =
        (profile.ndti_weight + profile.cdom_weight + profile.rb_weight) / 3;
    }

    candidates.push({
      factory_name: factory.name,
      osm_id: factory.osm_id,
      industry_type: factory.industry_type || "unknown",
      pollution_profile: factory.pollution_profile || "Unclassified Industrial",
      distance_m: Math.round(distance),
      lat: factory.lat,
      lng: factory.lng,
      spectral_match: Number(spectralLikelihood.toFixed(3)),
      distance_score: Number(distancePrior.toFixed(3)),
      raw_posterior: spectralLikelihood * distancePrior,
    });
  }

  if (candidates.length > 0) {
    const maxRaw = Math.max(
      ...candidates.map((candidate) => candidate.raw_posterior || 0),
    );
    const background = 0.05 * maxRaw;
    for (const candidate of candidates) {
      candidate.raw_posterior = (candidate.raw_posterior || 0) + background;
    }
  }

  const total =
    candidates.reduce(
      (sum, candidate) => sum + (candidate.raw_posterior || 0),
      0,
    ) || 1;

  for (const candidate of candidates) {
    const rawPosterior = candidate.raw_posterior || 0;
    candidate.probability = Number((rawPosterior / total).toFixed(4));
    delete candidate.raw_posterior;
  }

  candidates.sort((a, b) => (b.probability || 0) - (a.probability || 0));
  return candidates.slice(0, 10);
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const lat = Number(searchParams.get("lat"));
  const lng = Number(searchParams.get("lng"));

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return NextResponse.json(
      { error: "Missing or invalid lat/lng parameters" },
      { status: 400 },
    );
  }

  const pollutionType = searchParams.get("pollution_type") || "mixed";
  const radius = Number(searchParams.get("radius") || "2000");
  const maxDistance = Number.isFinite(radius) ? radius : 2000;

  const factories = (factoriesData as FactoryEnvelope).factories || [];
  const attributedFactories = runBayesianAttribution(
    lat,
    lng,
    pollutionType,
    factories,
    maxDistance,
  );

  return NextResponse.json({
    hotspot: { lat, lng, type: pollutionType },
    attributed_factories: attributedFactories,
    methodology:
      "Bayesian spatial probability: P(factory|pollution) ∝ P(spectral_match|industry_type) × P(proximity)",
    disclaimer:
      "Spatial heuristic ranking - indicates cluster-level probability, not definitive source identification.",
  });
}
