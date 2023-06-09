const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userLoginSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  userRol: {
    type: String,
    enum: ['gestorJudicial', 'abogado', 'fiscal', 'ciudadano', 'juez', 'auditor'],
    required: true
  }
});

module.exports = mongoose.model('User', userLoginSchema);
