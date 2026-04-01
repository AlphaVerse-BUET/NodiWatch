/**
 * API Route: GET /api/gee/pollution
 * Proxies to backend for pollution tile generation
 */

import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    console.log('📡 [Frontend] Fetching pollution tile from backend...');

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
    const response = await fetch(`${backendUrl}/api/gee-pollution?t=${Date.now()}`, {
      cache: 'no-store',
      next: { revalidate: 0 },
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
      redBlueRatio: {
        url: tileUrl,
        description: "Red/Blue ratio for textile dye detection",
        palette: "blue -> purple -> red",
      },
      // Placeholder mapping for UI compatibility; can be split into separate backend tiles later.
      ndti: {
        url: tileUrl,
        description: "NDTI proxy layer (currently mapped to same tile)",
        palette: "blue -> purple -> red",
      },
      cdom: {
        url: tileUrl,
        description: "CDOM proxy layer (currently mapped to same tile)",
        palette: "blue -> purple -> red",
      },
    };
    console.log('✅ Pollution tile URL received from backend');
    return NextResponse.json(normalized, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
      },
    });

  } catch (error: any) {
    console.error('❌ Pollution Route Error:', error?.message || error);
    return NextResponse.json(
      { error: error?.message || 'Failed to get pollution tile from backend' },
      { status: 500 }
    );
  }
}
