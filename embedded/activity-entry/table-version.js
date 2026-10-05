const ACTIVITY_TYPE_FIELDS = {
  "Capacity Building - HSS": {
    direct: [
      { key: "externalHealthWorkersTrained", label: "# External Health Workers Trained", columnGroup: "col1" },
      { key: "externalNonHealthWorkersTrained", label: "# External Non-Health Workers Trained", columnGroup: "col1" },
      { key: "internalHealthWorkersTrained", label: "# Internal Health Workers Trained", columnGroup: "col1" },
      { key: "internalNonHealthWorkersTrained", label: "# Internal Non-Health Workers Trained", columnGroup: "col1" },
    ],
    indirect: [{ key: "indirectTrainees", label: "For ToT programs, # indirect trainees" }],
    other: [
      { key: "sessions", label: "# Sessions" },
      { key: "totalHoursOfSessions", label: "Total hrs of Sessions" },
    ],
  },
  "Capacity Building - IPC/WASH": {
    direct: [
      { key: "externalHealthWorkersTrained", label: "# External Health Workers Trained", columnGroup: "col1" },
      { key: "externalNonHealthWorkersTrained", label: "# External Non-Health Workers Trained", columnGroup: "col1" },
      { key: "internalHealthWorkersTrained", label: "# Internal Health Workers Trained", columnGroup: "col1" },
      { key: "internalNonHealthWorkersTrained", label: "# Internal Non-Health Workers Trained", columnGroup: "col1" },
    ],
    indirect: [{ key: "indirectTrainees", label: "For ToT programs, # indirect trainees" }],
    other: [
      { key: "sessions", label: "# Sessions" },
      { key: "totalHoursOfSessions", label: "Total hrs of Sessions" },
    ],
  },
  "Capacity Building - Mental Health": {
    direct: [
      { key: "externalHealthWorkersTrained", label: "# External Health Workers Trained", columnGroup: "col1" },
      { key: "externalNonHealthWorkersTrained", label: "# External Non-Health Workers Trained", columnGroup: "col1" },
      { key: "internalHealthWorkersTrained", label: "# Internal Health Workers Trained", columnGroup: "col1" },
      { key: "internalNonHealthWorkersTrained", label: "# Internal Non-Health Workers Trained", columnGroup: "col1" },
    ],
    indirect: [{ key: "indirectTrainees", label: "For ToT programs, # indirect trainees" }],
    other: [
      { key: "sessions", label: "# Sessions" },
      { key: "totalHoursOfSessions", label: "Total hrs of Sessions" },
    ],
  },
  "Capacity Building - MNCH": {
    direct: [
      { key: "externalHealthWorkersTrained", label: "# External Health Workers Trained", columnGroup: "col1" },
      { key: "externalNonHealthWorkersTrained", label: "# External Non-Health Workers Trained", columnGroup: "col1" },
      { key: "internalHealthWorkersTrained", label: "# Internal Health Workers Trained", columnGroup: "col1" },
      { key: "internalNonHealthWorkersTrained", label: "# Internal Non-Health Workers Trained", columnGroup: "col1" },
    ],
    indirect: [{ key: "indirectTrainees", label: "For ToT programs, # indirect trainees" }],
    other: [
      { key: "sessions", label: "# Sessions" },
      { key: "totalHoursOfSessions", label: "Total hrs of Sessions" },
    ],
  },
  "Clinical Services - Americares Clinics: Primary Health Consultations": {
    direct: [],
    indirect: [],
    other: [
      { key: "male", label: "# Male", columnGroup: "col2" },
      { key: "female", label: "# Female", columnGroup: "col2" },
      { key: "notSolelyMaleOrFemale", label: "# Not Identifying as solely Male or Female", columnGroup: "col2" },
      { key: "preferNotToSayGender", label: "# Prefer Not to Say", columnGroup: "col2" },
      { key: "age0to17", label: "# Age 0-17", columnGroup: "col3" },
      { key: "age18to64", label: "# Age 18-64", columnGroup: "col3" },
      { key: "age65plus", label: "# Age 65+", columnGroup: "col3" },
      { key: "yes", label: "# Yes", columnGroup: "col4" },
      { key: "no", label: "# No", columnGroup: "col4" },
    ],
  },
  "Clinical Services - Americares Clinics: Mental Health Consultations": {
    direct: [],
    indirect: [],
    other: [
      { key: "male", label: "# Male", columnGroup: "col2" },
      { key: "female", label: "# Female", columnGroup: "col2" },
      { key: "notSolelyMaleOrFemale", label: "# Not Identifying as solely Male or Female", columnGroup: "col2" },
      { key: "preferNotToSayGender", label: "# Prefer Not to Say", columnGroup: "col2" },
      { key: "age0to17", label: "# Age 0-17", columnGroup: "col3" },
      { key: "age18to64", label: "# Age 18-64", columnGroup: "col3" },
      { key: "age65plus", label: "# Age 65+", columnGroup: "col3" },
      { key: "yes", label: "# Yes", columnGroup: "col4" },
      { key: "no", label: "# No", columnGroup: "col4" },
      { key: "preferNotToSayFollowup", label: "# Prefer Not to Say", columnGroup: "col4" },
    ],
  },
};
const ACTIVITY_TYPES = Object.keys(ACTIVITY_TYPE_FIELDS);
const LOGIN_STORAGE_KEY = "activity-options-table-authenticated";
const DATA_STORAGE_KEY = "activity-options-table-rows";

