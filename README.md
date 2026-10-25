# 🚀 CodeTrack

CodeTrack, yazılımcıların ve öğrencilerin günlük kodlama süreçlerini takip etmelerini, projelerini yönetmelerini ve GitHub tarzı aktivite ısı haritası (heatmap) ile verimliliklerini analiz etmelerini sağlayan **Full-Stack** bir web uygulamasıdır.

---

## 🛠️ Kullanılan Teknolojiler

Bu proje aşağıdaki modern web teknolojileri ve araçları kullanılarak geliştirilmiştir:

* **Frontend:** HTML5, CSS3, JavaScript (ES6+), Bootstrap
* **Backend:** Node.js, Express.js
* **Veritabanı:** MongoDB Atlas, Mongoose
* **Kimlik Doğrulama:** RESTful API, JSON tabanlı kullanıcı yönetimi
* **Depolama:** LocalStorage (Kullanıcıya özel veri yalıtımı)

---

## ✨ Özellikler

* 🔐 **Güvenli Kimlik Doğrulama:** MongoDB Atlas destekli kayıt olma ve giriş yapma ekranı.
* 💻 **Proje Yönetimi:** Farklı programlama dilleri ve teknolojileri için özel projeler ekleyebilme ve yönetebilme.
* ⏱️ **Çalışma Zamanlayıcısı (Timer):** Projeler üzerinde harcanan süreyi saniye saniye takip edebilme.
* 📊 **GitHub Tarzı Heatmap (Aktivite Haritası):** Günlük çalışma sürelerine göre renklenen dinamik aktivite grafiği.
* 👤 **Kullanıcıya Özel Veri İzolasyonu:** Her kullanıcının kendi verilerini ve projelerini ayrı ayrı depolaması.
* 🌙 **Dark / Light Tema Desteği:** Göz yormayan koyu ve açık tema seçenekleri.

---

## ⚙️ Kurulum ve Çalıştırma

Projeyi yerel bilgisayarınızda çalıştırmak için aşağıdaki adımları takip edebilirsiniz:

1. **Repoyu klonlayın:**
   ```bash
   git clone [https://github.com/KULLANICI_ADIN/CodeTrack.git](https://github.com/KULLANICI_ADIN/CodeTrack.git)
   cd CodeTrack
Gerekli paketleri yükleyin:

Bash
npm install
Environment (.env) dosyasını oluşturun:
Ana dizinde bir .env dosyası oluşturun ve MongoDB bağlantı adresinizi ekleyin:

Kod snippet'i
MONGO_URI=mongodb+srv://<kullaniciAdi>:<sifre>@cluster...
PORT=5000
Sunucuyu başlatın:

Bash
node server.js
Arayüze erişin:login.html dosyasını Live Server ile açarak veya tarayıcınızda çalıştırarak uygulamayı kullanmaya başlayabilirsiniz.

👨‍💻 Geliştirici
Davut Eren Ekici


