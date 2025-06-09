const express = require('express');
const router = express.Router();
const BaiViet = require('../models/baiviet');
const { ensureAuthenticated } = require('../middlewares/auth')

const multer = require('multer');
const path = require('path');
const { title } = require('process');

// Cấu hình nơi lưu và tên file ảnh
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});

// Bộ lọc file: chỉ cho phép ảnh
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  if (extname && mimetype) return cb(null, true);
  cb(new Error('Chỉ cho phép file ảnh!'));
};

// Danh sách bài viết
router.get('/',ensureAuthenticated, async (req, res) => {
  try {
    const baiViets = await BaiViet.find().sort({ ngayDang: -1 });
    res.render('baiviet', { baiViets, title: 'Danh sách bài viết' });
  } catch (error) {
    console.error(error);
    res.redirect('/');
  }
});


// GET trang thêm bài viết
router.get('/them', ensureAuthenticated,(req, res) => {
  res.render('baiviet_them', { title: 'Thêm bài viết' });
});

// POST thêm bài viết
const upload = multer({ dest: 'public/uploads/' }); // hoặc cấu hình nâng cao

router.post('/them', upload.single('hinhAnh'), async (req, res) => {
  try {
    const { tieuDe, moTaNgan, noiDung } = req.body;
    const hinhAnh = req.file ? '/uploads/' + req.file.filename : null;

    const baiViet = new BaiViet({ tieuDe, moTaNgan, noiDung, hinhAnh });
    await baiViet.save();

    res.redirect('/baiviet');
  } catch (err) {
    console.error(err);
    res.redirect('/baiviet/them');
  }
});

// GET trang sửa bài viết
router.get('/sua/:id',ensureAuthenticated, async (req, res) => {
    const baiviet = await BaiViet.findById(req.params.id);
    res.render('baiviet_sua', { baiviet, title:"Sửa bài viết" });
});

// POST cập nhật bài viết
router.post('/sua/:id', upload.single('hinhAnh'), async (req, res) => {
    const data = {
        tieuDe: req.body.tieuDe,
        moTaNgan: req.body.moTaNgan,
        noiDung: req.body.noiDung
    };
    if (req.file) {
        data.hinhAnh = '/uploads/' + req.file.filename;
    }
    await BaiViet.findByIdAndUpdate(req.params.id, data);
    res.redirect('/baiviet');
});

// POST xoá bài viết
router.post('/xoa/:id', ensureAuthenticated,async (req, res) => {
    await BaiViet.findByIdAndDelete(req.params.id);
    res.redirect('/baiviet');
});

router.get('/:id', async (req, res) => {
    const baiViet = await BaiViet.findById(req.params.id);
    if (!baiViet) return res.status(404).send('Không tìm thấy bài viết');
    res.render('baiviet_chitiet', { baiViet , title:"Chi tiết bài viết"});
});

module.exports = router;
