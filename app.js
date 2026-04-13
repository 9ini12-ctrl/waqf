const BASE_FIELDS = [
  { name: "full_name", label: "الاسم الكامل", type: "text", required: true },
  { name: "phone", label: "رقم الجوال", type: "tel", required: true, placeholder: "05xxxxxxxx" },
  { name: "city", label: "المدينة", type: "text", required: true },
  {
    name: "preferred_contact",
    label: "وسيلة التواصل المفضلة",
    type: "select",
    required: true,
    options: [
      { value: "call", label: "اتصال" },
      { value: "whatsapp", label: "واتساب" },
      { value: "email", label: "بريد إلكتروني" }
    ]
  },
  { name: "email", label: "البريد الإلكتروني (اختياري)", type: "email", required: false }
];

const FLOWS = [
  {
    id: "buy_over_million",
    title: "لدي مبلغ يزيد عن مليون ريال",
    description: "شراء أصل وتحويله إلى وقف جديد بإشراف الجمعية.",
    resultTitle: "مسار تأسيس وقف بشراء أصل",
    fields: [
      {
        name: "available_amount",
        label: "المبلغ المتاح (ريال)",
        type: "number",
        required: true,
        min: 1000000,
        step: 1000
      },
      {
        name: "preferred_asset_type",
        label: "نوع الأصل المفضل",
        type: "select",
        required: true,
        options: [
          { value: "commercial", label: "عقار تجاري" },
          { value: "residential", label: "عقار سكني" },
          { value: "land", label: "أرض استثمارية" },
          { value: "other", label: "أصل آخر" }
        ]
      },
      { name: "target_city", label: "المدينة المستهدفة للاستثمار", type: "text", required: true },
      {
        name: "readiness",
        label: "موعد البدء المتوقع",
        type: "select",
        required: true,
        options: [
          { value: "immediate", label: "خلال 3 أشهر" },
          { value: "mid", label: "خلال 3 - 6 أشهر" },
          { value: "later", label: "أكثر من 6 أشهر" }
        ]
      },
      {
        name: "wants_partnership",
        label: "هل ترغب بشراكة مع واقفين آخرين؟",
        type: "select",
        required: true,
        options: [
          { value: "no", label: "لا" },
          { value: "yes", label: "نعم" }
        ]
      },
      { name: "notes", label: "ملاحظات إضافية", type: "textarea", required: false }
    ]
  },
  {
    id: "have_asset_convert",
    title: "لدي أصل وأرغب بتحويله إلى وقف",
    description: "تقييم الأصل واستكمال إجراءات التحويل الوقفي.",
    resultTitle: "مسار تحويل أصل قائم إلى وقف",
    fields: [
      {
        name: "asset_type",
        label: "نوع الأصل",
        type: "select",
        required: true,
        options: [
          { value: "building", label: "مبنى" },
          { value: "land", label: "أرض" },
          { value: "portfolio", label: "محفظة استثمارية" },
          { value: "other", label: "أصل آخر" }
        ]
      },
      {
        name: "asset_estimated_value",
        label: "القيمة التقديرية للأصل (ريال)",
        type: "number",
        required: true,
        min: 1,
        step: 1000
      },
      { name: "asset_city", label: "مدينة الأصل", type: "text", required: true },
      {
        name: "has_legal_docs",
        label: "هل وثائق الملكية مكتملة؟",
        type: "select",
        required: true,
        options: [
          { value: "yes", label: "نعم" },
          { value: "no", label: "لا" }
        ]
      },
      {
        name: "has_disputes",
        label: "هل على الأصل نزاعات أو التزامات؟",
        type: "select",
        required: true,
        options: [
          { value: "no", label: "لا" },
          { value: "yes", label: "نعم" }
        ]
      },
      { name: "notes", label: "ملاحظات إضافية", type: "textarea", required: false }
    ]
  },
  {
    id: "transfer_nazir",
    title: "لدي وقف وأرغب بنقل النظارة للجمعية",
    description: "رفع طلب نقل النظارة وفق المتطلبات الشرعية والنظامية.",
    resultTitle: "مسار نقل النظارة إلى الجمعية",
    fields: [
      { name: "waqf_name", label: "اسم الوقف", type: "text", required: true },
      { name: "waqf_deed_number", label: "رقم صك الوقف", type: "text", required: true },
      { name: "current_nazir_name", label: "اسم الناظر الحالي", type: "text", required: true },
      { name: "transfer_reason", label: "سبب نقل النظارة", type: "textarea", required: true },
      {
        name: "has_family_approval",
        label: "هل توجد موافقة من ذوي العلاقة؟",
        type: "select",
        required: true,
        options: [
          { value: "yes", label: "نعم" },
          { value: "no", label: "لا" }
        ]
      },
      {
        name: "has_court_approval",
        label: "هل توجد موافقة رسمية/قضائية؟",
        type: "select",
        required: true,
        options: [
          { value: "yes", label: "نعم" },
          { value: "no", label: "لا" }
        ]
      }
    ]
  },
  {
    id: "contribute_under_million",
    title: "لدي مبلغ أقل من مليون ريال للمساهمة",
    description: "المساهمة في وقف قيد الإنشاء حسب قدرتك المالية.",
    resultTitle: "مسار المساهمة في وقف قيد الإنشاء",
    fields: [
      {
        name: "contribution_amount",
        label: "قيمة المساهمة (ريال)",
        type: "number",
        required: true,
        min: 1000,
        max: 999999,
        step: 500
      },
      {
        name: "payment_type",
        label: "طريقة السداد",
        type: "select",
        required: true,
        options: [
          { value: "full", label: "دفعة واحدة" },
          { value: "installments", label: "دفعات مجدولة" }
        ]
      },
      {
        name: "contribution_purpose",
        label: "مجال المساهمة المفضل",
        type: "select",
        required: true,
        options: [
          { value: "general", label: "دعم عام للوقف" },
          { value: "educational", label: "برامج تعليم القرآن" },
          { value: "operations", label: "تشغيل الوقف" }
        ]
      },
      {
        name: "named_supporter",
        label: "هل ترغب بإثبات اسمك ضمن المساهمين؟",
        type: "select",
        required: true,
        options: [
          { value: "yes", label: "نعم" },
          { value: "no", label: "لا" }
        ]
      },
      { name: "notes", label: "ملاحظات إضافية", type: "textarea", required: false }
    ]
  }
];

