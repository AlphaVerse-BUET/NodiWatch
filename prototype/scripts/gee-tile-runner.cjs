const fs = require("fs");
const path = require("path");
const { loadEnvConfig } = require("@next/env");
const ee = require("@google/earthengine");

const DHAKA_BBOX = {
  south: 23.65,
  west: 90.3,
  north: 23.9,
  east: 90.55,
};

let initialized = false;

function jsonOut(payload, exitCode) {
  const text = JSON.stringify(payload);
  if (exitCode === 0) {
    process.stdout.write(text);
  } else {
    process.stderr.write(text);
  }
  process.exit(exitCode);
}

function normalizePrivateKey(privateKey) {
  return privateKey.includes("\\n")
    ? privateKey.replace(/\\n/g, "\n")
    : privateKey;
}

function serviceAccountCandidates(envJsonPath) {
  const projectRoot = path.resolve(__dirname, "..");
  const candidates = [];

  if (envJsonPath) {
    candidates.push(
      path.isAbsolute(envJsonPath)
        ? envJsonPath
        : path.resolve(projectRoot, envJsonPath),
    );
  }

  candidates.push(
    path.resolve(projectRoot, "aquascaping-468411-a8c219a7697b.json"),
  );

  return [...new Set(candidates)];
}

function loadServiceAccount() {
  const envEmail = process.env.GEE_SERVICE_ACCOUNT_EMAIL;
  const envPrivateKey = process.env.GEE_PRIVATE_KEY;
  const envProjectId = process.env.GEE_PROJECT_ID || "aquascaping-468411";

  if (envEmail && envPrivateKey) {
    return {
      client_email: envEmail,
      private_key: normalizePrivateKey(envPrivateKey),
      project_id: envProjectId,
    };
  }

  for (const candidatePath of serviceAccountCandidates(process.env.GEE_SERVICE_ACCOUNT_JSON)) {
    try {
      const parsed = JSON.parse(fs.readFileSync(candidatePath, "utf8"));
      if (parsed.client_email && parsed.private_key) {
        return {
          client_email: parsed.client_email,
          private_key: normalizePrivateKey(parsed.private_key),
          project_id: parsed.project_id || envProjectId,
        };
      }
    } catch {
      continue;
    }
  }

  throw new Error("GEE credentials not found");
}

function initializeEarthEngine() {
  if (initialized) {
    return Promise.resolve();
  }

  const serviceAccount = loadServiceAccount();

  return new Promise((resolve, reject) => {
    ee.data.authenticateViaPrivateKey(
      {
        client_email: serviceAccount.client_email,
        private_key: serviceAccount.private_key,
      },
      () => {
        ee.initialize(
          null,
          null,
          () => {
            initialized = true;
            resolve();
          },
          (error) => {
            reject(error instanceof Error ? error : new Error(String(error)));
          },
          null,
          serviceAccount.project_id,
        );
      },
      (error) => {
        reject(error instanceof Error ? error : new Error(String(error)));
      },
    );
  });
}

function mapUrlFromImage(image, visParams, label) {
  try {
    const mapId = image.getMapId(visParams);
    if (mapId?.tile_fetcher?.url_format) {
      return mapId.tile_fetcher.url_format;
    }

    if (mapId?.urlFormat) {
      return mapId.urlFormat;
    }

    if (mapId?.mapid && typeof mapId.formatTileUrl === "function") {
      return mapId.formatTileUrl("{x}", "{y}", "{z}");
    }
  } catch (error) {
    throw new Error(
      `${label} map rendering failed: ${error instanceof Error ? error.message : String(error)}`,
    );
  }

  throw new Error(`${label} map rendering failed`);
}

function dhakaAoi() {
  return ee.Geometry.Rectangle([
    DHAKA_BBOX.west,
    DHAKA_BBOX.south,
    DHAKA_BBOX.east,
    DHAKA_BBOX.north,
  ]);
}

function dhakaCenter() {
  return ee.Geometry.Point([90.4125, 23.8103]);
}

function createPollutionTiles() {
  const aoi = dhakaAoi();
  const point = dhakaCenter();
  const s2 = ee
    .ImageCollection("COPERNICUS/S2_SR_HARMONIZED")
    .filterBounds(point)
    .filterDate("2023-11-01", "2024-03-31")
    .filter(ee.Filter.lt("CLOUDY_PIXEL_PERCENTAGE", 20));

  const image = s2.median().clip(aoi);
  const mndwi = image.normalizedDifference(["B3", "B11"]);
  const waterMask = mndwi.gt(0.0);
  const waterOnlyImage = image.updateMask(waterMask);

  const redBlueRatio = waterOnlyImage
    .select("B4")
    .divide(waterOnlyImage.select("B2").add(1e-6));
  const ndti = waterOnlyImage.normalizedDifference(["B4", "B3"]);
  const cdom = waterOnlyImage
    .select("B3")
    .multiply(waterOnlyImage.select("B4"))
    .divide(waterOnlyImage.select("B2").add(1e-6));

  return {
    redBlueRatio: {
      url: mapUrlFromImage(
        redBlueRatio,
        {
          min: 0.7,
          max: 1.4,
          palette: ["blue", "purple", "red"],
          format: "png",
        },
        "Pollution red/blue ratio",
      ),
      description: "Red/Blue ratio for textile dye detection",
      palette: "blue -> purple -> red",
    },
    ndti: {
      url: mapUrlFromImage(
        ndti,
        {
          min: -0.3,
          max: 0.8,
          palette: ["blue", "green", "yellow", "red"],
          format: "png",
        },
        "Pollution NDTI",
      ),
      description: "NDTI turbidity proxy",
      palette: "blue -> green -> yellow -> red",
    },
    cdom: {
      url: mapUrlFromImage(
        cdom,
        {
          min: 0.2,
          max: 2.2,
          palette: ["navy", "purple", "orange", "red"],
          format: "png",
        },
        "Pollution CDOM",
      ),
      description: "CDOM organic load proxy",
      palette: "navy -> purple -> orange -> red",
    },
  };
}

