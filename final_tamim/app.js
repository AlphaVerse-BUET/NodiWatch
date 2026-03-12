/* ═══════════════════════════════════════════════
   NodiWatch Final — Application Logic
   ═══════════════════════════════════════════════ */

// ─── State ───
let map;
let pollutionData = null;
let factoryData = null;
let encroachData = null;
let riverData = null;

let pollutionMarkers = [];
let factoryMarkers = [];
let encroachMarkers = [];
let riverLayers = [];
let heatCircles = [];

let activeLayer = "pollution";

// ─── Colors ───
const COLORS = {
  teal: "#06d6a0",
  blue: "#118ab2",
  red: "#ef476f",
  yellow: "#ffd166",
  purple: "#7b2ff7",
  orange: "#f97316",
  text: "#f1f5f9",
  muted: "#8294b0",
};

const TYPE_COLORS = {
  textile: COLORS.red,
  tannery: COLORS.yellow,
  thermal: COLORS.purple,
};

// ═══ INIT ═══
document.addEventListener("DOMContentLoaded", async () => {
  initMap();
  await loadData();
  renderRivers();
  renderPollution();
  renderFactories();
  renderEncroachment();
  renderAlerts();
  renderRiverList();
  setupEvents();
  showLayer("pollution");
  animateStatCounters();
});

// ═══ ANIMATED STAT COUNTERS ═══
function animateStatCounters() {
  const counters = [
    { el: document.getElementById("stat-hotspots"), target: 10, suffix: "" },
    { el: document.getElementById("stat-encroach"), target: 5, suffix: "" },
    { el: document.getElementById("stat-factories"), target: 13, suffix: "" },
    { el: document.getElementById("stat-alerts"), target: 3, suffix: "" },
  ];
  counters.forEach(({ el, target, suffix }) => {
    if (!el) return;
    let current = 0;
    const step = Math.ceil(target / 30);
    const interval = setInterval(() => {
      current += step;
      if (current >= target) { current = target; clearInterval(interval); }
      el.textContent = current + suffix;
    }, 40);
  });
}

// ═══ MAP INIT ═══
function initMap() {
  map = L.map("map", {
    center: [23.755, 90.41],
    zoom: 12,
    zoomControl: true,
    attributionControl: true,
  });
  L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
    attribution: '&copy; <a href="https://carto.com/">CARTO</a> | NodiWatch',
    subdomains: "abcd",
    maxZoom: 19,
  }).addTo(map);
}

// ═══ LOAD DATA ═══
async function loadData() {
  try {
    const [r1, r2, r3, r4] = await Promise.all([
      fetch("data/rivers.geojson").then((r) => r.json()),
      fetch("data/pollution.json").then((r) => r.json()),
      fetch("data/factories.json").then((r) => r.json()),
      fetch("data/encroachment.json").then((r) => r.json()),
    ]);
    riverData = r1;
    pollutionData = r2;
    factoryData = r3;
    encroachData = r4;
  } catch (e) {
    console.error("Data load error:", e);
  }
}

// ═══ RENDER RIVERS ═══
function renderRivers() {
  if (!riverData) return;
  const statusColors = {
    critical: COLORS.red,
    severe: COLORS.yellow,
    moderate: COLORS.teal,
  };
  riverData.features.forEach((feature) => {
    const color = statusColors[feature.properties.status] || COLORS.blue;
    const layer = L.geoJSON(feature, {
      style: { color, weight: 3, opacity: 0.6, dashArray: "8 4" },
    }).addTo(map);
    layer.bindTooltip(feature.properties.name, {
      permanent: false, direction: "top", className: "river-tooltip",
    });
    riverLayers.push(layer);
  });
}

