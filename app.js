const PHONE_REGEX = /^(\+966|0)?5\d{8}$/;

const CONTACT_STEPS = [
  {
    id: "full_name",
    label: "الاسم الكامل",
    help: "الاسم الذي سيظهر على الطلب.",
    type: "text",
    required: true,
    placeholder: "الاسم الرباعي"
  },
  {
    id: "phone",
    label: "رقم التواصل",
    help: "رقم الجوال المعتمد للمتابعة.",
    type: "tel",
    required: true,
    placeholder: "05xxxxxxxx"
  },
  {
    id: "email",
    label: "البريد الإلكتروني",
    help: "سيصلك رابط متابعة الطلب على هذا البريد.",
    type: "email",
    required: true,
    placeholder: "name@example.com"
  }
];

const FLOWS = [
  {
    id: "buy_over_million",
    title: "لدي مبلغ يزيد عن مليون ريال",
    description: "شراء أصل وتحويله إلى وقف.",
    questions: [
      {
        id: "available_amount",
        label: "المبلغ المتاح (ريال)",
        help: "هذا المسار يشترط مليون ريال فأكثر.",
        type: "number",
        required: true,
        min: 1000000,
        step: 1000,
        placeholder: "1000000"
      },
      {
        id: "preferred_asset_type",
        label: "نوع الأصل المفضل",
        help: "اختر الخيار الأقرب لك.",
        type: "choice",
        required: true,
        options: [
          { value: "commercial", label: "عقار تجاري" },
          { value: "residential", label: "عقار سكني" },
          { value: "land", label: "أرض استثمارية" },
          { value: "other", label: "أصل آخر" }
        ]
      },
      {
        id: "target_city",
        label: "المدينة المستهدفة",
        help: "مكان الاستثمار الوقفي.",
        type: "choice",
        required: true,
        options: [
          { value: "riyadh", label: "الرياض" },
          { value: "jeddah", label: "جدة" },
          { value: "makkah", label: "مكة المكرمة" },
          { value: "other", label: "مدينة أخرى" }
        ]
      },
      {
        id: "readiness",
        label: "موعد البدء المتوقع",
        help: "لتحديد أولوية المعالجة.",
        type: "choice",
        required: true,
        options: [
          { value: "immediate", label: "خلال شهر" },
          { value: "mid", label: "خلال 3 أشهر" },
          { value: "later", label: "أكثر من 3 أشهر" }
        ]
      },
      {
        id: "wants_partnership",
        label: "هل ترغب بشراكة وقفية؟",
        help: "الشراكة تتيح خيارات إضافية.",
        type: "choice",
        required: true,
        options: [
          { value: "yes", label: "نعم" },
          { value: "no", label: "لا" }
        ]
      }
    ]
  },
  {
    id: "have_asset_convert",
    title: "لدي أصل وأرغب بتحويله إلى وقف",
    description: "تقييم الأصل والتحويل الوقفي.",
    questions: [
      {
        id: "asset_type",
        label: "نوع الأصل",
        help: "اختر نوع الأصل الحالي.",
        type: "choice",
        required: true,
        options: [
          { value: "building", label: "مبنى" },
          { value: "land", label: "أرض" },
          { value: "portfolio", label: "محفظة استثمارية" },
          { value: "other", label: "أصل آخر" }
        ]
      },
      {
        id: "asset_estimated_value",
        label: "القيمة التقديرية (ريال)",
        help: "قيمة تقريبية مبدئية.",
        type: "number",
        required: true,
        min: 1,
        step: 1000,
        placeholder: "5000000"
      },
      {
        id: "asset_city",
        label: "مدينة الأصل",
        help: "الموقع الحالي للأصل.",
        type: "text",
        required: true,
        placeholder: "المدينة"
      },
      {
        id: "has_legal_docs",
        label: "هل الوثائق مكتملة؟",
        help: "اكتمال الوثائق يسرع الإجراء.",
        type: "choice",
        required: true,
        options: [
          { value: "yes", label: "نعم" },
          { value: "no", label: "لا" }
        ]
      },
      {
        id: "has_disputes",
        label: "هل توجد نزاعات أو التزامات؟",
        help: "الشفافية تساعد في دقة المسار.",
        type: "choice",
        required: true,
        options: [
          { value: "no", label: "لا" },
          { value: "yes", label: "نعم" }
        ]
      }
    ]
  },
  {
    id: "transfer_nazir",
    title: "لدي وقف وأرغب بنقل النظارة للجمعية",
    description: "نقل النظارة وفق الإجراءات النظامية.",
    questions: [
      {
        id: "waqf_name",
        label: "اسم الوقف",
        help: "الاسم الرسمي للوقف.",
        type: "text",
        required: true,
        placeholder: "اسم الوقف"
      },
      {
        id: "waqf_deed_number",
        label: "رقم صك الوقف",
        help: "كما هو في الوثيقة الرسمية.",
        type: "text",
        required: true,
        placeholder: "رقم الصك"
      },
      {
        id: "current_nazir_name",
        label: "اسم الناظر الحالي",
        help: "الاسم المعتمد حالياً.",
        type: "text",
        required: true,
        placeholder: "اسم الناظر"
      },
      {
        id: "has_family_approval",
        label: "هل توجد موافقات من ذوي العلاقة؟",
        help: "لإكمال مسار النقل.",
        type: "choice",
        required: true,
        options: [
          { value: "yes", label: "نعم" },
          { value: "no", label: "لا" }
        ]
      },
      {
        id: "has_court_approval",
        label: "هل توجد موافقة رسمية/قضائية؟",
        help: "تُسرّع اعتماد نقل النظارة.",
        type: "choice",
        required: true,
        options: [
          { value: "yes", label: "نعم" },
          { value: "no", label: "لا" }
        ]
      },
      {
        id: "transfer_reason",
        label: "سبب نقل النظارة",
        help: "وصف موجز.",
        type: "textarea",
        required: true,
        placeholder: "سبب نقل النظارة"
      }
    ]
  },
  {
    id: "contribute_under_million",
    title: "لدي مبلغ أقل من مليون ريال للمساهمة",
    description: "المساهمة في وقف قيد الإنشاء.",
    questions: [
      {
        id: "contribution_amount",
        label: "قيمة المساهمة (ريال)",
        help: "هذا المسار للمبالغ الأقل من مليون.",
        type: "number",
        required: true,
        min: 1000,
        max: 999999,
        step: 500,
        placeholder: "50000"
      },
      {
        id: "payment_type",
        label: "طريقة السداد",
        help: "اختر الطريقة المناسبة.",
        type: "choice",
        required: true,
        options: [
          { value: "full", label: "دفعة واحدة" },
          { value: "installments", label: "دفعات مجدولة" },
          { value: "monthly", label: "مساهمة شهرية" }
        ]
      },
      {
        id: "installment_months",
        label: "عدد الأشهر المقترح",
        help: "يظهر عند اختيار الدفعات المجدولة.",
        type: "choice",
        required: true,
        showIf: (answers) => answers.payment_type === "installments",
        options: [
          { value: "3", label: "3 أشهر" },
          { value: "6", label: "6 أشهر" },
          { value: "12", label: "12 شهر" }
        ]
      },
      {
        id: "contribution_purpose",
        label: "مجال المساهمة",
        help: "كيف تفضل توجيه المساهمة؟",
        type: "choice",
        required: true,
        options: [
          { value: "general", label: "دعم عام" },
          { value: "educational", label: "برامج تعليم القرآن" },
          { value: "operations", label: "تشغيل الوقف" }
        ]
      },
      {
        id: "named_supporter",
        label: "إظهار الاسم ضمن المساهمين",
        help: "حسب رغبتك.",
        type: "choice",
        required: true,
        options: [
          { value: "yes", label: "نعم" },
          { value: "no", label: "لا" }
        ]
      }
    ]
  }
];

