    /* =====================================================
        STATE
    ===================================================== */
    let walletBalance = 250;

    const VALID_CODES = {
        'TEST100': 100,
        'PROMO200': 200,
        'WELCOME50': 50,
    };

    const usedCodes = new Set(['PROMO200', 'WELCOME50']);

    /* =====================================================
        BALANCE DISPLAY
    ===================================================== */
    function updateBalanceDisplay() {
        const ids = ['mainBalance', 'navBalance', 'navBalanceMobile'];
        ids.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.style.transition = 'transform .3s ease, opacity .3s ease';
                el.style.transform = 'scale(1.25)';
                el.style.opacity = '0';
                setTimeout(() => {
                    el.textContent = walletBalance.toLocaleString('ar-EG');
                    el.style.transform = 'scale(1)';
                    el.style.opacity = '1';
                }, 300);
            }
        });
    }

    /* =====================================================
        CHARGE CODE
    ===================================================== */
    function activateCode() {
        const input = document.getElementById('chargeCodeInput');
        const btn = document.getElementById('chargeBtn');
        const btnText = document.getElementById('chargeBtnText');
        const alert = document.getElementById('chargeAlert');
        const code = input.value.trim().toUpperCase();

        if (!code) {
            showAlert('error', 'bi-exclamation-triangle-fill', 'يرجى إدخال كود الشحن أولاً.');
            input.focus();
            return;
        }

        /* Loading */
        btn.disabled = true;
        btnText.textContent = 'جارٍ التحقق...';
        btn.innerHTML = `
            <span class="spinner-border text-white" role="status"></span>
            <span>جارٍ التحقق...</span>
        `;

        setTimeout(() => {
            btn.disabled = false;
            btn.innerHTML = `<i class="bi bi-lightning-charge-fill"></i><span id="chargeBtnText">تفعيل الكود</span>`;

            if (usedCodes.has(code)) {
                showAlert('error', 'bi-x-circle-fill', `الكود <strong>${code}</strong> تم استخدامه مسبقًا.`);
                return;
            }

            if (VALID_CODES[code] !== undefined) {
                const added = VALID_CODES[code];
                walletBalance += added;
                usedCodes.add(code);
                updateBalanceDisplay();
                addChargeRow(code, added);
                input.value = '';
                showAlert('success', 'bi-check-circle-fill',
                    `🎉 تم تفعيل الكود <strong>${code}</strong> بنجاح! تم إضافة <strong>${added} ج.م</strong> إلى رصيدك.`
                );
            } else {
                showAlert('error', 'bi-x-circle-fill', `الكود <strong>${code}</strong> غير صحيح أو غير موجود.`);
            }
        }, 1200);
    }

    function showAlert(type, icon, msg) {
        const wrap = document.getElementById('chargeAlert');
        wrap.style.display = 'block';
        wrap.innerHTML = `
            <div class="wallet-alert ${type === 'success' ? 'alert-success-gl' : 'alert-error-gl'}">
                <i class="bi ${icon}"></i>
                <span>${msg}</span>
            </div>
        `;
        setTimeout(() => {
            const alertEl = wrap.querySelector('.wallet-alert');
            if (alertEl) {
                alertEl.style.transition = 'opacity .5s ease';
                alertEl.style.opacity = '0';
                setTimeout(() => { wrap.style.display = 'none'; }, 500);
            }
        }, 5000);
    }

    function addChargeRow(code, amount) {
        const tbody = document.getElementById('chargeTableBody');
        const rows = tbody.querySelectorAll('tr');
        const newNum = rows.length + 1;
        const now = new Date();
        const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

        const tr = document.createElement('tr');
        tr.style.animation = 'alertIn .4s ease both';
        tr.innerHTML = `
            <td>${newNum}</td>
            <td>${dateStr}</td>
            <td><span class="code-cell">${code}</span></td>
            <td class="amount-cell amount-pos">+${amount} ج.م</td>
            <td><span class="badge-status bs-success"><i class="bi bi-check-circle-fill"></i> ناجح</span></td>
        `;
        tbody.insertBefore(tr, tbody.firstChild);

        /* Re-number */
        tbody.querySelectorAll('tr').forEach((row, i) => {
            row.cells[0].textContent = i + 1;
        });
    }

    /* =====================================================
        NOTIFICATIONS
    ===================================================== */
    function toggleNotifications(e) {
        e.stopPropagation();
        document.getElementById('notificationDropdown').classList.toggle('show');
    }

    document.addEventListener('click', () => {
        const d = document.getElementById('notificationDropdown');
        if (d) d.classList.remove('show');
    });

    /* =====================================================
        SCROLL REVEAL
    ===================================================== */
    (function () {
        const obs = new IntersectionObserver(entries => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    e.target.classList.add('vis');
                    obs.unobserve(e.target);
                }
            });
        }, { threshold: .1, rootMargin: '0px 0px -30px 0px' });

        document.querySelectorAll('[data-r]').forEach(el => {
            const delay = el.dataset.d;
            if (delay) {
                const map = { d1: '60ms', d2: '120ms', d3: '200ms', d4: '280ms' };
                el.style.transitionDelay = map[delay] || '0ms';
            }
            obs.observe(el);
        });
    })();

    /* =====================================================
        ENTER key on charge input
    ===================================================== */
    document.getElementById('chargeCodeInput').addEventListener('keydown', function (e) {
        if (e.key === 'Enter') activateCode();
    });