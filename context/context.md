# NodiWatch — Project Context & Analysis

> **Project:** NodiWatch — AI-Powered Satellite Surveillance for Bangladesh's River Ecosystems  
> **Team:** AlphaVerse  
> **Hackathon:** Eco-Tech Hackathon 2026 (Environment Watch: BUET)  
> **Current Stage:** Stage 2 — Working Prototype Demo  
> **Last Updated:** 2026-03-09

---

## 1. Project Overview

NodiWatch is an AI-powered satellite surveillance system that addresses two critical environmental issues in Bangladesh:

1. **The Accountability Gap** — Among 2,500+ factories on Dhaka's river system, pinpointing the exact pollution source is nearly impossible without spectral evidence.
2. **Silent Encroachment (নদী দখল)** — 40% of Dhaka's riverbanks have been illegally seized through slow, incremental land filling.

### Core Features

| Feature                       | Description                                                                            |
| ----------------------------- | -------------------------------------------------------------------------------------- |
| **Pollution Fingerprinting**  | Classifies polluter type (textile dye, tannery, thermal) via NDTI, NDWI, thermal bands |
| **Encroachment Detection**    | CNN-based water segmentation comparing 2016 vs 2026 river boundaries                   |
| **Probabilistic Attribution** | Bayesian model ranking nearby factories by pollution likelihood using OSM data         |
| **Dual Heatmap Dashboard**    | Red (pollution severity) + Yellow (encroachment severity) interactive visualization    |
| **Real-time Alerts**          | Automated notifications for pollution spikes and encroachment threshold breaches       |
| **Evidence Reports**          | Court-ready satellite evidence documents for legal proceedings                         |
| **Citizen Ground-Truth**      | Community photo uploads to validate satellite findings                                 |

---

## 2. Technology Stack

| Layer            | Technology                   | Purpose                                                  |
| ---------------- | ---------------------------- | -------------------------------------------------------- |
| Satellite Data   | Sentinel-2, Landsat 8/9      | 10m resolution multispectral imagery (free)              |
| Cloud Processing | Google Earth Engine (GEE)    | Multi-year satellite data processing (free for research) |
| AI Layer 1       | TensorFlow / CNN             | Water pixel segmentation → river boundary tracking       |
| AI Layer 2       | Scikit-learn / Random Forest | Spectral signature classification → pollution typing     |
| AI Layer 3       | Bayesian Model               | Probabilistic factory attribution                        |
| Geospatial DB    | PostGIS                      | Historical comparison storage                            |
| Industry Data    | OpenStreetMap API            | Factory/industry geolocation                             |
| Frontend         | React / Next.js              | Interactive dashboard with dual heatmaps                 |
| API Layer        | Next.js Route Handlers       | API endpoints, model inference                           |

---

## 3. Dataset Availability Analysis

### ✅ Freely Available Datasets

#### 3.1 Satellite Imagery

| Dataset         | Source        | Resolution     | Cost     | Access Method                                  |
| --------------- | ------------- | -------------- | -------- | ---------------------------------------------- |
| **Sentinel-2**  | EU Copernicus | 10m (13 bands) | **FREE** | Copernicus Data Space, GEE, USGS EarthExplorer |
| **Landsat 8/9** | USGS/NASA     | 30m (11 bands) | **FREE** | USGS EarthExplorer, GEE                        |
| **MODIS**       | NASA          | 250m–1km       | **FREE** | NASA Earthdata, GEE                            |

> **Key Advantage:** Both Sentinel-2 (since 2015) and Landsat (since 1972) are publicly funded — 10+ years of archival data available at zero cost.

#### 3.2 Water Segmentation Training Datasets (for CNN)

| Dataset                         | Images      | Source        | Details                                                                  |
| ------------------------------- | ----------- | ------------- | ------------------------------------------------------------------------ |
| **Sentinel River Segmentation** | 2,961       | GitHub        | 400×400 Sentinel-2 images with water masks, multiple climate zones       |
| **S1S2-Water**                  | 65 triplets | Zenodo/GitHub | Global dataset, Sentinel-1 + Sentinel-2, binary water masks, DEM rasters |
| **GLH-Water**                   | 250 images  | GitHub        | Very-high-res (0.3m), 40.96B labeled pixels                              |
| **Kaggle Water Bodies**         | Various     | Kaggle        | Sentinel-2 imagery with NWDI-generated masks                             |
| **Gaofen Challenge 2020**       | 1,000       | Baidudrive    | GF-2 satellite, 1-4m resolution                                          |

#### 3.3 Industry/Factory Geolocation

| Source             | Type                        | Cost     | Notes                                                     |
| ------------------ | --------------------------- | -------- | --------------------------------------------------------- |
| **OpenStreetMap**  | Factory/industrial land use | **FREE** | Download via Geofabrik (.osm.pbf), query via Overpass API |
| **OSM Bangladesh** | National extract            | **FREE** | Tags: `landuse=industrial`, `building=factory`            |
| **Barikoi Maps**   | BD location API             | **FREE** | District/subdistrict hierarchies                          |

#### 3.4 Water Quality & Environmental

| Source          | Data Type                                      | Cost     |
| --------------- | ---------------------------------------------- | -------- |
| **GEE Catalog** | Pre-computed water indices (NDWI, NDTI)        | **FREE** |
| **NASA STREAM** | Near real-time water quality maps (Chl-a, TSS) | **FREE** |

### ⚠️ Limited / Requires Effort