function createWaterTile(year) {
  const point = dhakaCenter();
  const startDate = `${year - 1}-11-01`;
  const endDate = `${year}-03-31`;
  const s2 = ee
    .ImageCollection("COPERNICUS/S2_SR_HARMONIZED")
    .filterBounds(point)
    .filterDate(startDate, endDate)
    .filter(ee.Filter.lt("CLOUDY_PIXEL_PERCENTAGE", 20));

  const image = s2.median().clip(dhakaAoi());
  const mndwi = image.normalizedDifference(["B3", "B11"]);
  const waterMask = mndwi.gt(0).selfMask();
  const palette = year === 2016 ? "#3b82f6" : "#ef4444";

  return {
    url: mapUrlFromImage(
      waterMask,
      {
        min: 0,
        max: 1,
        palette: [palette],
        format: "png",
      },
      `Water mask ${year}`,
    ),
    year,
    description: year === 2016 ? "MNDWI baseline water mask" : "MNDWI current water mask",
    palette: year === 2016 ? "blue" : "red",
  };
}

function createWaterTiles() {
  return {
    baseline_2016: createWaterTile(2016),
    current_2026: createWaterTile(2026),
  };
}

function createErosionTile() {
  const aoi = dhakaAoi();
  const s2 = ee
    .ImageCollection("COPERNICUS/S2_SR_HARMONIZED")
    .filterBounds(aoi)
    .filterDate("2024-11-01", "2025-03-31")
    .filter(ee.Filter.lt("CLOUDY_PIXEL_PERCENTAGE", 20));

  const opticalImage = s2.median();
  const waterMask = opticalImage.normalizedDifference(["B3", "B11"]).gt(0.0);

  const s1Pre = ee
    .ImageCollection("COPERNICUS/S1_GRD")
    .filterBounds(aoi)
    .filterDate("2025-03-01", "2025-05-31")
    .filter(ee.Filter.eq("instrumentMode", "IW"))
    .filter(ee.Filter.listContains("transmitterReceiverPolarisation", "VV"))
    .filter(ee.Filter.eq("orbitProperties_pass", "ASCENDING"))
    .select("VV");

  const s1Post = ee
    .ImageCollection("COPERNICUS/S1_GRD")
    .filterBounds(aoi)
    .filterDate("2024-10-01", "2024-12-31")
    .filter(ee.Filter.eq("instrumentMode", "IW"))
    .filter(ee.Filter.listContains("transmitterReceiverPolarisation", "VV"))
    .filter(ee.Filter.eq("orbitProperties_pass", "ASCENDING"))
    .select("VV");

  const sarPreFiltered = s1Pre.median().focal_median(1, "circle", "pixels");
  const sarPostFiltered = s1Post.median().focal_median(1, "circle", "pixels");
  const sarChange = sarPostFiltered.subtract(sarPreFiltered).updateMask(waterMask);
  const erosionIndex = sarChange.updateMask(sarChange.lt(-2));

  return {
    sar_erosion: {
      url: mapUrlFromImage(
        erosionIndex,
        {
          min: -6,
          max: 0,
          palette: ["red", "yellow", "green"],
          format: "png",
        },
        "SAR erosion",
      ),
      description: "Sentinel-1 SAR erosion detection",
      interpretation: "Green=stable, Yellow=moderate, Red=critical",
      methodology: "VV polarization median composite",
    },
  };
}

async function main() {
  loadEnvConfig(path.resolve(__dirname, ".."));
  await initializeEarthEngine();

  const command = process.argv[2];
  if (!command) {
    throw new Error("Missing GEE command");
  }

  if (command === "pollution") {
    jsonOut({ ok: true, data: createPollutionTiles() }, 0);
  }

  if (command === "water") {
    const year = Number.parseInt(process.argv[3] || "2026", 10);
    if (!Number.isFinite(year) || year < 2016 || year > 2026) {
      throw new Error("Invalid water year");
    }
    jsonOut({ ok: true, data: createWaterTile(year) }, 0);
  }

  if (command === "water-pair") {
    jsonOut({ ok: true, data: createWaterTiles() }, 0);
  }

  if (command === "erosion") {
    jsonOut({ ok: true, data: createErosionTile() }, 0);
  }

  throw new Error(`Unknown GEE command: ${command}`);
}

main().catch((error) => {
  jsonOut(
    {
      ok: false,
      error: error instanceof Error ? error.message : String(error),
    },
    1,
  );
});