const FIELD_LABELS = [...BASE_FIELDS, ...FLOWS.flatMap((flow) => flow.fields)].reduce((acc, field) => {
  acc[field.name] = field.label;
  return acc;
}, {});

const formEl = document.getElementById("question-form");
const formTitleEl = document.getElementById("form-title");
const formDescriptionEl = document.getElementById("form-description");
const fieldsEl = document.getElementById("form-fields");
const optionsGridEl = document.getElementById("options-grid");
const backBtn = document.getElementById("back-to-options");
const resultCardEl = document.getElementById("result-card");
const tabStart = document.getElementById("tab-start");
const tabTrack = document.getElementById("tab-track");
const startView = document.getElementById("start-view");
const trackView = document.getElementById("track-view");
const trackForm = document.getElementById("track-form");
const trackResult = document.getElementById("track-result");
const systemAlert = document.getElementById("system-alert");

let selectedFlow = null;

const appConfig = window.APP_CONFIG || {};
const supabaseUrl = appConfig.supabaseUrl || "";
const supabaseAnonKey = appConfig.supabaseAnonKey || "";

const supabaseClient =
  supabaseUrl && supabaseAnonKey && window.supabase?.createClient
    ? window.supabase.createClient(supabaseUrl, supabaseAnonKey)
    : null;

if (!supabaseClient) {
  showSystemAlert(
    "لم يتم تهيئة Supabase بعد. حدّث ملف config.js بالقيم الصحيحة (`supabaseUrl`, `supabaseAnonKey`) قبل الإرسال الفعلي."
  );
}

renderOptions();
wireTabs();
wireActions();

function wireTabs() {
  tabStart.addEventListener("click", () => switchTab("start"));
  tabTrack.addEventListener("click", () => switchTab("track"));
}

function wireActions() {
  backBtn.addEventListener("click", () => {
    selectedFlow = null;
    formEl.reset();
    formEl.classList.add("hidden");
    resultCardEl.classList.add("hidden");
    optionsGridEl.classList.remove("hidden");
  });

  formEl.addEventListener("submit", handleSubmit);
  trackForm.addEventListener("submit", handleTrack);
}

function showSystemAlert(message) {
  systemAlert.textContent = message;
  systemAlert.classList.remove("hidden");
}

function clearSystemAlert() {
  systemAlert.classList.add("hidden");
  systemAlert.textContent = "";
}