const FLOW_MAP = Object.fromEntries(FLOWS.map((flow) => [flow.id, flow]));

const state = {
  tab: "start",
  flowId: null,
  answers: {},
  stepIndex: 0,
  submitting: false
};

const tabStart = document.getElementById("tab-start");
const tabTrack = document.getElementById("tab-track");
const startView = document.getElementById("start-view");
const trackView = document.getElementById("track-view");
const alertBox = document.getElementById("system-alert");

const flowSection = document.getElementById("flow-section");
const flowList = document.getElementById("flow-list");

const previewStage = document.getElementById("preview-stage");
const previewRouteTitle = document.getElementById("preview-route-title");
const previewProgress = document.getElementById("preview-progress");
const previewProgressBar = document.getElementById("preview-progress-bar");
const previewCard = document.getElementById("preview-card");
const previewList = document.getElementById("preview-list");

const resultCard = document.getElementById("result-card");

const sheetBackdrop = document.getElementById("sheet-backdrop");
const sheetPanel = document.getElementById("sheet-panel");
const sheetClose = document.getElementById("sheet-close");
const sheetRouteTitle = document.getElementById("sheet-route-title");
const sheetStepMeta = document.getElementById("sheet-step-meta");
const sheetStepper = document.getElementById("sheet-stepper");
const sheetQuestionTitle = document.getElementById("sheet-question-title");
const sheetQuestionHelp = document.getElementById("sheet-question-help");
const sheetOptions = document.getElementById("sheet-options");
const sheetHint = document.getElementById("sheet-hint");
const sheetError = document.getElementById("sheet-error");
const sheetBack = document.getElementById("sheet-back");
const sheetNext = document.getElementById("sheet-next");
const sheetSubmit = document.getElementById("sheet-submit");

