import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    name: "NodiWatch API",
    version: "2.0.0",
    endpoints: {
      "/api/dynamic":
        "Prototype dynamic waterways + factories + hotspots for any Bangladesh bbox",
      "/api/waterways": "Waterway geometries for a bbox",
      "/api/factories": "Industrial facilities with optional bbox filters",
      "/api/pollution": "Cached pollution hotspots with spectral indices",
      "/api/attribution": "Bayesian factory attribution for a hotspot",
      "/api/rivers": "Monitored river data",
      "/api/stats": "Dashboard statistics",
      "/api/verify_satellite":
        "Sentinel-2 scene metadata via Planetary Computer",
    },
    source: "prototype",
  });
}
