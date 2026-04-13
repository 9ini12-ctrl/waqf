const PHONE_REGEX = /^(\+966|0)?5\d{8}$/;

const CONTACT_QUESTIONS = [
  {
    id: "full_name",
    label: "الاسم الكامل",
    help: "الاسم الذي سيظهر على الطلب الرسمي.",
    type: "text",
    required: true,
    placeholder: "الاسم الرباعي"
  },
  {
    id: "phone",
    label: "رقم الجوال",
    help: "يستخدم للمتابعة وإشعارات الطلب.",
    type: "tel",
    required: true,
    placeholder: "05xxxxxxxx"
  },
  {
    id: "city",
    label: "المدينة",
    help: "مدينة مقدم الطلب.",
    type: "text",
    required: true,
    placeholder: "الرياض"
  },
  {
    id: "preferred_contact",
    label: "وسيلة التواصل المفضلة",
    help: "اختر الوسيلة الأساسية للتواصل.",
    type: "choice",
    required: true,
    options: [
      { value: "call", label: "اتصال هاتفي" },
      { value: "whatsapp", label: "واتساب" },
      { value: "email", label: "بريد إلكتروني" }
    ]
  },
  {
    id: "email",
    label: "البريد الإلكتروني",
    help: "يظهر فقط عند اختيار التواصل بالبريد.",
    type: "email",
    required: true,
    showIf: (answers) => answers.preferred_contact === "email",
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
        label: "قيمة المبلغ المتاح (ريال)",
        help: "هذا المسار يشترط مبلغ مليون ريال فأكثر.",
        type: "number",
        required: true,
        min: 1000000,
        step: 1000,
        placeholder: "1000000"
      },
      {
        id: "preferred_asset_type",
        label: "نوع الأصل الوقفي المفضل",
        help: "اختر التوجه الأقرب لك.",
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
        label: "المدينة المستهدفة للاستثمار",
        help: "يمكنك تعديلها لاحقًا مع الفريق.",
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
        label: "هل ترغب بشراكة مع واقفين آخرين؟",
        help: "يساعدنا في اقتراح النموذج الأنسب.",
        type: "choice",
        required: true,
        options: [
          { value: "yes", label: "نعم" },
          { value: "no", label: "لا" }
        ]
      },
      {
        id: "notes",
        label: "ملاحظات إضافية",
        help: "اختياري.",
        type: "textarea",
        required: false,
        placeholder: "أي اشتراطات أو تفاصيل إضافية"
      }
    ]
  },
  {
    id: "have_asset_convert",
    title: "لدي أصل وأرغب بتحويله إلى وقف",
    description: "تقييم الأصل واستكمال إجراءات التحويل.",
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
        label: "القيمة التقديرية للأصل (ريال)",
        help: "رقم تقريبي مبدئي.",
        type: "number",
        required: true,
        min: 1,
        step: 1000,
        placeholder: "5000000"
      },
      {
        id: "asset_city",
        label: "مدينة الأصل",
        help: "مكان الأصل الحالي.",
        type: "text",
        required: true,
        placeholder: "المدينة"
      },
      {
        id: "has_legal_docs",
        label: "هل وثائق الملكية مكتملة؟",
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
        label: "هل توجد نزاعات أو التزامات على الأصل؟",
        help: "يجب الإفصاح حتى تُبنى خطة دقيقة.",
        type: "choice",
        required: true,
        options: [
          { value: "no", label: "لا" },
          { value: "yes", label: "نعم" }
        ]
      },
      {
        id: "notes",
        label: "ملاحظات إضافية",
        help: "اختياري.",
        type: "textarea",
        required: false,
        placeholder: "تفاصيل إضافية عن الأصل"
      }
    ]
  },
  {
    id: "transfer_nazir",
    title: "لدي وقف وأرغب بنقل النظارة للجمعية",
    description: "نقل النظارة وفق المتطلبات الشرعية والنظامية.",
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
        help: "كما هو في المستند الرسمي.",
        type: "text",
        required: true,
        placeholder: "رقم الصك"
      },
      {
        id: "current_nazir_name",
        label: "اسم الناظر الحالي",
        help: "الاسم المعتمد حاليًا.",
        type: "text",
        required: true,
        placeholder: "اسم الناظر"
      },
      {
        id: "has_family_approval",
        label: "هل توجد موافقة من ذوي العلاقة؟",
        help: "مطلوبة في كثير من الحالات.",
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
        help: "تسهل مباشرة الإجراء القانوني.",
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
        help: "شرح موجز للسبب.",
        type: "textarea",
        required: true,
        placeholder: "اكتب سبب نقل النظارة"
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
        help: "هذا المسار يشترط أقل من مليون ريال.",
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
        help: "اختر الصيغة المناسبة لك.",
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
        label: "مجال المساهمة المفضل",
        help: "كيف تفضل توجيه مساهمتك؟",
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
        label: "هل ترغب بإظهار اسمك ضمن المساهمين؟",
        help: "اختياري حسب رغبتك.",
        type: "choice",
        required: true,
        options: [
          { value: "yes", label: "نعم" },
          { value: "no", label: "لا" }
        ]
      },
      {
        id: "notes",
        label: "ملاحظات إضافية",
        help: "اختياري.",
        type: "textarea",
        required: false,
        placeholder: "أي تفاصيل إضافية"
      }
    ]
  }
];