const trackForm = document.getElementById("track-form");
const trackResult = document.getElementById("track-result");

let supabaseClient = null;

boot();

async function boot() {
  bindEvents();
  renderFlowList();
  setTab("start");

  const config = await resolveAppConfig();
  if (config.supabaseUrl && config.supabaseAnonKey && window.supabase?.createClient) {
    supabaseClient = window.supabase.createClient(config.supabaseUrl, config.supabaseAnonKey);
  }

  if (!supabaseClient) {
    showAlert("تعذر تحميل إعدادات Supabase. تأكد من config.js أو متغيرات Vercel.", "warn");
  }
}

function bindEvents() {
  tabStart.addEventListener("click", () => setTab("start"));
  tabTrack.addEventListener("click", () => setTab("track"));

  flowList.addEventListener("click", (event) => {
    const card = event.target.closest("[data-flow-id]");
    if (!card) return;
    startFlow(card.dataset.flowId);
  });

  sheetBackdrop.addEventListener("click", closeJourney);
  sheetClose.addEventListener("click", closeJourney);
  sheetBack.addEventListener("click", goBack);
  sheetNext.addEventListener("click", goNext);
  sheetSubmit.addEventListener("click", submitRequest);

  sheetOptions.addEventListener("click", onChoiceClick);
  sheetOptions.addEventListener("input", onInputChange);

  trackForm.addEventListener("submit", onTrackSubmit);
}

function setTab(tab) {
  state.tab = tab;
  const isStart = tab === "start";

  tabStart.className = isStart
    ? "rounded-2xl border border-transparent bg-accent-600 px-4 py-3 text-sm font-extrabold text-white shadow-card"
    : "rounded-2xl border border-waqf-200 bg-white px-4 py-3 text-sm font-extrabold text-waqf-800 shadow-soft";

  tabTrack.className = !isStart
    ? "rounded-2xl border border-transparent bg-accent-600 px-4 py-3 text-sm font-extrabold text-white shadow-card"
    : "rounded-2xl border border-waqf-200 bg-white px-4 py-3 text-sm font-extrabold text-waqf-800 shadow-soft";

  startView.classList.toggle("hidden", !isStart);
  trackView.classList.toggle("hidden", isStart);

  if (!isStart) {
    closeJourney({ preservePreview: false });
  }
}

function renderFlowList() {
  flowList.innerHTML = FLOWS.map(
    (flow) => `
      <button
        type="button"
        data-flow-id="${flow.id}"
        class="group w-full rounded-2xl border border-waqf-200 bg-white/95 px-4 py-4 text-right shadow-soft transition duration-200 hover:-translate-y-0.5 hover:border-accent-500/45 hover:shadow-card"
      >
        <p class="text-sm font-extrabold text-waqf-900 transition group-hover:text-accent-700">${flow.title}</p>
        <p class="mt-1 text-xs font-semibold leading-6 text-waqf-700">${flow.description}</p>
      </button>
    `
  ).join("");
}

function startFlow(flowId) {
  if (!FLOW_MAP[flowId]) return;

  clearAlert();
  hideResult();

  state.flowId = flowId;
  state.answers = { flow_id: flowId };
  state.stepIndex = 0;

  flowSection.classList.add("hidden");
  previewStage.classList.remove("hidden");

  openSheet(true);
  renderPreview();
  renderStep();
}

function openSheet(isOpen) {
  sheetBackdrop.classList.toggle("hidden", !isOpen);
  sheetPanel.classList.toggle("hidden", !isOpen);
  document.body.classList.toggle("overflow-hidden", isOpen);
}

function closeJourney({ preservePreview = false } = {}) {
  openSheet(false);
  hideSheetError();

  state.stepIndex = 0;
  state.submitting = false;

  if (!preservePreview) {
    state.flowId = null;
    state.answers = {};
    previewStage.classList.add("hidden");
    flowSection.classList.remove("hidden");
  }
}

function getFlow() {
  return FLOW_MAP[state.flowId] || null;
}

function getSteps() {
  const flow = getFlow();
  if (!flow) return [];

  const allSteps = [...flow.questions, ...CONTACT_STEPS];
  const visible = allSteps.filter((step) => {
    if (!step.showIf) return true;
    return step.showIf(state.answers);
  });

  const visibleIds = new Set(visible.map((step) => step.id));
  Object.keys(state.answers).forEach((key) => {
    if (key === "flow_id") return;
    if (!visibleIds.has(key)) delete state.answers[key];
  });

  return visible;
}

