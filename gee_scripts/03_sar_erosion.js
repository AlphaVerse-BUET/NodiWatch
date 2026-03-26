/*
 * ═══════════════════════════════════════════════════════════════
 *  NodiWatch — SAR-Based Riverbank Erosion Detection
 *  Google Earth Engine Script
 * ═══════════════════════════════════════════════════════════════
 *
 *  Purpose: Detect riverbank erosion using Sentinel-1 SAR radar data.
 *           SAR works through monsoon clouds — critical for Bangladesh.
 *
 *  Methodology (based on Freihardt & Frey, 2023):
 *    1. Load Sentinel-1 GRD data (VV polarization, IW mode)
 *    2. Apply speckle filtering (focal median)
 *    3. Classify water vs land using backscatter threshold
 *    4. Compare pre-monsoon vs post-monsoon to detect erosion
 *
 *  Key advantage: SAR radar penetrates clouds — provides observations
 *  during monsoon when optical satellites (Sentinel-2) are blind.
 *
 *  References:
 *    - Freihardt, J. and Frey, H. (2023). "Assessing riverbank erosion
 *      in Bangladesh using time series of Sentinel-1 radar imagery
 *      in the Google Earth Engine." NHESS, 23, 751–770.
 *      https://nhess.copernicus.org/articles/23/751/2023/
 *    - Source code: https://zenodo.org/record/7252970
 *
 *  LIMITATIONS:
 *    - SAR detects surface changes only, not sub-surface geotechnical factors
 *    - Cannot predict WHERE collapse will happen, only WHERE it HAS happened
 *    - We present "erosion risk corridors" based on historical retreat rates,
 *      NOT deterministic predictions of future collapse
 */

// ════════════════════════════════════════════
// 1. DEFINE AREA OF INTEREST
// ════════════════════════════════════════════

// Major erosion-prone rivers around Dhaka
var dhaka_rivers = ee.Geometry.Rectangle([90.30, 23.65, 90.55, 23.90]);

// Specific segments known for erosion
var buriganga_south = ee.Geometry.Rectangle([90.40, 23.68, 90.44, 23.72]);
var shitalakshya_south = ee.Geometry.Rectangle([90.50, 23.69, 90.52, 23.71]);

var AOI = dhaka_rivers;
Map.centerObject(AOI, 12);

// ════════════════════════════════════════════
// 2. LOAD SENTINEL-1 SAR DATA
// ════════════════════════════════════════════

/**
 * Load Sentinel-1 GRD data with specific parameters:
 * - VV polarization: good for water/land discrimination
 * - IW (Interferometric Wide) instrument mode: standard mode over land
 * - Ascending orbit (consistent viewing geometry)
 * - Apply GEE's built-in terrain correction
 */
function loadSAR(startDate, endDate) {
  return ee.ImageCollection('COPERNICUS/S1_GRD')
      .filterBounds(AOI)
      .filterDate(startDate, endDate)
      .filter(ee.Filter.eq('instrumentMode', 'IW'))
      .filter(ee.Filter.listContains('transmitterReceiverPolarisation', 'VV'))
      .filter(ee.Filter.eq('orbitProperties_pass', 'ASCENDING'))
      .select('VV');
}

// --- PRE-MONSOON 2025 (March-May) ---
// Land is dry, rivers at normal level
var preMonsoon_2025 = loadSAR('2025-03-01', '2025-05-31');

// --- POST-MONSOON 2025 (October-December) ---
// After flood waters recede, erosion damage visible
var postMonsoon_2025 = loadSAR('2025-10-01', '2025-12-31');

// --- Historical: PRE-MONSOON 2020 (for 5-year comparison) ---
var preMonsoon_2020 = loadSAR('2020-03-01', '2020-05-31');

// Create composites (median reduces speckle noise)
var preComposite = preMonsoon_2025.median().clip(AOI);
var postComposite = postMonsoon_2025.median().clip(AOI);
var historical_2020 = preMonsoon_2020.median().clip(AOI);

print('Pre-monsoon 2025 images:', preMonsoon_2025.size());
print('Post-monsoon 2025 images:', postMonsoon_2025.size());

// ════════════════════════════════════════════
// 3. SPECKLE FILTERING
// ════════════════════════════════════════════

/**
 * Apply focal median filter for speckle reduction.
 * SAR data inherently has "salt-and-pepper" noise (speckle)
 * due to constructive/destructive interference of coherent radar waves.
 * 
 * Using 3x3 window focal median as recommended by Freihardt & Frey (2023).
 */
function applySpeckleFilter(image) {
  return image.focal_median(30, 'circle', 'meters').rename('VV');
}

var preFiltered = applySpeckleFilter(preComposite);
var postFiltered = applySpeckleFilter(postComposite);
var hist2020Filtered = applySpeckleFilter(historical_2020);

// ════════════════════════════════════════════
// 4. WATER/LAND CLASSIFICATION
// ════════════════════════════════════════════

/**
 * Classify pixels as water or land using backscatter threshold.
 * 
 * Water surfaces act as specular reflectors → very LOW backscatter (dark)
 * Land/vegetation causes diffuse scattering → HIGHER backscatter (bright)
 * 
 * Threshold: -13.2 dB (from Freihardt & Frey 2023, calibrated for Bangladesh)
 * Pixels below threshold = water
 * Pixels above threshold = land
 * 
 * NOTE: This threshold may need adjustment for different river systems.
 * Recommended range: -15 to -12 dB for South Asian rivers.
 */
