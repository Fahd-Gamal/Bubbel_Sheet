/* =====================================================
   ACADEMIC YEARS PAGE — JS
   Vanilla JS only. No hardcoded years — everything is
   rendered dynamically from the API response.
===================================================== */

document.addEventListener('DOMContentLoaded', function () {
    initAcademicYearsPage();
});

// =====================
// CONFIG
// =====================
const ACADEMIC_YEARS_API_URL = '/api/academic-years';
const SKELETON_CARD_COUNT = 8;

// Temporary mock data — used until the real API is connected.
// Replace / remove this once fetchAcademicYears() below is
// switched back to the real fetch() call.
const MOCK_ACADEMIC_YEARS = [
    { id: 1, name: 'الصف الأول الإعدادي' },
    { id: 2, name: 'الصف الثاني الإعدادي' },
    { id: 3, name: 'الصف الثالث الإعدادي' },
    { id: 4, name: 'الصف الأول الثانوي' },
    { id: 5, name: 'الصف الثاني الثانوي' },
    { id: 6, name: 'الصف الثالث الثانوي' }
];

// =====================
// DOM REFERENCES
// =====================
const els = {};

function cacheDom() {
    els.skeletonGrid = document.getElementById('skeletonGrid');
    els.yearsGrid = document.getElementById('yearsGrid');
    els.emptyState = document.getElementById('emptyState');
    els.errorState = document.getElementById('errorState');
    els.emptyRetryBtn = document.getElementById('emptyRetryBtn');
    els.errorRetryBtn = document.getElementById('errorRetryBtn');
}

// =====================
// INIT
// =====================
function initAcademicYearsPage() {
    cacheDom();
    renderSkeletonCards();
    bindRetryButtons();
    loadAcademicYears();
}

function bindRetryButtons() {
    if (els.emptyRetryBtn) {
        els.emptyRetryBtn.addEventListener('click', loadAcademicYears);
    }
    if (els.errorRetryBtn) {
        els.errorRetryBtn.addEventListener('click', loadAcademicYears);
    }
}

// =====================
// STATE HELPERS
// =====================
function showSkeleton() {
    toggleVisibility(els.skeletonGrid, true);
    toggleVisibility(els.yearsGrid, false);
    toggleVisibility(els.emptyState, false);
    toggleVisibility(els.errorState, false);
}

function showYears() {
    toggleVisibility(els.skeletonGrid, false);
    toggleVisibility(els.yearsGrid, true);
    toggleVisibility(els.emptyState, false);
    toggleVisibility(els.errorState, false);
}

function showEmpty() {
    toggleVisibility(els.skeletonGrid, false);
    toggleVisibility(els.yearsGrid, false);
    toggleVisibility(els.emptyState, true);
    toggleVisibility(els.errorState, false);
}

function showError() {
    toggleVisibility(els.skeletonGrid, false);
    toggleVisibility(els.yearsGrid, false);
    toggleVisibility(els.emptyState, false);
    toggleVisibility(els.errorState, true);
}

function toggleVisibility(element, isVisible) {
    if (!element) return;
    element.classList.toggle('d-none', !isVisible);
}

// =====================
// DATA LOADING
// =====================
function loadAcademicYears() {
    showSkeleton();

    fetchAcademicYears()
        .then(function (academicYears) {
            if (!Array.isArray(academicYears) || academicYears.length === 0) {
                showEmpty();
                return;
            }
            renderYearCards(academicYears);
            showYears();
        })
        .catch(function () {
            showError();
        });
}

/**
 * Fetches academic years from the API.
 *
 * MOCK MODE (current): resolves with local mock data after a short
 * delay so the skeleton loading state is visible.
 *
 * To connect the real API, delete the mock block below and
 * uncomment the real fetch() implementation.
 */
function fetchAcademicYears() {
    // ---- MOCK IMPLEMENTATION (remove when API is ready) ----
    return new Promise(function (resolve) {
        setTimeout(function () {
            resolve(MOCK_ACADEMIC_YEARS);
        }, 700);
    });

    // ---- REAL API IMPLEMENTATION (uncomment when ready) ----
    // return fetch(ACADEMIC_YEARS_API_URL)
    //     .then(function (response) {
    //         if (!response.ok) {
    //             throw new Error('Failed to load academic years');
    //         }
    //         return response.json();
    //     });
}

// =====================
// RENDER — SKELETON CARDS
// =====================
function renderSkeletonCards() {
    if (!els.skeletonGrid) return;

    const fragment = document.createDocumentFragment();

    for (let i = 0; i < SKELETON_CARD_COUNT; i++) {
        fragment.appendChild(buildSkeletonCard());
    }

    els.skeletonGrid.innerHTML = '';
    els.skeletonGrid.appendChild(fragment);
}

function buildSkeletonCard() {
    const col = document.createElement('div');
    col.className = 'col-xl-3 col-md-6 col-12';

    const card = document.createElement('div');
    card.className = 'gc skeleton-card';
    card.setAttribute('aria-hidden', 'true');

    const icon = document.createElement('div');
    icon.className = 'skeleton-shape skeleton-icon';

    const line = document.createElement('div');
    line.className = 'skeleton-shape skeleton-line';

    const btn = document.createElement('div');
    btn.className = 'skeleton-shape skeleton-btn';

    card.appendChild(icon);
    card.appendChild(line);
    card.appendChild(btn);
    col.appendChild(card);

    return col;
}

// =====================
// RENDER — REAL CARDS
// =====================
function renderYearCards(academicYears) {
    if (!els.yearsGrid) return;

    const fragment = document.createDocumentFragment();

    academicYears.forEach(function (academicYear) {
        fragment.appendChild(buildYearCard(academicYear));
    });

    els.yearsGrid.innerHTML = '';
    els.yearsGrid.appendChild(fragment);
}

function buildYearCard(academicYear) {
    const col = document.createElement('div');
    col.className = 'col-xl-3 col-md-6 col-12';
    col.setAttribute('role', 'listitem');

    const card = document.createElement('div');
    card.className = 'gc year-card';
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', 'عرض مواد ' + academicYear.name);

    const bar = document.createElement('div');
    bar.className = 'gc-bar';
    bar.style.background = 'var(--gm)';

    const icon = document.createElement('div');
    icon.className = 'year-icon';
    icon.setAttribute('aria-hidden', 'true');
    icon.innerHTML = '<i class="bi bi-mortarboard-fill"></i>';

    const name = document.createElement('h3');
    name.className = 'year-name';
    name.textContent = academicYear.name;

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'year-btn';
    button.innerHTML = 'عرض المواد <i class="bi bi-arrow-left" aria-hidden="true"></i>';

    const handleOpen = function (event) {
        event.stopPropagation();
        openAcademicYear(academicYear.id);
    };

    card.addEventListener('click', function () {
        openAcademicYear(academicYear.id);
    });

    card.addEventListener('keydown', function (event) {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            openAcademicYear(academicYear.id);
        }
    });

    button.addEventListener('click', handleOpen);

    card.appendChild(bar);
    card.appendChild(icon);
    card.appendChild(name);
    card.appendChild(button);
    col.appendChild(card);

    return col;
}

// =====================
// CARD CLICK HANDLER
// =====================
function openAcademicYear(id) {
    // Navigation is intentionally not implemented here.
    // Hook this function up to the routing logic once ready.
    console.log('Open academic year with id:', id);
}