function getCurrentStep() {
  const steps = getSteps();
  return steps[state.stepIndex] || null;
}

function renderStep() {
  hideSheetError();

  const flow = getFlow();
  if (!flow) return;

  const steps = getSteps();
  if (!steps.length) return;

  if (state.stepIndex > steps.length - 1) {
    state.stepIndex = steps.length - 1;
  }

  const step = steps[state.stepIndex];
  const isLast = state.stepIndex === steps.length - 1;

  sheetRouteTitle.textContent = flow.title;
  sheetStepMeta.textContent = `الخطوة ${state.stepIndex + 1} من ${steps.length}`;

  sheetQuestionTitle.textContent = step.label;
  sheetQuestionHelp.textContent = step.help || "";
  sheetOptions.innerHTML = renderControl(step);

  renderSheetStepper(steps.length, state.stepIndex);

  sheetBack.disabled = state.stepIndex === 0;
  sheetBack.classList.toggle("opacity-50", state.stepIndex === 0);

  if (state.submitting) {
    sheetSubmit.disabled = true;
    sheetSubmit.textContent = "جاري الإصدار...";
  } else {
    sheetSubmit.disabled = false;
    sheetSubmit.textContent = "إصدار الطلب";
  }

  if (isLast) {
    sheetNext.classList.add("hidden");
    sheetSubmit.classList.remove("hidden");
    sheetHint.classList.add("hidden");
  } else if (step.type === "choice") {
    sheetNext.classList.add("hidden");
    sheetSubmit.classList.add("hidden");
    sheetHint.classList.remove("hidden");
    sheetHint.textContent = "اضغط على الخيار للانتقال تلقائيًا.";
  } else {
    sheetNext.classList.remove("hidden");
    sheetSubmit.classList.add("hidden");
    sheetHint.classList.add("hidden");
  }
}

function renderSheetStepper(total, active) {
  sheetStepper.innerHTML = Array.from({ length: total }, (_, idx) => {
    const number = idx + 1;
    const isActive = idx === active;
    const done = idx < active;

    const badge = isActive
      ? "border-accent-600 bg-accent-600 text-white shadow-soft"
      : done
        ? "border-accent-200 bg-accent-100 text-accent-700"
        : "border-waqf-300 bg-white text-waqf-700";

    return `<span class="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-[11px] font-extrabold ${badge}">${number}</span>`;
  }).join("");
}

function renderControl(step) {
  const value = state.answers[step.id] ?? "";

  if (step.type === "choice") {
    return (step.options || [])
      .map((option) => {
        const selected = option.value === value;
        return `
          <button
            type="button"
            data-choice-id="${step.id}"
            data-choice-value="${option.value}"
            class="w-full rounded-2xl border px-3 py-3 text-right text-sm font-bold transition ${
              selected
                ? "border-accent-500 bg-accent-50 text-accent-700 shadow-soft"
                : "border-waqf-300 bg-white text-waqf-900 hover:border-accent-500/40 hover:bg-accent-50/60"
            }"
          >
            ${option.label}
          </button>
        `;
      })
      .join("");
  }

  if (step.type === "textarea") {
    return `
      <textarea
        name="${step.id}"
        rows="4"
        placeholder="${step.placeholder || ""}"
        class="w-full rounded-2xl border border-waqf-300 bg-white px-3 py-2 text-sm text-waqf-900 outline-none transition focus:border-accent-500/40 focus:ring-2 focus:ring-accent-500/25"
      >${escapeHtml(value)}</textarea>
    `;
  }

  return `
    <input
      name="${step.id}"
      type="${step.type || "text"}"
      value="${escapeHtml(value)}"
      placeholder="${step.placeholder || ""}"
      min="${step.min ?? ""}"
      max="${step.max ?? ""}"
      step="${step.step ?? ""}"
      class="w-full rounded-2xl border border-waqf-300 bg-white px-3 py-2 text-sm text-waqf-900 outline-none transition focus:border-accent-500/40 focus:ring-2 focus:ring-accent-500/25"
    />
  `;
}

function onChoiceClick(event) {
  const button = event.target.closest("[data-choice-id]");
  if (!button) return;

  const fieldId = button.dataset.choiceId;
  const value = button.dataset.choiceValue;
  if (!fieldId) return;

  state.answers[fieldId] = value;

  pulsePreview();
  renderPreview();

  const current = getCurrentStep();
  const isCurrentChoice = current && current.id === fieldId && current.type === "choice";
  if (!isCurrentChoice) {
    renderStep();
    return;
  }

  setTimeout(() => {
    goNext();
  }, 120);
}

