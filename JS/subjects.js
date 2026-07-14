/* =====================================================
   SUBJECTS PAGE — JS
   Vanilla JS only. No hardcoded subjects — everything is
   rendered dynamically from the API response.
===================================================== */

document.addEventListener('DOMContentLoaded', function () {
    initSubjectsPage();
});

// =====================
// CONFIG
// =====================
const SUBJECTS_API_URL = '/api/academic-years/{academicYearId}/subjects';
const SKELETON_CARD_COUNT = 8;

// The Academic Year ID this page belongs to.
// TODO: replace with the real value (e.g. read from the URL
// query string: new URLSearchParams(location.search).get('yearId')).
const CURRENT_ACADEMIC_YEAR_ID = 1;

// Temporary mock data — used until the real API is connected.
// Remove this once fetchSubjects() below is switched back to
// the real fetch() call.
const MOCK_SUBJECTS = [
    { id: 1, name: 'الرياضيات' },
    { id: 2, name: 'العلوم' },
    { id: 3, name: 'اللغة العربية' },
    { id: 4, name: 'اللغة الإنجليزية' },
    { id: 5, name: 'الدراسات الاجتماعية' },
    { id: 6, name: 'الحاسب الآلي' }
];

// =====================
// DOM REFERENCES
// =====================
const els = {};

function cacheDom() {
    els.skeletonGrid = document.getElementById('skeletonGrid');
    els.subjectsGrid = document.getElementById('subjectsGrid');
    els.emptyState = document.getElementById('emptyState');
    els.errorState = document.getElementById('errorState');
    els.emptyRetryBtn = document.getElementById('emptyRetryBtn');
    els.errorRetryBtn = document.getElementById('errorRetryBtn');
}

// =====================
// INIT
// =====================
function initSubjectsPage() {
    cacheDom();
    renderSkeletonCards();
    bindRetryButtons();
    loadSubjects();
}

function bindRetryButtons() {
    if (els.emptyRetryBtn) {
        els.emptyRetryBtn.addEventListener('click', loadSubjects);
    }
    if (els.errorRetryBtn) {
        els.errorRetryBtn.addEventListener('click', loadSubjects);
    }
}

// =====================
// STATE HELPERS
// =====================
function showSkeleton() {
    toggleVisibility(els.skeletonGrid, true);
    toggleVisibility(els.subjectsGrid, false);
    toggleVisibility(els.emptyState, false);
    toggleVisibility(els.errorState, false);
}

function showSubjects() {
    toggleVisibility(els.skeletonGrid, false);
    toggleVisibility(els.subjectsGrid, true);
    toggleVisibility(els.emptyState, false);
    toggleVisibility(els.errorState, false);
}

function showEmpty() {
    toggleVisibility(els.skeletonGrid, false);
    toggleVisibility(els.subjectsGrid, false);
    toggleVisibility(els.emptyState, true);
    toggleVisibility(els.errorState, false);
}

function showError() {
    toggleVisibility(els.skeletonGrid, false);
    toggleVisibility(els.subjectsGrid, false);
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
function loadSubjects() {
    showSkeleton();

    fetchSubjects(CURRENT_ACADEMIC_YEAR_ID)
        .then(function (subjects) {
            if (!Array.isArray(subjects) || subjects.length === 0) {
                showEmpty();
                return;
            }
            renderSubjectCards(subjects);
            showSubjects();
        })
        .catch(function () {
            showError();
        });
}

/**
 * Fetches subjects for the given academic year.
 *
 * MOCK MODE (current): resolves with local mock data after a
 * short delay so the skeleton loading state is visible.
 *
 * To connect the real API, delete the mock block below and
 * uncomment the real fetch() implementation.
 */
function fetchSubjects(academicYearId) {
    // ---- MOCK IMPLEMENTATION (remove when API is ready) ----
    return new Promise(function (resolve) {
        setTimeout(function () {
            resolve(MOCK_SUBJECTS);
        }, 700);
    });

    // ---- REAL API IMPLEMENTATION (uncomment when ready) ----
    // const url = SUBJECTS_API_URL.replace('{academicYearId}', academicYearId);
    // return fetch(url)
    //     .then(function (response) {
    //         if (!response.ok) {
    //             throw new Error('Failed to load subjects');
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
function renderSubjectCards(subjects) {
    if (!els.subjectsGrid) return;

    const fragment = document.createDocumentFragment();

    subjects.forEach(function (subject) {
        fragment.appendChild(buildSubjectCard(subject));
    });

    els.subjectsGrid.innerHTML = '';
    els.subjectsGrid.appendChild(fragment);
}

function buildSubjectCard(subject) {
    const col = document.createElement('div');
    col.className = 'col-xl-3 col-md-6 col-12';
    col.setAttribute('role', 'listitem');

    const card = document.createElement('div');
    card.className = 'gc subject-card';
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', 'فتح مادة ' + subject.name);

    const bar = document.createElement('div');
    bar.className = 'gc-bar';
    bar.style.background = 'var(--gm)';

    const icon = document.createElement('div');
    icon.className = 'subject-icon';
    icon.setAttribute('aria-hidden', 'true');
    icon.innerHTML = '<i class="bi bi-journal-bookmark-fill"></i>';

    const name = document.createElement('h3');
    name.className = 'subject-name';
    name.textContent = subject.name;

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'subject-btn';
    button.innerHTML = 'فتح المادة <i class="bi bi-arrow-left" aria-hidden="true"></i>';

    const handleOpen = function (event) {
        event.stopPropagation();
        openSubject(subject.id);
    };

    card.addEventListener('click', function () {
        openSubject(subject.id);
    });

    card.addEventListener('keydown', function (event) {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            openSubject(subject.id);
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
function openSubject(subjectId) {
    // Navigation is intentionally not implemented here.
    // Hook this function up to the routing logic once ready.
    console.log('Open subject with id:', subjectId);
}