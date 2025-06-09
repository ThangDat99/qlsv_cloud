const mongoose = require('mongoose');

const diemRenLuyenSchema = new mongoose.Schema({
  sinhvien: { type: mongoose.Schema.Types.ObjectId, ref: 'SinhVien', required: true },
  hocKy: { type: mongoose.Schema.Types.ObjectId, ref: 'HocKy', required: true },
  diem: { type: Number, min: 0, max: 100, required: true },
  xepLoai: {type: String}
});

diemRenLuyenSchema.index({ sinhvien: 1, hocKy: 1 }, { unique: true });

module.exports = mongoose.model('DiemRenLuyen', diemRenLuyenSchema);