// ═══ RENDER POLLUTION ═══
function renderPollution() {
  if (!pollutionData) return;
  pollutionData.hotspots.forEach((hs) => {
    const radius = 300 + hs.severity * 5;
    const circle = L.circle([hs.lat, hs.lng], {
      radius, color: TYPE_COLORS[hs.type] || COLORS.red,
      fillColor: TYPE_COLORS[hs.type] || COLORS.red,
      fillOpacity: 0.12 + hs.severity / 500, weight: 1, opacity: 0.3,
    }).addTo(map);
    heatCircles.push(circle);

    const innerCircle = L.circle([hs.lat, hs.lng], {
      radius: radius * 0.4,
      color: TYPE_COLORS[hs.type] || COLORS.red,
      fillColor: TYPE_COLORS[hs.type] || COLORS.red,
      fillOpacity: 0.2 + hs.severity / 400, weight: 0,
    }).addTo(map);
    heatCircles.push(innerCircle);

    const icon = L.divIcon({
      className: `hotspot-marker ${hs.type}`,
      iconSize: [18, 18], iconAnchor: [9, 9],
    });
    const marker = L.marker([hs.lat, hs.lng], { icon }).addTo(map);

    const sevColor = hs.severity >= 80 ? COLORS.red : hs.severity >= 60 ? COLORS.yellow : COLORS.teal;
    marker.bindPopup(`
      <div style="min-width:220px">
        <div class="popup-title">${hs.label}</div>
        <span class="popup-type ${hs.type}">${hs.type}</span>
        <div style="font-size:.78rem;color:${COLORS.muted};margin:6px 0">${hs.river} River • ${hs.id}</div>
        <div class="popup-severity">
          <div class="popup-severity-bar">
            <div class="popup-severity-fill" style="width:${hs.severity}%;background:${sevColor}"></div>
          </div>
          <span class="popup-severity-num" style="color:${sevColor}">${hs.severity}</span>
        </div>
        <button class="popup-btn" onclick="showHotspotDetail('${hs.id}')">View Full Analysis →</button>
      </div>
    `, { maxWidth: 280 });
    pollutionMarkers.push({ marker, circles: [circle, innerCircle], data: hs });
  });
}

// ═══ RENDER FACTORIES ═══
function renderFactories() {
  if (!factoryData) return;
  factoryData.factories.forEach((f) => {
    const icon = L.divIcon({
      className: `factory-marker ${f.status === "flagged" ? "flagged" : ""}`,
      iconSize: [12, 12], iconAnchor: [6, 6],
    });
    const marker = L.marker([f.lat, f.lng], { icon }).addTo(map);
    marker.bindPopup(`
      <div style="min-width:200px">
        <div class="popup-title">${f.name}</div>
        <span class="popup-type ${f.type}">${f.type}</span>
        ${f.status === "flagged" ? '<span class="popup-type" style="background:rgba(239,71,111,0.15);color:#ef476f;margin-left:4px">⚠ FLAGGED</span>' : ""}
        <div style="font-size:.78rem;color:${COLORS.muted};margin:6px 0">${f.distance_m}m from river • ${f.violations} violations</div>
        <div style="margin-top:6px">
          <span style="font-size:.7rem;color:${COLORS.muted}">Attribution Score</span>
          <div style="font-family:Space Grotesk;font-size:1.3rem;font-weight:800;color:${f.attribution >= 70 ? COLORS.red : f.attribution >= 40 ? COLORS.yellow : COLORS.teal}">${f.attribution}%</div>
        </div>
      </div>
    `, { maxWidth: 260 });
    factoryMarkers.push({ marker, data: f });
  });
}

