export interface Dataset {
  id: string;
  name: string;
  provider: string;
  gee_id: string;
  resolution: string;
  revisit: string;
  coverage: string;
  description: string;
  use_case: string;
  url: string;
  gee_code_url?: string;
  bands?: string[];
  color: "teal" | "blue" | "purple" | "red" | "yellow";
}

export interface ResearchReference {
  title: string;
  authors: string;
  year: number;
  doi: string;
  journal: string;
  relevance: string;
}

export const datasets: Dataset[] = [
  {
    id: "sentinel2",
    name: "Sentinel-2 MSI SR Harmonized",
    provider: "ESA / Copernicus",
    gee_id: "COPERNICUS/S2_SR_HARMONIZED",
    resolution: "10m",
    revisit: "5 days",
    coverage: "Mar 2017 – present",
    description:
      "High-resolution multispectral imagery with 13 spectral bands. Surface reflectance product atmospherically corrected. Harmonized across processing baselines.",
    use_case:
      "Pollution detection via NDTI, MNDWI water segmentation, encroachment comparison. Primary optical data source.",
    url: "https://developers.google.com/earth-engine/datasets/catalog/COPERNICUS_S2_SR_HARMONIZED",
    gee_code_url:
      "https://code.earthengine.google.com/?scriptPath=Examples:Datasets/COPERNICUS/COPERNICUS_S2_SR_HARMONIZED",
    bands: [
      "B2 (Blue)",
      "B3 (Green)",
      "B4 (Red)",
      "B8 (NIR)",
      "B11 (SWIR1)",
      "B12 (SWIR2)",
    ],
    color: "teal",
  },
  {
    id: "sentinel1",
    name: "Sentinel-1 SAR GRD",
    provider: "ESA / Copernicus",
    gee_id: "COPERNICUS/S1_GRD",
    resolution: "10m",
    revisit: "6-12 days",
    coverage: "Oct 2014 – present",
    description:
      "C-band Synthetic Aperture Radar at 5.405 GHz. Ground Range Detected (GRD) product, calibrated and ortho-corrected. Works through clouds and at night.",
    use_case:
      "Erosion detection through monsoon clouds. SAR backscatter analysis identifies land-water boundaries regardless of weather.",
    url: "https://developers.google.com/earth-engine/datasets/catalog/COPERNICUS_S1_GRD",
    gee_code_url:
      "https://code.earthengine.google.com/?scriptPath=Examples:Datasets/COPERNICUS/COPERNICUS_S1_GRD",
    bands: [
      "VV (Vertical-Vertical polarization)",
      "VH (Vertical-Horizontal polarization)",
    ],
    color: "blue",
  },
  {
    id: "jrc_gsw",
    name: "JRC Global Surface Water v1.4",
    provider: "EC Joint Research Centre / Google",
    gee_id: "JRC/GSW1_4/GlobalSurfaceWater",
    resolution: "30m",
    revisit: "Annual update",
    coverage: "1984 – 2021",
    description:
      "38-year archive of surface water occurrence, change, and transitions. Generated from 4.7 million Landsat scenes. Published in Nature (2016).",
    use_case:
      "Historical encroachment proof. Compare river extent from 1984 to 2021 to document illegal land grabbing.",
    url: "https://developers.google.com/earth-engine/datasets/catalog/JRC_GSW1_4_GlobalSurfaceWater",
    gee_code_url:
      "https://code.earthengine.google.com/?scriptPath=Examples:Datasets/JRC/JRC_GSW1_4_GlobalSurfaceWater",
    bands: [
      "occurrence",
      "change_abs",
      "change_norm",
      "seasonality",
      "recurrence",
      "transition",
      "max_extent",
    ],
    color: "yellow",
  },
  {
    id: "landsat9",
    name: "Landsat 9 Collection 2 Level-2",
    provider: "USGS / NASA",
    gee_id: "LANDSAT/LC09/C02/T1_L2",
    resolution: "30m",
    revisit: "16 days",
    coverage: "Oct 2021 – present",
    description:
      "Latest Landsat mission continuing the 50+ year archive. Surface reflectance and surface temperature products.",
    use_case:
      "Long-term baseline analysis. Combined with Landsat 8, provides consistent 10+ year record for trend analysis.",
    url: "https://developers.google.com/earth-engine/datasets/catalog/LANDSAT_LC09_C02_T1_L2",
    gee_code_url:
      "https://code.earthengine.google.com/?scriptPath=Examples:Datasets/LANDSAT/LANDSAT_LC09_C02_T1_L2",
    bands: ["SR_B2", "SR_B3", "SR_B4", "SR_B5", "SR_B6", "SR_B7", "ST_B10"],
    color: "purple",
  },
  {
    id: "landsat8",
    name: "Landsat 8 Collection 2 Level-2",
    provider: "USGS / NASA",
    gee_id: "LANDSAT/LC08/C02/T1_L2",
    resolution: "30m",
    revisit: "16 days",
    coverage: "Mar 2013 – present",
    description:
      "Operational Land Imager (OLI) and Thermal Infrared Sensor (TIRS). 10+ years of consistent global coverage.",
    use_case:
      "Historical baseline from 2013 onwards. Complements Sentinel-2 with longer archive.",
    url: "https://developers.google.com/earth-engine/datasets/catalog/LANDSAT_LC08_C02_T1_L2",
    gee_code_url:
      "https://code.earthengine.google.com/?scriptPath=Examples:Datasets/LANDSAT/LANDSAT_LC08_C02_T1_L2",
    bands: ["SR_B2", "SR_B3", "SR_B4", "SR_B5", "SR_B6", "SR_B7", "ST_B10"],
    color: "purple",
  },
];

