const express = require('express');
const bcrypt = require('bcrypt');
const TaiKhoan = require('../models/taikhoan'); // Cập nhật đường dẫn nếu khác

const router = express.Router();

router.get('/taoadmin', async (req, res) => {
  try {
    const tenDangNhap = 'admin';
    const matKhauGoc = '123';

    // Kiểm tra đã tồn tại
    const existing = await TaiKhoan.findOne({ TenDangNhap: tenDangNhap });
    if (existing) {
      return res.send('Tài khoản admin đã tồn tại.');
    }

    const hash = await bcrypt.hash(matKhauGoc, 10);

    const admin = new TaiKhoan({
      HoVaTen: 'Quản trị viên',
      Email: 'admin@example.com',
      TenDangNhap: tenDangNhap,
      MatKhau: hash,
      QuyenHan: 'admin',
      KichHoat: 1
    });

    await admin.save();
    res.send('Tạo tài khoản admin thành công!');
  } catch (err) {
    console.error(err);
    res.status(500).send('Lỗi khi tạo tài khoản admin');
  }
});

module.exports = router;
