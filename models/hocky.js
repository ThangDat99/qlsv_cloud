const mongoose = require('mongoose');

const hocKySchema = new mongoose.Schema({
  tenHocKy: { type: String, required: true },
  khoaHoc: { type: mongoose.Schema.Types.ObjectId, ref: 'KhoaHoc'}
});

module.exports = mongoose.model('HocKy', hocKySchema);
