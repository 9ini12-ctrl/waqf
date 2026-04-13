const ADMIN_TOKEN_KEY = "waqf_admin_token";

const ADMIN_STATUSES = [
  "قيد الدراسة الأولية",
  "قيد التواصل العاجل",
  "مؤهل للعرض على اللجنة",
  "بانتظار استكمال المتطلبات",
  "قيد اعتماد نقل النظارة",
  "بانتظار مستندات رسمية",
  "بانتظار جدولة الدفعات",
  "بانتظار تفعيل المساهمة الشهرية",
  "بانتظار إصدار الفاتورة",
  "مكتمل",
  "مرفوض"
];

const state = {
  token: "",
  requests: [],
  selectedRequestNumber: null,
  search: "",
  status: "all",
  loading: false
};

const alertEl = document.getElementById("admin-alert");
const authPanel = document.getElementById("auth-panel");
const dashboard = document.getElementById("dashboard");
const tokenInput = document.getElementById("admin-token-input");
const loginBtn = document.getElementById("admin-login-btn");

const searchInput = document.getElementById("admin-search");
const statusSelect = document.getElementById("admin-status");
const refreshBtn = document.getElementById("admin-refresh");
const logoutBtn = document.getElementById("admin-logout");
const countEl = document.getElementById("requests-count");
const listEl = document.getElementById("requests-list");

const detailEmpty = document.getElementById("detail-empty");
const detailPanel = document.getElementById("detail-panel");
const detailRequestNumber = document.getElementById("detail-request-number");
const detailMeta = document.getElementById("detail-meta");
const detailSummary = document.getElementById("detail-summary");
const detailTimeline = document.getElementById("detail-timeline");

const updateStatus = document.getElementById("update-status");
const updateRecommendation = document.getElementById("update-recommendation");
const updateActions = document.getElementById("update-actions");
const updateNote = document.getElementById("update-note");
const saveBtn = document.getElementById("admin-save-btn");

let searchDebounceId = null;

boot();

function boot() {
  bindEvents();

  const savedToken = sessionStorage.getItem(ADMIN_TOKEN_KEY) || "";
  if (savedToken) {
    state.token = savedToken;
    tokenInput.value = savedToken;
    loginAndLoad();
  } else {
    setLoggedIn(false);
  }
}

function bindEvents() {
  loginBtn.addEventListener("click", () => {
    state.token = tokenInput.value.trim();
    if (!state.token) {
      showAlert("أدخل رمز الدخول الإداري أولًا.", "warn");
      return;
    }
    sessionStorage.setItem(ADMIN_TOKEN_KEY, state.token);
    loginAndLoad();
  });

  logoutBtn.addEventListener("click", logout);

  refreshBtn.addEventListener("click", () => loadRequests({ keepSelection: true }));

  statusSelect.addEventListener("change", () => {
    state.status = statusSelect.value;
    loadRequests({ keepSelection: false });
  });

  searchInput.addEventListener("input", () => {
    state.search = searchInput.value.trim();
    if (searchDebounceId) {
      clearTimeout(searchDebounceId);
    }
    searchDebounceId = setTimeout(() => {
      loadRequests({ keepSelection: false });
    }, 350);
  });

  listEl.addEventListener("click", (event) => {
    const button = event.target.closest("[data-request-number]");
    if (!button) return;
    selectRequest(button.dataset.requestNumber);
  });

  saveBtn.addEventListener("click", saveUpdate);
}

async function loginAndLoad() {
  clearAlert();

  try {
    await loadRequests({ keepSelection: false });
    setLoggedIn(true);
  } catch (error) {
    logout();
    showAlert(`تعذر تسجيل الدخول: ${error.message || "تحقق من رمز الإدارة"}`, "error");
  }
}

function logout() {
  state.token = "";
  state.requests = [];
  state.selectedRequestNumber = null;
  sessionStorage.removeItem(ADMIN_TOKEN_KEY);
  tokenInput.value = "";
  setLoggedIn(false);
  renderRequests();
  renderDetail(null);
}

function setLoggedIn(isLoggedIn) {
  authPanel.classList.toggle("hidden", isLoggedIn);
  dashboard.classList.toggle("hidden", !isLoggedIn);
}