// ═══ RENDER ENCROACHMENT ═══
function renderEncroachment() {
  if (!encroachData) return;
  encroachData.segments.forEach((seg) => {
    const icon = L.divIcon({
      className: "encroach-marker",
      html: `<span>${Math.round(seg.shrinkage_pct)}%</span>`,
      iconSize: [36, 24], iconAnchor: [18, 12],
    });
    const marker = L.marker([seg.lat, seg.lng], { icon }).addTo(map);

    if (seg.boundary_2016 && seg.boundary_2016.length) {
      const line2016 = L.polyline(seg.boundary_2016.map((c) => [c[1], c[0]]), {
        color: COLORS.teal, weight: 2, opacity: 0.7, dashArray: "6 4",
      }).addTo(map);
      encroachMarkers.push({ layer: line2016 });
    }
    if (seg.boundary_2026 && seg.boundary_2026.length) {
      const line2026 = L.polyline(seg.boundary_2026.map((c) => [c[1], c[0]]), {
        color: COLORS.red, weight: 2, opacity: 0.8,
      }).addTo(map);
      encroachMarkers.push({ layer: line2026 });
    }

    const fillArea = L.circle([seg.lat, seg.lng], {
      radius: 200 + seg.shrinkage_pct * 4,
      color: COLORS.yellow, fillColor: COLORS.yellow,
      fillOpacity: 0.08, weight: 1, opacity: 0.2, dashArray: "4 4",
    }).addTo(map);
    encroachMarkers.push({ layer: fillArea });

    marker.bindPopup(`
      <div style="min-width:240px">
        <div class="popup-title">${seg.river} — ${seg.location}</div>
        <span class="popup-type" style="background:rgba(255,209,102,0.15);color:${COLORS.yellow}">নদী দখল ENCROACHMENT</span>
        <div style="margin:10px 0">
          <div style="display:flex;justify-content:space-between;font-size:.78rem;margin-bottom:4px">
            <span style="color:${COLORS.teal}">2016: ${seg.width_2016}m</span>
            <span style="color:${COLORS.red}">2026: ${seg.width_2026}m</span>
          </div>
          <div style="height:6px;background:rgba(255,255,255,0.05);border-radius:3px;overflow:hidden">
            <div style="width:${seg.shrinkage_pct}%;height:100%;background:linear-gradient(90deg,${COLORS.yellow},${COLORS.red});border-radius:3px"></div>
          </div>
        </div>
        <div style="font-family:Space Grotesk;font-size:1.4rem;font-weight:800;color:${COLORS.red};text-align:center">-${seg.shrinkage_pct.toFixed(1)}% Width Lost</div>
        <div style="font-size:.72rem;color:${COLORS.muted};margin-top:6px">Cause: ${seg.cause}</div>
        <div style="font-size:.72rem;color:${COLORS.muted}">Affected: ~${(seg.affected_population / 1000).toFixed(0)}K residents</div>
        <button class="popup-btn" onclick="showEncroachDetail('${seg.id}')">View Detailed Analysis →</button>
      </div>
    `, { maxWidth: 300 });
    encroachMarkers.push({ marker, data: seg });
  });
}

// ═══ LAYER VISIBILITY ═══
function showLayer(layer) {
  activeLayer = layer;
  document.querySelectorAll(".lt").forEach((btn) => btn.classList.remove("active"));
  document.getElementById(`btn-${layer}`).classList.add("active");

  const showPollution = layer === "pollution";
  const showFactories = layer === "factories";
  const showEncroach = layer === "encroachment";

  pollutionMarkers.forEach((m) => {
    if (showPollution) { m.marker.addTo(map); m.circles.forEach((c) => c.addTo(map)); }
    else { map.removeLayer(m.marker); m.circles.forEach((c) => map.removeLayer(c)); }
  });

  factoryMarkers.forEach((m) => {
    if (showFactories || showPollution) m.marker.addTo(map);
    else map.removeLayer(m.marker);
  });

  encroachMarkers.forEach((m) => {
    if (m.marker) { if (showEncroach) m.marker.addTo(map); else map.removeLayer(m.marker); }
    if (m.layer) { if (showEncroach) m.layer.addTo(map); else map.removeLayer(m.layer); }
  });

  document.getElementById("panel-detail").classList.add("hidden");
  if (layer === "encroachment") renderEncroachmentPanel();
  else document.getElementById("panel-rivers").classList.remove("hidden");
}

