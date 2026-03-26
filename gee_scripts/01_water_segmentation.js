/*
 * ═══════════════════════════════════════════════════════════════
 *  NodiWatch — MNDWI Water Segmentation & Encroachment Detection
 *  Google Earth Engine Script
 * ═══════════════════════════════════════════════════════════════
 *
 *  Purpose: Compute MNDWI water masks from Sentinel-2 imagery
 *           for 2016 vs 2026 comparison to detect river encroachment.
 *
 *  How to run:
 *    1. Open https://code.earthengine.google.com
 *    2. Paste this script
 *    3. Click "Run"
 *
 *  Methodology:
 *    MNDWI = (Green - SWIR) / (Green + SWIR)
 *    Using Sentinel-2 bands: B3 (Green, 10m) and B11 (SWIR, 20m→resampled to 10m)
 *    Threshold > 0.0 classifies water pixels
 *
 *  References:
 *    - Xu, H. (2006). "Modification of NDWI to enhance open water features"
 *    - BUET study: MNDWI achieves 82-96% accuracy in Bangladesh rivers
 *    - Sentinel-2 Band Reference: B3=560nm, B11=1610nm
 */

// ════════════════════════════════════════════
// 1. DEFINE AREA OF INTEREST
// ════════════════════════════════════════════

// Dhaka river system bounding box (Buriganga, Turag, Balu, Shitalakshya)
var dhaka_rivers = ee.Geometry.Rectangle([90.30, 23.65, 90.55, 23.90]);

// Individual river segment bounding boxes for focused analysis
var buriganga = ee.Geometry.Rectangle([90.35, 23.68, 90.45, 23.72]);
var turag = ee.Geometry.Rectangle([90.33, 23.79, 90.40, 23.90]);
var balu = ee.Geometry.Rectangle([90.46, 23.73, 90.50, 23.81]);
var shitalakshya = ee.Geometry.Rectangle([90.50, 23.70, 90.54, 23.82]);

// Choose which area to analyze
var AOI = dhaka_rivers;
Map.centerObject(AOI, 12);

// ════════════════════════════════════════════
// 2. CLOUD MASKING FUNCTION
// ════════════════════════════════════════════

/**
 * Masks clouds and cirrus from Sentinel-2 imagery using QA60 band.
 * QA60 bit 10 = opaque clouds, bit 11 = cirrus
 */
function maskS2clouds(image) {
  var qa = image.select('QA60');
  // Bits 10 and 11 are clouds and cirrus
  var cloudBitMask = 1 << 10;
  var cirrusBitMask = 1 << 11;
  // Both flags should be set to zero for clear conditions
  var mask = qa.bitwiseAnd(cloudBitMask).eq(0)
      .and(qa.bitwiseAnd(cirrusBitMask).eq(0));
  return image.updateMask(mask)
      .copyProperties(image, ['system:time_start']);
}

// ════════════════════════════════════════════
// 3. LOAD & PROCESS SENTINEL-2 IMAGERY
// ════════════════════════════════════════════

// NOTE: Sentinel-2 data available from June 2015 onward.
// For "2016" baseline, we use dry season 2016-2017 (Nov-Mar)
// For "2026" current, we use the most recent dry season

// --- 2016-2017 DRY SEASON (baseline) ---
var s2_2016 = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
    .filterBounds(AOI)
    .filterDate('2016-11-01', '2017-03-31')
    .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20))
    .map(maskS2clouds);

// --- 2025-2026 DRY SEASON (current) ---
var s2_2026 = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
    .filterBounds(AOI)
    .filterDate('2025-11-01', '2026-03-25')
    .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20))
    .map(maskS2clouds);

// Create median composites (reduces noise, fills gaps)
var composite_2016 = s2_2016.median().clip(AOI);
var composite_2026 = s2_2026.median().clip(AOI);

// Check image counts (for validation)
print('Number of 2016 images:', s2_2016.size());
print('Number of 2026 images:', s2_2026.size());

// ════════════════════════════════════════════
// 4. COMPUTE MNDWI WATER MASKS
// ════════════════════════════════════════════

/**
 * Compute MNDWI from a Sentinel-2 image.
 * MNDWI = (Green - SWIR1) / (Green + SWIR1)
 *       = (B3 - B11) / (B3 + B11)
 *
 * Note: B3 is 10m, B11 is 20m. GEE handles resampling internally
 * when bands are combined, using nearest-neighbor by default.
 * For better accuracy, we explicitly resample B11 using bilinear interpolation.
 */
function computeMNDWI(image) {
  var green = image.select('B3');  // 560nm, 10m
  var swir1 = image.select('B11'); // 1610nm, 20m
  
  // Resample SWIR to 10m using bilinear interpolation
  // This is critical for boundary accuracy (see implementation_plan.md)
  var swir1_10m = swir1.resample('bilinear');
  
  var mndwi = green.subtract(swir1_10m).divide(green.add(swir1_10m))
      .rename('MNDWI');
  return mndwi;
}