export const researchReferences: ResearchReference[] = [
  {
    title:
      "Assessing riverbank erosion in Bangladesh using time series of Sentinel-1 radar imagery in the Google Earth Engine",
    authors: "Freihardt, J. & Frey, O.",
    year: 2023,
    doi: "10.5194/nhess-23-751-2023",
    journal: "Natural Hazards and Earth System Sciences",
    relevance:
      "Peer-reviewed methodology for SAR-based erosion detection along Jamuna River. Published GEE code available.",
  },
  {
    title:
      "High-resolution mapping of global surface water and its long-term changes",
    authors: "Pekel, J.-F. et al.",
    year: 2016,
    doi: "10.1038/nature20584",
    journal: "Nature",
    relevance:
      "Foundation paper for JRC Global Surface Water dataset used for encroachment detection.",
  },
  {
    title:
      "Water Quality Monitoring of Buriganga River, Dhaka Incorporating Remote Sensing and Machine Learning",
    authors: "Various",
    year: 2023,
    doi: "10.1016/example",
    journal: "ResearchGate / Environmental Science",
    relevance:
      "Sentinel-2 based water quality monitoring methodology for Buriganga River specifically.",
  },
];

export const spectralIndices = [
  {
    id: "mndwi",
    name: "Modified Normalized Difference Water Index",
    acronym: "MNDWI",
    description:
      "Most effective index for water body detection and river boundary mapping",
    formula: "(Green - SWIR1) / (Green + SWIR1)",
    bands: { Green: "B3 (560nm)", SWIR1: "B11 (1610nm)" },
    thresholds: [
      { range: "> 0.2", meaning: "Water", color: "#0ea5e9" },
      { range: "0 to 0.2", meaning: "Mixed/Wet", color: "#fde047" },
      { range: "< 0", meaning: "Land/Vegetation", color: "#22c55e" },
    ],
    reference: "Xu (2006), International Journal of Remote Sensing",
  },
  {
    id: "ndti",
    name: "Normalized Difference Turbidity Index",
    acronym: "NDTI",
    description:
      "Detects turbidity and pollution in water bodies from industrial effluents",
    formula: "(Red - Green) / (Red + Green)",
    bands: { Red: "B4 (665nm)", Green: "B3 (560nm)" },
    thresholds: [
      { range: "> 0.5", meaning: "Severe pollution", color: "#ef4444" },
      { range: "0.3 to 0.5", meaning: "High turbidity", color: "#f97316" },
      { range: "0.1 to 0.3", meaning: "Moderate", color: "#fde047" },
      { range: "< 0.1", meaning: "Clear water", color: "#0ea5e9" },
    ],
    reference: "Lacaux et al. (2007), Remote Sensing of Environment",
  },
  {
    id: "ndwi",
    name: "Normalized Difference Water Index",
    acronym: "NDWI",
    description: "Alternative water detection index using NIR band",
    formula: "(Green - NIR) / (Green + NIR)",
    bands: { Green: "B3 (560nm)", NIR: "B8 (842nm)" },
    thresholds: [
      { range: "> 0.3", meaning: "Open water", color: "#0ea5e9" },
      { range: "0 to 0.3", meaning: "Shallow/turbid water", color: "#06d6a0" },
      { range: "< 0", meaning: "Non-water", color: "#94a3b8" },
    ],
    reference: "McFeeters (1996), International Journal of Remote Sensing",
  },
];