function onInputChange(event) {
  const target = event.target;
  if (!target?.name) return;

  state.answers[target.name] = target.value.trim();
  pulsePreview();
  renderPreview();
}

function goBack() {
  hideSheetError();

  if (state.stepIndex === 0) {
    closeJourney();
    return;
  }

  state.stepIndex -= 1;
  renderStep();
}

function goNext() {
  hideSheetError();
  const step = getCurrentStep();
  if (!step) return;

  const validation = validateStep(step);
  if (!validation.ok) {
    showSheetError(validation.message);
    return;
  }

  state.stepIndex += 1;
  renderStep();
}

function validateStep(step) {
  const raw = state.answers[step.id];
  const value = typeof raw === "string" ? raw.trim() : raw;

  if (step.required && (value === undefined || value === null || value === "")) {
    return { ok: false, message: `الرجاء تعبئة: ${step.label}` };
  }

  if (value === undefined || value === null || value === "") {
    return { ok: true };
  }

  if (step.type === "number") {
    const num = Number(value);
    if (!Number.isFinite(num)) {
      return { ok: false, message: `${step.label}: القيمة غير صحيحة.` };
    }

    if (typeof step.min === "number" && num < step.min) {
      return { ok: false, message: `${step.label}: يجب ألا تقل عن ${step.min}.` };
    }

    if (typeof step.max === "number" && num > step.max) {
      return { ok: false, message: `${step.label}: يجب ألا تزيد عن ${step.max}.` };
    }
  }

  if (step.id === "phone" && !PHONE_REGEX.test(String(value))) {
    return { ok: false, message: "رقم التواصل غير صحيح. مثال: 05xxxxxxxx" };
  }

  if (step.type === "email" && !/^\S+@\S+\.\S+$/.test(String(value))) {
    return { ok: false, message: "البريد الإلكتروني غير صحيح." };
  }

  return { ok: true };
}

function validateAllSteps() {
  const steps = getSteps();

  for (let idx = 0; idx < steps.length; idx += 1) {
    const validation = validateStep(steps[idx]);
    if (!validation.ok) {
      return { ok: false, index: idx, message: validation.message };
    }
  }

  const flow = getFlow();
  if (!flow) return { ok: false, index: 0, message: "المسار غير محدد." };

  if (flow.id === "buy_over_million" && Number(state.answers.available_amount || 0) < 1000000) {
    return { ok: false, index: findStepIndex("available_amount"), message: "هذا المسار يتطلب مبلغ مليون ريال فأكثر." };
  }

  if (flow.id === "contribute_under_million" && Number(state.answers.contribution_amount || 0) >= 1000000) {
    return { ok: false, index: findStepIndex("contribution_amount"), message: "هذا المسار مخصص للمبالغ الأقل من مليون ريال." };
  }

  return { ok: true };
}

function findStepIndex(stepId) {
  return getSteps().findIndex((step) => step.id === stepId);
}

function renderPreview() {
  const flow = getFlow();
  if (!flow) {
    previewStage.classList.add("hidden");
    return;
  }

  previewStage.classList.remove("hidden");

  const steps = getSteps();
  const completed = steps.filter((step) => {
    const value = state.answers[step.id];
    return value !== undefined && value !== null && String(value).trim() !== "";
  }).length;

  const progressPercent = steps.length ? Math.round((completed / steps.length) * 100) : 0;

  previewRouteTitle.textContent = `بطاقة ${flow.title}`;
  previewProgress.textContent = `${completed}/${steps.length} مكتمل`;
  previewProgressBar.style.width = `${progressPercent}%`;

  previewList.innerHTML = steps
    .map((step) => {
      const rawValue = state.answers[step.id];
      const hasValue = rawValue !== undefined && rawValue !== null && String(rawValue).trim() !== "";
      const valueText = hasValue ? escapeHtml(formatStepValue(step, rawValue)) : "بانتظار";

      return `
        <div class="rounded-xl border px-3 py-2 text-xs ${
          hasValue ? "border-accent-200 bg-accent-50 text-waqf-900" : "border-waqf-200 bg-white text-waqf-500"
        }">
          <strong>${escapeHtml(step.label)}:</strong> ${valueText}
        </div>
      `;
    })
    .join("");
}

function pulsePreview() {
  previewCard.classList.remove("preview-bump");
  // restart animation
  // eslint-disable-next-line no-unused-expressions
  previewCard.offsetWidth;
  previewCard.classList.add("preview-bump");
}

function formatStepValue(step, value) {
  if (step.type === "choice") {
    const option = (step.options || []).find((item) => item.value === value);
    return option?.label || String(value);
  }

  return String(value);
}

