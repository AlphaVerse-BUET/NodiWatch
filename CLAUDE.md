# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**NodiWatch** is a satellite surveillance platform for monitoring Bangladesh river health (pollution, encroachment, erosion) for the AlphaVerse team at the Eco-Tech Hackathon 2026 (BUET). It uses Sentinel-2/Sentinel-1 imagery processed via Google Earth Engine, real factory data from OpenStreetMap, and Gemini AI for analysis.

## Development Commands

### Frontend (`/prototype`)

```bash
cd prototype
npm install          # Install dependencies
npm run dev          # Start dev server (http://localhost:3000)
npm run build        # Production build — run this to verify no TypeScript errors
npm run lint         # ESLint check
```

### Backend (`/backend`)

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000   # Start API server (http://localhost:8000)
# Interactive API docs: http://localhost:8000/docs
```

### Presentation PDF (`/presentation`)

```bash
cd presentation
npm install
node convert_to_pdf.js   # Generate NodiWatch_Presentation.pdf via Puppeteer
```

## Architecture

### Frontend — Next.js 14 App Router (`/prototype/src/`)

Pages: `/` (dashboard), `/pollution`, `/encroachment`, `/erosion`, `/evidence`, `/reports`, `/datasets`, `/about`, `/analysis`, `/validation`

- **`app/api/ai/`** — Three server-side API routes (`analyze`, `chat`, `report`) that proxy to Google Gemini. `GEMINI_API_KEY` must never be `NEXT_PUBLIC_` prefixed.
- **`components/maps/`** — Leaflet-based maps. **Must always be dynamically imported with `ssr: false`** — Leaflet breaks on SSR.
- **`components/AIChatbot.tsx`** — Floating Gemini chatbot; rendered in root layout. Page context descriptions live in the `PAGE_CONTEXT` map at the top of this file.
- **`lib/gemini.ts`** — Central Gemini 2.5 Flash service: `analyzeEnvironmentalImage()`, `chatWithNodiWatch()`, `generateReportSummary()`.
- **`data/`** — Static JSON/TS data files. These are pre-computed, methodology-backed values — not randomly generated placeholders.
- **`app/validation/page.tsx`** — Shows confusion matrix, accuracy metrics (OA/Kappa/F1), known limitations table, and peer-reviewed references. Linked in Navbar.

### Backend — FastAPI (`/backend/`)

- **`main.py`** — 5 endpoints: `/api/factories`, `/api/pollution`, `/api/attribution`, `/api/rivers`, `/api/stats`.
- **`osm_data.py`** — Fetches real industrial facilities from Overpass API and runs Bayesian spatial attribution (ranks factories by proximity + industry type match to a hotspot).
- **`data/`** — Cached real data (`real_factories.json`, `real_pollution_hotspots.json`). Backend prefers cached files to avoid repeated Overpass API calls.
- **Dependencies**: Only `fastapi`, `uvicorn[standard]`, `requests`, `geojson`, `python-dotenv`. No scipy/numpy/earthengine — backend is pure Python + HTTP.

The backend is **optional**. The frontend operates fully standalone using `prototype/src/data/` JSON files.

### Google Earth Engine Scripts (`/gee_scripts/`)

Run in the GEE Code Editor (not locally). Used for live demo during presentation:
1. `01_water_segmentation.js` — MNDWI water mask + 2016 vs 2026 river width comparison
2. `02_pollution_indices.js` — NDTI, CDOM, Red/Blue ratio spectral fingerprinting
3. `03_sar_erosion.js` — Sentinel-1 SAR pre/post-monsoon bank change detection
4. `04_validation.js` — Confusion matrix + accuracy metrics (OA, Kappa, F1)

## Deployment

| Service | Platform | Config file |
|---|---|---|
| Frontend (Next.js) | Vercel | `prototype/vercel.json` |
| Backend (FastAPI) | Render | `render.yaml` (root) |

**Vercel**: Set env var `GEMINI_API_KEY` in project settings. Root directory = `prototype`.

**Render**: Root directory = `backend`. Build: `pip install -r requirements.txt`. Start: `uvicorn main:app --host 0.0.0.0 --port $PORT`. Python 3.11+ recommended (avoid 3.14 — package wheel availability issues).

## Environment Variables

`prototype/.env.local` (gitignored, never commit):
```
GEMINI_API_KEY=your_gemini_key_here
```
See `prototype/.env.example` for documentation.

## Data Accuracy — What's Real vs Estimated

| Data | Source |
|---|---|
| Factory locations/names | Real OSM Overpass API data (45 facilities) |
| Pollution spectral values (NDTI, CDOM, R/B ratio) | Calibrated from published Buriganga water quality literature at real industrial zone coordinates |
| Encroachment boundaries | MNDWI temporal differencing methodology, real river coordinates (5 segments) |
| Erosion corridors | SAR coherence methodology per Freihardt & Frey (2023), real Jamuna/Sirajganj coordinates (5 corridors) |
| Validation metrics | Computed from confusion matrix (2000 stratified reference points) |

Live GEE satellite pulls are not performed at runtime — processing takes 2–5 min and requires authenticated GEE account. Pre-computed results are served instead.

## Hallucination Constraints — Never Add These Back

The following claims were deliberately removed because they are scientifically wrong:

- **"Real-time"** — Sentinel-2 has a 5-day revisit. Always say "near-real-time" or "periodic automated monitoring"
- **Thermal measurements** — Sentinel-2 has NO thermal bands. Never add `thermal` fields to pollution data
- **"Dissolved O₂" from satellite** — Cannot be measured from Sentinel-2 spectral bands
- **"CNN water segmentation"** — We use MNDWI index, not a trained CNN
- **"Court-ready" / "court-admissible" / "legal-grade"** — 10m pixels cannot provide legal proof. Use "enforcement triage intelligence"
- **Arbitrary "Threat Score X/10"** — No validated methodology. Use actual spectral index values

Landsat 8/9 legitimately has thermal bands (TIRS) — this is not a hallucination.

## Important Design Decisions

- **Bayesian attribution is probabilistic**: Rankings are spatial heuristics (proximity + industry type), not confirmed source identification.
- **Enforcement triage framing**: System prioritizes agency investigation targets, not standalone legal proof.
- **10m resolution limit**: Cannot detect encroachment narrower than 10m. Agencies should use drones for sub-meter verification.
- **No test suite**: Validate backend via FastAPI `/docs`, frontend via `npm run build` (TypeScript catches most errors).
- **lucide-react pinned to 0.454.0**: Versions above this may ship without `.d.ts` type files, breaking the TypeScript build.
