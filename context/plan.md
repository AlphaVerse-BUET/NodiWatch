# Plan: NodiWatch Phase 2 — Real Prototype, Clean Architecture & Verified Datasets

## TL;DR

Build three production-quality deliverables for NodiWatch: (1) a **clean, visually appealing architecture diagram** (not cluttered), (2) a **real Next.js/TSX web prototype** in `/prototype` folder with proper routing, pages, and components, and (3) **verified real dataset integration** with correct GEE catalog IDs, DOIs, and sample data.

---

## Project Context

- **Project**: NodiWatch — AI-powered satellite surveillance for Bangladesh rivers
- **Three Crises**: নদী দূষণ (Pollution), নদী দখল (Encroachment), নদী ভাঙন (Erosion)
- **Team**: AlphaVerse (5 members)
- **Competition**: Eco-Tech Hackathon 2026 (Phase 2) — Environment Watch: BUET

---

## Task 1: Next.js/TSX Prototype Web Application

### Directory Structure

```
prototype/
├── package.json
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── postcss.config.mjs
├── public/
│   └── favicon.ico
└── src/
    ├── app/
    │   ├── layout.tsx          # Root layout with Navbar
    │   ├── page.tsx             # Landing/Dashboard
    │   ├── globals.css          # Tailwind + custom styles
    │   ├── pollution/
    │   │   └── page.tsx         # Pollution monitoring page
    │   ├── encroachment/
    │   │   └── page.tsx         # Encroachment detection page
    │   ├── erosion/
    │   │   └── page.tsx         # Erosion risk mapping page
    │   ├── datasets/
    │   │   └── page.tsx         # Real datasets documentation
    │   └── about/
    │       └── page.tsx         # About/team page
    ├── components/
    │   ├── Navbar.tsx           # Navigation bar
    │   ├── MapView.tsx          # Leaflet map wrapper
    │   ├── PollutionHeatmap.tsx # Pollution layer
    │   ├── EncroachmentCompare.tsx # Before/after toggle
    │   ├── ErosionCorridors.tsx # Risk corridors
    │   ├── FactoryPanel.tsx     # Attribution sidebar
    │   ├── AlertToast.tsx       # Notification
    │   ├── DatasetCard.tsx      # Dataset info card
    │   └── StatsCard.tsx        # Dashboard stats
    └── data/
        ├── pollution-points.json # ~60 heatmap points (real coords)
        ├── factories.json        # Hazaribagh factory coords from OSM
        ├── encroachment.json     # 2016 vs 2024 Turag boundaries
        ├── erosion-corridors.json # Jamuna risk polygons
        └── datasets.ts           # Dataset metadata with links
```

### Tech Stack

- **Framework**: Next.js 15 (App Router, TypeScript)
- **Styling**: Tailwind CSS + shadcn/ui components
- **Maps**: React-Leaflet + Leaflet.heat
- **Icons**: Lucide React
- **NO separate service required** — all data is static JSON (demo mode)

### Pages & Features

| Page         | Route           | Features                                                         |
| ------------ | --------------- | ---------------------------------------------------------------- |
| Dashboard    | `/`             | Overview stats, tri-layer preview, quick navigation              |
| Pollution    | `/pollution`    | Full-screen heatmap, factory attribution panel, alert simulation |
| Encroachment | `/encroachment` | 2016 vs 2024 river boundary comparison, area loss stats          |
| Erosion      | `/erosion`      | Risk corridor map, retreat rates, Jamuna focus                   |
| Datasets     | `/datasets`     | All real datasets with links, GEE code snippets                  |
| About        | `/about`        | Team info, project description                                   |

---

## Task 2: Clean Architecture Diagram

### Design Principles

- **Simple 3-tier layout** (not 5 crowded layers)
- **Visual hierarchy** with clear flow arrows
- **Icons** instead of text-heavy boxes
- **Color-coded** by domain (teal=data, blue=processing, purple=AI, red=alerts)
- **Minimal text** — only labels, no catalog IDs in the diagram

### Architecture: 3-Tier Simplified

```
┌─────────────────────────────────────────────────────────────────┐
│                    DATA SOURCES                                  │
│  🛰️ Sentinel-2   📡 Sentinel-1   🌍 Landsat   💧 JRC Water     │
│      (10m)          (SAR)          (30m)      (Historical)      │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                 PROCESSING LAYER (GEE + AI)                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐        │
│  │ Water    │  │ Pollution│  │ Erosion  │  │ Factory  │        │
│  │ Segment  │  │ Classify │  │ Forecast │  │ Attribute│        │
│  │ (MNDWI)  │  │ (NDTI/RF)│  │ (SAR/ML) │  │ (Bayes)  │        │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘        │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                    APPLICATIONS                                  │
│  📊 Dashboard   🏦 Banking API   📱 Mobile   🚨 Alerts         │
└─────────────────────────────────────────────────────────────────┘
```

### SVG Design Specs

