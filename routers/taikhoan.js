const express = require('express');
const router = express.Router();
const TaiKhoan = require('../models/taikhoan');
const bcrypt = require('bcrypt');
const { ensureAuthenticated, ensureAdmin } = require('../middlewares/auth'); // Giả sử bạn có middleware kiểm tra admin

// Danh sách tài khoản
router.get('/', ensureAuthenticated, ensureAdmin, async (req, res) => {
  try {
    const accounts = await TaiKhoan.find();
    res.render('taikhoan', { title: 'Quản lý tài khoản', accounts });
  } catch (error) {
    console.error(error);
    req.session.error = 'Lỗi khi lấy danh sách tài khoản';
    res.redirect('/');
  }
});

// Form thêm tài khoản
router.get('/them', ensureAuthenticated, ensureAdmin, (req, res) => {
  res.render('taikhoan_them', { title: 'Thêm tài khoản' });
});

// Xử lý thêm tài khoản
router.post('/them', ensureAuthenticated, ensureAdmin, async (req, res) => {
  try {
    const { HoVaTen, Email, TenDangNhap, MatKhau, QuyenHan, KichHoat } = req.body;
    
    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(MatKhau, 10);

    const newAccount = new TaiKhoan({
      HoVaTen,
      Email,
      TenDangNhap,
      MatKhau: hashedPassword,
      QuyenHan: QuyenHan || 'user',
      KichHoat: KichHoat ? 1 : 0
    });

    await newAccount.save();
    req.session.success = 'Thêm tài khoản thành công';
    res.redirect('/taikhoan');
  } catch (error) {
    console.error(error);
    req.session.error = 'Lỗi khi thêm tài khoản';
    res.redirect('/taikhoan/them');
  }
});

// Form sửa tài khoản
router.get('/sua/:id', ensureAuthenticated, ensureAdmin, async (req, res) => {
  try {
    const account = await TaiKhoan.findById(req.params.id);
    if (!account) {
      req.session.error = 'Không tìm thấy tài khoản';
      return res.redirect('/taikhoan');
    }
    res.render('taikhoan_sua', { title: 'Sửa tài khoản', account });
  } catch (error) {
    console.error(error);
    req.session.error = 'Lỗi khi lấy dữ liệu tài khoản';
    res.redirect('/taikhoan');
  }
});

// Xử lý sửa tài khoản
router.post('/sua/:id', ensureAuthenticated, ensureAdmin, async (req, res) => {
  try {
    const { HoVaTen, Email, TenDangNhap, MatKhau, MatKhauCu, QuyenHan, KichHoat } = req.body;
    const account = await TaiKhoan.findById(req.params.id);

    if (!account) {
      req.session.error = 'Không tìm thấy tài khoản';
      return res.redirect('/taikhoan');
    }

    const updateData = {
      HoVaTen,
      Email,
      TenDangNhap,
      QuyenHan: QuyenHan || 'user',
      KichHoat: KichHoat ? 1 : 0
    };

    // Nếu nhập mật khẩu mới, kiểm tra mật khẩu cũ trước khi cho đổi
    if (MatKhau && MatKhau.trim() !== '') {
      if (!MatKhauCu || !(await bcrypt.compare(MatKhauCu, account.MatKhau))) {
        req.session.error = 'Mật khẩu hiện tại không đúng. Không thể đổi mật khẩu.';
        return res.redirect(`/taikhoan/sua/${req.params.id}`);
      }

      updateData.MatKhau = await bcrypt.hash(MatKhau, 10);
    }

    await TaiKhoan.findByIdAndUpdate(req.params.id, updateData);

    req.session.success = 'Cập nhật tài khoản thành công';
    res.redirect('/taikhoan');
  } catch (error) {
    console.error(error);
    req.session.error = 'Lỗi khi cập nhật tài khoản';
    res.redirect(`/taikhoan/sua/${req.params.id}`);
  }
});

// Xóa tài khoản
router.get('/xoa/:id', ensureAuthenticated, ensureAdmin, async (req, res) => {
  try {
    await TaiKhoan.findByIdAndDelete(req.params.id);
    req.session.success = 'Xóa tài khoản thành công';
  } catch (error) {
    req.session.error = 'Lỗi khi xóa tài khoản';
  }
  res.redirect('/taikhoan');
});

module.exports = router;