const state = {
  isAuthenticated: !window.APP_CONFIG?.appPassword,
  loginError: "",
  rows: Array.from({ length: 8 }, (_, index) => buildRow(index + 1)),
  activeModal: null,
  mapDebug: "",
  mapMessage: "",
  numericError: "",
  submitMessage: "",
  isSubmitting: false,
};

if (window.APP_CONFIG?.appPassword && window.sessionStorage.getItem(LOGIN_STORAGE_KEY) === "true") {
  state.isAuthenticated = true;
}

try {
  const savedRows = JSON.parse(window.localStorage.getItem(DATA_STORAGE_KEY) || "null");
  if (Array.isArray(savedRows) && savedRows.length) {
    state.rows = savedRows;
    ensureTrailingBlankRow();
  }
} catch {}

const root = document.getElementById("root");
let currentMap = null;
let currentMarker = null;
let currentGeocoder = null;

function buildRow(index) {
  return {
    id: `row-${index}`,
    activityType: "",
    activityName: "",
    locationMode: "",
    location: {
      address: "",
      lat: "",
      lng: "",
      zoom: "",
    },
    direct: category(),
    indirect: category(),
    other: category(),
  };
}

function category() {
  return {
    quantities: {},
    uploads: [],
  };
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function getRow(rowId) {
  return state.rows.find((row) => row.id === rowId);
}

function getCategoryFields(activityType, groupKey) {
  return ACTIVITY_TYPE_FIELDS[activityType]?.[groupKey] || [];
}

function categoryIsRequired(activityType, groupKey) {
  return getCategoryFields(activityType, groupKey).length > 0;
}

function getCategoryQuantity(item, fieldKey) {
  return item.quantities?.[fieldKey] ?? "";
}

function getCategoryColumnGroups(fields) {
  return [...new Set(fields.map((field) => field.columnGroup).filter(Boolean))];
}

function getCategoryColumnTotal(item, columnGroup) {
  const fields = (item.fields || []).filter((field) => field.columnGroup === columnGroup);
  const values = fields.map((field) => getCategoryQuantity(item, field.key)).filter((value) => value !== "");
  if (!values.length) return "";
  if (values.some(hasNonNumeric)) return "";
  return values.reduce((sum, value) => sum + Number(value || 0), 0);
}

function getCategoryMaxTotal(item) {
  const fields = item.fields || [];
  const columnGroups = getCategoryColumnGroups(fields);
  if (!columnGroups.length) return "";
  const totals = columnGroups
    .map((columnGroup) => getCategoryColumnTotal(item, columnGroup))
    .filter((value) => value !== "");
  if (!totals.length) return "";
  return Math.max(...totals.map(Number));
}

function getMismatchedColumnGroups(item) {
  const fields = item.fields || [];
  const columnGroups = getCategoryColumnGroups(fields);
  if (columnGroups.length <= 1) return [];
  const targetTotal = getCategoryMaxTotal(item);
  if (targetTotal === "") return [];
  return columnGroups.filter((columnGroup) => {
    const total = getCategoryColumnTotal(item, columnGroup);
    return total !== "" && Number(total) !== Number(targetTotal);
  });
}

function getFieldDisplayLabel(label) {
  const compact = String(label).replace(/^#\s*/, "");
  if (compact === "Not Identifying as solely Male or Female") return "Not solely M/F";
  if (compact === "Prefer Not to Say") return "Prefer not to say";
  return compact;
}

function categoryTotal(item) {
  const fields = item.fields || [];
  if (!fields.length) return "";
  const columnGroups = getCategoryColumnGroups(fields);
  if (columnGroups.length) {
    return getCategoryMaxTotal(item);
  }
  const values = fields.map((field) => getCategoryQuantity(item, field.key)).filter((value) => value !== "");
  if (!values.length) return "";
  if (values.some(hasNonNumeric)) return "";
  return values.reduce((sum, value) => sum + Number(value || 0), 0);
}

function hasNonNumeric(value) {
  return value !== "" && !/^\d+$/.test(String(value));
}

function isCategoryValid(item) {
  const fields = item.fields || [];
  if (!fields.length) return true;
  if (fields.some((field) => hasNonNumeric(getCategoryQuantity(item, field.key)))) return false;
  const columnGroups = getCategoryColumnGroups(fields);
  if (columnGroups.length <= 1) return true;
  const totals = columnGroups.map((columnGroup) => getCategoryColumnTotal(item, columnGroup)).filter((value) => value !== "");
  if (totals.length <= 1) return true;
  const targetTotal = Math.max(...totals.map(Number));
  return totals.every((value) => Number(value) === Number(targetTotal));
}

function allRowsValid() {
  return state.rows.every((row) => {
    if (isRowBlank(row)) return true;
    return ["direct", "indirect", "other"].every((key) =>
      isCategoryValid({ ...row[key], fields: getCategoryFields(row.activityType, key) })
    );
  });
}

function rowLocationComplete(row, rowIndex) {
  if (rowIndex === 0) return Boolean(row.location.address);
  if (row.locationMode === "above") return true;
  if (row.locationMode === "new") return Boolean(row.location.address);
  return false;
}

function isRowComplete(row, rowIndex) {
  const directItem = { ...row.direct, fields: getCategoryFields(row.activityType, "direct") };
  const indirectItem = { ...row.indirect, fields: getCategoryFields(row.activityType, "indirect") };
  const otherItem = { ...row.other, fields: getCategoryFields(row.activityType, "other") };
  return Boolean(
    row.activityType &&
      row.activityName.trim() &&
      rowLocationComplete(row, rowIndex) &&
      (!categoryIsRequired(row.activityType, "direct") || categoryTotal(directItem) !== "") &&
      (!categoryIsRequired(row.activityType, "indirect") || categoryTotal(indirectItem) !== "") &&
      (!categoryIsRequired(row.activityType, "other") || categoryTotal(otherItem) !== "") &&
      isCategoryValid(directItem) &&
      isCategoryValid(indirectItem) &&
      isCategoryValid(otherItem) &&
      (!categoryIsRequired(row.activityType, "direct") || row.direct.uploads.length) &&
      (!categoryIsRequired(row.activityType, "indirect") || row.indirect.uploads.length) &&
      (!categoryIsRequired(row.activityType, "other") || row.other.uploads.length)
  );
}

function buildCategoryExportString(row, groupKey) {
  const fields = getCategoryFields(row.activityType, groupKey);
  return fields
    .filter((field) => getCategoryQuantity(row[groupKey], field.key) !== "")
    .map((field) => `${field.label}: ${getCategoryQuantity(row[groupKey], field.key)}`)
    .join(" | ");
}

function toColumnKey(label) {
  return String(label)
    .toLowerCase()
    .replace(/#/g, "number")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function buildSharedSheetRows() {
  return state.rows
    .filter((row) => !isRowBlank(row))
    .map((row) => {
      const output = {
        submitted_at: new Date().toISOString(),
        activity_type: row.activityType,
        activity_name: row.activityName,
        activity_location: row.location.address,
        latitude: row.location.lat,
        longitude: row.location.lng,
        direct_total: categoryTotal({ ...row.direct, fields: getCategoryFields(row.activityType, "direct") }),
        direct_uploads: row.direct.uploads.join(" | "),
        indirect_total: categoryTotal({ ...row.indirect, fields: getCategoryFields(row.activityType, "indirect") }),
        indirect_uploads: row.indirect.uploads.join(" | "),
        other_total: categoryTotal({ ...row.other, fields: getCategoryFields(row.activityType, "other") }),
        other_uploads: row.other.uploads.join(" | "),
      };

      ["direct", "indirect", "other"].forEach((groupKey) => {
        getCategoryFields(row.activityType, groupKey).forEach((field) => {
          output[`${groupKey}_${toColumnKey(field.label)}`] = getCategoryQuantity(row[groupKey], field.key);
        });
      });

      return output;
    });
}

function updateRow(rowId, updater) {
  state.rows = state.rows.map((row) => (row.id === rowId ? updater(clone(row)) : row));
  ensureTrailingBlankRow();
  window.localStorage.setItem(DATA_STORAGE_KEY, JSON.stringify(state.rows));
}

function isRowBlank(row) {
  return !row.activityType &&
    !row.activityName &&
    !row.location.address &&
    !row.location.lat &&
    !row.location.lng &&
    !Object.keys(row.direct.quantities).length &&
    !Object.keys(row.indirect.quantities).length &&
    !Object.keys(row.other.quantities).length &&
    !row.direct.uploads.length &&
    !row.indirect.uploads.length &&
    !row.other.uploads.length;
}

function ensureTrailingBlankRow() {
  const lastRow = state.rows[state.rows.length - 1];
  if (lastRow && !isRowBlank(lastRow)) {
    state.rows.push(buildRow(state.rows.length + 1));
  }
}

function render() {
  root.innerHTML = state.isAuthenticated ? renderApp() : renderLogin();
  syncAutoTextareas();
  if (state.activeModal?.type === "location") initializeLocationModal();
  if (state.activeModal?.type === "activities-map") initializeActivitiesMapModal();
}

function syncAutoTextareas() {
  root.querySelectorAll(".cell-textarea").forEach((element) => {
    element.style.height = "auto";
    element.style.height = `${element.scrollHeight}px`;
  });
}

function renderLogin() {
  return `
    <div class="page">
      <div class="login-wrap">
        <div class="login-card">
          <h2>Activity Data collection</h2>
          <div class="subtle">Enter the password to open this table version.</div>
          <div class="field" style="margin-top: 16px;">
            <label for="loginPassword">Password</label>
            <input id="loginPassword" type="password" />
          </div>
          ${state.loginError ? `<div class="error-text" style="margin-top:10px;">${escapeHtml(state.loginError)}</div>` : ""}
          <div class="toolbar" style="margin-top: 18px;">
            <div></div>
            <div class="toolbar-actions">
              <button class="btn" data-action="submit-login">Open app</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderApp() {
  return `
    <div class="page">
      <div class="card">
        <div class="toolbar">
          <div>
            <div class="hero-line">Bulk data entry of Activities</div>
            <div class="hero-subline">Click on each cell to enter data</div>
          </div>
          <div class="toolbar-actions">
            <button class="btn map-btn" data-action="open-activities-map">See my Activities on a map</button>
            <button class="btn" data-action="finalize-entries" ${state.isSubmitting ? "disabled" : ""}>${state.isSubmitting ? "Saving..." : "Finalize your Activity entries"}</button>
          </div>
        </div>
        ${state.submitMessage ? `<div class="subtle" style="margin-bottom: 12px;">${escapeHtml(state.submitMessage)}</div>` : ""}
        <div class="table-wrap">
          <table>
            <tbody>
              ${state.rows.map(renderRow).join("")}
            </tbody>
          </table>
        </div>
      </div>
      ${renderModal()}
    </div>
  `;
}

function getActiveRowId() {
  const firstIncompleteIndex = state.rows.findIndex((row, index) => !isRowComplete(row, index));
  return firstIncompleteIndex >= 0 ? state.rows[firstIncompleteIndex].id : state.rows[state.rows.length - 1]?.id;
}

function renderRow(row) {
  const activeRowId = getActiveRowId();
  const rowNumber = Number(row.id.replace("row-", ""));
  const previousRow = rowNumber > 1 ? getRow(`row-${rowNumber - 1}`) : null;
  const directItem = { ...row.direct, fields: getCategoryFields(row.activityType, "direct") };
  const indirectItem = { ...row.indirect, fields: getCategoryFields(row.activityType, "indirect") };
  const otherItem = { ...row.other, fields: getCategoryFields(row.activityType, "other") };
  const directRequired = categoryIsRequired(row.activityType, "direct");
  const indirectRequired = categoryIsRequired(row.activityType, "indirect");
  const otherRequired = categoryIsRequired(row.activityType, "other");
  const directSummary = isCategoryValid(directItem) && categoryTotal(directItem) !== "" ? categoryTotal(directItem) : "";
  const indirectSummary = isCategoryValid(indirectItem) && categoryTotal(indirectItem) !== "" ? categoryTotal(indirectItem) : "";
  const otherSummary = isCategoryValid(otherItem) && categoryTotal(otherItem) !== "" ? categoryTotal(otherItem) : "";
  return `
    <tr class="${row.id === activeRowId ? "active-entry-row" : ""}">
      <td style="width:14.4%;">
        <div class="cell-trigger cell-entry">
          <span class="cell-label">Choose<br>Activity Type</span>
          <select class="cell-input ${row.activityType ? "filled-value" : ""}" data-action="set-activity-type" data-row-id="${row.id}">
            <option value=""></option>
            ${ACTIVITY_TYPES.map((type) => `<option value="${escapeHtml(type)}" ${row.activityType === type ? "selected" : ""}>${escapeHtml(type)}</option>`).join("")}
          </select>
        </div>
      </td>
      <td style="width:20%;">
        <div class="cell-trigger cell-entry">
          <span class="cell-label">Enter Activity Name</span>
          <textarea class="cell-input cell-textarea ${row.activityName ? "filled-value" : ""}" data-action="set-activity-name" data-row-id="${row.id}">${escapeHtml(row.activityName)}</textarea>
        </div>
      </td>
      <td style="width:20%;">
        ${
          rowNumber === 1
            ? `<button class="cell-trigger" data-action="open-location" data-row-id="${row.id}">
                <span class="cell-label">Enter Activity Location</span>
                <span class="cell-value filled-value">${escapeHtml(row.location.address || "")}</span>
              </button>`
            : `<div class="cell-trigger cell-choice">
                <span class="cell-label choice-line">Use location from row above <input type="checkbox" data-action="set-location-mode" data-row-id="${row.id}" data-mode="above" ${
                  row.locationMode === "above" ? "checked" : ""
                } /><br>or enter new <input type="checkbox" data-action="set-location-mode" data-row-id="${row.id}" data-mode="new" ${
                  row.locationMode === "new" ? "checked" : ""
                } /></span>
                <span class="cell-value filled-value">${
                  row.locationMode === "above"
                    ? escapeHtml(previousRow?.location.address || "")
                    : escapeHtml(row.location.address || "")
                }</span>
              </div>`
        }
      </td>
      <td style="width:7%;">
        <button class="cell-trigger ${directRequired ? "" : "disabled-cell"}" data-action="open-beneficiaries" data-row-id="${row.id}" data-group="direct" data-required="${directRequired ? "true" : "false"}">
          <span class="cell-label">${directRequired ? "Enter Direct Beneficiaries" : "Direct Beneficiaries not needed"}</span>
          <span class="cell-value filled-value">${escapeHtml(directRequired ? directSummary : "")}</span>
        </button>
      </td>
      <td style="width:7%;">${renderUploadCell(row, "direct", directRequired)}</td>
      <td style="width:7%;">
        <button class="cell-trigger ${indirectRequired ? "" : "disabled-cell"}" data-action="open-beneficiaries" data-row-id="${row.id}" data-group="indirect" data-required="${indirectRequired ? "true" : "false"}">
          <span class="cell-label">${indirectRequired ? "Enter Indirect Beneficiaries" : "Indirect Beneficiaries not needed"}</span>
          <span class="cell-value filled-value">${escapeHtml(indirectRequired ? indirectSummary : "")}</span>
        </button>
      </td>
      <td style="width:7%;">${renderUploadCell(row, "indirect", indirectRequired)}</td>
      <td style="width:7%;">
        <button class="cell-trigger ${otherRequired ? "" : "disabled-cell"}" data-action="open-beneficiaries" data-row-id="${row.id}" data-group="other" data-required="${otherRequired ? "true" : "false"}">
          <span class="cell-label">${otherRequired ? "Enter Other Beneficiaries" : "Other Beneficiaries not needed"}</span>
          <span class="cell-value filled-value">${escapeHtml(otherRequired ? otherSummary : "")}</span>
        </button>
      </td>
      <td style="width:7%;">${renderUploadCell(row, "other", otherRequired)}</td>
    </tr>
  `;
}

function renderUploadCell(row, groupKey, isRequired) {
  const files = row[groupKey].uploads;
  const title =
    groupKey === "direct"
      ? "Upload Direct Documentation"
      : groupKey === "indirect"
      ? "Upload Indirect Documentation"
      : "Upload Other Documentation";
  if (!isRequired) {
    return `
      <div class="cell-trigger disabled-cell">
        <span class="cell-label">Documentation not needed</span>
      </div>
    `;
  }
  return `
    <label class="cell-trigger">
      <span class="cell-label">${title}</span>
      <span class="cell-value filled-value">${escapeHtml(files.length ? files.join(", ") : "")}</span>
      <input type="file" hidden multiple data-action="upload-files" data-row-id="${row.id}" data-group="${groupKey}" />
    </label>
  `;
}

function renderModal() {
  if (!state.activeModal) return "";
  if (state.activeModal.type === "location") return renderLocationModal();
  if (state.activeModal.type === "activities-map") return renderActivitiesMapModal();
  return renderBeneficiaryModal();
}

function renderActivitiesMapModal() {
  const rowsWithLocations = state.rows.filter((row) => !isRowBlank(row) && row.location.lat && row.location.lng);
  return `
    <div class="modal-shell">
      <div class="modal-card" data-modal-card="true" style="width:min(1100px,92vw);">
        <div class="modal-header">
          <div>
            <h2>Activities Map</h2>
            <div class="subtle">${rowsWithLocations.length} mapped activit${rowsWithLocations.length === 1 ? "y" : "ies"}</div>
          </div>
          <button class="ghost-btn" data-action="close-modal">Close</button>
        </div>
        ${
          rowsWithLocations.length
            ? `<div id="activitiesMap" class="activities-map-surface"></div>`
            : `<div class="mini-card">No activities with saved coordinates yet.</div>`
        }
      </div>
    </div>
  `;
}

function renderLocationModal() {
  const row = getRow(state.activeModal.rowId);
  return `
    <div class="modal-shell">
      <div class="modal-card" data-modal-card="true">
        <div class="modal-header">
          <div>
            <h2>Activity Location</h2>
            <div class="subtle">Row ${escapeHtml(row.id.replace("row-", ""))}</div>
          </div>
          <button class="ghost-btn" data-action="close-modal">Close</button>
        </div>
        <div class="modal-grid">
          <div class="stack">
            <div class="field">
              <label for="modalAddress">Address</label>
              <input id="modalAddress" value="${escapeHtml(row.location.address)}" data-action="modal-address" />
            </div>
            <div class="toolbar-actions">
              <button class="btn" data-action="save-location-search" data-row-id="${row.id}">Save address</button>
            </div>
            <div class="mini-card">
              <div class="subtle">Stored location</div>
              <strong>${escapeHtml(row.location.address || "No location set")}</strong>
              <div class="subtle" style="margin-top:6px;">${escapeHtml(row.location.lat && row.location.lng ? `${row.location.lat}, ${row.location.lng}` : "Click the map to set coordinates")}</div>
              ${state.mapMessage ? `<div class="error-text" style="margin-top:8px;">${escapeHtml(state.mapMessage)}</div>` : ""}
              ${state.mapDebug ? `<div class="subtle" style="margin-top:8px;font-size:0.82rem;">${escapeHtml(state.mapDebug)}</div>` : ""}
            </div>
          </div>
          <div class="map-box">
            <div id="modalMap" class="map-surface"></div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderFallbackMap(row) {
  const hasPin = row.location.lat !== "" && row.location.lng !== "";
  return `
    <div class="map-fallback" id="fallbackMapSurface">
      ${
        hasPin
          ? `<div class="fallback-pin" style="left:${((Number(row.location.lng) + 180) / 360) * 100}%;top:${((85 - Number(row.location.lat)) / 170) * 100}%;"></div>`
          : ""
      }
      <div class="map-note">Click anywhere here to store coordinates. The address field will stay editable above.</div>
    </div>
  `;
}

function renderBeneficiaryModal() {
  const row = getRow(state.activeModal.rowId);
  const groupKey = state.activeModal.group;
  const label = groupKey.charAt(0).toUpperCase() + groupKey.slice(1);
  const fields = getCategoryFields(row.activityType, groupKey);
  const category = { ...row[groupKey], fields };
  const total = categoryTotal(category);
  const hasError = !isCategoryValid(category);
  const columnGroups = getCategoryColumnGroups(fields);
  const mismatchedGroups = getMismatchedColumnGroups(category);
  if (!row.activityType) {
    return `
      <div class="modal-shell">
        <div class="modal-card" data-modal-card="true" style="width:min(700px,88vw);">
          <div class="modal-header">
            <div>
              <h2>${label} Beneficiaries</h2>
              <div class="subtle">Choose an Activity Type first.</div>
            </div>
            <button class="ghost-btn" data-action="close-modal">Close</button>
          </div>
        </div>
      </div>
    `;
  }
  return `
    <div class="modal-shell">
      <div class="modal-card" data-modal-card="true" style="width:min(780px,88vw);">
        <div class="modal-header">
          <div>
            <h2>${label} Beneficiaries</h2>
            <div class="subtle">${escapeHtml(row.activityType)}</div>
          </div>
          <button class="ghost-btn" data-action="close-modal">Close</button>
        </div>
        ${
          columnGroups.length >= 3
            ? `<div class="metric-columns">
                ${columnGroups
                  .map(
                    (columnGroup) => `
                      <div class="metric-column">
                        <div class="metric-column-title">${escapeHtml(columnGroup.replace("col", "Column "))}</div>
                        ${fields
                          .filter((field) => field.columnGroup === columnGroup)
                          .map(
                            (field) => `
                              <div class="field">
                                <label>${escapeHtml(getFieldDisplayLabel(field.label))}</label>
                                <input class="${mismatchedGroups.includes(columnGroup) ? "invalid-field" : ""}" type="text" inputmode="numeric" value="${escapeHtml(getCategoryQuantity(category, field.key))}" data-action="modal-beneficiaries" data-row-id="${row.id}" data-group="${groupKey}" data-field="${field.key}" data-column-group="${columnGroup}" />
                              </div>`
                          )
                          .join("")}
                      </div>`
                  )
                  .join("")}
              </div>`
            : `<div class="metric-grid">
                ${fields
                  .map(
                    (field) => `
                      <div class="field">
                        <label>${escapeHtml(getFieldDisplayLabel(field.label))}</label>
                        <input type="text" inputmode="numeric" value="${escapeHtml(getCategoryQuantity(category, field.key))}" data-action="modal-beneficiaries" data-row-id="${row.id}" data-group="${groupKey}" data-field="${field.key}" />
                      </div>`
                  )
                  .join("")}
              </div>`
        }
        <div class="modal-summary">
          <div class="field total-readout">
            <label>Total</label>
            <div class="total-text" id="modalTotalText">${escapeHtml(total)}</div>
          </div>
          ${
            columnGroups.length > 1
              ? `<div class="subtle" id="modalColumnTotals">${escapeHtml(
                  columnGroups
                    .map((columnGroup) => `${columnGroup.replace("col", "Column ")} total: ${getCategoryColumnTotal(category, columnGroup) || 0}`)
                    .join(" | ")
                )}</div>`
              : ""
          }
        </div>
        <div style="margin-top:14px;" id="modalBeneficiaryError">
          ${state.numericError ? `<span class="error-text">numbers only</span>` : ""}
          ${!state.numericError && hasError ? `<span class="error-text">Each Column Subtotal must match Total</span>` : ""}
        </div>
      </div>
    </div>
  `;
}

function buildActivityInfoHtml(row) {
  const directTotal = categoryTotal({ ...row.direct, fields: getCategoryFields(row.activityType, "direct") });
  const indirectTotal = categoryTotal({ ...row.indirect, fields: getCategoryFields(row.activityType, "indirect") });
  const otherTotal = categoryTotal({ ...row.other, fields: getCategoryFields(row.activityType, "other") });
  return `
    <div class="map-info-card">
      <strong>${escapeHtml(row.activityName || "Untitled Activity")}</strong>
      <div>${escapeHtml(row.activityType || "")}</div>
      <div>${escapeHtml(row.location.address || "")}</div>
      <div>Direct: ${escapeHtml(directTotal || "0")}</div>
      <div>Indirect: ${escapeHtml(indirectTotal || "0")}</div>
      <div>Other: ${escapeHtml(otherTotal || "0")}</div>
    </div>
  `;
}

function refreshBeneficiaryModalUi() {
  if (!state.activeModal || state.activeModal.type !== "beneficiaries") return;
  const row = getRow(state.activeModal.rowId);
  const groupKey = state.activeModal.group;
  const category = { ...row[groupKey], fields: getCategoryFields(row.activityType, groupKey) };
  const columnGroups = getCategoryColumnGroups(category.fields || []);
  const mismatchedGroups = getMismatchedColumnGroups(category);
  const totalNode = document.getElementById("modalTotalText");
  const columnTotalsNode = document.getElementById("modalColumnTotals");
  const errorNode = document.getElementById("modalBeneficiaryError");
  if (totalNode) totalNode.textContent = String(categoryTotal(category) ?? "");
  if (columnTotalsNode) {
    columnTotalsNode.textContent = columnGroups
      .map((columnGroup) => `${columnGroup.replace("col", "Column ")} total: ${getCategoryColumnTotal(category, columnGroup) || 0}`)
      .join(" | ");
  }
  if (errorNode) {
    errorNode.innerHTML = state.numericError
      ? `<span class="error-text">numbers only</span>`
      : !isCategoryValid(category)
      ? `<span class="error-text">Each Column Subtotal must match Total</span>`
      : "";
  }
  document.querySelectorAll("[data-column-group]").forEach((input) => {
    input.classList.toggle("invalid-field", mismatchedGroups.includes(input.dataset.columnGroup));
  });
}

function initializeLocationModal() {
  const row = getRow(state.activeModal.rowId);
  const target = document.getElementById("modalMap");
  if (!target || !window.L) return;
  const center = row.location.lat && row.location.lng
    ? [Number(row.location.lat), Number(row.location.lng)]
    : [20, 0];
  const map = L.map(target).setView(center, row.location.lat ? Number(row.location.zoom || 12) : 2);
  addReliableBaseLayer(map);
  currentMap = map;
  currentMarker = row.location.lat && row.location.lng ? L.marker(center).addTo(map) : null;
  currentGeocoder = null;
  state.mapDebug = "Public light-gray basemap — no API key required.";
  state.mapMessage = "";
  map.on("click", (event) => {
    const { lat, lng } = event.latlng;
    if (currentMarker) currentMarker.setLatLng([lat, lng]);
    else currentMarker = L.marker([lat, lng]).addTo(map);
    reverseGeocodeRow(row.id, lat, lng);
  });
}

function initializeActivitiesMapModal() {
  const rowsWithLocations = state.rows.filter((row) => !isRowBlank(row) && row.location.lat && row.location.lng);
  const target = document.getElementById("activitiesMap");
  if (!target || !rowsWithLocations.length) return;

  if (!window.L) {
    target.innerHTML = `<div class="mini-card">The public map library could not load.</div>`;
    return;
  }
  const points = rowsWithLocations.map((row) => ({ row, lat: Number(row.location.lat), lng: Number(row.location.lng) }));
  const map = L.map(target).setView([points[0].lat, points[0].lng], points.length === 1 ? 12 : 4);
  addReliableBaseLayer(map);
  const bounds = [];
  points.forEach(({ row, lat, lng }) => {
    L.marker([lat, lng], { title: row.activityName || row.activityType })
      .addTo(map)
      .bindPopup(buildActivityInfoHtml(row));
    bounds.push([lat, lng]);
  });
  if (bounds.length > 1) map.fitBounds(bounds, { padding: [48, 48] });
}

function addReliableBaseLayer(targetMap) {
  const layer = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>',
  });
  layer.on("tileerror", ({ tile, coords }) => {
    if (!tile || tile.dataset.fallbackTile === "true") return;
    tile.dataset.fallbackTile = "true";
    tile.src = `https://a.tile.openstreetmap.fr/hot/${coords.z}/${coords.x}/${coords.y}.png`;
  });
  layer.addTo(targetMap);
}

async function geocodeModalAddress(rowId) {
  const address = getModalAddress() || getRow(rowId)?.location.address;
  if (!address) return;

  state.mapMessage = "Finding this address…";
  render();

  try {
    const endpoint = new URL("https://nominatim.openstreetmap.org/search");
    endpoint.searchParams.set("format", "jsonv2");
    endpoint.searchParams.set("limit", "1");
    endpoint.searchParams.set("q", address);
    const response = await fetch(endpoint, { headers: { Accept: "application/json" } });
    if (!response.ok) throw new Error(`Address lookup failed (${response.status}).`);
    const [result] = await response.json();
    if (!result) {
      state.mapMessage = "Address not found. Try adding a city or country, or click the map to pin it.";
      render();
      return;
    }
    const lat = Number(result.lat);
    const lng = Number(result.lon);
    const placeType = result.addresstype || result.type;
    const zoom = placeType === "country" ? 5 : ["state", "region", "province"].includes(placeType) ? 7 : ["city", "town", "municipality"].includes(placeType) ? 11 : 14;
    updateRow(rowId, (next) => {
      next.location.address = result.display_name || address;
      next.location.lat = lat.toFixed(6);
      next.location.lng = lng.toFixed(6);
      next.location.zoom = zoom;
      return next;
    });
    state.mapMessage = "";
    state.activeModal = null;
    render();
  } catch (error) {
    state.mapMessage = "Address lookup is temporarily unavailable. Click the map to pin the location instead.";
    render();
  }
}

function reverseGeocodeRow(rowId, lat, lng) {
  updateRow(rowId, (next) => {
    next.location.lat = lat.toFixed(6);
    next.location.lng = lng.toFixed(6);
    next.location.zoom = currentMap?.getZoom?.() || 14;
    next.location.address = getModalAddress() || `Pinned location (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
    return next;
  });

  state.mapMessage = "";
  render();
}

function getModalAddress() {
  const input = document.getElementById("modalAddress");
  return input ? input.value.trim() : "";
}

function buildCsv() {
  const header = [
    "Activity Type",
    "Activity Name",
    "Activity Location",
    "Latitude",
    "Longitude",
    "Direct Total",
    "Direct Detail",
    "Direct Uploads",
    "Indirect Total",
    "Indirect Detail",
    "Indirect Uploads",
    "Other Total",
    "Other Detail",
    "Other Uploads",
  ];

  const rows = state.rows.filter((row) => !isRowBlank(row)).map((row) => [
    row.activityType,
    row.activityName,
    row.location.address,
    row.location.lat,
    row.location.lng,
    categoryTotal({ ...row.direct, fields: getCategoryFields(row.activityType, "direct") }),
    buildCategoryExportString(row, "direct"),
    row.direct.uploads.join(" | "),
    categoryTotal({ ...row.indirect, fields: getCategoryFields(row.activityType, "indirect") }),
    buildCategoryExportString(row, "indirect"),
    row.indirect.uploads.join(" | "),
    categoryTotal({ ...row.other, fields: getCategoryFields(row.activityType, "other") }),
    buildCategoryExportString(row, "other"),
    row.other.uploads.join(" | "),
  ]);

  return [header, ...rows]
    .map((columns) => columns.map((value) => `"${String(value ?? "").replaceAll('"', '""')}"`).join(","))
    .join("\n");
}

async function finalizeEntriesToSharedSheet() {
  if (!allRowsValid()) {
    state.submitMessage = "Please fix numeric validation before finalizing.";
    render();
    return;
  }

  const endpoint = window.APP_CONFIG?.googleSheetEndpoint;
  if (!endpoint) {
    state.submitMessage = "Add your Google Apps Script web app URL in APP_CONFIG.googleSheetEndpoint first.";
    render();
    return;
  }

  const rows = buildSharedSheetRows();
  if (!rows.length) {
    state.submitMessage = "There are no completed activity rows to save yet.";
    render();
    return;
  }

  state.isSubmitting = true;
  state.submitMessage = "";
  render();

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      mode: "no-cors",
      body: JSON.stringify({
        source: "activity-data-collection-table",
        rows,
      }),
    });

    state.submitMessage = `${rows.length} row${rows.length === 1 ? "" : "s"} saved to the shared Google Sheet.`;
  } catch (error) {
    state.submitMessage = error?.message || "Could not save to the shared Google Sheet.";
  } finally {
    state.isSubmitting = false;
    render();
  }
}

function handleAction(event) {
  const target =
    event.target.closest("[data-action]") || event.target;
  const action = target.dataset.action;
  if (!action) return;

  if (action === "submit-login") {
    const input = document.getElementById("loginPassword");
    const password = input ? input.value : "";
    if (password === window.APP_CONFIG?.appPassword) {
      state.isAuthenticated = true;
      state.loginError = "";
      window.sessionStorage.setItem(LOGIN_STORAGE_KEY, "true");
    } else {
      state.loginError = "Incorrect password.";
    }
    render();
    return;
  }

  if (action === "open-activities-map") {
    state.activeModal = { type: "activities-map" };
    render();
    return;
  }

  if (action === "finalize-entries") {
    finalizeEntriesToSharedSheet();
    return;
  }

  if (action === "open-location") {
    state.activeModal = { type: "location", rowId: target.dataset.rowId };
    state.mapMessage = "";
    state.mapDebug = "";
    render();
    return;
  }

  if (action === "open-beneficiaries") {
    if (target.dataset.required === "false") {
      return;
    }
    state.activeModal = {
      type: "beneficiaries",
      rowId: target.dataset.rowId,
      group: target.dataset.group,
    };
    state.numericError = "";
    render();
    return;
  }

  if (action === "close-modal") {
    state.activeModal = null;
    state.mapMessage = "";
    state.numericError = "";
    render();
    return;
  }

  if (action === "set-location-mode") {
    const rowId = target.dataset.rowId;
    const rowNumber = Number(rowId.replace("row-", ""));
    const shouldOpenLocation = target.checked && target.dataset.mode === "new";
    updateRow(rowId, (next) => {
      next.locationMode = target.checked ? target.dataset.mode : "";
      if (target.checked && target.dataset.mode === "above" && rowNumber > 1) {
        const previousRow = getRow(`row-${rowNumber - 1}`);
        next.location = clone(previousRow?.location || next.location);
      }
      return next;
    });
    if (shouldOpenLocation) {
      state.activeModal = { type: "location", rowId };
      state.mapMessage = "";
      state.mapDebug = "";
    }
    render();
    return;
  }

  if (action === "save-location-search") {
    const rowId = target.dataset.rowId;
    const address = getModalAddress();
    updateRow(rowId, (next) => {
      next.location.address = address;
      return next;
    });
    geocodeModalAddress(rowId);
    return;
  }
}

function handleInput(event) {
  const target = event.target;
  const action = target.dataset.action;
  if (!action) return;

  if (action === "set-activity-type") {
    target.classList.toggle("filled-value", Boolean(target.value));
    updateRow(target.dataset.rowId, (next) => {
      next.activityType = target.value;
      next.direct = category();
      next.indirect = category();
      next.other = category();
      return next;
    });
    render();
    return;
  }

  if (action === "set-activity-name") {
    target.classList.toggle("filled-value", Boolean(target.value.trim()));
    updateRow(target.dataset.rowId, (next) => {
      next.activityName = target.value;
      return next;
    });
    return;
  }

  if (action === "modal-address") {
    updateRow(state.activeModal.rowId, (next) => {
      next.location.address = target.value;
      return next;
    });
    return;
  }

  if (action === "modal-beneficiaries") {
    const cleaned = target.value.replace(/\D+/g, "");
    state.numericError = cleaned !== target.value ? "numbers only" : "";
    if (cleaned !== target.value) {
      target.value = cleaned;
    }
    updateRow(target.dataset.rowId, (next) => {
      next[target.dataset.group].quantities[target.dataset.field] = cleaned;
      return next;
    });
    refreshBeneficiaryModalUi();
    return;
  }
}

function handleChange(event) {
  const target = event.target;
  if (target.dataset.action === "set-activity-type") {
    target.classList.toggle("filled-value", Boolean(target.value));
    updateRow(target.dataset.rowId, (next) => {
      next.activityType = target.value;
      next.direct = category();
      next.indirect = category();
      next.other = category();
      return next;
    });
    render();
    return;
  }
  if (target.dataset.action === "upload-files") {
    const files = Array.from(target.files || []).map((file) => file.name);
    updateRow(target.dataset.rowId, (next) => {
      next[target.dataset.group].uploads = files;
      return next;
    });
    render();
  }
}

root.addEventListener("click", handleAction);
root.addEventListener("input", handleInput);
root.addEventListener("change", handleChange);

render();
