const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();

// Daha önce yazdığım veritabanı modelini içeri aktarıyoruz
const User = require('./models/User');

const app = express();

// --- 1. ARA YAZILIMLAR (MIDDLEWARES) ---
app.use(express.json()); // Gelen isteklerdeki JSON verilerini okuyabilmemizi sağlar
app.use(cors());         // Farklı portlardaki (örnk: 5500 ve 5000) uygulamaların konuşmasına izin verir

// --- 2. VERİTABANI BAĞLANTISI ---
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Veritabanı Bağlantısı Başarılı!'))
    .catch((err) => console.error('Veritabanı bağlantı hatası:', err));

// --- 3. KAYIT OL (REGISTER) ENDPOINT'İ ---
app.post('/api/register', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Kullanıcı daha önce var mı kontrol et
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Bu kullanıcı adı zaten alınmış!' });
        }

        // Şifreyi güvenli hale getirmek için hash'le (şifrele)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Yeni kullanıcı nesnesini oluştur ve veritabanına kaydet
        const newUser = new User({
            username,
            password: hashedPassword
        });

        await newUser.save();
        res.status(201).json({ message: 'Kullanıcı başarıyla oluşturuldu!' });

    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    }
});

// --- 4. GİRİŞ YAP (LOGIN) ENDPOINT'İ ---
app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Kullanıcı veritabanında var mı?
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'Kullanıcı bulunamadı!' });
        }

        // Girilen şifre ile veritabanındaki hash'lenmiş şifre uyuşuyor mu?
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Hatalı şifre!' });
        }

        // Her şey yolundaysa kullanıcıya özel bir "Dijital Kimlik Kartı" (JWT Token) üret
        const token = jwt.sign(
            { userId: user._id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '1h' } // 1 saat geçerli
        );

        // Başarılı yanıtı ve token'ı frontend'e gönder
        res.json({ message: 'Giriş başarılı!', token, username: user.username });

    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    }
});

// --- 5. SUNUCUYU BAŞLATMA ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Sunucu ${PORT} portunda çalışıyor...`));