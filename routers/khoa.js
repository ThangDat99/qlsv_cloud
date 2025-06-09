const express = require('express');
const router = express.Router();
const Khoa = require('../models/khoa');

// Danh sách khoa
router.get('/', async (req, res) => {
  const khoas = await Khoa.find();
  res.render('khoa', { title: 'Danh sách khoa', khoas });
});

// Form thêm khoa
router.get('/them', (req, res) => {
  res.render('khoa_them', { title: 'Thêm khoa' });
});

// Xử lý thêm khoa
router.post('/them', async (req, res) => {
  try {
    await Khoa.create(req.body);
    req.session.success = 'Thêm khoa thành công';
    res.redirect('/khoa');
  } catch (error) {
    req.session.error = 'Lỗi khi thêm khoa';
    res.redirect('/khoa/them');
  }
});

// Form sửa khoa
router.get('/sua/:id', async (req, res) => {
  const khoa = await Khoa.findById(req.params.id);
  res.render('khoa_sua', { title: 'Sửa khoa', khoa });
});

// Xử lý sửa khoa
router.post('/sua/:id', async (req, res) => {
  try {
    await Khoa.findByIdAndUpdate(req.params.id, req.body);
    req.session.success = 'Cập nhật khoa thành công';
    res.redirect('/khoa');
  } catch (error) {
    req.session.error = 'Lỗi khi cập nhật khoa';
    res.redirect('/khoa/sua/' + req.params.id);
  }
});


// Xóa khoa
router.get('/xoa/:id', async (req, res) => {
  try {
    await Khoa.findByIdAndDelete(req.params.id);
    req.session.success = 'Xóa khoa thành công';
  } catch (error) {
    req.session.error = 'Lỗi khi xóa khoa';
  }
  res.redirect('/khoa');
});

module.exports = router;
