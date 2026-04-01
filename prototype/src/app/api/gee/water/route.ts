/**
 * API Route: GET /api/gee/water
 * Proxies to backend for water segmentation tile generation
 */

import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    console.log('📡 [Frontend] Fetching water tile from backend...');
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
    const timestamp = Date.now();
    const fetchOpts: RequestInit = {
      cache: 'no-store',
      next: { revalidate: 0 },
    };

    const [baselineResponse, currentResponse] = await Promise.all([
      fetch(`${backendUrl}/api/gee-water?year=2016&t=${timestamp}`, fetchOpts),
      fetch(`${backendUrl}/api/gee-water?year=2026&t=${timestamp}`, fetchOpts),
    ]);

    if (!baselineResponse.ok || !currentResponse.ok) {
      const baselineError = baselineResponse.ok ? "" : await baselineResponse.text();
      const currentError = currentResponse.ok ? "" : await currentResponse.text();
      const status = baselineResponse.ok ? currentResponse.status : baselineResponse.status;
      console.error(`❌ Backend water error (${status})`, baselineError || currentError);
      return NextResponse.json(
        { error: `Backend returned ${status}: ${baselineError || currentError}` },
        { status }
      );
    }

    const [baselineData, currentData] = await Promise.all([
      baselineResponse.json(),
      currentResponse.json(),
    ]);

    const baselineUrl = baselineData?.tile_url as string | undefined;
    const currentUrl = currentData?.tile_url as string | undefined;
    if (!baselineUrl || !currentUrl) {
      return NextResponse.json(
        { error: "Backend response missing tile_url for water layers" },
        { status: 502 }
      );
    }

    const normalized = {
      baseline_2016: {
        url: baselineUrl,
        year: 2016,
        description: "MNDWI baseline water mask",
      },
      current_2026: {
        url: currentUrl,
        year: 2026,
        description: "MNDWI current water mask",
      },
    };

    console.log('✅ Water tile URLs received from backend (2016 + 2026)');
    return NextResponse.json(normalized);

  } catch (error: any) {
    console.error('❌ Water Route Error:', error?.message || error);
    return NextResponse.json(
      { error: error?.message || 'Failed to get water tile from backend' },
      { status: 500 }
    );
  }
}
