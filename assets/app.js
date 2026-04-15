(() => {
  const STORAGE_KEY = "mcmp_pmp_data_v2";
  const LEGACY_STORAGE_KEYS = ["mcmp_data_v1"];
  const SESSION_KEY = "mcmp_session_v1";

  const ROLE_LABELS = {
    Admin: "الإدارة العليا",
    "Marketing Manager": "مدير التسويق",
    "Branch Manager": "مدير فرع",
    Ambassador: "سفير",
    Viewer: "عرض فقط"
  };

  const STAGE_ORDER = ["Initiation", "Planning", "Execution", "Monitoring", "Closing"];

  const PAGE = document.body?.dataset?.page || "";

  document.addEventListener("DOMContentLoaded", () => {
    try {
      if (PAGE === "index") {
        initIndexPage();
        return;
      }

      if (PAGE === "app") {
        initAppPage();
        return;
      }

      if (PAGE === "public") {
        initPublicPage();
        return;
      }

      if (PAGE === "teacher") {
        initTeacherPublicPage();
        return;
      }

      if (PAGE === "error-page") {
        initErrorPage();
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      if (PAGE !== "error-page") {
        window.location.href = "error.html";
      }
    }
  });

  function initIndexPage() {
    const data = ensureStore();
    const session = getSession();

    if (session?.userId && data.users.some((user) => user.id === session.userId)) {
      window.location.href = "app.html";
      return;
    }

    const statusEl = byId("index-status");
    const bootstrapSection = byId("bootstrap-section");
    const loginSection = byId("login-section");
    const bootstrapForm = byId("bootstrap-form");
    const loginForm = byId("login-form");
    const demoUsersList = byId("demo-users-list");

    const hasUsers = data.users.length > 0;
    bootstrapSection.classList.toggle("hidden", hasUsers);
    loginSection.classList.toggle("hidden", !hasUsers);

    renderDemoUsers(data.users, demoUsersList);

    const msg = new URLSearchParams(window.location.search).get("msg");
    if (msg) {
      setStatus(statusEl, decodeURIComponent(msg), "info");
    }

    bootstrapForm?.addEventListener("submit", (event) => {
      event.preventDefault();
      const payload = formToObject(bootstrapForm);

      if (!payload.name || !payload.email || !payload.password || !payload.branch || !payload.phone) {
        setStatus(statusEl, "يرجى تعبئة جميع حقول التهيئة.", "error");
        return;
      }

      if (payload.password.length < 6) {
        setStatus(statusEl, "كلمة المرور يجب ألا تقل عن 6 أحرف.", "error");
        return;
      }

      const email = payload.email.trim().toLowerCase();
      if (data.users.some((user) => user.email === email)) {
        setStatus(statusEl, "هذا البريد مستخدم بالفعل.", "error");
        return;
      }

      const branch = ensureBranch(data, payload.branch.trim());
      const adminUser = {
        id: uid(),
        name: payload.name.trim(),
        email,
        password: payload.password,
        phone: payload.phone.trim(),
        role: "Admin",
        branchId: branch.id,
        referralCode: "",
        isDemo: false,
        createdAt: nowISO()
      };

      data.users.push(adminUser);
      seedOperationalData(data, adminUser);
      saveStore(data);
      setSession({ userId: adminUser.id });

      showToast("تم إنشاء المدير الأول.", "success");
      window.location.href = "app.html";
    });

    loginForm?.addEventListener("submit", (event) => {
      event.preventDefault();
      const payload = formToObject(loginForm);
      const email = (payload.email || "").trim().toLowerCase();
      const password = payload.password || "";

      const user = data.users.find((item) => item.email === email && item.password === password);
      if (!user) {
        setStatus(statusEl, "بيانات الدخول غير صحيحة.", "error");
        showToast("تعذر تسجيل الدخول.", "error");
        return;
      }

      setSession({ userId: user.id });
      showToast("تم تسجيل الدخول بنجاح.", "success");
      window.location.href = "app.html";
    });
  }

  function initAppPage() {
    const data = ensureStore();
    const session = getSession();
    const user = data.users.find((item) => item.id === session?.userId);

    if (!user) {
      window.location.href = "index.html?msg=" + encodeURIComponent("يرجى تسجيل الدخول أولاً");
      return;
    }

    const ui = {
      status: byId("app-status"),
      logoutBtn: byId("logout-btn"),
      userName: byId("user-name"),
      userRole: byId("user-role"),
      scopeBadge: byId("scope-badge"),

      achievementCircle: byId("achievement-circle"),
      achievementCircleText: byId("achievement-circle-text"),
      achievementBar: byId("achievement-progress-bar"),
      achievementLabel: byId("achievement-progress-label"),

      kpiProjectProgress: byId("kpi-project-progress"),
      kpiPlanVsActual: byId("kpi-plan-vs-actual"),
      kpiTeamCompletion: byId("kpi-team-completion"),
      kpiGoalsCompletion: byId("kpi-goals-completion"),
      kpiOpenRisks: byId("kpi-open-risks"),
      kpiRoi: byId("kpi-roi"),

      campaignForm: byId("campaign-form"),
      campaignStart: byId("campaign-start"),
      campaignEnd: byId("campaign-end"),
      campaignManager: byId("campaign-manager"),

      donationForm: byId("donation-form"),
      donationDate: byId("donation-date"),
      donationCampaign: byId("donation-campaign"),
      donationProject: byId("donation-project"),
      donationChannel: byId("donation-channel"),

      lifecycleFilter: byId("lifecycle-campaign-filter"),
      lifecycleState: byId("lifecycle-state"),
      lifecycleContent: byId("lifecycle-content"),

      taskForm: byId("task-form"),
      taskCampaign: byId("task-campaign"),
      taskOwner: byId("task-owner"),
      taskStart: byId("task-start"),
      taskEnd: byId("task-end"),
      taskBoardFilter: byId("task-board-campaign-filter"),
      kanbanState: byId("kanban-state"),
      kanbanBoard: byId("kanban-board"),
      kanbanPending: byId("kanban-pending"),
      kanbanProgress: byId("kanban-progress"),
      kanbanDone: byId("kanban-done"),
      kanbanCountPending: byId("kanban-count-pending"),
      kanbanCountProgress: byId("kanban-count-progress"),
      kanbanCountDone: byId("kanban-count-done"),

      goalForm: byId("goal-form"),
      goalCampaign: byId("goal-campaign"),
      goalDeadline: byId("goal-deadline"),
      goalsState: byId("goals-state"),
      goalsContent: byId("goals-content"),

      riskForm: byId("risk-form"),
      riskCampaign: byId("risk-campaign"),
      riskOwner: byId("risk-owner"),
      risksState: byId("risks-state"),
      risksContent: byId("risks-content"),

      allocationForm: byId("allocation-form"),
      allocationCampaign: byId("allocation-campaign"),
      allocationChannel: byId("allocation-channel"),
      budgetState: byId("budget-state"),
      budgetContent: byId("budget-content"),

      filterForm: byId("filter-form"),
      searchInput: byId("search-input"),
      campaignFilter: byId("campaign-filter"),
      channelFilter: byId("channel-filter"),
      projectFilter: byId("project-filter"),
      sortFilter: byId("sort-filter"),
      resetFiltersBtn: byId("reset-filters-btn"),
      simulateErrorBtn: byId("simulate-error-btn"),

      donationsState: byId("donations-panel-state"),
      donationsContent: byId("donations-content"),
      donationsCountBadge: byId("donations-count-badge"),

      channelsContent: byId("channels-content"),
      teamPerformanceContent: byId("team-performance-content"),
      reportsContent: byId("reports-content"),
      exportCsvBtn: byId("export-csv-btn")
    };

    ui.userName.textContent = esc(user.name);
    ui.userRole.textContent = ROLE_LABELS[user.role] || user.role;
    ui.scopeBadge.textContent = scopeLabel(user, data);

    ui.campaignStart.value = todayISO();
    ui.campaignEnd.value = dateAfterDays(30);
    ui.donationDate.value = todayISO();
    ui.taskStart.value = todayISO();
    ui.taskEnd.value = dateAfterDays(7);
    ui.goalDeadline.value = dateAfterDays(30);

    const appState = {
      filters: {
        search: "",
        campaign: "all",
        channel: "all",
        project: "all",
        sort: "latest"
      },
      lifecycleCampaignId: "all",
      taskBoardCampaignId: "all",
      simulateDonationsError: false
    };

    applyRoleVisibility(user, ui);
    fillAppSelectOptions(data, ui, user);

    ui.logoutBtn?.addEventListener("click", () => {
      clearSession();
      window.location.href = "index.html?msg=" + encodeURIComponent("تم تسجيل الخروج");
    });

    ui.campaignForm?.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!canEditCampaigns(user)) {
        showToast("ليس لديك صلاحية إنشاء حملات.", "error");
        return;
      }

      const payload = formToObject(ui.campaignForm);
      const validation = validateCampaignPayload(payload);
      if (!validation.ok) {
        setStatus(ui.status, validation.message, "error");
        return;
      }

      const campaign = {
        id: uid(),
        projectId: nextProjectId(data),
        name: payload.name.trim(),
        type: payload.type,
        projectManagerId: payload.managerId,
        startDate: payload.startDate,
        endDate: payload.endDate,
        budget: Number(payload.budget),
        targetAmount: Number(payload.target),
        status: payload.status,
        currentStage: payload.stage,
        scope: payload.scope.trim(),
        quality: payload.quality.trim(),
        charter: payload.charter.trim(),
        branchId: user.branchId || data.branches[0]?.id || "",
        createdBy: user.id,
        createdAt: nowISO(),
        closedAt: payload.status === "Completed" ? nowISO() : ""
      };

      data.campaigns.push(campaign);
      saveStore(data);

      ui.campaignForm.reset();
      ui.campaignStart.value = todayISO();
      ui.campaignEnd.value = dateAfterDays(30);
      fillAppSelectOptions(data, ui, user);
      renderAppDashboard(data, user, ui, appState);

      setStatus(ui.status, `تم إنشاء مشروع الحملة (${campaign.projectId}).`, "info");
      showToast("تم إنشاء مشروع الحملة.", "success");
    });

    ui.donationForm?.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!canRecordDonations(user)) {
        showToast("ليس لديك صلاحية تسجيل التبرعات.", "error");
        return;
      }

      const payload = formToObject(ui.donationForm);
      const validation = validateDonationPayload(payload);
      if (!validation.ok) {
        setStatus(ui.status, validation.message, "error");
        return;
      }

      const referralCode = (payload.referral || "").trim().toUpperCase();
      const ambassador = data.ambassadors.find((item) => item.code.toUpperCase() === referralCode);
      const campaign = data.campaigns.find((item) => item.id === payload.campaign);

      const donation = {
        id: uid(),
        donorPhone: payload.donorPhone.trim(),
        amount: Number(payload.amount),
        date: payload.date,
        campaignId: payload.campaign,
        projectId: payload.project,
        channelId: payload.channel,
        referralCode,
        branchId: ambassador?.branchId || campaign?.branchId || user.branchId || "",
        createdBy: user.id,
        createdAt: nowISO()
      };

      data.donations.unshift(donation);
      saveStore(data);

      ui.donationForm.reset();
      ui.donationDate.value = todayISO();
      renderAppDashboard(data, user, ui, appState);

      setStatus(ui.status, "تم تسجيل التبرع وربطه بالمشروع.", "info");
      showToast("تم تسجيل التبرع.", "success");
    });

    ui.taskForm?.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!canManageTasks(user)) {
        showToast("ليس لديك صلاحية إدارة المهام.", "error");
        return;
      }

      const payload = formToObject(ui.taskForm);
      const validation = validateTaskPayload(payload);
      if (!validation.ok) {
        setStatus(ui.status, validation.message, "error");
        return;
      }

      const task = {
        id: uid(),
        name: payload.name.trim(),
        ownerId: payload.ownerId,
        role: payload.role,
        campaignId: payload.campaignId,
        startDate: payload.startDate,
        endDate: payload.endDate,
        status: payload.status,
        priority: payload.priority,
        createdAt: nowISO(),
        createdBy: user.id
      };

      data.tasks.push(task);
      saveStore(data);

      ui.taskForm.reset();
      ui.taskStart.value = todayISO();
      ui.taskEnd.value = dateAfterDays(7);
      renderAppDashboard(data, user, ui, appState);

      setStatus(ui.status, "تمت إضافة المهمة بنجاح.", "info");
      showToast("تمت إضافة مهمة جديدة.", "success");
    });

    ui.goalForm?.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!canManageGoalsRisks(user)) {
        showToast("ليس لديك صلاحية إدارة الأهداف.", "error");
        return;
      }

      const payload = formToObject(ui.goalForm);
      const validation = validateGoalPayload(payload);
      if (!validation.ok) {
        setStatus(ui.status, validation.message, "error");
        return;
      }

      const goal = {
        id: uid(),
        title: payload.title.trim(),
        goalType: payload.goalType,
        campaignId: payload.campaignId,
        linkedType: payload.linkedType,
        linkedId: payload.linkedId.trim(),
        targetValue: Number(payload.targetValue),
        currentValue: Number(payload.currentValue),
        deadline: payload.deadline,
        smart: {
          specific: payload.specific.trim(),
          measurable: payload.measurable.trim(),
          achievable: payload.achievable.trim(),
          relevant: payload.achievable.trim(),
          timeBound: payload.deadline
        },
        createdBy: user.id,
        createdAt: nowISO()
      };

      data.goals.push(goal);
      saveStore(data);

      ui.goalForm.reset();
      ui.goalDeadline.value = dateAfterDays(30);
      renderAppDashboard(data, user, ui, appState);

      setStatus(ui.status, "تمت إضافة هدف SMART بنجاح.", "info");
      showToast("تمت إضافة الهدف.", "success");
    });

    ui.riskForm?.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!canManageGoalsRisks(user)) {
        showToast("ليس لديك صلاحية إدارة المخاطر.", "error");
        return;
      }

      const payload = formToObject(ui.riskForm);
      const validation = validateRiskPayload(payload);
      if (!validation.ok) {
        setStatus(ui.status, validation.message, "error");
        return;
      }

      const risk = {
        id: uid(),
        title: payload.title.trim(),
        campaignId: payload.campaignId,
        probability: payload.probability,
        impact: payload.impact,
        mitigation: payload.mitigation.trim(),
        ownerId: payload.ownerId,
        status: payload.status,
        createdBy: user.id,
        createdAt: nowISO()
      };

      data.risks.push(risk);
      saveStore(data);

      ui.riskForm.reset();
      renderAppDashboard(data, user, ui, appState);

      setStatus(ui.status, "تمت إضافة خطر جديد.", "info");
      showToast("تم تحديث سجل المخاطر.", "success");
    });

    ui.allocationForm?.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!canEditCampaigns(user)) {
        showToast("ليس لديك صلاحية إدارة الميزانية.", "error");
        return;
      }

      const payload = formToObject(ui.allocationForm);
      const validation = validateAllocationPayload(payload);
      if (!validation.ok) {
        setStatus(ui.status, validation.message, "error");
        return;
      }

      const planned = Number(payload.plannedBudget);
      const spent = Number(payload.spentBudget);

      const existing = data.channelAllocations.find(
        (item) => item.campaignId === payload.campaignId && item.channelId === payload.channelId
      );

      if (existing) {
        existing.plannedBudget = planned;
        existing.spentBudget = spent;
        existing.updatedAt = nowISO();
      } else {
        data.channelAllocations.push({
          id: uid(),
          campaignId: payload.campaignId,
          channelId: payload.channelId,
          plannedBudget: planned,
          spentBudget: spent,
          createdAt: nowISO(),
          updatedAt: ""
        });
      }

      saveStore(data);
      renderAppDashboard(data, user, ui, appState);

      setStatus(ui.status, "تم حفظ توزيع الميزانية.", "info");
      showToast("تم تحديث ميزانية القنوات.", "success");
    });

    ui.filterForm?.addEventListener("submit", (event) => {
      event.preventDefault();
      appState.filters = readDonationFilters(ui);
      renderAppDashboard(data, user, ui, appState);
    });

    ui.searchInput?.addEventListener("input", () => {
      appState.filters.search = ui.searchInput.value.trim();
      renderAppDashboard(data, user, ui, appState);
    });

    ui.resetFiltersBtn?.addEventListener("click", () => {
      appState.filters = {
        search: "",
        campaign: "all",
        channel: "all",
        project: "all",
        sort: "latest"
      };

      ui.searchInput.value = "";
      ui.campaignFilter.value = "all";
      ui.channelFilter.value = "all";
      ui.projectFilter.value = "all";
      ui.sortFilter.value = "latest";

      renderAppDashboard(data, user, ui, appState);
    });

    ui.simulateErrorBtn?.addEventListener("click", () => {
      appState.simulateDonationsError = !appState.simulateDonationsError;
      ui.simulateErrorBtn.textContent = appState.simulateDonationsError ? "إيقاف محاكاة الخطأ" : "محاكاة خطأ";
      renderAppDashboard(data, user, ui, appState);
    });

    ui.lifecycleFilter?.addEventListener("change", () => {
      appState.lifecycleCampaignId = ui.lifecycleFilter.value || "all";
      renderAppDashboard(data, user, ui, appState);
    });

    ui.taskBoardFilter?.addEventListener("change", () => {
      appState.taskBoardCampaignId = ui.taskBoardFilter.value || "all";
      renderAppDashboard(data, user, ui, appState);
    });

    ui.lifecycleContent?.addEventListener("click", (event) => {
      const button = event.target.closest("[data-stage-action]");
      if (!button) return;

      if (!canEditCampaigns(user)) {
        showToast("ليس لديك صلاحية تحديث مراحل المشروع.", "error");
        return;
      }

      const campaignId = button.getAttribute("data-campaign-id");
      const action = button.getAttribute("data-stage-action");
      const campaign = data.campaigns.find((item) => item.id === campaignId);
      if (!campaign) return;

      const currentIndex = Math.max(0, STAGE_ORDER.indexOf(campaign.currentStage));
      let nextIndex = currentIndex;

      if (action === "next" && currentIndex < STAGE_ORDER.length - 1) {
        nextIndex += 1;
      }

      if (action === "prev" && currentIndex > 0) {
        nextIndex -= 1;
      }

      campaign.currentStage = STAGE_ORDER[nextIndex];
      if (nextIndex === 0) {
        campaign.status = "Planning";
        campaign.closedAt = "";
      } else if (nextIndex === STAGE_ORDER.length - 1) {
        campaign.status = "Completed";
        campaign.closedAt = nowISO();
      } else {
        campaign.status = "Active";
        campaign.closedAt = "";
      }

      saveStore(data);
      renderAppDashboard(data, user, ui, appState);
      showToast("تم تحديث مرحلة المشروع.", "success");
    });

    ui.kanbanBoard?.addEventListener("click", (event) => {
      const button = event.target.closest("[data-task-action]");
      if (!button) return;

      if (!canManageTasks(user)) {
        showToast("ليس لديك صلاحية تحديث حالة المهام.", "error");
        return;
      }

      const taskId = button.getAttribute("data-task-id");
      const action = button.getAttribute("data-task-action");
      const task = data.tasks.find((item) => item.id === taskId);
      if (!task) return;

      const transitions = {
        start: "In Progress",
        complete: "Done",
        hold: "Pending",
        reopen: "In Progress"
      };

      const nextStatus = transitions[action];
      if (!nextStatus) return;

      task.status = nextStatus;
      task.updatedAt = nowISO();
      saveStore(data);
      renderAppDashboard(data, user, ui, appState);
      showToast("تم تحديث حالة المهمة.", "success");
    });

    ui.risksContent?.addEventListener("click", (event) => {
      const button = event.target.closest("[data-risk-status]");
      if (!button) return;

      if (!canManageGoalsRisks(user)) {
        showToast("ليس لديك صلاحية تحديث المخاطر.", "error");
        return;
      }

      const riskId = button.getAttribute("data-risk-id");
      const status = button.getAttribute("data-risk-status");
      const risk = data.risks.find((item) => item.id === riskId);
      if (!risk || !status) return;

      risk.status = status;
      risk.updatedAt = nowISO();
      saveStore(data);
      renderAppDashboard(data, user, ui, appState);
      showToast("تم تحديث حالة الخطر.", "success");
    });

    ui.exportCsvBtn?.addEventListener("click", () => {
      const scope = scopedContext(data, user);
      const donations = filterDonations(scope.donations, appState.filters, data);
      exportDonationsCSV(donations, data);
      showToast("تم تصدير CSV.", "success");
    });

    showLoadingState(ui.lifecycleState, "جاري تحميل دورة حياة المشاريع...");
    showLoadingState(ui.kanbanState, "جاري تحميل لوحة المهام...");
    showLoadingState(ui.goalsState, "جاري تحميل الأهداف...");
    showLoadingState(ui.risksState, "جاري تحميل المخاطر...");
    showLoadingState(ui.budgetState, "جاري تحميل الميزانية...");
    showLoadingState(ui.donationsState, "جاري تحميل سجل التبرعات...");

    setTimeout(() => {
      renderAppDashboard(data, user, ui, appState);
      setStatus(ui.status, "تم تحميل لوحة PMP بنجاح.", "info");
    }, 550);
  }

  function initPublicPage() {
    const data = ensureStore();

    const ui = {
      status: byId("public-status"),
      refreshBtn: byId("public-refresh-btn"),
      kpiTotal: byId("public-kpi-total"),
      kpiAchievement: byId("public-kpi-achievement"),
      kpiDonors: byId("public-kpi-donors"),
      kpiBestChannel: byId("public-kpi-best-channel"),
      kpiBestAmbassador: byId("public-kpi-best-ambassador"),
      campaignsState: byId("public-campaigns-state"),
      campaignsContent: byId("public-campaigns-content"),
      channelsState: byId("public-channels-state"),
      channelsContent: byId("public-channels-content"),
      ambassadorsState: byId("public-ambassadors-state"),
      ambassadorsContent: byId("public-ambassadors-content"),
      lastUpdate: byId("public-last-update")
    };

    ui.refreshBtn?.addEventListener("click", () => {
      showToast("جارٍ تحديث التقارير العامة...", "success");
      loadPublic(ui, data, true);
    });

    loadPublic(ui, data, false);
  }

  function initTeacherPublicPage() {
    const data = ensureStore();

    const ui = {
      form: byId("teacher-pin-form"),
      pin: byId("teacher-pin"),
      status: byId("teacher-status"),
      result: byId("teacher-result"),
      name: byId("teacher-name"),
      branch: byId("teacher-branch"),
      circle: byId("teacher-circle"),
      circleText: byId("teacher-circle-text"),
      progressLabel: byId("teacher-progress-label"),
      progressBar: byId("teacher-progress-bar"),
      achievedList: byId("teacher-achieved-list"),
      pendingList: byId("teacher-pending-list")
    };

    ui.form?.addEventListener("submit", (event) => {
      event.preventDefault();
      const pin = (ui.pin.value || "").trim();

      if (!/^\d{4}$/.test(pin)) {
        setStatus(ui.status, "الرمز يجب أن يكون 4 أرقام.", "error");
        ui.result.classList.add("hidden");
        return;
      }

      const report = data.teacherReports.find((item) => item.pin === pin);
      if (!report) {
        setStatus(ui.status, "الرمز غير صحيح أو غير مفعّل.", "error");
        ui.result.classList.add("hidden");
        showToast("لا توجد بيانات لهذا الرمز.", "error");
        return;
      }

      renderTeacherReport(report, ui);
      setStatus(ui.status, "تم تحميل الإنجاز بنجاح.", "info");
      showToast("تم التحقق من الرمز.", "success");
    });
  }

  function initErrorPage() {
    const retryBtn = byId("retry-error-btn");
    retryBtn?.addEventListener("click", () => {
      window.location.reload();
    });
  }

  function renderAppDashboard(data, user, ui, appState) {
    fillAppSelectOptions(data, ui, user);

    const scope = scopedContext(data, user);
    const dashboard = computeDashboardMetrics(scope, data);

    ui.kpiProjectProgress.textContent = `${dashboard.projectProgress.toFixed(1)}%`;
    ui.kpiPlanVsActual.textContent = `${dashboard.planVsActual.toFixed(1)}%`;
    ui.kpiTeamCompletion.textContent = `${dashboard.teamCompletion.toFixed(1)}%`;
    ui.kpiGoalsCompletion.textContent = `${dashboard.goalsCompletion.toFixed(1)}%`;
    ui.kpiOpenRisks.textContent = toNumber(dashboard.openRisks);
    ui.kpiRoi.textContent = dashboard.roi.toFixed(2);

    ui.achievementCircle.style.setProperty("--value", clamp(dashboard.planVsActual, 0, 100).toFixed(1));
    ui.achievementCircleText.textContent = `${dashboard.planVsActual.toFixed(0)}%`;
    ui.achievementBar.style.width = `${clamp(dashboard.planVsActual, 0, 100)}%`;
    ui.achievementLabel.textContent = `${toSAR(dashboard.totalDonations)} / ${toSAR(dashboard.totalTarget)}`;

    renderLifecycleSection(scope, data, user, ui, appState);
    renderKanbanSection(scope, data, user, ui, appState);
    renderGoalsSection(scope, data, ui);
    renderRisksSection(scope, data, user, ui);
    renderBudgetSection(scope, data, ui);

    const filteredDonations = filterDonations(scope.donations, appState.filters, data);
    renderDonationsSection(filteredDonations, data, ui, appState);

    renderChannelsSection(data, scope.donations, ui.channelsContent);
    renderTeamPerformanceSection(scope, data, ui.teamPerformanceContent);
    renderReportsSection(data, scope.campaigns, scope.donations, ui.reportsContent);

    ui.donationsCountBadge.textContent = `${toNumber(filteredDonations.length)} سجل`;
  }

  function renderLifecycleSection(scope, data, user, ui, appState) {
    const selectedId = appState.lifecycleCampaignId;
    const campaigns = selectedId === "all" ? scope.campaigns : scope.campaigns.filter((item) => item.id === selectedId);

    if (!campaigns.length) {
      ui.lifecycleContent.classList.add("hidden");
      showEmptyState(ui.lifecycleState, "لا توجد مشاريع حملات ضمن النطاق الحالي.");
      return;
    }

    ui.lifecycleState.classList.add("hidden");
    ui.lifecycleContent.classList.remove("hidden");

    ui.lifecycleContent.innerHTML = `
      <div class="lifecycle-grid">
        ${campaigns
          .map((campaign) => {
            const manager = data.users.find((item) => item.id === campaign.projectManagerId)?.name || "-";
            const progress = campaignProgress(campaign, scope, data);
            const stageBadges = STAGE_ORDER.map((stage, index) => {
              const done = STAGE_ORDER.indexOf(campaign.currentStage) >= index;
              return `<span class="stage-pill ${done ? "done" : ""}">${esc(stage)}</span>`;
            }).join("");
            const canControlStage = canEditCampaigns(user);
            const stageIndex = STAGE_ORDER.indexOf(campaign.currentStage);

            return `
              <article class="project-card">
                <header class="project-head">
                  <div>
                    <h4>${esc(campaign.name)}</h4>
                    <p>${esc(campaign.projectId)} • مدير المشروع: ${esc(manager)}</p>
                  </div>
                  <span class="badge ${campaign.status === "Completed" ? "badge-success" : campaign.status === "Active" ? "badge-info" : "badge-warning"}">
                    ${esc(campaign.status)}
                  </span>
                </header>

                <div class="project-meta-grid">
                  <div><strong>النطاق:</strong> ${esc(campaign.scope || "-")}</div>
                  <div><strong>الوقت:</strong> ${formatDateOnly(campaign.startDate)} → ${formatDateOnly(campaign.endDate)}</div>
                  <div><strong>الميزانية:</strong> ${toSAR(campaign.budget)}</div>
                  <div><strong>الهدف:</strong> ${toSAR(campaign.targetAmount)}</div>
                  <div><strong>الجودة:</strong> ${esc(campaign.quality || "-")}</div>
                  <div><strong>المرحلة:</strong> ${esc(campaign.currentStage)}</div>
                </div>

                <div class="inline-note" style="margin-top:0.45rem">Project Charter: ${esc(campaign.charter || "-")}</div>

                <div class="progress" style="margin-top:0.55rem"><span style="width:${clamp(progress, 0, 100)}%"></span></div>
                <p class="inline-note" style="margin-top:0.35rem">إنجاز المشروع: ${progress.toFixed(1)}%</p>
                <div class="stage-track">${stageBadges}</div>
                ${
                  canControlStage
                    ? `
                  <div class="mini-actions">
                    <button
                      type="button"
                      class="btn btn-ghost"
                      data-stage-action="prev"
                      data-campaign-id="${esc(campaign.id)}"
                      ${stageIndex <= 0 ? "disabled" : ""}
                      aria-label="الرجوع للمرحلة السابقة"
                    >
                      المرحلة السابقة
                    </button>
                    <button
                      type="button"
                      class="btn btn-secondary"
                      data-stage-action="next"
                      data-campaign-id="${esc(campaign.id)}"
                      ${stageIndex >= STAGE_ORDER.length - 1 ? "disabled" : ""}
                      aria-label="الانتقال للمرحلة التالية"
                    >
                      المرحلة التالية
                    </button>
                  </div>
                `
                    : ""
                }
              </article>
            `;
          })
          .join("")}
      </div>
    `;
  }

  function renderKanbanSection(scope, data, user, ui, appState) {
    const selectedCampaign = appState.taskBoardCampaignId;
    const tasks = selectedCampaign === "all" ? scope.tasks : scope.tasks.filter((item) => item.campaignId === selectedCampaign);

    if (!tasks.length) {
      ui.kanbanBoard.classList.add("hidden");
      showEmptyState(ui.kanbanState, "لا توجد مهام ضمن الفلتر الحالي.");
      ui.kanbanCountPending.textContent = "0";
      ui.kanbanCountProgress.textContent = "0";
      ui.kanbanCountDone.textContent = "0";
      return;
    }

    ui.kanbanState.classList.add("hidden");
    ui.kanbanBoard.classList.remove("hidden");

    const pending = tasks.filter((item) => item.status === "Pending");
    const progress = tasks.filter((item) => item.status === "In Progress");
    const done = tasks.filter((item) => item.status === "Done");

    const allowActions = canManageTasks(user);
    ui.kanbanPending.innerHTML = renderTaskCards(pending, data, allowActions);
    ui.kanbanProgress.innerHTML = renderTaskCards(progress, data, allowActions);
    ui.kanbanDone.innerHTML = renderTaskCards(done, data, allowActions);

    ui.kanbanCountPending.textContent = toNumber(pending.length);
    ui.kanbanCountProgress.textContent = toNumber(progress.length);
    ui.kanbanCountDone.textContent = toNumber(done.length);
  }

  function renderGoalsSection(scope, data, ui) {
    if (!scope.goals.length) {
      ui.goalsContent.classList.add("hidden");
      showEmptyState(ui.goalsState, "لا توجد أهداف مسجلة حاليًا.");
      return;
    }

    ui.goalsState.classList.add("hidden");
    ui.goalsContent.classList.remove("hidden");

    ui.goalsContent.innerHTML = `
      <div class="goal-grid">
        ${scope.goals
          .map((goal) => {
            const campaign = data.campaigns.find((item) => item.id === goal.campaignId)?.name || "-";
            const progress = goal.targetValue > 0 ? (goal.currentValue / goal.targetValue) * 100 : 0;
            const achieved = goal.currentValue >= goal.targetValue;

            return `
              <article class="goal-card">
                <div class="section-head" style="margin-bottom:0.45rem">
                  <div>
                    <h4 style="margin:0">${esc(goal.title)}</h4>
                    <p style="margin:0.2rem 0 0">${esc(goal.goalType)} • ${esc(campaign)}</p>
                  </div>
                  <span class="badge ${achieved ? "badge-success" : "badge-warning"}">${achieved ? "محقق" : "قيد التنفيذ"}</span>
                </div>

                <div class="goal-meta-grid">
                  <div><strong>الهدف:</strong> ${toNumber(goal.targetValue)}</div>
                  <div><strong>الحالي:</strong> ${toNumber(goal.currentValue)}</div>
                  <div><strong>مرتبط بـ:</strong> ${esc(goal.linkedType)} / ${esc(goal.linkedId)}</div>
                  <div><strong>الموعد:</strong> ${formatDateOnly(goal.deadline)}</div>
                </div>

                <div class="progress" style="margin-top:0.5rem"><span style="width:${clamp(progress, 0, 100)}%"></span></div>
                <p class="inline-note" style="margin-top:0.35rem">${progress.toFixed(1)}%</p>
                <p class="inline-note">SMART: ${esc(goal.smart?.specific || "-")} | ${esc(goal.smart?.measurable || "-")} | ${esc(
              goal.smart?.achievable || "-"
            )}</p>
              </article>
            `;
          })
          .join("")}
      </div>
    `;
  }

  function renderRisksSection(scope, data, user, ui) {
    const risks = [...scope.risks].sort((a, b) => riskScore(b) - riskScore(a));

    if (!risks.length) {
      ui.risksContent.classList.add("hidden");
      showEmptyState(ui.risksState, "لا توجد مخاطر مسجلة.");
      return;
    }

    ui.risksState.classList.add("hidden");
    ui.risksContent.classList.remove("hidden");

    ui.risksContent.innerHTML = `
      <div class="risk-grid">
        ${risks
          .map((risk) => {
            const owner = data.users.find((item) => item.id === risk.ownerId)?.name || "-";
            const campaign = data.campaigns.find((item) => item.id === risk.campaignId)?.name || "-";
            const score = riskScore(risk);
            const canManage = canManageGoalsRisks(user);
            const statuses = ["Open", "Monitoring", "Mitigated", "Closed"];

            return `
              <article class="risk-card">
                <div class="section-head" style="margin-bottom:0.4rem">
                  <div>
                    <h4 style="margin:0">${esc(risk.title)}</h4>
                    <p style="margin:0.2rem 0 0">${esc(campaign)} • المالك: ${esc(owner)}</p>
                  </div>
                  <span class="badge ${risk.status === "Closed" || risk.status === "Mitigated" ? "badge-success" : "badge-danger"}">${esc(
              risk.status
            )}</span>
                </div>
                <p class="inline-note">الاحتمالية: ${esc(risk.probability)} | التأثير: ${esc(risk.impact)} | الدرجة: ${score}</p>
                <p class="inline-note">خطة المعالجة: ${esc(risk.mitigation)}</p>
                ${
                  canManage
                    ? `
                  <div class="status-actions" aria-label="تحديث حالة الخطر">
                    ${statuses
                      .map(
                        (status) => `
                      <button
                        type="button"
                        class="status-chip ${risk.status === status ? "active" : ""}"
                        data-risk-id="${esc(risk.id)}"
                        data-risk-status="${status}"
                        aria-label="تحديث الحالة إلى ${status}"
                      >
                        ${status}
                      </button>
                    `
                      )
                      .join("")}
                  </div>
                `
                    : ""
                }
              </article>
            `;
          })
          .join("")}
      </div>
    `;
  }

  function renderBudgetSection(scope, data, ui) {
    if (!scope.campaigns.length) {
      ui.budgetContent.classList.add("hidden");
      showEmptyState(ui.budgetState, "لا توجد حملات لعرض الميزانية.");
      return;
    }

    ui.budgetState.classList.add("hidden");
    ui.budgetContent.classList.remove("hidden");

    const items = scope.campaigns.map((campaign) => {
      const allocations = scope.channelAllocations.filter((item) => item.campaignId === campaign.id);
      const planned = allocations.reduce((sum, item) => sum + item.plannedBudget, 0);
      const spent = allocations.reduce((sum, item) => sum + item.spentBudget, 0);
      const donations = scope.donations.filter((item) => item.campaignId === campaign.id);
      const revenue = donations.reduce((sum, item) => sum + item.amount, 0);
      const donors = new Set(donations.map((item) => item.donorPhone)).size;
      const cpa = donors ? spent / donors : 0;
      const roi = spent > 0 ? revenue / spent : revenue > 0 ? revenue : 0;
      const remaining = campaign.budget - spent;

      return {
        campaign,
        planned,
        spent,
        revenue,
        cpa,
        roi,
        remaining
      };
    });

    ui.budgetContent.innerHTML = `
      <div class="budget-grid">
        ${items
          .map((item) => {
            const usage = item.campaign.budget > 0 ? (item.spent / item.campaign.budget) * 100 : 0;
            return `
              <article class="budget-card">
                <h4>${esc(item.campaign.name)}</h4>
                <p class="inline-note">Project ID: ${esc(item.campaign.projectId)}</p>
                <div class="budget-meta-grid">
                  <div><strong>الميزانية:</strong> ${toSAR(item.campaign.budget)}</div>
                  <div><strong>المخطط:</strong> ${toSAR(item.planned)}</div>
                  <div><strong>المصروف:</strong> ${toSAR(item.spent)}</div>
                  <div><strong>المتبقي:</strong> ${toSAR(item.remaining)}</div>
                  <div><strong>الإيراد:</strong> ${toSAR(item.revenue)}</div>
                  <div><strong>CPA:</strong> ${toSAR(item.cpa)}</div>
                  <div><strong>ROI:</strong> ${item.roi.toFixed(2)}</div>
                </div>
                <div class="progress" style="margin-top:0.45rem"><span style="width:${clamp(usage, 0, 100)}%"></span></div>
                <p class="inline-note" style="margin-top:0.3rem">استهلاك الميزانية: ${usage.toFixed(1)}%</p>
              </article>
            `;
          })
          .join("")}
      </div>
    `;
  }

  function renderDonationsSection(filteredDonations, data, ui, appState) {
    if (appState.simulateDonationsError) {
      ui.donationsContent.classList.add("hidden");
      showErrorState(ui.donationsState, "حدث خطأ تجريبي أثناء تحميل سجل التبرعات.");
      return;
    }

    if (!filteredDonations.length) {
      ui.donationsContent.classList.add("hidden");
      showEmptyState(ui.donationsState, "لا توجد تبرعات مطابقة للتصفية.");
      return;
    }

    ui.donationsState.classList.add("hidden");
    ui.donationsContent.classList.remove("hidden");
    ui.donationsContent.innerHTML = renderDonationsDataBlock(filteredDonations, data);
  }

  function loadPublic(ui, data, softRefresh) {
    showLoadingState(ui.status, softRefresh ? "جارٍ تحديث التقارير..." : "جاري تحميل التقارير العامة...");
    showLoadingState(ui.campaignsState, "جاري تحليل الحملات...");
    showLoadingState(ui.channelsState, "جاري تجهيز تقرير القنوات...");
    showLoadingState(ui.ambassadorsState, "جاري تحميل ترتيب السفراء...");

    ui.campaignsContent.classList.add("hidden");
    ui.channelsContent.classList.add("hidden");
    ui.ambassadorsContent.classList.add("hidden");

    setTimeout(() => {
      const context = {
        campaigns: [...data.campaigns],
        donations: [...data.donations],
        tasks: [...data.tasks],
        goals: [...data.goals],
        risks: [...data.risks],
        channelAllocations: [...data.channelAllocations]
      };

      const metrics = computeDashboardMetrics(context, data);
      const channels = aggregateChannels(data.donations, data);
      const ambassadors = aggregateAmbassadors(data.donations, data);

      ui.kpiTotal.textContent = toSAR(metrics.totalDonations);
      ui.kpiAchievement.textContent = `${metrics.planVsActual.toFixed(1)}%`;
      ui.kpiDonors.textContent = toNumber(metrics.donorsCount);
      ui.kpiBestChannel.textContent = channels[0]?.name || "-";
      ui.kpiBestAmbassador.textContent = ambassadors[0]?.name || "-";
      ui.lastUpdate.textContent = `آخر تحديث: ${formatDateTime(nowISO())}`;

      if (!data.campaigns.length) {
        showEmptyState(ui.campaignsState, "لا توجد حملات حالية.");
      } else {
        ui.campaignsState.classList.add("hidden");
        ui.campaignsContent.classList.remove("hidden");
        ui.campaignsContent.innerHTML = renderCampaignComparison(data.campaigns, data.donations);
      }

      if (!channels.length) {
        showEmptyState(ui.channelsState, "لا توجد بيانات قنوات.");
      } else {
        ui.channelsState.classList.add("hidden");
        ui.channelsContent.classList.remove("hidden");
        ui.channelsContent.innerHTML = renderPublicChannels(channels);
      }

      if (!ambassadors.length) {
        showEmptyState(ui.ambassadorsState, "لا توجد بيانات سفراء.");
      } else {
        ui.ambassadorsState.classList.add("hidden");
        ui.ambassadorsContent.classList.remove("hidden");
        ui.ambassadorsContent.innerHTML = renderAmbassadorCards(ambassadors.slice(0, 8));
      }

      setStatus(ui.status, "التقارير العامة محدثة.", "info");
    }, softRefresh ? 420 : 620);
  }

  function applyRoleVisibility(user, ui) {
    const canCampaign = canEditCampaigns(user);
    const canDonation = canRecordDonations(user);
    const canTasks = canManageTasks(user);
    const canGoalsRisk = canManageGoalsRisks(user);

    toggleSectionByForm(ui.campaignForm, canCampaign);
    toggleSectionByForm(ui.donationForm, canDonation);
    toggleSectionByForm(ui.taskForm, canTasks);
    toggleSectionByForm(ui.goalForm, canGoalsRisk);
    toggleSectionByForm(ui.riskForm, canGoalsRisk);
    toggleSectionByForm(ui.allocationForm, canCampaign);
  }

  function toggleSectionByForm(formEl, isVisible) {
    const section = formEl?.closest(".section-card");
    if (!section) return;
    section.classList.toggle("hidden", !isVisible);
  }

  function fillAppSelectOptions(data, ui, user = null) {
    const scoped = user ? scopedContext(data, user) : null;
    const visibleCampaigns = scoped ? scoped.campaigns : data.campaigns;
    const visibleUsers = user?.role === "Branch Manager"
      ? data.users.filter((item) => item.branchId === user.branchId && item.role !== "Viewer")
      : data.users;

    const managerCandidates = data.users.filter((item) => ["Admin", "Marketing Manager", "Branch Manager"].includes(item.role));
    fillSelect(ui.campaignManager, managerCandidates, "id", "name", "اختر مدير المشروع", false);

    fillSelect(ui.donationCampaign, visibleCampaigns, "id", "name", "اختر حملة", false, (item) => `${item.projectId} — ${item.name}`);
    fillSelect(ui.donationProject, data.projects, "id", "name", "اختر مشروع", false);
    fillSelect(ui.donationChannel, data.channels, "id", "name", "اختر قناة", false);

    fillSelect(ui.lifecycleFilter, visibleCampaigns, "id", "name", "كل المشاريع", true, (item) => `${item.projectId} — ${item.name}`);

    fillSelect(ui.taskCampaign, visibleCampaigns, "id", "name", "اختر حملة", false, (item) => `${item.projectId} — ${item.name}`);
    fillSelect(ui.taskOwner, visibleUsers, "id", "name", "اختر المسؤول", false, (item) => `${item.name} (${ROLE_LABELS[item.role] || item.role})`);
    fillSelect(ui.taskBoardFilter, visibleCampaigns, "id", "name", "كل الحملات", true, (item) => `${item.projectId} — ${item.name}`);

    fillSelect(ui.goalCampaign, visibleCampaigns, "id", "name", "اختر حملة", false, (item) => `${item.projectId} — ${item.name}`);

    fillSelect(ui.riskCampaign, visibleCampaigns, "id", "name", "اختر حملة", false, (item) => `${item.projectId} — ${item.name}`);
    fillSelect(ui.riskOwner, visibleUsers, "id", "name", "اختر المالك", false);

    fillSelect(ui.allocationCampaign, visibleCampaigns, "id", "name", "اختر حملة", false, (item) => `${item.projectId} — ${item.name}`);
    fillSelect(ui.allocationChannel, data.channels, "id", "name", "اختر قناة", false);

    fillSelect(ui.campaignFilter, visibleCampaigns, "id", "name", "كل الحملات", true, (item) => `${item.projectId} — ${item.name}`);
    fillSelect(ui.channelFilter, data.channels, "id", "name", "كل القنوات", true);
    fillSelect(ui.projectFilter, data.projects, "id", "name", "كل المشاريع", true);
  }

  function fillSelect(selectEl, items, valueKey, labelKey, firstLabel, allowAll = false, labelFn = null) {
    if (!selectEl) return;
    const firstValue = allowAll ? "all" : "";

    const options = [
      `<option value="${firstValue}">${esc(firstLabel)}</option>`,
      ...items.map((item) => {
        const label = labelFn ? labelFn(item) : item[labelKey];
        return `<option value="${esc(item[valueKey])}">${esc(label)}</option>`;
      })
    ];

    const oldValue = selectEl.value;
    selectEl.innerHTML = options.join("");

    if (oldValue && [...selectEl.options].some((opt) => opt.value === oldValue)) {
      selectEl.value = oldValue;
    }
  }

  function scopedContext(data, user) {
    if (["Admin", "Marketing Manager", "Viewer"].includes(user.role)) {
      return {
        campaigns: [...data.campaigns],
        donations: [...data.donations],
        tasks: [...data.tasks],
        goals: [...data.goals],
        risks: [...data.risks],
        channelAllocations: [...data.channelAllocations]
      };
    }

    if (user.role === "Branch Manager") {
      const campaigns = data.campaigns.filter((item) => item.branchId === user.branchId);
      const campaignIds = new Set(campaigns.map((item) => item.id));

      const donations = data.donations.filter(
        (item) => item.branchId === user.branchId || campaignIds.has(item.campaignId)
      );

      return {
        campaigns,
        donations,
        tasks: data.tasks.filter((item) => campaignIds.has(item.campaignId)),
        goals: data.goals.filter((item) => campaignIds.has(item.campaignId) || item.linkedId === user.branchId),
        risks: data.risks.filter((item) => campaignIds.has(item.campaignId)),
        channelAllocations: data.channelAllocations.filter((item) => campaignIds.has(item.campaignId))
      };
    }

    if (user.role === "Ambassador") {
      const donations = data.donations.filter(
        (item) => (item.referralCode || "").toUpperCase() === (user.referralCode || "").toUpperCase()
      );
      const campaignIds = new Set(donations.map((item) => item.campaignId));

      return {
        campaigns: data.campaigns.filter((item) => campaignIds.has(item.id)),
        donations,
        tasks: data.tasks.filter((item) => item.ownerId === user.id),
        goals: data.goals.filter(
          (item) => campaignIds.has(item.campaignId) || item.linkedId.toUpperCase() === (user.referralCode || "").toUpperCase()
        ),
        risks: data.risks.filter((item) => item.ownerId === user.id || campaignIds.has(item.campaignId)),
        channelAllocations: data.channelAllocations.filter((item) => campaignIds.has(item.campaignId))
      };
    }

    return {
      campaigns: [...data.campaigns],
      donations: [...data.donations],
      tasks: [...data.tasks],
      goals: [...data.goals],
      risks: [...data.risks],
      channelAllocations: [...data.channelAllocations]
    };
  }

  function computeDashboardMetrics(scope, data) {
    const totalDonations = scope.donations.reduce((sum, item) => sum + item.amount, 0);
    const totalTarget = scope.campaigns.reduce((sum, item) => sum + item.targetAmount, 0);
    const planVsActual = totalTarget > 0 ? (totalDonations / totalTarget) * 100 : 0;

    const projectProgress = scope.campaigns.length
      ? scope.campaigns.reduce((sum, campaign) => sum + campaignProgress(campaign, scope, data), 0) / scope.campaigns.length
      : 0;

    const tasksCount = scope.tasks.length;
    const doneTasks = scope.tasks.filter((item) => item.status === "Done").length;
    const teamCompletion = tasksCount > 0 ? (doneTasks / tasksCount) * 100 : 0;

    const goalsCount = scope.goals.length;
    const achievedGoals = scope.goals.filter((item) => item.currentValue >= item.targetValue).length;
    const goalsCompletion = goalsCount > 0 ? (achievedGoals / goalsCount) * 100 : 0;

    const openRisks = scope.risks.filter((item) => !["Closed", "Mitigated"].includes(item.status)).length;

    const spent = scope.channelAllocations.reduce((sum, item) => sum + item.spentBudget, 0);
    const roi = spent > 0 ? totalDonations / spent : totalDonations > 0 ? totalDonations : 0;

    const donorsCount = new Set(scope.donations.map((item) => item.donorPhone)).size;

    return {
      totalDonations,
      totalTarget,
      planVsActual,
      projectProgress,
      teamCompletion,
      goalsCompletion,
      openRisks,
      roi,
      donorsCount
    };
  }

  function campaignProgress(campaign, scope, data) {
    const stageIndex = Math.max(0, STAGE_ORDER.indexOf(campaign.currentStage));
    const lifecycleProgress = ((stageIndex + 1) / STAGE_ORDER.length) * 100;

    const campaignDonations = scope.donations.filter((item) => item.campaignId === campaign.id);
    const financialProgress = campaign.targetAmount > 0
      ? (campaignDonations.reduce((sum, item) => sum + item.amount, 0) / campaign.targetAmount) * 100
      : 0;

    const campaignTasks = scope.tasks.filter((item) => item.campaignId === campaign.id);
    const taskProgress = campaignTasks.length
      ? (campaignTasks.filter((item) => item.status === "Done").length / campaignTasks.length) * 100
      : 0;

    const weighted = lifecycleProgress * 0.35 + financialProgress * 0.4 + taskProgress * 0.25;
    return clamp(weighted, 0, 100);
  }

  function renderTaskCards(tasks, data, allowActions) {
    if (!tasks.length) {
      return `<div class="state-box state-empty" style="padding:0.6rem;font-size:0.78rem">لا توجد مهام.</div>`;
    }

    return tasks
      .sort((a, b) => new Date(a.endDate) - new Date(b.endDate))
      .map((task) => {
        const owner = data.users.find((item) => item.id === task.ownerId)?.name || "-";
        const campaign = data.campaigns.find((item) => item.id === task.campaignId);
        const priorityClass = task.priority === "High" ? "badge-danger" : task.priority === "Medium" ? "badge-warning" : "badge-info";
        const actionButtons = allowActions
          ? task.status === "Pending"
            ? `
              <div class="task-actions">
                <button type="button" class="btn btn-secondary" data-task-id="${esc(task.id)}" data-task-action="start" aria-label="بدء المهمة">
                  بدء
                </button>
              </div>
            `
            : task.status === "In Progress"
              ? `
                <div class="task-actions">
                  <button type="button" class="btn btn-ghost" data-task-id="${esc(task.id)}" data-task-action="hold" aria-label="إرجاع المهمة إلى الانتظار">
                    تعليق
                  </button>
                  <button type="button" class="btn btn-secondary" data-task-id="${esc(task.id)}" data-task-action="complete" aria-label="إنهاء المهمة">
                    إنهاء
                  </button>
                </div>
              `
              : `
                <div class="task-actions">
                  <button type="button" class="btn btn-ghost" data-task-id="${esc(task.id)}" data-task-action="reopen" aria-label="إعادة فتح المهمة">
                    إعادة فتح
                  </button>
                </div>
              `
          : "";

        return `
          <article class="task-card">
            <header>
              <h5>${esc(task.name)}</h5>
              <span class="badge ${priorityClass}">${esc(task.priority)}</span>
            </header>
            <p>${esc(task.role)} • ${esc(owner)}</p>
            <p>${esc(campaign?.projectId || "-")} • ${esc(campaign?.name || "-")}</p>
            <p>${formatDateOnly(task.startDate)} → ${formatDateOnly(task.endDate)}</p>
            ${actionButtons}
          </article>
        `;
      })
      .join("");
  }

  function renderTeamPerformanceSection(scope, data, container) {
    const team = data.users.filter((user) => user.role !== "Viewer");

    if (!team.length) {
      container.innerHTML = `<div class="state-box state-empty">لا يوجد أعضاء فريق حاليًا.</div>`;
      return;
    }

    const donationsTotal = scope.donations.reduce((sum, item) => sum + item.amount, 0);

    container.innerHTML = team
      .map((member) => {
        const assignedTasks = scope.tasks.filter((task) => task.ownerId === member.id);
        const doneTasks = assignedTasks.filter((task) => task.status === "Done").length;
        const completion = assignedTasks.length ? (doneTasks / assignedTasks.length) * 100 : 0;

        let impact = 0;
        if (member.role === "Ambassador" && member.referralCode) {
          impact = scope.donations
            .filter((item) => (item.referralCode || "").toUpperCase() === member.referralCode.toUpperCase())
            .reduce((sum, item) => sum + item.amount, 0);
        } else if (member.role === "Branch Manager") {
          impact = scope.donations.filter((item) => item.branchId === member.branchId).reduce((sum, item) => sum + item.amount, 0);
        } else {
          const managedCampaigns = scope.campaigns.filter((campaign) => campaign.projectManagerId === member.id).map((item) => item.id);
          impact = scope.donations
            .filter((item) => managedCampaigns.includes(item.campaignId) || item.createdBy === member.id)
            .reduce((sum, item) => sum + item.amount, 0);
        }

        const share = donationsTotal > 0 ? (impact / donationsTotal) * 100 : 0;

        return `
          <article class="list-item">
            <div class="meta" style="width:100%">
              <h4>${esc(member.name)} <span class="badge badge-info">${esc(ROLE_LABELS[member.role] || member.role)}</span></h4>
              <p>مهام منجزة: ${toNumber(doneTasks)} / ${toNumber(assignedTasks.length)} | التأثير: ${toSAR(impact)}</p>
              <div class="progress"><span style="width:${clamp(completion, 0, 100)}%"></span></div>
              <p class="inline-note">نسبة الإنجاز: ${completion.toFixed(1)}% • حصة التأثير: ${share.toFixed(1)}%</p>
            </div>
          </article>
        `;
      })
      .join("");
  }

  function renderChannelsSection(data, donations, container) {
    const channels = aggregateChannels(donations, data);
    if (!channels.length) {
      container.innerHTML = `<div class="state-box state-empty">لا توجد بيانات قنوات ضمن النطاق الحالي.</div>`;
      return;
    }

    container.innerHTML = channels
      .map((channel) => {
        const progress = clamp(channel.achievement, 0, 100);
        return `
          <article class="list-item">
            <div class="meta">
              <h4>${esc(channel.name)}</h4>
              <p>العائد: ${toSAR(channel.revenue)} | التكلفة: ${toSAR(channel.cost)} | ROI: ${channel.roi.toFixed(2)}</p>
              <div class="progress" aria-label="نسبة مساهمة القناة"><span style="width:${progress}%"></span></div>
            </div>
            <span class="badge ${channel.roi >= 2 ? "badge-success" : "badge-warning"}">${channel.roi >= 2 ? "ممتاز" : "قابل للتحسين"}</span>
          </article>
        `;
      })
      .join("");
  }

  function renderReportsSection(data, campaigns, donations, container) {
    if (!campaigns.length) {
      container.innerHTML = `<div class="state-box state-empty">لا توجد حملات لإعداد التقارير.</div>`;
      return;
    }

    const daily = aggregateDaily(donations, 7);
    const ranked = campaignRanking(campaigns, donations);
    const topCampaign = ranked[0];

    const openRisks = data.risks.filter((item) => !["Closed", "Mitigated"].includes(item.status));

    const closingBlock = ranked
      .filter((item) => data.campaigns.find((c) => c.id === item.id)?.status === "Completed")
      .slice(0, 2)
      .map(
        (item) => `
          <article class="list-item">
            <div class="meta">
              <h4>Closing Report: ${esc(item.name)}</h4>
              <p>النتيجة النهائية: ${toSAR(item.total)} من ${toSAR(item.target)} (${item.achievement.toFixed(1)}%)</p>
            </div>
            <span class="badge badge-success">Closed</span>
          </article>
        `
      )
      .join("");

    container.innerHTML = `
      <article class="list-item">
        <div class="meta">
          <h4>تقرير يومي (7 أيام)</h4>
          <p>الإجمالي: ${toSAR(daily.total)} | العمليات: ${toNumber(daily.count)}</p>
        </div>
        <span class="badge badge-info">Daily</span>
      </article>

      ${
        topCampaign
          ? `
        <article class="list-item">
          <div class="meta">
            <h4>أفضل مشروع حملة</h4>
            <p>${esc(topCampaign.name)} • ${topCampaign.achievement.toFixed(1)}%</p>
          </div>
          <span class="badge badge-success">Top</span>
        </article>
      `
          : ""
      }

      <article class="list-item">
        <div class="meta">
          <h4>المخاطر الحالية</h4>
          <p>عدد المخاطر المفتوحة: ${toNumber(openRisks.length)}</p>
        </div>
        <span class="badge ${openRisks.length ? "badge-danger" : "badge-success"}">${openRisks.length ? "Action" : "Stable"}</span>
      </article>

      ${closingBlock || `<div class="state-box state-empty">لا توجد حملات مغلقة بعد.</div>`}
    `;
  }

  function renderDonationsDataBlock(donations, data) {
    const rows = donations
      .map((donation) => {
        const campaign = data.campaigns.find((item) => item.id === donation.campaignId);
        const project = data.projects.find((item) => item.id === donation.projectId);
        const channel = data.channels.find((item) => item.id === donation.channelId);

        return {
          donorPhone: donation.donorPhone,
          amount: donation.amount,
          date: donation.date,
          campaign: campaign?.name || "-",
          projectId: campaign?.projectId || "-",
          project: project?.name || "-",
          channel: channel?.name || "-",
          referral: donation.referralCode || "-"
        };
      })
      .slice(0, 300);

    const tableRows = rows
      .map(
        (row) => `
          <tr>
            <td>${esc(row.donorPhone)}</td>
            <td>${toSAR(row.amount)}</td>
            <td>${formatDateOnly(row.date)}</td>
            <td>${esc(row.projectId)}</td>
            <td>${esc(row.campaign)}</td>
            <td>${esc(row.project)}</td>
            <td>${esc(row.channel)}</td>
            <td>${esc(row.referral)}</td>
          </tr>
        `
      )
      .join("");

    const cards = rows
      .map(
        (row) => `
          <article class="data-card">
            <p><strong>المتبرع:</strong> ${esc(row.donorPhone)}</p>
            <p><strong>المبلغ:</strong> ${toSAR(row.amount)}</p>
            <p><strong>التاريخ:</strong> ${formatDateOnly(row.date)}</p>
            <p><strong>Project ID:</strong> ${esc(row.projectId)}</p>
            <p><strong>الحملة:</strong> ${esc(row.campaign)}</p>
            <p><strong>المشروع:</strong> ${esc(row.project)}</p>
            <p><strong>القناة:</strong> ${esc(row.channel)}</p>
            <p><strong>الإحالة:</strong> ${esc(row.referral)}</p>
          </article>
        `
      )
      .join("");

    return `
      <div class="data-block">
        <div class="desktop-table">
          <table class="table" aria-label="جدول التبرعات">
            <thead>
              <tr>
                <th>رقم المتبرع</th>
                <th>المبلغ</th>
                <th>التاريخ</th>
                <th>Project ID</th>
                <th>الحملة</th>
                <th>المشروع</th>
                <th>القناة</th>
                <th>الإحالة</th>
              </tr>
            </thead>
            <tbody>${tableRows}</tbody>
          </table>
        </div>
        <div class="mobile-cards">${cards}</div>
      </div>
    `;
  }

  function renderCampaignComparison(campaigns, donations) {
    const ranked = campaignRanking(campaigns, donations);
    return ranked
      .map(
        (item) => `
          <article class="list-item">
            <div class="meta" style="width:100%">
              <h4>${esc(item.name)} <span class="badge badge-info">${esc(item.projectId || "-")}</span></h4>
              <p>التحصيل: ${toSAR(item.total)} من ${toSAR(item.target)}</p>
              <div class="progress"><span style="width:${clamp(item.achievement, 0, 100)}%"></span></div>
            </div>
            <span class="badge ${item.achievement >= 75 ? "badge-success" : "badge-warning"}">${item.achievement.toFixed(1)}%</span>
          </article>
        `
      )
      .join("");
  }

  function renderPublicChannels(channels) {
    const rows = channels
      .map(
        (item) => `
          <tr>
            <td>${esc(item.name)}</td>
            <td>${toSAR(item.revenue)}</td>
            <td>${toSAR(item.cost)}</td>
            <td>${item.roi.toFixed(2)}</td>
            <td>${toNumber(item.donors)}</td>
          </tr>
        `
      )
      .join("");

    const cards = channels
      .map(
        (item) => `
          <article class="data-card">
            <p><strong>القناة:</strong> ${esc(item.name)}</p>
            <p><strong>العائد:</strong> ${toSAR(item.revenue)}</p>
            <p><strong>التكلفة:</strong> ${toSAR(item.cost)}</p>
            <p><strong>ROI:</strong> ${item.roi.toFixed(2)}</p>
          </article>
        `
      )
      .join("");

    return `
      <div class="data-block">
        <div class="desktop-table">
          <table class="table" aria-label="تقرير القنوات">
            <thead>
              <tr>
                <th>القناة</th>
                <th>العائد</th>
                <th>التكلفة</th>
                <th>ROI</th>
                <th>عدد المتبرعين</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
        <div class="mobile-cards">${cards}</div>
      </div>
    `;
  }

  function renderAmbassadorCards(ambassadors) {
    return ambassadors
      .map(
        (item, idx) => `
          <article class="list-item">
            <div class="meta">
              <h4>${esc(item.name)}</h4>
              <p>الكود: ${esc(item.code)} | عدد العمليات: ${toNumber(item.count)}</p>
            </div>
            <div style="text-align:left">
              <span class="badge ${idx < 3 ? "badge-success" : "badge-info"}">#${toNumber(idx + 1)}</span>
              <p class="inline-note" style="margin-top:0.2rem">${toSAR(item.total)}</p>
            </div>
          </article>
        `
      )
      .join("");
  }

  function renderTeacherReport(report, ui) {
    ui.result.classList.remove("hidden");
    ui.name.textContent = report.name;
    ui.branch.textContent = report.branch;

    const percent = report.target > 0 ? (report.achieved / report.target) * 100 : 0;
    ui.circle.style.setProperty("--value", clamp(percent, 0, 100).toFixed(1));
    ui.circleText.textContent = `${percent.toFixed(0)}%`;
    ui.progressLabel.textContent = `${toNumber(report.achieved)} من ${toNumber(report.target)} مستهدف`;
    ui.progressBar.style.width = `${clamp(percent, 0, 100)}%`;

    ui.achievedList.innerHTML = report.achievedItems.length
      ? report.achievedItems
          .map(
            (item) => `
              <article class="list-item">
                <div class="meta">
                  <h4>${esc(item.title)}</h4>
                  <p>${esc(item.note)}</p>
                </div>
                <span class="badge badge-success">تم</span>
              </article>
            `
          )
          .join("")
      : `<div class="state-box state-empty">لا توجد مهام منجزة.</div>`;

    ui.pendingList.innerHTML = report.pendingItems.length
      ? report.pendingItems
          .map(
            (item) => `
              <article class="list-item">
                <div class="meta">
                  <h4>${esc(item.title)}</h4>
                  <p>${esc(item.note)}</p>
                </div>
                <span class="badge badge-warning">مطلوب</span>
              </article>
            `
          )
          .join("")
      : `<div class="state-box state-empty">لا توجد مهام معلقة.</div>`;
  }

  function renderDemoUsers(users, listEl) {
    if (!listEl) return;
    const demo = users.filter((user) => user.isDemo);

    if (!demo.length) {
      listEl.innerHTML = `<li>ستظهر الحسابات التجريبية بعد إنشاء أول مدير.</li>`;
      return;
    }

    listEl.innerHTML = demo
      .map((user) => `<li>${esc(user.email)} — ${esc(ROLE_LABELS[user.role] || user.role)} — كلمة المرور: 123456</li>`)
      .join("");
  }

  function exportDonationsCSV(donations, data) {
    const header = [
      "donor_phone",
      "amount",
      "date",
      "project_id",
      "campaign",
      "project",
      "channel",
      "referral_code"
    ];

    const rows = donations.map((donation) => {
      const campaign = data.campaigns.find((item) => item.id === donation.campaignId);
      const project = data.projects.find((item) => item.id === donation.projectId);
      const channel = data.channels.find((item) => item.id === donation.channelId);

      return [
        donation.donorPhone,
        donation.amount,
        donation.date,
        campaign?.projectId || "",
        campaign?.name || "",
        project?.name || "",
        channel?.name || "",
        donation.referralCode || ""
      ];
    });

    const csv = [header, ...rows]
      .map((cols) => cols.map((val) => `"${String(val ?? "").replaceAll('"', '""')}"`).join(","))
      .join("\n");

    const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `pmp-donations-${todayISO()}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  function aggregateChannels(donations, data) {
    const map = new Map();

    donations.forEach((item) => {
      const state = map.get(item.channelId) || { revenue: 0, count: 0, donors: new Set() };
      state.revenue += item.amount;
      state.count += 1;
      state.donors.add(item.donorPhone);
      map.set(item.channelId, state);
    });

    const maxRevenue = Math.max(1, ...[...map.values()].map((value) => value.revenue));

    return [...map.entries()]
      .map(([channelId, value]) => {
        const channel = data.channels.find((item) => item.id === channelId);
        const cost = data.channelCosts.find((item) => item.channelId === channelId)?.cost || 0;
        const roi = cost > 0 ? value.revenue / cost : value.revenue > 0 ? value.revenue : 0;

        return {
          channelId,
          name: channel?.name || "-",
          revenue: value.revenue,
          cost,
          roi,
          donors: value.donors.size,
          achievement: (value.revenue / maxRevenue) * 100
        };
      })
      .sort((a, b) => b.roi - a.roi);
  }

  function aggregateAmbassadors(donations, data) {
    const map = new Map();

    donations.forEach((item) => {
      if (!item.referralCode) return;
      const code = item.referralCode.toUpperCase();
      const state = map.get(code) || { total: 0, count: 0 };
      state.total += item.amount;
      state.count += 1;
      map.set(code, state);
    });

    return [...map.entries()]
      .map(([code, value]) => {
        const ambassador = data.ambassadors.find((item) => item.code.toUpperCase() === code);
        return {
          code,
          name: ambassador?.name || code,
          total: value.total,
          count: value.count
        };
      })
      .sort((a, b) => b.total - a.total);
  }

  function campaignRanking(campaigns, donations) {
    return campaigns
      .map((campaign) => {
        const total = donations
          .filter((item) => item.campaignId === campaign.id)
          .reduce((sum, item) => sum + item.amount, 0);

        return {
          id: campaign.id,
          projectId: campaign.projectId,
          name: campaign.name,
          target: campaign.targetAmount,
          total,
          achievement: campaign.targetAmount > 0 ? (total / campaign.targetAmount) * 100 : 0
        };
      })
      .sort((a, b) => b.achievement - a.achievement);
  }

  function aggregateDaily(donations, days = 7) {
    const start = new Date();
    start.setDate(start.getDate() - (days - 1));
    const scoped = donations.filter((item) => new Date(item.date) >= start);
    return {
      total: scoped.reduce((sum, item) => sum + item.amount, 0),
      count: scoped.length
    };
  }

  function filterDonations(donations, filters, data) {
    let items = [...donations];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      items = items.filter((item) => {
        const channelName = data.channels.find((channel) => channel.id === item.channelId)?.name || "";
        return (
          item.donorPhone.toLowerCase().includes(q) ||
          (item.referralCode || "").toLowerCase().includes(q) ||
          channelName.toLowerCase().includes(q)
        );
      });
    }

    if (filters.campaign !== "all") {
      items = items.filter((item) => item.campaignId === filters.campaign);
    }

    if (filters.channel !== "all") {
      items = items.filter((item) => item.channelId === filters.channel);
    }

    if (filters.project !== "all") {
      items = items.filter((item) => item.projectId === filters.project);
    }

    const sorters = {
      latest: (a, b) => new Date(b.date) - new Date(a.date),
      oldest: (a, b) => new Date(a.date) - new Date(b.date),
      high: (a, b) => b.amount - a.amount,
      low: (a, b) => a.amount - b.amount
    };

    items.sort(sorters[filters.sort] || sorters.latest);
    return items;
  }

  function readDonationFilters(ui) {
    return {
      search: (ui.searchInput.value || "").trim(),
      campaign: ui.campaignFilter.value || "all",
      channel: ui.channelFilter.value || "all",
      project: ui.projectFilter.value || "all",
      sort: ui.sortFilter.value || "latest"
    };
  }

  function validateCampaignPayload(payload) {
    if (!payload.name || !payload.type || !payload.managerId || !payload.startDate || !payload.endDate) {
      return { ok: false, message: "أكمل بيانات المشروع الأساسية." };
    }

    if (!payload.budget || Number(payload.budget) <= 0 || !payload.target || Number(payload.target) <= 0) {
      return { ok: false, message: "الميزانية والهدف المالي يجب أن يكونا أكبر من صفر." };
    }

    if (!payload.status || !payload.stage || !payload.scope || !payload.quality || !payload.charter) {
      return { ok: false, message: "أكمل عناصر Scope / Stage / Quality / Charter." };
    }

    if (payload.endDate < payload.startDate) {
      return { ok: false, message: "تاريخ النهاية يجب أن يكون بعد البداية." };
    }

    return { ok: true };
  }

  function validateDonationPayload(payload) {
    if (!payload.donorPhone || !payload.amount || !payload.date || !payload.campaign || !payload.project || !payload.channel) {
      return { ok: false, message: "أكمل جميع بيانات التبرع." };
    }

    const amount = Number(payload.amount);
    if (!Number.isFinite(amount) || amount <= 0) {
      return { ok: false, message: "قيمة التبرع غير صحيحة." };
    }

    return { ok: true };
  }

  function validateTaskPayload(payload) {
    if (!payload.name || !payload.ownerId || !payload.campaignId || !payload.role || !payload.priority || !payload.status) {
      return { ok: false, message: "أكمل جميع بيانات المهمة." };
    }

    if (!payload.startDate || !payload.endDate) {
      return { ok: false, message: "حدد تاريخ البداية والنهاية للمهمة." };
    }

    if (payload.endDate < payload.startDate) {
      return { ok: false, message: "تاريخ نهاية المهمة يجب أن يكون بعد البداية." };
    }

    return { ok: true };
  }

  function validateGoalPayload(payload) {
    if (!payload.title || !payload.goalType || !payload.campaignId || !payload.linkedType || !payload.linkedId) {
      return { ok: false, message: "أكمل تعريف الهدف والربط." };
    }

    if (!payload.targetValue || Number(payload.targetValue) <= 0 || payload.currentValue === "") {
      return { ok: false, message: "قيمة الهدف والحالي مطلوبة." };
    }

    if (!payload.deadline || !payload.specific || !payload.measurable || !payload.achievable) {
      return { ok: false, message: "أكمل خصائص SMART." };
    }

    return { ok: true };
  }

  function validateRiskPayload(payload) {
    if (!payload.title || !payload.campaignId || !payload.probability || !payload.impact || !payload.ownerId || !payload.status) {
      return { ok: false, message: "أكمل بيانات الخطر الأساسية." };
    }

    if (!payload.mitigation) {
      return { ok: false, message: "خطة المعالجة مطلوبة." };
    }

    return { ok: true };
  }

  function validateAllocationPayload(payload) {
    if (!payload.campaignId || !payload.channelId) {
      return { ok: false, message: "اختر الحملة والقناة." };
    }

    if (payload.plannedBudget === "" || payload.spentBudget === "") {
      return { ok: false, message: "أدخل قيم الميزانية المخططة والمصروفة." };
    }

    if (Number(payload.plannedBudget) < 0 || Number(payload.spentBudget) < 0) {
      return { ok: false, message: "قيم الميزانية يجب أن تكون غير سالبة." };
    }

    return { ok: true };
  }

  function canEditCampaigns(user) {
    return ["Admin", "Marketing Manager"].includes(user.role);
  }

  function canRecordDonations(user) {
    return ["Admin", "Marketing Manager", "Branch Manager"].includes(user.role);
  }

  function canManageTasks(user) {
    return ["Admin", "Marketing Manager", "Branch Manager"].includes(user.role);
  }

  function canManageGoalsRisks(user) {
    return ["Admin", "Marketing Manager", "Branch Manager"].includes(user.role);
  }

  function riskScore(risk) {
    const scale = { Low: 1, Medium: 2, High: 3 };
    return (scale[risk.probability] || 1) * (scale[risk.impact] || 1);
  }

  function scopeLabel(user, data) {
    if (["Admin", "Marketing Manager", "Viewer"].includes(user.role)) return "عرض شامل";
    if (user.role === "Branch Manager") {
      const branchName = data.branches.find((item) => item.id === user.branchId)?.name || "-";
      return `فرع: ${branchName}`;
    }
    if (user.role === "Ambassador") {
      return `سفير: ${user.referralCode || "-"}`;
    }
    return "نطاق مخصص";
  }

  function nextProjectId(data) {
    const year = new Date().getFullYear();
    const sequence = String(data.campaigns.length + 1).padStart(3, "0");
    return `PRJ-${year}-${sequence}`;
  }

  function ensureStore() {
    const store = loadStore();
    if (store) {
      const normalized = normalizeStore(store);
      saveStore(normalized);
      return normalized;
    }

    const base = createBaseStore();
    saveStore(base);
    return base;
  }

  function createBaseStore() {
    return {
      meta: {
        app: "marketing-campaign-pmp",
        version: 2,
        createdAt: nowISO()
      },
      users: [],
      branches: [
        { id: "br-main", name: "الفرع الرئيسي" },
        { id: "br-riyadh", name: "فرع الرياض" },
        { id: "br-jeddah", name: "فرع جدة" }
      ],
      projects: [],
      channels: [],
      channelCosts: [],
      ambassadors: [],
      campaigns: [],
      channelAllocations: [],
      tasks: [],
      goals: [],
      risks: [],
      donations: [],
      teacherReports: []
    };
  }

  function normalizeStore(input) {
    const base = createBaseStore();

    const data = {
      ...base,
      ...input,
      users: Array.isArray(input.users) ? input.users : [],
      branches: Array.isArray(input.branches) ? input.branches : base.branches,
      projects: Array.isArray(input.projects) ? input.projects : [],
      channels: Array.isArray(input.channels) ? input.channels : [],
      channelCosts: Array.isArray(input.channelCosts) ? input.channelCosts : [],
      ambassadors: Array.isArray(input.ambassadors) ? input.ambassadors : [],
      campaigns: Array.isArray(input.campaigns) ? input.campaigns : [],
      channelAllocations: Array.isArray(input.channelAllocations) ? input.channelAllocations : [],
      tasks: Array.isArray(input.tasks) ? input.tasks : [],
      goals: Array.isArray(input.goals) ? input.goals : [],
      risks: Array.isArray(input.risks) ? input.risks : [],
      donations: Array.isArray(input.donations) ? input.donations : [],
      teacherReports: Array.isArray(input.teacherReports) ? input.teacherReports : []
    };

    data.campaigns = data.campaigns.map((campaign, idx) => ({
      id: campaign.id || uid(),
      projectId: campaign.projectId || `PRJ-${new Date().getFullYear()}-${String(idx + 1).padStart(3, "0")}`,
      name: campaign.name || `حملة ${idx + 1}`,
      type: campaign.type || "عامة",
      projectManagerId: campaign.projectManagerId || data.users[0]?.id || "",
      startDate: campaign.startDate || todayISO(),
      endDate: campaign.endDate || dateAfterDays(30),
      budget: Number(campaign.budget || campaign.targetAmount || 0),
      targetAmount: Number(campaign.targetAmount || campaign.target || 0),
      status: campaign.status || "Planning",
      currentStage: normalizeStage(campaign.currentStage || campaign.stage || "Planning"),
      scope: campaign.scope || "",
      quality: campaign.quality || "",
      charter: campaign.charter || "",
      branchId: campaign.branchId || data.branches[0]?.id || "",
      createdBy: campaign.createdBy || "",
      createdAt: campaign.createdAt || nowISO(),
      closedAt: campaign.closedAt || ""
    }));

    data.channelAllocations = data.channelAllocations.map((item) => ({
      id: item.id || uid(),
      campaignId: item.campaignId || "",
      channelId: item.channelId || "",
      plannedBudget: Number(item.plannedBudget || 0),
      spentBudget: Number(item.spentBudget || 0),
      createdAt: item.createdAt || nowISO(),
      updatedAt: item.updatedAt || ""
    }));

    data.tasks = data.tasks.map((task) => ({
      id: task.id || uid(),
      name: task.name || "",
      ownerId: task.ownerId || "",
      role: task.role || "مسؤول قنوات",
      campaignId: task.campaignId || "",
      startDate: task.startDate || todayISO(),
      endDate: task.endDate || dateAfterDays(7),
      status: ["Pending", "In Progress", "Done"].includes(task.status) ? task.status : "Pending",
      priority: ["High", "Medium", "Low"].includes(task.priority) ? task.priority : "Medium",
      createdAt: task.createdAt || nowISO(),
      createdBy: task.createdBy || ""
    }));

    data.goals = data.goals.map((goal) => ({
      id: goal.id || uid(),
      title: goal.title || "",
      goalType: ["Strategic", "Tactical", "Operational"].includes(goal.goalType) ? goal.goalType : "Operational",
      campaignId: goal.campaignId || "",
      linkedType: goal.linkedType || "Campaign",
      linkedId: goal.linkedId || "",
      targetValue: Number(goal.targetValue || 0),
      currentValue: Number(goal.currentValue || 0),
      deadline: goal.deadline || dateAfterDays(30),
      smart: {
        specific: goal.smart?.specific || goal.specific || "",
        measurable: goal.smart?.measurable || goal.measurable || "",
        achievable: goal.smart?.achievable || goal.achievable || "",
        relevant: goal.smart?.relevant || goal.achievable || "",
        timeBound: goal.smart?.timeBound || goal.deadline || ""
      },
      createdBy: goal.createdBy || "",
      createdAt: goal.createdAt || nowISO()
    }));

    data.risks = data.risks.map((risk) => ({
      id: risk.id || uid(),
      title: risk.title || "",
      campaignId: risk.campaignId || "",
      probability: ["Low", "Medium", "High"].includes(risk.probability) ? risk.probability : "Medium",
      impact: ["Low", "Medium", "High"].includes(risk.impact) ? risk.impact : "Medium",
      mitigation: risk.mitigation || risk.response || "",
      ownerId: risk.ownerId || "",
      status: risk.status || "Open",
      createdBy: risk.createdBy || "",
      createdAt: risk.createdAt || nowISO()
    }));

    data.donations = data.donations.map((donation) => ({
      id: donation.id || uid(),
      donorPhone: donation.donorPhone || "",
      amount: Number(donation.amount || 0),
      date: donation.date || todayISO(),
      campaignId: donation.campaignId || "",
      projectId: donation.projectId || "",
      channelId: donation.channelId || "",
      referralCode: donation.referralCode || "",
      branchId: donation.branchId || "",
      createdBy: donation.createdBy || "",
      createdAt: donation.createdAt || nowISO()
    }));

    return data;
  }

  function seedOperationalData(data, adminUser) {
    if (!data.projects.length) {
      data.projects = [
        { id: "prj-portfolio", name: "محفظة استثمارية", type: "محفظة" },
        { id: "prj-student", name: "كفالة طالب", type: "كفالة" },
        { id: "prj-circle", name: "كفالة حلقة", type: "كفالة" },
        { id: "prj-waqf", name: "وقف", type: "وقف" }
      ];
    }

    if (!data.channels.length) {
      data.channels = [
        { id: "ch-whatsapp", name: "واتساب" },
        { id: "ch-snap", name: "سناب" },
        { id: "ch-twitter", name: "تويتر" },
        { id: "ch-paid", name: "إعلانات مدفوعة" },
        { id: "ch-direct", name: "زيارات مباشرة" }
      ];
    }

    if (!data.channelCosts.length) {
      data.channelCosts = [
        { channelId: "ch-whatsapp", cost: 3000 },
        { channelId: "ch-snap", cost: 5200 },
        { channelId: "ch-twitter", cost: 4100 },
        { channelId: "ch-paid", cost: 7800 },
        { channelId: "ch-direct", cost: 1800 }
      ];
    }

    if (!data.ambassadors.length) {
      data.ambassadors = [
        { id: "amb-1", name: "سفير الرياض", code: "AMB-001", branchId: "br-riyadh" },
        { id: "amb-2", name: "سفيرة جدة", code: "AMB-002", branchId: "br-jeddah" },
        { id: "amb-3", name: "سفير الوقف", code: "AMB-003", branchId: "br-main" },
        { id: "amb-4", name: "سفير الطلاب", code: "AMB-004", branchId: "br-main" }
      ];
    }

    seedDemoUsers(data);

    if (!data.campaigns.length) {
      const year = new Date().getFullYear();
      data.campaigns = [
        {
          id: uid(),
          projectId: `PRJ-${year}-001`,
          name: `حملة رمضان ${year}`,
          type: "رمضان",
          projectManagerId: adminUser.id,
          startDate: `${year}-02-20`,
          endDate: `${year}-04-05`,
          budget: 220000,
          targetAmount: 450000,
          status: "Active",
          currentStage: "Execution",
          scope: "رفع التبرعات في الفروع الثلاثة عبر القنوات الرقمية",
          quality: "دقة تتبع 99% واستجابة أقل من 24 ساعة",
          charter: "تحقيق نمو بنسبة 30% في رمضان مع توزيع واضح للأدوار.",
          branchId: adminUser.branchId,
          createdBy: adminUser.id,
          createdAt: nowISO(),
          closedAt: ""
        },
        {
          id: uid(),
          projectId: `PRJ-${year}-002`,
          name: "حملة الوقف التنموي",
          type: "وقف",
          projectManagerId: data.users.find((item) => item.role === "Marketing Manager")?.id || adminUser.id,
          startDate: `${year}-01-01`,
          endDate: `${year}-12-31`,
          budget: 150000,
          targetAmount: 300000,
          status: "Planning",
          currentStage: "Planning",
          scope: "استهداف أصحاب الملاءة عبر قنوات الإعلانات والسفراء",
          quality: "تحسين جودة التأهيل بنسبة 20%",
          charter: "إطلاق حملة وقفية مستمرة بعائد متدرج شهريًا.",
          branchId: "br-main",
          createdBy: adminUser.id,
          createdAt: nowISO(),
          closedAt: ""
        },
        {
          id: uid(),
          projectId: `PRJ-${year}-003`,
          name: "حملة كفالة الطلاب",
          type: "كفالة",
          projectManagerId: data.users.find((item) => item.role === "Branch Manager")?.id || adminUser.id,
          startDate: `${year}-03-01`,
          endDate: `${year}-09-30`,
          budget: 120000,
          targetAmount: 220000,
          status: "Active",
          currentStage: "Monitoring",
          scope: "زيادة عدد الطلاب المكفولين عبر حملات قصيرة متتابعة",
          quality: "رفع معدل التحويل في الصفحة إلى 6%",
          charter: "دعم كفالة الطلاب مع تتبع يومي للأداء.",
          branchId: "br-riyadh",
          createdBy: adminUser.id,
          createdAt: nowISO(),
          closedAt: ""
        }
      ];
    }

    if (!data.channelAllocations.length) {
      const first = data.campaigns[0]?.id || "";
      const second = data.campaigns[1]?.id || "";
      const third = data.campaigns[2]?.id || "";

      data.channelAllocations = [
        { id: uid(), campaignId: first, channelId: "ch-whatsapp", plannedBudget: 40000, spentBudget: 28000, createdAt: nowISO(), updatedAt: "" },
        { id: uid(), campaignId: first, channelId: "ch-paid", plannedBudget: 85000, spentBudget: 64000, createdAt: nowISO(), updatedAt: "" },
        { id: uid(), campaignId: second, channelId: "ch-twitter", plannedBudget: 35000, spentBudget: 15000, createdAt: nowISO(), updatedAt: "" },
        { id: uid(), campaignId: third, channelId: "ch-snap", plannedBudget: 28000, spentBudget: 18000, createdAt: nowISO(), updatedAt: "" }
      ];
    }

    if (!data.tasks.length) {
      const [cmpA, cmpB, cmpC] = data.campaigns;
      const marketing = data.users.find((item) => item.role === "Marketing Manager")?.id || adminUser.id;
      const branch = data.users.find((item) => item.role === "Branch Manager")?.id || adminUser.id;
      const ambassadorUser = data.users.find((item) => item.role === "Ambassador")?.id || adminUser.id;

      data.tasks = [
        {
          id: uid(),
          name: "اعتماد Project Charter",
          ownerId: adminUser.id,
          role: "مدير حملة",
          campaignId: cmpA?.id || "",
          startDate: todayISO(),
          endDate: dateAfterDays(2),
          status: "Done",
          priority: "High",
          createdAt: nowISO(),
          createdBy: adminUser.id
        },
        {
          id: uid(),
          name: "إعداد خطة القنوات",
          ownerId: marketing,
          role: "مسؤول قنوات",
          campaignId: cmpA?.id || "",
          startDate: todayISO(),
          endDate: dateAfterDays(5),
          status: "In Progress",
          priority: "High",
          createdAt: nowISO(),
          createdBy: adminUser.id
        },
        {
          id: uid(),
          name: "بناء محتوى أسبوعي",
          ownerId: branch,
          role: "مسؤول محتوى",
          campaignId: cmpB?.id || "",
          startDate: todayISO(),
          endDate: dateAfterDays(7),
          status: "Pending",
          priority: "Medium",
          createdAt: nowISO(),
          createdBy: adminUser.id
        },
        {
          id: uid(),
          name: "تفعيل 3 سفراء جدد",
          ownerId: ambassadorUser,
          role: "مسؤول سفراء",
          campaignId: cmpC?.id || "",
          startDate: todayISO(),
          endDate: dateAfterDays(6),
          status: "In Progress",
          priority: "Medium",
          createdAt: nowISO(),
          createdBy: adminUser.id
        }
      ];
    }

    if (!data.goals.length) {
      const [cmpA, cmpB, cmpC] = data.campaigns;
      data.goals = [
        {
          id: uid(),
          title: "رفع التحصيل الإجمالي إلى 1M",
          goalType: "Strategic",
          campaignId: cmpA?.id || "",
          linkedType: "Campaign",
          linkedId: cmpA?.id || "",
          targetValue: 1000000,
          currentValue: 420000,
          deadline: dateAfterDays(90),
          smart: {
            specific: "رفع التحصيل الكلي للحملات النشطة",
            measurable: "متابعة يومية للمبلغ المحصل",
            achievable: "توزيع الأهداف على القنوات والفروع",
            relevant: "مرتبط بخطة الجمعية السنوية",
            timeBound: dateAfterDays(90)
          },
          createdBy: adminUser.id,
          createdAt: nowISO()
        },
        {
          id: uid(),
          title: "تحقيق هدف فرع الرياض",
          goalType: "Tactical",
          campaignId: cmpC?.id || "",
          linkedType: "Branch",
          linkedId: "br-riyadh",
          targetValue: 200000,
          currentValue: 116000,
          deadline: dateAfterDays(60),
          smart: {
            specific: "رفع مساهمة الفرع في حملة الكفالة",
            measurable: "متابعة تحصيل الفرع يوميًا",
            achievable: "زيادة تفعيل السفراء المحليين",
            relevant: "يساهم في الهدف الاستراتيجي",
            timeBound: dateAfterDays(60)
          },
          createdBy: adminUser.id,
          createdAt: nowISO()
        },
        {
          id: uid(),
          title: "هدف يومي لقناة واتساب",
          goalType: "Operational",
          campaignId: cmpA?.id || "",
          linkedType: "Channel",
          linkedId: "ch-whatsapp",
          targetValue: 12000,
          currentValue: 8200,
          deadline: dateAfterDays(7),
          smart: {
            specific: "رفع التبرعات اليومية عبر واتساب",
            measurable: "قياس يومي لقيمة التحصيل",
            achievable: "تحديث الرسائل الدعوية",
            relevant: "يدعم هدف رمضان",
            timeBound: dateAfterDays(7)
          },
          createdBy: adminUser.id,
          createdAt: nowISO()
        }
      ];
    }

    if (!data.risks.length) {
      const [cmpA, cmpB] = data.campaigns;
      data.risks = [
        {
          id: uid(),
          title: "ضعف التبرعات في أول أسبوع",
          campaignId: cmpA?.id || "",
          probability: "Medium",
          impact: "High",
          mitigation: "تعزيز المحتوى القصير وزيادة التواصل مع السفراء",
          ownerId: adminUser.id,
          status: "Open",
          createdBy: adminUser.id,
          createdAt: nowISO()
        },
        {
          id: uid(),
          title: "تأخر اعتماد ميزانية الإعلانات",
          campaignId: cmpB?.id || "",
          probability: "High",
          impact: "Medium",
          mitigation: "خطة بديلة بقنوات عضوية + تصعيد مبكر",
          ownerId: data.users.find((item) => item.role === "Marketing Manager")?.id || adminUser.id,
          status: "Monitoring",
          createdBy: adminUser.id,
          createdAt: nowISO()
        }
      ];
    }

    if (!data.donations.length) {
      data.donations = buildSampleDonations(data);
    }

    if (!data.teacherReports.length) {
      data.teacherReports = [
        {
          id: "t-001",
          pin: "2244",
          name: "م. عبدالله القحطاني",
          branch: "فرع الرياض",
          target: 20,
          achieved: 14,
          achievedItems: [
            { title: "متابعة سفراء الفرع", note: "إنجاز 7 من 8 سفراء" },
            { title: "اعتماد خطة النشر", note: "تم اعتماد خطة الأسبوع" },
            { title: "رفع تقرير القنوات", note: "تقرير أسبوعي مكتمل" }
          ],
          pendingItems: [
            { title: "استكمال هدف اليوم", note: "المتبقي 12,500 ريال" },
            { title: "مراجعة أكواد الإحالة", note: "تفعيل كودين جديدين" }
          ]
        },
        {
          id: "t-002",
          pin: "7788",
          name: "أ. نورة السلمي",
          branch: "فرع جدة",
          target: 18,
          achieved: 9,
          achievedItems: [{ title: "تنسيق فريق التواصل", note: "تم تفعيل الحملة اليومية" }],
          pendingItems: [
            { title: "رفع نسبة التحويل", note: "المطلوب +3% خلال 3 أيام" },
            { title: "تحديث ميزانية الإعلانات", note: "تعديل تقسيم القنوات" }
          ]
        }
      ];
    }
  }

  function seedDemoUsers(data) {
    const users = [
      {
        name: "مدير التسويق",
        email: "marketing@quran.org",
        role: "Marketing Manager",
        branchId: "br-main",
        referralCode: "",
        phone: "0500000001"
      },
      {
        name: "مدير فرع الرياض",
        email: "branch.riyadh@quran.org",
        role: "Branch Manager",
        branchId: "br-riyadh",
        referralCode: "",
        phone: "0500000002"
      },
      {
        name: "سفير رقمي",
        email: "ambassador@quran.org",
        role: "Ambassador",
        branchId: "br-main",
        referralCode: "AMB-003",
        phone: "0500000003"
      },
      {
        name: "مستخدم عرض",
        email: "viewer@quran.org",
        role: "Viewer",
        branchId: "br-main",
        referralCode: "",
        phone: "0500000004"
      }
    ];

    users.forEach((demo) => {
      if (data.users.some((user) => user.email === demo.email)) return;
      data.users.push({
        id: uid(),
        name: demo.name,
        email: demo.email,
        password: "123456",
        role: demo.role,
        branchId: demo.branchId,
        referralCode: demo.referralCode,
        phone: demo.phone,
        isDemo: true,
        createdAt: nowISO()
      });
    });
  }

  function buildSampleDonations(data) {
    const donors = [
      "0501111111",
      "0502222222",
      "0503333333",
      "0504444444",
      "0505555555",
      "0506666666",
      "0507777777",
      "0508888888",
      "0509999999",
      "0510000000"
    ];

    const amounts = [150, 240, 380, 520, 700, 900, 1200, 1650, 2100, 430, 860, 990, 1300];
    const donations = [];

    for (let i = 0; i < 54; i += 1) {
      const campaign = data.campaigns[i % data.campaigns.length];
      const project = data.projects[(i + 1) % data.projects.length];
      const channel = data.channels[(i + 2) % data.channels.length];
      const ambassador = data.ambassadors[i % data.ambassadors.length];

      donations.push({
        id: uid(),
        donorPhone: donors[i % donors.length],
        amount: amounts[i % amounts.length] + (i % 4) * 60,
        date: dateDaysAgo(i % 26),
        campaignId: campaign.id,
        projectId: project.id,
        channelId: channel.id,
        referralCode: i % 7 === 0 ? "" : ambassador.code,
        branchId: ambassador.branchId,
        createdBy: "seed",
        createdAt: nowISO()
      });
    }

    return donations.sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  function ensureBranch(data, branchName) {
    const clean = branchName.trim();
    const found = data.branches.find((item) => item.name === clean);
    if (found) return found;

    const branch = { id: uid(), name: clean };
    data.branches.push(branch);
    return branch;
  }

  function loadStore() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        return JSON.parse(raw);
      }

      for (const key of LEGACY_STORAGE_KEYS) {
        const legacyRaw = localStorage.getItem(key);
        if (legacyRaw) {
          const legacy = JSON.parse(legacyRaw);
          return legacy;
        }
      }

      return null;
    } catch (_error) {
      return null;
    }
  }

  function saveStore(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  function getSession() {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (_error) {
      return null;
    }
  }

  function setSession(session) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  }

  function clearSession() {
    localStorage.removeItem(SESSION_KEY);
  }

  function showToast(message, type = "success") {
    const root = byId("toast-root");
    if (!root) return;

    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.textContent = message;
    root.appendChild(toast);

    requestAnimationFrame(() => toast.classList.add("show"));

    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => toast.remove(), 230);
    }, 2800);
  }

  function showLoadingState(el, message) {
    if (!el) return;
    el.className = "state-box state-loading";
    el.innerHTML = `
      <div>${esc(message)}</div>
      <div class="skeleton-grid" style="margin-top:0.6rem">
        <span class="skeleton"></span>
        <span class="skeleton"></span>
        <span class="skeleton"></span>
      </div>
    `;
  }

  function showEmptyState(el, message) {
    if (!el) return;
    el.className = "state-box state-empty";
    el.textContent = message;
    el.classList.remove("hidden");
  }

  function showErrorState(el, message) {
    if (!el) return;
    el.className = "state-box state-error";
    el.textContent = message;
    el.classList.remove("hidden");
  }

  function setStatus(el, message, type = "info") {
    if (!el) return;

    const stateClass = type === "error" ? "state-error" : type === "empty" ? "state-empty" : "state-loading";
    el.className = `state-box ${stateClass}`;
    el.textContent = message;
  }

  function normalizeStage(stage) {
    if (stage === "Monitoring & Control") return "Monitoring";
    return STAGE_ORDER.includes(stage) ? stage : "Planning";
  }

  function formToObject(form) {
    return Object.fromEntries(new FormData(form).entries());
  }

  function byId(id) {
    return document.getElementById(id);
  }

  function uid() {
    if (window.crypto?.randomUUID) return window.crypto.randomUUID();
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  function nowISO() {
    return new Date().toISOString();
  }

  function todayISO() {
    return new Date().toISOString().slice(0, 10);
  }

  function dateAfterDays(days) {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString().slice(0, 10);
  }

  function dateDaysAgo(days) {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date.toISOString().slice(0, 10);
  }

  function toSAR(value) {
    return new Intl.NumberFormat("ar-SA", {
      style: "currency",
      currency: "SAR",
      maximumFractionDigits: 0
    }).format(Number(value || 0));
  }

  function toNumber(value) {
    return new Intl.NumberFormat("ar-SA", {
      maximumFractionDigits: 0
    }).format(Number(value || 0));
  }

  function formatDateOnly(value) {
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "-";
    return new Intl.DateTimeFormat("ar-SA", { dateStyle: "medium" }).format(date);
  }

  function formatDateTime(value) {
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "-";

    return new Intl.DateTimeFormat("ar-SA", {
      dateStyle: "medium",
      timeStyle: "short"
    }).format(date);
  }

  function esc(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, Number(value || 0)));
  }
})();
