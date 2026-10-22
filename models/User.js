const mongoose = require('mongoose');//bu dosyada moongoose kütüphanesini kullanacağımızı söylüyoruz

//kullanıcı tablosunun şemasını belirlime 
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true, //Boş bırakılmaz "zorunlu"
        unique: true, //Aynı kullanıcı adından başkası alamaz
        trim: true //ismin başındaki ve sonundaki boşlukları otomatik temizler örnk(    davut_eren) gibi başındaki boşluğu siler
    },
    password: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,// tarih
        default: Date.now //Kayıt olduğum anın tarihini otomatik atar

    }
});

// bu şemeyı kullanabilmemiz için dışarı aktarmamız gerekir onun içinde bu kod mantığını kullanmalıyız
module.exports = mongoose.model('User', userSchema);