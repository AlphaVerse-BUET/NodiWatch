import { NextResponse } from "next/server";
import { LEGACY_RIVERS } from "@/lib/legacy-rivers";

export async function GET() {
  const rivers = Object.entries(LEGACY_RIVERS).map(([id, riverData]) => ({
    id,
    name: riverData.name,
    coordinates: riverData.coords.map((coordinate) => ({
      lng: coordinate[0],
      lat: coordinate[1],
    })),
  }));

  return NextResponse.json({
    rivers,
    total: rivers.length,
  });
}