// ═══ ALERTS ═══
function renderAlerts() {
  const feed = document.getElementById("alertFeed");
  if (!pollutionData) return;
  const alerts = [
    { type: "critical", icon: "🔴", text: "CRITICAL: Balu River dye pollution at 94% severity — Highest recorded this quarter", meta: "HS-008 • 2 hours ago", hotspot: "HS-008" },
    { type: "critical", icon: "🔴", text: "Buriganga tannery waste detected — Chromium levels 60× WHO limit", meta: "HS-002 • 5 hours ago", hotspot: "HS-002" },
    { type: "critical", icon: "⚠️", text: "Turag encroachment breach: 57% width lost at Aminbazar — নদী দখল Action required", meta: "ENC-002 • 1 day ago", hotspot: null },
    { type: "warning", icon: "🟡", text: "New textile discharge detected on Turag River near dyeing cluster", meta: "HS-005 • 1 day ago", hotspot: "HS-005" },
    { type: "warning", icon: "🟡", text: "Balu River encroachment exceeded 60% threshold — Critical zone", meta: "ENC-003 • 2 days ago", hotspot: null },
    { type: "info", icon: "🔵", text: "Shitalakshya pollution levels decreased 12% after factory inspection", meta: "HS-006 • 3 days ago", hotspot: "HS-006" },
    { type: "info", icon: "🛰️", text: "New Sentinel-2 imagery processed — All 5 rivers updated", meta: "System • 3 days ago", hotspot: null },
  ];
  feed.innerHTML = alerts.map((a) => `
    <div class="alert-item ${a.type}" ${a.hotspot ? `onclick="showHotspotDetail('${a.hotspot}')"` : ""}>
      <span class="alert-icon">${a.icon}</span>
      <div class="alert-body">
        <div class="alert-text">${a.text}</div>
        <div class="alert-meta">${a.meta}</div>
      </div>
    </div>
  `).join("");
}

// ═══ RIVER LIST ═══
function renderRiverList() {
  const container = document.getElementById("riverList");
  if (!riverData) return;
  container.innerHTML = riverData.features.map((f) => {
    const p = f.properties;
    const shrinkage = p.width_2016 > 0 ? ((p.width_2016 - p.width_2026) / p.width_2016) * 100 : 0;
    return `
      <div class="river-item" onclick="map.flyTo([${f.geometry.coordinates[Math.floor(f.geometry.coordinates.length / 2)][1]}, ${f.geometry.coordinates[Math.floor(f.geometry.coordinates.length / 2)][0]}], 14)">
        <div class="river-info">
          <div class="river-name">${p.name}</div>
          <div class="river-status">${p.width_2026}m width • -${shrinkage.toFixed(0)}% from 2016</div>
        </div>
        <div class="river-bar-wrap">
          <div class="river-bar ${p.status}" style="width:${shrinkage}%"></div>
        </div>
        <span class="severity-badge ${p.status}">${p.status}</span>
      </div>
    `;
  }).join("");
}

// ═══ ENCROACHMENT PANEL ═══
function renderEncroachmentPanel() {
  const container = document.getElementById("riverList");
  if (!encroachData) return;
  container.innerHTML = encroachData.segments.map((seg) => `
    <div class="encroach-card" onclick="showEncroachDetail('${seg.id}')">
      <div class="encroach-top">
        <div>
          <div class="encroach-river">${seg.river}</div>
          <div style="font-size:.72rem;color:${COLORS.muted}">${seg.location}</div>
        </div>
        <div class="encroach-pct">-${seg.shrinkage_pct.toFixed(1)}%</div>
      </div>
      <div class="width-comparison">
        <div class="width-block">
          <div class="width-year">2016</div>
          <div class="width-val" style="color:${COLORS.teal}">${seg.width_2016}m</div>
        </div>
        <div class="width-arrow">→</div>
        <div class="width-block">
          <div class="width-year">2026</div>
          <div class="width-val" style="color:${COLORS.red}">${seg.width_2026}m</div>
        </div>
      </div>
      <div class="shrinkage-bar-wrap">
        <div class="shrinkage-bar" style="width:${seg.shrinkage_pct}%"></div>
      </div>
    </div>
  `).join("");
}

