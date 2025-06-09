const mongoose = require('mongoose');

const khoaHocSchema = new mongoose.Schema({
    tenKhoaHoc: { type: String, required: true },
    namBatDau: { type: Number, required: true },
    namKetThuc: { type: Number, required: true }
});

module.exports = mongoose.model('KhoaHoc', khoaHocSchema);
