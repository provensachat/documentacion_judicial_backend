const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userDataSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  cellphone: {
    type: String,
    required: false
  },
  email: {
    type: String,
    required: false
  },
  entity: {
    type: String,
    required: false
  }
});

module.exports = mongoose.model('UserData', userDataSchema);
