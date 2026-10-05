const SHAPES = ["circle", "square", "triangle"];
const GROUP_DISTANCE_MILES = 10;
const GROUP_CAP = 21;
const BAND_TO_PERCENT = {
  low: 5,
  moderate: 15,
  high: 25,
};

let map;
let selectedGroupLayer;
let appInitialized = false;

let activities = [];
let autoGroups = [];
let selectedIds = new Set();
let markerById = new Map();
let shapeByType = new Map();

const passwordGate = document.getElementById("password-gate");
const passwordInput = document.getElementById("password-input");
const passwordButton = document.getElementById("password-button");
const passwordError = document.getElementById("password-error");
const appShell = document.getElementById("app-shell");
const tableBody = document.getElementById("group-table-body");
const floatingRowTooltip = document.getElementById("floating-row-tooltip");
const activityCountTotal = document.getElementById("activity-count-total");
const directTotalCell = document.getElementById("direct-total-cell");
const indirectTotalCell = document.getElementById("indirect-total-cell");
const completeCheckbox = document.getElementById("complete-group-checkbox");
const proceedButton = document.getElementById("proceed-button");
const tableCard = document.querySelector(".table-card");
const tableWraps = Array.from(document.querySelectorAll(".table-wrap"));
const group1Card = document.getElementById("group-1-card");
const estimateCard = document.getElementById("estimate-card");
const topBeneficiarySection = document.getElementById("top-beneficiary-section");
const beneficiaryTotal = document.getElementById("beneficiary-total");
const estimateTableToggle = document.getElementById("estimate-table-toggle");
const estimateQuestion = document.getElementById("estimate-question");
const estimatedSummaryRow = document.getElementById("estimated-summary-row");
const estimatedDuplicatesCount = document.getElementById("estimated-duplicates-count");
const duplicateAdjustRow = document.getElementById("duplicate-adjust-row");
const adjustDuplicateButton = document.getElementById("adjust-duplicate-button");
const duplicateOverrideRow = document.getElementById("duplicate-override-row");
const duplicateOverridePercent = document.getElementById("duplicate-override-percent");
const duplicateSliderReadout = document.getElementById("duplicate-slider-readout");
const densityAdjustmentValue = document.getElementById("density-adjustment-value");
const finalBeneficiariesTotal = document.getElementById("final-beneficiaries-total");
const densitySection = document.getElementById("density-section");
const finalTotalSection = document.getElementById("final-total-section");
const estimatePanelBody = document.getElementById("estimate-panel-body");
const estimateTableView = document.getElementById("estimate-table-view");
const floatingEstimateTooltip = document.getElementById("floating-estimate-tooltip");
const estimateTableBody = document.getElementById("estimate-group-table-body");
const estimateActivityCountTotal = document.getElementById("estimate-activity-count-total");
const estimateDirectTotalCell = document.getElementById("estimate-direct-total-cell");
const estimateIndirectTotalCell = document.getElementById("estimate-indirect-total-cell");
const adjustDensityButton = document.getElementById("adjust-density-button");
const overrideRow = document.getElementById("override-row");
const densityOverridePercent = document.getElementById("density-override-percent");
const densitySliderReadout = document.getElementById("density-slider-readout");
const overlapOptions = Array.from(document.querySelectorAll('input[name="overlap-band"]'));
let duplicateAdjustOpen = false;
let densityAdjustOpen = false;
let showingEstimateTable = false;
let densityRevealReady = false;
let densityRevealTimer = null;