function switchTab(tab) {
  const isStart = tab === "start";
  tabStart.classList.toggle("active", isStart);
  tabTrack.classList.toggle("active", !isStart);
  startView.classList.toggle("active", isStart);
  trackView.classList.toggle("active", !isStart);
}

function renderOptions() {
  optionsGridEl.innerHTML = FLOWS.map(
    (flow) => `
      <article class="option-card" data-flow-id="${flow.id}" role="button" tabindex="0" aria-label="${flow.title}">
        <h3>${flow.title}</h3>
        <p>${flow.description}</p>
      </article>
    `
  ).join("");

  optionsGridEl.querySelectorAll(".option-card").forEach((card) => {
    const openFlow = () => {
      const flow = FLOWS.find((item) => item.id === card.dataset.flowId);
      if (!flow) {
        return;
      }
      selectedFlow = flow;
      renderFlowForm(flow);
    };

    card.addEventListener("click", openFlow);
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openFlow();
      }
    });
  });
}

function renderFlowForm(flow) {
  optionsGridEl.classList.add("hidden");
  formEl.classList.remove("hidden");
  resultCardEl.classList.add("hidden");

  formTitleEl.textContent = flow.title;
  formDescriptionEl.textContent = `${flow.description} املأ البيانات التالية لإصدار رقم طلب.`;

  const allFields = [...BASE_FIELDS, ...flow.fields];
  fieldsEl.innerHTML = allFields.map((field) => buildFieldMarkup(field)).join("");
}

function buildFieldMarkup(field) {
  const requiredTag = field.required ? "<span aria-hidden=\"true\"> *</span>" : "";
  const inputAttrs = [
    `name="${field.name}"`,
    `id="${field.name}"`,
    `type="${field.type === "textarea" || field.type === "select" ? "text" : field.type}"`
  ];

  if (field.required) inputAttrs.push("required");
  if (field.placeholder) inputAttrs.push(`placeholder="${field.placeholder}"`);
  if (typeof field.min !== "undefined") inputAttrs.push(`min="${field.min}"`);
  if (typeof field.max !== "undefined") inputAttrs.push(`max="${field.max}"`);
  if (typeof field.step !== "undefined") inputAttrs.push(`step="${field.step}"`);

  let controlMarkup = "";

  if (field.type === "select") {
    controlMarkup = `
      <select ${inputAttrs.filter((attr) => !attr.startsWith("type=")).join(" ")}>
        <option value="">اختر</option>
        ${field.options.map((option) => `<option value="${option.value}">${option.label}</option>`).join("")}
      </select>
    `;
  } else if (field.type === "textarea") {
    controlMarkup = `<textarea ${inputAttrs.filter((attr) => !attr.startsWith("type=")).join(" ")}></textarea>`;
  } else {
    controlMarkup = `<input ${inputAttrs.join(" ")} />`;
  }

  return `
    <div class="field">
      <label for="${field.name}">${field.label}${requiredTag}</label>
      ${controlMarkup}
    </div>
  `;
}

async function handleSubmit(event) {
  event.preventDefault();

  if (!selectedFlow) {
    return;
  }

  clearSystemAlert();

  const submitButton = formEl.querySelector("button[type='submit']");
  const allFields = [...BASE_FIELDS, ...selectedFlow.fields];
  const { answers, errors } = collectAndValidate(allFields);

  if (errors.length > 0) {
    showSystemAlert(errors[0]);
    return;
  }

  if (!supabaseClient) {
    showSystemAlert("تعذّر الإرسال: إعدادات Supabase غير مكتملة في config.js.");
    return;
  }

  const outcome = evaluateOutcome(selectedFlow, answers);
  const timeline = [
    {
      status: "تم استلام الطلب",
      note: "تم تسجيل الطلب إلكترونيًا بنجاح.",
      at: new Date().toISOString()
    },
    {
      status: outcome.initialStatus,
      note: outcome.timelineNote,
      at: new Date().toISOString()
    }
  ];

  setLoading(submitButton, true, "جاري الإرسال...");

  try {
    const payload = {
      p_option_id: selectedFlow.id,
      p_option_title: selectedFlow.title,
      p_applicant_name: answers.full_name,
      p_phone: answers.phone,
      p_city: answers.city,
      p_preferred_contact: answers.preferred_contact,
      p_email: answers.email || null,
      p_answers: answers,
      p_route_result: outcome.routeResult,
      p_recommendation: outcome.recommendation,
      p_status: outcome.initialStatus,
      p_required_actions: outcome.requiredActions,
      p_timeline: timeline
    };

    const { data, error } = await supabaseClient.rpc("create_waqf_request", payload);

    if (error) {
      throw error;
    }

    const created = Array.isArray(data) ? data[0] : data;
    if (!created?.request_number) {
      throw new Error("تعذّر إصدار رقم الطلب.");
    }

    renderSubmissionResult({
      requestNumber: created.request_number,
      createdAt: created.created_at || new Date().toISOString(),
      flowTitle: selectedFlow.title,
      outcome
    });

    formEl.classList.add("hidden");
    resultCardEl.classList.remove("hidden");
    formEl.reset();
  } catch (error) {
    showSystemAlert(`تعذّر إرسال الطلب: ${error.message || "خطأ غير متوقع"}`);
  } finally {
    setLoading(submitButton, false, "إرسال الطلب");
  }
}

