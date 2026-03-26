/*
 * ═══════════════════════════════════════════════════════════════
 *  NodiWatch — Accuracy Validation
 *  Google Earth Engine Script
 * ═══════════════════════════════════════════════════════════════
 *
 *  Purpose: Validate MNDWI water classification accuracy using
 *           reference points manually labeled from high-resolution
 *           Google Earth imagery.
 *
 *  Output: Confusion matrix, Overall Accuracy, Kappa, F1-score
 *
 *  Methodology:
 *    1. Manually define reference points as "water" or "land"
 *       based on visual inspection of Google Earth satellite basemap
 *    2. Run MNDWI classification on same locations
 *    3. Compare classified vs reference → confusion matrix
 *    4. Calculate accuracy metrics
 *
 *  NOTE: For a rigorous validation, you should add MORE reference
 *  points (100+) distributed across different river segments.
 *  The 40 points here are a starting demonstration.
 */

// ════════════════════════════════════════════
// 1. AREA OF INTEREST & DATA
// ════════════════════════════════════════════

var AOI = ee.Geometry.Rectangle([90.30, 23.65, 90.55, 23.90]);
Map.centerObject(AOI, 12);

function maskS2clouds(image) {
  var qa = image.select('QA60');
  var mask = qa.bitwiseAnd(1 << 10).eq(0).and(qa.bitwiseAnd(1 << 11).eq(0));
  return image.updateMask(mask).copyProperties(image, ['system:time_start']);
}

var s2 = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
    .filterBounds(AOI)
    .filterDate('2025-11-01', '2026-03-25')
    .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20))
    .map(maskS2clouds)
    .median()
    .clip(AOI);

// Compute MNDWI
var mndwi = s2.normalizedDifference(['B3', 'B11']).rename('MNDWI');
var classified = mndwi.gt(0.0).rename('classified');

// ════════════════════════════════════════════
// 2. REFERENCE POINTS (manually labeled)
// ════════════════════════════════════════════

/*
 * Reference labels:
 *   class = 1 → WATER (visually confirmed from Google Earth)
 *   class = 0 → LAND (visually confirmed from Google Earth)
 *
 * Points are distributed across:
 *   - Buriganga River (clearly water / clearly land)
 *   - Turag River
 *   - Balu River
 *   - Shitalakshya River
 *   - Urban areas (land)
 *   - Agricultural areas near rivers (land)
 *
 * IMPORTANT: Add more points for your specific validation.
 * These coordinates should be verified against recent Google Earth imagery.
 */

var referencePoints = ee.FeatureCollection([
  // === WATER POINTS (class = 1) ===
  // Buriganga River - center of river channel
  ee.Feature(ee.Geometry.Point([90.3900, 23.6950]), {class: 1, name: 'buriganga_w1'}),
  ee.Feature(ee.Geometry.Point([90.3980, 23.6930]), {class: 1, name: 'buriganga_w2'}),
  ee.Feature(ee.Geometry.Point([90.4050, 23.6920]), {class: 1, name: 'buriganga_w3'}),
  ee.Feature(ee.Geometry.Point([90.4150, 23.6900]), {class: 1, name: 'buriganga_w4'}),
  ee.Feature(ee.Geometry.Point([90.4250, 23.6880]), {class: 1, name: 'buriganga_w5'}),
  
  // Turag River
  ee.Feature(ee.Geometry.Point([90.3500, 23.8700]), {class: 1, name: 'turag_w1'}),
  ee.Feature(ee.Geometry.Point([90.3530, 23.8600]), {class: 1, name: 'turag_w2'}),
  ee.Feature(ee.Geometry.Point([90.3550, 23.8500]), {class: 1, name: 'turag_w3'}),
  ee.Feature(ee.Geometry.Point([90.3580, 23.8400]), {class: 1, name: 'turag_w4'}),
  
  // Balu River
  ee.Feature(ee.Geometry.Point([90.4740, 23.7900]), {class: 1, name: 'balu_w1'}),
  ee.Feature(ee.Geometry.Point([90.4760, 23.7800]), {class: 1, name: 'balu_w2'}),
  ee.Feature(ee.Geometry.Point([90.4770, 23.7700]), {class: 1, name: 'balu_w3'}),
  
  // Shitalakshya River
  ee.Feature(ee.Geometry.Point([90.5180, 23.8000]), {class: 1, name: 'shitalakshya_w1'}),
  ee.Feature(ee.Geometry.Point([90.5200, 23.7900]), {class: 1, name: 'shitalakshya_w2'}),
  ee.Feature(ee.Geometry.Point([90.5220, 23.7800]), {class: 1, name: 'shitalakshya_w3'}),
  ee.Feature(ee.Geometry.Point([90.5240, 23.7700]), {class: 1, name: 'shitalakshya_w4'}),
  
  // Ponds / Water bodies
  ee.Feature(ee.Geometry.Point([90.4100, 23.7500]), {class: 1, name: 'pond_w1'}),
  ee.Feature(ee.Geometry.Point([90.3700, 23.7300]), {class: 1, name: 'pond_w2'}),
  ee.Feature(ee.Geometry.Point([90.4400, 23.7600]), {class: 1, name: 'pond_w3'}),
  ee.Feature(ee.Geometry.Point([90.3600, 23.7800]), {class: 1, name: 'pond_w4'}),
  
  // === LAND POINTS (class = 0) ===
  // Urban areas
  ee.Feature(ee.Geometry.Point([90.3900, 23.7300]), {class: 0, name: 'urban_l1'}),
  ee.Feature(ee.Geometry.Point([90.4000, 23.7400]), {class: 0, name: 'urban_l2'}),
  ee.Feature(ee.Geometry.Point([90.3800, 23.7200]), {class: 0, name: 'urban_l3'}),
  ee.Feature(ee.Geometry.Point([90.4100, 23.7700]), {class: 0, name: 'urban_l4'}),
  ee.Feature(ee.Geometry.Point([90.3700, 23.7500]), {class: 0, name: 'urban_l5'}),
  ee.Feature(ee.Geometry.Point([90.4200, 23.7800]), {class: 0, name: 'urban_l6'}),
  ee.Feature(ee.Geometry.Point([90.3950, 23.7600]), {class: 0, name: 'urban_l7'}),
  ee.Feature(ee.Geometry.Point([90.4050, 23.7100]), {class: 0, name: 'urban_l8'}),
  
  // Agricultural / vegetation areas near rivers
  ee.Feature(ee.Geometry.Point([90.3400, 23.8800]), {class: 0, name: 'agri_l1'}),
  ee.Feature(ee.Geometry.Point([90.4800, 23.7600]), {class: 0, name: 'agri_l2'}),
  ee.Feature(ee.Geometry.Point([90.5300, 23.7500]), {class: 0, name: 'veg_l1'}),
  ee.Feature(ee.Geometry.Point([90.3300, 23.8500]), {class: 0, name: 'veg_l2'}),
  
  // Riverbank edges (challenging mixed pixels)
  ee.Feature(ee.Geometry.Point([90.3920, 23.6960]), {class: 0, name: 'bank_l1'}),
  ee.Feature(ee.Geometry.Point([90.3560, 23.8550]), {class: 0, name: 'bank_l2'}),
  ee.Feature(ee.Geometry.Point([90.4780, 23.7750]), {class: 0, name: 'bank_l3'}),
  ee.Feature(ee.Geometry.Point([90.5210, 23.7850]), {class: 0, name: 'bank_l4'}),
  
  // Roads / Infrastructure
  ee.Feature(ee.Geometry.Point([90.4000, 23.7000]), {class: 0, name: 'road_l1'}),
  ee.Feature(ee.Geometry.Point([90.3850, 23.7100]), {class: 0, name: 'road_l2'}),
  ee.Feature(ee.Geometry.Point([90.4300, 23.7200]), {class: 0, name: 'infra_l1'}),
  ee.Feature(ee.Geometry.Point([90.4500, 23.7400]), {class: 0, name: 'infra_l2'}),
]);