proceedButton.addEventListener("click", () => {
  completeCheckbox.checked = true;
  syncEstimateMode();
});
estimateTableToggle.addEventListener("click", () => {
  showingEstimateTable = true;
  syncEstimateMode();
});
estimateTableView.addEventListener("click", () => {
  showingEstimateTable = false;
  syncEstimateMode();
});
estimateTableView.addEventListener("mouseenter", () => {
  floatingEstimateTooltip.classList.remove("hidden");
});
estimateTableView.addEventListener("mouseleave", () => {
  floatingEstimateTooltip.classList.add("hidden");
});
estimateTableView.addEventListener("mousemove", (event) => {
  floatingEstimateTooltip.style.left = `${event.clientX}px`;
  floatingEstimateTooltip.style.top = `${event.clientY}px`;
});
adjustDensityButton.addEventListener("click", () => {
  densityAdjustOpen = !densityAdjustOpen;
  syncEstimatePanel();
});
adjustDuplicateButton.addEventListener("click", () => {
  duplicateAdjustOpen = !duplicateAdjustOpen;
  if (duplicateAdjustOpen) {
    duplicateOverridePercent.value = String(getSelectedOverlapPercent());
  }
  syncEstimatePanel();
});
duplicateOverridePercent.addEventListener("input", syncEstimatePanel);
densityOverridePercent.addEventListener("input", syncEstimatePanel);
overlapOptions.forEach((option) =>
  option.addEventListener("change", () => {
    queueDensityReveal();
    if (!duplicateAdjustOpen) {
      duplicateOverridePercent.value = String(getSelectedOverlapPercent());
    }
    syncEstimatePanel();
  }),
);

enablePageScrollThroughTables();
loadGoogleMaps().then(initializeWithoutPassword).catch((error) => console.error(error));