const FLOW_MAP = Object.fromEntries(FLOWS.map((flow) => [flow.id, flow]));

const state = {
  tab: "start",
  selectedFlowId: null,
  answers: {},
  stepIndex: 0,
  submitting: false
};

const tabStart = document.getElementById("tab-start");
const tabTrack = document.getElementById("tab-track");
const systemAlert = document.getElementById("system-alert");
const startView = document.getElementById("start-view");
const trackView = document.getElementById("track-view");

const flowSection = document.getElementById("flow-section");
const flowList = document.getElementById("flow-list");
const wizardSection = document.getElementById("wizard-section");
const wizardTitle = document.getElementById("wizard-title");
const stepsMeta = document.getElementById("steps-meta");
const stepper = document.getElementById("stepper");
const questionLabel = document.getElementById("question-label");
const questionHelp = document.getElementById("question-help");
const questionInput = document.getElementById("question-input");
const questionHint = document.getElementById("question-hint");
const questionError = document.getElementById("question-error");
const btnCancel = document.getElementById("btn-cancel");
const btnBack = document.getElementById("btn-back");
const btnNext = document.getElementById("btn-next");

const draftSection = document.getElementById("draft-section");
const draftTitle = document.getElementById("draft-title");
const draftList = document.getElementById("draft-list");
const btnDraftBack = document.getElementById("btn-draft-back");
const btnSubmit = document.getElementById("btn-submit");

const resultCard = document.getElementById("result-card");

const trackForm = document.getElementById("track-form");
const trackResult = document.getElementById("track-result");

let supabaseClient = null;

boot();

async function boot() {
  renderFlowList();
  bindEvents();
  setTab("start");

  const config = await resolveAppConfig();
  if (config.supabaseUrl && config.supabaseAnonKey && window.supabase?.createClient) {
    supabaseClient = window.supabase.createClient(config.supabaseUrl, config.supabaseAnonKey);
  }

  if (!supabaseClient) {
    showSystemAlert(
      "تعذّر تحميل إعدادات Supabase. في Vercel أضف SUPABASE_URL وSUPABASE_ANON_KEY.",
      "warn"
    );
  }
}

function bindEvents() {
  tabStart.addEventListener("click", () => setTab("start"));
  tabTrack.addEventListener("click", () => setTab("track"));

  flowList.addEventListener("click", (event) => {
    const button = event.target.closest("[data-flow-id]");
    if (!button) return;
    startFlow(button.dataset.flowId);
  });

  btnCancel.addEventListener("click", resetToFlowSelection);
  btnBack.addEventListener("click", goBack);
  btnNext.addEventListener("click", goNext);

  questionInput.addEventListener("click", onChoiceClick);
  questionInput.addEventListener("input", onInputChange);

  btnDraftBack.addEventListener("click", () => {
    const questions = getVisibleQuestions();
    state.stepIndex = Math.max(questions.length - 1, 0);
    draftSection.classList.add("hidden");
    wizardSection.classList.remove("hidden");
    renderQuestion();
  });

  btnSubmit.addEventListener("click", submitRequest);

  trackForm.addEventListener("submit", handleTrack);
}

function setTab(tab) {
  state.tab = tab;
  const isStart = tab === "start";

  tabStart.className = isStart
    ? "rounded-xl border border-waqf-300 bg-white px-4 py-3 text-sm font-bold text-waqf-800"
    : "rounded-xl border border-transparent bg-waqf-100 px-4 py-3 text-sm font-bold text-waqf-700";

  tabTrack.className = !isStart
    ? "rounded-xl border border-waqf-300 bg-white px-4 py-3 text-sm font-bold text-waqf-800"
    : "rounded-xl border border-transparent bg-waqf-100 px-4 py-3 text-sm font-bold text-waqf-700";

  startView.classList.toggle("hidden", !isStart);
  trackView.classList.toggle("hidden", isStart);
}