async function submitRequest() {
  if (state.submitting) return;

  const flow = getFlow();
  if (!flow) return;

  const fullValidation = validateAllSteps();
  if (!fullValidation.ok) {
    state.stepIndex = Math.max(fullValidation.index, 0);
    renderStep();
    showSheetError(fullValidation.message);
    return;
  }

  if (!supabaseClient) {
    showAlert("لا يمكن الإرسال لأن إعدادات Supabase غير مكتملة.", "warn");
    return;
  }

  state.submitting = true;
  renderStep();

  try {
    const outcome = evaluateOutcome(flow.id, state.answers);
    const timeline = [
      {
        status: "تم استلام الطلب",
        note: "تم تسجيل الطلب إلكترونيًا بنجاح.",
        at: new Date().toISOString()
      },
      {
        status: outcome.status,
        note: outcome.timelineNote,
        at: new Date().toISOString()
      }
    ];

    const payload = {
      p_option_id: flow.id,
      p_option_title: flow.title,
      p_applicant_name: state.answers.full_name,
      p_phone: state.answers.phone,
      p_city: state.answers.city || "غير محدد",
      p_preferred_contact: state.answers.preferred_contact || "call",
      p_email: state.answers.email,
      p_answers: state.answers,
      p_route_result: outcome.routeResult,
      p_recommendation: outcome.recommendation,
      p_status: outcome.status,
      p_required_actions: outcome.requiredActions,
      p_timeline: timeline
    };

    const { data, error } = await supabaseClient.rpc("create_waqf_request", payload);
    if (error) throw error;

    const created = Array.isArray(data) ? data[0] : data;
    if (!created?.request_number) {
      throw new Error("تعذر إصدار رقم الطلب.");
    }

    const trackingToken = created.tracking_token || "";
    const trackingUrl = trackingToken
      ? `${window.location.origin}/track.html?token=${encodeURIComponent(String(trackingToken))}`
      : "";

    let emailStatus = "";
    if (state.answers.email && trackingUrl) {
      const sentResult = await sendTrackingEmail({
        email: state.answers.email,
        name: state.answers.full_name,
        requestNumber: created.request_number,
        trackingUrl,
        trackingToken
      });
      emailStatus = sentResult;
    }

    renderResult({
      requestNumber: created.request_number,
      createdAt: created.created_at,
      flowTitle: flow.title,
      outcome,
      trackingUrl,
      emailStatus
    });

    closeJourney({ preservePreview: false });
  } catch (error) {
    showSheetError(`تعذر إرسال الطلب: ${error.message || "خطأ غير متوقع"}`);
  } finally {
    state.submitting = false;
    renderStep();
  }
}

async function sendTrackingEmail({ email, name, requestNumber, trackingUrl, trackingToken }) {
  try {
    const response = await fetch("/api/public/send-tracking-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, name, requestNumber, trackingUrl, trackingToken })
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      return payload?.error ? `تعذر إرسال البريد: ${payload.error}` : "تعذر إرسال البريد الإلكتروني.";
    }

    if (payload?.sent) {
      return "تم إرسال رابط المتابعة إلى بريدك الإلكتروني.";
    }

    return payload?.message || "تم إنشاء رابط المتابعة لكن لم يتم إرسال البريد تلقائيًا.";
  } catch (_error) {
    return "تم إنشاء الطلب ولكن لم يتم إرسال البريد بسبب خطأ اتصال.";
  }
}

function renderResult({ requestNumber, createdAt, flowTitle, outcome, trackingUrl, emailStatus }) {
  resultCard.classList.remove("hidden");

  const trackingLinkBlock = trackingUrl
    ? `<div class="rounded-xl border border-accent-200 bg-white px-3 py-2 text-xs"><strong>رابط المتابعة:</strong> <a class="font-bold text-accent-700 underline" href="${trackingUrl}" target="_blank" rel="noopener">فتح صفحة المتابعة</a></div>`
    : "";

  const emailBlock = emailStatus
    ? `<div class="rounded-xl border border-accent-200 bg-white px-3 py-2 text-xs">${escapeHtml(emailStatus)}</div>`
    : "";

  resultCard.innerHTML = `
    <h3 class="text-base font-extrabold text-waqf-900">تم إصدار الطلب بنجاح</h3>
    <div class="mt-3 space-y-2 text-sm text-waqf-900">
      <div class="rounded-xl border border-accent-200 bg-white px-3 py-2"><strong>رقم الطلب:</strong> ${escapeHtml(requestNumber)}</div>
      <div class="rounded-xl border border-accent-200 bg-white px-3 py-2"><strong>المسار:</strong> ${escapeHtml(flowTitle)}</div>
      <div class="rounded-xl border border-accent-200 bg-white px-3 py-2"><strong>الحالة:</strong> ${escapeHtml(outcome.status)}</div>
      <div class="rounded-xl border border-accent-200 bg-white px-3 py-2"><strong>التوصية:</strong> ${escapeHtml(outcome.recommendation)}</div>
      <div class="rounded-xl border border-accent-200 bg-white px-3 py-2"><strong>تاريخ الإنشاء:</strong> ${formatDate(createdAt || new Date().toISOString())}</div>
      ${emailBlock}
      ${trackingLinkBlock}
    </div>

    <div class="mt-4 flex flex-wrap gap-2">
      <button id="result-new" type="button" class="rounded-2xl border border-waqf-300 bg-white px-4 py-2 text-sm font-bold text-waqf-800">بدء طلب جديد</button>
      <button id="result-track-tab" type="button" class="rounded-2xl bg-accent-600 px-4 py-2 text-sm font-bold text-white">متابعة برقم الطلب</button>
    </div>
  `;

  document.getElementById("result-new")?.addEventListener("click", () => {
    hideResult();
    flowSection.classList.remove("hidden");
    previewStage.classList.add("hidden");
  });

  document.getElementById("result-track-tab")?.addEventListener("click", () => {
    setTab("track");
    const input = document.getElementById("request-number");
    input.value = requestNumber;
    input.focus();
  });
}

