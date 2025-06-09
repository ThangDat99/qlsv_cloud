const express = require('express');
const router = express.Router();
const DiemRenLuyen = require('../models/diemrenluyen');
const SinhVien = require('../models/sinhvien');
const HocKy = require('../models/hocky');

router.get('/', async (req, res) => {
  try {
    const { maSV } = req.query;

    const sinhvienQuery = {};
    if (maSV) {
      sinhvienQuery.maSV = { $regex: maSV, $options: 'i' };
    }

    const sinhviens = await SinhVien.find(sinhvienQuery).populate('khoaHoc');
    const allHocKys = await HocKy.find();

    const allDiemRL = await DiemRenLuyen.find()
      .populate('sinhvien')
      .populate('hocKy');

    const hocKyTheoKhoaHoc = {};
    allHocKys.forEach(hk => {
      const khoaHocId = hk.khoaHoc.toString();
      if (!hocKyTheoKhoaHoc[khoaHocId]) hocKyTheoKhoaHoc[khoaHocId] = [];
      hocKyTheoKhoaHoc[khoaHocId].push(hk);
    });

    res.render('diemrenluyen', {
      sinhviens,
      hocKyTheoKhoaHoc,
      allDiemRL,
      query: req.query,
      title: 'Quản lý điểm rèn luyện'
    });
  } catch (error) {
    console.error(error);
    res.redirect('/');
  }
});

//Form thêm
router.get('/them', async (req, res) => {
  const { sinhvienId, hocKyId } = req.query;
  if (!sinhvienId || !hocKyId) return res.redirect('/diemrenluyen');

  const sinhvien = await SinhVien.findById(sinhvienId);
  const hocKy = await HocKy.findById(hocKyId);

  res.render('diemrenluyen_them', { sinhvien, hocKy, title: 'Thêm điểm rèn luyện' });
});

// Xử lý thêm
router.post('/them', async (req, res) => {
  try {
    const { sinhvien, hocKy, diem } = req.body;
    if (diem >= 90) xepLoai = 'Xuất sắc';
else if (diem >= 80) xepLoai = 'Tốt';
else if (diem >= 65) xepLoai = 'Khá';
else if (diem >= 50) xepLoai = 'Trung bình';
else xepLoai = 'Yếu';
    await DiemRenLuyen.create({ sinhvien, hocKy, diem, xepLoai });
    res.redirect('/diemrenluyen');
  } catch (error) {
    console.error(error);
    res.redirect('/diemrenluyen/them');
  }
});

// Form sửa
router.get('/sua/:id', async (req, res) => {
  const diemRL = await DiemRenLuyen.findById(req.params.id)
    .populate('sinhvien')
    .populate('hocKy');
  if (!diemRL) return res.redirect('/diemrenluyen');

  res.render('diemrenluyen_sua', { diemRL, title: 'Sửa điểm rèn luyện' });
});

// Xử lý sửa
router.post('/sua/:id', async (req, res) => {
  try {
    const { diem } = req.body;
    let xepLoai = '';

if (diem >= 90) xepLoai = 'Xuất sắc';
else if (diem >= 80) xepLoai = 'Tốt';
else if (diem >= 65) xepLoai = 'Khá';
else if (diem >= 50) xepLoai = 'Trung bình';
else xepLoai = 'Yếu';
    await DiemRenLuyen.findByIdAndUpdate(req.params.id, { diem, xepLoai });
    res.redirect('/diemrenluyen');
  } catch (error) {
    console.error(error);
    res.redirect(`/diemrenluyen/sua/${req.params.id}`);
  }
});

module.exports = router;
