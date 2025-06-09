const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const monHocSchema = new Schema({
  maMonHoc: { type: String, required: true, unique: true },
  tenMonHoc: { type: String, required: true },
  soTinChi: {type : Number},
  tyLeGiuaKy: { type: Number },
  tyLeCuoiKy: { type: Number },
  khoa: { type: Schema.Types.ObjectId, ref: 'Khoa', required: true },
  hocKy: { type: String, required: true }
});

module.exports = mongoose.model('MonHoc', monHocSchema);