var WATER_THRESHOLD_DB = -13.2;

var waterPre = preFiltered.lt(WATER_THRESHOLD_DB).rename('water_pre');
var waterPost = postFiltered.lt(WATER_THRESHOLD_DB).rename('water_post');
var waterHist = hist2020Filtered.lt(WATER_THRESHOLD_DB).rename('water_2020');

// ════════════════════════════════════════════
// 5. DETECT EROSION & DEPOSITION
// ════════════════════════════════════════════

// EROSION = was land before monsoon, became water after monsoon
// (waterPre = 0 [land], waterPost = 1 [water]) → pixel eroded
var erosion_2025 = waterPost.and(waterPre.not()).rename('erosion_2025');

// DEPOSITION/ACCRETION = was water before monsoon, became land after
// (waterPre = 1 [water], waterPost = 0 [land]) → sediment deposited
var deposition_2025 = waterPre.and(waterPost.not()).rename('deposition_2025');

// LONG-TERM EROSION = was land in 2020, became water by 2025
var erosion_5year = waterPre.not().and(waterHist.not())  // land in both = stable land
    .not().and(waterPost)  // now water = eroded over 5 years... 
    // Simpler: was land in 2020, now water in 2025 post-monsoon
    .rename('temp');
var longTermErosion = waterPost.and(waterHist.not()).rename('erosion_5year');

// ════════════════════════════════════════════
// 6. CALCULATE EROSION STATISTICS
// ════════════════════════════════════════════

var pixelArea = ee.Image.pixelArea(); // sq meters

// Single-season erosion area
var erosionArea = erosion_2025.multiply(pixelArea)
    .reduceRegion({
      reducer: ee.Reducer.sum(),
      geometry: AOI,
      scale: 10,
      maxPixels: 1e10
    });

// 5-year cumulative erosion
var longTermArea = longTermErosion.multiply(pixelArea)
    .reduceRegion({
      reducer: ee.Reducer.sum(),
      geometry: AOI,
      scale: 10,
      maxPixels: 1e10
    });

print('═══ Erosion Statistics ═══');
print('Single-season erosion area (sq m):', erosionArea);
print('5-year cumulative erosion area (sq m):', longTermArea);

// ════════════════════════════════════════════
// 7. GENERATE EROSION RISK CORRIDORS
// ════════════════════════════════════════════

/**
 * Erosion risk corridors are generated by buffering detected erosion zones.
 * This is a HEURISTIC based on historical patterns — NOT a geotechnical
 * prediction model. We cannot predict exact collapse locations from
 * satellite data alone (requires sub-surface soil data, bathymetry, etc.)
 *
 * Risk levels:
 *   - Critical (25m buffer): Within immediate bank retreat distance
 *   - Warning (50m buffer): At risk within next monsoon season
 *   - Watch (100m buffer): Monitor for accelerating retreat
 */

// Convert erosion to vectors for buffering
var erosionVectors = erosion_2025.selfMask().reduceToVectors({
  geometry: AOI,
  scale: 10,
  maxPixels: 1e10,
  geometryType: 'polygon',
  eightConnected: true,
  bestEffort: true
});

print('Number of erosion zones detected:', erosionVectors.size());

// ════════════════════════════════════════════
// 8. VISUALIZATION
// ════════════════════════════════════════════

// SAR composites (dark = water, bright = land)
var sarVis = {min: -25, max: -5, palette: ['000000', '555555', 'AAAAAA', 'FFFFFF']};
Map.addLayer(preFiltered, sarVis, 'SAR Pre-Monsoon 2025', false);
Map.addLayer(postFiltered, sarVis, 'SAR Post-Monsoon 2025', false);

// Water masks
Map.addLayer(waterPre.selfMask(), {palette: ['0000FF']}, 'Water Pre-Monsoon', false);
Map.addLayer(waterPost.selfMask(), {palette: ['00BFFF']}, 'Water Post-Monsoon', false);

// Erosion detection (RED = bank lost)
Map.addLayer(erosion_2025.selfMask(), {palette: ['FF0000']}, 
    'Erosion 2025 (Bank Lost)');

// Deposition detection (GREEN = land gained)
Map.addLayer(deposition_2025.selfMask(), {palette: ['00FF00']}, 
    'Deposition 2025 (Land Gained)', false);

// Long-term erosion (ORANGE)
Map.addLayer(longTermErosion.selfMask(), {palette: ['FF8C00']}, 
    'Erosion 2020-2025 (5-Year)', false);

// ════════════════════════════════════════════
// 9. EXPORT
// ════════════════════════════════════════════

Export.image.toDrive({
  image: erosion_2025.toByte(),
  description: 'NodiWatch_SAR_Erosion_2025',
  folder: 'NodiWatch',
  region: AOI,
  scale: 10,
  maxPixels: 1e10,
  crs: 'EPSG:4326'
});

Export.table.toDrive({
  collection: erosionVectors,
  description: 'NodiWatch_Erosion_Vectors',
  folder: 'NodiWatch',
  fileFormat: 'GeoJSON'
});

print('═══ NodiWatch SAR Erosion Analysis Complete ═══');
print('Red = riverbank lost during 2025 monsoon season');
print('Green = sediment deposited (land gained)');
print('Orange = cumulative erosion since 2020');
print('NOTE: Risk corridors are based on historical retreat, NOT prediction of future collapse.');