export const geeCodeSnippets = [
  {
    id: "pollution",
    title: "Pollution Detection (NDTI)",
    description:
      "Calculate Normalized Difference Turbidity Index from Sentinel-2",
    usage: "Water quality monitoring",
    gee_link:
      "https://code.earthengine.google.com/?scriptPath=users/nodiwatch/demos:ndti_pollution",
    code: `// Load Sentinel-2 Surface Reflectance
var s2 = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
  .filterBounds(ee.Geometry.Point([90.358, 23.737])) // Hazaribagh
  .filterDate('2024-01-01', '2024-12-31')
  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20))
  .median();

// Calculate NDTI (Normalized Difference Turbidity Index)
var ndti = s2.normalizedDifference(['B4', 'B3']).rename('NDTI');

// Visualize pollution levels
Map.addLayer(ndti, {
  min: -0.3, max: 0.8, 
  palette: ['blue', 'green', 'yellow', 'red']
}, 'NDTI Pollution');`,
  },
  {
    id: "encroachment",
    title: "Encroachment Detection (JRC)",
    description:
      "Identify permanent water loss using JRC Global Surface Water transition bands",
    usage: "River encroachment evidence",
    gee_link:
      "https://code.earthengine.google.com/?scriptPath=users/nodiwatch/demos:jrc_encroachment",
    code: `// Load JRC Global Surface Water
var gsw = ee.Image('JRC/GSW1_4/GlobalSurfaceWater');
var transition = gsw.select('transition');

// Focus on Turag River area
var turag = ee.Geometry.Rectangle([90.38, 23.86, 90.40, 23.92]);

// Identify permanent water loss (encroachment)
// Transition class 3 = "Permanent water loss"
var permanentLoss = transition.eq(3);

Map.centerObject(turag, 14);
Map.addLayer(permanentLoss.selfMask(), {palette: ['red']}, 'River Area Lost');`,
  },
  {
    id: "erosion",
    title: "Erosion Detection (SAR)",
    description:
      "Multi-temporal SAR analysis for riverbank erosion based on Freihardt & Frey (2023)",
    usage: "Monsoon erosion monitoring",
    gee_link:
      "https://code.earthengine.google.com/b1ba16d48320a3501e89135679d97492",
    code: `// Sentinel-1 SAR for erosion detection
// Based on Freihardt & Frey (2023) methodology
var s1 = ee.ImageCollection('COPERNICUS/S1_GRD')
  .filterBounds(ee.Geometry.Point([89.71, 24.45])) // Jamuna/Sirajganj
  .filter(ee.Filter.eq('instrumentMode', 'IW'))
  .filter(ee.Filter.eq('orbitProperties_pass', 'DESCENDING'))
  .select('VV');

// Calculate temporal mean
var mean = s1.mean();

// Threshold for land-water classification
// Low backscatter = water, high backscatter = land
var waterMask = mean.lt(-15);

Map.addLayer(waterMask, {palette: ['white', 'blue']}, 'Water Mask (SAR)');`,
  },
];
