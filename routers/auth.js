const express = require('express');
const router = express.Router();
const TaiKhoan = require('../models/taikhoan');
const bcrypt = require('bcrypt');

// Form đăng nhập
router.get('/dangnhap', (req, res) => {
  res.render('dangnhap', { title: 'Đăng nhập' });
});

// Xử lý đăng nhập
router.post('/dangnhap', async (req, res) => {
  const { TenDangNhap, MatKhau } = req.body;

  try {
    const tk = await TaiKhoan.findOne({ TenDangNhap });

    if (!tk) {
      req.session.error = 'Tài khoản không tồn tại';
      return res.redirect('/dangnhap');
    }

    const match = await bcrypt.compare(MatKhau, tk.MatKhau);
    if (!match) {
      req.session.error = 'Sai mật khẩu';
      return res.redirect('/dangnhap');
    }

    req.session.user = {
      id: tk._id,
      hoVaTen: tk.HoVaTen,
      tenDangNhap: tk.TenDangNhap,
      quyenHan: tk.QuyenHan
    };

    req.session.success = 'Đăng nhập thành công';
    if (tk.QuyenHan === 'admin') {
  return res.redirect('/');
} else {
  return res.redirect('/sinhvien/trangcanhan');
}
  } catch (err) {
    console.error('Lỗi đăng nhập:', err);
    req.session.error = 'Có lỗi xảy ra khi đăng nhập';
    return res.redirect('/dangnhap');
  }
});

// Đăng xuất
router.get('/dangxuat', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/dangnhap');
  });
});

module.exports = router;
