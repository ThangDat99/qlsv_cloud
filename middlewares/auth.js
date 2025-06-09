function ensureAuthenticated(req, res, next) {
  if (req.session.user) {
    return next();
  }
  res.redirect('/dangnhap');
}

function ensureAdmin(req, res, next) {
  if (req.session.user && req.session.user.quyenHan === 'admin') {
    return next();
  }
  res.status(403).send('Bạn không có quyền truy cập');
}

module.exports = { ensureAuthenticated, ensureAdmin };