function renderFlowList() {
  flowList.innerHTML = FLOWS.map(
    (flow) => `
      <button
        type="button"
        data-flow-id="${flow.id}"
        class="w-full rounded-xl border border-waqf-200 bg-waqf-50 px-4 py-4 text-right transition hover:border-waqf-300"
      >
        <p class="text-sm font-extrabold text-waqf-800">${flow.title}</p>
        <p class="mt-1 text-xs text-waqf-700">${flow.description}</p>
      </button>
    `
  ).join("");
}

function startFlow(flowId) {
  if (!FLOW_MAP[flowId]) return;

  clearSystemAlert();
  hideResult();

  state.selectedFlowId = flowId;
  state.answers = { flow_id: flowId };
  state.stepIndex = 0;

  flowSection.classList.add("hidden");
  draftSection.classList.add("hidden");
  wizardSection.classList.remove("hidden");

  renderQuestion();
}

function resetToFlowSelection() {
  state.selectedFlowId = null;
  state.answers = {};
  state.stepIndex = 0;

  clearQuestionError();
  hideResult();

  wizardSection.classList.add("hidden");
  draftSection.classList.add("hidden");
  flowSection.classList.remove("hidden");
}

function hideResult() {
  resultCard.classList.add("hidden");
  resultCard.innerHTML = "";
}

function getSelectedFlow() {
  return FLOW_MAP[state.selectedFlowId] || null;
}

function getVisibleQuestions() {
  const flow = getSelectedFlow();
  if (!flow) return [];

  const allQuestions = [...flow.questions, ...CONTACT_QUESTIONS];
  const visible = allQuestions.filter((question) => {
    if (!question.showIf) return true;
    return question.showIf(state.answers);
  });

  const visibleIds = new Set(visible.map((q) => q.id));
  Object.keys(state.answers).forEach((key) => {
    if (key === "flow_id") return;
    if (!visibleIds.has(key)) {
      delete state.answers[key];
    }
  });

  return visible;
}

function renderQuestion() {
  clearQuestionError();

  const flow = getSelectedFlow();
  if (!flow) return;

  const questions = getVisibleQuestions();
  if (state.stepIndex >= questions.length) {
    showDraft();
    return;
  }

  const question = questions[state.stepIndex];
  const remaining = questions.length - (state.stepIndex + 1);

  wizardTitle.textContent = flow.title;
  stepsMeta.textContent = `الخطوة ${state.stepIndex + 1} من ${questions.length} - المتبقي ${remaining}`;

  renderStepper(questions.length, state.stepIndex);

  questionLabel.textContent = question.label;
  questionHelp.textContent = question.help || "";

  questionInput.innerHTML = renderQuestionControl(question);

  btnBack.disabled = state.stepIndex === 0;
  btnBack.classList.toggle("opacity-50", state.stepIndex === 0);

  if (question.type === "choice") {
    btnNext.classList.add("hidden");
    questionHint.classList.remove("hidden");
    questionHint.textContent = "اضغط على الخيار للانتقال إلى السؤال التالي.";
  } else {
    btnNext.classList.remove("hidden");
    questionHint.classList.add("hidden");
  }
}

function renderStepper(total, active) {
  stepper.innerHTML = Array.from({ length: total + 1 }, (_, idx) => {
    const stepNumber = idx + 1;
    const isDraft = idx === total;
    const isActive = idx === active;
    const isDone = idx < active;

    const badgeClass = isActive
      ? "border-waqf-700 bg-waqf-700 text-white"
      : isDone
        ? "border-waqf-300 bg-waqf-200 text-waqf-800"
        : "border-waqf-200 bg-white text-waqf-600";

    return `
      <div class="flex min-w-fit items-center gap-2">
        <span class="inline-flex h-8 w-8 items-center justify-center rounded-full border text-xs font-extrabold ${badgeClass}">${stepNumber}</span>
        <span class="text-xs font-semibold text-waqf-700">${isDraft ? "مسودة" : "سؤال"}</span>
        ${idx < total ? '<span class="mx-1 h-px w-5 bg-waqf-200"></span>' : ""}
      </div>
    `;
  }).join("");
}

