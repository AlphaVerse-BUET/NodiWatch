/**
 * API Route: GET /api/gee/erosion
 * Proxies to backend for SAR erosion tile generation
 */

import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    console.log('📡 [Frontend] Fetching erosion tile from backend...');

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
    const timestamp = Date.now();
    const response = await fetch(`${backendUrl}/api/gee-erosion?t=${timestamp}`, {
      cache: 'no-store'
    });

    if (!response.ok) {
      const error = await response.text();
      console.error(`❌ Backend error (${response.status}):`, error);
      return NextResponse.json(
        { error: `Backend returned ${response.status}: ${error}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    const tileUrl = data?.tile_url as string | undefined;
    if (!tileUrl) {
      return NextResponse.json(
        { error: "Backend response missing tile_url" },
        { status: 502 }
      );
    }

    const normalized = {
      sar_erosion: {
        url: tileUrl,
        description: "Sentinel-1 SAR erosion detection",
        interpretation: "Green=stable, Yellow=moderate, Red=critical",
        methodology: "VV polarization median composite",
      },
    };
    console.log('✅ Erosion tile URL received from backend');
    return NextResponse.json(normalized);

  } catch (error: any) {
    console.error('❌ Erosion Route Error:', error?.message || error);
    return NextResponse.json(
      { error: error?.message || 'Failed to get erosion tile from backend' },
      { status: 500 }
    );
  }
}
