const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const extensionsActiveSchema = new Schema({
  titleExtension: {
    type: String,
    required: true
  },
  userExtension: {
    type: String,
    required: true
  },
  datePaid: {
    type: Date,
    required: true
  },
  finalDatePaid: {
    type: Date,
    required: true
  }
});

module.exports = mongoose.model('ExtensionsActive', extensionsActiveSchema);