function renderQuestionControl(question) {
  const value = state.answers[question.id] ?? "";

  if (question.type === "choice") {
    return (question.options || [])
      .map((option) => {
        const selected = value === option.value;
        return `
          <button
            type="button"
            data-choice-field="${question.id}"
            data-choice-value="${option.value}"
            class="w-full rounded-lg border px-3 py-3 text-right text-sm font-bold transition ${
              selected ? "border-waqf-500 bg-waqf-100 text-waqf-900" : "border-waqf-200 bg-white text-waqf-800"
            }"
          >
            ${option.label}
          </button>
        `;
      })
      .join("");
  }

  if (question.type === "textarea") {
    return `
      <textarea
        name="${question.id}"
        rows="4"
        placeholder="${question.placeholder || ""}"
        class="w-full rounded-lg border border-waqf-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-waqf-200"
      >${escapeHtml(value)}</textarea>
    `;
  }

  return `
    <input
      name="${question.id}"
      type="${question.type || "text"}"
      value="${escapeHtml(value)}"
      placeholder="${question.placeholder || ""}"
      min="${question.min ?? ""}"
      max="${question.max ?? ""}"
      step="${question.step ?? ""}"
      class="w-full rounded-lg border border-waqf-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-waqf-200"
    />
  `;
}

function onChoiceClick(event) {
  const button = event.target.closest("[data-choice-field]");
  if (!button) return;

  const field = button.dataset.choiceField;
  const value = button.dataset.choiceValue;
  if (!field) return;

  state.answers[field] = value;

  const current = getCurrentQuestion();
  if (!current || current.type !== "choice") return;

  setTimeout(() => {
    goNext();
  }, 120);
}

function onInputChange(event) {
  const target = event.target;
  if (!target?.name) return;

  state.answers[target.name] = target.value.trim();
}

function getCurrentQuestion() {
  const questions = getVisibleQuestions();
  return questions[state.stepIndex] || null;
}

function goBack() {
  clearQuestionError();

  if (state.stepIndex === 0) {
    resetToFlowSelection();
    return;
  }

  state.stepIndex -= 1;
  renderQuestion();
}

function goNext() {
  clearQuestionError();

  const current = getCurrentQuestion();
  if (!current) return;

  const validation = validateQuestion(current);
  if (!validation.ok) {
    showQuestionError(validation.message);
    return;
  }

  state.stepIndex += 1;
  renderQuestion();
}

function validateQuestion(question) {
  const raw = state.answers[question.id];
  const value = typeof raw === "string" ? raw.trim() : raw;

  if (question.required && (value === undefined || value === null || value === "")) {
    return { ok: false, message: `الرجاء تعبئة: ${question.label}` };
  }

  if (!value) {
    return { ok: true };
  }

  if (question.type === "number") {
    const num = Number(value);
    if (!Number.isFinite(num)) {
      return { ok: false, message: `${question.label}: قيمة رقمية غير صحيحة.` };
    }

    if (typeof question.min === "number" && num < question.min) {
      return { ok: false, message: `${question.label}: يجب ألا تقل عن ${question.min}.` };
    }

    if (typeof question.max === "number" && num > question.max) {
      return { ok: false, message: `${question.label}: يجب ألا تزيد عن ${question.max}.` };
    }
  }

  if (question.id === "phone" && !PHONE_REGEX.test(String(value))) {
    return { ok: false, message: "رقم الجوال غير صحيح. مثال: 05xxxxxxxx" };
  }

  if (question.type === "email" && !/^\S+@\S+\.\S+$/.test(String(value))) {
    return { ok: false, message: "صيغة البريد الإلكتروني غير صحيحة." };
  }

  return { ok: true };
}

function showQuestionError(message) {
  questionError.classList.remove("hidden");
  questionError.textContent = message;
}

function clearQuestionError() {
  questionError.classList.add("hidden");
  questionError.textContent = "";
}

function showDraft() {
  const flow = getSelectedFlow();
  if (!flow) return;

  const questions = getVisibleQuestions();
  const invalidQuestion = questions.find((q) => !validateQuestion(q).ok);
  if (invalidQuestion) {
    state.stepIndex = Math.max(questions.findIndex((q) => q.id === invalidQuestion.id), 0);
    renderQuestion();
    showQuestionError(`الرجاء إكمال: ${invalidQuestion.label}`);
    return;
  }

  wizardSection.classList.add("hidden");
  draftSection.classList.remove("hidden");

  const name = state.answers.full_name || "مقدم الطلب";
  draftTitle.textContent = `مسودة الطلب باسم: ${name}`;

  draftList.innerHTML = `
    <div class="rounded-lg border border-waqf-200 bg-waqf-50 px-3 py-2 text-sm"><strong>المسار:</strong> ${flow.title}</div>
    ${questions
      .map((q) => {
        const value = state.answers[q.id];
        if (value === undefined || value === null || String(value).trim() === "") return "";
        return `<div class="rounded-lg border border-waqf-200 bg-white px-3 py-2 text-sm"><strong>${q.label}:</strong> ${escapeHtml(
          displayValue(q, value)
        )}</div>`;
      })
      .join("")}
  `;
}

