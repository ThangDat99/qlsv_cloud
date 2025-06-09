var express = require('express');
var app = express();
var mongoose = require('mongoose');
var session = require('express-session');
var path = require('path');

var indexRouter = require('./routers/index');
var authRouter = require('./routers/auth');
var sinhVienRouter = require('./routers/sinhvien');
var lopRouter = require('./routers/lop');
var khoaRouter = require('./routers/khoa');
var baiVietRouter = require('./routers/baiviet');
var taiKhoanRouter = require('./routers/taikhoan');
var monHocRouter = require('./routers/monhoc');
var hocKyRouter = require('./routers/hocky');
var khoaHocRouter = require('./routers/khoahoc');
var nganhRouter = require('./routers/nganh');
var drlRouter = require('./routers/diemrenluyen');
var diemRouter = require('./routers/diemmonhoc');

var uri = 'mongodb+srv://thangdat:0384331297@cluster0.so00w.mongodb.net/qlsv';
mongoose.connect(uri).catch(err => console.log(err));
const taoAdminRoute = require('./routers/taoadmin');
app.use('/', taoAdminRoute);
app.set('views', './views');
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', express.static(path.join(__dirname, 'public')));

app.use(session({
	name: 'qlsv_session',						// Tên session (tự chọn)
	secret: 'Samina mina eh eh',		// Khóa bảo vệ (tự chọn)
	resave: false,
	saveUninitialized: false,
	cookie: {
		maxAge: 30 * 24 * 60 * 60 * 1000// Hết hạn sau 30 ngày
	}
}));

app.use((req, res, next) => {
	// Chuyển biến session thành biến cục bộ
	res.locals.session = req.session;
	
	// Lấy thông báo (lỗi, thành công) của trang trước đó (nếu có)
	var err = req.session.error;
	var msg = req.session.success;
	
	// Xóa session sau khi đã truyền qua biến trung gian
	delete req.session.error;
	delete req.session.success;
	
	// Gán thông báo (lỗi, thành công) vào biến cục bộ
	res.locals.message = '';
	if (err) res.locals.message = '<span class="text-danger">' + err + '</span>';
	if (msg) res.locals.message = '<span class="text-success">' + msg + '</span>';
	res.locals.user = req.session.user || null;
	next();
});

app.use('/', indexRouter);
app.use('/', authRouter);
app.use('/taikhoan', taiKhoanRouter);
app.use('/baiviet', baiVietRouter);
app.use('/sinhvien', sinhVienRouter);
app.use('/lop', lopRouter);
app.use('/khoa', khoaRouter);
app.use('/monhoc', monHocRouter);
app.use('/hocky', hocKyRouter);
app.use('/khoahoc', khoaHocRouter);
app.use('/nganh', nganhRouter);
app.use('/diemrenluyen', drlRouter);
app.use('/diemmonhoc', diemRouter);
app.use('/uploads', express.static('uploads'));
app.listen(3000, () => {
	console.log('Server is running at http://127.0.0.1:3000');
});

