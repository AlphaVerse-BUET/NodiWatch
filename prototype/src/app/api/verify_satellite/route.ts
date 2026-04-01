import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");

  if (!lat || !lng) {
    return NextResponse.json(
      { error: "Missing lat/lng parameters" },
      { status: 400 },
    );
  }

  const params = new URLSearchParams({ lat, lng });
  const targetUrl = `${origin}/api/geo/verify?${params.toString()}`;

  try {
    const response = await fetch(targetUrl, {
      headers: { Accept: "application/json" },
      cache: "no-store",
      signal: AbortSignal.timeout(30000),
    });

    const payload = await response.json();
    return NextResponse.json(payload, { status: response.status });
  } catch {
    return NextResponse.json(
      { error: "Satellite verification unavailable" },
      { status: 503 },
    );
  }
}