async function submitRequest() {
  if (state.submitting) return;

  const flow = getSelectedFlow();
  if (!flow) return;

  if (!supabaseClient) {
    showSystemAlert("لا يمكن الإرسال لأن إعدادات Supabase غير مكتملة.", "warn");
    return;
  }

  clearSystemAlert();
  state.submitting = true;
  btnSubmit.disabled = true;
  btnSubmit.textContent = "جاري إصدار الطلب...";

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
      p_city: state.answers.city,
      p_preferred_contact: state.answers.preferred_contact,
      p_email: state.answers.email || null,
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

    draftSection.classList.add("hidden");
    renderResult(created.request_number, created.created_at, flow.title, outcome);
  } catch (error) {
    showSystemAlert(`تعذر إرسال الطلب: ${error.message || "خطأ غير متوقع"}`, "error");
  } finally {
    state.submitting = false;
    btnSubmit.disabled = false;
    btnSubmit.textContent = "إصدار رقم الطلب";
  }
}

function renderResult(requestNumber, createdAt, flowTitle, outcome) {
  const name = state.answers.full_name || "-";

  resultCard.classList.remove("hidden");
  resultCard.innerHTML = `
    <h3 class="text-base font-extrabold text-emerald-900">تم إصدار رقم الطلب بنجاح</h3>
    <div class="mt-3 space-y-2 text-sm text-emerald-900">
      <div class="rounded-lg border border-emerald-200 bg-white px-3 py-2"><strong>رقم الطلب:</strong> ${requestNumber}</div>
      <div class="rounded-lg border border-emerald-200 bg-white px-3 py-2"><strong>اسم مقدم الطلب:</strong> ${escapeHtml(name)}</div>
      <div class="rounded-lg border border-emerald-200 bg-white px-3 py-2"><strong>المسار:</strong> ${flowTitle}</div>
      <div class="rounded-lg border border-emerald-200 bg-white px-3 py-2"><strong>الحالة:</strong> ${outcome.status}</div>
      <div class="rounded-lg border border-emerald-200 bg-white px-3 py-2"><strong>التوصية:</strong> ${outcome.recommendation}</div>
      <div class="rounded-lg border border-emerald-200 bg-white px-3 py-2"><strong>تاريخ الإنشاء:</strong> ${formatDate(
        createdAt || new Date().toISOString()
      )}</div>
    </div>
    <div class="mt-4 flex flex-wrap gap-2">
      <button id="result-track" type="button" class="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-bold text-white">متابعة الطلب</button>
      <button id="result-new" type="button" class="rounded-lg border border-emerald-300 px-4 py-2 text-sm font-bold text-emerald-800">طلب جديد</button>
    </div>
  `;

  document.getElementById("result-track")?.addEventListener("click", () => {
    setTab("track");
    document.getElementById("request-number").value = requestNumber;
  });

  document.getElementById("result-new")?.addEventListener("click", () => {
    resetToFlowSelection();
  });

  state.selectedFlowId = null;
  state.answers = {};
  state.stepIndex = 0;
  flowSection.classList.remove("hidden");
}

