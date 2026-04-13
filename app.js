const PHONE_REGEX = /^(\+966|0)?5\d{8}$/;

const COMMON_STEPS = [
  {
    id: "vision",
    title: "ملامح الرؤية الوقفية",
    description: "خلنا نرسم صورة الوقف الذي تتطلع له قبل الدخول في التفاصيل التنفيذية.",
    fields: [
      {
        name: "giving_story",
        label: "ما الدافع الأقرب لك؟",
        type: "cards",
        required: true,
        options: [
          {
            value: "legacy",
            label: "إرث عائلي مستدام",
            description: "وقف يحمل اسم العائلة ويستمر أثره عبر الأجيال.",
            icon: "🏛️"
          },
          {
            value: "quran_impact",
            label: "دعم تعليم القرآن",
            description: "تركيز مباشر على الحلقات والمعلمين والطلاب.",
            icon: "📖"
          },
          {
            value: "social_impact",
            label: "أثر مجتمعي واسع",
            description: "مزيج من الأثر التعليمي والتنموي.",
            icon: "🌱"
          },
          {
            value: "financial_sadaqah",
            label: "صدقة جارية منظمة",
            description: "نمو مالي منضبط يعود ريعه للمصارف الوقفية.",
            icon: "💠"
          }
        ]
      },
      {
        name: "impact_preference",
        label: "أين تريد أن يظهر أثر الوقف غالبًا؟",
        type: "cards",
        required: true,
        options: [
          {
            value: "teachers",
            label: "تمكين معلمي القرآن",
            description: "رفع الاستدامة التعليمية وتأهيل الكفاءات.",
            icon: "🧑‍🏫"
          },
          {
            value: "students",
            label: "رعاية الطلاب والحلقات",
            description: "منح، تحفيز، وبرامج حفظ مستمرة.",
            icon: "🧒"
          },
          {
            value: "assets",
            label: "تنمية أصول وقفية",
            description: "تعظيم الريع لصالح برامج الجمعية.",
            icon: "🏢"
          },
          {
            value: "balanced",
            label: "مزيج متوازن",
            description: "توزيع الأثر بين الأصول والبرامج.",
            icon: "⚖️"
          }
        ]
      },
      {
        name: "engagement_style",
        label: "كيف تحب مستوى مشاركتك؟",
        type: "cards",
        required: true,
        options: [
          {
            value: "hands_on",
            label: "مشاركة مباشرة",
            description: "أحب المتابعة القريبة والتفاصيل التنفيذية.",
            icon: "🤝"
          },
          {
            value: "guided",
            label: "مشاركة موجهة",
            description: "أشارك في القرارات الرئيسية والباقي للجمعية.",
            icon: "🧭"
          },
          {
            value: "delegated",
            label: "تفويض كامل",
            description: "أفضّل تولي الجمعية الإدارة وفق الضوابط.",
            icon: "🏷️"
          }
        ]
      }
    ]
  }
];

const CONTACT_STEP = {
  id: "contact",
  title: "البيانات والتواصل",
  description: "آخر خطوة، بعدها يصدر رقم طلبك مباشرة مع خطة المتابعة.",
  fields: [
    { name: "full_name", label: "الاسم الكامل", type: "text", required: true, placeholder: "الاسم الرباعي" },
    { name: "phone", label: "رقم الجوال", type: "tel", required: true, placeholder: "05xxxxxxxx" },
    { name: "city", label: "المدينة", type: "text", required: true },
    {
      name: "preferred_contact",
      label: "وسيلة التواصل المفضلة",
      type: "cards",
      required: true,
      options: [
        { value: "call", label: "اتصال", description: "مكالمة من فريق الأوقاف", icon: "📞" },
        { value: "whatsapp", label: "واتساب", description: "رسائل متابعة سريعة", icon: "💬" },
        { value: "email", label: "بريد إلكتروني", description: "تفاصيل رسمية مكتوبة", icon: "✉️" }
      ]
    },
    {
      name: "best_contact_time",
      label: "أفضل وقت للتواصل",
      type: "cards",
      required: true,
      options: [
        { value: "morning", label: "صباحًا", description: "9 ص - 12 م", icon: "🌤️" },
        { value: "afternoon", label: "ظهرًا", description: "12 م - 4 م", icon: "☀️" },
        { value: "evening", label: "مساءً", description: "4 م - 9 م", icon: "🌙" }
      ]
    },
    {
      name: "email",
      label: "البريد الإلكتروني",
      type: "email",
      required: false,
      placeholder: "name@example.com",
      showIf: (answers) => answers.preferred_contact === "email"
    }
  ]
};

