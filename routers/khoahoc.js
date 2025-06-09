const express = require('express');
const router = express.Router();
const KhoaHoc = require('../models/khoahoc');

// Danh sách
router.get('/', async (req, res) => {
    const khoahocs = await KhoaHoc.find();
    res.render('khoahoc', { title:'Danh sách khoá học' ,khoahocs });
});

// Form thêm
router.get('/them', (req, res) => {
    res.render('khoahoc_them', { title:'Thêm khoá học'});
});

// Xử lý thêm
router.post('/them', async (req, res) => {
    await KhoaHoc.create(req.body);
    res.redirect('/khoahoc');
});

// Form sửa
router.get('/sua/:id', async (req, res) => {
    const khoahoc = await KhoaHoc.findById(req.params.id);
    res.render('khoahoc_sua', { title:'Sửa khoá học', khoahoc });
});

// Xử lý sửa
router.post('/sua/:id', async (req, res) => {
    await KhoaHoc.findByIdAndUpdate(req.params.id, req.body);
    res.redirect('/khoahoc');
});

// Xóa
router.post('/xoa/:id', async (req, res) => {
    await KhoaHoc.findByIdAndDelete(req.params.id);
    res.redirect('/khoahoc');
});

module.exports = router;