function evaluateOutcome(flowId, answers) {
  if (flowId === "buy_over_million") {
    const immediate = answers.readiness === "immediate";
    return {
      routeResult: "تأسيس وقف بشراء أصل",
      recommendation: immediate
        ? "تم تصنيف الطلب كأولوية عالية للتواصل العاجل."
        : "سيتم ترتيب جلسة دراسة أولية لاختيار الأصل المناسب.",
      status: immediate ? "قيد التواصل العاجل" : "قيد الدراسة الأولية",
      timelineNote: immediate
        ? "أولوية عاجلة بناءً على جاهزية البدء."
        : "إدراج الطلب ضمن مسار الدراسة الأولية.",
      requiredActions: ["تجهيز ما يثبت الملاءة المالية", "تأكيد نوع الأصل والمدينة"]
    };
  }

  if (flowId === "have_asset_convert") {
    const ready = answers.has_legal_docs === "yes" && answers.has_disputes === "no";
    return {
      routeResult: "تحويل أصل قائم إلى وقف",
      recommendation: ready
        ? "الطلب جاهز مبدئيًا للعرض على اللجنة القانونية والشرعية."
        : "يلزم استكمال المتطلبات النظامية قبل الإقرار النهائي.",
      status: ready ? "مؤهل للعرض على اللجنة" : "بانتظار استكمال المتطلبات",
      timelineNote: ready ? "تم تصنيف الطلب كجاهز مبدئيًا." : "تم رصد نواقص أو التزامات.",
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
      timelineNote: approved ? "تحويل الطلب للفريق القانوني." : "المعاملة بانتظار المستندات الرسمية.",
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
    requiredActions: ["تأكيد مبلغ المساهمة", "اختيار قناة السداد المناسبة"]
  };
}

async function handleTrack(event) {
  event.preventDefault();
  clearSystemAlert();

  const input = document.getElementById("request-number");
  const requestNumber = input.value.trim().toUpperCase();

  if (!requestNumber) {
    showSystemAlert("أدخل رقم الطلب.", "warn");
    return;
  }

  if (!supabaseClient) {
    showSystemAlert("لا يمكن متابعة الطلب لأن إعدادات Supabase غير مكتملة.", "warn");
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
        '<p class="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700">لا يوجد طلب بهذا الرقم.</p>';
      return;
    }

    const timeline = Array.isArray(request.timeline) ? request.timeline : [];
    const requiredActions = Array.isArray(request.required_actions) ? request.required_actions : [];

    trackResult.innerHTML = `
      <article class="rounded-xl border border-waqf-200 bg-waqf-50 p-4">
        <h3 class="text-sm font-extrabold text-waqf-900">رقم الطلب: ${request.request_number}</h3>
        <div class="mt-2 space-y-2 text-sm text-waqf-800">
          <div><strong>المسار:</strong> ${request.option_title}</div>
          <div><strong>الحالة:</strong> ${request.status}</div>
          <div><strong>النتيجة:</strong> ${request.route_result}</div>
          <div><strong>آخر تحديث:</strong> ${formatDate(request.updated_at || request.created_at)}</div>
        </div>

        <div class="mt-3">
          <p class="text-xs font-extrabold text-waqf-700">المطلوب حاليًا</p>
          <div class="mt-2 space-y-2">
            ${
              requiredActions.length
                ? requiredActions
                    .map(
                      (action) =>
                        `<div class="rounded-lg border border-waqf-200 bg-white px-3 py-2 text-xs text-waqf-800">${action}</div>`
                    )
                    .join("")
                : '<div class="rounded-lg border border-waqf-200 bg-white px-3 py-2 text-xs text-waqf-700">لا توجد متطلبات إضافية حاليًا.</div>'
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
                        `<div class="rounded-lg border border-waqf-200 bg-white px-3 py-2 text-xs text-waqf-800"><strong>${
                          item.status || "تحديث"
                        }</strong><br>${item.note || ""}<br><span class="text-waqf-600">${formatDate(
                          item.at || request.updated_at || request.created_at
                        )}</span></div>`
                    )
                    .join("")
                : '<div class="rounded-lg border border-waqf-200 bg-white px-3 py-2 text-xs text-waqf-700">لا يوجد سجل حالة مفصل.</div>'
            }
          </div>
        </div>
      </article>
    `;
  } catch (error) {
    showSystemAlert(`تعذر متابعة الطلب: ${error.message || "خطأ غير متوقع"}`, "error");
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "بحث";
  }
}

function displayValue(question, value) {
  if (question.type === "choice") {
    const option = (question.options || []).find((item) => item.value === value);
    return option?.label || value;
  }

  return String(value);
}

function showSystemAlert(message, type = "warn") {
  systemAlert.classList.remove(
    "hidden",
    "border-amber-300",
    "bg-amber-50",
    "text-amber-900",
    "border-rose-300",
    "bg-rose-50",
    "text-rose-800"
  );

  if (type === "error") {
    systemAlert.classList.add("border-rose-300", "bg-rose-50", "text-rose-800");
  } else {
    systemAlert.classList.add("border-amber-300", "bg-amber-50", "text-amber-900");
  }

  systemAlert.textContent = message;
}

function clearSystemAlert() {
  systemAlert.classList.add("hidden");
  systemAlert.textContent = "";
}

function formatDate(dateValue) {
  if (!dateValue) return "-";

  const date = new Date(dateValue);
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