- **Canvas**: 1200 x 600 (wider, less tall)
- **Background**: Dark gradient (#0a0e1a → #0f172a)
- **Rounded boxes** with subtle shadows
- **Animated gradient arrows** between tiers
- **Clean typography**: Inter font, max 2 weights

---

## Task 3: Real Datasets (Verified)

### Primary Datasets

| Dataset                | GEE Catalog ID                  | Resolution | Coverage                | Use Case                    |
| ---------------------- | ------------------------------- | ---------- | ----------------------- | --------------------------- |
| **Sentinel-2 MSI SR**  | `COPERNICUS/S2_SR_HARMONIZED`   | 10m        | Mar 2017–present, 5-day | NDTI pollution, MNDWI water |
| **Sentinel-1 SAR GRD** | `COPERNICUS/S1_GRD`             | 10m        | 2014–present, 6-12 day  | Erosion (clouds/night OK)   |
| **JRC Surface Water**  | `JRC/GSW1_4/GlobalSurfaceWater` | 30m        | 1984–2021               | Historical encroachment     |
| **Landsat 9 SR**       | `LANDSAT/LC09/C02/T1_L2`        | 30m        | 2021–present, 16-day    | Long-term baseline          |
| **Landsat 8 SR**       | `LANDSAT/LC08/C02/T1_L2`        | 30m        | 2013–present, 16-day    | 10-year archive             |

### Research & Code References

| Reference                   | DOI / Link                                                                                                                           | Description                                     |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------- |
| **Jamuna Erosion GEE Tool** | DOI: `10.5281/zenodo.7252970`                                                                                                        | Freihardt & Frey (2023) — SAR erosion detection |
| **GEE Script (Erosion)**    | [code.earthengine.google.com/b1ba16d48320a3501e89135679d97492](https://code.earthengine.google.com/b1ba16d48320a3501e89135679d97492) | Ready-to-run GEE code                           |
| **JRC Paper (Nature 2016)** | DOI: `10.1038/nature20584`                                                                                                           | High-resolution surface water mapping           |
| **NHESS Paper**             | DOI: `10.5194/nhess-23-751-2023`                                                                                                     | Sentinel-1 erosion methodology                  |

### Spectral Index Formulas

```python
# Water detection (MNDWI)
MNDWI = (Green - SWIR1) / (Green + SWIR1)
# Sentinel-2: (B3 - B11) / (B3 + B11)

# Turbidity (NDTI)
NDTI = (Red - Green) / (Red + Green)
# Sentinel-2: (B4 - B3) / (B4 + B3)

# Water Index (NDWI)
NDWI = (Green - NIR) / (Green + NIR)
# Sentinel-2: (B3 - B8) / (B3 + B8)
```

### OpenStreetMap Factory Data

Overpass API query for Hazaribagh industrial facilities:

```overpass
[out:json];
area[name="Dhaka"]->.searchArea;
(
  node["industrial"](area.searchArea)(23.72,90.35,23.75,90.37);
  node["man_made"="works"](area.searchArea)(23.72,90.35,23.75,90.37);
  way["landuse"="industrial"](area.searchArea)(23.72,90.35,23.75,90.37);
);
out center;
```

---

## Task 4: Sample Data for Prototype

### Pollution Points (Buriganga/Hazaribagh)

Real coordinates based on industrial cluster locations:

- Hazaribagh tannery zone: `23.737°N, 90.358°E` (high NDTI ~0.8-0.95)
- Lalbagh textile area: `23.724°N, 90.389°E` (moderate NDTI ~0.6-0.75)
- Tongi industrial corridor: `23.881°N, 90.401°E` (mixed ~0.65-0.78)
- Savar DEPZ: `23.861°N, 90.331°E` (textile ~0.6-0.7)

### Encroachment Comparison (Turag River)

- **2016 boundary**: Wider river (~310m width at study point)
- **2024 boundary**: Narrower (~185m width) — 40% reduction
- **Coordinates**: `23.89°N - 23.92°N`, `90.38°E - 90.40°E`
- Source: JRC GSW `transition` band (permanent to seasonal/lost)

### Erosion Corridors (Jamuna/Sirajganj)

- **High risk** (red): `24.455°N, 89.725°E` — 45m/year retreat
- **High risk** (red): `24.475°N, 89.705°E` — 38m/year retreat
- **Medium** (orange): `24.415°N, 89.745°E` — 18m/year retreat
- **Low** (green): `24.496°N, 89.684°E` — 3m/year (stable)

---

## Implementation Order

1. **Delete old prototype files** (incomplete Vite setup)
2. **Create Next.js 15 app** with App Router
3. **Install dependencies**: react-leaflet, tailwind, lucide-react
4. **Build components** in order:
   - Navbar → Layout → Dashboard
   - MapView → PollutionHeatmap
   - FactoryPanel → AlertToast
   - EncroachmentCompare → ErosionCorridors
   - DatasetCard → Datasets page
5. **Create clean architecture SVG** (replace existing cluttered one)
6. **Update presentation** to link to new prototype

---

## Verification Checklist

- [ ] `npm run dev` works in /prototype
- [ ] All 6 routes render correctly
- [ ] Map loads with Leaflet tiles
- [ ] Pollution heatmap displays ~60 points
- [ ] Factory click shows attribution panel
- [ ] Alert button triggers toast notification
- [ ] Encroachment page shows 2016 vs 2024 comparison
- [ ] Erosion page shows colored risk corridors
- [ ] Datasets page shows all 5 datasets with correct links
- [ ] Architecture SVG is clean and readable
- [ ] No TypeScript/lint errors