const FLOWS = [
  {
    id: "buy_over_million",
    title: "مبلغ يتجاوز مليون ريال",
    short: "شراء أصل وتحويله إلى وقف",
    icon: "🏗️",
    mood: "أنت في مسار تأسيسي قوي، مناسب لصناعة أصل وقفي مؤثر من البداية.",
    teaser: "سنساعدك على اختيار الأصل الأنسب وتخطيط الوقف خطوة بخطوة.",
    steps: [
      {
        id: "asset_strategy",
        title: "استراتيجية الأصل الوقفي",
        description: "حدد شكل الأصل واتجاه الاستثمار المفضل لك.",
        fields: [
          {
            name: "available_amount",
            label: "كم المبلغ المتاح للتأسيس (ريال)؟",
            type: "number",
            required: true,
            min: 1000000,
            step: 1000,
            placeholder: "1000000"
          },
          {
            name: "preferred_asset_type",
            label: "نوع الأصل المفضل",
            type: "cards",
            required: true,
            options: [
              { value: "commercial", label: "عقار تجاري", description: "عائد دوري واستقرار نسبي", icon: "🏬" },
              { value: "residential", label: "عقار سكني", description: "خيار متوازن مع طلب مستمر", icon: "🏘️" },
              { value: "land", label: "أرض استثمارية", description: "مرونة في التطوير المستقبلي", icon: "🧱" },
              { value: "other", label: "خيار آخر", description: "يُناقش مع الفريق الاستثماري", icon: "🧠" }
            ]
          },
          { name: "target_city", label: "المدينة المستهدفة", type: "text", required: true },
          {
            name: "readiness",
            label: "متى ترغب ببدء التنفيذ؟",
            type: "cards",
            required: true,
            options: [
              { value: "immediate", label: "فورًا", description: "خلال 30 يوم", icon: "⚡" },
              { value: "mid", label: "قريبًا", description: "خلال 3 أشهر", icon: "🗓️" },
              { value: "later", label: "بعد التخطيط", description: "3 أشهر فأكثر", icon: "🧩" }
            ]
          }
        ]
      },
      {
        id: "execution",
        title: "التنفيذ والحوكمة",
        description: "اختياراتك هنا تساعدنا نضبط خطة تأسيس عملية.",
        fields: [
          {
            name: "wants_partnership",
            label: "هل تفضّل شراكة وقفية؟",
            type: "cards",
            required: true,
            options: [
              { value: "no", label: "لا", description: "وقف مستقل بالكامل", icon: "🔒" },
              { value: "yes", label: "نعم", description: "شراكة مع واقفين آخرين", icon: "🫱🏻‍🫲🏽" }
            ]
          },
          {
            name: "support_needs",
            label: "ما الخدمة الأهم لك من الجمعية؟",
            type: "cards",
            required: true,
            options: [
              { value: "asset_sourcing", label: "بحث أصل مناسب", description: "فرز فرص استثمارية جاهزة", icon: "🔍" },
              { value: "legal_setup", label: "الإجراءات الشرعية والنظامية", description: "حوكمة وصياغة وثائق", icon: "📜" },
              { value: "full_management", label: "إدارة متكاملة", description: "من التأسيس حتى التشغيل", icon: "🧑‍💼" }
            ]
          },
          { name: "notes", label: "تفاصيل إضافية أو اشتراطات", type: "textarea", required: false }
        ]
      }
    ]
  },
  {
    id: "have_asset_convert",
    title: "لدي أصل وأريد تحويله إلى وقف",
    short: "تقييم الأصل وتحويله وقفيًا",
    icon: "🏢",
    mood: "مسارك قريب من الإنجاز إذا كانت الجاهزية القانونية واضحة.",
    teaser: "سنراجع الأصل ونبني خطة تحويل وقفي نظامية ومطمئنة.",
    steps: [
      {
        id: "asset_profile",
        title: "تعريف الأصل",
        description: "معلومات سريعة عن الأصل الحالي وطبيعته.",
        fields: [
          {
            name: "asset_type",
            label: "نوع الأصل",
            type: "cards",
            required: true,
            options: [
              { value: "building", label: "مبنى", description: "عقار قائم قابل للتشغيل", icon: "🏙️" },
              { value: "land", label: "أرض", description: "قابلة للتطوير أو الاستثمار", icon: "🌾" },
              { value: "portfolio", label: "محفظة استثمارية", description: "أدوات مالية/استثمارية", icon: "📊" },
              { value: "other", label: "أصل آخر", description: "يناقش مع المستشار", icon: "🧾" }
            ]
          },
          {
            name: "asset_estimated_value",
            label: "القيمة التقديرية (ريال)",
            type: "number",
            required: true,
            min: 1,
            step: 1000
          },
          { name: "asset_city", label: "موقع الأصل (المدينة)", type: "text", required: true },
          {
            name: "asset_income_status",
            label: "الوضع التشغيلي الحالي",
            type: "cards",
            required: true,
            options: [
              { value: "active", label: "يحقق دخلًا", description: "تدفق مالي جاري", icon: "💵" },
              { value: "idle", label: "غير مستغل", description: "يحتاج تطوير أو إدارة", icon: "🧱" },
              { value: "partial", label: "تشغيل جزئي", description: "دخل غير مستقر", icon: "🧩" }
            ]
          }
        ]
      },
      {
        id: "legal_readiness",
        title: "الجاهزية النظامية",
        description: "كلما كانت المتطلبات مكتملة، كان التحويل أسرع.",
        fields: [
          {
            name: "has_legal_docs",
            label: "هل وثائق الملكية مكتملة؟",
            type: "cards",
            required: true,
            options: [
              { value: "yes", label: "نعم", description: "الوثائق جاهزة", icon: "✅" },
              { value: "no", label: "لا", description: "يلزم استكمالها", icon: "📄" }
            ]
          },
          {
            name: "has_disputes",
            label: "هل توجد نزاعات/التزامات على الأصل؟",
            type: "cards",
            required: true,
            options: [
              { value: "no", label: "لا", description: "وضع قانوني مستقر", icon: "🟢" },
              { value: "yes", label: "نعم", description: "تحتاج معالجة قبل التحويل", icon: "🟠" }
            ]
          },
          {
            name: "transfer_timeline",
            label: "الإطار الزمني المتوقع للتحويل",
            type: "cards",
            required: true,
            options: [
              { value: "fast", label: "عاجل", description: "أقل من شهرين", icon: "🚀" },
              { value: "normal", label: "متوسط", description: "2 - 6 أشهر", icon: "🧭" },
              { value: "flexible", label: "مرن", description: "حسب جاهزية الملفات", icon: "🕰️" }
            ]
          },
          { name: "notes", label: "ملاحظات إضافية", type: "textarea", required: false }
        ]
      }
    ]
  },
  {
    id: "transfer_nazir",
    title: "لدي وقف وأرغب بنقل النظارة",
    short: "تحويل النظارة إلى الجمعية",
    icon: "🧾",
    mood: "هذا مسار مؤسسي مهم، ونضمن فيه وضوح الإجراءات والمسؤوليات.",
    teaser: "سنرتّب نقل النظارة وفق المتطلبات الشرعية والنظامية.",
    steps: [
      {
        id: "waqf_identity",
        title: "هوية الوقف القائم",
        description: "معلومات أساسية عن الوقف قبل إجراءات النقل.",
        fields: [
          { name: "waqf_name", label: "اسم الوقف", type: "text", required: true },
          { name: "waqf_deed_number", label: "رقم صك الوقف", type: "text", required: true },
          { name: "current_nazir_name", label: "اسم الناظر الحالي", type: "text", required: true },
          {
            name: "waqf_type",
            label: "طبيعة الوقف",
            type: "cards",
            required: true,
            options: [
              { value: "family", label: "وقف أهلي", description: "مرتبط بعائلة أو ورثة", icon: "👪" },
              { value: "charity", label: "وقف خيري", description: "أثر عام مباشر", icon: "🤲" },
              { value: "mixed", label: "مختلط", description: "أهلي وخيري", icon: "⚖️" }
            ]
          }
        ]
      },
      {
        id: "nazara_transfer",
        title: "متطلبات نقل النظارة",
        description: "هذه المرحلة تحدد جاهزية النقل واعتماد الطلب.",
        fields: [
          { name: "transfer_reason", label: "سبب نقل النظارة", type: "textarea", required: true },
          {
            name: "has_family_approval",
            label: "هل توجد موافقات من ذوي العلاقة؟",
            type: "cards",
            required: true,
            options: [
              { value: "yes", label: "نعم", description: "الموافقات متاحة", icon: "✅" },
              { value: "no", label: "لا", description: "تحتاج استكمال", icon: "📌" }
            ]
          },
          {
            name: "has_court_approval",
            label: "هل توجد موافقة قضائية/رسمية؟",
            type: "cards",
            required: true,
            options: [
              { value: "yes", label: "نعم", description: "المستند متوفر", icon: "🏛️" },
              { value: "no", label: "لا", description: "يلزم استخراجها", icon: "🗂️" }
            ]
          },
          {
            name: "handover_readiness",
            label: "جاهزية التسليم الإداري",
            type: "cards",
            required: true,
            options: [
              { value: "ready", label: "جاهز", description: "ملفات الوقف موثقة", icon: "📦" },
              { value: "partial", label: "جزئي", description: "جزء من الملفات متوفر", icon: "🧩" },
              { value: "needs_support", label: "أحتاج دعم", description: "أرغب بخطة تسليم", icon: "🛟" }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "contribute_under_million",
    title: "مساهمة أقل من مليون ريال",
    short: "مساهمة في وقف قيد الإنشاء",
    icon: "🌟",
    mood: "مساهمتك تصنع أثرًا سريعًا ويمكن تصميمها بطريقة مريحة لك.",
    teaser: "نوجه مساهمتك لأفضل مسار أثر ونرتب آلية دفع مرنة.",
    steps: [
      {
        id: "contribution_plan",
        title: "خطة المساهمة",
        description: "اختر صيغة مساهمتك بما يناسبك.",
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
            type: "cards",
            required: true,
            options: [
              { value: "full", label: "دفعة واحدة", description: "سداد فوري كامل", icon: "💳" },
              { value: "installments", label: "دفعات مجدولة", description: "تقسيط مريح", icon: "🧮" },
              { value: "monthly", label: "مساهمة شهرية", description: "التزام مستمر", icon: "📆" }
            ]
          },
          {
            name: "contribution_purpose",
            label: "مجال المساهمة المفضل",
            type: "cards",
            required: true,
            options: [
              { value: "general", label: "دعم عام", description: "توزيع حسب الأولوية", icon: "🌿" },
              { value: "educational", label: "تعليم القرآن", description: "حلقات وبرامج تعليمية", icon: "📘" },
              { value: "operations", label: "تشغيل الوقف", description: "تعزيز الاستدامة التشغيلية", icon: "⚙️" }
            ]
          },
          {
            name: "named_supporter",
            label: "هل ترغب بإظهار اسمك ضمن المساهمين؟",
            type: "cards",
            required: true,
            options: [
              { value: "yes", label: "نعم", description: "يتم إدراج الاسم", icon: "🪪" },
              { value: "no", label: "لا", description: "مساهمة دون إظهار الاسم", icon: "🫥" }
            ]
          }
        ]
      },
      {
        id: "payment_details",
        title: "تفاصيل الدفع والمتابعة",
        description: "بناء آلية مناسبة لإتمام المساهمة بسرعة.",
        fields: [
          {
            name: "installment_months",
            label: "عدد الأشهر المقترح",
            type: "select",
            required: true,
            showIf: (answers) => answers.payment_type === "installments",
            options: [
              { value: "3", label: "3 أشهر" },
              { value: "6", label: "6 أشهر" },
              { value: "12", label: "12 شهرًا" }
            ]
          },
          {
            name: "payment_channel",
            label: "قناة السداد المفضلة",
            type: "cards",
            required: true,
            options: [
              { value: "bank", label: "تحويل بنكي", description: "حسابات رسمية للجمعية", icon: "🏦" },
              { value: "card", label: "بطاقة مدى/ائتمانية", description: "سداد إلكتروني مباشر", icon: "💳" },
              { value: "applepay", label: "Apple Pay", description: "دفع سريع من الجوال", icon: "📱" }
            ]
          },
          {
            name: "contribution_frequency",
            label: "دورية المساهمة الشهرية",
            type: "cards",
            required: true,
            showIf: (answers) => answers.payment_type === "monthly",
            options: [
              { value: "fixed", label: "مبلغ ثابت", description: "نفس القيمة كل شهر", icon: "🔁" },
              { value: "variable", label: "مرن", description: "تغيير القيمة حسب الشهر", icon: "🎚️" }
            ]
          },
          { name: "notes", label: "ملاحظات إضافية", type: "textarea", required: false }
        ]
      }
    ]
  }
];

const FLOW_MAP = Object.fromEntries(FLOWS.map((flow) => [flow.id, flow]));

const state = {
  activeTab: "start",
  selectedFlowId: null,
  currentStep: 0,
  answers: {},
  fieldErrors: {},
  submitting: false
};

const tabStart = document.getElementById("tab-start");
const tabTrack = document.getElementById("tab-track");
const startView = document.getElementById("start-view");
const trackView = document.getElementById("track-view");
const flowGrid = document.getElementById("flow-grid");
const journeyPanel = document.getElementById("journey-panel");
const journeyForm = document.getElementById("journey-form");
const stepContent = document.getElementById("step-content");
const stepTitle = document.getElementById("step-title");
const stepDescription = document.getElementById("step-description");
const stepCounter = document.getElementById("step-counter");
const progressBar = document.getElementById("progress-bar");
const journeyFlowTitle = document.getElementById("journey-flow-title");
const journeyMood = document.getElementById("journey-mood");
const journeyCompletion = document.getElementById("journey-completion");
const liveSummary = document.getElementById("live-summary");
const formError = document.getElementById("form-error");
const cancelJourneyBtn = document.getElementById("cancel-journey");
const prevStepBtn = document.getElementById("prev-step");
const nextStepBtn = document.getElementById("next-step");
const submitRequestBtn = document.getElementById("submit-request");
const resultCard = document.getElementById("result-card");
const systemAlert = document.getElementById("system-alert");

const trackForm = document.getElementById("track-form");
const trackResult = document.getElementById("track-result");

const appConfig = window.APP_CONFIG || {};
const supabaseUrl = appConfig.supabaseUrl || "";
const supabaseAnonKey = appConfig.supabaseAnonKey || "";
const supabaseClient =
  supabaseUrl && supabaseAnonKey && window.supabase?.createClient
    ? window.supabase.createClient(supabaseUrl, supabaseAnonKey)
    : null;

init();

function init() {
  renderFlowCards();
  bindEvents();
  setActiveTab("start");

  if (!supabaseClient) {
    showSystemAlert(
      "تنبيه: إعدادات Supabase غير مكتملة. حدّث config.js حتى تعمل ميزة إصدار الطلب والمتابعة.",
      "warn"
    );
  }
}

function bindEvents() {
  tabStart.addEventListener("click", () => setActiveTab("start"));
  tabTrack.addEventListener("click", () => setActiveTab("track"));

  flowGrid.addEventListener("click", (event) => {
    const card = event.target.closest("[data-flow-id]");
    if (!card) return;
    startJourney(card.dataset.flowId);
  });

  journeyForm.addEventListener("submit", handleSubmitRequest);
  stepContent.addEventListener("input", handleFieldInput);
  stepContent.addEventListener("change", handleFieldInput);
  stepContent.addEventListener("click", handleCardChoice);

  cancelJourneyBtn.addEventListener("click", resetJourney);
  prevStepBtn.addEventListener("click", goToPreviousStep);
  nextStepBtn.addEventListener("click", goToNextStep);

  trackForm.addEventListener("submit", handleTrack);
}

function setActiveTab(tab) {
  state.activeTab = tab;
  const isStart = tab === "start";

  tabStart.className = isStart
    ? "rounded-2xl border border-waqf-400 bg-white px-4 py-3 text-sm font-bold text-waqf-800 shadow-soft transition hover:-translate-y-0.5"
    : "rounded-2xl border border-transparent bg-waqf-100/90 px-4 py-3 text-sm font-bold text-waqf-700 transition hover:-translate-y-0.5";

  tabTrack.className = !isStart
    ? "rounded-2xl border border-waqf-400 bg-white px-4 py-3 text-sm font-bold text-waqf-800 shadow-soft transition hover:-translate-y-0.5"
    : "rounded-2xl border border-transparent bg-waqf-100/90 px-4 py-3 text-sm font-bold text-waqf-700 transition hover:-translate-y-0.5";

  startView.classList.toggle("hidden", !isStart);
  trackView.classList.toggle("hidden", isStart);
}

function renderFlowCards() {
  flowGrid.innerHTML = FLOWS.map(
    (flow) => `
      <article class="group rounded-3xl border border-waqf-200 bg-white/90 p-5 shadow-soft transition hover:-translate-y-1 hover:shadow-warm">
        <button
          type="button"
          data-flow-id="${flow.id}"
          class="w-full text-right"
          aria-label="${flow.title}"
        >
          <div class="flex items-start justify-between gap-3">
            <div>
              <p class="text-xs font-extrabold text-waqf-500">${flow.short}</p>
              <h3 class="mt-1 text-lg font-extrabold text-waqf-900">${flow.title}</h3>
            </div>
            <span class="rounded-xl bg-waqf-100 px-3 py-2 text-xl">${flow.icon}</span>
          </div>
          <p class="mt-3 text-sm leading-7 text-waqf-700">${flow.teaser}</p>
          <div class="mt-4 inline-flex items-center gap-2 rounded-xl bg-waqf-600 px-3 py-2 text-xs font-bold text-white transition group-hover:bg-waqf-700">
            ابدأ الرحلة
            <span aria-hidden="true">←</span>
          </div>
        </button>
      </article>
    `
  ).join("");
}

function startJourney(flowId) {
  if (!FLOW_MAP[flowId]) return;

  clearSystemAlert();
  resultCard.classList.add("hidden");

  state.selectedFlowId = flowId;
  state.currentStep = 0;
  state.answers = { flow_id: flowId };
  state.fieldErrors = {};

  journeyPanel.classList.remove("hidden");
  renderJourney();
  journeyPanel.scrollIntoView({ behavior: "smooth", block: "start" });
}

function resetJourney() {
  state.selectedFlowId = null;
  state.currentStep = 0;
  state.answers = {};
  state.fieldErrors = {};
  state.submitting = false;

  journeyPanel.classList.add("hidden");
  resultCard.classList.add("hidden");
  clearFormError();
}

function getSelectedFlow() {
  if (!state.selectedFlowId) return null;
  return FLOW_MAP[state.selectedFlowId] || null;
}

function getJourneySteps() {
  const flow = getSelectedFlow();
  if (!flow) return [];
  return [...COMMON_STEPS, ...flow.steps, CONTACT_STEP];
}

function getCurrentStep() {
  const steps = getJourneySteps();
  return steps[state.currentStep] || null;
}

function renderJourney() {
  const flow = getSelectedFlow();
  const steps = getJourneySteps();
  const step = getCurrentStep();
  if (!flow || !step) return;

  journeyFlowTitle.textContent = `${flow.icon} ${flow.title}`;
  stepTitle.textContent = step.title;
  stepDescription.textContent = step.description;
  stepCounter.textContent = `الخطوة ${state.currentStep + 1} من ${steps.length}`;

  const progress = Math.round(((state.currentStep + 1) / steps.length) * 100);
  progressBar.style.width = `${progress}%`;

  const visibleFields = getVisibleFields(step);
  stepContent.innerHTML = visibleFields.map((field) => renderField(field)).join("");

  prevStepBtn.disabled = state.currentStep === 0;
  prevStepBtn.classList.toggle("opacity-50", state.currentStep === 0);
  prevStepBtn.classList.toggle("cursor-not-allowed", state.currentStep === 0);

  const isLastStep = state.currentStep === steps.length - 1;
  nextStepBtn.classList.toggle("hidden", isLastStep);
  submitRequestBtn.classList.toggle("hidden", !isLastStep);

  if (state.submitting) {
    submitRequestBtn.disabled = true;
    submitRequestBtn.textContent = "جاري إصدار الطلب...";
  } else {
    submitRequestBtn.disabled = false;
    submitRequestBtn.textContent = "إصدار رقم الطلب";
  }

  journeyMood.textContent = flow.mood;
  renderSummary();
}

function getVisibleFields(step) {
  return (step.fields || []).filter((field) => {
    if (!field.showIf) return true;
    if (typeof field.showIf === "function") return field.showIf(state.answers);
    return true;
  });
}

function renderField(field) {
  const value = state.answers[field.name] || "";
  const error = state.fieldErrors[field.name];
  const requiredStar = field.required ? '<span class="text-rose-600">*</span>' : "";

  if (field.type === "cards") {
    const options = (field.options || [])
      .map((option) => {
        const selected = value === option.value;
        return `
          <button
            type="button"
            data-card-option="true"
            data-field="${field.name}"
            data-value="${option.value}"
            class="rounded-2xl border px-3 py-3 text-right transition ${
              selected
                ? "border-waqf-500 bg-waqf-100 shadow-soft"
                : "border-waqf-200 bg-white hover:border-waqf-300 hover:bg-waqf-50"
            }"
          >
            <div class="flex items-start gap-3">
              <span class="mt-0.5 text-lg">${option.icon || "•"}</span>
              <div>
                <p class="text-sm font-bold text-waqf-900">${option.label}</p>
                <p class="mt-1 text-xs leading-6 text-waqf-700">${option.description || ""}</p>
              </div>
            </div>
          </button>
        `;
      })
      .join("");

    return `
      <section class="space-y-2">
        <label class="block text-sm font-bold text-waqf-800">${field.label} ${requiredStar}</label>
        <div class="grid gap-2 md:grid-cols-2">${options}</div>
        ${error ? `<p class="text-xs font-semibold text-rose-600">${error}</p>` : ""}
      </section>
    `;
  }

  if (field.type === "select") {
    const options = (field.options || [])
      .map(
        (option) =>
          `<option value="${option.value}" ${value === option.value ? "selected" : ""}>${option.label}</option>`
      )
      .join("");

    return `
      <label class="block space-y-2">
        <span class="text-sm font-bold text-waqf-800">${field.label} ${requiredStar}</span>
        <select
          name="${field.name}"
          class="w-full rounded-xl border ${error ? "border-rose-400" : "border-waqf-200"} px-3 py-2 text-sm text-waqf-900 outline-none ring-waqf-200 transition focus:ring-2"
        >
          <option value="">اختر</option>
          ${options}
        </select>
        ${error ? `<span class="text-xs font-semibold text-rose-600">${error}</span>` : ""}
      </label>
    `;
  }

  if (field.type === "textarea") {
    return `
      <label class="block space-y-2">
        <span class="text-sm font-bold text-waqf-800">${field.label} ${requiredStar}</span>
        <textarea
          name="${field.name}"
          rows="4"
          placeholder="${field.placeholder || ""}"
          class="w-full rounded-xl border ${error ? "border-rose-400" : "border-waqf-200"} px-3 py-2 text-sm text-waqf-900 outline-none ring-waqf-200 transition focus:ring-2"
        >${escapeHtml(value)}</textarea>
        ${error ? `<span class="text-xs font-semibold text-rose-600">${error}</span>` : ""}
      </label>
    `;
  }

  return `
    <label class="block space-y-2">
      <span class="text-sm font-bold text-waqf-800">${field.label} ${requiredStar}</span>
      <input
        name="${field.name}"
        type="${field.type || "text"}"
        value="${escapeHtml(value)}"
        placeholder="${field.placeholder || ""}"
        min="${field.min ?? ""}"
        max="${field.max ?? ""}"
        step="${field.step ?? ""}"
        class="w-full rounded-xl border ${error ? "border-rose-400" : "border-waqf-200"} px-3 py-2 text-sm text-waqf-900 outline-none ring-waqf-200 transition focus:ring-2"
      />
      ${error ? `<span class="text-xs font-semibold text-rose-600">${error}</span>` : ""}
    </label>
  `;
}

function handleFieldInput(event) {
  const target = event.target;
  if (!target?.name) return;

  state.answers[target.name] = (target.value || "").trim();
  delete state.fieldErrors[target.name];
  clearFormError();
  renderSummary();
}

function handleCardChoice(event) {
  const button = event.target.closest("[data-card-option='true']");
  if (!button) return;

  const field = button.dataset.field;
  const value = button.dataset.value;
  if (!field) return;

  state.answers[field] = value;
  delete state.fieldErrors[field];
  clearFormError();
  renderJourney();
}

function goToNextStep() {
  const step = getCurrentStep();
  if (!step) return;

  const valid = validateStep(step, true);
  if (!valid.ok) return;

  state.currentStep += 1;
  clearFormError();
  renderJourney();
}

function goToPreviousStep() {
  if (state.currentStep === 0) return;
  state.currentStep -= 1;
  clearFormError();
  renderJourney();
}

function validateStep(step, showError) {
  const visibleFields = getVisibleFields(step);
  const fieldErrors = {};

  visibleFields.forEach((field) => {
    const value = (state.answers[field.name] || "").toString().trim();

    if (field.required && !value) {
      fieldErrors[field.name] = "هذا الحقل مطلوب";
      return;
    }

    if (!value) return;

    if (field.type === "number") {
      const num = Number(value);
      if (!Number.isFinite(num)) {
        fieldErrors[field.name] = "القيمة يجب أن تكون رقمًا صحيحًا";
        return;
      }

      if (typeof field.min === "number" && num < field.min) {
        fieldErrors[field.name] = `يجب ألا تقل القيمة عن ${field.min}`;
        return;
      }

      if (typeof field.max === "number" && num > field.max) {
        fieldErrors[field.name] = `يجب ألا تزيد القيمة عن ${field.max}`;
      }
    }

    if (field.name === "phone" && !PHONE_REGEX.test(value)) {
      fieldErrors[field.name] = "اكتب رقم جوال سعودي صحيح مثل 05xxxxxxxx";
    }

    if (field.type === "email" && value && !/^\S+@\S+\.\S+$/.test(value)) {
      fieldErrors[field.name] = "صيغة البريد الإلكتروني غير صحيحة";
    }
  });

  const ok = Object.keys(fieldErrors).length === 0;

  if (showError) {
    state.fieldErrors = fieldErrors;
    renderJourney();
    if (!ok) {
      const firstField = visibleFields.find((field) => fieldErrors[field.name]);
      showFormError(`الرجاء استكمال: ${firstField?.label || "الحقول المطلوبة"}`);
    }
  }

  return { ok, fieldErrors };
}

function validateAllSteps() {
  const steps = getJourneySteps();
  for (let idx = 0; idx < steps.length; idx += 1) {
    const step = steps[idx];
    const validation = validateStep(step, false);
    if (!validation.ok) {
      return { ok: false, stepIndex: idx, fieldErrors: validation.fieldErrors };
    }
  }

  const flow = getSelectedFlow();
  if (flow?.id === "buy_over_million") {
    if (Number(state.answers.available_amount || 0) < 1000000) {
      return {
        ok: false,
        stepIndex: findStepIndexByField("available_amount"),
        fieldErrors: { available_amount: "هذا المسار للمبالغ من مليون ريال فأكثر" }
      };
    }
  }

  if (flow?.id === "contribute_under_million") {
    if (Number(state.answers.contribution_amount || 0) >= 1000000) {
      return {
        ok: false,
        stepIndex: findStepIndexByField("contribution_amount"),
        fieldErrors: { contribution_amount: "هذا المسار مخصص للمبالغ الأقل من مليون ريال" }
      };
    }
  }

  return { ok: true };
}

function findStepIndexByField(fieldName) {
  return getJourneySteps().findIndex((step) => step.fields.some((field) => field.name === fieldName));
}

async function handleSubmitRequest(event) {
  event.preventDefault();

  if (state.submitting) return;

  const flow = getSelectedFlow();
  if (!flow) return;

  clearSystemAlert();

  const finalValidation = validateAllSteps();
  if (!finalValidation.ok) {
    state.currentStep = Math.max(finalValidation.stepIndex, 0);
    state.fieldErrors = finalValidation.fieldErrors;
    showFormError("أكمل الحقول المطلوبة قبل إصدار رقم الطلب.");
    renderJourney();
    return;
  }

  if (!supabaseClient) {
    showSystemAlert("لا يمكن الإرسال الآن لأن إعدادات Supabase غير مكتملة في config.js.", "warn");
    return;
  }

  state.submitting = true;
  renderJourney();

  try {
    const outcome = evaluateOutcome(flow, state.answers);
    const timeline = [
      {
        status: "تم استلام الطلب",
        note: "تم تسجيل الطلب عبر المنصة بنجاح.",
        at: new Date().toISOString()
      },
      {
        status: outcome.initialStatus,
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
      p_status: outcome.initialStatus,
      p_required_actions: outcome.requiredActions,
      p_timeline: timeline
    };

    const { data, error } = await supabaseClient.rpc("create_waqf_request", payload);

    if (error) throw error;

    const created = Array.isArray(data) ? data[0] : data;
    if (!created?.request_number) {
      throw new Error("تعذر إصدار رقم الطلب من الخادم.");
    }

    renderResult({
      requestNumber: created.request_number,
      createdAt: created.created_at || new Date().toISOString(),
      flow,
      outcome
    });

    journeyPanel.classList.add("hidden");
    resultCard.classList.remove("hidden");
    state.selectedFlowId = null;
    state.currentStep = 0;
    state.answers = {};
    state.fieldErrors = {};
  } catch (error) {
    showSystemAlert(`فشل إرسال الطلب: ${error.message || "خطأ غير متوقع"}`, "error");
  } finally {
    state.submitting = false;
    renderJourneyIfActive();
  }
}

function renderJourneyIfActive() {
  if (state.selectedFlowId) {
    renderJourney();
  }
}

function renderResult({ requestNumber, createdAt, flow, outcome }) {
  resultCard.innerHTML = `
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div>
        <p class="text-xs font-bold text-emerald-700">تم إصدار الطلب بنجاح</p>
        <h3 class="mt-1 text-xl font-extrabold text-emerald-900">رقم الطلب: <span class="rounded-lg bg-white px-2 py-1 text-base">${requestNumber}</span></h3>
      </div>
      <span class="rounded-xl bg-emerald-100 px-3 py-2 text-2xl">✅</span>
    </div>

    <div class="mt-4 space-y-2 text-sm leading-7 text-emerald-900">
      <p><strong>المسار:</strong> ${flow.title}</p>
      <p><strong>النتيجة المبدئية:</strong> ${outcome.routeResult}</p>
      <p><strong>التوصية:</strong> ${outcome.recommendation}</p>
      <p><strong>الحالة الحالية:</strong> <span class="rounded-full bg-white px-2 py-1 text-xs font-bold">${outcome.initialStatus}</span></p>
      <p><strong>تاريخ الإنشاء:</strong> ${formatDate(createdAt)}</p>
    </div>

    <div class="mt-3 space-y-2">
      ${outcome.requiredActions
        .map(
          (action) =>
            `<div class="rounded-xl border border-emerald-200 bg-white px-3 py-2 text-xs font-semibold text-emerald-800">${action}</div>`
        )
        .join("")}
    </div>

    <div class="mt-4 flex flex-wrap gap-2">
      <button id="result-track-btn" type="button" class="rounded-xl bg-emerald-700 px-4 py-2 text-sm font-bold text-white transition hover:bg-emerald-800">متابعة الطلب الآن</button>
      <button id="result-new-btn" type="button" class="rounded-xl border border-emerald-300 px-4 py-2 text-sm font-bold text-emerald-800 transition hover:bg-emerald-100">بدء طلب جديد</button>
    </div>
  `;

  document.getElementById("result-track-btn")?.addEventListener("click", () => {
    setActiveTab("track");
    const input = document.getElementById("request-number");
    input.value = requestNumber;
    input.focus();
  });

  document.getElementById("result-new-btn")?.addEventListener("click", () => {
    resultCard.classList.add("hidden");
    setActiveTab("start");
  });
}

function evaluateOutcome(flow, answers) {
  if (flow.id === "buy_over_million") {
    const amount = Number(answers.available_amount || 0);
    const elite = amount >= 5000000;

    return {
      routeResult: elite ? "مسار الأوقاف الكبرى" : "مسار تأسيس وقف جديد بشراء أصل",
      recommendation: elite
        ? "نوصي بتخصيص مستشار استثماري ولجنة تأسيس مختصرة لعقد جلسة أولى خلال أسبوع."
        : "نوصي ببدء دراسة خيارات الأصل في المدينة المستهدفة وإعداد إطار حوكمة أولي.",
      initialStatus: answers.readiness === "immediate" ? "قيد التواصل العاجل" : "قيد الدراسة الأولية",
      timelineNote:
        answers.readiness === "immediate"
          ? "تم رفع أولوية الطلب لمسار عاجل والبدء في ترتيب موعد قريب."
          : "تم إدراج الطلب ضمن مسار التخطيط المنظم بحسب جاهزية التنفيذ.",
      requiredActions: [
        "تجهيز ما يثبت الملاءة المالية",
        "تحديد 2-3 خيارات موقع مبدئية",
        answers.wants_partnership === "yes" ? "توضيح نموذج الشراكة المفضل" : "تأكيد نموذج الوقف المستقل"
      ]
    };
  }

  if (flow.id === "have_asset_convert") {
    const hasDocs = answers.has_legal_docs === "yes";
    const noDisputes = answers.has_disputes === "no";
    const ready = hasDocs && noDisputes;

    return {
      routeResult: "تقييم الأصل والتحويل الوقفي",
      recommendation: ready
        ? "الأصل جاهز مبدئيًا للعرض على اللجنة الشرعية والنظامية للتحويل المباشر."
        : "يلزم استكمال الوثائق أو معالجة الالتزامات قبل اعتماد التحويل النهائي.",
      initialStatus: ready ? "مؤهل للعرض على اللجنة" : "بانتظار استكمال المتطلبات",
      timelineNote: ready
        ? "تم تصنيف الطلب كجاهز للتحويل المبدئي بعد التحقق الأولي."
        : "تم تحديد نواقص تؤثر على سرعة التحويل الوقفي.",
      requiredActions: [
        hasDocs ? "رفع نسخ الصكوك والوثائق الحالية" : "استكمال وثائق الملكية المعتمدة",
        noDisputes ? "إرفاق إقرار خلو النزاعات" : "تسوية النزاعات أو الالتزامات القائمة",
        "توفير تقييم حديث للأصل"
      ]
    };
  }

  if (flow.id === "transfer_nazir") {
    const hasCourt = answers.has_court_approval === "yes";
    const hasFamily = answers.has_family_approval === "yes";

    return {
      routeResult: "نقل النظارة إلى جمعية مدكر",
      recommendation: hasCourt
        ? "الطلب جاهز للمعالجة القانونية واعتماد خطة نقل النظارة رسميًا."
        : "نوصي باستكمال الموافقة القضائية أولاً لتسريع اعتماد النقل.",
      initialStatus: hasCourt ? "قيد اعتماد النقل" : "بانتظار مستندات نظامية",
      timelineNote: hasCourt
        ? "تم تحويل الطلب للفريق القانوني لبدء إجراءات النقل."
        : "المعاملة تحتاج مستندات رسمية إضافية قبل المتابعة.",
      requiredActions: [
        hasFamily ? "إرفاق موافقات ذوي العلاقة" : "استكمال موافقات ذوي العلاقة",
        hasCourt ? "إرفاق قرار الموافقة القضائية" : "استكمال الموافقة القضائية",
        "تجهيز ملف التسليم الإداري للوقف"
      ]
    };
  }

  const amount = Number(answers.contribution_amount || 0);
  const tier = amount >= 100000 ? "شريك مساهم" : amount >= 10000 ? "مساهم داعم" : "مساهم";

  return {
    routeResult: `المساهمة في وقف قيد الإنشاء - فئة ${tier}`,
    recommendation:
      answers.payment_type === "installments"
        ? "سيتم إرسال خطة دفعات واضحة بعد اعتماد عدد الأشهر."
        : answers.payment_type === "monthly"
          ? "سيتم تفعيل مسار مساهمة شهرية مع إشعارات متابعة منتظمة."
          : "سيتم إصدار فاتورة مساهمة مباشرة للإتمام الفوري.",
    initialStatus:
      answers.payment_type === "installments"
        ? "بانتظار جدولة الدفعات"
        : answers.payment_type === "monthly"
          ? "بانتظار تفعيل المساهمة الشهرية"
          : "بانتظار إصدار الفاتورة",
    timelineNote:
      answers.payment_type === "installments"
        ? "تم تحويل الطلب لمسار ترتيب الدفعات الميسرة."
        : answers.payment_type === "monthly"
          ? "تم تحويل الطلب لمسار المساهمة الشهرية المستمرة."
          : "تم تحويل الطلب لمسار الفاتورة المباشرة.",
    requiredActions: [
      "تأكيد مبلغ المساهمة",
      answers.named_supporter === "yes" ? "تأكيد صيغة الاسم في سجل المساهمين" : "تأكيد خيار عدم إظهار الاسم",
      answers.payment_type === "full"
        ? "إتمام السداد عبر القناة المختارة"
        : answers.payment_type === "installments"
          ? "اعتماد جدول الدفعات"
          : "تأكيد تاريخ الخصم الشهري"
    ]
  };
}

function renderSummary() {
  const flow = getSelectedFlow();
  if (!flow) {
    liveSummary.innerHTML = "";
    journeyCompletion.textContent = "";
    return;
  }

  const steps = getJourneySteps();
  const allFields = steps.flatMap((step) => getVisibleFields(step));
  const requiredFields = allFields.filter((field) => field.required);

  const answeredRequired = requiredFields.filter((field) => {
    const value = state.answers[field.name];
    return value !== undefined && value !== null && String(value).trim() !== "";
  }).length;

  const completionPercent = requiredFields.length
    ? Math.round((answeredRequired / requiredFields.length) * 100)
    : 0;

  journeyCompletion.textContent = `نسبة اكتمال الرحلة: ${completionPercent}% (${answeredRequired}/${requiredFields.length})`;

  const entries = Object.entries(state.answers)
    .filter(([key, value]) => key !== "flow_id" && String(value).trim() !== "")
    .slice(0, 8);

  if (!entries.length) {
    liveSummary.innerHTML =
      '<p class="rounded-xl border border-waqf-200 bg-white px-3 py-2 text-xs text-waqf-700">ابدأ بالإجابة على أول سؤال وسننشئ لك ملخصًا فوريًا.</p>';
    return;
  }

  const allFieldsMap = buildFieldMap();
  liveSummary.innerHTML = entries
    .map(([name, rawValue]) => {
      const field = allFieldsMap[name];
      const label = field?.label || name;
      const value = resolveDisplayValue(field, rawValue);
      return `<div class="rounded-xl border border-waqf-200 bg-white px-3 py-2 text-xs leading-6 text-waqf-800"><strong>${label}:</strong> ${value}</div>`;
    })
    .join("");
}

function buildFieldMap() {
  const map = {};
  [...COMMON_STEPS, ...FLOWS.flatMap((flow) => flow.steps), CONTACT_STEP].forEach((step) => {
    (step.fields || []).forEach((field) => {
      map[field.name] = field;
    });
  });
  return map;
}

function resolveDisplayValue(field, rawValue) {
  if (!field) return rawValue;
  if (["cards", "select"].includes(field.type)) {
    const option = (field.options || []).find((item) => item.value === rawValue);
    return option?.label || rawValue;
  }
  if (field.type === "number") {
    const num = Number(rawValue);
    if (Number.isFinite(num)) return formatNumber(num);
  }
  return rawValue;
}

async function handleTrack(event) {
  event.preventDefault();
  clearSystemAlert();

  const requestNumberInput = document.getElementById("request-number");
  const requestNumber = (requestNumberInput.value || "").trim().toUpperCase();

  if (!requestNumber) {
    showSystemAlert("أدخل رقم الطلب أولًا.", "warn");
    return;
  }

  if (!supabaseClient) {
    showSystemAlert("تعذرت المتابعة لأن إعدادات Supabase غير مكتملة.", "warn");
    return;
  }

  const submitBtn = trackForm.querySelector("button[type='submit']");
  submitBtn.disabled = true;
  submitBtn.textContent = "جاري البحث...";

  try {
    const { data, error } = await supabaseClient.rpc("track_waqf_request", {
      p_request_number: requestNumber
    });

    if (error) throw error;

    const request = Array.isArray(data) ? data[0] : data;

    if (!request) {
      trackResult.innerHTML =
        '<p class="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">لم يتم العثور على طلب بهذا الرقم. تأكد من الرقم وأعد المحاولة.</p>';
      return;
    }

    renderTrackResult(request);
  } catch (error) {
    showSystemAlert(`تعذر جلب حالة الطلب: ${error.message || "خطأ غير متوقع"}`, "error");
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "متابعة الطلب";
  }
}

function renderTrackResult(request) {
  const requiredActions = Array.isArray(request.required_actions) ? request.required_actions : [];
  const timeline = Array.isArray(request.timeline) ? request.timeline : [];

  trackResult.innerHTML = `
    <article class="rounded-2xl border border-waqf-200 bg-waqf-50/70 p-4 shadow-soft">
      <div class="flex flex-wrap items-center justify-between gap-2">
        <h3 class="text-lg font-extrabold text-waqf-900">طلب: <span class="rounded-lg bg-white px-2 py-1 text-sm">${request.request_number}</span></h3>
        <span class="rounded-full bg-white px-3 py-1 text-xs font-bold text-waqf-700">${request.status}</span>
      </div>

      <div class="mt-3 space-y-2 text-sm leading-7 text-waqf-800">
        <p><strong>المسار:</strong> ${request.option_title}</p>
        <p><strong>النتيجة:</strong> ${request.route_result}</p>
        <p><strong>التوصية:</strong> ${request.recommendation}</p>
        <p><strong>آخر تحديث:</strong> ${formatDate(request.updated_at || request.created_at)}</p>
      </div>

      <section class="mt-3">
        <h4 class="text-sm font-extrabold text-waqf-800">المطلوب حاليًا</h4>
        <div class="mt-2 space-y-2">
          ${
            requiredActions.length
              ? requiredActions
                  .map(
                    (action) =>
                      `<div class="rounded-xl border border-waqf-200 bg-white px-3 py-2 text-xs font-semibold text-waqf-800">${action}</div>`
                  )
                  .join("")
              : '<div class="rounded-xl border border-waqf-200 bg-white px-3 py-2 text-xs font-semibold text-waqf-700">لا توجد متطلبات إضافية حاليًا.</div>'
          }
        </div>
      </section>

      <section class="mt-3">
        <h4 class="text-sm font-extrabold text-waqf-800">سجل الحالة</h4>
        <div class="mt-2 space-y-2">
          ${
            timeline.length
              ? timeline
                  .map(
                    (item) => `
                      <div class="rounded-xl border border-waqf-200 bg-white px-3 py-2 text-xs leading-6 text-waqf-800">
                        <p class="font-bold">${item.status || "تحديث"}</p>
                        <p>${item.note || ""}</p>
                        <p class="text-[11px] text-waqf-600">${formatDate(item.at || request.updated_at || request.created_at)}</p>
                      </div>
                    `
                  )
                  .join("")
              : '<div class="rounded-xl border border-waqf-200 bg-white px-3 py-2 text-xs font-semibold text-waqf-700">لا يوجد سجل زمني مفصل حتى الآن.</div>'
          }
        </div>
      </section>
    </article>
  `;
}

function showSystemAlert(message, type = "warn") {
  systemAlert.classList.remove("hidden", "border-amber-300", "bg-amber-50", "text-amber-900", "border-rose-300", "bg-rose-50", "text-rose-800");

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

function showFormError(message) {
  formError.classList.remove("hidden");
  formError.textContent = message;
}

function clearFormError() {
  formError.classList.add("hidden");
  formError.textContent = "";
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

function formatNumber(value) {
  return new Intl.NumberFormat("ar-SA").format(value);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
