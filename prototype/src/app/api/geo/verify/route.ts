import { NextRequest, NextResponse } from "next/server";

type StacSearchResponse = {
  features?: Array<{
    id: string;
    properties?: {
      datetime?: string;
      platform?: string;
      [key: string]: unknown;
    };
    assets?: Record<string, { href?: string }>;
  }>;
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");

  if (!lat || !lng) {
    return NextResponse.json(
      { error: "Missing lat/lng parameters" },
      { status: 400 },
    );
  }

  const latNum = Number.parseFloat(lat);
  const lngNum = Number.parseFloat(lng);

  if (!Number.isFinite(latNum) || !Number.isFinite(lngNum)) {
    return NextResponse.json(
      { error: "Invalid lat/lng parameters" },
      { status: 400 },
    );
  }

  try {
    const searchResponse = await fetch(
      "https://planetarycomputer.microsoft.com/api/stac/v1/search",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/geo+json",
        },
        body: JSON.stringify({
          collections: ["sentinel-2-l2a"],
          intersects: {
            type: "Point",
            coordinates: [lngNum, latNum],
          },
          datetime: "2023-01-01T00:00:00Z/2026-12-31T23:59:59Z",
          query: {
            "eo:cloud_cover": { lt: 30 },
          },
          limit: 5,
          sortby: [
            {
              field: "properties.datetime",
              direction: "desc",
            },
          ],
        }),
        signal: AbortSignal.timeout(20000),
      },
    );

    if (!searchResponse.ok) {
      return NextResponse.json(
        { error: "Satellite verification unavailable" },
        { status: 503 },
      );
    }

    const searchData = (await searchResponse.json()) as StacSearchResponse;
    const features = searchData.features || [];

    if (features.length === 0) {
      return NextResponse.json(
        { error: "No clear-sky Sentinel-2 scene found for this location" },
        { status: 404 },
      );
    }

    const item = features[0];
    const assets = item.assets || {};
    const previewUrl =
      assets.rendered_preview?.href || assets.visual?.href || null;

    const datetime = item.properties?.datetime;
    const cloudCoverRaw = item.properties?.["eo:cloud_cover"];
    const cloudCover =
      typeof cloudCoverRaw === "number" ? Math.round(cloudCoverRaw) : 0;

    return NextResponse.json({
      scene_date: datetime ? datetime.slice(0, 10) : "Unknown",
      cloud_cover: cloudCover,
      platform: String(item.properties?.platform || "sentinel-2").toUpperCase(),
      scene_id: item.id,
      preview_url: previewUrl,
      satellite: "Sentinel-2 L2A (ESA Copernicus)",
      source: "Microsoft Planetary Computer STAC API",
      bands_available: Object.keys(assets),
    });
  } catch {
    return NextResponse.json(
      { error: "Satellite verification unavailable" },
      { status: 503 },
    );
  }
}