function hideResult() {
  resultCard.classList.add("hidden");
  resultCard.innerHTML = "";
}

function evaluateOutcome(flowId, answers) {
  if (flowId === "buy_over_million") {
    const urgent = answers.readiness === "immediate";
    return {
      routeResult: "تأسيس وقف بشراء أصل",
      recommendation: urgent
        ? "تم تصنيف الطلب كأولوية عالية للتواصل السريع."
        : "سيتم جدولة جلسة دراسة أولية لاختيار الأصل المناسب.",
      status: urgent ? "قيد التواصل العاجل" : "قيد الدراسة الأولية",
      timelineNote: urgent ? "تصنيف الطلب كعاجل." : "إدراج الطلب ضمن الدراسة الأولية.",
      requiredActions: ["تجهيز ما يثبت الملاءة المالية", "تأكيد نوع الأصل والمدينة"]
    };
  }

  if (flowId === "have_asset_convert") {
    const ready = answers.has_legal_docs === "yes" && answers.has_disputes === "no";
    return {
      routeResult: "تحويل أصل قائم إلى وقف",
      recommendation: ready
        ? "الطلب جاهز مبدئيًا للعرض على اللجنة المختصة."
        : "يلزم استكمال المتطلبات النظامية قبل الاعتماد النهائي.",
      status: ready ? "مؤهل للعرض على اللجنة" : "بانتظار استكمال المتطلبات",
      timelineNote: ready ? "تم اعتبار الطلب جاهزًا مبدئيًا." : "الطلب يحتاج استكمالًا قبل المضي.",
      requiredActions: ["تقديم مستندات الملكية", "تقديم تقييم محدث للأصل"]
    };
  }

  if (flowId === "transfer_nazir") {
    const approved = answers.has_court_approval === "yes";
    return {
      routeResult: "نقل النظارة إلى الجمعية",
      recommendation: approved
        ? "سيتم البدء في إجراءات النقل الرسمية."
        : "يلزم استكمال الموافقة الرسمية/القضائية.",
      status: approved ? "قيد اعتماد نقل النظارة" : "بانتظار مستندات رسمية",
      timelineNote: approved ? "تحويل الطلب للفريق القانوني." : "المعاملة بانتظار مستندات رسمية.",
      requiredActions: ["إرفاق موافقات ذوي العلاقة", "إرفاق صك الوقف"]
    };
  }

  const installments = answers.payment_type === "installments";
  const monthly = answers.payment_type === "monthly";

  return {
    routeResult: "مساهمة في وقف قيد الإنشاء",
    recommendation: installments
      ? "سيتم إعداد جدول دفعات مناسب وإرساله للاعتماد."
      : monthly
        ? "سيتم تفعيل خطة مساهمة شهرية منتظمة."
        : "سيتم إصدار فاتورة سداد مباشرة.",
    status: installments
      ? "بانتظار جدولة الدفعات"
      : monthly
        ? "بانتظار تفعيل المساهمة الشهرية"
        : "بانتظار إصدار الفاتورة",
    timelineNote: installments
      ? "تحويل الطلب لمسار جدولة الدفعات."
      : monthly
        ? "تحويل الطلب لمسار التفعيل الشهري."
        : "تحويل الطلب لمسار الفاتورة المباشرة.",
    requiredActions: ["تأكيد مبلغ المساهمة", "اختيار قناة السداد"]
  };
}

