import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = (
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000"
).replace(/\/$/, "");

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");

  if (!lat || !lng) {
    return NextResponse.json(
      { error: "Missing lat/lng parameters" },
      { status: 400 }
    );
  }

  try {
    const url = `${BACKEND_URL}/api/verify_satellite?lat=${lat}&lng=${lng}`;
    const res = await fetch(url, {
      signal: AbortSignal.timeout(60000), // satellite lookup can take up to 60s
      headers: { Accept: "application/json" },
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.ok ? 200 : res.status });
  } catch {
    return NextResponse.json(
      { error: "Satellite verification unavailable" },
      { status: 503 }
    );
  }
}
