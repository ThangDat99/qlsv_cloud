const express = require('express');
const router = express.Router();
const MonHoc = require('../models/monhoc');
const Khoa = require('../models/khoa');

// Hiển thị danh sách môn học
router.get('/', async (req, res) => {
  try {
    const keyword = req.query.q;
    let filter = {};

    if (keyword) {
      filter.maMonHoc = { $regex: keyword, $options: 'i' }; 
    }

    const monHocs = await MonHoc.find(filter)
      .populate('khoa')
      .sort({ tenMonHoc: 1 });

    res.render('monhoc', {
      monHocs,
      title: 'Danh sách môn học',
      q: keyword 
    });
  } catch (error) {
    console.error(error);
    res.redirect('/');
  }
});


// Form thêm môn học
router.get('/them', async (req, res) => {
  const khoas = await Khoa.find();

  res.render('monhoc_them', {
    title: 'Thêm môn học',
    khoas,
  });
});


// Xử lý thêm môn học
router.post('/them', async (req, res) => {
  const { maMonHoc, tenMonHoc, tyLeGiuaKy, tyLeCuoiKy, soTinChi,khoa, hocKy} = req.body;

  const tyLeGK = parseFloat(tyLeGiuaKy) / 100;
  const tyLeCK = parseFloat(tyLeCuoiKy) / 100;

  if (tyLeGK + tyLeCK !== 1) {
    req.session.error = 'Tổng tỷ lệ phải bằng 100%';
    return res.redirect('/monhoc/them');
  }

    await MonHoc.create({
    maMonHoc,
    tenMonHoc,
    tyLeGiuaKy: tyLeGK,
    tyLeCuoiKy: tyLeCK,
    soTinChi,
    khoa, hocKy
  });
  res.redirect('/monhoc');
});


// Form sửa môn học
router.get('/sua/:id', async (req, res) => {
  try {
    const monHoc = await MonHoc.findById(req.params.id).populate('khoa');
    const khoas = await Khoa.find();

    // Mảng học kỳ để chọn (I đến VIII)
    const hockys = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'];

    res.render('monhoc_sua', {
      monHoc,
      soTinChi:"",
      khoas,
      hockys,
      title: 'Sửa môn học'
    });
  } catch (error) {
    console.error(error);
    res.redirect('/monhoc');
  }
});

// Xử lý cập nhật
router.post('/sua/:id', async (req, res) => {
  const { maMonHoc, tenMonHoc, tyLeGiuaKy, tyLeCuoiKy, soTinChi, khoa, hocKy } = req.body;

  const tyLeGK = parseFloat(tyLeGiuaKy) / 100;
  const tyLeCK = parseFloat(tyLeCuoiKy) / 100;

  if (tyLeGK + tyLeCK !== 1) {
    req.session.error = 'Tổng tỷ lệ giữa kỳ và cuối kỳ phải bằng 100%';
    return res.redirect(`/monhoc/sua/${req.params.id}`);
  }

  try {
    await MonHoc.findByIdAndUpdate(req.params.id, {
      maMonHoc,
      tenMonHoc,
      tyLeGiuaKy: tyLeGK,
      tyLeCuoiKy: tyLeCK,
      soTinChi,
      khoa,
      hocKy
    });

    req.session.success = 'Cập nhật môn học thành công';
    await updateDiemMonHocAfterMonHocAdded(maMonHoc);
    res.redirect('/monhoc');
  } catch (error) {
    console.error(error);
    res.redirect(`/monhoc/sua/${req.params.id}`);
  }
});



// Xóa môn học
router.post('/xoa/:id', async (req, res) => {
  try {
    await MonHoc.findByIdAndDelete(req.params.id);
    res.redirect('/monhoc');
  } catch (error) {
    console.error(error);
    res.redirect('/monhoc');
  }
});

module.exports = router;
