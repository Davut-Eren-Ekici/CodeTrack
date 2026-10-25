// --- 1. GİRİŞ VE KAYIT İŞLEMLERİ (login.html için) ---
const wrapper = document.querySelector('.wrapper');
const registerLink = document.querySelector('.register-link');
const loginLink = document.querySelector('.login-link');

if (registerLink && wrapper) {
    registerLink.onclick = (e) => {
        e.preventDefault();
        wrapper.classList.add('active');
    };
}

if (loginLink && wrapper) {
    loginLink.onclick = (e) => {
        e.preventDefault();
        wrapper.classList.remove('active');
    };
}

const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('loginUsername').value.trim();
        const password = document.getElementById('loginPassword').value.trim();

        try {
            // Canlı ortam uyumlu göreli yol kullanıldı
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('username', data.username);
                alert('Giriş başarılı! Yönlendiriliyorsunuz...');
                window.location.href = 'index.html';
            } else {
                alert(data.message || 'Giriş başarısız!');
            }
        } catch (error) {
            console.error('Bağlantı hatası:', error);
            alert('Sunucuya ulaşılamıyor!');
        }
    });
}

const registerForm = document.querySelector('.from-box.register form');
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const inputs = registerForm.querySelectorAll('input');
        const username = inputs[0].value.trim();
        const password = inputs[1].value.trim();
        const confirmPassword = inputs[2].value.trim();

        if (password !== confirmPassword) {
            alert('Şifreler birbiriyle uyuşmuyor!');
            return;
        }

        try {
            // Canlı ortam uyumlu göreli yol kullanıldı
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (response.ok) {
                alert('Kayıt başarılı! Şimdi giriş yapabilirsiniz.');
                wrapper.classList.remove('active');
                registerForm.reset();
            } else {
                alert(data.message || 'Kayıt olurken bir hata oluştu.');
            }
        } catch (error) {
            console.error('Bağlantı hatası:', error);
            alert('Sunucuya ulaşılamıyor!');
        }
    });
}


// --- 2. DARK / LIGHT MODE YÖNETİMİ (index.html için) ---
const themeToggleBtn = document.getElementById('themeToggleBtn');
if (themeToggleBtn) {
    const htmlElement = document.documentElement;
    const kaydedilenTema = localStorage.getItem('codeTrackTheme') || 'dark';
    htmlElement.setAttribute('data-bs-theme', kaydedilenTema);
    themeToggleBtn.textContent = kaydedilenTema === 'dark' ? '☀️' : '🌙';

    themeToggleBtn.addEventListener('click', () => {
        const mevcutTema = htmlElement.getAttribute('data-bs-theme');
        const yeniTema = mevcutTema === 'dark' ? 'light' : 'dark';
        htmlElement.setAttribute('data-bs-theme', yeniTema);
        themeToggleBtn.textContent = yeniTema === 'dark' ? '☀️' : '🌙';
        localStorage.setItem('codeTrackTheme', yeniTema);
    });
}


