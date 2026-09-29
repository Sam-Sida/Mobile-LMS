(function () {
  "use strict";

  const STORAGE_KEY = "mobileLMS";

  function loadState() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    } catch { return {}; }
  }
  function saveState(s) { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); }

  let state = Object.assign({ enrolled: {}, completed: {}, filters: {}, tab: "library" }, loadState());

  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  const courseGrid = $("#courseGrid");
  const emptyState = $("#emptyState");
  const searchInput = $("#searchInput");
  const filterOverlay = $("#filterOverlay");
  const filterDrawer = $("#filterDrawer");
  const filterChips = $("#filterChips");
  const modalOverlay = $("#modalOverlay");

  const CATEGORIES = [...new Set(COURSES.map((c) => c.category))].sort();
  const LEVELS = ["Beginner", "Intermediate", "Advanced"];
  const DURATIONS = ["Under 30 min", "30-60 min", "Over 60 min"];

  function init() {
    pendo.initialize({
      visitor: {
        id: ''
      }
    });

    renderFilterOptions("categoryFilters", CATEGORIES, "category");
    renderFilterOptions("levelFilters", LEVELS, "level");
    renderFilterOptions("durationFilters", DURATIONS, "duration");
    restoreFilters();
    renderCourses();
    bindEvents();
    switchTab(state.tab);
    registerSW();
  }

  function renderFilterOptions(containerId, options, group) {
    const container = document.getElementById(containerId);
    container.innerHTML = options
      .map(
        (o) =>
          `<button class="filter-option" data-group="${group}" data-value="${o}">${o}</button>`
      )
      .join("");
  }

  function restoreFilters() {
    if (!state.filters) return;
    Object.entries(state.filters).forEach(([group, values]) => {
      values.forEach((v) => {
        const btn = $(`.filter-option[data-group="${group}"][data-value="${v}"]`);
        if (btn) btn.classList.add("selected");
      });
    });
  }

  function getActiveFilters() {
    const filters = {};
    $$(".filter-option.selected").forEach((btn) => {
      const g = btn.dataset.group;
      if (!filters[g]) filters[g] = [];
      filters[g].push(btn.dataset.value);
    });
    return filters;
  }

  function matchesDuration(course, durationFilter) {
    const mins = parseInt(course.duration);
    if (durationFilter === "Under 30 min") return mins < 30;
    if (durationFilter === "30-60 min") return mins >= 30 && mins <= 60;
    if (durationFilter === "Over 60 min") return mins > 60;
    return true;
  }

  function filterCourses() {
    const filters = getActiveFilters();
    const query = searchInput.value.toLowerCase().trim();

    return COURSES.filter((c) => {
      if (query && !c.title.toLowerCase().includes(query) && !c.description.toLowerCase().includes(query) && !c.category.toLowerCase().includes(query))
        return false;
      if (filters.category && filters.category.length && !filters.category.includes(c.category))
        return false;
      if (filters.level && filters.level.length && !filters.level.includes(c.level))
        return false;
      if (filters.duration && filters.duration.length && !filters.duration.some((d) => matchesDuration(c, d)))
        return false;
      return true;
    });
  }

  function getProgress(courseId) {
    const done = state.completed[courseId] || [];
    const total = COURSES.find((c) => c.id === courseId)?.modules.length || 1;
    return Math.round((done.length / total) * 100);
  }

  function renderCourses() {
    const courses = filterCourses();
    emptyState.hidden = courses.length > 0;
    courseGrid.innerHTML = courses
      .map((c) => {
        const progress = getProgress(c.id);
        const isEnrolled = state.enrolled[c.id];
        return `
        <article class="course-card" data-id="${c.id}">
          <div class="card-image-placeholder" style="background:${c.color}20">${c.icon}</div>
          <div class="card-body">
            <div class="card-badges">
              <span class="badge badge-category">${c.category}</span>
              <span class="badge badge-level">${c.level}</span>
              <span class="badge badge-modules">${c.modules.length} Modules</span>
            </div>
            <h3 class="card-title">${c.title}</h3>
            <div class="card-meta">
              <span class="meta-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                ${c.duration}
              </span>
            </div>
            ${isEnrolled ? `<div class="card-progress"><div class="progress-fill" style="width:${progress}%"></div></div>` : ""}
          </div>
        </article>`;
      })
      .join("");
    renderChips();
  }

  function renderChips() {
    const filters = getActiveFilters();
    const chips = [];
    Object.entries(filters).forEach(([group, values]) => {
      values.forEach((v) => {
        chips.push(`<span class="chip">${v}<button class="chip-remove" data-group="${group}" data-value="${v}">&times;</button></span>`);
      });
    });
    filterChips.innerHTML = chips.join("");
  }

  function openModal(courseId) {
    const c = COURSES.find((x) => x.id === courseId);
    if (!c) return;

    $("#modalHero").style.background = `${c.color}20`;
    $("#modalHero").textContent = c.icon;
    $("#modalTitle").textContent = c.title;
    $("#modalDesc").textContent = c.description;
    $("#modalBadges").innerHTML = `
      <span class="badge badge-category">${c.category}</span>
      <span class="badge badge-level">${c.level}</span>
      <span class="badge badge-modules">${c.modules.length} Modules</span>
    `;

    const done = state.completed[courseId] || [];
    $("#moduleList").innerHTML = c.modules
      .map(
        (m, i) => `
      <div class="module-item" data-course="${courseId}" data-module="${i}">
        <div class="module-number">${i + 1}</div>
        <div class="module-info">
          <div class="module-name">${m.name}</div>
          <div class="module-duration">${m.duration}</div>
        </div>
        <div class="module-check ${done.includes(i) ? "completed" : ""}">
          ${done.includes(i) ? '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>' : ""}
        </div>
      </div>`
      )
      .join("");

    const isEnrolled = state.enrolled[courseId];
    const allDone = done.length === c.modules.length;
    const btn = $("#enrollBtn");
    btn.textContent = allDone ? "Completed" : isEnrolled ? "Continue Course" : "Start Course";
    btn.dataset.courseId = courseId;
    btn.disabled = allDone;
    btn.style.opacity = allDone ? 0.6 : 1;

    modalOverlay.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    modalOverlay.classList.remove("active");
    document.body.style.overflow = "";
  }

  function toggleModule(courseId, moduleIndex) {
    if (!state.completed[courseId]) state.completed[courseId] = [];
    const idx = state.completed[courseId].indexOf(moduleIndex);
    if (idx > -1) state.completed[courseId].splice(idx, 1);
    else state.completed[courseId].push(moduleIndex);
    saveState(state);
    openModal(courseId);
    renderCourses();
    renderMyCourses();
  }

  function enrollCourse(courseId) {
    state.enrolled[courseId] = true;
    if (!state.completed[courseId]) state.completed[courseId] = [];
    if (state.completed[courseId].length === 0) state.completed[courseId].push(0);
    saveState(state);
    openModal(courseId);
    renderCourses();
    renderMyCourses();
  }

  function switchTab(tab) {
    state.tab = tab;
    saveState(state);
    $$(".nav-item").forEach((n) => n.classList.toggle("active", n.dataset.tab === tab));

    const showLibrary = tab === "library";
    courseGrid.style.display = showLibrary ? "" : "none";
    $(".app-header .search-bar").style.display = showLibrary ? "" : "none";
    emptyState.hidden = showLibrary ? filterCourses().length > 0 : true;
    filterChips.style.display = showLibrary ? "" : "none";

    let myCoursesEl = document.getElementById("myCoursesTab");
    let profileEl = document.getElementById("profileTab");

    if (!myCoursesEl) {
      myCoursesEl = document.createElement("div");
      myCoursesEl.id = "myCoursesTab";
      courseGrid.parentNode.insertBefore(myCoursesEl, courseGrid.nextSibling);
    }
    if (!profileEl) {
      profileEl = document.createElement("div");
      profileEl.id = "profileTab";
      myCoursesEl.parentNode.insertBefore(profileEl, myCoursesEl.nextSibling);
    }

    myCoursesEl.style.display = tab === "my-courses" ? "block" : "none";
    profileEl.style.display = tab === "profile" ? "block" : "none";

    if (tab === "my-courses") renderMyCourses();
    if (tab === "profile") renderProfile();
  }

  function renderMyCourses() {
    const el = document.getElementById("myCoursesTab");
    const enrolledIds = Object.keys(state.enrolled).map(Number);
    const enrolled = COURSES.filter((c) => enrolledIds.includes(c.id));

    if (!enrolled.length) {
      el.innerHTML = `<div class="no-courses"><p>No courses yet</p><p class="hint">Browse the Library to get started</p></div>`;
      return;
    }

    const inProgress = enrolled.filter((c) => getProgress(c.id) < 100);
    const completed = enrolled.filter((c) => getProgress(c.id) === 100);

    let html = "";
    if (inProgress.length) {
      html += `<h2 class="section-header">In Progress</h2><div class="course-grid" style="padding-top:0">`;
      html += inProgress.map((c) => courseCard(c)).join("");
      html += `</div>`;
    }
    if (completed.length) {
      html += `<h2 class="section-header">Completed</h2><div class="course-grid" style="padding-top:0">`;
      html += completed.map((c) => courseCard(c)).join("");
      html += `</div>`;
    }
    el.innerHTML = html;

    el.querySelectorAll(".course-card").forEach((card) => {
      card.addEventListener("click", () => openModal(+card.dataset.id));
    });
  }

  function courseCard(c) {
    const progress = getProgress(c.id);
    return `
      <article class="course-card" data-id="${c.id}">
        <div class="card-image-placeholder" style="background:${c.color}20">${c.icon}</div>
        <div class="card-body">
          <div class="card-badges">
            <span class="badge badge-category">${c.category}</span>
            <span class="badge badge-modules">${c.modules.length} Modules</span>
          </div>
          <h3 class="card-title">${c.title}</h3>
          <div class="card-progress"><div class="progress-fill" style="width:${progress}%"></div></div>
        </div>
      </article>`;
  }

  function renderProfile() {
    const el = document.getElementById("profileTab");
    const enrolledCount = Object.keys(state.enrolled).length;
    const completedCount = COURSES.filter((c) => getProgress(c.id) === 100).length;
    const totalModules = Object.values(state.completed).reduce((s, a) => s + a.length, 0);

    el.innerHTML = `
      <div class="profile-section">
        <div class="profile-card">
          <div class="avatar">U</div>
          <div class="profile-name">User</div>
          <div class="profile-email">learner@company.com</div>
        </div>
        <div class="stats-grid">
          <div class="stat-card"><div class="stat-value">${enrolledCount}</div><div class="stat-label">Enrolled</div></div>
          <div class="stat-card"><div class="stat-value">${completedCount}</div><div class="stat-label">Completed</div></div>
          <div class="stat-card"><div class="stat-value">${totalModules}</div><div class="stat-label">Modules Done</div></div>
        </div>
      </div>`;
  }

  function openDrawer() {
    filterDrawer.classList.add("open");
    filterOverlay.classList.add("active");
    document.body.style.overflow = "hidden";
  }
  function closeDrawer() {
    filterDrawer.classList.remove("open");
    filterOverlay.classList.remove("active");
    document.body.style.overflow = "";
  }

  function bindEvents() {
    $("#menuBtn").addEventListener("click", openDrawer);
    $("#closeDrawer").addEventListener("click", closeDrawer);
    filterOverlay.addEventListener("click", closeDrawer);

    document.addEventListener("click", (e) => {
      const opt = e.target.closest(".filter-option");
      if (opt) opt.classList.toggle("selected");
    });

    $("#applyFilters").addEventListener("click", () => {
      state.filters = getActiveFilters();
      saveState(state);
      renderCourses();
      closeDrawer();
    });

    $("#resetFilters").addEventListener("click", () => {
      $$(".filter-option.selected").forEach((b) => b.classList.remove("selected"));
      state.filters = {};
      saveState(state);
      renderCourses();
    });

    filterChips.addEventListener("click", (e) => {
      const rm = e.target.closest(".chip-remove");
      if (!rm) return;
      const btn = $(`.filter-option[data-group="${rm.dataset.group}"][data-value="${rm.dataset.value}"]`);
      if (btn) btn.classList.remove("selected");
      state.filters = getActiveFilters();
      saveState(state);
      renderCourses();
    });

    $("#clearAll").addEventListener("click", () => {
      $$(".filter-option.selected").forEach((b) => b.classList.remove("selected"));
      searchInput.value = "";
      state.filters = {};
      saveState(state);
      renderCourses();
    });

    searchInput.addEventListener("input", renderCourses);

    courseGrid.addEventListener("click", (e) => {
      const card = e.target.closest(".course-card");
      if (card) openModal(+card.dataset.id);
    });

    $("#modalClose").addEventListener("click", closeModal);
    modalOverlay.addEventListener("click", (e) => {
      if (e.target === modalOverlay) closeModal();
    });

    $("#enrollBtn").addEventListener("click", (e) => {
      enrollCourse(+e.target.dataset.courseId);
    });

    document.addEventListener("click", (e) => {
      const mod = e.target.closest(".module-item");
      if (mod) toggleModule(+mod.dataset.course, +mod.dataset.module);
    });

    $$(".nav-item").forEach((n) => {
      n.addEventListener("click", (e) => {
        e.preventDefault();
        switchTab(n.dataset.tab);
      });
    });

    let deferredPrompt;
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      deferredPrompt = e;
      $("#installBanner").hidden = false;
    });
    $("#installBtn").addEventListener("click", async () => {
      if (!deferredPrompt) return;
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      deferredPrompt = null;
      $("#installBanner").hidden = true;
    });
    $("#dismissInstall").addEventListener("click", () => {
      $("#installBanner").hidden = true;
    });
  }

  function registerSW() {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("sw.js").catch(() => {});
    }
  }

  init();
})();
