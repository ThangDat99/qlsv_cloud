const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const nganhSchema = new Schema({
  tenNganh: { type: String, required: true },
  maNganh: { type: String, required: true, unique: true },
  khoa: { type: Schema.Types.ObjectId, ref: 'Khoa', required: true }
}, {
});

module.exports = mongoose.model('Nganh', nganhSchema);
