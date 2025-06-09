const express = require('express');
const router = express.Router();
const Lop = require('../models/lop');
const Khoa = require('../models/khoa');
const Nganh = require('../models/nganh'); 
const KhoaHoc = require('../models/khoahoc');

// Danh sách lớp 
router.get('/', async (req, res) => {
  try {
    const keyword = req.query.q;
    let filter = {};

    if (keyword) {
      filter.tenLop = { $regex: keyword, $options: 'i' };
    }
  const lops = await Lop.find(filter)
    .populate('khoa')
    .populate('nganh')    
    .populate('khoaHoc')
    .exec();
  res.render('lop', {
      lops,
      title: 'Danh sách lớp',
      q: keyword
    });
  } catch (error) {
    console.error(error);
    res.redirect('/');
  }
});

// Form thêm lớp
router.get('/them', async (req, res) => {
  const khoas = await Khoa.find();
  const nganhs = await Nganh.find();   
  const khoahocs = await KhoaHoc.find();
  res.render('lop_them', { title: 'Thêm lớp', khoas, nganhs, khoahocs });
});

// Xử lý thêm lớp
router.post('/them', async (req, res) => {
  try {
    await Lop.create(req.body); 
    req.session.success = 'Thêm lớp thành công';
    res.redirect('/lop');
  } catch (error) {
    console.log(error);
    req.session.error = 'Lỗi khi thêm lớp';
    res.redirect('/lop/them');
  }
});

// Form sửa lớp
router.get('/sua/:id', async (req, res) => {
  try {
    const lop = await Lop.findById(req.params.id);
    const khoas = await Khoa.find();
    const nganhs = await Nganh.find();
    const khoahocs = await KhoaHoc.find();
    res.render('lop_sua', { title: 'Sửa lớp', lop, khoas, nganhs, khoahocs });
  } catch (error) {
    console.log(error);
    res.redirect('/lop');
  }
});

// Xử lý sửa lớp
router.post('/sua/:id', async (req, res) => {
  try {
    await Lop.findByIdAndUpdate(req.params.id, req.body);
    req.session.success = 'Cập nhật lớp thành công';
    res.redirect('/lop');
  } catch (error) {
    req.session.error = 'Lỗi khi cập nhật lớp';
    res.redirect('/lop/sua/' + req.params.id);
  }
});

// Xóa lớp
router.get('/xoa/:id', async (req, res) => {
  try {
    await Lop.findByIdAndDelete(req.params.id);
    req.session.success = 'Xóa lớp thành công';
  } catch (error) {
    req.session.error = 'Lỗi khi xóa lớp';
  }
  res.redirect('/lop');
});

module.exports = router;
