/* =============================================
1. PARTICLES
============================================= */
(function () {
    const c = document.getElementById('ptc');
    const colors = ['rgba(0,226,224,.5)', 'rgba(120,124,254,.5)', 'rgba(0,169,242,.45)', 'rgba(72,190,217,.4)', 'rgba(255,255,255,.55)'];
    for (let i = 0; i < 32; i++) {
        const p = document.createElement('div');
        p.className = 'pt';
        const sz = Math.random() * 5 + 2;
        p.style.cssText = `width:${sz}px;height:${sz}px;left:${Math.random() * 100}vw;bottom:-10px;background:${colors[Math.floor(Math.random() * colors.length)]};animation-duration:${Math.random() * 22 + 14}s;animation-delay:${Math.random() * 20}s;`;
        c.appendChild(p);
    }
})();

/* =============================================
2. SCROLL REVEAL
============================================= */
(function () {
    const obs = new IntersectionObserver((entries) => {
        entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('vis'); obs.unobserve(e.target); } });
    }, { threshold: .1, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('[data-r]').forEach(el => obs.observe(el));
})();

/* =============================================
    3. COUNTERS
    ============================================= */
(function () {
    function easeOut(t) { return 1 - Math.pow(1 - t, 4); }
    function run(el) {
        const target = +el.dataset.count;
        const sfx = el.dataset.sfx || '';
        const dur = 2000;
        const t0 = performance.now();
        (function tick(now) {
            const p = Math.min((now - t0) / dur, 1);
            el.textContent = Math.round(easeOut(p) * target).toLocaleString('en-Ar') + sfx;
            if (p < 1) requestAnimationFrame(tick);
        })(t0);
    }
    const obs = new IntersectionObserver((entries) => {
        entries.forEach(e => { if (e.isIntersecting) { run(e.target); obs.unobserve(e.target); } });
    }, { threshold: .4 });
    document.querySelectorAll('[data-count]').forEach(el => obs.observe(el));
})();
/* =============================================
4. INFINITE SCHOOL SLIDER
============================================= */
const api = 'https://bubblesheet.runasp.net/api';
(async function () {

    const track = document.getElementById('stk');
    if (!track) return;

    try {
        const response = await fetch(`${api}/Ad/get-ads`);
        const schools = await response.json();
        function chip(s) {
            const d = document.createElement('div');
            d.className = 'school-chip';
            d.innerHTML = `
                <div class="chip-logo">
                    <img src="${s.imgLink}" alt="${s.name}">
                </div>
                <span class="chip-name">
                    ${s.name}
                </span>
            `;
            return d;
        }
        [...schools].forEach(s => {
            track.appendChild(chip(s));
        });
    } catch (error) {
        console.error("Schools API Error:", error);
    }
})();
function register()
{
    window.location.href = "login.html";
}
let deferredPrompt;

const popup = document.getElementById("install-popup");
const installBtn = document.getElementById("installBtn");
const closeBtn = document.getElementById("closeBtn");

window.addEventListener("beforeinstallprompt", (e) => {

    e.preventDefault();

    deferredPrompt = e;

    const isInstalled =
        window.matchMedia("(display-mode: standalone)").matches ||
        window.navigator.standalone === true;

    if (!isInstalled) {
        popup.style.display = "flex";
    }
});
