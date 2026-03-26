"""
NodiWatch Backend — FastAPI Server
Serves real data from OpenStreetMap and Google Earth Engine.
"""

from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import json
import os
from typing import Optional

from osm_data import (
    fetch_real_factories,
    run_bayesian_attribution,
    generate_pollution_hotspots,
    RIVERS,
    DHAKA_BBOX,
)

app = FastAPI(
    title="NodiWatch API",
    description="Real satellite data and factory intelligence for Bangladesh river monitoring",
    version="1.0.0",
)

# Allow frontend to call this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Cache for fetched data
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
        "version": "1.0.0",
        "endpoints": {
            "/api/factories": "Real industrial facilities from OpenStreetMap",
            "/api/pollution": "Pollution hotspots with spectral indices",
            "/api/attribution": "Bayesian factory attribution for a hotspot",
            "/api/rivers": "Monitored river data",
            "/api/stats": "Dashboard statistics",
        },
        "data_source": "OpenStreetMap Overpass API + Google Earth Engine",
    }


@app.get("/api/factories")
def get_factories(
    river: Optional[str] = Query(None, description="Filter by river ID (buriganga, turag, etc.)"),
    max_distance: int = Query(3000, description="Max distance from river in meters"),
    industry: Optional[str] = Query(None, description="Filter by industry type"),
    refresh: bool = Query(False, description="Force refresh from OSM"),
):
    """Get real industrial facilities from OpenStreetMap."""
    # Try cached data first
    if not refresh:
        cached = load_cached_data("real_factories.json")
        if cached:
            factories = cached.get("factories", [])
            if river:
                factories = [f for f in factories if f["nearest_river"] == river]
            if industry:
                factories = [f for f in factories if f["industry_type"] == industry]
            return {"factories": factories, "total": len(factories), "source": "cached"}

    # Fetch fresh from OSM
    factories = fetch_real_factories(max_river_distance=max_distance)
    if river:
        factories = [f for f in factories if f["nearest_river"] == river]
    if industry:
        factories = [f for f in factories if f["industry_type"] == industry]
    return {"factories": factories, "total": len(factories), "source": "live_osm"}


@app.get("/api/pollution")
def get_pollution(
    river: Optional[str] = Query(None, description="Filter by river ID"),
    severity: Optional[str] = Query(None, description="Filter by severity level"),
):
    """Get pollution hotspots with real spectral index estimates."""
    cached = load_cached_data("real_pollution_hotspots.json")
    if cached:
        hotspots = cached.get("hotspots", [])
    else:
        # Generate on the fly
        factory_data = load_cached_data("real_factories.json")
        if factory_data:
            factories = factory_data.get("factories", [])
        else:
            factories = fetch_real_factories()
        hotspots = generate_pollution_hotspots(factories)

    if river:
        hotspots = [h for h in hotspots if h["river_id"] == river]
    if severity:
        hotspots = [h for h in hotspots if h["severity"] == severity]

    return {"hotspots": hotspots, "total": len(hotspots)}


@app.get("/api/attribution")
def get_attribution(
    lat: float = Query(..., description="Hotspot latitude"),
    lng: float = Query(..., description="Hotspot longitude"),
    pollution_type: str = Query("mixed", description="Pollution type: high_organic, high_dye, mixed"),
    radius: int = Query(2000, description="Search radius in meters"),
):
    """Run Bayesian factory attribution for a given pollution hotspot."""
    factory_data = load_cached_data("real_factories.json")
    if factory_data:
        factories = factory_data.get("factories", [])
    else:
        factories = fetch_real_factories()

    results = run_bayesian_attribution(lat, lng, pollution_type, factories, max_distance=radius)
    return {
        "hotspot": {"lat": lat, "lng": lng, "type": pollution_type},
        "attributed_factories": results,
        "methodology": "Bayesian spatial probability: P(factory|pollution) ∝ P(spectral_match|industry_type) × P(proximity)",
        "disclaimer": "This is a spatial heuristic ranking, not a definitive source identification. Results indicate cluster-level probability.",
    }


@app.get("/api/rivers")
def get_rivers():
    """Get monitored river data."""
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
    """Get dashboard statistics from real data."""
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


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
