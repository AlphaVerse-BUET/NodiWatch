/*
 * ═══════════════════════════════════════════════════════════════
 *  NodiWatch — Pollution Spectral Index Analysis
 *  Google Earth Engine Script
 * ═══════════════════════════════════════════════════════════════
 *
 *  Purpose: Compute water quality spectral indices from Sentinel-2
 *           to detect and classify industrial pollution.
 *
 *  Indices computed:
 *    1. NDTI = (Red - Green) / (Red + Green)
 *       → Turbidity proxy. High values = high suspended sediment/pollution
 *    2. CDOM Index = Green / Blue = B3 / B2
 *       → Chromophoric Dissolved Organic Matter. High = organic pollution
 *    3. Red/Blue Ratio = B4 / B2
 *       → Dye indicator. High values suggest textile dye effluent
 *
 *  IMPORTANT NOTES:
 *    - Sentinel-2 has NO thermal infrared bands. We CANNOT measure
 *      water temperature from Sentinel-2. This is a physical impossibility.
 *    - These indices are PROXIES, not direct chemical measurements.
 *    - Validation requires ground-truth water quality samples.
 *
 *  References:
 *    - Lacaux et al. (2006): NDTI methodology for turbidity
 *    - Buriganga water quality study (ResearchGate, 2024)
 *    - NDTI formula: (B4-B3)/(B4+B3) for Sentinel-2
 */

// ════════════════════════════════════════════
// 1. DEFINE AREA OF INTEREST
// ════════════════════════════════════════════

var dhaka_rivers = ee.Geometry.Rectangle([90.30, 23.65, 90.55, 23.90]);
var buriganga = ee.Geometry.Rectangle([90.35, 23.68, 90.45, 23.72]);

var AOI = dhaka_rivers;
Map.centerObject(AOI, 12);

// ════════════════════════════════════════════
// 2. CLOUD MASKING
// ════════════════════════════════════════════

function maskS2clouds(image) {
  var qa = image.select('QA60');
  var cloudBitMask = 1 << 10;
  var cirrusBitMask = 1 << 11;
  var mask = qa.bitwiseAnd(cloudBitMask).eq(0)
      .and(qa.bitwiseAnd(cirrusBitMask).eq(0));
  return image.updateMask(mask)
      .copyProperties(image, ['system:time_start']);
}

// ════════════════════════════════════════════
// 3. LOAD SENTINEL-2 DATA (recent dry season)
// ════════════════════════════════════════════

var s2 = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
    .filterBounds(AOI)
    .filterDate('2025-11-01', '2026-03-25')
    .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20))
    .map(maskS2clouds);

var composite = s2.median().clip(AOI);
print('Number of images used:', s2.size());

// ════════════════════════════════════════════
// 4. CREATE WATER MASK (only analyze water pixels)
// ════════════════════════════════════════════

// Use MNDWI to isolate water pixels — avoid analyzing land
var mndwi = composite.normalizedDifference(['B3', 'B11']).rename('MNDWI');
var waterMask = mndwi.gt(0.0);

// ════════════════════════════════════════════
// 5. COMPUTE POLLUTION SPECTRAL INDICES
// ════════════════════════════════════════════

// --- NDTI: Normalized Difference Turbidity Index ---
// NDTI = (Red - Green) / (Red + Green) = (B4 - B3) / (B4 + B3)
// High NDTI → high turbidity → suspended sediments/pollution
var ndti = composite.normalizedDifference(['B4', 'B3'])
    .rename('NDTI')
    .updateMask(waterMask);

// --- CDOM Index: Chromophoric Dissolved Organic Matter ---
// CDOM = Green / Blue = B3 / B2
// High CDOM → high organic pollution (tannery waste, sewage)
var cdom = composite.select('B3').divide(composite.select('B2'))
    .rename('CDOM')
    .updateMask(waterMask);

// --- Red/Blue Ratio: Dye Indicator ---
// R/B = B4 / B2
// High R/B → colored effluent (textile dyes, red/brown discharge)
var redBlue = composite.select('B4').divide(composite.select('B2'))
    .rename('RedBlueRatio')
    .updateMask(waterMask);

// --- Combined Pollution Severity Index ---
// Normalize each index 0-1 and average for composite score
// This is a simple heuristic, NOT a peer-reviewed metric
var ndti_norm = ndti.unitScale(-0.3, 0.5).clamp(0, 1);
var cdom_norm = cdom.unitScale(0.8, 4.0).clamp(0, 1);
var rb_norm = redBlue.unitScale(0.5, 4.0).clamp(0, 1);

var pollutionSeverity = ndti_norm.add(cdom_norm).add(rb_norm)
    .divide(3)
    .rename('PollutionSeverity')
    .updateMask(waterMask);

// ════════════════════════════════════════════
// 6. CLASSIFY POLLUTION TYPE (threshold-based)
// ════════════════════════════════════════════

