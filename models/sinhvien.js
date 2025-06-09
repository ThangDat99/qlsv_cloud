const mongoose = require('mongoose');

const sinhVienSchema = new mongoose.Schema({
    maSV: { type: String, required: true, unique: true },
    hoTen: { type: String, required: true },
    gioiTinh: { type: String, enum: ['Nam', 'Nữ'], required: true },
    ngaySinh: { type: Date, required: true },
    diaChi: { type: String },
    lop: { type: mongoose.Schema.Types.ObjectId, ref: 'Lop' },
    khoa: { type: mongoose.Schema.Types.ObjectId, ref: 'Khoa' },
    nganh: { type: mongoose.Schema.Types.ObjectId, ref: 'Nganh' },
    khoaHoc: { type: mongoose.Schema.Types.ObjectId, ref: 'KhoaHoc' },
    email: { type: String },
    sdt: { type: String }
});

module.exports = mongoose.model('SinhVien', sinhVienSchema);
