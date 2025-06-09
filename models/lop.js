const mongoose = require('mongoose');

const LopSchema = new mongoose.Schema({
  tenLop: { type: String, required: true },
  khoa: { type: mongoose.Schema.Types.ObjectId, ref: 'Khoa', required: true },
  nganh: { type: mongoose.Schema.Types.ObjectId, ref: 'Nganh', required: true },
  khoaHoc: { type: mongoose.Schema.Types.ObjectId, ref: 'KhoaHoc', required: true }
});

module.exports = mongoose.model('Lop', LopSchema);
