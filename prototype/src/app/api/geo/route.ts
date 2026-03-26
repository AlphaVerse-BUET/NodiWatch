import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const south = searchParams.get("south");
  const west = searchParams.get("west");
  const north = searchParams.get("north");
  const east = searchParams.get("east");

  if (!south || !west || !north || !east) {
    return NextResponse.json(
      { error: "Missing bbox parameters (south, west, north, east required)" },
      { status: 400 }
    );
  }

  try {
    const url = `${BACKEND_URL}/api/dynamic?south=${south}&west=${west}&north=${north}&east=${east}`;
    const res = await fetch(url, {
      signal: AbortSignal.timeout(30000),
      headers: { Accept: "application/json" },
    });

    if (!res.ok) {
      throw new Error(`Backend returned ${res.status}`);
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    // Backend unavailable — return empty arrays so map shows static fallback
    return NextResponse.json(
      {
        error: "Backend unavailable",
        waterways: [],
        factories: [],
        hotspots: [],
      },
      { status: 503 }
    );
  }
}
