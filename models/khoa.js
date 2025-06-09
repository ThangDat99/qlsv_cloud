const mongoose = require('mongoose');

const khoaSchema = new mongoose.Schema({
    tenKhoa: { type: String, required: true },
    maKhoa: { type: String, required: true, unique: true },
});

module.exports = mongoose.model('Khoa', khoaSchema);