async function onTrackSubmit(event) {
  event.preventDefault();
  clearAlert();

  const input = document.getElementById("request-number");
  const requestNumber = input.value.trim().toUpperCase();

  if (!requestNumber) {
    showAlert("أدخل رقم الطلب.", "warn");
    return;
  }

  if (!supabaseClient) {
    showAlert("لا يمكن متابعة الطلب لأن إعدادات Supabase غير مكتملة.", "warn");
    return;
  }

  const submitButton = trackForm.querySelector("button[type='submit']");
  submitButton.disabled = true;
  submitButton.textContent = "جاري البحث...";

  try {
    const { data, error } = await supabaseClient.rpc("track_waqf_request", {
      p_request_number: requestNumber
    });
    if (error) throw error;

    const request = Array.isArray(data) ? data[0] : data;
    if (!request) {
      trackResult.innerHTML =
        '<p class="rounded-2xl border border-rose-200 bg-rose-50/80 px-3 py-2 text-sm font-semibold text-rose-700">لا يوجد طلب بهذا الرقم.</p>';
      return;
    }

    const timeline = Array.isArray(request.timeline) ? request.timeline : [];
    const requiredActions = Array.isArray(request.required_actions) ? request.required_actions : [];

    trackResult.innerHTML = `
      <article class="rounded-2xl border border-waqf-200 bg-white/95 p-4 shadow-soft">
        <h3 class="text-sm font-extrabold text-waqf-900">رقم الطلب: ${escapeHtml(request.request_number)}</h3>
        <div class="mt-2 space-y-2 text-sm text-waqf-800">
          <p><strong>المسار:</strong> ${escapeHtml(request.option_title)}</p>
          <p><strong>الحالة:</strong> ${escapeHtml(request.status)}</p>
          <p><strong>النتيجة:</strong> ${escapeHtml(request.route_result)}</p>
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
                        `<div class="rounded-xl border border-accent-200 bg-accent-50 px-3 py-2 text-xs text-waqf-900">${escapeHtml(action)}</div>`
                    )
                    .join("")
                : '<div class="rounded-xl border border-waqf-200 bg-waqf-50 px-3 py-2 text-xs text-waqf-700">لا توجد متطلبات إضافية.</div>'
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
                        `<div class="rounded-xl border border-waqf-200 bg-white px-3 py-2 text-xs text-waqf-900"><strong>${escapeHtml(
                          item.status || "تحديث"
                        )}</strong><br>${escapeHtml(item.note || "-")}<br><span class="text-waqf-700">${formatDate(
                          item.at || request.updated_at || request.created_at
                        )}</span></div>`
                    )
                    .join("")
                : '<div class="rounded-xl border border-waqf-200 bg-waqf-50 px-3 py-2 text-xs text-waqf-700">لا يوجد سجل حالة مفصل.</div>'
            }
          </div>
        </div>
      </article>
    `;
  } catch (error) {
    showAlert(`تعذر متابعة الطلب: ${error.message || "خطأ غير متوقع"}`, "error");
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "بحث";
  }
}

function showSheetError(message) {
  sheetError.classList.remove("hidden");
  sheetError.textContent = message;
}

function hideSheetError() {
  sheetError.classList.add("hidden");
  sheetError.textContent = "";
}

function showAlert(message, type = "warn") {
  alertBox.classList.remove(
    "hidden",
    "border-accent-200",
    "bg-accent-50",
    "text-accent-700",
    "border-rose-300",
    "bg-rose-50",
    "text-rose-800"
  );

  if (type === "error") {
    alertBox.classList.add("border-rose-300", "bg-rose-50", "text-rose-800");
  } else {
    alertBox.classList.add("border-accent-200", "bg-accent-50", "text-accent-700");
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

async function resolveAppConfig() {
  const fromWindow = normalizeConfig(window.APP_CONFIG || {});
  if (fromWindow.supabaseUrl && fromWindow.supabaseAnonKey) {
    return fromWindow;
  }

  try {
    const response = await fetch("/api/config", {
      method: "GET",
      headers: { Accept: "application/json" }
    });

    if (!response.ok) {
      return fromWindow;
    }

    const payload = await response.json();
    const fromApi = normalizeConfig(payload || {});
    if (fromApi.supabaseUrl && fromApi.supabaseAnonKey) {
      return fromApi;
    }
  } catch (_error) {
    // fallback to local config
  }

  return fromWindow;
}

function normalizeConfig(config) {
  return {
    supabaseUrl: typeof config.supabaseUrl === "string" ? config.supabaseUrl.trim() : "",
    supabaseAnonKey: typeof config.supabaseAnonKey === "string" ? config.supabaseAnonKey.trim() : ""
  };
}