// ═══ HOTSPOT DETAIL ═══
window.showHotspotDetail = function (id) {
  const hs = pollutionData.hotspots.find((h) => h.id === id);
  if (!hs) return;
  const panel = document.getElementById("panel-detail");
  const content = document.getElementById("detail-content");
  const title = document.getElementById("detail-title");
  panel.classList.remove("hidden");
  title.textContent = `🎯 ${hs.label}`;

  const related = factoryData.factories.filter((f) => f.hotspot === id);
  related.sort((a, b) => b.attribution - a.attribution);
  const sevColor = hs.severity >= 80 ? COLORS.red : hs.severity >= 60 ? COLORS.yellow : COLORS.teal;

  content.innerHTML = `
    <div class="detail-section">
      <h4>Pollution Summary</h4>
      <div class="detail-row"><span class="detail-key">Hotspot ID</span><span class="detail-val">${hs.id}</span></div>
      <div class="detail-row"><span class="detail-key">River</span><span class="detail-val">${hs.river}</span></div>
      <div class="detail-row"><span class="detail-key">Type</span><span class="detail-val" style="color:${TYPE_COLORS[hs.type]}">${hs.type.toUpperCase()}</span></div>
      <div class="detail-row"><span class="detail-key">Severity</span><span class="detail-val" style="color:${sevColor}">${hs.severity}/100</span></div>
      <div class="detail-row"><span class="detail-key">Detected</span><span class="detail-val">${hs.detected}</span></div>
      <p style="font-size:.78rem;color:${COLORS.muted};margin-top:8px;line-height:1.5">${hs.description}</p>
    </div>
    <div class="detail-section">
      <h4>Spectral Signatures</h4>
      <div class="spectral-grid">
        <div class="spectral-item"><div class="spectral-val" style="color:${COLORS.yellow}">${hs.spectral.ndti}</div><div class="spectral-label">NDTI</div></div>
        <div class="spectral-item"><div class="spectral-val" style="color:${COLORS.red}">${hs.spectral.redBlueRatio}</div><div class="spectral-label">R/B Ratio</div></div>
        <div class="spectral-item"><div class="spectral-val" style="color:${COLORS.purple}">${hs.spectral.thermal}°C</div><div class="spectral-label">Thermal</div></div>
      </div>
    </div>
    <div class="detail-section">
      <h4>Factory Attribution (${related.length} nearby)</h4>
      ${related.map((f) => {
        const barColor = f.attribution >= 70 ? COLORS.red : f.attribution >= 40 ? COLORS.yellow : COLORS.teal;
        return `
          <div class="factory-card ${f.status === "flagged" ? "flagged" : ""}">
            <div style="display:flex;justify-content:space-between;align-items:flex-start">
              <div>
                <div class="factory-name">${f.name}</div>
                <div class="factory-type">${f.type} • ${f.distance_m}m away • ${f.violations} violations</div>
              </div>
              <div class="attr-score" style="color:${barColor}">${f.attribution}%</div>
            </div>
            <div class="attribution-bar-wrap">
              <div class="attribution-bar" style="width:${f.attribution}%;background:${barColor}"></div>
            </div>
          </div>`;
      }).join("")}
    </div>
  `;
  map.flyTo([hs.lat, hs.lng], 15, { duration: 1.5 });
};

