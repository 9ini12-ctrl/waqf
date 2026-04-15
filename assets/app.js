(() => {
  const STORAGE_KEY = "mcmp_data_v1";
  const SESSION_KEY = "mcmp_session_v1";

  const ROLE_LABELS = {
    Admin: "الإدارة العليا",
    "Marketing Manager": "مدير التسويق",
    "Branch Manager": "مدير فرع",
    Ambassador: "سفير",
    Viewer: "عرض فقط"
  };

  const PAGE = document.body?.dataset?.page || "";

  document.addEventListener("DOMContentLoaded", () => {
    try {
      switch (PAGE) {
        case "index":
          initIndexPage();
          break;
        case "app":
          initAppPage();
          break;
        case "public":
          initPublicPage();
          break;
        case "teacher":
          initTeacherPublicPage();
          break;
        case "error-page":
          initErrorPage();
          break;
        default:
          break;
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

    if (session?.userId && data.users.some((u) => u.id === session.userId)) {
      window.location.href = "app.html";
      return;
    }

    const bootstrapSection = byId("bootstrap-section");
    const loginSection = byId("login-section");
    const statusEl = byId("index-status");
    const demoUsersList = byId("demo-users-list");
    const bootstrapForm = byId("bootstrap-form");
    const loginForm = byId("login-form");

    const hasUsers = data.users.length > 0;
    bootstrapSection.classList.toggle("hidden", hasUsers);
    loginSection.classList.toggle("hidden", !hasUsers);

    renderDemoUsers(data.users, demoUsersList);

    const urlMessage = new URLSearchParams(window.location.search).get("msg");
    if (urlMessage) {
      setStatus(statusEl, decodeURIComponent(urlMessage), "info");
    }

    bootstrapForm?.addEventListener("submit", (event) => {
      event.preventDefault();

      const payload = formToObject(bootstrapForm);
      if (!payload.name || !payload.email || !payload.password || !payload.branch || !payload.phone) {
        setStatus(statusEl, "أكمل جميع بيانات التهيئة أولاً.", "error");
        return;
      }

      if (payload.password.length < 6) {
        setStatus(statusEl, "كلمة المرور يجب أن تكون 6 أحرف أو أكثر.", "error");
        return;
      }

      if (data.users.some((user) => user.email.toLowerCase() === payload.email.toLowerCase())) {
        setStatus(statusEl, "هذا البريد مستخدم بالفعل.", "error");
        return;
      }

      const branch = ensureBranch(data, payload.branch.trim());
      const adminUser = {
        id: uid(),
        name: payload.name.trim(),
        email: payload.email.trim().toLowerCase(),
        password: payload.password,
        phone: payload.phone.trim(),
        role: "Admin",
        branchId: branch.id,
        referralCode: "",
        createdAt: nowISO()
      };

      data.users.push(adminUser);
      seedOperationalData(data, adminUser);
      saveStore(data);
      setSession({ userId: adminUser.id });

      showToast("تم إنشاء المدير الأول بنجاح.", "success");
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
        showToast("فشل تسجيل الدخول.", "error");
        return;
      }

      setSession({ userId: user.id });
      showToast("تم تسجيل الدخول.", "success");
      window.location.href = "app.html";
    });
  }

  function initAppPage() {
    const data = ensureStore();
    const session = getSession();
    const user = data.users.find((u) => u.id === session?.userId);

    if (!user) {
      window.location.href = "index.html?msg=" + encodeURIComponent("يرجى تسجيل الدخول أولاً");
      return;
    }

    const ui = {
      status: byId("app-status"),
      userName: byId("user-name"),
      userRole: byId("user-role"),
      scopeBadge: byId("scope-badge"),
      achievementCircle: byId("achievement-circle"),
      achievementCircleText: byId("achievement-circle-text"),
      achievementBar: byId("achievement-progress-bar"),
      achievementLabel: byId("achievement-progress-label"),
      kpiTotal: byId("kpi-total"),
      kpiDonors: byId("kpi-donors"),
      kpiAvg: byId("kpi-avg"),
      kpiCpa: byId("kpi-cpa"),
      kpiRepeat: byId("kpi-repeat"),
      campaignForm: byId("campaign-form"),
      donationForm: byId("donation-form"),
      donationDate: byId("donation-date"),
      donationCampaign: byId("donation-campaign"),
      donationProject: byId("donation-project"),
      donationChannel: byId("donation-channel"),
      campaignFilter: byId("campaign-filter"),
      channelFilter: byId("channel-filter"),
      projectFilter: byId("project-filter"),
      sortFilter: byId("sort-filter"),
      searchInput: byId("search-input"),
      filterForm: byId("filter-form"),
      resetFilters: byId("reset-filters-btn"),
      simulateError: byId("simulate-error-btn"),
      donationsState: byId("donations-panel-state"),
      donationsContent: byId("donations-content"),
      donationsCount: byId("donations-count-badge"),
      channelsContent: byId("channels-content"),
      ambassadorsContent: byId("ambassadors-content"),
      reportsContent: byId("reports-content"),
      exportCsvBtn: byId("export-csv-btn"),
      logoutBtn: byId("logout-btn")
    };

    ui.userName.textContent = esc(user.name);
    ui.userRole.textContent = ROLE_LABELS[user.role] || user.role;
    ui.scopeBadge.textContent = scopeText(user, data);
    ui.donationDate.value = todayISO();

    toggleManagementByRole(user, ui);
    fillSelectOptions(data, ui);

    const appState = {
      filters: {
        search: "",
        campaign: "all",
        channel: "all",
        project: "all",
        sort: "latest"
      },
      simulateError: false
    };

    ui.logoutBtn.addEventListener("click", () => {
      clearSession();
      window.location.href = "index.html?msg=" + encodeURIComponent("تم تسجيل الخروج بنجاح");
    });

    ui.campaignForm?.addEventListener("submit", (event) => {
      event.preventDefault();
      const payload = formToObject(ui.campaignForm);

      if (!payload.name || !payload.type || !payload.target || !payload.startDate || !payload.endDate) {
        setStatus(ui.status, "أكمل بيانات الحملة قبل الحفظ.", "error");
        return;
      }

      if (Number(payload.target) <= 0) {
        setStatus(ui.status, "الهدف المالي يجب أن يكون أكبر من صفر.", "error");
        return;
      }

      if (payload.endDate < payload.startDate) {
        setStatus(ui.status, "تاريخ النهاية يجب أن يكون بعد البداية.", "error");
        return;
      }

      const campaign = {
        id: uid(),
        name: payload.name.trim(),
        type: payload.type,
        targetAmount: Number(payload.target),
        startDate: payload.startDate,
        endDate: payload.endDate,
        branchId: user.branchId || data.branches[0]?.id || "",
        createdBy: user.id,
        createdAt: nowISO()
      };

      data.campaigns.push(campaign);
      saveStore(data);
      ui.campaignForm.reset();
      fillSelectOptions(data, ui);
      renderDashboard(data, user, ui, appState);
      setStatus(ui.status, "تم إنشاء الحملة بنجاح.", "info");
      showToast("تم إنشاء الحملة.", "success");
    });

    ui.donationForm?.addEventListener("submit", (event) => {
      event.preventDefault();
      const payload = formToObject(ui.donationForm);

      if (!payload.donorPhone || !payload.amount || !payload.date || !payload.campaign || !payload.project || !payload.channel) {
        setStatus(ui.status, "أكمل بيانات التبرع قبل الحفظ.", "error");
        return;
      }

      const amount = Number(payload.amount);
      if (!Number.isFinite(amount) || amount <= 0) {
        setStatus(ui.status, "قيمة التبرع غير صحيحة.", "error");
        return;
      }

      const referralCode = (payload.referral || "").trim().toUpperCase();
      const ambassador = data.ambassadors.find((item) => item.code.toUpperCase() === referralCode);

      const donation = {
        id: uid(),
        donorPhone: payload.donorPhone.trim(),
        amount,
        date: payload.date,
        campaignId: payload.campaign,
        projectId: payload.project,
        channelId: payload.channel,
        referralCode,
        branchId: ambassador?.branchId || user.branchId || data.branches[0]?.id || "",
        createdBy: user.id,
        createdAt: nowISO()
      };

      data.donations.unshift(donation);
      saveStore(data);
      ui.donationForm.reset();
      ui.donationDate.value = todayISO();
      renderDashboard(data, user, ui, appState);
      setStatus(ui.status, "تم تسجيل التبرع بنجاح.", "info");
      showToast("تم حفظ التبرع.", "success");
    });

    ui.filterForm?.addEventListener("submit", (event) => {
      event.preventDefault();
      applyFiltersFromUI(ui, appState);
      renderDashboard(data, user, ui, appState);
    });

    ui.searchInput?.addEventListener("input", () => {
      appState.filters.search = ui.searchInput.value.trim();
      renderDashboard(data, user, ui, appState);
    });

    ui.resetFilters?.addEventListener("click", () => {
      appState.filters = {
        search: "",
        campaign: "all",
        channel: "all",
        project: "all",
        sort: "latest"
      };
      resetFilterUI(ui);
      renderDashboard(data, user, ui, appState);
    });

    ui.simulateError?.addEventListener("click", () => {
      appState.simulateError = !appState.simulateError;
      ui.simulateError.textContent = appState.simulateError ? "إيقاف محاكاة الخطأ" : "محاكاة خطأ";
      renderDashboard(data, user, ui, appState);
    });

    ui.exportCsvBtn?.addEventListener("click", () => {
      const scoped = scopedDonations(data, user);
      const filtered = filterDonations(scoped, appState.filters, data);
      exportDonationsCSV(filtered, data);
      showToast("تم تصدير الملف CSV.", "success");
    });

    showLoadingState(ui.donationsState, "جاري تجهيز السجل...");
    ui.donationsContent.classList.add("hidden");

    setTimeout(() => {
      renderDashboard(data, user, ui, appState);
      setStatus(ui.status, "تم تحميل لوحة التحكم بنجاح.", "info");
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
      showToast("جارٍ تحديث التقارير...", "success");
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
        showToast("تعذر العثور على بيانات لهذا الرمز.", "error");
        return;
      }

      renderTeacherReport(report, ui);
      setStatus(ui.status, "تم تحميل البيانات بنجاح.", "info");
      showToast("تم التحقق من الرمز.", "success");
    });
  }

  function initErrorPage() {
    const retryBtn = byId("retry-error-btn");
    retryBtn?.addEventListener("click", () => {
      window.location.reload();
    });
  }

  function renderDashboard(data, user, ui, appState) {
    const scoped = scopedDonations(data, user);
    const filtered = filterDonations(scoped, appState.filters, data);
    const scopedCampaigns = scopedCampaignList(data, user, scoped);

    const metrics = computeKPIs(scoped, scopedCampaigns, data);

    ui.kpiTotal.textContent = toSAR(metrics.total);
    ui.kpiDonors.textContent = toNumber(metrics.donors);
    ui.kpiAvg.textContent = toSAR(metrics.average);
    ui.kpiCpa.textContent = toSAR(metrics.costPerDonor);
    ui.kpiRepeat.textContent = `${metrics.repeatRate.toFixed(1)}%`;

    ui.achievementCircle.style.setProperty("--value", clamp(metrics.achievement, 0, 100).toFixed(1));
    ui.achievementCircleText.textContent = `${metrics.achievement.toFixed(0)}%`;
    ui.achievementBar.style.width = `${clamp(metrics.achievement, 0, 100)}%`;
    ui.achievementLabel.textContent = `${toSAR(metrics.total)} / ${toSAR(metrics.target)}`;

    if (appState.simulateError) {
      ui.donationsContent.classList.add("hidden");
      showErrorState(ui.donationsState, "حدث خطأ تجريبي في تحميل سجل التبرعات.");
    } else if (!filtered.length) {
      ui.donationsContent.classList.add("hidden");
      showEmptyState(ui.donationsState, "لا توجد نتائج مطابقة للتصفية الحالية.");
    } else {
      ui.donationsState.classList.add("hidden");
      ui.donationsContent.classList.remove("hidden");
      ui.donationsContent.innerHTML = renderDonationsDataBlock(filtered, data);
    }

    ui.donationsCount.textContent = `${toNumber(filtered.length)} سجل`;

    renderChannelsSection(data, scoped, ui.channelsContent);
    renderAmbassadorsSection(data, scoped, ui.ambassadorsContent);
    renderReportsSection(data, scopedCampaigns, scoped, ui.reportsContent);
  }

  function loadPublic(ui, data, softRefresh) {
    showLoadingState(ui.status, softRefresh ? "جارٍ تحديث التقارير العامة..." : "جاري تحميل التقارير العامة...");
    showLoadingState(ui.campaignsState, "جاري تحليل الحملات...");
    showLoadingState(ui.channelsState, "جاري تجهيز تقرير القنوات...");
    showLoadingState(ui.ambassadorsState, "جاري تحميل ترتيب السفراء...");

    ui.campaignsContent.classList.add("hidden");
    ui.channelsContent.classList.add("hidden");
    ui.ambassadorsContent.classList.add("hidden");

    setTimeout(() => {
      const campaigns = data.campaigns;
      const donations = data.donations;
      const metrics = computeKPIs(donations, campaigns, data);
      const channels = aggregateChannels(donations, data);
      const ambassadors = aggregateAmbassadors(donations, data);

      ui.kpiTotal.textContent = toSAR(metrics.total);
      ui.kpiAchievement.textContent = `${metrics.achievement.toFixed(1)}%`;
      ui.kpiDonors.textContent = toNumber(metrics.donors);
      ui.kpiBestChannel.textContent = channels[0]?.name || "-";
      ui.kpiBestAmbassador.textContent = ambassadors[0]?.name || "-";
      ui.lastUpdate.textContent = `آخر تحديث: ${formatDateTime(nowISO())}`;

      if (!campaigns.length) {
        showEmptyState(ui.campaignsState, "لا توجد حملات حالية.");
      } else {
        ui.campaignsState.classList.add("hidden");
        ui.campaignsContent.classList.remove("hidden");
        ui.campaignsContent.innerHTML = renderCampaignComparison(campaigns, donations);
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

  function toggleManagementByRole(user, ui) {
    const canManageCampaigns = ["Admin", "Marketing Manager"].includes(user.role);
    const canRecordDonations = ["Admin", "Marketing Manager", "Branch Manager"].includes(user.role);

    const campaignCard = ui.campaignForm?.closest(".section-card");
    const donationCard = ui.donationForm?.closest(".section-card");

    if (campaignCard) {
      campaignCard.classList.toggle("hidden", !canManageCampaigns);
    }

    if (donationCard) {
      donationCard.classList.toggle("hidden", !canRecordDonations);
    }
  }

  function fillSelectOptions(data, ui) {
    fillSelect(ui.donationCampaign, data.campaigns, "id", "name", "اختر حملة", false);
    fillSelect(ui.donationProject, data.projects, "id", "name", "اختر مشروع", false);
    fillSelect(ui.donationChannel, data.channels, "id", "name", "اختر قناة", false);

    fillSelect(ui.campaignFilter, data.campaigns, "id", "name", "كل الحملات", true);
    fillSelect(ui.channelFilter, data.channels, "id", "name", "كل القنوات", true);
    fillSelect(ui.projectFilter, data.projects, "id", "name", "كل المشاريع", true);
  }

  function fillSelect(selectEl, items, valueKey, labelKey, firstLabel, allowAll) {
    if (!selectEl) return;
    const firstValue = allowAll ? "all" : "";

    selectEl.innerHTML = [
      `<option value="${firstValue}">${esc(firstLabel)}</option>`,
      ...items.map((item) => `<option value="${esc(item[valueKey])}">${esc(item[labelKey])}</option>`)
    ].join("");
  }

  function applyFiltersFromUI(ui, appState) {
    appState.filters = {
      search: (ui.searchInput.value || "").trim(),
      campaign: ui.campaignFilter.value || "all",
      channel: ui.channelFilter.value || "all",
      project: ui.projectFilter.value || "all",
      sort: ui.sortFilter.value || "latest"
    };
  }

  function resetFilterUI(ui) {
    ui.searchInput.value = "";
    ui.campaignFilter.value = "all";
    ui.channelFilter.value = "all";
    ui.projectFilter.value = "all";
    ui.sortFilter.value = "latest";
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

  function renderAmbassadorsSection(data, donations, container) {
    const ambassadors = aggregateAmbassadors(donations, data);
    if (!ambassadors.length) {
      container.innerHTML = `<div class="state-box state-empty">لا توجد إحالات مسجلة ضمن النطاق الحالي.</div>`;
      return;
    }

    container.innerHTML = ambassadors
      .slice(0, 12)
      .map(
        (item, index) => `
          <article class="list-item">
            <div class="meta">
              <h4>${esc(item.name)}</h4>
              <p>الكود: ${esc(item.code)} | عدد التبرعات: ${toNumber(item.count)}</p>
            </div>
            <div style="text-align:left">
              <span class="badge ${index < 3 ? "badge-success" : "badge-info"}">#${toNumber(index + 1)}</span>
              <p class="inline-note" style="margin:0.25rem 0 0">${toSAR(item.total)}</p>
            </div>
          </article>
        `
      )
      .join("");
  }

  function renderReportsSection(data, campaigns, donations, container) {
    if (!campaigns.length) {
      container.innerHTML = `<div class="state-box state-empty">لا توجد حملات لتوليد التقرير.</div>`;
      return;
    }

    const daily = aggregateDaily(donations, 7);
    const topCampaign = campaignRanking(campaigns, donations)[0];

    const dailyBlock = `
      <article class="list-item">
        <div class="meta">
          <h4>تقرير 7 أيام</h4>
          <p>إجمالي آخر 7 أيام: ${toSAR(daily.total)} | عدد العمليات: ${toNumber(daily.count)}</p>
        </div>
        <span class="badge badge-info">يومي</span>
      </article>
    `;

    const topCampaignBlock = topCampaign
      ? `
      <article class="list-item">
        <div class="meta">
          <h4>أفضل حملة حاليًا</h4>
          <p>${esc(topCampaign.name)} - إنجاز ${topCampaign.achievement.toFixed(1)}%</p>
        </div>
        <span class="badge badge-success">Top</span>
      </article>
      `
      : "";

    const compareBlock = campaignRanking(campaigns, donations)
      .slice(0, 4)
      .map(
        (item) => `
          <article class="list-item">
            <div class="meta" style="width:100%">
              <h4>${esc(item.name)}</h4>
              <p>${toSAR(item.total)} من ${toSAR(item.target)}</p>
              <div class="progress"><span style="width:${clamp(item.achievement, 0, 100)}%"></span></div>
            </div>
            <span class="badge badge-info">${item.achievement.toFixed(0)}%</span>
          </article>
        `
      )
      .join("");

    container.innerHTML = `${dailyBlock}${topCampaignBlock}${compareBlock}`;
  }

  function renderDonationsDataBlock(donations, data) {
    const rows = donations
      .map((donation) => {
        const campaign = data.campaigns.find((item) => item.id === donation.campaignId);
        const project = data.projects.find((item) => item.id === donation.projectId);
        const channel = data.channels.find((item) => item.id === donation.channelId);

        return {
          id: donation.id,
          donorPhone: donation.donorPhone,
          amount: donation.amount,
          date: donation.date,
          campaign: campaign?.name || "-",
          project: project?.name || "-",
          channel: channel?.name || "-",
          referral: donation.referralCode || "-"
        };
      })
      .slice(0, 250);

    const tableRows = rows
      .map(
        (row) => `
      <tr>
        <td>${esc(row.donorPhone)}</td>
        <td>${toSAR(row.amount)}</td>
        <td>${formatDateOnly(row.date)}</td>
        <td>${esc(row.campaign)}</td>
        <td>${esc(row.project)}</td>
        <td>${esc(row.channel)}</td>
        <td>${esc(row.referral)}</td>
      </tr>
    `
      )
      .join("");

    const cardRows = rows
      .map(
        (row) => `
      <article class="data-card">
        <p><strong>المتبرع:</strong> ${esc(row.donorPhone)}</p>
        <p><strong>المبلغ:</strong> ${toSAR(row.amount)}</p>
        <p><strong>التاريخ:</strong> ${formatDateOnly(row.date)}</p>
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
                <th>الحملة</th>
                <th>المشروع</th>
                <th>القناة</th>
                <th>الإحالة</th>
              </tr>
            </thead>
            <tbody>
              ${tableRows}
            </tbody>
          </table>
        </div>
        <div class="mobile-cards">
          ${cardRows}
        </div>
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
            <h4>${esc(item.name)} <span class="badge badge-info">${esc(item.type)}</span></h4>
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
    const cards = channels
      .map(
        (channel) => `
      <article class="data-card">
        <p><strong>القناة:</strong> ${esc(channel.name)}</p>
        <p><strong>العائد:</strong> ${toSAR(channel.revenue)}</p>
        <p><strong>التكلفة:</strong> ${toSAR(channel.cost)}</p>
        <p><strong>ROI:</strong> ${channel.roi.toFixed(2)}</p>
        <div class="progress"><span style="width:${clamp(channel.achievement, 0, 100)}%"></span></div>
      </article>
    `
      )
      .join("");

    const rows = channels
      .map(
        (channel) => `
      <tr>
        <td>${esc(channel.name)}</td>
        <td>${toSAR(channel.revenue)}</td>
        <td>${toSAR(channel.cost)}</td>
        <td>${channel.roi.toFixed(2)}</td>
        <td>${toNumber(channel.donors)}</td>
      </tr>
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
        (item, index) => `
      <article class="list-item">
        <div class="meta">
          <h4>${esc(item.name)}</h4>
          <p>الكود: ${esc(item.code)} | عدد العمليات: ${toNumber(item.count)}</p>
        </div>
        <div style="text-align:left">
          <span class="badge ${index < 3 ? "badge-success" : "badge-info"}">#${toNumber(index + 1)}</span>
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
      "campaign",
      "project",
      "channel",
      "referral_code"
    ];

    const rows = donations.map((donation) => {
      const campaign = data.campaigns.find((item) => item.id === donation.campaignId)?.name || "";
      const project = data.projects.find((item) => item.id === donation.projectId)?.name || "";
      const channel = data.channels.find((item) => item.id === donation.channelId)?.name || "";

      return [
        donation.donorPhone,
        donation.amount,
        donation.date,
        campaign,
        project,
        channel,
        donation.referralCode || ""
      ];
    });

    const csv = [header, ...rows]
      .map((cols) => cols.map((val) => `"${String(val ?? "").replaceAll('"', '""')}"`).join(","))
      .join("\n");

    const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `donations-${todayISO()}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function scopedDonations(data, user) {
    if (["Admin", "Marketing Manager", "Viewer"].includes(user.role)) {
      return [...data.donations];
    }

    if (user.role === "Branch Manager") {
      return data.donations.filter((donation) => donation.branchId === user.branchId);
    }

    if (user.role === "Ambassador") {
      return data.donations.filter((donation) => donation.referralCode?.toUpperCase() === user.referralCode?.toUpperCase());
    }

    return [...data.donations];
  }

  function scopedCampaignList(data, user, donations) {
    if (["Admin", "Marketing Manager", "Viewer"].includes(user.role)) {
      return [...data.campaigns];
    }

    const ids = new Set(donations.map((item) => item.campaignId));
    return data.campaigns.filter((campaign) => ids.has(campaign.id));
  }

  function filterDonations(donations, filters, data) {
    let items = [...donations];

    if (filters.search) {
      const query = filters.search.toLowerCase();
      items = items.filter((item) => {
        const channelName = data.channels.find((ch) => ch.id === item.channelId)?.name || "";
        return (
          item.donorPhone.toLowerCase().includes(query) ||
          (item.referralCode || "").toLowerCase().includes(query) ||
          channelName.toLowerCase().includes(query)
        );
      });
    }

    if (filters.campaign && filters.campaign !== "all") {
      items = items.filter((item) => item.campaignId === filters.campaign);
    }

    if (filters.channel && filters.channel !== "all") {
      items = items.filter((item) => item.channelId === filters.channel);
    }

    if (filters.project && filters.project !== "all") {
      items = items.filter((item) => item.projectId === filters.project);
    }

    const sorter = {
      latest: (a, b) => new Date(b.date) - new Date(a.date),
      oldest: (a, b) => new Date(a.date) - new Date(b.date),
      high: (a, b) => b.amount - a.amount,
      low: (a, b) => a.amount - b.amount
    };

    items.sort(sorter[filters.sort] || sorter.latest);
    return items;
  }

  function computeKPIs(donations, campaigns, data) {
    const total = donations.reduce((sum, item) => sum + item.amount, 0);
    const target = campaigns.reduce((sum, item) => sum + item.targetAmount, 0);

    const donorMap = new Map();
    donations.forEach((item) => {
      donorMap.set(item.donorPhone, (donorMap.get(item.donorPhone) || 0) + 1);
    });

    const donors = donorMap.size;
    const repeatDonors = [...donorMap.values()].filter((count) => count > 1).length;
    const repeatRate = donors ? (repeatDonors / donors) * 100 : 0;

    const average = donations.length ? total / donations.length : 0;

    const channelsUsed = new Set(donations.map((item) => item.channelId));
    const cost = data.channelCosts
      .filter((item) => channelsUsed.has(item.channelId))
      .reduce((sum, item) => sum + item.cost, 0);

    const costPerDonor = donors ? cost / donors : 0;
    const achievement = target ? (total / target) * 100 : 0;

    return {
      total,
      target,
      donors,
      average,
      costPerDonor,
      repeatRate,
      achievement
    };
  }

  function aggregateChannels(donations, data) {
    const map = new Map();
    donations.forEach((item) => {
      const curr = map.get(item.channelId) || { revenue: 0, donors: new Set(), count: 0 };
      curr.revenue += item.amount;
      curr.count += 1;
      curr.donors.add(item.donorPhone);
      map.set(item.channelId, curr);
    });

    const maxRevenue = Math.max(1, ...[...map.values()].map((value) => value.revenue));

    return [...map.entries()]
      .map(([channelId, value]) => {
        const channel = data.channels.find((item) => item.id === channelId);
        const channelCost = data.channelCosts.find((item) => item.channelId === channelId)?.cost || 0;
        const roi = channelCost > 0 ? value.revenue / channelCost : value.revenue > 0 ? value.revenue : 0;

        return {
          channelId,
          name: channel?.name || "-",
          revenue: value.revenue,
          cost: channelCost,
          roi,
          count: value.count,
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
      const curr = map.get(code) || { total: 0, count: 0 };
      curr.total += item.amount;
      curr.count += 1;
      map.set(code, curr);
    });

    return [...map.entries()]
      .map(([code, value]) => {
        const ambassador = data.ambassadors.find((item) => item.code.toUpperCase() === code);
        return {
          code,
          name: ambassador?.name || code,
          branchId: ambassador?.branchId || "",
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
        const achievement = campaign.targetAmount ? (total / campaign.targetAmount) * 100 : 0;

        return {
          id: campaign.id,
          name: campaign.name,
          type: campaign.type,
          total,
          target: campaign.targetAmount,
          achievement
        };
      })
      .sort((a, b) => b.achievement - a.achievement);
  }

  function aggregateDaily(donations, days = 7) {
    const today = new Date();
    const start = new Date(today);
    start.setDate(today.getDate() - (days - 1));

    const scoped = donations.filter((item) => new Date(item.date) >= start);
    return {
      total: scoped.reduce((sum, item) => sum + item.amount, 0),
      count: scoped.length
    };
  }

  function scopeText(user, data) {
    if (["Admin", "Marketing Manager", "Viewer"].includes(user.role)) {
      return "عرض شامل";
    }

    if (user.role === "Branch Manager") {
      const branchName = data.branches.find((item) => item.id === user.branchId)?.name || "-";
      return `فرع: ${branchName}`;
    }

    if (user.role === "Ambassador") {
      return `سفير: ${user.referralCode}`;
    }

    return "نطاق مخصص";
  }

  function setStatus(el, message, type = "info") {
    if (!el) return;

    const variant = type === "error" ? "state-error" : type === "empty" ? "state-empty" : "state-loading";
    el.className = `state-box ${variant}`;
    el.textContent = message;
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
      setTimeout(() => toast.remove(), 240);
    }, 2800);
  }

  function ensureStore() {
    const existing = loadStore();
    if (existing) return existing;

    const initial = {
      meta: {
        app: "marketing-campaign-management",
        version: 1,
        createdAt: nowISO()
      },
      users: [],
      branches: [
        { id: "br-main", name: "الفرع الرئيسي" },
        { id: "br-riyadh", name: "فرع الرياض" },
        { id: "br-jeddah", name: "فرع جدة" }
      ],
      projects: [],
      campaigns: [],
      channels: [],
      channelCosts: [],
      ambassadors: [],
      donations: [],
      teacherReports: []
    };

    saveStore(initial);
    return initial;
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

    if (!data.campaigns.length) {
      const now = new Date();
      const thisYear = now.getFullYear();
      data.campaigns = [
        {
          id: "cmp-ramadan",
          name: `حملة رمضان ${thisYear}`,
          type: "رمضان",
          targetAmount: 450000,
          startDate: `${thisYear}-02-20`,
          endDate: `${thisYear}-04-05`,
          branchId: adminUser.branchId,
          createdBy: adminUser.id,
          createdAt: nowISO()
        },
        {
          id: "cmp-waqf-growth",
          name: "حملة الوقف التنموي",
          type: "وقف",
          targetAmount: 280000,
          startDate: `${thisYear}-01-01`,
          endDate: `${thisYear}-12-31`,
          branchId: "br-riyadh",
          createdBy: adminUser.id,
          createdAt: nowISO()
        },
        {
          id: "cmp-student-sponsor",
          name: "حملة كفالة الطلاب",
          type: "كفالة",
          targetAmount: 220000,
          startDate: `${thisYear}-03-01`,
          endDate: `${thisYear}-09-30`,
          branchId: "br-jeddah",
          createdBy: adminUser.id,
          createdAt: nowISO()
        }
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
          achievedItems: [
            { title: "تنسيق فريق التواصل", note: "تم تفعيل الحملة اليومية" }
          ],
          pendingItems: [
            { title: "رفع نسبة التحويل", note: "المطلوب +3% خلال 3 أيام" },
            { title: "تحديث ميزانية الإعلانات", note: "تعديل تقسيم القنوات" }
          ]
        }
      ];
    }
  }

  function seedDemoUsers(data) {
    const demoSet = [
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

    demoSet.forEach((demo) => {
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

    const amountPattern = [120, 250, 500, 1000, 1500, 300, 700, 2000, 450, 900, 1300];
    const donations = [];

    for (let i = 0; i < 42; i += 1) {
      const campaign = data.campaigns[i % data.campaigns.length];
      const project = data.projects[(i + 1) % data.projects.length];
      const channel = data.channels[(i + 2) % data.channels.length];
      const ambassador = data.ambassadors[i % data.ambassadors.length];
      const date = dateDaysAgo(i % 28);
      const donorPhone = donors[i % donors.length];

      donations.push({
        id: uid(),
        donorPhone,
        amount: amountPattern[i % amountPattern.length] + (i % 5) * 50,
        date,
        campaignId: campaign.id,
        projectId: project.id,
        channelId: channel.id,
        referralCode: i % 6 === 0 ? "" : ambassador.code,
        branchId: ambassador.branchId,
        createdBy: "seed",
        createdAt: nowISO()
      });
    }

    return donations.sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  function ensureBranch(data, branchName) {
    const clean = branchName.trim();
    const found = data.branches.find((branch) => branch.name === clean);
    if (found) return found;

    const added = { id: uid(), name: clean };
    data.branches.push(added);
    return added;
  }

  function loadStore() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== "object") return null;
      return parsed;
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

  function formToObject(formEl) {
    return Object.fromEntries(new FormData(formEl).entries());
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

  function dateDaysAgo(days) {
    const d = new Date();
    d.setDate(d.getDate() - days);
    return d.toISOString().slice(0, 10);
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
