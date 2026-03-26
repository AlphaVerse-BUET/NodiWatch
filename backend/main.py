"""
NodiWatch Backend — FastAPI Server
Serves real data from OpenStreetMap and satellite verification via Planetary Computer.
"""

from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import json
import os
from typing import Optional


from osm_data import (
    fetch_real_factories,
    fetch_waterways,
    fetch_dynamic_data,
    run_bayesian_attribution,
    generate_pollution_hotspots,
    RIVERS,
    DHAKA_BBOX,
)

app = FastAPI(
    title="NodiWatch API",
    description="Real satellite data and factory intelligence for Bangladesh river monitoring",
    version="2.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

_cache = {}
DATA_DIR = os.path.join(os.path.dirname(__file__), "data")


def load_cached_data(filename: str):
    """Load pre-computed data from file if available."""
    filepath = os.path.join(DATA_DIR, filename)
    if os.path.exists(filepath):
        with open(filepath) as f:
            return json.load(f)
    return None


@app.get("/")
def root():
    return {
        "name": "NodiWatch API",
        "version": "2.0.0",
        "endpoints": {
            "/api/dynamic": "Real-time waterways + factories + hotspots for any Bangladesh bbox",
            "/api/waterways": "Real OSM river/canal geometries for a bbox",
            "/api/factories": "Real industrial facilities from OpenStreetMap",
            "/api/pollution": "Cached pollution hotspots with spectral indices",
            "/api/attribution": "Bayesian factory attribution for a hotspot",
            "/api/rivers": "Monitored river data (hardcoded Dhaka set)",
            "/api/stats": "Dashboard statistics",
            "/api/verify_satellite": "Real Sentinel-2 scene metadata via Planetary Computer",
        },
    }


@app.get("/api/dynamic")
def get_dynamic_data(
    south: float = Query(..., description="Bounding box south latitude"),
    west: float = Query(..., description="Bounding box west longitude"),
    north: float = Query(..., description="Bounding box north latitude"),
    east: float = Query(..., description="Bounding box east longitude"),
):
    """
    Fetch real OSM waterways + factories + computed hotspots for any viewport in Bangladesh.
    Results cached for 5 minutes per bbox area.
    """
    # Clamp to Bangladesh bounds
    south = max(20.5, min(south, 26.8))
    west = max(88.0, min(west, 92.8))
    north = max(20.5, min(north, 26.8))
    east = max(88.0, min(east, 92.8))

    if north <= south or east <= west:
        raise HTTPException(status_code=400, detail="Invalid bounding box")

    result = fetch_dynamic_data(south, west, north, east)
    return result


@app.get("/api/waterways")
def get_waterways(
    south: float = Query(...),
    west: float = Query(...),
    north: float = Query(...),
    east: float = Query(...),
):
    """Fetch real OSM river/canal geometries for a bounding box."""
    waterways = fetch_waterways(south, west, north, east)
    return {"waterways": waterways, "total": len(waterways), "source": "OpenStreetMap Overpass API"}


@app.get("/api/factories")
def get_factories(
    south: Optional[float] = Query(None),
    west: Optional[float] = Query(None),
    north: Optional[float] = Query(None),
    east: Optional[float] = Query(None),
    river: Optional[str] = Query(None),
    max_distance: int = Query(3000),
    industry: Optional[str] = Query(None),
    refresh: bool = Query(False),
):
    """Get real industrial facilities. Accepts bbox params for dynamic queries."""
    # If bbox provided, fetch live from OSM
    if south is not None and west is not None and north is not None and east is not None:
        factories = fetch_real_factories(south, west, north, east, max_river_distance=max_distance)
        if river:
            factories = [f for f in factories if f["nearest_river"] == river]
        if industry:
            factories = [f for f in factories if f["industry_type"] == industry]
        return {"factories": factories, "total": len(factories), "source": "live_osm"}

    # Otherwise use cached data
    if not refresh:
        cached = load_cached_data("real_factories.json")
        if cached:
            factories = cached.get("factories", [])
            if river:
                factories = [f for f in factories if f["nearest_river"] == river]
            if industry:
                factories = [f for f in factories if f["industry_type"] == industry]
            return {"factories": factories, "total": len(factories), "source": "cached"}

    factories = fetch_real_factories(max_river_distance=max_distance)
    if river:
        factories = [f for f in factories if f["nearest_river"] == river]
    if industry:
        factories = [f for f in factories if f["industry_type"] == industry]
    return {"factories": factories, "total": len(factories), "source": "live_osm"}


@app.get("/api/pollution")
def get_pollution(
    river: Optional[str] = Query(None),
    severity: Optional[str] = Query(None),
):
    """Get cached pollution hotspots with spectral index estimates."""
    cached = load_cached_data("real_pollution_hotspots.json")
    if cached:
        hotspots = cached.get("hotspots", [])
    else:
        factory_data = load_cached_data("real_factories.json")
        factories = factory_data.get("factories", []) if factory_data else []
        if not factories:
            factories = fetch_real_factories()
        hotspots = generate_pollution_hotspots(factories)

    if river:
        hotspots = [h for h in hotspots if h.get("river_id") == river]
    if severity:
        hotspots = [h for h in hotspots if h["severity"] == severity]
    return {"hotspots": hotspots, "total": len(hotspots)}


@app.get("/api/attribution")
def get_attribution(
    lat: float = Query(...),
    lng: float = Query(...),
    pollution_type: str = Query("mixed"),
    radius: int = Query(2000),
):
    """Run Bayesian factory attribution for a given pollution hotspot."""
    factory_data = load_cached_data("real_factories.json")
    factories = factory_data.get("factories", []) if factory_data else []
    if not factories:
        factories = fetch_real_factories()

    results = run_bayesian_attribution(lat, lng, pollution_type, factories, max_distance=radius)
    return {
        "hotspot": {"lat": lat, "lng": lng, "type": pollution_type},
        "attributed_factories": results,
        "methodology": "Bayesian spatial probability: P(factory|pollution) ∝ P(spectral_match|industry_type) × P(proximity)",
        "disclaimer": "Spatial heuristic ranking — indicates cluster-level probability, not definitive source identification.",
    }


@app.get("/api/rivers")
def get_rivers():
    """Get hardcoded Dhaka river polylines."""
    rivers_out = []
    for rid, rdata in RIVERS.items():
        rivers_out.append({
            "id": rid,
            "name": rdata["name"],
            "coordinates": [{"lng": c[0], "lat": c[1]} for c in rdata["coords"]],
        })
    return {"rivers": rivers_out, "total": len(rivers_out)}


@app.get("/api/stats")
def get_stats():
    """Get dashboard statistics from cached data."""
    factory_data = load_cached_data("real_factories.json")
    pollution_data = load_cached_data("real_pollution_hotspots.json")

    factories = factory_data.get("factories", []) if factory_data else []
    hotspots = pollution_data.get("hotspots", []) if pollution_data else []

    from collections import Counter
    industry_counts = Counter(f["industry_type"] for f in factories)
    severity_counts = Counter(h["severity"] for h in hotspots)
    river_counts = Counter(f["nearest_river"] for f in factories)

    return {
        "total_factories": len(factories),
        "total_hotspots": len(hotspots),
        "total_rivers_monitored": 5,
        "critical_hotspots": severity_counts.get("critical", 0),
        "high_hotspots": severity_counts.get("high", 0),
        "factories_by_type": dict(industry_counts),
        "factories_by_river": {RIVERS[r]["name"]: c for r, c in river_counts.items() if r in RIVERS},
    }


@app.get("/api/verify_satellite")
async def verify_satellite(
    lat: float = Query(..., description="Latitude of the location"),
    lng: float = Query(..., description="Longitude of the location"),
):
    """
    Fetch real Sentinel-2 scene metadata and preview image for a location.
    Uses Microsoft Planetary Computer STAC API (free, no account required).
    Returns scene date, cloud cover, and a signed preview thumbnail URL.
    """
    try:
        import pystac_client
        import planetary_computer

        catalog = pystac_client.Client.open(
            "https://planetarycomputer.microsoft.com/api/stac/v1",
            modifier=planetary_computer.sign_inplace,
        )

        search = catalog.search(
            collections=["sentinel-2-l2a"],
            intersects={"type": "Point", "coordinates": [lng, lat]},
            datetime="2023-01-01/2025-12-31",
            query={"eo:cloud_cover": {"lt": 30}},
            max_items=5,
        )

        items = list(search.items())
        if not items:
            raise HTTPException(status_code=404, detail="No clear-sky Sentinel-2 scene found for this location")

        # Sort by date descending, pick most recent
        items.sort(key=lambda i: i.datetime or "", reverse=True)
        item = items[0]

        # Get preview thumbnail URL
        preview_url = None
        for asset_key in ["rendered_preview", "visual"]:
            if asset_key in item.assets:
                preview_url = item.assets[asset_key].href
                break

        return {
            "scene_date": item.datetime.strftime("%Y-%m-%d") if item.datetime else "Unknown",
            "cloud_cover": round(item.properties.get("eo:cloud_cover", 0)),
            "platform": item.properties.get("platform", "sentinel-2").upper(),
            "scene_id": item.id,
            "preview_url": preview_url,
            "satellite": "Sentinel-2 L2A (ESA Copernicus)",
            "source": "Microsoft Planetary Computer — free public STAC API",
            "bands_available": list(item.assets.keys()),
        }

    except ImportError:
        raise HTTPException(
            status_code=503,
            detail="Satellite verification requires: pip install pystac-client planetary-computer"
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Satellite lookup failed: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