| Data Need                     | Challenge                                         | Workaround                                             |
| ----------------------------- | ------------------------------------------------- | ------------------------------------------------------ |
| Ground-truth pollution labels | No public labeled pollution dataset for BD rivers | Generate using GEE spectral analysis + manual labeling |
| Factory pollution records     | DoE inspection reports not digitized              | Use proxy via OSM + spectral correlation               |
| Legal land records            | Government records not public                     | Use satellite-based boundary change as evidence        |

### 🟢 Verdict: Datasets are viable for full implementation

All core datasets needed are **freely available**. The CNN training data exists in multiple forms. The main gap — labeled pollution ground-truth data — can be bootstrapped via GEE spectral indices and citizen validation.

---

## 4. Hackathon Stage 2 Requirements

Based on research, Stage 2 typically requires:

1. **Working Prototype / Live Demo** — Functional web application demonstrating core features
2. **3-5 Minute Video Pitch** — Already prepared (11-slide presentation exists)
3. **9 Required Components:**
   - ① Problem Statement
   - ② Proposed Solution
   - ③ AI/Technology Integration
   - ④ Features & Applicability
   - ⑤ Market Opportunity
   - ⑥ Business Model
   - ⑦ Environmental & Social Impact
   - ⑧ Prototype Stage & Roadmap
   - ⑨ Team Introduction

### What's Already Done

- [x] 11-slide HTML/CSS presentation covering all 9 components
- [x] PDF pitch deck
- [x] 3 AI-generated images (polluted river, dashboard mockup, encroachment comparison)
- [x] Speaker script for 3-5 minute video

### What's Needed for Stage 2

- [ ] **Working Demo Website** — Interactive prototype showing:
  - Map-based interface with river segments
  - Simulated pollution heatmap overlay
  - Simulated encroachment comparison (historical vs current)
  - Factory attribution panel with probability scores
  - Alert notification system mockup
  - Evidence report generation
- [ ] **Architecture Diagram** — System overview image

---

## 5. Demo Website Approach

### Recommended: Static Demo with Simulated Data

Since building a real ML pipeline for a hackathon demo is impractical in the timeline, the demo should use:

1. **Real Map** — Leaflet.js or Mapbox GL with actual Dhaka river locations
2. **Simulated Heatmaps** — Pre-computed pollution/encroachment layers overlaid on the map
3. **Mock Data** — Realistic factory data from OSM + simulated pollution scores
4. **Interactive Features** — Click on hotspots → show factory attribution, comparison slider for encroachment
5. **Report Generation** — Generate PDF-like evidence report from selected data

### Tech Stack for Demo

| Component      | Technology                                 |
| -------------- | ------------------------------------------ |
| Map            | Leaflet.js (free, open-source)             |
| UI Framework   | Vanilla HTML/CSS/JS or React               |
| Styling        | Dark theme matching presentation           |
| Data           | GeoJSON files with mock river/factory data |
| Visualizations | Canvas-based heatmap overlays              |
| Charts         | Chart.js for trend data                    |

---

## 6. Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    NodiWatch Platform                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────┐    ┌──────────────┐    ┌───────────────┐   │
│  │ SATELLITE    │    │ CLOUD        │    │ AI ENGINE     │   │
│  │ DATA LAYER  │───▶│ PROCESSING   │───▶│               │   │
│  │             │    │              │    │ Layer 1: CNN  │   │
│  │ • Sentinel-2│    │ • Google     │    │ Layer 2: RF   │   │
│  │ • Landsat   │    │   Earth      │    │ Layer 3:      │   │
│  │ • MODIS     │    │   Engine     │    │   Bayesian    │   │
│  └─────────────┘    └──────────────┘    └───────┬───────┘   │
│                                                  │           │
│                                                  ▼           │
│  ┌─────────────┐    ┌──────────────┐    ┌───────────────┐   │
│  │ EXTERNAL    │    │ GEOSPATIAL   │    │ WEB PLATFORM  │   │
│  │ DATA        │───▶│ DATABASE     │◀───│               │   │
│  │             │    │              │    │ • Dashboard   │   │
│  │ • OSM API   │    │ • PostGIS    │    │ • Heatmaps    │   │
│  │ • DoE Data  │    │ • Historical │    │ • Alerts      │   │
│  │ • Land Rec. │    │   Archive    │    │ • Reports     │   │
│  └─────────────┘    └──────────────┘    └───────────────┘   │
│                                                              │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │              STAKEHOLDER ACCESS LAYER                    │ │
│  │  🏛️ DoE/NRCC    🏦 Banks (API)    ⚖️ Courts    👥 Public │ │
│  └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## 7. Key Contacts & Resources

| Resource            | URL                                                                               |
| ------------------- | --------------------------------------------------------------------------------- |
| Sentinel-2 Data     | https://dataspace.copernicus.eu                                                   |
| Google Earth Engine | https://earthengine.google.com                                                    |
| USGS EarthExplorer  | https://earthexplorer.usgs.gov                                                    |
| OSM Bangladesh      | https://download.geofabrik.de/asia/bangladesh.html                                |
| Kaggle Water Bodies | https://www.kaggle.com/datasets/franciscoescobar/satellite-images-of-water-bodies |
| Sentinel River Seg  | https://github.com/topics/river-segmentation                                      |

---

## 8. Risk Assessment

| Risk                             | Severity | Mitigation                                  |
| -------------------------------- | -------- | ------------------------------------------- |
| Cloud cover in satellite imagery | Medium   | Multi-year composites, temporal filtering   |
| Mixed industrial signals         | High     | Ground validation + citizen photos          |
| Flash flood false positives      | Medium   | Context-aware temporal filtering algorithms |
| Legal calibration for court use  | High     | Cross-reference with land records           |
| Demo data not looking realistic  | Low      | Use real coordinate data from OSM           |
