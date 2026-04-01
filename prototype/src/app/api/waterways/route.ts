import { NextRequest, NextResponse } from "next/server";

type WaterwayPayload = {
  waterways?: unknown[];
};

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const south = searchParams.get("south");
  const west = searchParams.get("west");
  const north = searchParams.get("north");
  const east = searchParams.get("east");

  if (!south || !west || !north || !east) {
    return NextResponse.json(
      { error: "Missing bbox parameters (south, west, north, east required)" },
      { status: 400 },
    );
  }

  const params = new URLSearchParams({ south, west, north, east });
  const targetUrl = `${origin}/api/geo?${params.toString()}`;

  try {
    const response = await fetch(targetUrl, {
      headers: { Accept: "application/json" },
      cache: "no-store",
      signal: AbortSignal.timeout(20000),
    });

    if (!response.ok) {
      const payload = await response.json();
      return NextResponse.json(payload, { status: response.status });
    }

    const payload = (await response.json()) as WaterwayPayload;
    const waterways = payload.waterways || [];

    return NextResponse.json({
      waterways,
      total: waterways.length,
      source: "OpenStreetMap Overpass API",
    });
  } catch {
    return NextResponse.json(
      { waterways: [], total: 0, source: "unavailable" },
      { status: 503 },
    );
  }
}
