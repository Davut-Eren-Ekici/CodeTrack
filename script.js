let kayitliVeri = localStorage.getItem('codeTrackProjeler');
let kayitliGunler = localStorage.getItem('codeTrackAktiviteler');

let projeler = [];
let gunlukAktiviteler = {};

try {
    projeler = kayitliVeri ? JSON.parse(kayitliVeri) : [];
    if (!Array.isArray(projeler) || projeler.length === 0) {
        projeler = [
            { id: 1, ad: 'PatronAsistani', teknolojiler: ['HTML', 'CSS', 'JS'], sureSaniye: 52200 },
            { id: 2, ad: 'AI Quiz', teknolojiler: ['HTML', 'CSS', 'JS'], sureSaniye: 18000 }
        ];
    }
} catch (e) {
    projeler = [
        { id: 1, ad: 'PatronAsistani', teknolojiler: ['HTML', 'CSS', 'JS'], sureSaniye: 52200 },
        { id: 2, ad: 'AI Quiz', teknolojiler: ['HTML', 'CSS', 'JS'], sureSaniye: 18000 }
    ];
}

try {
    gunlukAktiviteler = kayitliGunler ? JSON.parse(kayitliGunler) : {
        [bugunTarihStr()]: 7200
    };
} catch (e) {
    gunlukAktiviteler = {};
}

let timerInterval = null;
let gecenSaniye = 0;
let calisiyorMu = false;

function bugunTarihStr() {
    const d = new Date();
    return d.toISOString().split('T')[0];
}

function verileriKaydet() {
    localStorage.setItem('codeTrackProjeler', JSON.stringify(projeler));
    localStorage.setItem('codeTrackAktiviteler', JSON.stringify(gunlukAktiviteler));
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
    gridEl.innerHTML = '';
    monthsEl.innerHTML = '';

    const gunSayisi = 364;
    const bugun = new Date();
    let eklenenAylar = new Set();

    for (let i = gunSayisi - 1; i >= 0; i--) {
        const tarih = new Date();
        tarih.setDate(bugun.getDate() - i);
        const tarihStr = tarih.toISOString().split('T')[0];

        const ayAdi = tarih.toLocaleString('en-US', { month: 'short' });
        if (!eklenenAylar.has(ayAdi) && tarih.getDate() <= 7) {
            eklenenAylar.add(ayAdi);
        }

        const calismaSuresi = gunlukAktiviteler[tarihStr] || 0;

        let seviye = 0;
        if (calismaSuresi > 0 && calismaSuresi <= 1800) seviye = 1;
        else if (calismaSuresi > 1800 && calismaSuresi <= 5400) seviye = 2;
        else if (calismaSuresi > 5400 && calismaSuresi <= 10800) seviye = 3;
        else if (calismaSuresi > 10800) seviye = 4;

        const kare = document.createElement('div');
        kare.className = `heatmap-square level-${seviye}`;
        kare.title = `${tarihStr}: ${Math.round(calismaSuresi / 60)} dakika çalışma`;
        
        gridEl.appendChild(kare);
    }

    eklenenAylar.forEach(ay => {
        const span = document.createElement('span');
        span.textContent = ay;
        monthsEl.appendChild(span);
    });
}

function arayuzCiz() {
    const projeListesiEl = document.getElementById('projeListesi');
    const projeSecEl = document.getElementById('projeSec');

    projeListesiEl.innerHTML = '';
    projeSecEl.innerHTML = '';

    if (projeler.length === 0) {
        projeListesiEl.innerHTML = '<p style="color: var(--text-muted); grid-column: 1/-1; text-align: center;">Henüz eklenmiş bir proje yok.</p>';
        return;
    }

    projeler.forEach(proje => {
        const option = document.createElement('option');
        option.value = proje.id;
        option.textContent = proje.ad;
        projeSecEl.appendChild(option);

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

function projeSil(id) {
    projeler = projeler.filter(p => p.id !== id);
    verileriKaydet();
    arayuzCiz();
}

const baslatBtn = document.getElementById('baslatBtn');
const durdurBtn = document.getElementById('durdurBtn');
const timerDisplay = document.getElementById('timer');
const projeSecSelect = document.getElementById('projeSec');
const yeniProjeFormu = document.querySelector('.yeniProjeFormu');

baslatBtn.addEventListener('click', () => {
    if (calisiyorMu) return;
    
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

yeniProjeFormu.addEventListener('submit', (e) => {
    e.preventDefault();

    const adInput = document.getElementById('projeAdi');
    const techInput = document.getElementById('teknolojiler');

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

arayuzCiz();