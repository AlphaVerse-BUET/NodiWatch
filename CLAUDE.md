# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**NodiWatch** is a satellite surveillance platform for monitoring Bangladesh river health. It detects pollution, encroachment, and erosion using satellite imagery, OpenStreetMap data, and AI analysis.

## Development Commands

### Frontend (`/prototype`)

```bash
cd prototype
npm install          # Install dependencies
npm run dev          # Start dev server (http://localhost:3000)
npm run build        # Production build
npm run lint         # ESLint check
```

### Backend (`/backend`)

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000   # Start API server (http://localhost:8000)
# Interactive API docs available at http://localhost:8000/docs
```

### Presentation PDF (`/presentation`)

```bash
cd presentation
npm install
node convert_to_pdf.js   # Generate NodiWatch_Presentation.pdf via Puppeteer
```

## Architecture

### Frontend — Next.js 14 App Router (`/prototype/src/`)

- **`app/`** — Pages and API routes. Uses dynamic imports (`next/dynamic`) for all Leaflet map components to avoid SSR issues.
- **`app/api/ai/`** — Three AI endpoints (`analyze`, `chat`, `report`) that proxy calls to Google Gemini.
- **`components/maps/`** — Leaflet-based maps. Must be dynamically imported with `ssr: false`.
- **`components/charts/`** — Recharts visualizations (factory attribution, trends, timeline comparisons).
- **`components/AIChatbot.tsx`** — Floating chatbot powered by Gemini; rendered in root layout.
- **`lib/gemini.ts`** — Central Gemini 2.5 Flash service with three functions: `analyzeEnvironmentalImage()`, `chatWithNodiWatch()`, `generateReportSummary()`.
- **`data/`** — Static JSON/TS data files for factories, pollution hotspots, encroachment, erosion corridors, rivers, and evidence reports.

### Backend — FastAPI (`/backend/`)

- **`main.py`** — API server with endpoints: `/api/factories`, `/api/pollution`, `/api/attribution`, `/api/rivers`, `/api/stats`.
- **`osm_data.py`** — Fetches real industrial facilities from the Overpass API (OpenStreetMap) and runs Bayesian spatial attribution to rank factories by proximity to a pollution hotspot.
- **`convert_to_frontend.py`** — Transforms cached OSM data (`data/`) into frontend-ready JSON format.
- **`data/`** — Cached real data (`real_factories.json`, `real_pollution_hotspots.json`) to avoid repeated Overpass API calls.

The backend is an optional data service; the frontend can operate standalone using data files in `prototype/src/data/`.

### Google Earth Engine Scripts (`/gee_scripts/`)

Four JavaScript scripts run in the GEE Code Editor (not locally):
1. `01_water_segmentation.js` — MNDWI water mask + river width change detection (2016 vs 2026)
2. `02_pollution_indices.js` — NDTI, CDOM, Red/Blue ratio for spectral pollution fingerprinting
3. `03_sar_erosion.js` — Sentinel-1 SAR backscatter for monsoon-season erosion tracking
4. `04_validation.js` — Ground-truth validation framework

## Key Environment Variables

The frontend uses a Google Gemini API key. Set it in `prototype/.env.local`:

```
GEMINI_API_KEY=your_key_here
```

## Important Design Decisions

- **Bayesian attribution, not deterministic**: Factory-to-hotspot links are probabilistic rankings based on spatial proximity and industry type, not confirmed causal links.
- **Enforcement triage, not legal proof**: The system is designed to prioritize investigation targets, not serve as court evidence.
- **Sentinel-2 resolution limitation**: 10m/pixel resolution constrains encroachment detection accuracy for narrow river boundaries.
- **No test suite**: The project has no automated tests. Validate backend via FastAPI `/docs` and frontend via manual browser testing.