var mndwi_2016 = computeMNDWI(composite_2016);
var mndwi_2026 = computeMNDWI(composite_2026);

// Apply threshold to create binary water masks
// Threshold > 0.0 is standard for MNDWI (Xu, 2006)
// Can adjust between -0.1 and 0.3 depending on scene
var WATER_THRESHOLD = 0.0;

var water_2016 = mndwi_2016.gt(WATER_THRESHOLD).rename('water_2016');
var water_2026 = mndwi_2026.gt(WATER_THRESHOLD).rename('water_2026');

// ════════════════════════════════════════════
// 5. DETECT ENCROACHMENT (WATER LOSS)
// ════════════════════════════════════════════

// Encroachment = was water in 2016, now land in 2026
// water_2016 = 1, water_2026 = 0 → encroached
var encroachment = water_2016.and(water_2026.not()).rename('encroachment');

// Erosion = was land in 2016, now water in 2026
// water_2016 = 0, water_2026 = 1 → eroded
var erosion = water_2026.and(water_2016.not()).rename('erosion');

// ════════════════════════════════════════════
// 6. CALCULATE STATISTICS
// ════════════════════════════════════════════

// Calculate pixel areas (each 10m pixel = 100 sq meters = 0.01 hectares)
var pixelArea = ee.Image.pixelArea(); // in sq meters

// Water area in 2016
var waterArea_2016 = water_2016.multiply(pixelArea)
    .reduceRegion({
      reducer: ee.Reducer.sum(),
      geometry: AOI,
      scale: 10,
      maxPixels: 1e10
    });

// Water area in 2026
var waterArea_2026 = water_2026.multiply(pixelArea)
    .reduceRegion({
      reducer: ee.Reducer.sum(),
      geometry: AOI,
      scale: 10,
      maxPixels: 1e10
    });

// Encroached area
var encroachmentArea = encroachment.multiply(pixelArea)
    .reduceRegion({
      reducer: ee.Reducer.sum(),
      geometry: AOI,
      scale: 10,
      maxPixels: 1e10
    });

print('Water area 2016 (sq m):', waterArea_2016);
print('Water area 2026 (sq m):', waterArea_2026);
print('Encroached area (sq m):', encroachmentArea);

// ════════════════════════════════════════════
// 7. VISUALIZATION
// ════════════════════════════════════════════

// True color composites
var visParams = {bands: ['B4', 'B3', 'B2'], min: 0, max: 3000};
Map.addLayer(composite_2016, visParams, 'RGB 2016', false);
Map.addLayer(composite_2026, visParams, 'RGB 2026', false);

// MNDWI continuous values
var mndwiVis = {min: -0.5, max: 0.8, palette: ['brown', 'white', 'cyan', 'blue']};
Map.addLayer(mndwi_2016, mndwiVis, 'MNDWI 2016', false);
Map.addLayer(mndwi_2026, mndwiVis, 'MNDWI 2026', false);

// Water masks (blue)
Map.addLayer(water_2016.selfMask(), {palette: ['0000FF']}, 'Water 2016');
Map.addLayer(water_2026.selfMask(), {palette: ['00BFFF']}, 'Water 2026');

// Encroachment overlay (red = land gained where water was)
Map.addLayer(encroachment.selfMask(), {palette: ['FF0000']}, 'Encroachment (Water Lost)');

// Erosion overlay (orange = water gained where land was)
Map.addLayer(erosion.selfMask(), {palette: ['FF8C00']}, 'Erosion (Land Lost)');

// ════════════════════════════════════════════
// 8. EXPORT RESULTS (optional)
// ════════════════════════════════════════════

// Export water mask difference as GeoTIFF (for use in the dashboard)
Export.image.toDrive({
  image: encroachment.toByte(),
  description: 'NodiWatch_Encroachment_Dhaka',
  folder: 'NodiWatch',
  region: AOI,
  scale: 10,
  maxPixels: 1e10,
  crs: 'EPSG:4326'
});

// Export encroachment as GeoJSON vectors (optional — for dashboard overlay)
// Convert raster to vectors for specific river segments
var encroachmentVectors = encroachment.selfMask().reduceToVectors({
  geometry: buriganga,
  scale: 10,
  maxPixels: 1e10,
  geometryType: 'polygon',
  eightConnected: false
});

Export.table.toDrive({
  collection: encroachmentVectors,
  description: 'NodiWatch_Encroachment_Buriganga_Vectors',
  folder: 'NodiWatch',
  fileFormat: 'GeoJSON'
});

print('═══ NodiWatch Water Segmentation Complete ═══');
print('Check the Layers panel to toggle 2016/2026 water masks');
print('Red overlay = encroachment (river area lost since 2016)');
