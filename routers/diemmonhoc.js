const express = require('express');
const router = express.Router();
const SinhVien = require('../models/sinhvien');
const HocKy = require('../models/hocky');
const MonHoc = require('../models/monhoc');
const DiemMonHoc = require('../models/diemmonhoc');

// Trang xem danh sách điểm môn học theo sinh viên và học kỳ
router.get('/', async (req, res) => {
  try {
    const { sinhvienId } = req.query;
    if (!sinhvienId) return res.redirect('/sinhvien');

    // Lấy sinh viên và populate khoá học
    const sinhvien = await SinhVien.findById(sinhvienId).populate('khoaHoc');
    if (!sinhvien || !sinhvien.khoaHoc) return res.redirect('/sinhvien');

    // Lấy tất cả học kỳ thuộc khoá học của sinh viên
    const hocKys = await HocKy.find({ khoaHoc: sinhvien.khoaHoc._id }).sort({ thuTu: 1 });

    // Lấy tất cả điểm môn học của sinh viên, populate học kỳ và môn học
    const allDiem = await DiemMonHoc.find({ sinhvien: sinhvien._id })
      .populate('hocKy')
      .populate('monHoc');

    // Nhóm điểm theo học kỳ
    const diemTheoHocKy = {};
    hocKys.forEach(hk => {
      diemTheoHocKy[hk._id] = {
        hocKy: hk,
        diem: allDiem.filter(d => d.hocKy._id.toString() === hk._id.toString())
      };
    });

    res.render('diemmonhoc', {
      sinhvien,
      diemTheoHocKy,
      title: 'Xem điểm môn học'
    });

  } catch (error) {
    console.error(error);
    res.redirect('/sinhvien');
  }
});

// Form thêm điểm môn học
router.get('/them', async (req, res) => {
  try {
    const { sinhvienId, hocKyId } = req.query;
    if (!sinhvienId || !hocKyId) return res.redirect('/sinhvien');

    // Lấy sinh viên và populate khoa
    const sinhvien = await SinhVien.findById(sinhvienId).populate('khoa');
    if (!sinhvien) return res.redirect('/sinhvien');

    // Lấy học kỳ
    const hocKy = await HocKy.findById(hocKyId);
    if (!hocKy) return res.redirect(`/diemmonhoc?sinhvienId=${sinhvienId}`);

    // Lấy khoaId của sinh viên để lọc môn học
    const khoaId = sinhvien.khoa ? sinhvien.khoa._id : null;
    if (!khoaId) return res.redirect(`/diemmonhoc?sinhvienId=${sinhvienId}`);

    // Lọc môn học theo khoa của sinh viên
    const monHocs = await MonHoc.find({ khoa: khoaId });

    res.render('diemmonhoc_them', {
      sinhvien,
      hocKy,
      monHocs,
      title: 'Thêm điểm môn học'
    });
  } catch (error) {
    console.error(error);
    res.redirect(`/diemmonhoc?sinhvienId=${req.query.sinhvienId}`);
  }
});

// Xử lý thêm điểm môn học
router.post('/them', async (req, res) => {
  try {
    const { sinhvien, hocKy, monHoc, diemQuaTrinh, diemThi } = req.body;
    const newDiem = new DiemMonHoc({
      sinhvien,
      hocKy,
      monHoc,
      diemQuaTrinh,
      diemThi
    });
    await newDiem.save();
    res.redirect(`/diemmonhoc?sinhvienId=${sinhvien}&hocKyId=${hocKy}`);
  } catch (error) {
    console.error(error);
    res.redirect(`/diemmonhoc/them?sinhvienId=${req.body.sinhvien}&hocKyId=${req.body.hocKy}`);
  }
});
router.get('/timmonhoc', async (req, res) => {
  try {
    const { keyword, khoaId } = req.query;
    if (!keyword || !khoaId) return res.json([]);

    const monHocs = await MonHoc.find({
      khoa: khoaId,
      maMonHoc: { $regex: keyword, $options: 'i' }
    }).limit(10);

    res.json(monHocs);
  } catch (error) {
    console.error(error);
    res.json([]);
  }
});

// Form sửa điểm môn học
// Lấy dữ liệu điểm môn học để sửa (GET)
router.get('/sua/:id', async (req, res) => {
  try {
    const diem = await DiemMonHoc.findById(req.params.id)
      .populate('sinhvien')
      .populate('hocKy')
      .populate('monHoc');

    if (!diem) return res.status(404).send('Không tìm thấy điểm môn học');

    // Nếu bạn muốn trả về JSON (API thuần) thì:
    // res.json(diem);

    // Hoặc trả về render form EJS (tuỳ bạn)
    res.render('diemmonhoc_sua', {
      diem,
      title: 'Sửa điểm môn học'
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Lỗi server');
  }
});

// Xử lý sửa điểm môn học (POST)
router.post('/sua/:id', async (req, res) => {
  try {
    const diem = await DiemMonHoc.findById(req.params.id);
    if (!diem) return res.redirect('/diemmonhoc');

    diem.diemQuaTrinh = Number(req.body.diemQuaTrinh);  // chuyển sang number
    diem.diemThi = Number(req.body.diemThi);            // chuyển sang number
    await diem.save();

    res.redirect(`/diemmonhoc?sinhvienId=${diem.sinhvien}&hocKyId=${diem.hocKy}`);
  } catch (error) {
    console.error(error);
    res.redirect(`/diemmonhoc/sua/${req.params.id}`);
  }
});

// Xử lý xóa điểm môn học
router.post('/xoa/:id', async (req, res) => {
  try {
    const { sinhvienId, hocKyId } = req.query;
    await DiemMonHoc.findByIdAndDelete(req.params.id);
    res.redirect(`/diemmonhoc?sinhvienId=${sinhvienId}&hocKyId=${hocKyId}`);
  } catch (error) {
    console.error(error);
    res.redirect('/sinhvien');
  }
});

module.exports = router;
