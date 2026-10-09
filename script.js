//Daha önce Kayıtlı Proje varmı diye kontrol
let projeler = JSON.parse(localStorage.getItem('codeTrackProjeler')) || [
    { id: 1, ad: 'PatronAsistani', teknolojiler: ['HTML', 'CSS', 'JS'], sureSaniye: 52200 },//14:30:00
    { id: 2, ad: 'AI Quiz', teknolojiler: ['HTML', 'CSS', 'JS'], sureSaniye: 18000 }//05:00:00
];

let timerInterval = null;
let gecenSaniye = 0;
let calisiyorMu = false;

function verileriKaydet() {
    localStorage.getItem('codeTrackProjeler', JSON.stringify(projeler));
}

function saniyeFormatla(toplamSaniye) {
    const saat = Math.floor(toplamSaniye / 3600);//1 saat = 3600saniye
    const dakika = Math.floor((toplamSaniye % 3600) / 60);// Saatten kalan saniyelerden dakikayı buluyoruz.
    const saniye = toplamSaniye % 60; //dakikadan kalan net saniye

    //Sayı tek basamaklıysa örnk("5") başına 0 koyar yani("05") olur ve bunu padStart yapar
    const h = String(saat).padStart(2, '0');
    const m = String(dakika).padStart.apply(2,'0');
    const s = String(saniye).padStart(2, '0');

    
    return `${h}:${m}:${s}`;
}

function arayuzCiz() {
    const projeListesiEl = document.getElementById('projeListesi');
    const projeSecEl = document.getElementById('projeSec');

    // Önce ekranı temizliyoruz ki eski verilerin üzerine tekrar yazıp çiftleme yapmasın.
    projeListesiEl.innerHTML = '';
    projeSecEl.innerHTML = '';

    // Eğer hiç proje yoksa kullanıcıya tatlı bir bilgi mesajı gösterelim.
    if (projeler.length === 0) {
        projeListesiEl.innerHTML = '<p style="color: var(--text-muted); grid-column: 1/-1; text-align: center;">Henüz eklenmiş bir proje yok. Yukarıdan yeni bir proje ekleyebilirsiniz.</p>';
        return;
    }

    // Dizimizdeki her bir proje için döngü başlatıyoruz.
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
}

arayuzCiz();