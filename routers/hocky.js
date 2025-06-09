const express = require('express');
const router = express.Router();
const HocKy = require('../models/hocky');
const KhoaHoc = require('../models/khoahoc');

// Danh sách học kỳ
router.get('/', async (req, res) => {
  const hocKys = await HocKy.find().populate('khoaHoc');
  res.render('hocky', { title: 'Danh sách học kỳ', hocKys });
});

// Form thêm học kỳ
router.get('/them', async (req, res) => {
  const khoahocs = await KhoaHoc.find();
  res.render('hocky_them', { title: 'Thêm học kỳ', khoahocs });
});

// Xử lý thêm học kỳ
router.post('/them', async (req, res) => {
  try {
    await HocKy.create(req.body);
    req.session.success = 'Thêm học kỳ thành công';
    res.redirect('/hocky');
  } catch (err) {
    console.log(err);
    req.session.error = 'Lỗi khi thêm học kỳ';
    res.redirect('/hocky/them');
  }
});

// Form sửa học kỳ
router.get('/sua/:id', async (req, res) => {
  const hocKy = await HocKy.findById(req.params.id);
  const khoahocs = await KhoaHoc.find();
  res.render('hocky_sua', { title: 'Sửa học kỳ', hocKy, khoahocs });
});

// Xử lý cập nhật
router.post('/sua/:id', async (req, res) => {
  try {
    await HocKy.findByIdAndUpdate(req.params.id, req.body);
    req.session.success = 'Cập nhật thành công';
    res.redirect('/hocky');
  } catch (err) {
    req.session.error = 'Lỗi cập nhật';
    res.redirect(`/hocky/sua/${req.params.id}`);
  }
});

module.exports = router;
