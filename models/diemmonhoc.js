const mongoose = require('mongoose');

const diemMonHocSchema = new mongoose.Schema({
  sinhvien: { type: mongoose.Schema.Types.ObjectId, ref: 'SinhVien', required: true },
  hocKy: { type: mongoose.Schema.Types.ObjectId, ref: 'HocKy', required: true },
  monHoc: { type: mongoose.Schema.Types.ObjectId, ref: 'MonHoc', required: true },
  diemQuaTrinh: { type: Number, min: 0, max: 10 },
  diemThi: { type: Number, min: 0, max: 10 },
  diemTongKet: { type: Number, min: 0, max: 10 },
});

diemMonHocSchema.pre('save', async function (next) {
  const Diem = this;
  if (Diem.isModified('diemQuaTrinh') || Diem.isModified('diemThi') || Diem.isNew) {
    const MonHoc = require('./monhoc');
    const mon = await MonHoc.findById(Diem.monHoc);
    if (mon) {
      Diem.diemTongKet = ((Diem.diemQuaTrinh * mon.tyLeGiuaKy) + (Diem.diemThi * mon.tyLeCuoiKy)).toFixed(1);
    }
  }
  next();
});

diemMonHocSchema.index({ sinhvien: 1, monHoc: 1, hocKy: 1 }, { unique: true });

module.exports = mongoose.model('DiemMonHoc', diemMonHocSchema);
