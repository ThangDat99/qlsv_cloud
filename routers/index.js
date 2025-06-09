const express = require('express');
const router = express.Router();
const BaiViet = require('../models/baiviet');

router.get('/', async (req, res) => {
  try {
    // Lấy 3 bài viết mới nhất
    const baiVietMoiNhat = await BaiViet.find()
      .sort({ ngayDang: -1 })
      .limit(3);

    res.render('index', {
      title: 'Trang chủ',
      baiviet: baiVietMoiNhat
    });
  } catch (error) {
    console.error('Lỗi khi tải trang chủ:', error);
    res.status(500).send('Lỗi server');
  }
});

module.exports = router;
