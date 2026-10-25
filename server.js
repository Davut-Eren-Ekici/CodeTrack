const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Veritabanı modelini içeri aktarıyoruz
const User = require('./models/User');

const app = express();

// --- 1. ARA YAZILIMLAR (MIDDLEWARES) ---
app.use(express.json()); 
app.use(cors()); 

// --- 1.1. STATİK DOSYALAR (Render'da Frontend'i sunmak için) ---
app.use(express.static(path.join(__dirname)));

// --- 2. VERİTABANI BAĞLANTISI ---
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Veritabanı Bağlantısı Başarılı!'))
    .catch((err) => console.error('Veritabanı bağlantı hatası:', err));

// --- 3. ANA SAYFA YÖNLENDİRMESİ ---
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

// --- 4. KAYIT OL (REGISTER) ENDPOINT'İ ---
app.post('/api/register', async (req, res) => {
    try {
        const { username, password } = req.body;

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Bu kullanıcı adı zaten alınmış!' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

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

// --- 5. GİRİŞ YAP (LOGIN) ENDPOINT'İ ---
app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'Kullanıcı bulunamadı!' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Hatalı şifre!' });
        }

        const token = jwt.sign(
            { userId: user._id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ message: 'Giriş başarılı!', token, username: user.username });

    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    }
});

// --- 6. SUNUCUYU BAŞLATMA ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Sunucu ${PORT} portunda çalışıyor...`));