const express = require('express');
const router = express.Router();
const SinhVien = require('../models/sinhvien');
const Lop = require('../models/lop');
const Khoa = require('../models/khoa');
const KhoaHoc = require('../models/khoahoc');
const Nganh = require('../models/nganh');
const TaiKhoan = require('../models/taikhoan');
const bcrypt = require('bcrypt');
const { ensureAuthenticated } = require('../middlewares/auth');
// Danh sách sinh viên
router.use(ensureAuthenticated);
router.get('/', async (req, res) => {
  try {
    const { khoaId, lopId, search } = req.query;

    const khoas = await Khoa.find();
    const lops = await Lop.find(khoaId ? { khoa: khoaId } : {});

    let query = {};

    if (lopId) {
      query.lop = lopId;
    } else if (khoaId) {
      const lopsInKhoa = await Lop.find({ khoa: khoaId }).select('_id');
      query.lop = { $in: lopsInKhoa.map(l => l._id) };
    }

    if (search) {
      query.$or = [
        { hoTen: new RegExp(search, 'i') },
        { maSV: new RegExp(search, 'i') }
      ];
    }

    const sinhviens = await SinhVien.find(query)
      .populate({
        path: 'lop',
        populate: [{ path: 'khoa' }, { path: 'khoaHoc' }]
      })
      .populate('khoa')
      .populate('nganh')
      .populate('khoaHoc')
      .exec();

    res.render('sinhvien', {
      title: 'Danh sách sinh viên',
      sinhviens,
      khoas,
      lops,
      selectedKhoaId: khoaId,
      selectedLopId: lopId,
      search
    });
  } catch (error) {
    console.error(error);
    req.session.error = 'Lỗi khi lấy danh sách sinh viên';
    res.redirect('/');
  }
});

// Form thêm sinh viên
router.get('/them', async (req, res) => {
  const lops = await Lop.find();
  const khoas = await Khoa.find();
  const khoahocs = await KhoaHoc.find();
  const nganhs = await Nganh.find();

  res.render('sinhvien_them', {
    title: 'Thêm sinh viên',
    lops,
    khoas,
    khoahocs,
    nganhs
  });
});

// Xử lý thêm sinh viên
router.post('/them', async (req, res) => {
  try {
    const { maSV, hoTen, gioiTinh, ngaySinh, diaChi, lop, khoa, nganh, email, sdt } = req.body;

    const lopObj = await Lop.findById(lop).populate('khoaHoc');

    const newSinhVien = new SinhVien({
      maSV,
      hoTen,
      gioiTinh,
      ngaySinh,
      diaChi,
      lop,
      khoa,
      nganh,
      khoaHoc: lopObj ? lopObj.khoaHoc._id : null,
      email,
      sdt
    });
    const hashedPassword = await bcrypt.hash(sdt, 10);
    await newSinhVien.save();
    const newAccount = new TaiKhoan({
      HoVaTen: hoTen,
      TenDangNhap: maSV,
      MatKhau: hashedPassword,
      QuyenHan: 'user', 
      KichHoat: 1,
      Email: email || '',
      HinhAnh: '', 
    });

    await newAccount.save();
    req.session.success = 'Thêm sinh viên thành công';
    res.redirect('/sinhvien');
  } catch (error) {
    console.error(error);
    req.session.error = 'Lỗi khi thêm sinh viên';
    res.redirect('/sinhvien/them');
  }
});

// Form sửa sinh viên
router.get('/sua/:id', async (req, res) => {
  try {
    const sinhvien = await SinhVien.findById(req.params.id)
      .populate('lop')
      .populate('khoaHoc') 
      .exec();

    const lops = await Lop.find();
    const khoas = await Khoa.find();
    const khoahocs = await KhoaHoc.find();
    const nganhs = await Nganh.find();

    res.render('sinhvien_sua', {
      title: 'Sửa sinh viên',
      sinhvien,
      lops,
      khoas,
      khoahocs,
      nganhs,
      khoaHocId: sinhvien.khoaHoc ? sinhvien.khoaHoc._id : null
    });
  } catch (error) {
    console.error(error);
    req.session.error = 'Lỗi khi lấy dữ liệu sinh viên';
    res.redirect('/sinhvien');
  }
});


// Xử lý sửa sinh viên
router.post('/sua/:id', async (req, res) => {
  try {
    const { maSV, hoTen, gioiTinh, ngaySinh, diaChi, lop, khoa, nganh, email, sdt, khoaHoc } = req.body;

    const updateData = {
      maSV,
      hoTen,
      gioiTinh,
      ngaySinh,
      diaChi,
      lop,
      khoa,
      nganh, 
      khoaHoc,
      email,
      sdt
    };

    await SinhVien.findByIdAndUpdate(req.params.id, updateData);
    req.session.success = 'Cập nhật sinh viên thành công';
    res.redirect('/sinhvien');
  } catch (error) {
    console.error(error);
    req.session.error = 'Lỗi khi cập nhật sinh viên';
    res.redirect(`/sinhvien/sua/${req.params.id}`);
  }
});

// Trang cá nhân của sinh viên
router.get('/trangcanhan', async (req, res) => {
  if (!req.session.user || req.session.user.quyenHan !== 'user') {
    req.session.error = 'Bạn không có quyền truy cập';
    return res.redirect('/');
  }

  try {
    const mssv = req.session.user.tenDangNhap; // tên đăng nhập chính là MaSV
    const sinhvien = await SinhVien.findOne({ MaSV: mssv }).populate('MaLop');

    if (!sinhvien) {
      req.session.error = 'Không tìm thấy sinh viên';
      return res.redirect('/');
    }

    res.render('sinhvien_trangcanhan', {
      title: 'Trang cá nhân sinh viên',
      sinhvien
    });
  } catch (err) {
    console.error('Lỗi trang cá nhân sinh viên:', err);
    req.session.error = 'Có lỗi xảy ra';
    res.redirect('/');
  }
});

// Chi tiết sinh viên
router.get('/chitiet/:id', async (req, res) => {
  try {
    const sinhvien = await SinhVien.findById(req.params.id)
      .populate({
        path: 'lop',
        populate: [
          { path: 'khoa' },
          { path: 'khoaHoc' }
        ]
      })
      .populate('nganh') 
      .exec();

    if (!sinhvien) {
      req.session.error = 'Không tìm thấy sinh viên';
      return res.redirect('/sinhvien');
    }

    res.render('chitiet_sinhvien', {
      sinhvien,
      title: 'Chi tiết sinh viên'
    });
  } catch (error) {
    console.error('Lỗi khi lấy chi tiết sinh viên:', error.message);
    req.session.error = 'Có lỗi xảy ra';
    res.redirect('/sinhvien');
  }
});

// Xóa sinh viên
router.get('/xoa/:id', async (req, res) => {
  try {
    const sv = await SinhVien.findByIdAndDelete(req.params.id);
    if (sv) {
      // Tên đăng nhập là mã sinh viên
      await TaiKhoan.findOneAndDelete({ TenDangNhap: sv.MaSV });
    }
    req.session.success = 'Đã xóa sinh viên và tài khoản liên quan';
    res.redirect('/sinhvien');
  } catch (err) {
    console.error('Lỗi xóa sinh viên:', err);
    req.session.error = 'Lỗi khi xóa sinh viên';
    res.redirect('/sinhvien');
  }
});

module.exports = router;
