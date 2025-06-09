const mongoose = require('mongoose');

const baiVietSchema = new mongoose.Schema({
  tieuDe: { type: String, required: true },
  moTaNgan: { type: String },
  noiDung: { type: String },
  hinhAnh: { type: String },
  ngayDang: { type: Date, default: Date.now }
});

module.exports = mongoose.model('BaiViet', baiVietSchema);