function collectAndValidate(fields) {
  const answers = {};
  const errors = [];

  fields.forEach((field) => {
    const input = formEl.elements[field.name];
    if (!input) {
      return;
    }

    input.classList.remove("error");
    const value = typeof input.value === "string" ? input.value.trim() : input.value;
    answers[field.name] = value;

    if (field.required && !value) {
      errors.push(`حقل "${field.label}" مطلوب.`);
      input.classList.add("error");
      return;
    }

    if (value && field.type === "number") {
      const numericValue = Number(value);
      if (!Number.isFinite(numericValue)) {
        errors.push(`حقل "${field.label}" يجب أن يكون رقمًا صحيحًا.`);
        input.classList.add("error");
        return;
      }

      if (typeof field.min !== "undefined" && numericValue < field.min) {
        errors.push(`حقل "${field.label}" يجب ألا يقل عن ${field.min}.`);
        input.classList.add("error");
      }

      if (typeof field.max !== "undefined" && numericValue > field.max) {
        errors.push(`حقل "${field.label}" يجب ألا يزيد عن ${field.max}.`);
        input.classList.add("error");
      }
    }
  });

  const phoneRegex = /^(\+966|0)?5\d{8}$/;
  if (answers.phone && !phoneRegex.test(answers.phone)) {
    errors.push("رقم الجوال غير صحيح. استخدم تنسيقًا سعوديًا مثل 05xxxxxxxx.");
    const phoneInput = formEl.elements.phone;
    if (phoneInput) phoneInput.classList.add("error");
  }

  if (selectedFlow?.id === "buy_over_million" && Number(answers.available_amount) < 1000000) {
    errors.push("هذا المسار مخصص للمبالغ من مليون ريال فأكثر.");
  }

  if (selectedFlow?.id === "contribute_under_million" && Number(answers.contribution_amount) >= 1000000) {
    errors.push("هذا المسار للمساهمات الأقل من مليون ريال.");
  }

  return { answers, errors };
}

