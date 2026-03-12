# NodiWatch - AI-Powered River Surveillance System

A Next.js prototype showcasing the NodiWatch platform - an AI-powered satellite surveillance system for Bangladesh rivers that detects pollution, encroachment ("nodi dokhol"), and riverbank erosion ("nodi vangon").

## 🌊 About NodiWatch

NodiWatch is an innovative solution that combines:
- **Pollution Fingerprinting**: Identifying and classifying industrial polluters using satellite spectral analysis
- **River Encroachment Detection**: Comparing 10 years of satellite imagery to detect illegal land filling
- **Erosion Monitoring**: Using SAR imagery to track and predict riverbank erosion

### Key Features Demonstrated

✅ **Tri-Layer Heatmap Visualization**
- Pollution severity mapping (red zones)
- Encroachment detection (yellow zones)
- Erosion risk areas (orange zones)

✅ **Interactive Map Interface**
- Real-time visualization of Buriganga River
- Toggle between different data layers
- Detailed hotspot information

✅ **Bayesian Factory Attribution**
- Probabilistic source attribution for pollution
- Spectral signature analysis
- Distance-weighted probability scoring

✅ **Temporal Analysis (2016 vs 2026)**
- Historical water boundary comparison
- Quantified encroachment metrics
- Visual evidence for legal proceedings

✅ **Real-Time Alert System**
- Critical pollution spike notifications
- Encroachment detection alerts
- Erosion risk warnings

✅ **Pollution Trend Analytics**
- 10-year historical data visualization
- Classification by pollutant type (Textile, Tannery, Thermal)
- Trend forecasting

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Navigate to the project directory:
```bash
cd nodiwatch-app
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📦 Building for Production

To create a production build with static export (for Netlify deployment):

```bash
npm run build
# or
yarn build
```

This will generate a static export in the `out` directory.

## 🌐 Deploying to Netlify

### Option 1: Drag and Drop

1. Build the project:
   ```bash
   npm run build
   ```

2. Go to [Netlify Drop](https://app.netlify.com/drop)

3. Drag and drop the `out` folder

### Option 2: Git Deployment

1. Push your code to GitHub

2. Connect your repository to Netlify

3. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `out`

4. Deploy!

### Option 3: Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build the project
npm run build

# Deploy
netlify deploy --prod --dir=out
```

## 🛠️ Technology Stack

- **Framework**: Next.js 14 (Static Export)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Mapping**: React Leaflet
- **Charts**: Recharts
- **Icons**: Lucide React
- **Animations**: Framer Motion

## 📊 Features Implementation

### AI/ML Components Demonstrated
- Random Forest Classification for pollution type detection
- Bayesian Probability Model for source attribution
- CNN-based water segmentation (conceptual visualization)
- Temporal analysis engine

### Data Sources (In Production)
- Sentinel-2 (Optical Imagery)
- Sentinel-1 SAR (Cloud-penetrating radar)
- Landsat 8/9 (Historical + thermal data)
- OpenStreetMap (Industry geolocation)
- Google Earth Engine (Processing platform)

## 🎯 Target Beneficiaries

- **Primary**: Department of Environment (DoE), National River Conservation Commission (NRCC), Bangladesh Water Development Board (BWDB)
- **Secondary**: Banks & Financial Institutions (Green Banking compliance)
- **Legal**: Environmental Courts (Time-series evidence)
- **Disaster Management**: DDM & UNDP Bangladesh (Erosion risk mapping)

## 📈 Expected Impact

- **Dual Enforcement**: Catch polluters and land grabbers simultaneously
- **Historical Evidence**: 10-year comparison for legal-grade proof
- **Predictive Alerts**: Prioritize high-risk factory inspections
- **Flood Prevention**: Guide riverbank restoration projects
- **Erosion Early Warning**: Protect ~1 million displaced people annually

## 🏆 Hackathon Context

This prototype was created for the **Eco-Tech Hackathon 2026** by Environment Watch: BUET.

**Team**: Alpha Verse

**Problem Addressed**: Bangladesh's river ecosystem "triple-blind" crisis
1. The Accountability Gap (pollution source identification)
2. The Silent Encroachment (nodi dokhol detection)
3. The Vanishing Banks (nodi vangon monitoring)

## 📝 License

This is a prototype demonstration for the Eco-Tech Hackathon 2026.

## 🤝 Contributing

This is a hackathon prototype. For production implementation, collaboration with DoE, NRCC, and BWDB would be required.

---

**Built with ❤️ by Team Alpha Verse for a greener Bangladesh** 🇧🇩
