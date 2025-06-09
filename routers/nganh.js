const express = require('express');
const router = express.Router();
const Nganh = require('../models/nganh');
const Khoa = require('../models/khoa');

// Danh sách ngành
router.get('/', async (req, res) => {
  const nganhs = await Nganh.find().populate('khoa');
  res.render('nganh', { title: 'Danh sách ngành', nganhs });
});

// Form thêm ngành
router.get('/them', async (req, res) => {
  const khoas = await Khoa.find();
  res.render('nganh_them', { title: 'Thêm ngành', khoas });
});

// Xử lý thêm ngành
router.post('/them', async (req, res) => {
  try {
    console.log(req.body); // Debug
    await Nganh.create(req.body);
    req.session.success = 'Thêm ngành thành công';
    res.redirect('/nganh');
  } catch (error) {
    console.error(error); // In ra lỗi để kiểm tra
    req.session.error = 'Lỗi khi thêm ngành';
    res.redirect('/nganh/them');
  }
});


// Form sửa ngành
router.get('/sua/:id', async (req, res) => {
  const nganh = await Nganh.findById(req.params.id);
  const khoas = await Khoa.find();
  res.render('nganh_sua', { title: 'Sửa ngành', nganh, khoas });
});

// Xử lý sửa ngành
router.post('/sua/:id', async (req, res) => {
  try {
    await Nganh.findByIdAndUpdate(req.params.id, req.body);
    req.session.success = 'Cập nhật ngành thành công';
    res.redirect('/nganh');
  } catch (error) {
    req.session.error = 'Lỗi khi cập nhật ngành';
    res.redirect('/nganh/sua/' + req.params.id);
  }
});

// Xóa ngành
router.get('/xoa/:id', async (req, res) => {
  try {
    await Nganh.findByIdAndDelete(req.params.id);
    req.session.success = 'Xóa ngành thành công';
  } catch (error) {
    req.session.error = 'Lỗi khi xóa ngành';
  }
  res.redirect('/nganh');
});

module.exports = router;