// --- 3. PROJE VE SAYAÇ YÖNETİMİ (Kullanıcıya Özel) ---
const projeListesiEl = document.getElementById('projeListesi');
if (projeListesiEl) {
    const aktifKullanici = localStorage.getItem('username') || 'misafir';

    let kayitliVeri = localStorage.getItem(`codeTrackProjeler_${aktifKullanici}`);
    let kayitliGunler = localStorage.getItem(`codeTrackAktiviteler_${aktifKullanici}`);

    let projeler = [];
    let gunlukAktiviteler = {};

    try {
        projeler = kayitliVeri ? JSON.parse(kayitliVeri) : [];
    } catch (e) {
        projeler = [];
    }

    try {
        gunlukAktiviteler = kayitliGunler ? JSON.parse(kayitliGunler) : {};
    } catch (e) {
        gunlukAktiviteler = {};
    }

    let timerInterval = null;
    let gecenSaniye = 0;
    let calisiyorMu = false;

    function yerelTarihStr(tarih) {
        const yil = tarih.getFullYear();
        const ay = String(tarih.getMonth() + 1).padStart(2, '0');
        const gun = String(tarih.getDate()).padStart(2, '0');
        return `${yil}-${ay}-${gun}`;
    }

    function formatGosterimTarihi(tarih) {
        const yil = tarih.getFullYear();
        const ay = String(tarih.getMonth() + 1).padStart(2, '0');
        const gun = String(tarih.getDate()).padStart(2, '0');
        return `${gun}-${ay}-${yil}`;
    }

    function bugunTarihStr() {
        return yerelTarihStr(new Date());
    }

    function verileriKaydet() {
        localStorage.setItem(`codeTrackProjeler_${aktifKullanici}`, JSON.stringify(projeler));
        localStorage.setItem(`codeTrackAktiviteler_${aktifKullanici}`, JSON.stringify(gunlukAktiviteler));
    }

    function saniyeFormatla(toplamSaniye) {
        const saat = Math.floor(toplamSaniye / 3600);
        const dakika = Math.floor((toplamSaniye % 3600) / 60);
        const saniye = toplamSaniye % 60;
        return `${String(saat).padStart(2, '0')}:${String(dakika).padStart(2, '0')}:${String(saniye).padStart(2, '0')}`;
    }

    function heatmapCiz() {
        const gridEl = document.getElementById('heatmapGrid');
        const monthsEl = document.getElementById('heatmapMonths');
        if (!gridEl || !monthsEl) return;

        gridEl.innerHTML = '';
        monthsEl.innerHTML = '';

        const bugun = new Date();
        bugun.setHours(0, 0, 0, 0);

        const gun = bugun.getDay();
        const farkToPazartesi = gun === 0 ? -6 : 1 - gun;
        const buHaftaPazartesi = new Date(bugun);
        buHaftaPazartesi.setDate(bugun.getDate() + farkToPazartesi);

        const baslangicTarihi = new Date(buHaftaPazartesi);
        baslangicTarihi.setDate(buHaftaPazartesi.getDate() - (51 * 7));

        let eklenenAylar = new Set();
        let simdikiTarih = new Date(baslangicTarihi);

        for (let i = 0; i < 364; i++) {
            const tarihStr = yerelTarihStr(simdikiTarih);
            const gosterimTarihiStr = formatGosterimTarihi(simdikiTarih);
            const ayAdi = simdikiTarih.toLocaleString('en-US', { month: 'short' });

            if (!eklenenAylar.has(ayAdi) && simdikiTarih.getDate() <= 7) {
                eklenenAylar.add(ayAdi);
            }

            const calismaSuresi = gunlukAktiviteler[tarihStr] || 0;

            let seviye = 0;
            if (simdikiTarih > bugun) {
                seviye = 0;
            } else {
                if (calismaSuresi > 0 && calismaSuresi <= 1800) seviye = 1;
                else if (calismaSuresi > 1800 && calismaSuresi <= 5400) seviye = 2;
                else if (calismaSuresi > 5400 && calismaSuresi <= 10800) seviye = 3;
                else if (calismaSuresi > 10800) seviye = 4;
            }

            const kare = document.createElement('div');
            kare.className = `heatmap-square level-${seviye}`;

            if (simdikiTarih > bugun) {
                kare.style.opacity = '0.15';
            }

            kare.title = `${gosterimTarihiStr}: ${Math.round(calismaSuresi / 60)} dakika çalışma`;
            gridEl.appendChild(kare);

            simdikiTarih.setDate(simdikiTarih.getDate() + 1);
        }

        eklenenAylar.forEach(ay => {
            const span = document.createElement('span');
            span.textContent = ay;
            monthsEl.appendChild(span);
        });
    }

    function arayuzCiz() {
        const projeSecEl = document.getElementById('projeSec');
        const baslatBtn = document.getElementById('baslatBtn');

        projeListesiEl.innerHTML = '';
        if (projeSecEl) projeSecEl.innerHTML = '';

        if (projeler.length === 0) {
            projeListesiEl.innerHTML = '<p style="color: var(--text-muted); grid-column: 1/-1; text-align: center;">Henüz eklenmiş bir proje yok. Yukarıdan yeni bir proje oluşturun.</p>';
            if (projeSecEl) {
                const option = document.createElement('option');
                option.textContent = 'Önce proje ekleyin...';
                option.disabled = true;
                option.selected = true;
                projeSecEl.appendChild(option);
            }
            if (baslatBtn) baslatBtn.disabled = true;
            heatmapCiz();
            return;
        } else {
            if (baslatBtn) baslatBtn.disabled = false;
        }

        projeler.forEach(proje => {
            if (projeSecEl) {
                const option = document.createElement('option');
                option.value = proje.id;
                option.textContent = proje.ad;
                projeSecEl.appendChild(option);
            }

            const taglarHTML = proje.teknolojiler
                .map(tech => `<span class="tag">${tech.trim()}</span>`)
                .join('');

            const kart = document.createElement('div');
            kart.className = 'project-card';
            kart.innerHTML = `
                <div>
                    <div class="project-title">💻 ${proje.ad}</div>
                    <div class="tech-tags">${taglarHTML}</div>
                </div>
                <div class="card-footer">
                    <span class="time-spent">⏱ ${saniyeFormatla(proje.sureSaniye)}</span>
                    <button class="btn-delete" onclick="projeSil(${proje.id})" title="Projeyi Sil">🗑️</button>
                </div>
            `;

            projeListesiEl.appendChild(kart);
        });

        heatmapCiz();
    }

    window.projeSil = function (id) {
        projeler = projeler.filter(p => p.id !== id);
        verileriKaydet();
        arayuzCiz();
    }

    const baslatBtn = document.getElementById('baslatBtn');
    const durdurBtn = document.getElementById('durdurBtn');
    const timerDisplay = document.getElementById('timer');
    const projeSecSelect = document.getElementById('projeSec');
    const yeniProjeFormu = document.querySelector('.yeniProjeFormu');

    if (baslatBtn && durdurBtn && timerDisplay && projeSecSelect) {
        baslatBtn.addEventListener('click', () => {
            if (calisiyorMu || projeler.length === 0) return;

            calisiyorMu = true;
            baslatBtn.disabled = true;
            durdurBtn.disabled = false;
            projeSecSelect.disabled = true;

            timerInterval = setInterval(() => {
                gecenSaniye++;
                timerDisplay.textContent = saniyeFormatla(gecenSaniye);
            }, 1000);
        });

        durdurBtn.addEventListener('click', () => {
            if (!calisiyorMu) return;

            clearInterval(timerInterval);
            calisiyorMu = false;
            baslatBtn.disabled = false;
            durdurBtn.disabled = true;
            projeSecSelect.disabled = false;

            const secilenProjeId = Number(projeSecSelect.value);
            const hedefProje = projeler.find(p => p.id === secilenProjeId);

            if (hedefProje) {
                hedefProje.sureSaniye += gecenSaniye;

                const bugun = bugunTarihStr();
                gunlukAktiviteler[bugun] = (gunlukAktiviteler[bugun] || 0) + gecenSaniye;

                verileriKaydet();
                arayuzCiz();
            }

            gecenSaniye = 0;
            timerDisplay.textContent = "00:00:00";
        });
    }

    if (yeniProjeFormu) {
        yeniProjeFormu.addEventListener('submit', (e) => {
            e.preventDefault();

            const adInput = document.getElementById('projeAdi');
            const techInput = document.getElementById('teknolojiler');
            if (!adInput || !techInput) return;

            const yeniAd = adInput.value.trim();
            const yeniTeknolojiler = techInput.value.split(',').map(t => t.trim());

            if (!yeniAd) return;

            const yeniProje = {
                id: Date.now(),
                ad: yeniAd,
                teknolojiler: yeniTeknolojiler,
                sureSaniye: 0
            };

            projeler.push(yeniProje);
            verileriKaydet();
            arayuzCiz();

            adInput.value = '';
            techInput.value = '';
        });
    }

    arayuzCiz();
}