async function loadRequests({ keepSelection }) {
  if (!state.token) {
    throw new Error("رمز الإدارة غير موجود.");
  }

  setLoading(true);
  clearAlert();

  const params = new URLSearchParams();
  params.set("limit", "200");
  if (state.status && state.status !== "all") {
    params.set("status", state.status);
  }
  if (state.search) {
    params.set("q", state.search);
  }

  try {
    const response = await apiFetch(`/api/admin/requests?${params.toString()}`);
    state.requests = Array.isArray(response.requests) ? response.requests : [];

    const hasSelection =
      keepSelection && state.selectedRequestNumber && state.requests.some((r) => r.request_number === state.selectedRequestNumber);

    if (!hasSelection) {
      state.selectedRequestNumber = state.requests[0]?.request_number || null;
    }

    renderRequests();
    renderDetail(getSelectedRequest());
  } finally {
    setLoading(false);
  }
}

function setLoading(loading) {
  state.loading = loading;
  refreshBtn.disabled = loading;
  refreshBtn.textContent = loading ? "جاري التحديث..." : "تحديث";
}

function renderRequests() {
  countEl.textContent = `إجمالي النتائج: ${state.requests.length}`;

  if (!state.requests.length) {
    listEl.innerHTML =
      '<p class="rounded-2xl border border-dashed border-waqf-300 bg-waqf-50 px-3 py-4 text-sm font-semibold text-waqf-700">لا توجد طلبات مطابقة حاليًا.</p>';
    return;
  }

  listEl.innerHTML = state.requests
    .map((request) => {
      const selected = request.request_number === state.selectedRequestNumber;
      return `
        <button
          type="button"
          data-request-number="${escapeHtml(request.request_number)}"
          class="w-full rounded-2xl border px-3 py-3 text-right transition ${
            selected
              ? "border-accent-500/45 bg-accent-50"
              : "border-waqf-200 bg-white hover:border-accent-500/35 hover:bg-accent-50/60"
          }"
        >
          <div class="flex flex-wrap items-center justify-between gap-2">
            <p class="text-xs font-extrabold text-waqf-900">${escapeHtml(request.request_number)}</p>
            <span class="rounded-full border border-waqf-200 bg-white px-2 py-1 text-[11px] font-bold text-waqf-700">${escapeHtml(
              request.status || "-"
            )}</span>
          </div>
          <p class="mt-2 text-sm font-bold text-waqf-900">${escapeHtml(request.applicant_name || "-")}</p>
          <p class="mt-1 text-xs text-waqf-700">${escapeHtml(request.option_title || "-")}</p>
          <p class="mt-1 text-[11px] text-waqf-600">${formatDate(request.created_at)}</p>
        </button>
      `;
    })
    .join("");
}

function selectRequest(requestNumber) {
  state.selectedRequestNumber = requestNumber;
  renderRequests();
  renderDetail(getSelectedRequest());
}

function getSelectedRequest() {
  return state.requests.find((request) => request.request_number === state.selectedRequestNumber) || null;
}

function renderDetail(request) {
  if (!request) {
    detailEmpty.classList.remove("hidden");
    detailPanel.classList.add("hidden");
    return;
  }

  detailEmpty.classList.add("hidden");
  detailPanel.classList.remove("hidden");

  detailRequestNumber.textContent = `طلب ${request.request_number}`;
  detailMeta.textContent = `المسار: ${request.option_title || "-"} | تاريخ الإنشاء: ${formatDate(request.created_at)} | آخر تحديث: ${formatDate(
    request.updated_at
  )}`;

  const answers = request.answers && typeof request.answers === "object" ? request.answers : {};
  const requiredActions = Array.isArray(request.required_actions) ? request.required_actions : [];

  const summaryRows = [
    ["اسم مقدم الطلب", request.applicant_name],
    ["الجوال", request.phone],
    ["المدينة", request.city],
    ["وسيلة التواصل", request.preferred_contact],
    ["البريد", request.email || "-"],
    ["الحالة", request.status || "-"],
    ["النتيجة", request.route_result || "-"],
    ["التوصية", request.recommendation || "-"]
  ];

  const extraAnswerRows = Object.entries(answers)
    .filter(([key, value]) => !["flow_id", "full_name", "phone", "city", "preferred_contact", "email"].includes(key))
    .filter(([, value]) => value !== null && value !== "")
    .slice(0, 14)
    .map(([key, value]) => [key, Array.isArray(value) ? value.join(", ") : String(value)]);

  detailSummary.innerHTML = [
    ...summaryRows,
    ...extraAnswerRows,
    ["المطلوب حاليًا", requiredActions.length ? requiredActions.join(" | ") : "لا يوجد"]
  ]
    .map(
      ([label, value]) =>
        `<div class="rounded-xl border border-waqf-200 bg-white px-3 py-2 text-xs text-waqf-900"><strong>${escapeHtml(
          label
        )}:</strong> ${escapeHtml(value || "-")}</div>`
    )
    .join("");

  const timeline = Array.isArray(request.timeline) ? request.timeline : [];
  detailTimeline.innerHTML = timeline.length
    ? timeline
        .map(
          (item) => `
          <div class="rounded-xl border border-waqf-200 bg-white px-3 py-2 text-xs text-waqf-900">
            <p class="font-bold">${escapeHtml(item.status || "تحديث")}</p>
            <p class="mt-1">${escapeHtml(item.note || "-")}</p>
            <p class="mt-1 text-[11px] text-waqf-600">${formatDate(item.at)}</p>
          </div>
        `
        )
        .join("")
    : '<p class="rounded-xl border border-dashed border-waqf-300 bg-waqf-50 px-3 py-2 text-xs text-waqf-700">لا يوجد سجل حالة حتى الآن.</p>';

  fillStatusOptions(request.status || "");
  updateRecommendation.value = request.recommendation || "";
  updateActions.value = requiredActions.join("\n");
  updateNote.value = "";
}