async function loadGoogleMaps() {
  if (window.google?.maps) return;
  const response = await fetch("../activity-entry/index.html", { cache: "no-store" });
  const source = await response.text();
  const key = source.match(/maps\.googleapis\.com\/maps\/api\/js\?key=([^&"'`]+)/)?.[1];
  if (!key) throw new Error("Google Maps configuration is missing.");
  await new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&loading=async`;
    script.async = true;
    script.onload = resolve;
    script.onerror = () => reject(new Error("Google Maps did not load."));
    document.head.appendChild(script);
  });
}

function enablePageScrollThroughTables() {
  tableWraps.forEach((tableWrap) => {
    tableWrap.addEventListener(
      "wheel",
      (event) => {
        window.scrollBy({
          top: event.deltaY,
          left: event.deltaX,
          behavior: "auto",
        });
        event.preventDefault();
      },
      { passive: false },
    );
  });
}

function initializeWithoutPassword() {
  try {
    initializeApp();
    if (map) fitMap();
  } catch (error) {
    console.error(error);
  }
}

function initializeApp() {
  if (appInitialized) {
    return;
  }

  if (!window.google?.maps) {
    throw new Error("Google Maps did not load.");
  }

  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 13.35, lng: -88.45 }, zoom: 8, mapTypeControl: false,
    streetViewControl: false, fullscreenControl: false, clickableIcons: false,
    styles: [
      { elementType: "geometry", stylers: [{ color: "#f4f5f7" }] },
      { elementType: "labels.text.fill", stylers: [{ color: "#657080" }] },
      { elementType: "labels.text.stroke", stylers: [{ color: "#ffffff" }] },
      { featureType: "road", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
      { featureType: "water", elementType: "geometry", stylers: [{ color: "#dcecf2" }] },
      { featureType: "poi", stylers: [{ visibility: "off" }] },
    ],
  });
  selectedGroupLayer = [];

  const payload = window.ACTIVITY_DATA;
  if (!payload || !Array.isArray(payload.activities)) {
    throw new Error("The demo data could not be loaded.");
  }

  activities = payload.activities.map((activity) => ({
    ...activity,
    latitude: Number(activity.latitude),
    longitude: Number(activity.longitude),
    direct: Number(activity.direct || 0),
    indirect: Number(activity.indirect || 0),
  }));

  activities = normalizeDemoPlacement(activities, payload.demoRegion);

  const types = [...new Set(activities.map((activity) => activity.activityType))].sort();
  types.forEach((type, index) => shapeByType.set(type, SHAPES[index % SHAPES.length]));

  autoGroups = buildGroups(activities);
  selectedIds = expandInitialSelection(new Set((autoGroups[0] || []).map((activity) => activity.activityId)), 3);

  renderMarkers();
  fitMap();
  completeCheckbox.checked = false;
  syncSelectedGroup();
  syncEstimateMode();
  appInitialized = true;
}

function syncEstimateMode() {
  const isEstimating = completeCheckbox.checked;
  tableCard.classList.toggle("hidden", isEstimating);
  group1Card.classList.toggle("hidden", isEstimating);
  estimateCard.classList.toggle("hidden", !isEstimating);
  appShell.classList.toggle("estimate-mode", isEstimating);
  topBeneficiarySection.classList.toggle("hidden", showingEstimateTable && isEstimating);
  estimatePanelBody.classList.toggle("hidden", showingEstimateTable || !isEstimating);
  estimateTableView.classList.toggle("hidden", !showingEstimateTable || !isEstimating);
  floatingEstimateTooltip.classList.add("hidden");
  if (!isEstimating) {
    duplicateAdjustOpen = false;
    densityAdjustOpen = false;
    densityRevealReady = false;
    clearDensityRevealTimer();
  }

  if (map) google.maps.event.trigger(map, "resize");

  syncEstimatePanel();
}

function renderMarkers() {
  markerById.forEach((marker) => marker.setMap(null));
  markerById = new Map();

  activities.forEach((activity) => {
    const shape = shapeByType.get(activity.activityType);
    const markerColor = selectedIds.has(activity.activityId) ? "#2f6db3" : "#de7b27";
    const marker = new google.maps.Marker({
      map,
      position: { lat: activity.latitude, lng: activity.longitude },
      icon: markerIcon(shape, markerColor),
      title: simplifyActivityName(activity.activityName),
    });
    const infoWindow = new google.maps.InfoWindow({ content: buildTooltipContent(activity, markerColor) });
    marker.addListener("mouseover", () => infoWindow.open({ map, anchor: marker }));
    marker.addListener("mouseout", () => infoWindow.close());
    marker.addListener("click", () => toggleSelectedMembership(activity.activityId));
    marker.infoWindow = infoWindow;
    marker.activityShape = shape;
    markerById.set(activity.activityId, marker);
  });
}

function markerIcon(shape, color) {
  const paths = {
    circle: google.maps.SymbolPath.CIRCLE,
    square: "M -6,-6 6,-6 6,6 -6,6 z",
    triangle: "M 0,-7 7,6 -7,6 z",
  };
  return {
    path: paths[shape] || paths.circle,
    fillColor: color,
    fillOpacity: 1,
    strokeColor: color,
    strokeWeight: 1,
    scale: shape === "circle" ? 6 : 1,
  };
}

function syncSelectedGroup() {
  const selectedGroup = activities.filter((activity) => selectedIds.has(activity.activityId));
  const sortedGroup = [...selectedGroup].sort((a, b) => a.activityName.localeCompare(b.activityName));

  renderSelectedOutline(sortedGroup);
  renderTable(sortedGroup);
  syncMarkerStates();
  syncEstimatePanel();
}

function renderSelectedOutline(group) {
  selectedGroupLayer.forEach((shape) => shape.setMap(null));
  selectedGroupLayer = [];
  if (!group.length) {
    return;
  }

  drawGroupOutline(group, {
    color: "#c0392b",
    fillColor: "rgba(192, 57, 43, 0.08)",
    radiusPaddingMiles: 0.55,
    fillOpacity: 0.08,
    weight: 2,
    dashArray: "3 6",
  });
}

function renderTable(group) {
  tableBody.innerHTML = "";
  estimateTableBody.innerHTML = "";

  let directTotal = 0;
  let indirectTotal = 0;

  group.forEach((activity) => {
    directTotal += activity.direct;
    indirectTotal += activity.indirect;
    tableBody.appendChild(buildActivityRow(activity, { interactive: true }));
    estimateTableBody.appendChild(buildActivityRow(activity, { interactive: false }));
  });

  activityCountTotal.textContent = formatNumber(group.length);
  directTotalCell.textContent = formatNumber(directTotal);
  indirectTotalCell.textContent = formatNumber(indirectTotal);
  estimateActivityCountTotal.textContent = formatNumber(group.length);
  estimateDirectTotalCell.textContent = formatNumber(directTotal);
  estimateIndirectTotalCell.textContent = formatNumber(indirectTotal);
  syncTableHeight(group.length);
}

function buildActivityRow(activity, { interactive }) {
  const displayName = simplifyActivityName(activity.activityName);
  const row = document.createElement("tr");
  row.className = interactive ? "table-action-row" : "table-review-row";
  row.innerHTML = `
    <td><span class="cell-ellipsis">${escapeHtml(truncateForTable(displayName, 56))}</span></td>
    <td>${formatNumber(activity.direct)}</td>
    <td>${formatNumber(activity.indirect)}</td>
  `;
  if (interactive) {
    row.dataset.tooltip = `Click to remove ${displayName} from Group 1`;
    row.addEventListener("click", () => toggleSelectedMembership(activity.activityId));
    row.addEventListener("mouseenter", () => {
      floatingRowTooltip.textContent = row.dataset.tooltip;
      floatingRowTooltip.classList.remove("hidden");
    });
    row.addEventListener("mouseleave", () => {
      floatingRowTooltip.classList.add("hidden");
    });
    row.addEventListener("mousemove", (event) => {
      floatingRowTooltip.style.left = `${event.clientX}px`;
      floatingRowTooltip.style.top = `${event.clientY}px`;
    });
  }
  return row;
}

function syncMarkerStates() {
  activities.forEach((activity) => {
    const marker = markerById.get(activity.activityId);
    if (!marker) {
      return;
    }

    const selected = selectedIds.has(activity.activityId);
    const color = selected ? "#2f6db3" : "#de7b27";
    marker.setIcon(markerIcon(marker.activityShape, color));
    marker.setOpacity(selected ? 1 : 0.92);
    marker.infoWindow.setContent(buildTooltipContent(activity, color));
  });
}

function toggleSelectedMembership(activityId) {
  if (selectedIds.has(activityId)) {
    selectedIds.delete(activityId);
  } else {
    selectedIds.add(activityId);
  }
  syncSelectedGroup();
}

function syncEstimatePanel() {
  const directTotal = parseNumberFromCell(directTotalCell.textContent);
  const indirectTotal = parseNumberFromCell(indirectTotalCell.textContent);
  const combinedTotal = directTotal + indirectTotal;
  const selectedOverlap = getSelectedOverlapPercent();
  const overlapPercent = getDuplicateEstimatePercent();
  const estimatedDuplicates = Math.round(combinedTotal * (overlapPercent / 100));
  const densityPercent = getDensityAdjustmentPercent();
  const densityAdjustment = Math.round(estimatedDuplicates * (densityPercent / 100));
  const adjustedDuplicateEstimate = Math.max(0, estimatedDuplicates - densityAdjustment);
  const finalTotal = Math.max(0, combinedTotal - estimatedDuplicates + densityAdjustment);

  beneficiaryTotal.textContent = formatNumber(combinedTotal);
  estimateQuestion.textContent = `Of these ${formatNumber(combinedTotal)} Beneficiaries, what percent are Participants that attended multiple Activities?`;
  estimatedDuplicatesCount.textContent = `- ${formatNumber(estimatedDuplicates)}`;
  densityAdjustmentValue.textContent = `- ${formatNumber(adjustedDuplicateEstimate)}`;
  finalBeneficiariesTotal.textContent = formatNumber(finalTotal);

  duplicateSliderReadout.textContent = `${overlapPercent}%`;
  densitySliderReadout.textContent = `${densityPercent}%`;
  duplicateAdjustRow.classList.toggle("hidden", !selectedOverlap);
  duplicateOverrideRow.classList.toggle("hidden", !duplicateAdjustOpen || !selectedOverlap);
  adjustDuplicateButton.textContent = duplicateAdjustOpen ? "Hide Duplicate %" : "Adjust Duplicate %";
  overrideRow.classList.toggle("hidden", !densityAdjustOpen);
  adjustDensityButton.textContent = densityAdjustOpen ? "Hide Density %" : "Adjust Density %";
  estimatedSummaryRow.classList.toggle("hidden", !selectedOverlap);
  densitySection.classList.toggle("hidden", !selectedOverlap || !densityRevealReady);
  finalTotalSection.classList.toggle("hidden", !selectedOverlap);
  estimatedDuplicatesCount.classList.toggle("struck-through", !!selectedOverlap && densityRevealReady);
}

function getSelectedOverlapPercent() {
  const selected = overlapOptions.find((option) => option.checked);
  return BAND_TO_PERCENT[selected?.value] || 0;
}

function queueDensityReveal() {
  densityRevealReady = false;
  clearDensityRevealTimer();

  if (!getSelectedOverlapPercent()) {
    return;
  }

  densityRevealTimer = setTimeout(() => {
    densityRevealReady = true;
    syncEstimatePanel();
  }, 2000);
}

function clearDensityRevealTimer() {
  if (densityRevealTimer) {
    clearTimeout(densityRevealTimer);
    densityRevealTimer = null;
  }
}

function getDuplicateEstimatePercent() {
  const selectedPercent = getSelectedOverlapPercent();
  if (!selectedPercent) {
    return 0;
  }
  if (duplicateAdjustOpen) {
    const value = Number(duplicateOverridePercent.value || selectedPercent);
    return Math.max(0, Math.min(100, value));
  }
  return selectedPercent;
}

function getDensityAdjustmentPercent() {
  const value = Number(densityOverridePercent.value || 18);
  return Math.max(15, Math.min(20, value));
}

function buildGroups(points) {
  const components = connectedComponents(points, GROUP_DISTANCE_MILES);
  const groups = [];

  components.forEach((component) => {
    if (component.length <= GROUP_CAP) {
      groups.push(component);
      return;
    }

    splitComponent(component).forEach((group) => groups.push(group));
  });

  return groups.sort((a, b) => b.length - a.length);
}

function connectedComponents(points, thresholdMiles) {
  const visited = new Set();
  const groups = [];

  for (let i = 0; i < points.length; i += 1) {
    if (visited.has(i)) {
      continue;
    }

    const stack = [i];
    visited.add(i);
    const component = [];

    while (stack.length) {
      const currentIndex = stack.pop();
      const current = points[currentIndex];
      component.push(current);

      for (let j = 0; j < points.length; j += 1) {
        if (visited.has(j)) {
          continue;
        }
        if (haversineMiles(current, points[j]) <= thresholdMiles) {
          visited.add(j);
          stack.push(j);
        }
      }
    }

    groups.push(component);
  }

  return groups.sort((a, b) => b.length - a.length);
}

function splitComponent(component) {
  const remaining = [...component];
  const groups = [];

  while (remaining.length) {
    const rankedSeeds = remaining
      .map((seed) => ({
        seed,
        candidates: remaining
          .filter((candidate) => haversineMiles(seed, candidate) <= GROUP_DISTANCE_MILES)
          .sort((a, b) => haversineMiles(seed, a) - haversineMiles(seed, b)),
      }))
      .sort((a, b) => b.candidates.length - a.candidates.length);

    const group = rankedSeeds[0].candidates.slice(0, GROUP_CAP);
    groups.push(group);

    const ids = new Set(group.map((activity) => activity.activityId));
    for (let index = remaining.length - 1; index >= 0; index -= 1) {
      if (ids.has(remaining[index].activityId)) {
        remaining.splice(index, 1);
      }
    }
  }

  return groups.sort((a, b) => b.length - a.length);
}

function drawGroupOutline(group, style) {
  if (group.length <= 2) {
    const center = centroidForGroup(group);
    const paddingMiles = style.radiusPaddingMiles || 0.55;
    const radiusMiles = Math.max(
      1,
      ...group.map((activity) => haversineMiles(activity, center) + paddingMiles)
    );

    const circle = new google.maps.Circle({
      map,
      center: { lat: center.latitude, lng: center.longitude },
      radius: radiusMiles * 1609.34,
      strokeColor: style.color,
      strokeOpacity: 1,
      strokeWeight: style.weight,
      fillColor: style.color,
      fillOpacity: style.fillOpacity,
    });
    selectedGroupLayer.push(circle);
    return circle;
  }

  const blob = createRoundedBlob(group, style.radiusPaddingMiles || 0.55);
  const polygon = new google.maps.Polygon({
    map,
    paths: blob.map(([latitude, longitude]) => ({ lat: latitude, lng: longitude })),
    strokeColor: style.color,
    strokeOpacity: 1,
    strokeWeight: style.weight,
    fillColor: style.color,
    fillOpacity: style.fillOpacity,
  });
  selectedGroupLayer.push(polygon);
  return polygon;
}

function centroidForGroup(group) {
  const totals = group.reduce(
    (accumulator, activity) => {
      accumulator.latitude += activity.latitude;
      accumulator.longitude += activity.longitude;
      return accumulator;
    },
    { latitude: 0, longitude: 0 }
  );

  return {
    latitude: totals.latitude / group.length,
    longitude: totals.longitude / group.length,
  };
}

function fitMap() {
  const selectedGroup = activities.filter((activity) => selectedIds.has(activity.activityId));
  if (!selectedGroup.length) {
    const bounds = new google.maps.LatLngBounds();
    activities.forEach((activity) => bounds.extend({ lat: activity.latitude, lng: activity.longitude }));
    map.fitBounds(bounds, 32);
    return;
  }

  const latitudes = selectedGroup.map((activity) => activity.latitude);
  const longitudes = selectedGroup.map((activity) => activity.longitude);
  const groupBounds = new google.maps.LatLngBounds(
    { lat: Math.min(...latitudes) - 0.05, lng: Math.min(...longitudes) - 0.075 },
    { lat: Math.max(...latitudes) + 0.08, lng: Math.max(...longitudes) + 0.08 }
  );
  map.fitBounds(groupBounds, 24);
  google.maps.event.addListenerOnce(map, "idle", () => {
    if (map.getZoom() > 14) map.setZoom(14);
    map.panBy(18, 5);
  });
}

function normalizeDemoPlacement(points, regionName) {
  if (!String(regionName).includes("El Salvador") || !points.length) {
    return points;
  }

  const currentCenter = centroidForGroup(points);
  const targetCenter = { latitude: 13.35, longitude: -88.45 };
  const latShift = targetCenter.latitude - currentCenter.latitude;
  const lonShift = targetCenter.longitude - currentCenter.longitude;

  return points.map((point) => ({
    ...point,
    latitude: point.latitude + latShift,
    longitude: point.longitude + lonShift,
  }));
}

function createRoundedBlob(group, paddingMiles) {
  const hull = convexHull(group.map((activity) => [activity.latitude, activity.longitude]));
  const center = centroidForGroup(group);
  const expanded = hull.map(([latitude, longitude]) => expandPoint(latitude, longitude, center, paddingMiles));
  return smoothClosedPath(expanded, 10);
}

function expandPoint(latitude, longitude, center, paddingMiles) {
  const latScale = 69;
  const lonScale = 69 * Math.cos(toRadians((latitude + center.latitude) / 2));
  const dx = (longitude - center.longitude) * lonScale;
  const dy = (latitude - center.latitude) * latScale;
  const length = Math.max(0.001, Math.sqrt(dx * dx + dy * dy));
  const expandedDx = dx + (dx / length) * paddingMiles;
  const expandedDy = dy + (dy / length) * paddingMiles;

  return [
    center.latitude + expandedDy / latScale,
    center.longitude + expandedDx / Math.max(1e-6, lonScale),
  ];
}

function smoothClosedPath(points, pointsPerSegment) {
  const smoothed = [];
  const total = points.length;

  for (let index = 0; index < total; index += 1) {
    const p0 = points[(index - 1 + total) % total];
    const p1 = points[index];
    const p2 = points[(index + 1) % total];
    const p3 = points[(index + 2) % total];

    for (let step = 0; step < pointsPerSegment; step += 1) {
      const t = step / pointsPerSegment;
      smoothed.push(catmullRomPoint(p0, p1, p2, p3, t));
    }
  }

  return smoothed;
}

function catmullRomPoint(p0, p1, p2, p3, t) {
  const t2 = t * t;
  const t3 = t2 * t;

  return [
    0.5 * ((2 * p1[0]) + (-p0[0] + p2[0]) * t + (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 + (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3),
    0.5 * ((2 * p1[1]) + (-p0[1] + p2[1]) * t + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3),
  ];
}

function convexHull(points) {
  const sorted = [...points].sort((a, b) => (a[1] - b[1]) || (a[0] - b[0]));
  const cross = (origin, a, b) => (a[1] - origin[1]) * (b[0] - origin[0]) - (a[0] - origin[0]) * (b[1] - origin[1]);

  const lower = [];
  sorted.forEach((point) => {
    while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], point) <= 0) {
      lower.pop();
    }
    lower.push(point);
  });

  const upper = [];
  sorted
    .slice()
    .reverse()
    .forEach((point) => {
      while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], point) <= 0) {
        upper.pop();
      }
      upper.push(point);
    });

  upper.pop();
  lower.pop();
  return lower.concat(upper);
}

function haversineMiles(a, b) {
  const earthRadiusMiles = 3958.8;
  const lat1 = toRadians(a.latitude);
  const lat2 = toRadians(b.latitude);
  const deltaLat = toRadians(b.latitude - a.latitude);
  const deltaLon = toRadians(b.longitude - a.longitude);
  const value =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
  return 2 * earthRadiusMiles * Math.atan2(Math.sqrt(value), Math.sqrt(1 - value));
}

function parseNumberFromCell(value) {
  return Number(String(value).replace(/,/g, "")) || 0;
}

function syncTableHeight(rowCount) {
  const baselineRows = 25;
  const extraRows = Math.max(0, rowCount - baselineRows);
  const extraHeightPx = extraRows * 22;
  appShell.style.setProperty("--extra-table-height", `${extraHeightPx}px`);
}

function buildTooltipContent(activity, color) {
  const displayName = simplifyActivityName(activity.activityName);
  const nearestSelectedDistance = getNearestSelectedDistance(activity);
  const actionCopy = selectedIds.has(activity.activityId)
    ? "Click to remove from Group 1"
    : "Click to add to Group 1";
  return `
    <div class="popup-content">
      <p class="popup-title" style="color:${color}">${escapeHtml(displayName)}</p>
      <p class="popup-meta">Direct: ${formatNumber(activity.direct)} • Indirect: ${formatNumber(activity.indirect)}</p>
      ${nearestSelectedDistance === null ? "" : `<p class="popup-meta">Nearest Activity in Group 1: ${nearestSelectedDistance.toFixed(1)} miles</p>`}
      <div class="popup-action">${actionCopy}</div>
    </div>
  `;
}

function expandInitialSelection(initialIds, additionalCount) {
  const expandedIds = new Set(initialIds);
  if (!expandedIds.size || additionalCount <= 0) {
    return expandedIds;
  }

  const selectedGroup = activities.filter((activity) => expandedIds.has(activity.activityId));
  const candidates = activities
    .filter((activity) => !expandedIds.has(activity.activityId))
    .map((activity) => ({
      activity,
      distance: Math.min(...selectedGroup.map((selected) => haversineMiles(activity, selected))),
    }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, additionalCount);

  candidates.forEach(({ activity }) => {
    expandedIds.add(activity.activityId);
  });

  return expandedIds;
}

function getNearestSelectedDistance(activity) {
  if (!selectedIds.has(activity.activityId)) {
    return null;
  }

  let nearest = Infinity;
  for (const candidate of activities) {
    if (candidate.activityId === activity.activityId || !selectedIds.has(candidate.activityId)) {
      continue;
    }
    nearest = Math.min(nearest, haversineMiles(activity, candidate));
  }

  return Number.isFinite(nearest) ? nearest : null;
}

function simplifyActivityName(value) {
  return String(value || "")
    .replace(/^\d{4}\s*-\s*/, "")
    .trim();
}

function truncateForTable(value, maxLength) {
  if (value.length <= maxLength) {
    return value;
  }
  return `${value.slice(0, Math.max(0, maxLength - 6)).trim()} . . .`;
}

function toRadians(degrees) {
  return (degrees * Math.PI) / 180;
}

function formatNumber(value) {
  return new Intl.NumberFormat("en-US").format(value);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