/*
 * IMPORTANT: This is threshold-based classification, NOT a trained ML model.
 * Spectral overlap between pollution types is real — these are approximate
 * cluster-level classifications, not definitive source identification.
 *
 * Classification rules (from published literature):
 *   - High CDOM (>2.5) + High NDTI (>0.1) → Organic-heavy (tannery/sewage cluster)
 *   - High R/B (>2.0) + Moderate NDTI     → Dye-heavy (textile cluster)
 *   - Low indices but visible anomaly      → Chemical/other
 */

// Simple classification: 1=clean, 2=moderate, 3=organic-heavy, 4=dye-heavy
var classification = ee.Image(1) // default: clean
    .where(pollutionSeverity.gt(0.2), 2)  // moderate
    .where(cdom.gt(2.5).and(ndti.gt(0.1)), 3)  // organic-heavy cluster
    .where(redBlue.gt(2.0).and(ndti.gt(0.0)), 4)  // dye-heavy cluster
    .rename('PollutionClass')
    .updateMask(waterMask);

// ════════════════════════════════════════════
// 7. EXTRACT SAMPLE POINT VALUES
// ════════════════════════════════════════════

// Define sample points along known polluted river segments
var samplePoints = ee.FeatureCollection([
  ee.Feature(ee.Geometry.Point([90.376, 23.705]), {name: 'Buriganga_Sadarghat'}),
  ee.Feature(ee.Geometry.Point([90.388, 23.699]), {name: 'Buriganga_Hazaribagh'}),
  ee.Feature(ee.Geometry.Point([90.402, 23.694]), {name: 'Buriganga_Kamrangir'}),
  ee.Feature(ee.Geometry.Point([90.353, 23.860]), {name: 'Turag_Tongi'}),
  ee.Feature(ee.Geometry.Point([90.357, 23.840]), {name: 'Turag_Aminbazar'}),
  ee.Feature(ee.Geometry.Point([90.522, 23.780]), {name: 'Shitalakshya_Narayanganj'}),
  ee.Feature(ee.Geometry.Point([90.476, 23.770]), {name: 'Balu_Demra'}),
  ee.Feature(ee.Geometry.Point([90.320, 23.710]), {name: 'Dhaleshwari_Keraniganj'}),
]);

// Stack all index bands
var indexStack = ndti.addBands(cdom).addBands(redBlue).addBands(pollutionSeverity);

// Sample values at each point
var sampledValues = indexStack.reduceRegions({
  collection: samplePoints,
  reducer: ee.Reducer.mean(),
  scale: 10
});

print('═══ Spectral Index Values at Sample Points ═══');
print(sampledValues);

// ════════════════════════════════════════════
// 8. VISUALIZATION
// ════════════════════════════════════════════

// True color
Map.addLayer(composite, {bands: ['B4', 'B3', 'B2'], min: 0, max: 3000}, 
    'True Color', false);

// NDTI (turbidity)
Map.addLayer(ndti, {min: -0.2, max: 0.5, palette: ['blue', 'green', 'yellow', 'red']},
    'NDTI (Turbidity)');

// CDOM (organic pollution)
Map.addLayer(cdom, {min: 0.8, max: 4.0, palette: ['cyan', 'green', 'brown', 'darkred']},
    'CDOM (Organic)', false);

// Red/Blue Ratio (dye)
Map.addLayer(redBlue, {min: 0.5, max: 4.0, palette: ['blue', 'white', 'red', 'darkred']},
    'R/B Ratio (Dye)', false);

// Pollution Severity composite
Map.addLayer(pollutionSeverity, 
    {min: 0, max: 1, palette: ['green', 'yellow', 'orange', 'red', 'darkred']},
    'Pollution Severity');

// Classification map
Map.addLayer(classification, 
    {min: 1, max: 4, palette: ['00FF00', 'FFFF00', '8B4513', 'FF0000']},
    'Pollution Type Classification', false);

// Sample points
Map.addLayer(samplePoints, {color: 'white'}, 'Sample Points');

// ════════════════════════════════════════════
// 9. EXPORT
// ════════════════════════════════════════════

Export.table.toDrive({
  collection: sampledValues,
  description: 'NodiWatch_Pollution_Indices',
  folder: 'NodiWatch',
  fileFormat: 'CSV'
});

Export.image.toDrive({
  image: pollutionSeverity.toFloat(),
  description: 'NodiWatch_PollutionSeverity_Dhaka',
  folder: 'NodiWatch',
  region: AOI,
  scale: 10,
  maxPixels: 1e10,
  crs: 'EPSG:4326'
});

print('═══ NodiWatch Pollution Analysis Complete ═══');
print('NDTI: High values = high turbidity');
print('CDOM: High values = high organic pollution');
print('R/B Ratio: High values = dye presence');
print('NOTE: Sentinel-2 CANNOT measure water temperature.');