function fillStatusOptions(currentStatus) {
  const uniqueStatuses = Array.from(new Set([currentStatus, ...ADMIN_STATUSES].filter(Boolean)));
  updateStatus.innerHTML = uniqueStatuses
    .map(
      (status) => `<option value="${escapeHtml(status)}" ${status === currentStatus ? "selected" : ""}>${escapeHtml(status)}</option>`
    )
    .join("");
}

async function saveUpdate() {
  const request = getSelectedRequest();
  if (!request) {
    showAlert("اختر طلبًا أولًا.", "warn");
    return;
  }

  const status = updateStatus.value.trim();
  if (!status) {
    showAlert("اختر الحالة الجديدة.", "warn");
    return;
  }

  const payload = {
    requestNumber: request.request_number,
    status,
    recommendation: updateRecommendation.value.trim(),
    requiredActions: updateActions.value
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean),
    updateNote: updateNote.value.trim()
  };

  saveBtn.disabled = true;
  saveBtn.textContent = "جاري الحفظ...";

  try {
    const response = await apiFetch("/api/admin/request", {
      method: "PATCH",
      body: JSON.stringify(payload)
    });

    const updated = response.request;
    if (!updated?.request_number) {
      throw new Error("فشل تحديث الطلب.");
    }

    const index = state.requests.findIndex((item) => item.request_number === updated.request_number);
    if (index >= 0) {
      state.requests[index] = updated;
    }

    state.selectedRequestNumber = updated.request_number;
    renderRequests();
    renderDetail(updated);

    showAlert("تم حفظ التحديث بنجاح.", "success");
  } catch (error) {
    showAlert(`تعذر حفظ التحديث: ${error.message || "خطأ غير متوقع"}`, "error");
  } finally {
    saveBtn.disabled = false;
    saveBtn.textContent = "حفظ التحديث";
  }
}

async function apiFetch(path, options = {}) {
  const headers = {
    ...(options.headers || {}),
    "x-admin-token": state.token
  };

  if (options.body && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(path, {
    ...options,
    headers
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = payload?.error || payload?.message || `HTTP ${response.status}`;
    throw new Error(message);
  }

  return payload;
}

function showAlert(message, type = "warn") {
  alertEl.classList.remove(
    "hidden",
    "border-accent-200",
    "bg-accent-50",
    "text-accent-700",
    "border-rose-300",
    "bg-rose-50",
    "text-rose-800",
    "border-sky-200",
    "bg-sky-50",
    "text-sky-700"
  );

  if (type === "error") {
    alertEl.classList.add("border-rose-300", "bg-rose-50", "text-rose-800");
  } else if (type === "success") {
    alertEl.classList.add("border-sky-200", "bg-sky-50", "text-sky-700");
  } else {
    alertEl.classList.add("border-accent-200", "bg-accent-50", "text-accent-700");
  }

  alertEl.textContent = message;
}

function clearAlert() {
  alertEl.classList.add("hidden");
  alertEl.textContent = "";
}

function formatDate(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  return new Intl.DateTimeFormat("ar-SA", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(date);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
