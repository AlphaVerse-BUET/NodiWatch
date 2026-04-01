**Current Architecture**

1. **Frontend app (Next.js 14, App Router)**
- UI pages for dashboard, pollution, encroachment, erosion, reports, datasets, etc.
- Leaflet-based map components render:
  - Base map tiles (satellite/dark)
  - Static/local data layers
  - Live GEE tile overlays (pollution, water masks, erosion)
- Frontend calls internal API routes first (`/api/gee/*`, `/api/geo`), not GEE directly.

2. **Next.js BFF/API layer (inside frontend project)**
- Acts as a secure proxy and cache-control layer.
- Routes:
  - `/api/gee/pollution`
  - `/api/gee/water`
  - `/api/gee/erosion`
- These routes call the Python backend and return normalized JSON for map components.

3. **Backend API (FastAPI)**
- Core geo/data API + GEE tile generation.
- Existing endpoints for OSM factories/waterways/hotspots/stats.
- New GEE endpoints generate temporary Earth Engine tile URLs server-side using service account credentials.
- Backend is where credentials and Earth Engine auth live.

4. **Data and compute sources**
- **Live**: Google Earth Engine (tile generation), OSM Overpass (factories/waterways).
- **Precomputed fallback**: JSON files for hotspots, encroachment zones, erosion corridors, rivers.
- Map UX remains usable even if live calls fail (fallback behavior).

5. **Deployment shape**
- Frontend on Vercel.
- Backend on Render/local Uvicorn.
- Environment-driven connection (`NEXT_PUBLIC_BACKEND_URL`).

---

**Technologies Used**

1. **Frontend**
- Next.js 14
- React + TypeScript
- React-Leaflet / Leaflet
- Tailwind CSS
- Dynamic imports for map SSR safety

2. **Backend**
- FastAPI
- Uvicorn
- Python requests + geojson utilities
- `python-dotenv` for secrets/config

3. **Geospatial / Remote sensing**
- Google Earth Engine (server-side auth with service account)
- Sentinel-2 (pollution/water masking)
- Sentinel-1 SAR (erosion change logic)

4. **External APIs**
- OSM Overpass API
- Microsoft Planetary Computer STAC (satellite verification route)

5. **Dev/Deploy**
- Node/npm (frontend)
- Python/pip (backend)
- Vercel + Render deployment targets