function evaluateOutcome(flow, answers) {
  if (flow.id === "buy_over_million") {
    const amount = Number(answers.available_amount || 0);
    const isLargeEndowment = amount >= 5000000;

    return {
      routeResult: isLargeEndowment ? "برنامج الأوقاف الكبرى" : "برنامج تأسيس وقف جديد",
      recommendation: isLargeEndowment
        ? "الطلب مؤهل لمسار الأوقاف الكبرى مع مستشار استثماري مخصص."
        : "الطلب مؤهل لمسار تأسيس وقف جديد بشراء أصل مناسب.",
      initialStatus: answers.readiness === "immediate" ? "قيد التواصل العاجل" : "قيد الدراسة الأولية",
      timelineNote:
        answers.readiness === "immediate"
          ? "تم إعطاء الطلب أولوية أعلى لبدء الإجراءات خلال فترة قصيرة."
          : "سيتم ترتيب التواصل بعد مراجعة الملاءة ونوع الأصل.",
      requiredActions: [
        "تجهيز ما يثبت الملاءة المالية",
        "تحديد تفضيل نوع الأصل والمدينة",
        answers.wants_partnership === "yes" ? "إرفاق تفضيلات الشراكة الوقفية" : "تأكيد الرغبة بالتملك الفردي"
      ]
    };
  }

  if (flow.id === "have_asset_convert") {
    const hasDocs = answers.has_legal_docs === "yes";
    const hasNoDisputes = answers.has_disputes === "no";
    const ready = hasDocs && hasNoDisputes;

    return {
      routeResult: "تقييم الأصل ثم التحويل الوقفي",
      recommendation: ready
        ? "الطلب جاهز للعرض على اللجنة الشرعية والقانونية للتحويل المباشر."
        : "الطلب يحتاج استكمال المتطلبات النظامية قبل اعتماد التحويل.",
      initialStatus: ready ? "مؤهل للعرض على اللجنة" : "بانتظار استكمال المتطلبات",
      timelineNote: ready
        ? "تم تصنيف الأصل كحالة جاهزة مبدئيًا للتحويل الوقفي."
        : "تم رصد نواقص في الوثائق أو وجود التزامات على الأصل.",
      requiredActions: [
        hasDocs ? "رفع نسخة الصكوك الرسمية" : "استكمال وثائق الملكية الرسمية",
        hasNoDisputes ? "تقديم إقرار بخلو الأصل من النزاعات" : "إغلاق النزاعات أو الالتزامات على الأصل",
        "توفير تقييم محدث للأصل"
      ]
    };
  }

  if (flow.id === "transfer_nazir") {
    const hasCourtApproval = answers.has_court_approval === "yes";
    const hasFamilyApproval = answers.has_family_approval === "yes";

    return {
      routeResult: "نقل النظارة إلى جمعية مدكر",
      recommendation: hasCourtApproval
        ? "الطلب جاهز لبدء إجراءات نقل النظارة رسميًا."
        : "الطلب يحتاج استكمال الموافقة الرسمية/القضائية لنقل النظارة.",
      initialStatus: hasCourtApproval ? "قيد اعتماد نقل النظارة" : "بانتظار مستندات نقل النظارة",
      timelineNote: hasCourtApproval
        ? "تم تحويل الطلب للقسم القانوني لاستكمال معاملة النقل."
        : "المعاملة متوقفة لحين اكتمال مستندات الموافقة الرسمية.",
      requiredActions: [
        hasFamilyApproval ? "إرفاق موافقات ذوي العلاقة" : "تحصيل موافقات ذوي العلاقة",
        hasCourtApproval ? "إرفاق قرار/موافقة قضائية" : "استكمال الموافقة القضائية",
        "تزويد صورة صك الوقف وبيانات الناظر الحالي"
      ]
    };
  }

  const amount = Number(answers.contribution_amount || 0);
  const tier = amount >= 100000 ? "شريك مساهم" : amount >= 10000 ? "مساهم داعم" : "مساهم";

  return {
    routeResult: `المساهمة في وقف قيد الإنشاء - فئة ${tier}`,
    recommendation:
      answers.payment_type === "installments"
        ? "سيتم جدولة دفعات المساهمة وإرسال خطة سداد إلكترونية."
        : "سيتم إصدار فاتورة مساهمة مباشرة وتحويلك لمسار الإتمام.",
    initialStatus: answers.payment_type === "installments" ? "بانتظار جدولة الدفعات" : "بانتظار إصدار الفاتورة",
    timelineNote:
      answers.payment_type === "installments"
        ? "تم تحويل الطلب لمسار الجدولة المالية للمساهمة."
        : "تم تحويل الطلب لإصدار فاتورة مساهمة نهائية.",
    requiredActions: [
      "تأكيد مبلغ المساهمة النهائي",
      answers.payment_type === "installments" ? "اعتماد جدول الدفعات" : "إتمام التحويل البنكي أو السداد الإلكتروني",
      answers.named_supporter === "yes" ? "تأكيد صيغة الاسم في سجل المساهمين" : "تأكيد رغبة عدم إظهار الاسم"
    ]
  };
}

function renderSubmissionResult({ requestNumber, createdAt, flowTitle, outcome }) {
  const formattedDate = formatDate(createdAt);
  resultCardEl.innerHTML = `
    <div class="result-badge">تم إصدار الطلب بنجاح</div>
    <h3>رقم الطلب: <span class="request-code">${requestNumber}</span></h3>
    <p><strong>المسار:</strong> ${flowTitle}</p>
    <p><strong>النتيجة:</strong> ${outcome.routeResult}</p>
    <p><strong>التوصية:</strong> ${outcome.recommendation}</p>
    <p><strong>الحالة الحالية:</strong> <span class="status-badge">${outcome.initialStatus}</span></p>
    <p><strong>تاريخ الإنشاء:</strong> ${formattedDate}</p>
    <div class="meta">
      ${outcome.requiredActions.map((action) => `<div class="meta-row">${action}</div>`).join("")}
    </div>
    <div class="actions">
      <button id="go-track" class="btn btn-primary" type="button">الانتقال لصفحة المتابعة</button>
      <button id="new-request" class="btn btn-secondary" type="button">إنشاء طلب جديد</button>
    </div>
  `;

  document.getElementById("go-track").addEventListener("click", () => {
    switchTab("track");
    const requestInput = document.getElementById("request-number");
    requestInput.value = requestNumber;
    requestInput.focus();
  });

  document.getElementById("new-request").addEventListener("click", () => {
    selectedFlow = null;
    resultCardEl.classList.add("hidden");
    optionsGridEl.classList.remove("hidden");
  });
}

