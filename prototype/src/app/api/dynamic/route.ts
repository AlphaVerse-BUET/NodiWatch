import { NextRequest, NextResponse } from "next/server";

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

    const payload = await response.json();
    return NextResponse.json(payload, { status: response.status });
  } catch {
    return NextResponse.json(
      { error: "Dynamic data unavailable" },
      { status: 503 },
    );
  }
}
