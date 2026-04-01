import { NextRequest, NextResponse } from "next/server";
import encroachmentData from "@/data/encroachment.json";

type EncroachmentSegment = {
  id: string;
  lat: number;
  lng: number;
  shrinkage_pct: number;
  affected_population: number;
  boundary_2016?: number[][];
  boundary_2026?: number[][];
  [key: string]: unknown;
};

type EncroachmentResponse = {
  segments: EncroachmentSegment[];
  layer: {
    requestedYear: "2016" | "2026";
    compareMode: boolean;
    availableYears: ["2016", "2026"];
  };
  metadata: {
    source: string;
    fallbackChain: string[];
    generatedAt: string;
    bbox: {
      south: number;
      west: number;
      north: number;
      east: number;
    };
  };
};

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

function isPointInBbox(
  lat: number,
  lng: number,
  south: number,
  west: number,
  north: number,
  east: number,
): boolean {
  return lat >= south && lat <= north && lng >= west && lng <= east;
}

function isBoundaryInBbox(
  boundary: number[][] | undefined,
  south: number,
  west: number,
  north: number,
  east: number,
): boolean {
  if (!boundary || boundary.length === 0) {
    return false;
  }

  return boundary.some((coordinate) => {
    if (coordinate.length < 2) {
      return false;
    }

    const [lng, lat] = coordinate;
    return isPointInBbox(lat, lng, south, west, north, east);
  });
}

function staticSegmentsInBbox(
  south: number,
  west: number,
  north: number,
  east: number,
): EncroachmentSegment[] {
  const edgeBuffer = 0.06;
  const bufferedSouth = south - edgeBuffer;
  const bufferedWest = west - edgeBuffer;
  const bufferedNorth = north + edgeBuffer;
  const bufferedEast = east + edgeBuffer;

  const segments = encroachmentData.segments as EncroachmentSegment[];
  return segments.filter((segment) => {
    const pointMatch = isPointInBbox(
      segment.lat,
      segment.lng,
      bufferedSouth,
      bufferedWest,
      bufferedNorth,
      bufferedEast,
    );

    if (pointMatch) {
      return true;
    }

    return (
      isBoundaryInBbox(
        segment.boundary_2016,
        bufferedSouth,
        bufferedWest,
        bufferedNorth,
        bufferedEast,
      ) ||
      isBoundaryInBbox(
        segment.boundary_2026,
        bufferedSouth,
        bufferedWest,
        bufferedNorth,
        bufferedEast,
      )
    );
  });
}

function buildResponse(
  segments: EncroachmentSegment[],
  source: string,
  south: number,
  west: number,
  north: number,
  east: number,
  year: "2016" | "2026",
  compareMode: boolean,
): EncroachmentResponse {
  return {
    segments,
    layer: {
      requestedYear: year,
      compareMode,
      availableYears: ["2016", "2026"],
    },
    metadata: {
      source,
      fallbackChain: ["static_app"],
      generatedAt: new Date().toISOString(),
      bbox: {
        south,
        west,
        north,
        east,
      },
    },
  };
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

  if (north <= south || east <= west) {
    return NextResponse.json(
      { error: "Invalid bbox coordinates" },
      { status: 400 },
    );
  }

  const year = searchParams.get("year") === "2016" ? "2016" : "2026";
  const compareMode = searchParams.get("compare") !== "0";
  const staticSegments = staticSegmentsInBbox(south, west, north, east);

  return NextResponse.json(
    buildResponse(
      staticSegments,
      "static_app",
      south,
      west,
      north,
      east,
      year,
      compareMode,
    ),
  );
}