// ═══ ENCROACHMENT DETAIL ═══
window.showEncroachDetail = function (id) {
  const seg = encroachData.segments.find((s) => s.id === id);
  if (!seg) return;
  const modal = document.getElementById("encroachModal");
  const content = document.getElementById("encroachContent");
  modal.classList.remove("hidden");

  content.innerHTML = `
    <div style="text-align:center;margin-bottom:24px">
      <h3 style="font-family:Space Grotesk;font-size:1.5rem;font-weight:800;margin-bottom:4px">
        ${seg.river} — <span style="color:${COLORS.yellow}">${seg.location}</span>
      </h3>
      <p style="font-size:.85rem;color:${COLORS.muted}">10-Year Encroachment Analysis (Sentinel-2 satellite imagery) • নদী দখল</p>
    </div>
    <div style="display:grid;grid-template-columns:1fr auto 1fr;gap:20px;align-items:center;margin-bottom:24px">
      <div style="background:rgba(6,214,160,0.05);border:1px solid rgba(6,214,160,0.2);border-radius:12px;padding:20px;text-align:center">
        <div style="font-size:.7rem;color:${COLORS.teal};font-weight:700;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px">📡 2016 Baseline</div>
        <div style="font-family:Space Grotesk;font-size:2.4rem;font-weight:800;color:${COLORS.teal}">${seg.width_2016}m</div>
        <div style="font-size:.75rem;color:${COLORS.muted}">River Width</div>
        <div style="margin-top:12px;height:8px;background:${COLORS.teal};border-radius:4px;width:100%"></div>
      </div>
      <div style="text-align:center">
        <div style="font-family:Space Grotesk;font-size:2rem;font-weight:800;color:${COLORS.red}">-${seg.shrinkage_pct.toFixed(1)}%</div>
        <div style="font-size:2rem;color:${COLORS.red}">→</div>
        <div style="font-size:.72rem;color:${COLORS.muted}">Width Lost</div>
      </div>
      <div style="background:rgba(239,71,111,0.05);border:1px solid rgba(239,71,111,0.2);border-radius:12px;padding:20px;text-align:center">
        <div style="font-size:.7rem;color:${COLORS.red};font-weight:700;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px">📡 2026 Current</div>
        <div style="font-family:Space Grotesk;font-size:2.4rem;font-weight:800;color:${COLORS.red}">${seg.width_2026}m</div>
        <div style="font-size:.75rem;color:${COLORS.muted}">River Width</div>
        <div style="margin-top:12px;height:8px;background:${COLORS.red};border-radius:4px;width:${(seg.width_2026 / seg.width_2016) * 100}%"></div>
      </div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:20px">
      <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:16px">
        <h4 style="font-size:.75rem;color:${COLORS.yellow};text-transform:uppercase;letter-spacing:1px;margin-bottom:8px">Root Cause</h4>
        <p style="font-size:.85rem;color:${COLORS.text}">${seg.cause}</p>
      </div>
      <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:16px">
        <h4 style="font-size:.75rem;color:${COLORS.red};text-transform:uppercase;letter-spacing:1px;margin-bottom:8px">Impact</h4>
        <p style="font-size:.85rem;color:${COLORS.text}">~${(seg.affected_population / 1000).toFixed(0)},000 residents at increased flood risk</p>
      </div>
    </div>
    <div style="background:linear-gradient(135deg,rgba(6,214,160,0.05),rgba(123,47,247,0.05));border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:16px;text-align:center">
      <p style="font-size:.8rem;color:${COLORS.muted}">🛰️ Data Source: Sentinel-2 MSI (10m resolution) via Google Earth Engine</p>
      <p style="font-size:.72rem;color:${COLORS.muted};margin-top:4px">Boundary comparison method: CNN water pixel segmentation with temporal filtering</p>
    </div>
  `;
  map.flyTo([seg.lat, seg.lng], 15, { duration: 1.5 });
};

