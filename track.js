const alertBox = document.getElementById("track-alert");
const form = document.getElementById("track-token-form");
const input = document.getElementById("tracking-token");
const content = document.getElementById("track-content");

boot();

function boot() {
  form.addEventListener("submit", onSubmit);

  const token = (new URLSearchParams(window.location.search).get("token") || "").trim();
  if (token) {
    input.value = token;
    loadByToken(token);
  }
}

async function onSubmit(event) {
  event.preventDefault();
  const token = input.value.trim();
  if (!token) {
    showAlert("أدخل رمز المتابعة أولًا.", "warn");
    return;
  }

  await loadByToken(token);
}

async function loadByToken(token) {
  clearAlert();
  content.innerHTML = '<p class="text-sm font-semibold text-waqf-700">جاري تحميل حالة الطلب...</p>';

  try {
    const response = await fetch(`/api/public/track?token=${encodeURIComponent(token)}`, {
      method: "GET",
      headers: { Accept: "application/json" }
    });

    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(payload?.error || "تعذر جلب حالة الطلب.");
    }

    renderRequest(payload.request || null);
  } catch (error) {
    content.innerHTML = "";
    showAlert(error.message || "تعذر جلب حالة الطلب.", "error");
  }
}

function renderRequest(request) {
  if (!request) {
    content.innerHTML =
      '<p class="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700">لم يتم العثور على طلب بهذا الرمز.</p>';
    return;
  }

  const timeline = Array.isArray(request.timeline) ? request.timeline : [];
  const requiredActions = Array.isArray(request.required_actions) ? request.required_actions : [];

  content.innerHTML = `
    <article class="rounded-xl border border-waqf-300 bg-white p-4">
      <h3 class="text-base font-extrabold text-waqf-900">${escapeHtml(request.applicant_name || "مقدم الطلب")}</h3>
      <div class="mt-2 space-y-2 text-sm text-waqf-800">
        <p><strong>رقم الطلب:</strong> ${escapeHtml(request.request_number || "-")}</p>
        <p><strong>المسار:</strong> ${escapeHtml(request.option_title || "-")}</p>
        <p><strong>الحالة الحالية:</strong> ${escapeHtml(request.status || "-")}</p>
        <p><strong>النتيجة:</strong> ${escapeHtml(request.route_result || "-")}</p>
        <p><strong>آخر تحديث:</strong> ${formatDate(request.updated_at || request.created_at)}</p>
      </div>

      <div class="mt-3">
        <p class="text-xs font-extrabold text-waqf-700">المطلوب حاليًا</p>
        <div class="mt-2 space-y-2">
          ${
            requiredActions.length
              ? requiredActions
                  .map(
                    (action) =>
                      `<div class="rounded-lg border border-waqf-300 bg-waqf-50 px-3 py-2 text-xs text-waqf-900">${escapeHtml(action)}</div>`
                  )
                  .join("")
              : '<div class="rounded-lg border border-waqf-300 bg-waqf-50 px-3 py-2 text-xs text-waqf-700">لا توجد متطلبات إضافية حاليًا.</div>'
          }
        </div>
      </div>

      <div class="mt-3">
        <p class="text-xs font-extrabold text-waqf-700">سجل الحالة</p>
        <div class="mt-2 space-y-2">
          ${
            timeline.length
              ? timeline
                  .map(
                    (item) =>
                      `<div class="rounded-lg border border-waqf-300 bg-waqf-50 px-3 py-2 text-xs text-waqf-900"><strong>${escapeHtml(
                        item.status || "تحديث"
                      )}</strong><br>${escapeHtml(item.note || "-")}<br><span class="text-waqf-700">${formatDate(
                        item.at || request.updated_at || request.created_at
                      )}</span></div>`
                  )
                  .join("")
              : '<div class="rounded-lg border border-waqf-300 bg-waqf-50 px-3 py-2 text-xs text-waqf-700">لا يوجد سجل حالة مفصل.</div>'
          }
        </div>
      </div>
    </article>
  `;
}

function showAlert(message, type = "warn") {
  alertBox.classList.remove(
    "hidden",
    "border-amber-300",
    "bg-amber-50",
    "text-amber-900",
    "border-rose-300",
    "bg-rose-50",
    "text-rose-800"
  );

  if (type === "error") {
    alertBox.classList.add("border-rose-300", "bg-rose-50", "text-rose-800");
  } else {
    alertBox.classList.add("border-amber-300", "bg-amber-50", "text-amber-900");
  }

  alertBox.textContent = message;
}

function clearAlert() {
  alertBox.classList.add("hidden");
  alertBox.textContent = "";
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
