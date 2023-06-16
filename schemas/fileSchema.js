const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const fileSchema = new Schema({
  nameFile: {
    type: String,
    required: false
  },
  typeFile: {
    type: String,
    required: false
  },
  linkFile: {
    type: String,
    required: false
  },
  caseNumber: {
    type: String,
    required: true
  },
  dateUpload: {
    type: Date,
    required: true
  }
});

module.exports = mongoose.model('File', fileSchema);