// ═══ EVIDENCE REPORT ═══
function generateReport() {
  const modal = document.getElementById("reportModal");
  const content = document.getElementById("reportContent");
  modal.classList.remove("hidden");

  const now = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const criticalHotspots = pollutionData.hotspots.filter((h) => h.severity >= 80);
  const flaggedFactories = factoryData.factories.filter((f) => f.status === "flagged");
  const criticalEncroach = encroachData.segments.filter((s) => s.severity === "critical");

  content.innerHTML = `
    <div class="report-header">
      <h3>🛰️ NodiWatch Evidence Report</h3>
      <p>Generated: ${now} • Dhaka River System Surveillance</p>
      <p style="margin-top:4px">Classification: <strong style="color:${COLORS.red}">HIGH PRIORITY</strong></p>
    </div>
    <div class="report-section">
      <h4>Executive Summary</h4>
      <p style="font-size:.82rem;color:${COLORS.text};line-height:1.6">
        NodiWatch satellite surveillance identifies <strong style="color:${COLORS.red}">${criticalHotspots.length} critical pollution hotspots</strong>
        and <strong style="color:${COLORS.yellow}">${criticalEncroach.length} critical encroachment zones (নদী দখল)</strong> across the monitored Dhaka river system.
        <strong style="color:${COLORS.red}">${flaggedFactories.length} factories</strong> have been flagged for immediate inspection based on
        AI-powered probabilistic attribution analysis.
      </p>
    </div>
    <div class="report-section">
      <h4>Pollution Hotspots — Critical (Severity ≥ 80)</h4>
      <table class="report-table">
        <thead><tr><th>ID</th><th>River</th><th>Type</th><th>Severity</th><th>Detected</th></tr></thead>
        <tbody>${criticalHotspots.map((h) => `
          <tr><td>${h.id}</td><td>${h.river}</td><td><span style="color:${TYPE_COLORS[h.type]}">${h.type.toUpperCase()}</span></td><td><strong style="color:${COLORS.red}">${h.severity}/100</strong></td><td>${h.detected}</td></tr>
        `).join("")}</tbody>
      </table>
    </div>
    <div class="report-section">
      <h4>Flagged Factories — Recommended for Inspection</h4>
      <table class="report-table">
        <thead><tr><th>ID</th><th>Name</th><th>Type</th><th>Attribution</th><th>Violations</th></tr></thead>
        <tbody>${flaggedFactories.map((f) => `
          <tr><td>${f.id}</td><td>${f.name}</td><td>${f.type}</td><td><strong style="color:${f.attribution >= 70 ? COLORS.red : COLORS.yellow}">${f.attribution}%</strong></td><td>${f.violations}</td></tr>
        `).join("")}</tbody>
      </table>
    </div>
    <div class="report-section">
      <h4>Encroachment Analysis — Critical Zones (নদী দখল)</h4>
      <table class="report-table">
        <thead><tr><th>River</th><th>Location</th><th>2016</th><th>2026</th><th>Loss %</th><th>Affected</th></tr></thead>
        <tbody>${criticalEncroach.map((s) => `
          <tr><td>${s.river}</td><td>${s.location}</td><td>${s.width_2016}m</td><td style="color:${COLORS.red}">${s.width_2026}m</td><td><strong style="color:${COLORS.red}">-${s.shrinkage_pct.toFixed(1)}%</strong></td><td>~${(s.affected_population / 1000).toFixed(0)}K</td></tr>
        `).join("")}</tbody>
      </table>
    </div>
    <div class="report-section">
      <h4>Methodology</h4>
      <p style="font-size:.78rem;color:${COLORS.muted};line-height:1.6">
        This report was generated using NodiWatch's AI-powered satellite surveillance system.
        Data sources include Sentinel-2 MSI (10m resolution) and Landsat 8 OLI imagery processed through
        Google Earth Engine. Pollution classification uses a Random Forest Classifier trained on labeled
        spectral signatures. Encroachment detection uses CNN-based water pixel segmentation comparing
        2016 baseline boundaries with current imagery. Factory attribution uses a Bayesian probability
        model incorporating distance, pollution pattern matching, and industry type.
      </p>
    </div>
    <div style="text-align:center;padding:16px;background:rgba(6,214,160,0.05);border-radius:10px;margin-top:16px">
      <p style="font-size:.75rem;color:${COLORS.muted}">
        🛰️ NodiWatch — AI-Powered Satellite Surveillance for River Ecosystems<br>
        © 2026 Team AlphaVerse • Eco-Tech Hackathon 2026
      </p>
    </div>
  `;
}

// ═══ EVENTS ═══
function setupEvents() {
  document.querySelectorAll(".lt").forEach((btn) => {
    btn.addEventListener("click", () => showLayer(btn.dataset.layer));
  });
  document.getElementById("btnGenerateReport").addEventListener("click", generateReport);
  document.getElementById("btnCloseDetail").addEventListener("click", () => {
    document.getElementById("panel-detail").classList.add("hidden");
  });
  document.getElementById("btnCloseReport").addEventListener("click", () => {
    document.getElementById("reportModal").classList.add("hidden");
  });
  document.getElementById("btnCloseReport2").addEventListener("click", () => {
    document.getElementById("reportModal").classList.add("hidden");
  });
  document.getElementById("btnCloseEncroach").addEventListener("click", () => {
    document.getElementById("encroachModal").classList.add("hidden");
  });
  document.getElementById("btnPrintReport").addEventListener("click", () => {
    window.print();
  });
  document.getElementById("reportModal").addEventListener("click", (e) => {
    if (e.target === e.currentTarget) e.currentTarget.classList.add("hidden");
  });
  document.getElementById("encroachModal").addEventListener("click", (e) => {
    if (e.target === e.currentTarget) e.currentTarget.classList.add("hidden");
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      document.getElementById("reportModal").classList.add("hidden");
      document.getElementById("encroachModal").classList.add("hidden");
    }
  });
}