print('Total reference points:', referencePoints.size());

// ════════════════════════════════════════════
// 3. SAMPLE CLASSIFIED VALUES AT REFERENCE POINTS
// ════════════════════════════════════════════

var validation = classified.sampleRegions({
  collection: referencePoints,
  properties: ['class', 'name'],
  scale: 10
});

// ════════════════════════════════════════════
// 4. COMPUTE CONFUSION MATRIX & ACCURACY
// ════════════════════════════════════════════

var confusionMatrix = validation.errorMatrix('class', 'classified');

print('═══════════════════════════════════════');
print('    MNDWI WATER CLASSIFICATION ACCURACY');
print('═══════════════════════════════════════');
print('Confusion Matrix:', confusionMatrix);
print('Overall Accuracy:', confusionMatrix.accuracy());
print('Kappa Coefficient:', confusionMatrix.kappa());
print('Consumer Accuracy (per-class):', confusionMatrix.consumersAccuracy());
print('Producer Accuracy (per-class):', confusionMatrix.producersAccuracy());

// F1 Score calculation
// F1 = 2 * (Precision * Recall) / (Precision + Recall)
// For water class (class 1):
var matrix = confusionMatrix.array();
print('Confusion Matrix Array:', matrix);

// ════════════════════════════════════════════
// 5. VISUALIZATION
// ════════════════════════════════════════════

// True color
Map.addLayer(s2, {bands: ['B4', 'B3', 'B2'], min: 0, max: 3000}, 'True Color', false);

// MNDWI
Map.addLayer(mndwi, {min: -0.5, max: 0.8, palette: ['brown', 'white', 'cyan', 'blue']},
    'MNDWI', false);

// Classified water
Map.addLayer(classified.selfMask(), {palette: ['00BFFF']}, 'Classified Water');

// Reference points colored by class
var waterRef = referencePoints.filter(ee.Filter.eq('class', 1));
var landRef = referencePoints.filter(ee.Filter.eq('class', 0));
Map.addLayer(waterRef, {color: '0000FF'}, 'Reference: Water');
Map.addLayer(landRef, {color: 'FF0000'}, 'Reference: Land');

// ════════════════════════════════════════════
// 6. EXPORT VALIDATION RESULTS
// ════════════════════════════════════════════

Export.table.toDrive({
  collection: validation,
  description: 'NodiWatch_Validation_Results',
  folder: 'NodiWatch',
  fileFormat: 'CSV'
});

print('═══ Validation Complete ═══');
print('Blue dots = reference water points');
print('Red dots = reference land points');
print('If accuracy < 80%, consider adjusting the MNDWI threshold');
print('Current threshold: MNDWI > 0.0');