async function handleTrack(event) {
  event.preventDefault();
  clearSystemAlert();

  const requestInput = document.getElementById("request-number");
  const requestNumber = requestInput.value.trim().toUpperCase();

  if (!requestNumber) {
    showSystemAlert("أدخل رقم الطلب أولاً.");
    return;
  }

  if (!supabaseClient) {
    showSystemAlert("تعذّرت المتابعة: إعدادات Supabase غير مكتملة.");
    return;
  }

  const submitButton = trackForm.querySelector("button[type='submit']");
  setLoading(submitButton, true, "جاري البحث...");

  try {
    const { data, error } = await supabaseClient.rpc("track_waqf_request", {
      p_request_number: requestNumber
    });

    if (error) {
      throw error;
    }

    const request = Array.isArray(data) ? data[0] : data;

    if (!request) {
      trackResult.innerHTML = `<p class="error-text">لا يوجد طلب بهذا الرقم. تأكد من الرقم ثم أعد المحاولة.</p>`;
      return;
    }

    renderTrackResult(request);
  } catch (error) {
    showSystemAlert(`تعذّر متابعة الطلب: ${error.message || "خطأ غير متوقع"}`);
  } finally {
    setLoading(submitButton, false, "متابعة");
  }
}

function renderTrackResult(request) {
  const timeline = Array.isArray(request.timeline) ? request.timeline : [];
  const requiredActions = Array.isArray(request.required_actions) ? request.required_actions : [];
  const answers = request.answers || {};

  const highlightedFields = ["full_name", "phone", "city", "preferred_contact"]
    .map((field) => {
      const value = answers[field];
      if (!value) return "";
      return `<div class="meta-row"><strong>${FIELD_LABELS[field]}:</strong> ${formatValue(value, field)}</div>`;
    })
    .join("");

  trackResult.innerHTML = `
    <h3>متابعة الطلب <span class="request-code">${request.request_number}</span></h3>
    <p><strong>المسار:</strong> ${request.option_title}</p>
    <p><strong>الحالة الحالية:</strong> <span class="status-badge">${request.status}</span></p>
    <p><strong>النتيجة:</strong> ${request.route_result}</p>
    <p><strong>آخر تحديث:</strong> ${formatDate(request.updated_at || request.created_at)}</p>

    <div class="meta">
      ${highlightedFields}
    </div>

    <h4>المطلوب حاليًا</h4>
    <div class="meta">
      ${
        requiredActions.length
          ? requiredActions.map((action) => `<div class="meta-row">${action}</div>`).join("")
          : '<div class="meta-row">لا توجد متطلبات إضافية حالياً.</div>'
      }
    </div>

    <h4>سجل الحالة</h4>
    <ul class="timeline">
      ${
        timeline.length
          ? timeline
              .map(
                (item) =>
                  `<li><strong>${item.status || "تحديث"}</strong><br>${item.note || ""}<br><small>${formatDate(
                    item.at || request.updated_at || request.created_at
                  )}</small></li>`
              )
              .join("")
          : `<li>لا يوجد سجل حالة مفصل حتى الآن.</li>`
      }
    </ul>
  `;
}

function setLoading(button, loading, loadingLabel) {
  if (!button) {
    return;
  }

  if (!button.dataset.originalLabel) {
    button.dataset.originalLabel = button.textContent;
  }

  button.disabled = loading;
  button.textContent = loading ? loadingLabel : button.dataset.originalLabel;
}

function formatDate(dateValue) {
  if (!dateValue) {
    return "-";
  }

  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat("ar-SA", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(date);
}

function formatValue(value, fieldName) {
  if (fieldName === "preferred_contact") {
    const map = {
      call: "اتصال",
      whatsapp: "واتساب",
      email: "بريد إلكتروني"
    };
    return map[value] || value;
  }

  return value;
}
